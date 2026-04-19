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

  let nightOverride = readNightOverride();
  ensureNightMaskSvg();
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

  let maskRaf = 0;

  const litRoomsByPage = readLitRooms();
  const litSet = new Set(litRoomsByPage[PAGE_KEY] || []);

  let nightActive = false;

  mountLamps();
  refreshClock();
  evaluateNightState();

  setInterval(() => {
    refreshClock();
    evaluateNightState();
  }, 30000);

  document.addEventListener('mousemove', (event) => {
    overlay.style.setProperty('--flashlight-x', `${event.clientX}px`);
    overlay.style.setProperty('--flashlight-y', `${event.clientY}px`);
    requestNightMaskUpdate();
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      syncMaskSvgSize();
      requestNightMaskUpdate();
    }, 120);
  });

  document.addEventListener('touchmove', (event) => {
    if (!event.touches.length) return;
    const firstTouch = event.touches[0];
    overlay.style.setProperty('--flashlight-x', `${firstTouch.clientX}px`);
    overlay.style.setProperty('--flashlight-y', `${firstTouch.clientY}px`);
    requestNightMaskUpdate();
  }, { passive: true });

  function createNightOverlay() {
    const el = document.createElement('div');
    el.className = 'night-overlay';
    el.style.setProperty('--flashlight-x', `${window.innerWidth * 0.5}px`);
    el.style.setProperty('--flashlight-y', `${window.innerHeight * 0.45}px`);
    document.body.appendChild(el);
    return el;
  }

  /** SVG mask: white = show dark overlay, black = cut hole (flashlight + lit rooms). */
  function ensureNightMaskSvg() {
    if (document.getElementById('uht-night-mask-svg')) return;
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('id', 'uht-night-mask-svg');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', '1');
    svg.setAttribute('height', '1');
    /* opacity 0 can make WebKit skip mask rasterization; keep nearly invisible */
    svg.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;overflow:hidden;pointer-events:none;opacity:0.01;';
    const defs = document.createElementNS(NS, 'defs');
    const rg = document.createElementNS(NS, 'radialGradient');
    rg.setAttribute('id', 'uht-flash-mask-grad');
    rg.setAttribute('gradientUnits', 'userSpaceOnUse');
    const s0 = document.createElementNS(NS, 'stop');
    s0.setAttribute('offset', '0%');
    s0.setAttribute('stop-color', '#000000');
    const s1 = document.createElementNS(NS, 'stop');
    s1.setAttribute('offset', '38%');
    s1.setAttribute('stop-color', '#1a1a1a');
    const s2 = document.createElementNS(NS, 'stop');
    s2.setAttribute('offset', '100%');
    s2.setAttribute('stop-color', '#ffffff');
    rg.append(s0, s1, s2);
    const mask = document.createElementNS(NS, 'mask');
    mask.setAttribute('id', 'uht-night-overlay-mask');
    mask.setAttribute('mask-type', 'luminance');
    mask.setAttribute('maskUnits', 'userSpaceOnUse');
    mask.setAttribute('maskContentUnits', 'userSpaceOnUse');
    mask.setAttribute('x', '0');
    mask.setAttribute('y', '0');
    mask.setAttribute('width', String(window.innerWidth));
    mask.setAttribute('height', String(window.innerHeight));
    mask.setAttribute('data-mask-root', 'true');
    defs.append(rg, mask);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    syncMaskSvgSize();
  }

  function syncMaskSvgSize() {
    const mask = document.querySelector('#uht-night-overlay-mask');
    if (!mask) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    mask.setAttribute('width', String(w));
    mask.setAttribute('height', String(h));
  }

  function requestNightMaskUpdate() {
    if (!nightActive) return;
    if (maskRaf) return;
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

  function updateNightOverlayMask() {
    const mask = document.querySelector('#uht-night-overlay-mask');
    const grad = document.querySelector('#uht-flash-mask-grad');
    if (!mask || !grad) return;

    while (mask.firstChild) mask.removeChild(mask.firstChild);

    const w = window.innerWidth;
    const h = window.innerHeight;
    const base = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    base.setAttribute('x', '0');
    base.setAttribute('y', '0');
    base.setAttribute('width', String(w));
    base.setAttribute('height', String(h));
    base.setAttribute('fill', '#ffffff');
    mask.appendChild(base);

    const fx = parsePxVar(overlay.style.getPropertyValue('--flashlight-x'), w * 0.5);
    const fy = parsePxVar(overlay.style.getPropertyValue('--flashlight-y'), h * 0.5);
    const fr = 200;
    grad.setAttribute('cx', String(fx));
    grad.setAttribute('cy', String(fy));
    grad.setAttribute('r', String(fr));

    const flashCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    flashCircle.setAttribute('cx', String(fx));
    flashCircle.setAttribute('cy', String(fy));
    flashCircle.setAttribute('r', String(fr));
    flashCircle.setAttribute('fill', 'url(#uht-flash-mask-grad)');
    mask.appendChild(flashCircle);

    rooms.forEach((roomEl) => {
      const id = roomEl.id;
      if (!id || !litSet.has(id)) return;
      const r = roomEl.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      const hole = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      hole.setAttribute('x', String(r.left));
      hole.setAttribute('y', String(r.top));
      hole.setAttribute('width', String(r.width));
      hole.setAttribute('height', String(r.height));
      hole.setAttribute('rx', '2');
      hole.setAttribute('fill', '#000000');
      mask.appendChild(hole);
    });

    bindOverlaySvgMask();
  }

  /** Safari + Chrome: set mask longhands (shorthand alone is flaky after SVG mask edits). */
  function bindOverlaySvgMask() {
    if (!nightActive) return;
    const url = 'url(#uht-night-overlay-mask)';
    overlay.style.mask = 'none';
    overlay.style.webkitMask = 'none';
    overlay.style.maskImage = url;
    overlay.style.maskRepeat = 'no-repeat';
    overlay.style.maskSize = '100% 100%';
    overlay.style.maskPosition = '0 0';
    overlay.style.webkitMaskImage = url;
    overlay.style.webkitMaskRepeat = 'no-repeat';
    overlay.style.webkitMaskSize = '100% 100%';
    overlay.style.webkitMaskPosition = '0 0';
  }

  function clearOverlaySvgMask() {
    overlay.style.mask = 'none';
    overlay.style.webkitMask = 'none';
    overlay.style.maskImage = 'none';
    overlay.style.webkitMaskImage = 'none';
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
              <div class="clock-face-dot"></div>
            </div>
            <div class="clock-window">
              <div class="clock-pendulum"></div>
            </div>
          </div>
        </div>
        <span class="clock-title">grandfather clock</span>
        <span class="clock-time" aria-live="polite">--:-- -- EST</span>
      </div>
      <button class="light-switch" type="button" style="--paddle-top: 14px" aria-label="Lighting: automatic by time of day. Click to cycle override.">
        <span class="light-switch-track" aria-hidden="true">
          <span class="light-switch-paddle"></span>
        </span>
        <span class="light-switch-label">auto</span>
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
  }

  function evaluateNightState() {
    const now = new Date();
    const estHour = Number(new Intl.DateTimeFormat('en-US', {
      timeZone: EST_TIMEZONE,
      hour: 'numeric',
      hour12: false
    }).format(now));

    const shouldBeNightByClock = estHour >= NIGHT_START_HOUR_EST || estHour < NIGHT_END_HOUR_EST;
    const shouldBeNight =
      nightOverride === 'night'
        ? true
        : nightOverride === 'day'
          ? false
          : shouldBeNightByClock;
    nightActive = shouldBeNight;
    document.body.classList.toggle('night-active', nightActive);
    if (nightActive) {
      syncMaskSvgSize();
      syncRoomIllumination();
      requestNightMaskUpdate();
    } else {
      clearOverlaySvgMask();
      const mask = document.querySelector('#uht-night-overlay-mask');
      if (mask) {
        while (mask.firstChild) mask.removeChild(mask.firstChild);
      }
      syncRoomIllumination();
    }
  }

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
    const mode = nightOverride === 'night' ? 'night' : nightOverride === 'day' ? 'day' : 'auto';
    button.classList.add(`light-switch--${mode}`);
    const paddleTop = mode === 'day' ? '7px' : mode === 'night' ? '21px' : '14px';
    button.style.setProperty('--paddle-top', paddleTop);
    const label = button.querySelector('.light-switch-label');
    if (label) {
      label.textContent = mode === 'night' ? 'night' : mode === 'day' ? 'day' : 'auto';
    }
    const aria =
      mode === 'night'
        ? 'Lighting: forced night (dark + flashlight). Click to cycle.'
        : mode === 'day'
          ? 'Lighting: forced day. Click to cycle.'
          : 'Lighting: automatic by time of day. Click to cycle.';
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
      return value === 'night' || value === 'day' ? value : 'auto';
    } catch (_err) {
      return 'auto';
    }
  }
})();
