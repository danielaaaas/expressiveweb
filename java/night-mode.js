(function initNightMode() {
  const floorPlanContainer = document.querySelector('.floor-plan-container');
  const floorSvg = floorPlanContainer ? floorPlanContainer.querySelector('svg') : null;
  const rooms = floorSvg ? Array.from(floorSvg.querySelectorAll('.room')) : [];
  if (!floorPlanContainer || !floorSvg || rooms.length === 0) return;

  const EST_TIMEZONE = 'America/New_York';
  const NIGHT_START_HOUR_EST = 19; // 7pm EST/EDT
  const NIGHT_END_HOUR_EST = 6; // 6am EST/EDT
  const LIGHT_STORAGE_KEY = 'uht-lit-rooms';
  const NIGHT_OVERRIDE_KEY = 'uht-night-override';
  const PAGE_KEY = window.location.pathname;

  /**
   * Lighting preset only — not a gradient picker.
   * - `auto`: America/New_York time drives the full ambient path (dusk → night → dawn, smooth fades).
   * - `night` / `day`: two manual snaps (full night with flashlight vs clear day). All in-between
   *   sky states exist only while you stay on auto and let the clock run.
   */

  /** Smooth overlay darkness by EST wall clock (fractional hours; used in auto + for visuals when forced night). */
  const AMBIENT_DAWN_START = 5;
  const AMBIENT_DAWN_END = 7;
  const AMBIENT_DAY_START = 7;
  const AMBIENT_DAY_END = 17;
  const AMBIENT_DUSK_START = 17;
  const AMBIENT_DUSK_END = 19;
  const AMBIENT_DEEPEN_END = 21;
  /** ~7pm plateau (before deepen): darker so entering night mode already feels constrained. */
  const AMBIENT_ALPHA_SEVEN_PM = 0.56;
  /** Full night (auto deep hours + forced night): darkest overlay; always above dusk plateaus. */
  const AMBIENT_ALPHA_MAX = 1;
  /** When `nightActive` (flashlight window): never let the veil go too light—navigation needs the beam. */
  const NIGHT_ACTIVE_VEIL_MUL = 1.1;
  const NIGHT_ACTIVE_VEIL_MIN = 0.88;

  let maskRaf = 0;
  let overlayMaskCanvas = null;
  let overlayMaskCtx = null;

  let nightOverride = readNightOverride();
  ensureOverlayMaskCanvas();
  const overlay = createNightOverlay();
  const clock = createClockWidget();
  const lampLayer = createLampLayer();

  const LAMP_SCALE = 2.1;
  const LAMP_ANCHOR = { x: 8, y: 16 };
  /** Local sprite bounds (pre-scale), from pixel rects in createLamp */
  const LAMP_LOCAL_BOUNDS = { minX: 3, maxX: 12, minY: 0, maxY: 16 };
  const LAMP_HIT_HALF_W = 22;
  const LAMP_HIT_HALF_H_UP = 32;
  const LAMP_HIT_HALF_H_DOWN = 16;

  const litRoomsByPage = readLitRooms();
  const litSet = new Set(litRoomsByPage[PAGE_KEY] || []);

  let nightActive = false;

  mountLamps();

  window.setInterval(() => {
    refreshClock();
  }, 1000);
  window.setInterval(() => {
    evaluateNightState();
  }, 30000);

  refreshClock();
  evaluateNightState();

  function onPointerFlashlight(event) {
    syncFlashlightCoords(event.clientX, event.clientY);
    requestNightMaskUpdate();
  }
  document.addEventListener('mousemove', onPointerFlashlight, { passive: true });
  window.addEventListener('pointermove', onPointerFlashlight, { passive: true, capture: true });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      syncOverlayMaskCanvasSize();
      requestNightMaskUpdate();
    }, 120);
  });

  document.addEventListener('touchmove', (event) => {
    if (!event.touches.length) return;
    const firstTouch = event.touches[0];
    onPointerFlashlight(firstTouch);
  }, { passive: true });

  function syncFlashlightCoords(clientX, clientY) {
    const x = `${Math.round(clientX)}px`;
    const y = `${Math.round(clientY)}px`;
    overlay.style.setProperty('--flashlight-x', x);
    overlay.style.setProperty('--flashlight-y', y);
    document.documentElement.style.setProperty('--flashlight-x', x);
    document.documentElement.style.setProperty('--flashlight-y', y);
  }

  function createNightOverlay() {
    const el = document.createElement('div');
    el.className = 'night-overlay';
    const cx = window.innerWidth * 0.5;
    const cy = window.innerHeight * 0.45;
    el.style.setProperty('--flashlight-x', `${cx}px`);
    el.style.setProperty('--flashlight-y', `${cy}px`);
    document.documentElement.style.setProperty('--flashlight-x', `${cx}px`);
    document.documentElement.style.setProperty('--flashlight-y', `${cy}px`);
    document.body.appendChild(el);
    return el;
  }

  /** Off-screen canvas → PNG for lit-room holes only (intersected with CSS radial flashlight mask). */
  function ensureOverlayMaskCanvas() {
    if (overlayMaskCanvas) return;
    overlayMaskCanvas = document.createElement('canvas');
    overlayMaskCanvas.setAttribute('aria-hidden', 'true');
    overlayMaskCtx = overlayMaskCanvas.getContext('2d', { alpha: true });
  }

  function syncOverlayMaskCanvasSize() {
    if (!overlayMaskCanvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (overlayMaskCanvas.width !== w || overlayMaskCanvas.height !== h) {
      overlayMaskCanvas.width = w;
      overlayMaskCanvas.height = h;
    }
  }

  function requestNightMaskUpdate() {
    if (!nightActive) return;
    if (maskRaf) window.cancelAnimationFrame(maskRaf);
    maskRaf = window.requestAnimationFrame(() => {
      maskRaf = 0;
      updateNightOverlayMask();
    });
  }

  function parsePxVar(value, fallback) {
    if (!value || typeof value !== 'string') return fallback;
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : fallback;
  }

  /**
   * Flashlight: radius of the radial cutout in the night overlay mask (CSS pixels).
   * Lower = smaller pool of light around the cursor. Tweak here only.
   */
  const FLASHLIGHT_RADIUS_PX = 140;

  function rectsOverlap2D(ax, ay, aw, ah, bx, by, bw, bh) {
    return bx < ax + aw && bx + bw > ax && by < ay + ah && by + bh > ay;
  }

  /** Return up to four axis-aligned pieces of rectangle A minus rectangle B (SVG user units). */
  function subtractAxisAlignedRects(ax, ay, aw, ah, bx, by, bw, bh) {
    const ar = ax + aw;
    const ab = ay + ah;
    const br = bx + bw;
    const bb = by + bh;
    const out = [];
    if (!rectsOverlap2D(ax, ay, aw, ah, bx, by, bw, bh)) {
      return [{ x: ax, y: ay, width: aw, height: ah }];
    }
    if (by > ay) {
      const h = Math.min(by, ab) - ay;
      if (h > 0) out.push({ x: ax, y: ay, width: aw, height: h });
    }
    if (bb < ab) {
      const y0 = Math.max(bb, ay);
      const h = ab - y0;
      if (h > 0) out.push({ x: ax, y: y0, width: aw, height: h });
    }
    const midY0 = Math.max(ay, by);
    const midY1 = Math.min(ab, bb);
    if (midY1 > midY0) {
      if (bx > ax) {
        const w = bx - ax;
        if (w > 0) out.push({ x: ax, y: midY0, width: w, height: midY1 - midY0 });
      }
      if (br < ar) {
        const w = ar - br;
        if (w > 0) out.push({ x: br, y: midY0, width: w, height: midY1 - midY0 });
      }
    }
    return out.filter((r) => r.width > 0.5 && r.height > 0.5);
  }

  function subtractRectFromAllPieces(pieces, bx, by, bw, bh) {
    return pieces.flatMap((p) =>
      subtractAxisAlignedRects(p.x, p.y, p.width, p.height, bx, by, bw, bh)
    );
  }

  /**
   * #living-room is an L-shaped <path>; its axis bbox covers kitchen, hallways, closets, etc.
   * Build mask holes as that bbox minus every other .room bbox (same SVG user space), then map to screen.
   */
  function clientRectsForLitPathLivingRoom(livingEl) {
    const lb = livingEl.getBBox();
    let pieces = [{ x: lb.x, y: lb.y, width: lb.width, height: lb.height }];
    rooms.forEach((other) => {
      if (other.id === 'living-room') return;
      const ob = other.getBBox();
      if (!rectsOverlap2D(lb.x, lb.y, lb.width, lb.height, ob.x, ob.y, ob.width, ob.height)) return;
      pieces = subtractRectFromAllPieces(pieces, ob.x, ob.y, ob.width, ob.height);
    });
    return pieces
      .filter((p) => p.width > 1.5 && p.height > 1.5)
      .map((p) => svgUserRectToClientRect(p.x, p.y, p.width, p.height))
      .filter(Boolean);
  }

  /** Map an axis-aligned rect in floor SVG user space to a viewport AABB (for mask holes). */
  function svgUserRectToClientRect(x, y, rw, rh) {
    const ctm = floorSvg.getScreenCTM();
    if (!ctm) return null;
    const corners = [
      { x, y },
      { x: x + rw, y },
      { x, y: y + rh },
      { x: x + rw, y: y + rh }
    ];
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    corners.forEach((c) => {
      const pt = floorSvg.createSVGPoint();
      pt.x = c.x;
      pt.y = c.y;
      const p = pt.matrixTransform(ctm);
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
    return { left: minX, top: minY, width: maxX - minX, height: maxY - minY };
  }

  function appendCanvasMaskRoomHole(ctx, clientRect, opts) {
    if (!clientRect || clientRect.width < 2 || clientRect.height < 2) return;
    const expand = opts && opts.expandPx ? opts.expandPx : 0;
    ctx.fillRect(
      clientRect.left - expand,
      clientRect.top - expand,
      clientRect.width + 2 * expand,
      clientRect.height + 2 * expand
    );
  }

  function updateNightOverlayMask() {
    if (!nightActive) return;
    ensureOverlayMaskCanvas();
    syncOverlayMaskCanvasSize();
    const ctx = overlayMaskCtx;
    if (!ctx || !overlayMaskCanvas) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const fx = parsePxVar(overlay.style.getPropertyValue('--flashlight-x'), w * 0.5);
    const fy = parsePxVar(overlay.style.getPropertyValue('--flashlight-y'), h * 0.5);
    const fr = FLASHLIGHT_RADIUS_PX;

    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = 'rgba(0,0,0,1)';
    rooms.forEach((roomEl) => {
      const id = roomEl.id;
      if (!id || !litSet.has(id)) return;

      if (id === 'living-room' && roomEl instanceof SVGPathElement) {
        const holes = clientRectsForLitPathLivingRoom(roomEl);
        if (holes.length > 0) {
          holes.forEach((cr) => appendCanvasMaskRoomHole(ctx, cr, { expandPx: 0.75 }));
          return;
        }
      }

      const r = roomEl.getBoundingClientRect();
      appendCanvasMaskRoomHole(ctx, r);
    });
    ctx.restore();

    const roomPngUrl = overlayMaskCanvas.toDataURL('image/png');
    bindOverlayFlashlightAndRoomMask(roomPngUrl, fx, fy, fr);
  }

  /**
   * Flashlight = CSS radial-gradient (alpha mask; follows pointer reliably).
   * Lit rooms = second mask layer (canvas PNG); intersect = holes from either layer.
   */
  function bindOverlayFlashlightAndRoomMask(roomPngDataUrl, fx, fy, fr) {
    if (!nightActive) return;
    /* Opaque *white* = keep the dim veil; transparent = hole. Black stops confuse luminance + alpha masking. */
    const grad = `radial-gradient(circle ${fr}px at ${fx}px ${fy}px, transparent 0%, transparent 38%, rgba(255,255,255,0.92) 72%, white 100%)`;

    let hasLitRoom = false;
    for (let ri = 0; ri < rooms.length; ri++) {
      const id = rooms[ri].id;
      if (id && litSet.has(id)) {
        hasLitRoom = true;
        break;
      }
    }

    overlay.style.mask = 'none';
    overlay.style.webkitMask = 'none';

    if (!hasLitRoom) {
      overlay.style.maskImage = grad;
      overlay.style.webkitMaskImage = grad;
      overlay.style.maskRepeat = 'no-repeat';
      overlay.style.webkitMaskRepeat = 'no-repeat';
      overlay.style.maskSize = '100% 100%';
      overlay.style.webkitMaskSize = '100% 100%';
      overlay.style.maskPosition = '0 0';
      overlay.style.webkitMaskPosition = '0 0';
      overlay.style.maskMode = 'alpha';
      overlay.style.webkitMaskMode = 'alpha';
      overlay.style.maskComposite = '';
      overlay.style.webkitMaskComposite = '';
      return;
    }

    const roomUrl = `url("${roomPngDataUrl.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}")`;
    const layers = `${grad}, ${roomUrl}`;
    overlay.style.maskImage = layers;
    overlay.style.webkitMaskImage = layers;
    overlay.style.maskRepeat = 'no-repeat, no-repeat';
    overlay.style.webkitMaskRepeat = 'no-repeat, no-repeat';
    overlay.style.maskSize = '100% 100%, 100% 100%';
    overlay.style.webkitMaskSize = '100% 100%, 100% 100%';
    overlay.style.maskPosition = '0 0, 0 0';
    overlay.style.webkitMaskPosition = '0 0, 0 0';
    overlay.style.maskMode = 'alpha, alpha';
    overlay.style.webkitMaskMode = 'alpha, alpha';
    overlay.style.maskComposite = 'intersect';
    overlay.style.webkitMaskComposite = '';
  }

  function clearOverlaySvgMask() {
    overlay.style.mask = 'none';
    overlay.style.webkitMask = 'none';
    overlay.style.maskImage = 'none';
    overlay.style.webkitMaskImage = 'none';
    overlay.style.maskMode = '';
    overlay.style.webkitMaskMode = '';
    overlay.style.maskComposite = '';
    overlay.style.webkitMaskComposite = '';
  }

  function createClockWidget() {
    const wrapper = document.createElement('aside');
    wrapper.className = 'grandfather-clock';
    wrapper.innerHTML = `
      <div class="grandfather-clock-upper">
        <div class="clock-sprite" aria-hidden="true">
          <div class="clock-top"></div>
          <div class="clock-body">
            <div class="clock-face">
              <div class="clock-hand clock-hand-hour"></div>
              <div class="clock-hand clock-hand-minute"></div>
              <div class="clock-hand clock-hand-second" aria-hidden="true"></div>
              <div class="clock-face-dot"></div>
            </div>
            <div class="clock-window">
              <div class="clock-pendulum"></div>
            </div>
          </div>
        </div>
        <span class="clock-time" aria-live="polite">--:-- -- EST</span>
      </div>
      <button class="light-switch" type="button" aria-label="Sky lighting: automatic Eastern Time with smooth transitions, or simple presets night and day. Click to cycle auto, night, day.">
        <span class="light-switch-text">auto</span>
      </button>
    `;
    document.body.appendChild(wrapper);
    const switchButton = wrapper.querySelector('.light-switch');
    if (switchButton) {
      let suppressNextClick = false;
      switchButton.addEventListener('click', () => {
        if (suppressNextClick) {
          suppressNextClick = false;
          return;
        }
        cycleNightOverride();
      });
      // iOS Safari: fire from touch; suppress the synthetic click that follows
      switchButton.addEventListener(
        'touchend',
        (e) => {
          e.preventDefault();
          cycleNightOverride();
          suppressNextClick = true;
          window.setTimeout(() => {
            suppressNextClick = false;
          }, 450);
        },
        { passive: false }
      );
      applyOverrideToSwitch(switchButton);
    }
    return wrapper;
  }

  function createLampLayer() {
    const NS = 'http://www.w3.org/2000/svg';
    const layer = document.createElementNS(NS, 'g');
    layer.setAttribute('id', 'room-lamp-layer');
    floorSvg.appendChild(layer);
    return layer;
  }

  function mountLamps() {
    rooms.forEach((roomEl) => {
      const roomId = roomEl.id;
      if (!roomId) return;

      const position = pickLampPosition(roomEl);
      const lampGroup = createLamp(roomId, position.x, position.y);

      if (litSet.has(roomId)) {
        lampGroup.classList.add('room-lit');
      }

      lampLayer.appendChild(lampGroup);
    });
    syncRoomIllumination();
  }

  function pickLampPosition(roomEl) {
    const roomId = roomEl.id;
    const box = roomEl.getBBox();
    const margin = lampEdgeMargin();
    const inset = Math.max(margin, Math.min(32, Math.min(box.width, box.height) * 0.22));
    const minX = box.x + inset;
    const maxX = box.x + box.width - inset;
    const minY = box.y + inset;
    const maxY = box.y + box.height - inset;

    const candidates = [
      [0.25, 0.25],
      [0.75, 0.25],
      [0.25, 0.75],
      [0.75, 0.75],
      [0.5, 0.5],
      [0.35, 0.5],
      [0.65, 0.5],
      [0.5, 0.35],
      [0.5, 0.65]
    ];

    for (const [rx, ry] of candidates) {
      const x = clamp(box.x + box.width * rx, minX, maxX);
      const y = clamp(box.y + box.height * ry, minY, maxY);
      if (isPointInsideRoom(roomEl, x, y) && lampPlacementFullyInsideRoom(roomEl, x, y)) {
        return applyPerRoomNudge(roomId, box, x, y, minX, maxX, minY, maxY);
      }
    }

    const cx = clamp(box.x + box.width * 0.5, minX, maxX);
    const cy = clamp(box.y + box.height * 0.5, minY, maxY);
    if (lampPlacementFullyInsideRoom(roomEl, cx, cy)) {
      return applyPerRoomNudge(roomId, box, cx, cy, minX, maxX, minY, maxY);
    }

    return applyPerRoomNudge(roomId, box, cx, cy, minX, maxX, minY, maxY);
  }

  function applyPerRoomNudge(roomId, box, x, y, minX, maxX, minY, maxY) {
    // Keep apartment one front hallway lamp further away from the doorway.
    const isApartmentOne = !PAGE_KEY.includes('/aptdos/');
    if (isApartmentOne && roomId === 'front-hallway') {
      y = y + Math.min(18, box.height * 0.2);
    }

    return { x: clamp(x, minX, maxX), y: clamp(y, minY, maxY) };
  }

  function isPointInsideRoom(roomEl, x, y) {
    if (typeof roomEl.isPointInFill === 'function') {
      const point = floorSvg.createSVGPoint();
      point.x = x;
      point.y = y;
      try {
        return roomEl.isPointInFill(point);
      } catch (_error) {
        return true;
      }
    }

    const box = roomEl.getBBox();
    return x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lampEdgeMargin() {
    const s = LAMP_SCALE;
    const w =
      Math.max(
        Math.abs(LAMP_LOCAL_BOUNDS.minX - LAMP_ANCHOR.x),
        Math.abs(LAMP_LOCAL_BOUNDS.maxX - LAMP_ANCHOR.x)
      ) *
        s +
      LAMP_HIT_HALF_W;
    const h =
      Math.max(
        Math.abs(LAMP_LOCAL_BOUNDS.minY - LAMP_ANCHOR.y),
        Math.abs(LAMP_LOCAL_BOUNDS.maxY - LAMP_ANCHOR.y)
      ) *
        s +
      LAMP_HIT_HALF_H_UP;
    return Math.ceil(Math.max(w, h) + 6);
  }

  function localToWorld(ax, ay, lx, ly) {
    return {
      x: ax + (lx - LAMP_ANCHOR.x) * LAMP_SCALE,
      y: ay + (ly - LAMP_ANCHOR.y) * LAMP_SCALE
    };
  }

  function lampPlacementFullyInsideRoom(roomEl, ax, ay) {
    const corners = [
      localToWorld(ax, ay, LAMP_LOCAL_BOUNDS.minX, LAMP_LOCAL_BOUNDS.minY),
      localToWorld(ax, ay, LAMP_LOCAL_BOUNDS.maxX, LAMP_LOCAL_BOUNDS.minY),
      localToWorld(ax, ay, LAMP_LOCAL_BOUNDS.minX, LAMP_LOCAL_BOUNDS.maxY),
      localToWorld(ax, ay, LAMP_LOCAL_BOUNDS.maxX, LAMP_LOCAL_BOUNDS.maxY),
      { x: ax - LAMP_HIT_HALF_W, y: ay - LAMP_HIT_HALF_H_UP },
      { x: ax + LAMP_HIT_HALF_W, y: ay - LAMP_HIT_HALF_H_UP },
      { x: ax - LAMP_HIT_HALF_W, y: ay + LAMP_HIT_HALF_H_DOWN },
      { x: ax + LAMP_HIT_HALF_W, y: ay + LAMP_HIT_HALF_H_DOWN }
    ];
    return corners.every((p) => isPointInsideRoom(roomEl, p.x, p.y));
  }

  function createLamp(roomId, x, y) {
    const NS = 'http://www.w3.org/2000/svg';
    const group = document.createElementNS(NS, 'g');
    group.classList.add('room-lamp');
    group.setAttribute('tabindex', '0');
    group.setAttribute('role', 'button');
    group.setAttribute('aria-label', `Toggle lamp for ${roomId.replace(/-/g, ' ')}`);
    group.dataset.roomId = roomId;

    const hit = document.createElementNS(NS, 'rect');
    hit.setAttribute('x', `${x - LAMP_HIT_HALF_W}`);
    hit.setAttribute('y', `${y - LAMP_HIT_HALF_H_UP}`);
    hit.setAttribute('width', `${LAMP_HIT_HALF_W * 2}`);
    hit.setAttribute('height', `${LAMP_HIT_HALF_H_UP + LAMP_HIT_HALF_H_DOWN}`);
    hit.setAttribute('class', 'room-lamp-hit');

    const light = document.createElementNS(NS, 'circle');
    light.setAttribute('cx', `${x}`);
    light.setAttribute('cy', `${y - 12}`);
    light.setAttribute('r', '34');
    light.setAttribute('class', 'room-light');
    light.setAttribute('fill', '#ffd98f');

    const sprite = document.createElementNS(NS, 'g');
    // Anchor bottom-center of sprite at (x, y): scale then offset local origin
    sprite.setAttribute(
      'transform',
      `translate(${x},${y}) scale(${LAMP_SCALE}) translate(${-LAMP_ANCHOR.x},${-LAMP_ANCHOR.y})`
    );
    sprite.setAttribute('shape-rendering', 'crispEdges');

    // Pixel lamp sprite (16x20-ish footprint)
    appendPixel(sprite, 5, 0, 6, 1, 'room-lamp-outline');
    appendPixel(sprite, 4, 1, 8, 1, 'room-lamp-outline');
    appendPixel(sprite, 3, 2, 10, 1, 'room-lamp-outline');
    appendPixel(sprite, 3, 3, 10, 3, 'room-lamp-shade');
    appendPixel(sprite, 4, 6, 8, 1, 'room-lamp-shade-mid');
    appendPixel(sprite, 6, 7, 4, 2, 'room-lamp-bulb');
    appendPixel(sprite, 7, 9, 2, 5, 'room-lamp-base');
    appendPixel(sprite, 5, 14, 6, 1, 'room-lamp-base');
    appendPixel(sprite, 4, 15, 8, 1, 'room-lamp-outline');

    group.append(hit, light, sprite);

    group.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleRoomLamp(roomId, group);
    });

    group.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      event.stopPropagation();
      toggleRoomLamp(roomId, group);
    });

    return group;
  }

  function appendPixel(parent, x, y, width, height, className) {
    const NS = 'http://www.w3.org/2000/svg';
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('x', String(x));
    rect.setAttribute('y', String(y));
    rect.setAttribute('width', String(width));
    rect.setAttribute('height', String(height));
    rect.setAttribute('class', className);
    parent.appendChild(rect);
  }

  function toggleRoomLamp(roomId, lampGroup) {
    const isLit = lampGroup.classList.toggle('room-lit');
    if (isLit) {
      litSet.add(roomId);
    } else {
      litSet.delete(roomId);
    }
    persistLitRooms();
    setRoomNightLit(roomId, isLit && nightActive);
    requestNightMaskUpdate();
  }

  /** When night mode is on, lit lamps illuminate their whole room shape. */
  function setRoomNightLit(roomId, on) {
    const roomEl = document.getElementById(roomId);
    if (!roomEl || !roomEl.classList.contains('room')) return;
    roomEl.classList.toggle('room-night-lit', Boolean(on));
  }

  function syncRoomIllumination() {
    rooms.forEach((roomEl) => {
      const id = roomEl.id;
      if (!id) return;
      roomEl.classList.toggle('room-night-lit', Boolean(nightActive && litSet.has(id)));
    });
    requestNightMaskUpdate();
  }

  function clamp01(t) {
    return Math.max(0, Math.min(1, t));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function lerpRgb(a, b, t) {
    return [
      Math.round(lerp(a[0], b[0], t)),
      Math.round(lerp(a[1], b[1], t)),
      Math.round(lerp(a[2], b[2], t))
    ];
  }

  /** Overlay sky hues (RGB); strength still comes from --night-dim-alpha in CSS. */
  const O_NIGHT_T = [34, 22, 72];
  const O_NIGHT_B = [4, 2, 14];
  const O_SUNRISE_T = [255, 186, 148];
  const O_SUNRISE_B = [112, 52, 88];
  const O_SUNSET_T = [255, 138, 96];
  const O_SUNSET_B = [78, 28, 58];
  const O_EVENING_T = [52, 34, 98];
  const O_EVENING_B = [14, 8, 32];

  function pushOverlayTint(topRgb, botRgb) {
    overlay.style.setProperty('--o-r1', String(topRgb[0]));
    overlay.style.setProperty('--o-g1', String(topRgb[1]));
    overlay.style.setProperty('--o-b1', String(topRgb[2]));
    overlay.style.setProperty('--o-r2', String(botRgb[0]));
    overlay.style.setProperty('--o-g2', String(botRgb[1]));
    overlay.style.setProperty('--o-b2', String(botRgb[2]));
  }

  function clearOverlayTint() {
    overlay.style.removeProperty('--o-r1');
    overlay.style.removeProperty('--o-g1');
    overlay.style.removeProperty('--o-b1');
    overlay.style.removeProperty('--o-r2');
    overlay.style.removeProperty('--o-g2');
    overlay.style.removeProperty('--o-b2');
  }

  /** Top / bottom gradient stops for auto mode (America/New_York fractional hour). */
  function overlayTintForAutoFractionalHour(fh) {
    if (fh >= AMBIENT_DAWN_START && fh < AMBIENT_DAWN_END) {
      const t = clamp01((fh - AMBIENT_DAWN_START) / (AMBIENT_DAWN_END - AMBIENT_DAWN_START));
      return { top: lerpRgb(O_NIGHT_T, O_SUNRISE_T, t), bot: lerpRgb(O_NIGHT_B, O_SUNRISE_B, t) };
    }
    if (fh >= AMBIENT_DUSK_START && fh < AMBIENT_DUSK_END) {
      const t = clamp01((fh - AMBIENT_DUSK_START) / (AMBIENT_DUSK_END - AMBIENT_DUSK_START));
      return {
        top: lerpRgb(O_EVENING_T, O_SUNSET_T, 1 - t),
        bot: lerpRgb(O_EVENING_B, O_SUNSET_B, 1 - t)
      };
    }
    if (fh >= AMBIENT_DUSK_END && fh < AMBIENT_DEEPEN_END) {
      const t = clamp01((fh - AMBIENT_DUSK_END) / (AMBIENT_DEEPEN_END - AMBIENT_DUSK_END));
      return { top: lerpRgb(O_EVENING_T, O_NIGHT_T, t), bot: lerpRgb(O_EVENING_B, O_NIGHT_B, t) };
    }
    return { top: O_NIGHT_T.slice(), bot: O_NIGHT_B.slice() };
  }

  /** Intl sometimes embeds bidi marks in part values; Number() then becomes NaN and breaks the clock. */
  function parseIntlNumericPart(raw) {
    if (raw == null || raw === '') return NaN;
    const cleaned = String(raw).replace(/[\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '').trim();
    const n = Number(cleaned);
    if (Number.isFinite(n)) return n;
    const digits = cleaned.match(/\d+/);
    return digits ? parseInt(digits[0], 10) : NaN;
  }

  function getEstCalendarParts(date) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: EST_TIMEZONE,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false
    }).formatToParts(date);
    const map = { hour: NaN, minute: 0, second: 0 };
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (p.type === 'hour' || p.type === 'minute' || p.type === 'second') {
        map[p.type] = parseIntlNumericPart(p.value);
      }
    }
    return map;
  }

  function getEstFractionalHour(date) {
    const m = getEstCalendarParts(date);
    let h = Number.isFinite(m.hour) ? m.hour : 12;
    if (h === 24) h = 0;
    const min = Number.isFinite(m.minute) ? m.minute : 0;
    const sec = Number.isFinite(m.second) ? m.second : 0;
    return h + min / 60 + sec / 3600;
  }

  /** Overlay alpha 0 … AMBIENT_ALPHA_MAX: dusk → deepen → night → dawn. */
  function computeAmbientDimAlpha(fh) {
    if (fh >= AMBIENT_DAWN_START && fh < AMBIENT_DAWN_END) {
      return lerp(
        AMBIENT_ALPHA_MAX,
        0,
        clamp01((fh - AMBIENT_DAWN_START) / (AMBIENT_DAWN_END - AMBIENT_DAWN_START))
      );
    }
    if (fh >= AMBIENT_DAY_START && fh < AMBIENT_DAY_END) {
      return 0;
    }
    if (fh >= AMBIENT_DUSK_START && fh < AMBIENT_DUSK_END) {
      return lerp(
        0,
        AMBIENT_ALPHA_SEVEN_PM,
        clamp01((fh - AMBIENT_DUSK_START) / (AMBIENT_DUSK_END - AMBIENT_DUSK_START))
      );
    }
    if (fh >= AMBIENT_DUSK_END && fh < AMBIENT_DEEPEN_END) {
      return lerp(
        AMBIENT_ALPHA_SEVEN_PM,
        AMBIENT_ALPHA_MAX,
        clamp01((fh - AMBIENT_DUSK_END) / (AMBIENT_DEEPEN_END - AMBIENT_DUSK_END))
      );
    }
    return AMBIENT_ALPHA_MAX;
  }

  function applyAmbientVisuals(date) {
    if (nightOverride === 'day') {
      document.body.classList.remove('night-ambient');
      overlay.style.removeProperty('--night-dim-alpha');
      clearOverlayTint();
      document.body.removeAttribute('data-ambient-phase');
      return;
    }
    let alpha;
    if (nightOverride === 'night') {
      alpha = AMBIENT_ALPHA_MAX;
    } else {
      alpha = computeAmbientDimAlpha(getEstFractionalHour(date));
    }
    if (alpha < 0.02) {
      document.body.classList.remove('night-ambient');
      overlay.style.removeProperty('--night-dim-alpha');
      clearOverlayTint();
      document.body.removeAttribute('data-ambient-phase');
      return;
    }
    document.body.classList.add('night-ambient');
    let displayAlpha = alpha;
    if (nightActive) {
      displayAlpha = Math.min(
        AMBIENT_ALPHA_MAX,
        Math.max(alpha * NIGHT_ACTIVE_VEIL_MUL, NIGHT_ACTIVE_VEIL_MIN)
      );
    }
    overlay.style.setProperty('--night-dim-alpha', displayAlpha.toFixed(4));

    const fh = getEstFractionalHour(date);
    if (nightOverride === 'night') {
      pushOverlayTint(O_NIGHT_T, O_NIGHT_B);
    } else {
      const { top, bot } = overlayTintForAutoFractionalHour(fh);
      pushOverlayTint(top, bot);
    }

    let phase = 'night';
    if (nightOverride !== 'night') {
      if (fh >= AMBIENT_DUSK_START && fh < AMBIENT_DUSK_END) phase = 'dusk';
      else if (fh >= AMBIENT_DUSK_END && fh < AMBIENT_DEEPEN_END) phase = 'evening';
      else if (fh >= AMBIENT_DAWN_START && fh < AMBIENT_DAWN_END) phase = 'dawn';
      else if (fh >= AMBIENT_DAY_START && fh < AMBIENT_DAY_END) phase = 'day';
    }
    document.body.setAttribute('data-ambient-phase', phase);
  }

  function getEstClockAngles(date) {
    const map = getEstCalendarParts(date);
    let hour24 = Number.isFinite(map.hour) ? map.hour : 12;
    if (hour24 === 24) hour24 = 0;
    const minute = Number.isFinite(map.minute) ? map.minute : 0;
    const second = Number.isFinite(map.second) ? map.second : 0;
    const hourFraction = (hour24 % 12) + minute / 60 + second / 3600;
    const minuteFraction = minute + second / 60;
    return {
      hourDeg: hourFraction * 30,
      minuteDeg: minuteFraction * 6,
      secondDeg: second * 6
    };
  }

  function refreshClock() {
    const now = new Date();
    const formatted = new Intl.DateTimeFormat('en-US', {
      timeZone: EST_TIMEZONE,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZoneName: 'short'
    }).format(now);

    const el = clock.querySelector('.clock-time');
    if (el) el.textContent = formatted;

    const face = clock.querySelector('.clock-face');
    if (face) {
      const { hourDeg, minuteDeg, secondDeg } = getEstClockAngles(now);
      face.style.setProperty('--clock-hour-deg', `${hourDeg}deg`);
      face.style.setProperty('--clock-minute-deg', `${minuteDeg}deg`);
      face.style.setProperty('--clock-second-deg', `${secondDeg}deg`);
    }

    applyAmbientVisuals(now);
  }

  function evaluateNightState() {
    const now = new Date();
    try {
      const partsMap = getEstCalendarParts(now);
      let estHour = Number.isFinite(partsMap.hour) ? partsMap.hour : 12;
      if (estHour === 24) estHour = 0;

      const shouldBeNightByClock = estHour >= NIGHT_START_HOUR_EST || estHour < NIGHT_END_HOUR_EST;
      const shouldBeNight =
        nightOverride === 'night'
          ? true
          : nightOverride === 'day'
            ? false
            : shouldBeNightByClock;
      nightActive = shouldBeNight;
      document.body.classList.toggle('night-active', nightActive);
      document.body.classList.toggle('night-override-auto', nightOverride === 'auto');
      document.body.classList.toggle('night-override-day', nightOverride === 'day');
      document.body.classList.toggle('night-override-night', nightOverride === 'night');
      if (nightActive) {
        syncOverlayMaskCanvasSize();
        syncRoomIllumination();
        updateNightOverlayMask();
      } else {
        clearOverlaySvgMask();
        syncRoomIllumination();
      }

      applyAmbientVisuals(now);
    } catch (_err) {
      /* Night/mask path must not take down the EST clock tickers. */
    }
  }

  /** Cycles the three presets: auto (timed sky) → night → day → auto. Does not step individual gradient phases. */
  function cycleNightOverride() {
    if (nightOverride === 'auto') {
      nightOverride = 'night';
    } else if (nightOverride === 'night') {
      nightOverride = 'day';
    } else {
      nightOverride = 'auto';
    }
    safeStorageSet(NIGHT_OVERRIDE_KEY, nightOverride);
    updateOverrideButtonLabel();
    evaluateNightState();
  }

  function updateOverrideButtonLabel() {
    const button = document.querySelector('.light-switch');
    if (!button) return;
    applyOverrideToSwitch(button);
  }

  function applyOverrideToSwitch(button) {
    button.classList.remove('light-switch--auto', 'light-switch--night', 'light-switch--day');
    const mode =
      nightOverride === 'night' ? 'night' : nightOverride === 'day' ? 'day' : 'auto';
    button.classList.add(`light-switch--${mode}`);
    const textEl = button.querySelector('.light-switch-text');
    if (textEl) {
      textEl.textContent = mode === 'night' ? 'night' : mode === 'day' ? 'day' : 'auto';
    }
    const aria =
      mode === 'night'
        ? 'Preset: forced night (dark veil and flashlight). Click for bright day, then automatic sky.'
        : mode === 'day'
          ? 'Preset: forced bright day. Click for automatic Eastern Time with smooth dusk-to-dawn gradients.'
          : 'Automatic Eastern Time: smooth sky gradients over the day. Click for night or day presets only.';
    button.setAttribute('aria-label', aria);
  }

  function readLitRooms() {
    try {
      return JSON.parse(localStorage.getItem(LIGHT_STORAGE_KEY) || '{}');
    } catch (_error) {
      return {};
    }
  }

  function persistLitRooms() {
    const all = readLitRooms();
    all[PAGE_KEY] = Array.from(litSet);
    safeStorageSet(LIGHT_STORAGE_KEY, JSON.stringify(all));
  }

  function safeStorageSet(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (_err) {
      /* Safari private / quota — override still applies in-memory this session */
    }
  }

  function readNightOverride() {
    try {
      const value = localStorage.getItem(NIGHT_OVERRIDE_KEY);
      if (value === 'twilight') return 'auto';
      if (value === 'night' || value === 'day') return value;
      return 'auto';
    } catch (_err) {
      return 'auto';
    }
  }
})();
