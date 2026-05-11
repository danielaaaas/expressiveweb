  // typewriter function for the notebook
    function typeWriter(text, elementId, speed = 30) {
        const el = document.getElementById(elementId);
        el.textContent = '';
        let i = 0;
        const timer = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(timer);
        }, speed);
    }

// room dictionary ( stores title and text for each room )
const rooms = {
    'bedroom-one': {
        title: 'bedroom one',
        text: 'the borderlands between one home and the next.'
    },

   'bedroom-two': {
        title: 'bedroom two',
        text: 'just as before, this place held more family gatherings than anything else, hosted more sunday movie nights and held witness to celebration and argument alike.'
    },

   'bedroom-three': {
        title: 'bedroom three',
        text: 'a vaccuum of things lost, where memory has splotches of darkness like lacunae...'
    },

    'bathroom': {
        title: 'bathroom',
        text: 'a place to leave a message or two...'
    },

    'living-kitchen': {
        title: 'living room & kitchen',
        text: 'downsizing from so much space to this was a bit strange, the shape of the room felt odd, the kitchen too small, but all the same, everyone made due with what was given.'
    }
};

const bathroomHotspotEntries = {
    'hit-sink': {
        title: 'sink',
        text: 'the sink remembers hurried mornings, soap bubbles, and those rare quiet minutes alone.'
    },
    'hit-tub': {
        title: 'tub',
        text: 'the tub held long exhale moments, where steam turned the room soft and time slowed down.'
    },
    'hit-toilet': {
        title: 'toilet',
        text: 'one of those ordinary anchors of home life; not glamorous, but always part of the daily rhythm.'
    },
    'hit-cabinet': {
        title: 'cabinet',
        text: 'medicine, hair ties, and half-forgotten things lived behind this little door for years.'
    }
};

const NOTEBOOK_SHELL_DEFAULT = '../../elements/room-shell-only.svg';
const NOTEBOOK_SHELL_BATHROOM = '../../elements/room-shell-bathroom-notebook.svg';
const NOTEBOOK_SHELL_MASTER = '../../elements/room-shell-master-bedroom.svg';

function notebookShellForRoom(roomId) {
    if (roomId === 'master-bedroom' || roomId === 'bedroom-one') {
        return NOTEBOOK_SHELL_MASTER;
    }
    return null;
}

function replaceNotebookShellEmbed(src) {
    const old = document.querySelector('#notebook .notebook-shell-embed');
    if (!old || !old.parentNode) return;
    const next = document.createElement('object');
    next.className = 'notebook-shell-embed';
    next.setAttribute('type', 'image/svg+xml');
    next.setAttribute('data', src);
    next.setAttribute('aria-hidden', 'true');
    old.parentNode.replaceChild(next, old);
}

function openNotebookEntry(title, text, showRoomShell = true, shellSrc = null) {
    const notebook = document.getElementById('notebook');
    if (notebook) {
        if (showRoomShell) {
            notebook.classList.add('notebook--with-diorama');
            replaceNotebookShellEmbed(shellSrc || NOTEBOOK_SHELL_DEFAULT);
        } else {
            notebook.classList.remove('notebook--with-diorama');
            replaceNotebookShellEmbed(NOTEBOOK_SHELL_DEFAULT);
        }
    }

    const notebookTitle = document.getElementById('notebook-title');
    const notebookText = document.getElementById('notebook-text');

    if (notebookTitle.textContent !== title) {
        typeWriter(text, 'notebook-text');
    } else {
        notebookText.textContent = text;
    }

    notebookTitle.textContent = title;
    notebook.classList.add('open');
    document.getElementById('overlay').classList.add('active');
}

const visited = {};

Object.keys(visited).forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.classList.add('visited');
});

// click listener for rooms
document.querySelectorAll('.room').forEach(room => {
  room.addEventListener('click', () => {
    const id = room.id;

    // bedroom closet should lead to apartment numero cuatro
    if (id === 'bedroom-one') {
        // show the note first 
        const note = document.getElementById('door-note');
        const noteOverlay = document.getElementById('door-note-overlay');
        note.classList.add('visible');
        noteOverlay.classList.add('visible');

        // if yes...proceed with original transition. rmbr to add door asset
        document.getElementById('note-yes').onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
            const door = document.getElementById('door-transition');
            door.classList.add('active');
            setTimeout(() => {
                window.location.href = 'https://danielaaaas.github.io/expressiveweb/aptdos/apttres/aptcuatro/index.html';
            }, 1500);
        };

        // if no, stay in the room — open the bedroom-one memory vignette
        // (the room you stay in if you choose not to leave)
        document.getElementById('note-no').onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
            visited[id] = true;
            room.classList.add('visited');
            openBedroomOneMemory();
        };
    return;
}

// bedroom two — softly fading memory vignette
    if (id === 'bedroom-two') {
        visited[id] = true;
        room.classList.add('visited');
        openBedroomTwoMemory();
        return;
    }

// bathroom - softly fragmented memory vignette (apartment three)
    if (id === 'bathroom') {
        visited[id] = true;
        room.classList.add('visited');
        openBathroomMemory();
        return;
    }

// bedroom three - softly overlapping eras vignette
    if (id === 'bedroom-three') {
        visited[id] = true;
        room.classList.add('visited');
        openBedroomThreeMemory();
        return;
    }

// living + kitchen - overlapping domestic rituals vignette (apartment three)
    if (id === 'living-kitchen') {
        visited[id] = true;
        room.classList.add('visited');
        openLivingKitchenMemory();
        return;
    }

    const data = rooms[id];
    if (!data) return;

    // this will mark a room as visited
    visited[id] = true;
    room.classList.add('visited');

    openNotebookEntry(data.title, data.text, id !== 'living-kitchen', notebookShellForRoom(id));
  });
});

// closes the notebook
function closeNotebook() {
    const notebook = document.getElementById('notebook');
    notebook.classList.remove('open', 'notebook--with-diorama');
    replaceNotebookShellEmbed(NOTEBOOK_SHELL_DEFAULT);
    document.getElementById('overlay').classList.remove('active');
}

document.getElementById('close-button').addEventListener('click', closeNotebook);
document.getElementById('overlay').addEventListener('click', closeNotebook);

// or closing it with the esc key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeNotebook();
    if (typeof closeBedroomOneMemory === 'function') closeBedroomOneMemory();
    if (typeof closeBedroomTwoMemory === 'function') closeBedroomTwoMemory();
    if (typeof closeBedroomThreeMemory === 'function') closeBedroomThreeMemory();
    if (typeof closeBathroomMemory === 'function') closeBathroomMemory();
    if (typeof closeLivingKitchenMemory === 'function') closeLivingKitchenMemory();
  }
});

// bathroom mirror draft
function openMirror () {
    document.getElementById('mirror-overlay').classList.add('active');
    document.getElementById('mirror-input').value = '';
    document.getElementById('mirror-message').textContent = '';
    document.getElementById('mirror-message').classList.remove('fade-out');
    setTimeout(() => {
        document.getElementById('mirror-input').focus();
    }, 300);
}

function closeMirror () {
    document.getElementById('mirror-overlay').classList.remove('active');
}

function setupMirrorRoomHotspots() {
    const roomObject = document.getElementById('mirror-room-svg');
    if (!roomObject) return;

    const bindHotspots = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;

        const svgRoot = svgDoc.documentElement;
        if (!svgRoot || svgRoot.dataset.hotspotsBound === 'true') return;

        Object.entries(bathroomHotspotEntries).forEach(([hotspotId, entry]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;

            hotspot.style.cursor = "url('https://64.media.tumblr.com/821cf7001bf745e2ddca3d248163c513/894ac02f0d28ad70-56/s1280x1920/b524d63c6de82323756b1603e624961da509144e.png'), auto";
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                closeMirror();
                openNotebookEntry(entry.title, entry.text, true, NOTEBOOK_SHELL_BATHROOM);
            });
        });

        svgRoot.dataset.hotspotsBound = 'true';
    };

    roomObject.addEventListener('load', bindHotspots);
    bindHotspots();
}

setupMirrorRoomHotspots();

document.getElementById('mirror-submit').addEventListener('click', () => {
    const msg = document.getElementById('mirror-input').value.trim();
    if (!msg) return;

    const display = document.getElementById('mirror-message');
    display.textContent = msg;
    display.classList.remove('fade-out');
    document.getElementById('mirror-input').value = '';

    // fade out after a moment...but i might keep the text instead
    setTimeout(() => {
        display.classList.add('fade-out');
    }, 3000);
});

// text to be submitted with the enter key
document.getElementById('mirror-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('mirror-submit').click();
});

document.getElementById('mirror-close').addEventListener('click', closeMirror);

// for the closet crumble 
function openCloset() {
    document.getElementById('closet-overlay').classList.add('active');
    document.getElementById('closet-input').value = '';
    document.getElementById('closet-text').textContent = '';
    setTimeout(() => {
        document.getElementById('closet-input').focus();
    }, 300);
}

function closeCloset() {
    document.getElementById('closet-overlay').classList.remove('active');
}

function crumbleText(text) {
    const textEl = document.getElementById('closet-text');
    const pile = document.getElementById('crumble-pile');
    // const text = textEl.textContent;
    // if (!text) return;

    // turns number of characters into crumbs
    // const crumbCount = Math.min(text.length * 2, 80);

    // crumble letter by letter 
    let i = text.length;
    const clearTimer = setInterval(() => {
        i--;
        textEl.textContent = text.substring(0, i);
        // add a crumb for every letter
        const crumb = document.createElement('div');
        crumb.classList.add('crumb');
        // size variation like confetti
        const size = 2 + Math.floor(Math.random() * 3);
        crumb.style.width = size + 'px';
        crumb.style.height = size + 'px';
        crumb.style.opacity = 0.4 + Math.random() * 0.6;
        pile.appendChild(crumb);
        if (i<=0) clearInterval(clearTimer);
        }, 40);
}

document.getElementById('closet-submit').addEventListener('click', () => {
    const msg = document.getElementById('closet-input').value.trim();
    if (!msg) return;

    document.getElementById('closet-input').value = '';

    // types the message on the wall first ( this part is giving me a headacheeeeeeee, thankfully it's recycling what i already used )
    typeWriter(msg, 'closet-text', 40);

    // then, once its written, it crumbles
    const crumbleDelay = msg.length * 40 + 800;
    setTimeout(() => crumbleText(msg), crumbleDelay);
});

document.getElementById('closet-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') document.getElementById('closet-submit').click();
});

document.getElementById('closet-close').addEventListener('click', closeCloset);

// ============================================================
// bedroom one memory vignette (apartment three) - softening at the edges
// the room you stay in when you choose not to walk through the door.
// hover responses are intentionally slow (a delay before the tip updates,
// and a soft fade between fragments). click fragments cut off mid-sentence.
// the window scenery, the photo behind the lamp shade, and the fan's
// rotation state all rotate per visit.
// ============================================================
const bedroomOneMemoryHoverTips = {
    'hit-paint':      [
        'two rectangles of un-faded paint. things used to hang here. you do not remember the things, exactly.',
        'the wall remembers what was here longer than you do.',
        'a poster used to be here. and a small frame. you remember holding the tape.'
    ],
    'hit-window':     [
        'a window. the light through it is afternoon, mostly.',
        'a window onto the warmth of golden hour. the buildings across the way go soft.',
        'a window onto a slow dusk. small lit windows in the distance.'
    ],
    'hit-bed':        [
        'a bed cropped at the edge of the frame. softer than you remember it being.',
        'the bed. it was always made by lunchtime.',
        'the bed where you slept. some nights more than others.'
    ],
    'hit-pillow':     [
        'a cream pillow. the corner is starting to fray.',
        'a pillow. the linen still smells faintly of the detergent she used to buy.'
    ],
    'hit-folded':     [
        'a small stack of folded clothes. half-folded, really.',
        'folded laundry. she was halfway through. she always was.'
    ],
    'hit-duvet':      [
        'a faded duvet. the dusty rose used to be brighter.',
        'the duvet. the wrinkles never quite came out.'
    ],
    'hit-nightstand': [
        'a small wooden nightstand. two drawers. you remember what was in one of them.',
        'a nightstand. the brass pulls are darker where fingers used to land.'
    ],
    'hit-lamp':       [
        'a small lamp. the light is dimmer than it should be.',
        'the lamp. the shade has aged a little warmer than it started.'
    ],
    'hit-photo':      [
        'a framed photo on the floor, leaning against the wall behind the nightstand.',
        'a photograph. you can almost see the rest of it.',
        'the photo. you remember pieces of who is in it.'
    ],
    'hit-fan':        [
        'an old pedestal fan. the blades turn slowly.',
        'the fan. dragging today.',
        'the fan is off. you do not remember turning it off.'
    ],
    'hit-floor':      [
        'warm wood floor. the boards creak in places only you remember.',
        'the floor. softer than it looks. the afternoon light pools on it.'
    ]
};

const bedroomOneMemoryClickFragments = {
    'hit-paint':      [
        'there was a poster here. you remember the corner of it. the rest is\u2014',
        'a small frame hung beside it. you remember the glass catching the light when\u2014'
    ],
    'hit-window':     [
        'you used to look out at the apartment across the street. there was a woman who would\u2014',
        'the light through this window in the late afternoon was the kind of light that made you want to\u2014',
        'the dusk made the room go quiet. it was always when you finally\u2014'
    ],
    'hit-bed':        [
        'you used to read here every night before\u2014',
        'the bed where everything happened that you don\'t talk about. the bed where you also just\u2014',
        'made every morning. unmade by noon. made again before\u2014'
    ],
    'hit-pillow':     [
        'the pillow was firmer back when you first\u2014',
        'you remember the embroidery on the case. it said\u2014'
    ],
    'hit-folded':     [
        'she folded them in stacks of three. she said it kept the\u2014',
        'half-folded laundry. you would always finish them in the morning except for the morning when\u2014'
    ],
    'hit-duvet':      [
        'the duvet smelled like her perfume even after you\u2014',
        'her grandmother made it. she told you on the day that\u2014'
    ],
    'hit-nightstand': [
        'in the top drawer: your books, your glasses, the small notes you left for\u2014',
        'in the bottom drawer: things you stopped opening the year that\u2014'
    ],
    'hit-lamp':       [
        'you turned the lamp off the night that\u2014',
        'the lamp was on every night for years until\u2014',
        'the bulb was warmer back then. the warmth always reminded you of\u2014'
    ],
    'hit-photo':      [
        'this was taken the year\u2014 you cannot remember the year.',
        'you remember the day this was taken. you do not remember who took it. you remember they\u2014',
        'a photograph of someone you used to\u2014'
    ],
    'hit-fan':        [
        'the fan only worked when it wanted to. that summer it\u2014',
        'the blades caught the curtain a few times. once, when you were\u2014',
        'the fan stopped on a tuesday. you noticed the silence before you noticed\u2014'
    ],
    'hit-floor':      [
        'you used to leave clothes on the floor. she would always\u2014',
        'the floor remembers every place you ever set anything down. especially the place where you\u2014'
    ]
};

const B1_WINDOW_VARIANTS = ['b1-window-a', 'b1-window-b', 'b1-window-c'];
const B1_PHOTO_VARIANTS  = ['b1-photo-a',  'b1-photo-b',  'b1-photo-c'];
const B1_FAN_VARIANTS    = ['b1-fan-a',    'b1-fan-b',    'b1-fan-c'];
const BEDROOM_ONE_VISIT_KEY = 'bedroomone-apttres.visitCount';

let b1HumCtx = null;
let b1HumOscA = null;
let b1HumOscB = null;
let b1HumNoise = null;
let b1HumLfo = null;

function openBedroomOneMemory() {
    const roomObject = document.getElementById('bedroom-one-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bedroom-one-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bedroom-one-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. the room is softer than it was. some sentences will not finish.';
    startBedroomOnePad();
    setupBedroomOneMemorySvgRuntime();
}

function closeBedroomOneMemory() {
    const overlay = document.getElementById('bedroom-one-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    const roomObject = document.getElementById('bedroom-one-memory-svg');
    const svgDoc = roomObject?.contentDocument;
    if (svgDoc) resetBedroomOneCurtain(svgDoc);
    stopBedroomOnePad();
}

// curtains start CLOSED (covering the window glass) and slide apart when
// the room opens. mirrors the master-bedroom curtain pattern in apt one.
// Web Animations API is used because SMIL beginElement is unreliable inside
// embedded <object> SVG.
function resetBedroomOneCurtain(svgDoc) {
    const left = svgDoc.getElementById('b1-curtain-left');
    const right = svgDoc.getElementById('b1-curtain-right');
    [left, right].forEach((node) => {
        if (!node) return;
        if (typeof node.getAnimations === 'function') {
            node.getAnimations().forEach((a) => a.cancel());
        }
        node.style.transform = 'translate(0, 0)';
    });
}

function startBedroomOneCurtainOpen(svgDoc) {
    const left = svgDoc.getElementById('b1-curtain-left');
    const right = svgDoc.getElementById('b1-curtain-right');
    if (!left || !right) return;

    [left, right].forEach((node) => {
        if (typeof node.getAnimations === 'function') {
            node.getAnimations().forEach((a) => a.cancel());
        }
        node.style.transform = 'translate(0, 0)';
    });

    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
    if (typeof left.animate === 'function') {
        left.animate(
            [{ transform: 'translate(0, 0)' }, { transform: 'translate(-30px, 0)' }],
            { duration: 1200, easing, fill: 'forwards' }
        );
    } else {
        left.style.transform = 'translate(-30px, 0)';
    }
    if (typeof right.animate === 'function') {
        right.animate(
            [{ transform: 'translate(0, 0)' }, { transform: 'translate(34px, 0)' }],
            { duration: 1200, easing, fill: 'forwards' }
        );
    } else {
        right.style.transform = 'translate(34px, 0)';
    }
}

// a warm pad with a slow swelling LFO on the master gain, so the ambient
// tone audibly fades in and out over time ("ambient room tone fades in and out").
function startBedroomOnePad() {
    stopBedroomOnePad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        b1HumCtx = new Ctx();

        const masterGain = b1HumCtx.createGain();
        masterGain.gain.value = 0.018;
        masterGain.connect(b1HumCtx.destination);

        // a soft minor third (low A + low C-ish) for warm dreamy color
        b1HumOscA = b1HumCtx.createOscillator();
        b1HumOscA.type = 'sine';
        b1HumOscA.frequency.value = 110;
        const gainA = b1HumCtx.createGain();
        gainA.gain.value = 0.55;
        b1HumOscA.connect(gainA);
        gainA.connect(masterGain);

        b1HumOscB = b1HumCtx.createOscillator();
        b1HumOscB.type = 'sine';
        b1HumOscB.frequency.value = 130.8;
        const gainB = b1HumCtx.createGain();
        gainB.gain.value = 0.42;
        b1HumOscB.connect(gainB);
        gainB.connect(masterGain);

        // soft low-passed noise floor (gentle late-afternoon room tone)
        const bufferSize = 2 * b1HumCtx.sampleRate;
        const noiseBuffer = b1HumCtx.createBuffer(1, bufferSize, b1HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.45;
        }
        b1HumNoise = b1HumCtx.createBufferSource();
        b1HumNoise.buffer = noiseBuffer;
        b1HumNoise.loop = true;
        const noiseFilter = b1HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 300;
        const noiseGain = b1HumCtx.createGain();
        noiseGain.gain.value = 0.20;
        b1HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // slow LFO that swells the master gain between ~0.35x and ~1.6x base
        // every ~16s — the room tone fades in and fades out on its own.
        b1HumLfo = b1HumCtx.createOscillator();
        b1HumLfo.type = 'sine';
        b1HumLfo.frequency.value = 1 / 16; // 16-second period
        const lfoDepth = b1HumCtx.createGain();
        lfoDepth.gain.value = 0.011; // depth on top of the 0.018 base
        b1HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        b1HumOscA.start();
        b1HumOscB.start();
        b1HumNoise.start();
        b1HumLfo.start();

        if (b1HumCtx.state === 'suspended') b1HumCtx.resume();
    } catch (_) {
        b1HumCtx = null;
        b1HumOscA = null;
        b1HumOscB = null;
        b1HumNoise = null;
        b1HumLfo = null;
    }
}

function stopBedroomOnePad() {
    try {
        b1HumOscA?.stop();
        b1HumOscB?.stop();
        b1HumNoise?.stop();
        b1HumLfo?.stop();
        b1HumCtx?.close?.();
    } catch (_) {}
    b1HumOscA = null;
    b1HumOscB = null;
    b1HumNoise = null;
    b1HumLfo = null;
    b1HumCtx = null;
}

function applyBedroomOneRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BEDROOM_ONE_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BEDROOM_ONE_VISIT_KEY, String(visits)); } catch (_) {}

    // window scenery rotates (afternoon -> golden -> dusk and back)
    const windowIdx = (visits - 1) % B1_WINDOW_VARIANTS.length;
    B1_WINDOW_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === windowIdx ? 'visible' : 'hidden');
    });

    // photo content rotates (different person/scene, "objects from different years")
    const photoIdx = (visits + 1) % B1_PHOTO_VARIANTS.length;
    B1_PHOTO_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === photoIdx ? 'visible' : 'hidden');
    });

    // fan rotation state (normal -> dragging -> stopped) offset again
    const fanIdx = (visits + 2) % B1_FAN_VARIANTS.length;
    B1_FAN_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === fanIdx ? 'visible' : 'hidden');
    });

    return { windowIdx, photoIdx, fanIdx, visits };
}

// pull the next item from a per-hotspot rotating array (cycles through
// "incomplete memories" of the same object on each subsequent click/hover)
function pickRotatingFragment(map, hotspotId, hotspotState) {
    const arr = map[hotspotId];
    if (!arr) return null;
    if (Array.isArray(arr)) {
        const idx = (hotspotState[hotspotId] ?? 0) % arr.length;
        hotspotState[hotspotId] = idx + 1;
        return arr[idx];
    }
    return arr;
}

function setupBedroomOneMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroom-one-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const rotations = applyBedroomOneRotations(svgDoc);
        svgRoot._b1Rotations = rotations;

        // start the curtains in the CLOSED state, then slide them open after a
        // short delay so the user actually sees the shade-opening transition
        resetBedroomOneCurtain(svgDoc);
        setTimeout(() => startBedroomOneCurtainOpen(svgDoc), 280);

        if (svgRoot.dataset.b1Bound === 'true') return;

        const tipEl = document.getElementById('bedroom-one-memory-tip');
        const defaultTip = 'hover and click to remember. the room is softer than it was. some sentences will not finish.';

        const hoverState = {};
        const clickState = {};

        // slow tip updater: small fade out, wait, then write the new text + fade in
        let pendingTipTimer = null;
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 420);
        };
        const setTipImmediate = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('fading');
            tipEl.textContent = text;
        };

        // hover: respond slowly (the room is half-asleep)
        Object.keys(bedroomOneMemoryHoverTips).forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (hotspotId === 'hit-window') {
                    const idx = (svgRoot._b1Rotations || {}).windowIdx ?? 0;
                    setTipSlow(bedroomOneMemoryHoverTips['hit-window'][idx] || defaultTip);
                } else if (hotspotId === 'hit-photo') {
                    const idx = (svgRoot._b1Rotations || {}).photoIdx ?? 0;
                    setTipSlow(bedroomOneMemoryHoverTips['hit-photo'][idx] || defaultTip);
                } else if (hotspotId === 'hit-fan') {
                    const idx = (svgRoot._b1Rotations || {}).fanIdx ?? 0;
                    setTipSlow(bedroomOneMemoryHoverTips['hit-fan'][idx] || defaultTip);
                } else {
                    const next = pickRotatingFragment(bedroomOneMemoryHoverTips, hotspotId, hoverState);
                    if (next) setTipSlow(next);
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                setTipSlow(defaultTip);
            });
        });

        // click: cut-off memory fragments (immediate so the dash lands)
        Object.keys(bedroomOneMemoryClickFragments).forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = pickRotatingFragment(bedroomOneMemoryClickFragments, hotspotId, clickState);
                if (next) setTipImmediate(next);
            });
        });

        svgRoot.dataset.b1Bound = 'true';
    };

    if (!roomObject.dataset.b1LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.b1LoadHooked = 'true';
    }
    bind();
}

const bedroomOneCloseBtn = document.getElementById('bedroom-one-memory-close');
if (bedroomOneCloseBtn) bedroomOneCloseBtn.addEventListener('click', closeBedroomOneMemory);

// "the door" closes the vignette and re-shows the door note (so the
// choice to leave for apt 4 is reachable from inside the room you stayed in)
const bedroomOneDoorBtn = document.getElementById('bedroom-one-memory-door');
if (bedroomOneDoorBtn) {
    bedroomOneDoorBtn.addEventListener('click', () => {
        closeBedroomOneMemory();
        const note = document.getElementById('door-note');
        const noteOverlay = document.getElementById('door-note-overlay');
        if (!note || !noteOverlay) return;
        note.classList.add('visible');
        noteOverlay.classList.add('visible');
        // re-bind yes/no in case the original handlers were already cleared
        const yesBtn = document.getElementById('note-yes');
        const noBtn = document.getElementById('note-no');
        if (yesBtn) {
            yesBtn.onclick = () => {
                note.classList.remove('visible');
                noteOverlay.classList.remove('visible');
                const door = document.getElementById('door-transition');
                if (door) door.classList.add('active');
                setTimeout(() => {
                    window.location.href = 'https://danielaaaas.github.io/expressiveweb/aptdos/apttres/aptcuatro/index.html';
                }, 1500);
            };
        }
        if (noBtn) {
            noBtn.onclick = () => {
                note.classList.remove('visible');
                noteOverlay.classList.remove('visible');
                openBedroomOneMemory();
            };
        }
    });
}

// ============================================================
// bedroom two memory vignette (apartment three) - emotionally familiar
// but partially forgotten. hover updates are slow. click fragments cut
// off mid-sentence (sometimes mid-word). some hotspots intentionally do
// not respond. memory fragments surface unprompted on a slow timer.
// the cork board, the photo on the desk, and the window scenery rotate
// per visit so the room "shifts between visits".
// ============================================================
const bedroomTwoMemoryHoverTips = {
    'hit-paint':     [
        'rectangles of slightly lighter paint. you remember things hung here. you do not remember the things.',
        'pin-holes in the wall. small wounds the room never closed.'
    ],
    'hit-window':    [
        'a window cropped at the edge. dusk over the rooftops.',
        'the window. a quiet night with a few lit windows in the distance.',
        'the window. pre-dawn. the horizon already warm.'
    ],
    'hit-pinboard':  [
        'a cork board. some things are still pinned. some things are not.',
        'the cork board. a museum of small intentions.',
        'the cork board. mostly pins now.'
    ],
    'hit-bed':       [
        'the corner of a bed, cropped at the edge. you slept here. you mostly slept here.',
        'the bed. you can almost remember which side was yours.'
    ],
    'hit-pillow':    [
        'a pillow. softer than it should be after this long.',
        'the pillow. the case is still the one she liked.'
    ],
    'hit-blanket':   [
        'a folded blanket. the green has gone gray.',
        'the blanket. you used to fold it the same way every night.'
    ],
    'hit-desk':      [
        'a small writing desk. the surface is mostly dust now.',
        'the desk. the wood remembers your elbows.'
    ],
    'hit-lamp':      [
        'a small desk lamp. the bulb gives less than it used to.',
        'the lamp. dim, but still warm.'
    ],
    'hit-books':     [
        'three stacked books. you remember reading one of them.',
        'a small stack of books. the titles have softened in your mind.'
    ],
    'hit-notebook':  [
        'an open notebook. a few lines you wrote on a tuesday.',
        'the notebook. you stopped writing in it without deciding to.'
    ],
    'hit-mug':       [
        'a small mug holding four pens. one of them still works.',
        'the mug. she gave it to you. or you bought it for yourself. one of those.'
    ],
    // hit-floor and hit-pin-empty intentionally have no entries - the
    // floor is not interesting enough to surface a tip, and the empty pin
    // belongs to a decoration that is no longer there. (see "no-response" set below.)
};

const bedroomTwoMemoryClickFragments = {
    'hit-paint':     [
        'there was a painting here. you remember the frame was thin and dark. the rest is\u2014',
        'something hung here for years. you remember it was\u2014 you remember it was\u2014'
    ],
    'hit-window':    [
        'the dusk through this window every night was the same color. the color was the color of\u2014',
        'you used to count the lit windows across the street. there was a number that meant something. the number was\u2014',
        'the pre-dawn light meant you had not slept. it meant you had been thinking about\u2014'
    ],
    'hit-pinboard':  [
        'the cork board was full once. the things on it were\u2014',
        'you pinned things here that mattered. they mattered because\u2014 they mattered.',
        'a list of names. a photograph. a ticket. you do not remember which was the one that\u2014'
    ],
    'hit-bed':       [
        'you slept here for years. you mostly slept on the side that\u2014',
        'the bed where you read until the sentences stopped making\u2014'
    ],
    'hit-pillow':    [
        'the pillow case used to smell like\u2014 it does not smell like that anymore.',
        'you used to put your hand under the pillow looking for\u2014'
    ],
    'hit-blanket':   [
        'she folded it in halves and then in halves again. she said it kept the\u2014 what did she sa\u2014',
        'the blanket was a gift the year that\u2014'
    ],
    'hit-desk':      [
        'the desk used to face the other\u2014',
        'you wrote a list on this desk once. the list was about\u2014',
        'the desk where you decided to\u2014 the desk where you decided not to.'
    ],
    'hit-lamp':      [
        'you turned this lamp on every night for\u2014 you do not remember the number of years.',
        'the bulb in this lamp is older than\u2014'
    ],
    'hit-books':     [
        'one of these books has your handwriting in the margin of page\u2014',
        'you read the top one in two days the summer that\u2014',
        'the bottom book belonged to\u2014 you cannot remember whose it was.'
    ],
    'hit-notebook':  [
        'on this page you wrote: "tomorrow i will\u2014" you did not.',
        'the last entry was a tuesday. the first sentence was about\u2014',
        'you stopped writing the day that\u2014'
    ],
    'hit-mug':       [
        'the pens in this mug worked once. now only the\u2014',
        'the mug has a chip on the back you cannot see from here. the chip is from the day\u2014'
    ],
    // hit-floor and hit-pin-empty intentionally are NOT in this map -
    // they will not respond to clicks at all.
};

// hotspots that intentionally do not respond - the user can hover over them
// but the room offers nothing back. embodies "some objects no longer respond".
const bedroomTwoNoResponseHotspots = new Set([
    'hit-pin-empty',
    'hit-floor'
]);

// fragments that surface ON THEIR OWN every 18-30 seconds while the
// vignette is open - "hidden fragments appear intermittently".
const bedroomTwoSurfacingFragments = [
    'something occurs to you and is gone before you can name it.',
    'the room remembers a tuesday in autumn.',
    'a name is almost on your tongue.',
    'the lamp was on the night that\u2014',
    'you can almost hear someone calling from the kitchen.',
    'the smell of bread, briefly. then nothing.',
    'a sentence half-finished, hanging in the air.',
    'a soft knock from a door that is not in this room.',
    'something on the cork board you do not remember pinning there.',
    'you remember a song. you do not remember the words.'
];

const B2_WINDOW_VARIANTS = ['b2-window-a', 'b2-window-b', 'b2-window-c'];
const B2_PIN_VARIANTS    = ['b2-pin-set-a', 'b2-pin-set-b', 'b2-pin-set-c'];
const BEDROOM_TWO_VISIT_KEY = 'bedroomtwo-apttres.visitCount';

let b2HumCtx = null;
let b2HumOscA = null;
let b2HumOscB = null;
let b2HumNoise = null;
let b2HumLfo = null;
let b2SurfacingTimerId = null;

function openBedroomTwoMemory() {
    const roomObject = document.getElementById('bedroom-two-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bedroom-two-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bedroom-two-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. some objects no longer respond. some sentences will not finish. fragments will surface on their own.';
    startBedroomTwoPad();
    setupBedroomTwoMemorySvgRuntime();
}

function closeBedroomTwoMemory() {
    const overlay = document.getElementById('bedroom-two-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (b2SurfacingTimerId) {
        clearTimeout(b2SurfacingTimerId);
        b2SurfacingTimerId = null;
    }
    stopBedroomTwoPad();
}

// a cooler pad than bedroom one (open fifth, hollow). slower LFO too,
// so the room tone breathes more sparingly - "ambient audio loops softly".
function startBedroomTwoPad() {
    stopBedroomTwoPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        b2HumCtx = new Ctx();

        const masterGain = b2HumCtx.createGain();
        masterGain.gain.value = 0.016;
        masterGain.connect(b2HumCtx.destination);

        // open fifth (low E + low B): hollow, evening-leaning
        b2HumOscA = b2HumCtx.createOscillator();
        b2HumOscA.type = 'sine';
        b2HumOscA.frequency.value = 82.4;
        const gainA = b2HumCtx.createGain();
        gainA.gain.value = 0.55;
        b2HumOscA.connect(gainA);
        gainA.connect(masterGain);

        b2HumOscB = b2HumCtx.createOscillator();
        b2HumOscB.type = 'sine';
        b2HumOscB.frequency.value = 123.5;
        const gainB = b2HumCtx.createGain();
        gainB.gain.value = 0.40;
        b2HumOscB.connect(gainB);
        gainB.connect(masterGain);

        // soft low-passed noise floor
        const bufferSize = 2 * b2HumCtx.sampleRate;
        const noiseBuffer = b2HumCtx.createBuffer(1, bufferSize, b2HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.40;
        }
        b2HumNoise = b2HumCtx.createBufferSource();
        b2HumNoise.buffer = noiseBuffer;
        b2HumNoise.loop = true;
        const noiseFilter = b2HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 260;
        const noiseGain = b2HumCtx.createGain();
        noiseGain.gain.value = 0.18;
        b2HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // very slow LFO (~24s period) for a sparse swelling room tone
        b2HumLfo = b2HumCtx.createOscillator();
        b2HumLfo.type = 'sine';
        b2HumLfo.frequency.value = 1 / 24;
        const lfoDepth = b2HumCtx.createGain();
        lfoDepth.gain.value = 0.010;
        b2HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        b2HumOscA.start();
        b2HumOscB.start();
        b2HumNoise.start();
        b2HumLfo.start();
        if (b2HumCtx.state === 'suspended') b2HumCtx.resume();
    } catch (_) {
        b2HumCtx = null;
        b2HumOscA = null;
        b2HumOscB = null;
        b2HumNoise = null;
        b2HumLfo = null;
    }
}

function stopBedroomTwoPad() {
    try {
        b2HumOscA?.stop();
        b2HumOscB?.stop();
        b2HumNoise?.stop();
        b2HumLfo?.stop();
        b2HumCtx?.close?.();
    } catch (_) {}
    b2HumOscA = null;
    b2HumOscB = null;
    b2HumNoise = null;
    b2HumLfo = null;
    b2HumCtx = null;
}

// optional soft "memory chime" played when an unprompted fragment surfaces -
// a single sine ping (quiet, slow attack/release).
function playBedroomTwoChime() {
    if (!b2HumCtx) return;
    try {
        const now = b2HumCtx.currentTime;
        const osc = b2HumCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 392; // soft G4
        const g = b2HumCtx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.020, now + 0.6);
        g.gain.linearRampToValueAtTime(0, now + 3.2);
        osc.connect(g);
        g.connect(b2HumCtx.destination);
        osc.start(now);
        osc.stop(now + 3.4);
    } catch (_) {}
}

function applyBedroomTwoRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BEDROOM_TWO_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BEDROOM_TWO_VISIT_KEY, String(visits)); } catch (_) {}

    // window scenery: dusk -> night -> pre-dawn
    const windowIdx = (visits - 1) % B2_WINDOW_VARIANTS.length;
    B2_WINDOW_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === windowIdx ? 'visible' : 'hidden');
    });

    // cork board contents shift between visits, offset so it doesn't
    // align with the window cycle
    const pinIdx = (visits + 1) % B2_PIN_VARIANTS.length;
    B2_PIN_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === pinIdx ? 'visible' : 'hidden');
    });

    return { windowIdx, pinIdx, visits };
}

function pickBedroomTwoFragment(map, hotspotId, state) {
    const arr = map[hotspotId];
    if (!arr || !Array.isArray(arr)) return null;
    const idx = (state[hotspotId] ?? 0) % arr.length;
    state[hotspotId] = idx + 1;
    return arr[idx];
}

function setupBedroomTwoMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroom-two-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const rotations = applyBedroomTwoRotations(svgDoc);
        svgRoot._b2Rotations = rotations;

        if (svgRoot.dataset.b2Bound === 'true') {
            scheduleBedroomTwoSurfacing();
            return;
        }

        const tipEl = document.getElementById('bedroom-two-memory-tip');
        const defaultTip = 'hover and click to remember. some objects no longer respond. some sentences will not finish. fragments will surface on their own.';

        const hoverState = {};
        const clickState = {};

        let pendingTipTimer = null;
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 520);
        };
        const setTipImmediate = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('fading');
            tipEl.classList.remove('surfacing');
            tipEl.textContent = text;
        };
        const setTipSurfacing = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                tipEl.classList.add('surfacing');
                // hold a few seconds, then fade back to the default tip
                setTimeout(() => {
                    if (!document.getElementById('bedroom-two-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 3400);
                pendingTipTimer = null;
            }, 520);
        };
        // expose so the recurring surfacing timer can use it
        svgRoot._b2SetTipSurfacing = setTipSurfacing;

        // bind hover/click for every interactive hotspot
        Object.keys(bedroomTwoMemoryHoverTips).forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                if (hotspotId === 'hit-window') {
                    const idx = (svgRoot._b2Rotations || {}).windowIdx ?? 0;
                    setTipSlow(bedroomTwoMemoryHoverTips['hit-window'][idx] || defaultTip);
                } else if (hotspotId === 'hit-pinboard') {
                    const idx = (svgRoot._b2Rotations || {}).pinIdx ?? 0;
                    setTipSlow(bedroomTwoMemoryHoverTips['hit-pinboard'][idx] || defaultTip);
                } else {
                    const next = pickBedroomTwoFragment(bedroomTwoMemoryHoverTips, hotspotId, hoverState);
                    if (next) setTipSlow(next);
                }
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                // every fourth click on responsive hotspots silently fails -
                // some attempts to remember just don't surface anything.
                clickState[`${hotspotId}__attempts`] = (clickState[`${hotspotId}__attempts`] || 0) + 1;
                if (clickState[`${hotspotId}__attempts`] % 4 === 0) return;
                const next = pickBedroomTwoFragment(bedroomTwoMemoryClickFragments, hotspotId, clickState);
                if (next) setTipImmediate(next);
            });
        });

        // bind the explicitly non-responsive hotspots: hover triggers nothing,
        // cursor stays default, click is silently swallowed.
        bedroomTwoNoResponseHotspots.forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'default';
            hotspot.addEventListener('click', (event) => event.stopPropagation());
        });

        svgRoot.dataset.b2Bound = 'true';
        scheduleBedroomTwoSurfacing();
    };

    if (!roomObject.dataset.b2LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.b2LoadHooked = 'true';
    }
    bind();
}

// schedules a hidden fragment to surface on its own every 18-32 seconds
function scheduleBedroomTwoSurfacing() {
    if (b2SurfacingTimerId) clearTimeout(b2SurfacingTimerId);
    const overlay = document.getElementById('bedroom-two-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 18000 + Math.floor(Math.random() * 14000);
    b2SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('bedroom-two-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('bedroom-two-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = bedroomTwoSurfacingFragments[Math.floor(Math.random() * bedroomTwoSurfacingFragments.length)];
        if (svgRoot?._b2SetTipSurfacing) {
            svgRoot._b2SetTipSurfacing(fragment);
            playBedroomTwoChime();
        }
        scheduleBedroomTwoSurfacing();
    }, wait);
}

const bedroomTwoCloseBtn = document.getElementById('bedroom-two-memory-close');
if (bedroomTwoCloseBtn) bedroomTwoCloseBtn.addEventListener('click', closeBedroomTwoMemory);

// ============================================================
// bedroom three memory vignette (apartment three) - several time
// periods softly overlapping. warmer + more wistful than bedroom one
// or two of this apartment. hover responses are slow. clicking the same
// object cycles through fragments that are *almost* the same memory but
// recalled slightly differently each time ("some dialogue repeats
// differently"). the window scenery, the alarm clock + smartphone +
// other "era anchor" objects, and the ghost outline of a piece of
// furniture that no longer lives here all rotate per visit. an ambient
// fragment occasionally surfaces on its own, very gently.
// ============================================================
const bedroomThreeMemoryHoverTips = {
    'hit-window':   [
        'a window. a spring afternoon you remember being smaller in.',
        'a window. a city at night you remember staying up to look at.',
        'a window. a dusk that could be from any of the last few years.'
    ],
    'hit-paint':    [
        'three rectangles of un-faded paint. one of them was a calendar.',
        'pin holes and tape ghosts. things hung here in different decades. you do not remember which year was which.',
        'the wall remembers things you pinned up at thirteen, at twenty-two, at thirty.'
    ],
    'hit-ghost':    [
        'a faint outline of something that used to live here. you cannot quite see it.',
        'something used to take up this corner. you can almost remember it.',
        'a piece of furniture that left at some point. the wall still keeps its shape.'
    ],
    'hit-mirror':   [
        'a small framed mirror. the silhouette inside is yours, almost.',
        'the mirror. your reflection takes a moment to catch up to you.',
        'the mirror. the person in it is moving a beat behind you.'
    ],
    'hit-photo':    [
        'a small photograph pinned to the wall. you cannot remember the year, exactly.',
        'a photograph. a face you have known in several different lives.',
        'a photograph from one of the years you mostly remember.'
    ],
    'hit-lamp':     [
        'a small lamp. the warmest light in the room.',
        'the lamp. the shade has yellowed a little since you last looked.',
        'the lamp. you have turned this lamp on for years without thinking.'
    ],
    'hit-toy':      [
        'a small wooden rocking horse. a toy from very early on.',
        'the rocking horse. you remember when the paint on it was brighter.',
        'the rocking horse. it has lived in three different apartments now.'
    ],
    'hit-records':  [
        'a vinyl, a cassette, a cd. a stack from three different decades.',
        'the records. the cassette on top still has her handwriting on the label.',
        'a stack of music in three different formats. you remember loving each one.'
    ],
    'hit-clock':    [
        'a small wind-up alarm clock. it still ticks, mostly.',
        'the alarm clock. it was already old when you got it.',
        'the clock. brass bells. you used to wind it on sundays.'
    ],
    'hit-phone':    [
        'a phone, screen still glowing. the year on the lock screen is recent.',
        'the phone. a notification you keep meaning to read.',
        'the phone. it does not belong in this room with the others, and yet.'
    ],
    'hit-book':     [
        'a paperback. the spine is cracked at the part you read twice.',
        'a recent book. you started it last month. or the month before.',
        'the book. you keep it here so you remember to come back to it.'
    ],
    'hit-dresser':  [
        'a low walnut dresser. things from different years sit on top of it.',
        'the dresser. it has held different objects in different decades.',
        'the dresser. it has been moved across at least two apartments.'
    ],
    'hit-boxes':    [
        'three stacked storage boxes. the labels are faded into nothing.',
        'the boxes. you packed them in different years. you keep meaning to open them.',
        'the boxes. one of them is from a move you can no longer remember the date of.'
    ],
    'hit-pillow':   [
        'a pillow with a soft pink case. the case is from a different year than the pillow.',
        'the pillow. the case is the one she liked. the pillow is older than that.'
    ],
    'hit-quilt':    [
        'a patchwork quilt. each square is from a different fabric. each fabric is from a different year.',
        'the quilt. someone made it from things that already meant something.',
        'the quilt. a small museum of fabrics that used to be other things.'
    ],
    'hit-bed':      [
        'the corner of a bed. the same bed in several different rooms now.',
        'the bed. you remember falling asleep here in at least three different lives.'
    ],
    'hit-floor':    [
        'warm wood floor. the boards are warmer where the lamp pools light.',
        'the floor. the same boards have held a few different rugs over the years.'
    ]
};

const bedroomThreeMemoryClickFragments = {
    'hit-window':   [
        'the spring afternoon. you were\u2014 you were probably eight. the light through this window then was\u2014',
        'the city at night through this window. you stayed up to listen to it. you were maybe seventeen and you were\u2014',
        'the dusk. you stood at this window last week. or last year. it was the same dusk, mostly. you were thinking about\u2014'
    ],
    'hit-paint':    [
        'the calendar from the year that\u2014 you flipped the page on a tuesday and found out\u2014',
        'a photograph hung here once. you remember taking it down the week that\u2014',
        'a child\'s drawing was taped here for a while. it was a drawing of\u2014'
    ],
    'hit-ghost':    [
        'a chair sat here. you sat in it the night that\u2014',
        'a small bookshelf lived against this wall. the second-to-bottom shelf held\u2014',
        'a calendar hung here. the year it was open to was the year that\u2014'
    ],
    'hit-mirror':   [
        'you turn your head and it turns its head a moment after. the moment after is\u2014',
        'you raise your hand and the silhouette raises its hand and you both stop and\u2014',
        'sometimes the reflection is older. sometimes it is younger. tonight it is\u2014'
    ],
    'hit-photo':    [
        'this photograph is from the year that\u2014 you cannot remember which year exactly.',
        'someone you used to\u2014 someone you still\u2014',
        'you took this photograph. the day was\u2014 you remember the light, mostly.'
    ],
    'hit-lamp':     [
        'you have turned this lamp on through several different addresses now. each address\u2014',
        'the bulb has been changed only twice. the second time was\u2014',
        'you used to read under this lamp every night the year that\u2014'
    ],
    'hit-toy':      [
        'someone gave it to you. you cannot remember which someone, exactly. they\u2014',
        'you used to push it across the floor. you can almost feel the weight of\u2014',
        'the paint on its mane is the original paint. it has lasted longer than\u2014'
    ],
    'hit-records':  [
        'the vinyl on the bottom of the stack is the one you played the night that\u2014',
        'the cassette on top has her handwriting. the title is\u2014 you cannot quite read it from here.',
        'the cd is one she lent you. you did not give it back because\u2014'
    ],
    'hit-clock':    [
        'you wound this clock every sunday for years until\u2014',
        'the bells on top used to ring. they stopped ringing the year that\u2014',
        'the time on the dial is wrong. the time has been wrong since\u2014'
    ],
    'hit-phone':    [
        'the notification on the screen is from\u2014 you do not want to read it just now.',
        'a message from someone you did not text back. the message was\u2014',
        'a photograph from this morning. or last week. they have started to look the same when\u2014'
    ],
    'hit-book':     [
        'you read up to page\u2014 you keep meaning to go back to it. the chapter was about\u2014',
        'someone gave it to you with a note in the front. the note said\u2014',
        'you started this book on a tuesday. by the next tuesday you had\u2014'
    ],
    'hit-dresser':  [
        'the dresser used to face the other way. you turned it around the year that\u2014',
        'the bottom drawer holds things you stopped opening because\u2014',
        'this dresser was your mother\'s. then it was yours. then it was\u2014'
    ],
    'hit-boxes':    [
        'the bottom box is from the move where you\u2014',
        'the middle box has things you packed in a hurry the night that\u2014',
        'the top box is the one you keep opening and closing without\u2014'
    ],
    'hit-pillow':   [
        'the case is the one she liked. she said the color reminded her of\u2014',
        'you used to put your hand under it looking for\u2014'
    ],
    'hit-quilt':    [
        'the small floral square in the middle is from her grandmother\'s\u2014',
        'the green-grey patch is from a coat you wore the year that\u2014',
        'the brown patch is from a curtain that hung in the kitchen of\u2014'
    ],
    'hit-bed':      [
        'you have slept on this bed in at least three different rooms now. one of those rooms was\u2014',
        'the bed where you read until the words went soft and then you\u2014'
    ],
    'hit-floor':    [
        'a rug used to live here. it was warmer than the floor. the rug was\u2014',
        'you used to sit on this floor in the afternoon and\u2014'
    ]
};

// fragments that surface ON THEIR OWN every 22-36 seconds while the
// vignette is open - very gentle, "ambient sounds fade softly in and out".
const bedroomThreeSurfacingFragments = [
    'a year occurs to you and is gone before you can name it.',
    'the smell of a kitchen from a different apartment, briefly.',
    'a song from one of the years that lived in this room.',
    'someone calling your name from a room that is not in this room.',
    'a season changes outside the window without warning.',
    'a thought you used to have, in a younger voice.',
    'the lamp warms a little, as if someone turned it up a year ago.',
    'a memory that is not yours, briefly. then your own.',
    'two different afternoons sit on top of each other for a moment.',
    'a small sound from a room you used to live in.'
];

const B3_WINDOW_VARIANTS = ['b3-window-a', 'b3-window-b', 'b3-window-c'];
const B3_GHOST_VARIANTS  = ['b3-ghost-a',  'b3-ghost-b',  'b3-ghost-c'];
const BEDROOM_THREE_VISIT_KEY = 'bedroomthree-apttres.visitCount';

let b3HumCtx = null;
let b3HumOscA = null;
let b3HumOscB = null;
let b3HumOscC = null;
let b3HumNoise = null;
let b3HumLfo = null;
let b3SurfacingTimerId = null;

function openBedroomThreeMemory() {
    const roomObject = document.getElementById('bedroom-three-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bedroom-three-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bedroom-three-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. several years live in this room at once. some sentences will repeat themselves a little differently.';
    startBedroomThreePad();
    setupBedroomThreeMemorySvgRuntime();
}

function closeBedroomThreeMemory() {
    const overlay = document.getElementById('bedroom-three-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (b3SurfacingTimerId) {
        clearTimeout(b3SurfacingTimerId);
        b3SurfacingTimerId = null;
    }
    stopBedroomThreePad();
}

// a warm major-third pad (low C + low E + soft G fifth above) - more openly
// nostalgic than B1's minor third or B2's hollow open fifth. slow LFO swell
// on the master gain so the room tone fades softly in and out on its own.
function startBedroomThreePad() {
    stopBedroomThreePad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        b3HumCtx = new Ctx();

        const masterGain = b3HumCtx.createGain();
        masterGain.gain.value = 0.018;
        masterGain.connect(b3HumCtx.destination);

        // C2 + E2 (warm major third)
        b3HumOscA = b3HumCtx.createOscillator();
        b3HumOscA.type = 'sine';
        b3HumOscA.frequency.value = 65.4;
        const gainA = b3HumCtx.createGain();
        gainA.gain.value = 0.55;
        b3HumOscA.connect(gainA);
        gainA.connect(masterGain);

        b3HumOscB = b3HumCtx.createOscillator();
        b3HumOscB.type = 'sine';
        b3HumOscB.frequency.value = 82.4;
        const gainB = b3HumCtx.createGain();
        gainB.gain.value = 0.42;
        b3HumOscB.connect(gainB);
        gainB.connect(masterGain);

        // a quiet G3 fifth above for openness/warmth
        b3HumOscC = b3HumCtx.createOscillator();
        b3HumOscC.type = 'sine';
        b3HumOscC.frequency.value = 196;
        const gainC = b3HumCtx.createGain();
        gainC.gain.value = 0.12;
        b3HumOscC.connect(gainC);
        gainC.connect(masterGain);

        // soft low-passed noise floor (warm late-afternoon room tone)
        const bufferSize = 2 * b3HumCtx.sampleRate;
        const noiseBuffer = b3HumCtx.createBuffer(1, bufferSize, b3HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.42;
        }
        b3HumNoise = b3HumCtx.createBufferSource();
        b3HumNoise.buffer = noiseBuffer;
        b3HumNoise.loop = true;
        const noiseFilter = b3HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 280;
        const noiseGain = b3HumCtx.createGain();
        noiseGain.gain.value = 0.20;
        b3HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // slow LFO (~20s period) - the room tone fades in and out
        b3HumLfo = b3HumCtx.createOscillator();
        b3HumLfo.type = 'sine';
        b3HumLfo.frequency.value = 1 / 20;
        const lfoDepth = b3HumCtx.createGain();
        lfoDepth.gain.value = 0.012;
        b3HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        b3HumOscA.start();
        b3HumOscB.start();
        b3HumOscC.start();
        b3HumNoise.start();
        b3HumLfo.start();
        if (b3HumCtx.state === 'suspended') b3HumCtx.resume();
    } catch (_) {
        b3HumCtx = null;
        b3HumOscA = null;
        b3HumOscB = null;
        b3HumOscC = null;
        b3HumNoise = null;
        b3HumLfo = null;
    }
}

function stopBedroomThreePad() {
    try {
        b3HumOscA?.stop();
        b3HumOscB?.stop();
        b3HumOscC?.stop();
        b3HumNoise?.stop();
        b3HumLfo?.stop();
        b3HumCtx?.close?.();
    } catch (_) {}
    b3HumOscA = null;
    b3HumOscB = null;
    b3HumOscC = null;
    b3HumNoise = null;
    b3HumLfo = null;
    b3HumCtx = null;
}

// soft chime when an unprompted fragment surfaces - warmer than B2's
// (an octave higher with a longer release).
function playBedroomThreeChime() {
    if (!b3HumCtx) return;
    try {
        const now = b3HumCtx.currentTime;
        const osc = b3HumCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 523.25; // soft C5
        const g = b3HumCtx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.018, now + 0.7);
        g.gain.linearRampToValueAtTime(0, now + 3.6);
        osc.connect(g);
        g.connect(b3HumCtx.destination);
        osc.start(now);
        osc.stop(now + 3.8);
    } catch (_) {}
}

function applyBedroomThreeRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BEDROOM_THREE_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BEDROOM_THREE_VISIT_KEY, String(visits)); } catch (_) {}

    // window scenery: spring afternoon -> teen night -> recent dusk
    const windowIdx = (visits - 1) % B3_WINDOW_VARIANTS.length;
    B3_WINDOW_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === windowIdx ? 'visible' : 'hidden');
    });

    // ghost outline: calendar -> bookshelf -> chair (offset so it does not
    // align with the window cycle - the room "shifts between visits")
    const ghostIdx = (visits + 1) % B3_GHOST_VARIANTS.length;
    B3_GHOST_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === ghostIdx ? 'visible' : 'hidden');
    });

    return { windowIdx, ghostIdx, visits };
}

function pickBedroomThreeFragment(map, hotspotId, state) {
    const arr = map[hotspotId];
    if (!arr || !Array.isArray(arr)) return null;
    const idx = (state[hotspotId] ?? 0) % arr.length;
    state[hotspotId] = idx + 1;
    return arr[idx];
}

function setupBedroomThreeMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroom-three-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const rotations = applyBedroomThreeRotations(svgDoc);
        svgRoot._b3Rotations = rotations;

        if (svgRoot.dataset.b3Bound === 'true') {
            scheduleBedroomThreeSurfacing();
            return;
        }

        const tipEl = document.getElementById('bedroom-three-memory-tip');
        const defaultTip = 'hover and click to remember. several years live in this room at once. some sentences will repeat themselves a little differently.';

        const hoverState = {};
        const clickState = {};

        let pendingTipTimer = null;
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 480);
        };
        const setTipImmediate = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('fading');
            tipEl.classList.remove('surfacing');
            tipEl.textContent = text;
        };
        const setTipSurfacing = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                tipEl.classList.add('surfacing');
                setTimeout(() => {
                    if (!document.getElementById('bedroom-three-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 3600);
                pendingTipTimer = null;
            }, 520);
        };
        svgRoot._b3SetTipSurfacing = setTipSurfacing;

        // bind hover + click for every interactive hotspot. clicking the
        // same object cycles through fragments that are *almost* the same
        // memory recalled slightly differently each time -- the click
        // map's arrays do that naturally.
        Object.keys(bedroomThreeMemoryHoverTips).forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                if (hotspotId === 'hit-window') {
                    const idx = (svgRoot._b3Rotations || {}).windowIdx ?? 0;
                    setTipSlow(bedroomThreeMemoryHoverTips['hit-window'][idx] || defaultTip);
                } else if (hotspotId === 'hit-ghost') {
                    const idx = (svgRoot._b3Rotations || {}).ghostIdx ?? 0;
                    setTipSlow(bedroomThreeMemoryHoverTips['hit-ghost'][idx] || defaultTip);
                } else {
                    const next = pickBedroomThreeFragment(bedroomThreeMemoryHoverTips, hotspotId, hoverState);
                    if (next) setTipSlow(next);
                }
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = pickBedroomThreeFragment(bedroomThreeMemoryClickFragments, hotspotId, clickState);
                if (next) setTipImmediate(next);
            });
        });

        svgRoot.dataset.b3Bound = 'true';
        scheduleBedroomThreeSurfacing();
    };

    if (!roomObject.dataset.b3LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.b3LoadHooked = 'true';
    }
    bind();
}

// schedules a hidden fragment to surface on its own every 22-36 seconds
function scheduleBedroomThreeSurfacing() {
    if (b3SurfacingTimerId) clearTimeout(b3SurfacingTimerId);
    const overlay = document.getElementById('bedroom-three-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 22000 + Math.floor(Math.random() * 14000);
    b3SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('bedroom-three-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('bedroom-three-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = bedroomThreeSurfacingFragments[Math.floor(Math.random() * bedroomThreeSurfacingFragments.length)];
        if (svgRoot?._b3SetTipSurfacing) {
            svgRoot._b3SetTipSurfacing(fragment);
            playBedroomThreeChime();
        }
        scheduleBedroomThreeSurfacing();
    }, wait);
}

const bedroomThreeCloseBtn = document.getElementById('bedroom-three-memory-close');
if (bedroomThreeCloseBtn) bedroomThreeCloseBtn.addEventListener('click', closeBedroomThreeMemory);

// ============================================================
// bathroom memory vignette (apartment three) - faded warmth, humid
// quiet, fragments lingering in the mirror. hover responses are slow.
// click fragments cycle per object (incomplete thoughts). the mirror
// reflection rotates per visit between the current bathroom and
// glimpses of earlier apartments. the condensation patches surface
// different fragmented finger-written sentences each visit. an ambient
// fragment occasionally surfaces in the steam on its own, with a
// soft water-drop chime.
// ============================================================
const bathroomMemoryHoverTips = {
    'hit-mirror':       [
        'a mirror. your reflection takes a moment to look back.',
        'the mirror. the silhouette in it is yours, mostly.',
        'the mirror. the room behind the silhouette is not always this room.'
    ],
    'hit-frame':        [
        'a brass frame. it has been polished by hands you no longer count.',
        'the frame. the corners are worn smooth where you used to brace yourself against it.'
    ],
    'hit-condensation': [
        'condensation on the glass. someone wrote in it once. some of the letters are still there.',
        'fingerwriting in the steam. mostly faded.',
        'a sentence in the fog. you can almost read the rest of it.'
    ],
    'hit-light':        [
        'a small wall sconce. three soft bulbs. the warmth shifts a little when you are not looking.',
        'the light. dimmer in the late evening than it used to be.',
        'the bulbs. one of them is the one you replaced the year that you stopped counting.'
    ],
    'hit-towel':        [
        'a hand towel on a short bar. dusty rose. her color.',
        'the towel. the same towel for several years now. it has outlived a lot.',
        'the towel. the small embroidered initial is still legible if you look.'
    ],
    'hit-tile':         [
        'small pink subway tile. a few grout lines a little darker than the rest.',
        'the tile. you remember the day it was new. you do not remember the year exactly.'
    ],
    'hit-soap':         [
        'a bar of soap on a small dish. the brand stamp has worn down to a smudge.',
        'the soap. the same kind she used to buy. you keep buying it.'
    ],
    'hit-toothbrush':   [
        'a chipped cup with two toothbrushes. one pink. one blue.',
        'the cup. the chip on the rim has been there longer than either toothbrush.',
        'two toothbrushes. only one of them is currently in use.'
    ],
    'hit-bottle':       [
        'a bottle. the label has rubbed down to a few smudges.',
        'a worn product bottle. you cannot remember when you bought it.',
        'the bottle. the corner of the label has finally lifted.'
    ],
    'hit-washcloth':    [
        'a folded washcloth. still slightly damp from this morning.',
        'the washcloth. neatly folded. you fold them this way without thinking.'
    ],
    'hit-faucet':       [
        'a small brass faucet. it drips a little, very softly, when nobody is listening.',
        'the faucet. the handles are looser than they used to be.'
    ],
    'hit-stains':       [
        'water stains around the faucet. you keep meaning to wipe them.',
        'soft water rings around the base. they have outlasted several attempts to clean them.'
    ],
    'hit-sink':         [
        'a soft cream sink basin. the drain is darker where the years have pooled.',
        'the sink. the basin is shallower than it looks, somehow.'
    ],
    'hit-counter':      [
        'a cream counter. a faint marble vein the same color as your hair when you were small.',
        'the counter. cool to the palm. you have leaned on it enough mornings to remember.'
    ]
};

const bathroomMemoryClickFragments = {
    'hit-mirror':       [
        'you tilt your head and the silhouette tilts its head a moment after. the moment after is\u2014',
        'the room behind your reflection is not the room you are standing in. the room behind it is\u2014',
        'sometimes the mirror remembers a different bathroom. sometimes that bathroom is from\u2014'
    ],
    'hit-frame':        [
        'the brass on this frame was polished by\u2014 you do not remember whose hands.',
        'the frame is from her. she said it had been her grandmother\'s once. her grandmother said\u2014'
    ],
    'hit-condensation': [
        'the rest of this sentence used to be\u2014 you cannot make out the last word.',
        'someone wrote this in the steam years ago. the someone was\u2014',
        'finger marks in the fog. they are from a morning you thought you had\u2014'
    ],
    'hit-light':        [
        'the bulb on the left has not been changed since\u2014 you cannot remember the year.',
        'the warmth of these bulbs reminds you of\u2014',
        'you turned this light on every morning of the year that\u2014'
    ],
    'hit-towel':        [
        'her color. she liked it because\u2014',
        'the embroidered letter was added by\u2014 you remember the afternoon she did it.',
        'this towel has hung on this bar through several different\u2014'
    ],
    'hit-tile':         [
        'the day they put this tile in, you and she were\u2014',
        'the slightly darker grout near the corner is from a leak the year that\u2014',
        'one of these tiles is loose if you press it. you found out the night that\u2014'
    ],
    'hit-soap':         [
        'she used this soap. you keep buying it because\u2014',
        'the smell of it is from the morning that\u2014'
    ],
    'hit-toothbrush':   [
        'the blue one is hers. it has been hers for\u2014 you keep replacing it without saying.',
        'you stopped using one of these on the day that\u2014',
        'the chip on the cup is from a tuesday. you were\u2014'
    ],
    'hit-bottle':       [
        'the label said\u2014 you can almost read the brand. the brand was\u2014',
        'you have had this bottle since the move that\u2014',
        'she used the last good handful out of this on a sunday in\u2014'
    ],
    'hit-washcloth':    [
        'you fold them this way because she folded them this way. she folded them this way because\u2014',
        'a damp patch in the corner. from this morning. or from\u2014'
    ],
    'hit-faucet':       [
        'this faucet has dripped at night for\u2014 you do not remember which year it started.',
        'you tightened the handle with a wrench the day that\u2014',
        'the drip used to wake you. you stopped hearing it the year that\u2014'
    ],
    'hit-stains':       [
        'these rings have been here since\u2014 you keep meaning to.',
        'a stain shaped like\u2014 you used to think it looked like a face.'
    ],
    'hit-sink':         [
        'you washed your hands here every night for the years that\u2014',
        'the basin held all the small things you said into your palms when\u2014'
    ],
    'hit-counter':      [
        'you leaned here, both palms, the morning that\u2014',
        'the marble vein is the color of\u2014 it always reminded you of\u2014'
    ]
};

// fragments that surface ON THEIR OWN every 22-36 seconds while the
// vignette is open - a sentence forming briefly in the steam and fading.
const bathroomMemorySurfacingFragments = [
    'the steam writes something on the mirror and erases itself.',
    'a faucet drips somewhere in a bathroom you do not live in anymore.',
    'a fragment of her humming, briefly. then nothing.',
    'the warmth of the room shifts a little, the way it used to.',
    'a sentence finger-written in the fog years ago resurfaces for a beat.',
    'the smell of the soap she used to buy.',
    'the mirror remembers a face from one of the apartments before.',
    'water running, far away. then quiet again.',
    'the light dims a notch and warms back up.',
    'a small towel folds itself the way she used to fold it.'
];

const BA_MIRROR_VARIANTS = ['ba-mirror-a', 'ba-mirror-b', 'ba-mirror-c'];
const BA_COND_VARIANTS   = ['ba-cond-a',   'ba-cond-b',   'ba-cond-c'];
const BATHROOM_VISIT_KEY = 'bathroom-apttres.visitCount';

let baHumCtx = null;
let baHumOscA = null;
let baHumOscB = null;
let baHumNoise = null;
let baHumLfo = null;
let baSurfacingTimerId = null;

function openBathroomMemory() {
    const roomObject = document.getElementById('bathroom-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bathroom-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bathroom-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. the mirror takes a moment to catch up. fragments may surface in the steam on their own.';
    startBathroomPad();
    setupBathroomMemorySvgRuntime();
}

function closeBathroomMemory() {
    const overlay = document.getElementById('bathroom-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (baSurfacingTimerId) {
        clearTimeout(baSurfacingTimerId);
        baSurfacingTimerId = null;
    }
    stopBathroomPad();
}

// a soft warm fan/hum: a low rumble for the bathroom fan + a slightly
// higher resonant warmth, with a low-passed noise floor and a slow LFO
// swelling the master gain so the hum fades softly in and out.
function startBathroomPad() {
    stopBathroomPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        baHumCtx = new Ctx();

        const masterGain = baHumCtx.createGain();
        masterGain.gain.value = 0.018;
        masterGain.connect(baHumCtx.destination);

        // low fan rumble (~70 Hz)
        baHumOscA = baHumCtx.createOscillator();
        baHumOscA.type = 'sine';
        baHumOscA.frequency.value = 70;
        const gainA = baHumCtx.createGain();
        gainA.gain.value = 0.55;
        baHumOscA.connect(gainA);
        gainA.connect(masterGain);

        // a quiet warm partial above
        baHumOscB = baHumCtx.createOscillator();
        baHumOscB.type = 'sine';
        baHumOscB.frequency.value = 220;
        baHumOscB.detune.value = 6;
        const gainB = baHumCtx.createGain();
        gainB.gain.value = 0.10;
        baHumOscB.connect(gainB);
        gainB.connect(masterGain);

        // soft low-passed noise floor (humid air / ventilation)
        const bufferSize = 2 * baHumCtx.sampleRate;
        const noiseBuffer = baHumCtx.createBuffer(1, bufferSize, baHumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.50;
        }
        baHumNoise = baHumCtx.createBufferSource();
        baHumNoise.buffer = noiseBuffer;
        baHumNoise.loop = true;
        const noiseFilter = baHumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 320;
        const noiseGain = baHumCtx.createGain();
        noiseGain.gain.value = 0.24;
        baHumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // slow LFO (~22s period) - the hum fades softly in and out
        baHumLfo = baHumCtx.createOscillator();
        baHumLfo.type = 'sine';
        baHumLfo.frequency.value = 1 / 22;
        const lfoDepth = baHumCtx.createGain();
        lfoDepth.gain.value = 0.011;
        baHumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        baHumOscA.start();
        baHumOscB.start();
        baHumNoise.start();
        baHumLfo.start();
        if (baHumCtx.state === 'suspended') baHumCtx.resume();
    } catch (_) {
        baHumCtx = null;
        baHumOscA = null;
        baHumOscB = null;
        baHumNoise = null;
        baHumLfo = null;
    }
}

function stopBathroomPad() {
    try {
        baHumOscA?.stop();
        baHumOscB?.stop();
        baHumNoise?.stop();
        baHumLfo?.stop();
        baHumCtx?.close?.();
    } catch (_) {}
    baHumOscA = null;
    baHumOscB = null;
    baHumNoise = null;
    baHumLfo = null;
    baHumCtx = null;
}

// a small water-drop "plink" played when an unprompted fragment surfaces -
// a quick pitched tone with a fast attack and a short tail.
function playBathroomDrip() {
    if (!baHumCtx) return;
    try {
        const now = baHumCtx.currentTime;
        const osc = baHumCtx.createOscillator();
        osc.type = 'sine';
        // pitch sweeps down quickly (drop into water)
        osc.frequency.setValueAtTime(820, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.18);
        const g = baHumCtx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.024, now + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0005, now + 0.55);
        osc.connect(g);
        g.connect(baHumCtx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
    } catch (_) {}
}

function applyBathroomRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BATHROOM_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BATHROOM_VISIT_KEY, String(visits)); } catch (_) {}

    // mirror reflection: current room -> apt-1 echo -> apt-2 echo
    const mirrorIdx = (visits - 1) % BA_MIRROR_VARIANTS.length;
    BA_MIRROR_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === mirrorIdx ? 'visible' : 'hidden');
    });

    // condensation text: rotated so the message and the reflection are
    // not always paired the same way (the room shifts between visits)
    const condIdx = (visits + 1) % BA_COND_VARIANTS.length;
    BA_COND_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === condIdx ? 'visible' : 'hidden');
    });

    return { mirrorIdx, condIdx, visits };
}

function pickBathroomFragment(map, hotspotId, state) {
    const arr = map[hotspotId];
    if (!arr || !Array.isArray(arr)) return null;
    const idx = (state[hotspotId] ?? 0) % arr.length;
    state[hotspotId] = idx + 1;
    return arr[idx];
}

function setupBathroomMemorySvgRuntime() {
    const roomObject = document.getElementById('bathroom-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const rotations = applyBathroomRotations(svgDoc);
        svgRoot._baRotations = rotations;

        if (svgRoot.dataset.baBound === 'true') {
            scheduleBathroomSurfacing();
            return;
        }

        const tipEl = document.getElementById('bathroom-memory-tip');
        const defaultTip = 'hover and click to remember. the mirror takes a moment to catch up. fragments may surface in the steam on their own.';

        const hoverState = {};
        const clickState = {};

        let pendingTipTimer = null;
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 480);
        };
        const setTipImmediate = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('fading');
            tipEl.classList.remove('surfacing');
            tipEl.textContent = text;
        };
        const setTipSurfacing = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                tipEl.classList.add('surfacing');
                setTimeout(() => {
                    if (!document.getElementById('bathroom-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 3600);
                pendingTipTimer = null;
            }, 520);
        };
        svgRoot._baSetTipSurfacing = setTipSurfacing;

        // bind hover + click for every interactive hotspot
        Object.keys(bathroomMemoryHoverTips).forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                if (hotspotId === 'hit-mirror') {
                    const idx = (svgRoot._baRotations || {}).mirrorIdx ?? 0;
                    setTipSlow(bathroomMemoryHoverTips['hit-mirror'][idx] || defaultTip);
                } else if (hotspotId === 'hit-condensation') {
                    const idx = (svgRoot._baRotations || {}).condIdx ?? 0;
                    setTipSlow(bathroomMemoryHoverTips['hit-condensation'][idx] || defaultTip);
                } else {
                    const next = pickBathroomFragment(bathroomMemoryHoverTips, hotspotId, hoverState);
                    if (next) setTipSlow(next);
                }
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = pickBathroomFragment(bathroomMemoryClickFragments, hotspotId, clickState);
                if (next) setTipImmediate(next);
            });
        });

        svgRoot.dataset.baBound = 'true';
        scheduleBathroomSurfacing();
    };

    if (!roomObject.dataset.baLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.baLoadHooked = 'true';
    }
    bind();
}

// schedules a hidden fragment to surface on its own every 22-36 seconds
function scheduleBathroomSurfacing() {
    if (baSurfacingTimerId) clearTimeout(baSurfacingTimerId);
    const overlay = document.getElementById('bathroom-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 22000 + Math.floor(Math.random() * 14000);
    baSurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('bathroom-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('bathroom-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = bathroomMemorySurfacingFragments[Math.floor(Math.random() * bathroomMemorySurfacingFragments.length)];
        if (svgRoot?._baSetTipSurfacing) {
            svgRoot._baSetTipSurfacing(fragment);
            playBathroomDrip();
        }
        scheduleBathroomSurfacing();
    }, wait);
}

const bathroomCloseBtn = document.getElementById('bathroom-memory-close');
if (bathroomCloseBtn) bathroomCloseBtn.addEventListener('click', closeBathroomMemory);


// ============================================================
// LIVING + KITCHEN memory vignette (apartment three) - overlapping
// domestic rituals preserved imperfectly. the kitchen and the living
// room share the same hour and the same ambient sound. clicking the tv
// changes channel to a different memory; clicking the fridge magnets
// rearranges what is pinned. some hover responses take an extra beat
// to come back, the way a tired apartment answers slowly at night.
// ============================================================

const livingKitchenMemoryHoverTips = {
    'hit-photo':   [
        'a photograph from somewhere before this apartment. it has been on every wall.',
        'you can almost remember which trip this was. you can almost\u2014',
        'the frame is the same. the wall keeps changing.'
    ],
    'hit-fridge':  [
        'the cream-colored fridge. it has hummed at this exact pitch for years.',
        'it cycles on. it cycles off. it has been doing that since\u2014',
        'the only appliance that has been in every kitchen.'
    ],
    'hit-magnets': [
        // index-matched to the currently-visible magnet set
        'a kid\u2019s drawing, a grocery list, a calendar. an evening pinned to a door.',
        'a faded photograph, a postcard with a phone number you almost still remember.',
        'almost nothing left on the door now. one note. one magnet.'
    ],
    'hit-handle':  [
        'the chrome handle is worn smooth where your hand used to land.',
        'cold under your palm. it has always been cold under your palm.'
    ],
    'hit-jars':    [
        'a yogurt container that became a leftovers container. the lid has lasted a decade.',
        'the jam jar has rice in it now. the label is almost gone.',
        'every container in this kitchen used to be something else.'
    ],
    'hit-moka':    [
        'the same moka pot. it has been on every counter in every apartment.',
        'a faint warm glint along the aluminum. she made coffee in it this morning. and last decade.',
        'the handle is the only thing that has aged. the rest looks new every time.'
    ],
    'hit-counter': [
        'the counter is worn pale where the cutting board sat for years.',
        'a faint ring near the edge from a glass that was always there.',
        'you have leaned here, both hands, at the end of a lot of evenings.'
    ],
    'hit-tv':      [
        'the small tv on its low stand. it has been the same tv across two apartments.',
        'the bezel is warm to the touch. it has just been on.',
        'the speaker grille has dust in the same pattern as last year.'
    ],
    'hit-screen':  [
        // index-matched to the currently-visible channel
        'a quiet daytime show. someone talking softly behind a backdrop.',
        'the screen briefly looks like the living room of the apartment before this one.',
        'mostly static. a single warm window, very far away.'
    ],
    'hit-knob':    [
        'the channel knob clicks to a position that is not on the dial anymore.',
        'turning it once means turning it again later. it has a memory of its own.'
    ],
    'hit-stand':   [
        'the walnut stand. things you do not watch anymore live inside the cabinet.',
        'a cassette case. a remote that does not match. a magazine you forgot to throw out.'
    ],
    'hit-couch':   [
        'the corner of the couch you always ended up on.',
        'the throw bunched on the cushion the way someone else used to leave it.',
        'a soft cushion warmed by hours of nothing in particular.'
    ],
    'hit-floor':   [
        'the floor between the kitchen and the living room. the warmest part of the apartment at night.',
        'two halos pool together here. fridge light. television light. the same hour.',
        'you have walked between these two rooms thousands of times.'
    ]
};

const livingKitchenMemoryClickFragments = {
    'hit-photo':   [
        'you remember almost which year this was. the year that\u2014',
        'this picture has been on every wall. it has been a different picture each time.',
        'someone was holding the camera. you cannot remember\u2014'
    ],
    'hit-fridge':  [
        'the fridge cycles on the way it always has. as if the kitchen forgets and remembers in the same breath.',
        'you opened this door a thousand times for nothing in particular.',
        'a cold draft you stopped noticing the year that\u2014'
    ],
    'hit-magnets': [
        'the door rearranges itself when you are not looking. the postcard was here. now it is\u2014',
        'a kid\u2019s drawing taped here for so long the tape has gone yellow. you can\u2019t remember which kid.',
        'a phone number that does not connect to anyone alive. you keep it pinned anyway.',
        'every magnet on this door is from a place you no longer go to.'
    ],
    'hit-handle':  [
        'your hand fits the worn spot exactly. it has been your hand and not your hand.',
        'cold metal. a small grounding thing at the end of a long day.'
    ],
    'hit-jars':    [
        'the yogurt container has held leftovers from every apartment.',
        'the jam jar with rice. the rice was for a sunday meal that\u2014',
        'a stranger would not know which jar holds what. you do, without looking.',
        'the labels rubbed off years ago. you stopped writing new ones.'
    ],
    'hit-moka':    [
        'the same bialetti has come with you to every kitchen. the steam is the same steam.',
        'she taught you to fill it just below the valve. you have never measured it any other way.',
        'the gurgle from the kitchen is the most recurring sound in your life.',
        'you set it on the burner the same way in every apartment, without thinking.'
    ],
    'hit-counter': [
        'this counter has held birthdays and ordinary tuesdays without distinguishing between them.',
        'a coffee ring from this morning. or from a morning years ago. they look the same.',
        'you leaned here the night that\u2014 you cannot quite\u2014'
    ],
    'hit-tv':      [
        'the same tv across moves. it has shown things you have already forgotten.',
        'the bezel is warm. it has just been on, even when the room was empty.',
        'an evening of half-watched programming layered on top of another.'
    ],
    'hit-screen':  [
        'the channel changes by itself. now it is showing the apartment before this one.',
        'now it is a daytime program from years ago. you remember the laugh track.',
        'mostly static now. but a single warm window, very far away.',
        'you click and the screen takes a second to catch up. then a different memory shows.'
    ],
    'hit-knob':    [
        'you turn the knob. somewhere a different year answers.',
        'the click is the same click your father used to make on a different television.'
    ],
    'hit-stand':   [
        'the cabinet has held things you do not watch anymore for so long they have softened.',
        'a remote with no matching device. a magazine from a year that\u2014'
    ],
    'hit-couch':   [
        'the warm corner of the couch. an entire decade of evenings settled into it.',
        'the throw blanket was folded by someone who is not here anymore.',
        'you sat here the night that\u2014 you sit here a lot of nights.'
    ],
    'hit-floor':   [
        'the warmest patch of floor in the apartment. fridge glow on one side. tv glow on the other.',
        'you have walked this stretch in the dark a thousand times without turning a light on.',
        'two halos overlap here. they have been overlapping for years.'
    ]
};

// fragments that surface ON THEIR OWN every 24-40 seconds while the
// vignette is open - the apartment briefly remembering itself out loud.
const livingKitchenMemorySurfacingFragments = [
    'the fridge hum drops a tone and comes back.',
    'the television, very softly, plays a few seconds from a different year.',
    'a sound from the apartment upstairs that does not exist anymore.',
    'the warm light shifts a notch towards evening.',
    'a refrigerator door that is not yours, somewhere, opens and closes.',
    'a laugh track from a show that was canceled before this apartment.',
    'the warmest patch of floor briefly remembers a pair of bare feet.',
    'the kitchen hums the way kitchens do when no one is in them.',
    'an evening from another year leans against this one for a moment.',
    'a knob clicks somewhere in the room. nothing changes.'
];

const LK_SCREEN_VARIANTS  = ['lk-screen-a',  'lk-screen-b',  'lk-screen-c'];
const LK_MAGNET_VARIANTS  = ['lk-magnets-a', 'lk-magnets-b', 'lk-magnets-c'];
const LK_VISIT_KEY        = 'living-kitchen-apttres.visitCount';

let lkHumCtx = null;
let lkHumOscFridgeLow = null;
let lkHumOscFridgeMid = null;
let lkHumOscPad = null;
let lkHumNoise = null;
let lkHumLfo = null;
let lkSurfacingTimerId = null;
let lkCompressorTimerId = null;

function openLivingKitchenMemory() {
    const roomObject = document.getElementById('living-kitchen-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('living-kitchen-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('living-kitchen-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. the kitchen and the living room share the same hour. some interactions take a beat to come back. fragments may surface on their own.';
    startLivingKitchenPad();
    setupLivingKitchenMemorySvgRuntime();
}

function closeLivingKitchenMemory() {
    const overlay = document.getElementById('living-kitchen-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (lkSurfacingTimerId) {
        clearTimeout(lkSurfacingTimerId);
        lkSurfacingTimerId = null;
    }
    if (lkCompressorTimerId) {
        clearTimeout(lkCompressorTimerId);
        lkCompressorTimerId = null;
    }
    stopLivingKitchenPad();
}

// the layered apartment hum: a low fridge rumble and a quiet midrange
// partial above it (cycling on, cycling off), a warm sustained pad in
// the room, a soft low-passed noise floor for the tv white-noise carrier,
// and a very slow LFO swelling the master gain so the whole room breathes.
function startLivingKitchenPad() {
    stopLivingKitchenPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        lkHumCtx = new Ctx();

        const masterGain = lkHumCtx.createGain();
        masterGain.gain.value = 0.020;
        masterGain.connect(lkHumCtx.destination);

        // fridge low rumble (~52 Hz)
        lkHumOscFridgeLow = lkHumCtx.createOscillator();
        lkHumOscFridgeLow.type = 'sine';
        lkHumOscFridgeLow.frequency.value = 52;
        const gFridgeLow = lkHumCtx.createGain();
        gFridgeLow.gain.value = 0.55;
        lkHumOscFridgeLow.connect(gFridgeLow);
        gFridgeLow.connect(masterGain);

        // fridge mid partial (~150 Hz) - the higher pitch of the compressor
        lkHumOscFridgeMid = lkHumCtx.createOscillator();
        lkHumOscFridgeMid.type = 'sine';
        lkHumOscFridgeMid.frequency.value = 150;
        lkHumOscFridgeMid.detune.value = 8;
        const gFridgeMid = lkHumCtx.createGain();
        gFridgeMid.gain.value = 0.12;
        lkHumOscFridgeMid.connect(gFridgeMid);
        gFridgeMid.connect(masterGain);

        // warm room pad (a soft third above)
        lkHumOscPad = lkHumCtx.createOscillator();
        lkHumOscPad.type = 'sine';
        lkHumOscPad.frequency.value = 220;
        lkHumOscPad.detune.value = -4;
        const gPad = lkHumCtx.createGain();
        gPad.gain.value = 0.07;
        lkHumOscPad.connect(gPad);
        gPad.connect(masterGain);

        // soft low-passed noise floor (the tv idling, distant traffic)
        const bufferSize = 2 * lkHumCtx.sampleRate;
        const noiseBuffer = lkHumCtx.createBuffer(1, bufferSize, lkHumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.50;
        }
        lkHumNoise = lkHumCtx.createBufferSource();
        lkHumNoise.buffer = noiseBuffer;
        lkHumNoise.loop = true;
        const noiseFilter = lkHumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 380;
        const noiseGain = lkHumCtx.createGain();
        noiseGain.gain.value = 0.20;
        lkHumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // very slow LFO (~28s period) - the room breathes
        lkHumLfo = lkHumCtx.createOscillator();
        lkHumLfo.type = 'sine';
        lkHumLfo.frequency.value = 1 / 28;
        const lfoDepth = lkHumCtx.createGain();
        lfoDepth.gain.value = 0.013;
        lkHumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        lkHumOscFridgeLow.start();
        lkHumOscFridgeMid.start();
        lkHumOscPad.start();
        lkHumNoise.start();
        lkHumLfo.start();
        if (lkHumCtx.state === 'suspended') lkHumCtx.resume();

        scheduleLivingKitchenCompressorClick();
    } catch (_) {
        lkHumCtx = null;
        lkHumOscFridgeLow = null;
        lkHumOscFridgeMid = null;
        lkHumOscPad = null;
        lkHumNoise = null;
        lkHumLfo = null;
    }
}

function stopLivingKitchenPad() {
    try {
        lkHumOscFridgeLow?.stop();
        lkHumOscFridgeMid?.stop();
        lkHumOscPad?.stop();
        lkHumNoise?.stop();
        lkHumLfo?.stop();
        lkHumCtx?.close?.();
    } catch (_) {}
    lkHumOscFridgeLow = null;
    lkHumOscFridgeMid = null;
    lkHumOscPad = null;
    lkHumNoise = null;
    lkHumLfo = null;
    lkHumCtx = null;
}

// a soft "thunk" played when the fridge compressor cycles on - a low
// sine pulse with a fast attack and a short tail. happens every ~32-58s.
function playLivingKitchenCompressorClick() {
    if (!lkHumCtx) return;
    try {
        const now = lkHumCtx.currentTime;
        const osc = lkHumCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(64, now + 0.22);
        const g = lkHumCtx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.030, now + 0.025);
        g.gain.exponentialRampToValueAtTime(0.0005, now + 0.42);
        osc.connect(g);
        g.connect(lkHumCtx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    } catch (_) {}
}

// a soft "channel-change blip" played when the screen variant rotates
function playLivingKitchenChannelBlip() {
    if (!lkHumCtx) return;
    try {
        const now = lkHumCtx.currentTime;
        const osc = lkHumCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.10);
        const g = lkHumCtx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.012, now + 0.012);
        g.gain.exponentialRampToValueAtTime(0.0005, now + 0.18);
        osc.connect(g);
        g.connect(lkHumCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    } catch (_) {}
}

function scheduleLivingKitchenCompressorClick() {
    if (lkCompressorTimerId) clearTimeout(lkCompressorTimerId);
    const overlay = document.getElementById('living-kitchen-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 32000 + Math.floor(Math.random() * 26000);
    lkCompressorTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('living-kitchen-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        playLivingKitchenCompressorClick();
        scheduleLivingKitchenCompressorClick();
    }, wait);
}

function applyLivingKitchenRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(LK_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(LK_VISIT_KEY, String(visits)); } catch (_) {}

    // tv channel: rotates per visit so reopening the room finds a different
    // memory already on the screen
    const screenIdx = (visits - 1) % LK_SCREEN_VARIANTS.length;
    LK_SCREEN_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === screenIdx ? 'visible' : 'hidden');
    });

    // fridge magnet set: rotates with a different offset so the magnets
    // and the channel are not always paired the same way
    const magnetIdx = (visits + 1) % LK_MAGNET_VARIANTS.length;
    LK_MAGNET_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === magnetIdx ? 'visible' : 'hidden');
    });

    return { screenIdx, magnetIdx, visits };
}

function setLivingKitchenScreenVariant(svgDoc, idx) {
    const wrapped = ((idx % LK_SCREEN_VARIANTS.length) + LK_SCREEN_VARIANTS.length) % LK_SCREEN_VARIANTS.length;
    LK_SCREEN_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === wrapped ? 'visible' : 'hidden');
    });
    return wrapped;
}

function setLivingKitchenMagnetVariant(svgDoc, idx) {
    const wrapped = ((idx % LK_MAGNET_VARIANTS.length) + LK_MAGNET_VARIANTS.length) % LK_MAGNET_VARIANTS.length;
    LK_MAGNET_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === wrapped ? 'visible' : 'hidden');
    });
    return wrapped;
}

function pickLivingKitchenFragment(map, hotspotId, state) {
    const arr = map[hotspotId];
    if (!arr || !Array.isArray(arr)) return null;
    const idx = (state[hotspotId] ?? 0) % arr.length;
    state[hotspotId] = idx + 1;
    return arr[idx];
}

function setupLivingKitchenMemorySvgRuntime() {
    const roomObject = document.getElementById('living-kitchen-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const rotations = applyLivingKitchenRotations(svgDoc);
        svgRoot._lkRotations = rotations;

        if (svgRoot.dataset.lkBound === 'true') {
            scheduleLivingKitchenSurfacing();
            return;
        }

        const tipEl = document.getElementById('living-kitchen-memory-tip');
        const defaultTip = 'hover and click to remember. the kitchen and the living room share the same hour. some interactions take a beat to come back. fragments may surface on their own.';

        const hoverState = {};
        const clickState = {};

        let pendingTipTimer = null;
        // the room sometimes responds with delayed timing - about 1 in 4
        // hovers takes an extra beat to come back, the way a tired apartment
        // answers slowly at night. we reuse the fading class for the gap.
        const setTipSlow = (text, opts = {}) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            const baseDelay = 480;
            const longDelay = 1100;
            const useLong = opts.allowDelay !== false && Math.random() < 0.25;
            const delay = useLong ? longDelay : baseDelay;
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, delay);
        };
        const setTipImmediate = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('fading');
            tipEl.classList.remove('surfacing');
            tipEl.textContent = text;
        };
        const setTipSurfacing = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                tipEl.classList.add('surfacing');
                setTimeout(() => {
                    if (!document.getElementById('living-kitchen-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip, { allowDelay: false });
                }, 3600);
                pendingTipTimer = null;
            }, 520);
        };
        svgRoot._lkSetTipSurfacing = setTipSurfacing;

        // bind hover + click for every interactive hotspot
        Object.keys(livingKitchenMemoryHoverTips).forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                if (hotspotId === 'hit-screen') {
                    const idx = (svgRoot._lkRotations || {}).screenIdx ?? 0;
                    setTipSlow(livingKitchenMemoryHoverTips['hit-screen'][idx] || defaultTip);
                } else if (hotspotId === 'hit-magnets') {
                    const idx = (svgRoot._lkRotations || {}).magnetIdx ?? 0;
                    setTipSlow(livingKitchenMemoryHoverTips['hit-magnets'][idx] || defaultTip);
                } else {
                    const next = pickLivingKitchenFragment(livingKitchenMemoryHoverTips, hotspotId, hoverState);
                    if (next) setTipSlow(next);
                }
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip, { allowDelay: false }));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();

                // tv: clicking the screen (or the bezel) advances to the
                // next channel - a different memory shows
                if (hotspotId === 'hit-screen' || hotspotId === 'hit-tv' || hotspotId === 'hit-knob') {
                    const current = (svgRoot._lkRotations || {}).screenIdx ?? 0;
                    const nextIdx = setLivingKitchenScreenVariant(svgDoc, current + 1);
                    svgRoot._lkRotations = { ...(svgRoot._lkRotations || {}), screenIdx: nextIdx };
                    playLivingKitchenChannelBlip();
                    const next = pickLivingKitchenFragment(livingKitchenMemoryClickFragments, 'hit-screen', clickState);
                    if (next) setTipImmediate(next);
                    return;
                }

                // magnets / fridge door: clicking rearranges what is pinned
                // (the door subtly shifts between visits and between clicks)
                if (hotspotId === 'hit-magnets' || hotspotId === 'hit-fridge' || hotspotId === 'hit-handle') {
                    const current = (svgRoot._lkRotations || {}).magnetIdx ?? 0;
                    const nextIdx = setLivingKitchenMagnetVariant(svgDoc, current + 1);
                    svgRoot._lkRotations = { ...(svgRoot._lkRotations || {}), magnetIdx: nextIdx };
                    const next = pickLivingKitchenFragment(livingKitchenMemoryClickFragments, hotspotId, clickState);
                    if (next) setTipImmediate(next);
                    return;
                }

                const next = pickLivingKitchenFragment(livingKitchenMemoryClickFragments, hotspotId, clickState);
                if (next) setTipImmediate(next);
            });
        });

        svgRoot.dataset.lkBound = 'true';
        scheduleLivingKitchenSurfacing();
    };

    if (!roomObject.dataset.lkLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.lkLoadHooked = 'true';
    }
    bind();
}

// schedules a hidden fragment to surface on its own every 24-40 seconds
function scheduleLivingKitchenSurfacing() {
    if (lkSurfacingTimerId) clearTimeout(lkSurfacingTimerId);
    const overlay = document.getElementById('living-kitchen-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 24000 + Math.floor(Math.random() * 16000);
    lkSurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('living-kitchen-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('living-kitchen-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = livingKitchenMemorySurfacingFragments[Math.floor(Math.random() * livingKitchenMemorySurfacingFragments.length)];
        if (svgRoot?._lkSetTipSurfacing) {
            svgRoot._lkSetTipSurfacing(fragment);
            playLivingKitchenChannelBlip();
        }
        scheduleLivingKitchenSurfacing();
    }, wait);
}

const livingKitchenCloseBtn = document.getElementById('living-kitchen-memory-close');
if (livingKitchenCloseBtn) livingKitchenCloseBtn.addEventListener('click', closeLivingKitchenMemory);

