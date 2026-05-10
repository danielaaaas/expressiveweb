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
        text: 'the first real space that was her own; the borderlands between one home and the next.'
    },

    'bedroom-two': {
        title: 'bedroom two',
        text: 'sometimes a place to sleep, but more often the secondary living room, where movies were watched as a family, wounds mended, gossip tosted between one another like popcorn at the movies.'
    },

    'kitchen': {
        title: 'kitchen',
        text: 'a place where mother and daughter finally see each other for the first time, where one existence connected to another with one small question: would you please teach me how to cook?.'
    },

    'bathroom': {
        title: 'bathroom',
        text: 'a place to leave a message or two...'
    },

    'living-room': {
        title: 'living room',
        text: 'larger than it had any right to be, where a family first made a house feel like a home.'
    },

    'foyer': {
        title: 'foyer',
        text: 'the liminal space between worlds where the burdens of the outside world were shed before entering the safety and warmth of the place that most mattered.'
    },

    'bedroom-three': {
        title: 'bedroom three',
        text: 'a vaccuum of things lost, where memory has splotches of darkness like lacunae...'
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

const NOTEBOOK_SHELL_DEFAULT = '../elements/room-shell-only.svg';
const NOTEBOOK_SHELL_BATHROOM = '../elements/room-shell-bathroom-notebook.svg';
const NOTEBOOK_SHELL_MASTER = '../elements/room-shell-master-bedroom.svg';

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

    // bedroom-one — door to the next apartment + memory vignette
    // first show the note (preserved exactly). yes navigates. no opens
    // the memory vignette (the room you're staying in if you don't go).
    if (id === 'bedroom-one') {
        visited[id] = true;
        room.classList.add('visited');
        openDoorNote();
        return;
    }

// bathroom opening to mirror
    if (id === 'bathroom') {
        visited[id] = true;
        room.classList.add('visited');
        openMirror();
        return;
    }

// closet opening 
    if (id === 'bedroom-three') {
        visited[id] = true;
        room.classList.add('visited');
        openCloset();
        return;
    }

    const data = rooms[id];
    if (!data) return;

    // this will mark a room as visited
    visited[id] = true;
    room.classList.add('visited');

    openNotebookEntry(data.title, data.text, id !== 'kitchen', notebookShellForRoom(id));
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

// or closing things with the esc key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeNotebook();
    closeBedroomOneMemory();
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
/* ============================
   Door note helper (apt two)
   The door note is the gateway to apartment three. "yes" navigates, "no" opens
   the bedroom-one memory vignette (the room you stay in when you don't go).
   ============================ */
function openDoorNote() {
    const note = document.getElementById('door-note');
    const noteOverlay = document.getElementById('door-note-overlay');
    if (!note || !noteOverlay) return;
    note.classList.add('visible');
    noteOverlay.classList.add('visible');

    const yesBtn = document.getElementById('note-yes');
    const noBtn = document.getElementById('note-no');

    if (yesBtn) {
        yesBtn.onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
            const door = document.getElementById('door-transition');
            if (door) door.classList.add('active');
            setTimeout(() => {
                window.location.href = 'https://danielaaaas.github.io/unhogartemporal/aptdos/apttres/index.html';
            }, 1500);
        };
    }

    if (noBtn) {
        noBtn.onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
            // staying = enter the memory of the room you didn't leave
            openBedroomOneMemory();
        };
    }
}

/* ============================
   Bedroom one memory vignette (apt two)
   ============================ */

const bedroomOneMemoryHoverTips = {
    'hit-bed': 'the corner of the bed. half-made. nobody slept here long enough to fully unmake it.',
    'hit-pillow': 'the pillow. it remembers a head that has not yet committed to staying.',
    'hit-bed-clothing': 'a wrinkled shirt left on the corner of the bed. neither folded nor put away. in between.',
    'hit-window': 'the window. the outside has not yet decided what season it is.',
    'hit-candle': 'a single candle in a small glass jar. the only thing in this room that has been fully placed.',
    'hit-dresser': 'the small dresser. its drawers have been opened and closed. the middle one was not pushed all the way back in.',
    'hit-photo': 'a framed photo on the dresser. it is here. or it isn\'t. it depends on the day.',
    'hit-lamp': 'the lamp. warm bulb. the only light source the new wiring trusts.',
    'hit-cords': 'tangled cords trailing off the dresser. the apartment was not built with anyone in mind.',
    'hit-box-clothes': 'a box labeled CLOTHES. half-unpacked. the unpacking has stalled at the same step for weeks.',
    'hit-box-books': 'a box labeled BOOKS. some of these have been read. some are waiting to be re-read.',
    'hit-box-small': 'a small box marked FRAGILE. nobody is sure what is inside. nobody opens it to check.',
    'hit-clothes-pile': 'a small folded pile on the floor. they will be put away on tuesday. they have been waiting since last tuesday.',
    'hit-wall-marks': 'rectangles of un-faded paint. things used to hang here. they were taken down before the move.',
    'hit-floor': 'the floor. cool wood. the boxes have been here long enough to leave faint outlines underneath.'
};

const bedroomOneMemoryClickFragments = {
    'hit-bed': 'you sit on the corner. the mattress remembers somebody who slept there once and then could not.',
    'hit-pillow': 'you turn the pillow over. the cool side. the side that has not yet been used.',
    'hit-bed-clothing': 'you pick the shirt up. you put it back exactly where it was. it belongs nowhere else here yet.',
    'hit-candle': 'you lean toward the candle. the small flame doesn\'t lean back. it knows it\'s the only one staying.',
    'hit-dresser': 'you pull the middle drawer the rest of the way out. inside: a folded letter you have not read in a long time.',
    'hit-lamp': 'you click the lamp off. the room becomes a slightly different version of itself. you click it back on.',
    'hit-cords': 'you start to untangle. you give up. the tangle has the structural integrity of a small living thing.',
    'hit-box-clothes': 'you reach in. the sweater on top still smells like the apartment before this one.',
    'hit-box-books': 'the book on top is the one you re-read every time you move. you put it back without opening it.',
    'hit-box-small': 'the FRAGILE box gives a small dry rattle. you do not open it. you have not opened it. you might never open it.',
    'hit-clothes-pile': 'you nudge the pile straight. it stays straight for about an hour. then it leans back the way it was.',
    'hit-wall-marks': 'you press a fingertip to the rectangle. the paint underneath is still bright. like that part of the room never really moved on.',
    'hit-floor': 'the floor remembers the boxes have been here a while. it remembers it in faint outlines under each one.'
};

// window scenes cycle: each click on the window swaps to the next variant.
const BEDROOM_ONE_WINDOW_SCENES = ['b1-scene-dawn', 'b1-scene-rain', 'b1-scene-night', 'b1-scene-fog'];
const BEDROOM_ONE_WINDOW_TIPS = [
    'outside: a peach dawn. the city is barely awake. neither are you.',
    'outside: rain on the glass. the buildings are softer behind it. so are you.',
    'outside: full night. one window across the street is on. it goes off. it comes back on.',
    'outside: fog. the building across the way is barely a shape. you could be anywhere.'
];

// "magical realism: unpacked items rearrange between visits." Each visit, the
// three boxes pick a fresh configuration. Each visit, the framed photo picks a
// different variant (photo / empty / gone), so one object disappears.
const BEDROOM_ONE_BOX_VARIANTS = {
    box1: ['b1-box1-open', 'b1-box1-sealed'],
    box2: ['b1-box2-open', 'b1-box2-sealed'],
    box3: ['b1-box3-sealed', 'b1-box3-open']
};
const BEDROOM_ONE_PHOTO_VARIANTS = ['b1-photo-a', 'b1-photo-b', 'b1-photo-c'];
const BEDROOM_ONE_PHOTO_TIPS = [
    'a framed photo. two small figures in faded sepia. you do not remember which two.',
    'an empty frame on the dresser. there used to be a photo here. you do not remember which.',
    'no frame at all. just a slightly less-faded rectangle on the dresser surface where it used to sit.'
];
const BEDROOM_ONE_PHOTO_CLICKS = [
    'you pick up the frame. the figures look out at you with the polite blurriness of an old photograph.',
    'the empty frame is heavier than you expect. you set it down very gently.',
    'your fingertips find the un-faded patch. for a second you can almost feel where the frame used to sit.'
];

const BEDROOM_ONE_VISIT_KEY = 'b1-aptdos.visitCount';
let bedroomOneHumCtx = null;
let bedroomOneHumOsc = null;

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
    if (tip) tip.textContent = 'hover for fragments. click anything to remember. click the window to change the outside.';
    startBedroomOneHum();
    setupBedroomOneMemorySvgRuntime();
}

function closeBedroomOneMemory() {
    const overlay = document.getElementById('bedroom-one-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopBedroomOneHum();
}

function startBedroomOneHum() {
    stopBedroomOneHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        bedroomOneHumCtx = new Ctx();
        // very low quiet hum: a transitional apartment that does not yet know
        // what it sounds like.
        bedroomOneHumOsc = bedroomOneHumCtx.createOscillator();
        const gain = bedroomOneHumCtx.createGain();
        bedroomOneHumOsc.type = 'sine';
        bedroomOneHumOsc.frequency.value = 48;
        gain.gain.value = 0.020;
        bedroomOneHumOsc.connect(gain);
        gain.connect(bedroomOneHumCtx.destination);
        bedroomOneHumOsc.start();
        if (bedroomOneHumCtx.state === 'suspended') bedroomOneHumCtx.resume();
    } catch (_) {
        bedroomOneHumCtx = null;
        bedroomOneHumOsc = null;
    }
}

function stopBedroomOneHum() {
    try {
        bedroomOneHumOsc?.stop();
        bedroomOneHumCtx?.close?.();
    } catch (_) {}
    bedroomOneHumOsc = null;
    bedroomOneHumCtx = null;
}

/**
 * On every open, rearrange the boxes to a fresh configuration and pick a fresh
 * photo variant. Returns { boxConfig, photoIdx } so hover handlers can read
 * the current state.
 */
function applyBedroomOneRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BEDROOM_ONE_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BEDROOM_ONE_VISIT_KEY, String(visits)); } catch (_) {}

    // each box rotates on a different cadence, so the configurations don't
    // repeat in lockstep
    const boxConfig = {};
    Object.entries(BEDROOM_ONE_BOX_VARIANTS).forEach(([slot, variants], i) => {
        const idx = (visits - 1 + i) % variants.length;
        variants.forEach((id, j) => {
            const node = svgDoc.getElementById(id);
            if (node) node.setAttribute('visibility', j === idx ? 'visible' : 'hidden');
        });
        boxConfig[slot] = idx;
    });

    // photo phantom rotates through 3 variants
    const photoIdx = (visits + 1) % BEDROOM_ONE_PHOTO_VARIANTS.length;
    BEDROOM_ONE_PHOTO_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === photoIdx ? 'visible' : 'hidden');
    });

    return { boxConfig, photoIdx };
}

function showBedroomOneScene(svgDoc, idx) {
    BEDROOM_ONE_WINDOW_SCENES.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === idx ? 'visible' : 'hidden');
    });
}

function setupBedroomOneMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroom-one-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        // every open: re-roll boxes + photo. Stash current state on the SVG so
        // hover handlers always read whatever is visible right now.
        const rotations = applyBedroomOneRotations(svgDoc);
        svgRoot._b1Rotations = rotations;

        // every open: pick a starting window scene from the visit count too,
        // so the outside has changed since you last looked.
        let visits = 0;
        try { visits = parseInt(localStorage.getItem(BEDROOM_ONE_VISIT_KEY) || '0', 10); } catch (_) {}
        let sceneIdx = (visits - 1) % BEDROOM_ONE_WINDOW_SCENES.length;
        if (sceneIdx < 0) sceneIdx = 0;
        svgRoot._b1SceneIdx = sceneIdx;
        showBedroomOneScene(svgDoc, sceneIdx);

        if (svgRoot.dataset.b1Bound === 'true') return;

        const tipEl = document.getElementById('bedroom-one-memory-tip');
        const defaultTip = 'hover for fragments. click anything to remember. click the window to change the outside.';

        Object.entries(bedroomOneMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                if (hotspotId === 'hit-photo') {
                    const idx = (svgRoot._b1Rotations || {}).photoIdx ?? 0;
                    tipEl.textContent = BEDROOM_ONE_PHOTO_TIPS[idx] || tip;
                } else if (hotspotId === 'hit-window') {
                    const idx = svgRoot._b1SceneIdx ?? 0;
                    tipEl.textContent = BEDROOM_ONE_WINDOW_TIPS[idx] || tip;
                } else {
                    tipEl.textContent = tip;
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // window click cycles to the next outside scene
        const windowHit = svgDoc.getElementById('hit-window');
        if (windowHit) {
            windowHit.addEventListener('click', (event) => {
                event.stopPropagation();
                let next = (svgRoot._b1SceneIdx ?? 0) + 1;
                next = next % BEDROOM_ONE_WINDOW_SCENES.length;
                svgRoot._b1SceneIdx = next;
                showBedroomOneScene(svgDoc, next);
                if (tipEl) tipEl.textContent = BEDROOM_ONE_WINDOW_TIPS[next] || defaultTip;
            });
        }

        Object.entries(bedroomOneMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (!tipEl) return;
                if (hotspotId === 'hit-photo') {
                    const idx = (svgRoot._b1Rotations || {}).photoIdx ?? 0;
                    tipEl.textContent = BEDROOM_ONE_PHOTO_CLICKS[idx] || fragment;
                } else {
                    tipEl.textContent = fragment;
                }
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

const bedroomOneDoorBtn = document.getElementById('bedroom-one-memory-door');
if (bedroomOneDoorBtn) {
    bedroomOneDoorBtn.addEventListener('click', () => {
        // close the vignette first so the note has the stage; if "no" again,
        // the vignette will reopen via the note's no-button handler.
        closeBedroomOneMemory();
        openDoorNote();
    });
}
