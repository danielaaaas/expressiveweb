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

    // bedroom-two — restless transitional bedroom memory vignette
    if (id === 'bedroom-two') {
        visited[id] = true;
        room.classList.add('visited');
        openBedroomTwoMemory();
        return;
    }

    // kitchen — late-night transitional kitchen memory vignette
    if (id === 'kitchen') {
        visited[id] = true;
        room.classList.add('visited');
        openKitchenMemory();
        return;
    }

    // living-room — temporarily-assembled, channel-rotating memory vignette
    if (id === 'living-room') {
        visited[id] = true;
        room.classList.add('visited');
        openLivingRoomMemory();
        return;
    }

    // foyer — anxious, transitional threshold memory vignette
    if (id === 'foyer') {
        visited[id] = true;
        room.classList.add('visited');
        openFoyerMemory();
        return;
    }

// bathroom -- transitional, fluorescent-lit memory vignette
    if (id === 'bathroom') {
        visited[id] = true;
        room.classList.add('visited');
        openBathroomMemory();
        return;
    }

// bedroom three opens its own memory vignette first (the room mid-transformation).
// the closet ("leave something behind") is reachable from inside that overlay.
    if (id === 'bedroom-three') {
        visited[id] = true;
        room.classList.add('visited');
        openBedroomThreeMemory();
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
    closeBedroomTwoMemory();
    closeKitchenMemory();
    closeBathroomMemory();
    closeLivingRoomMemory();
    closeFoyerMemory();
    closeBedroomThreeMemory();
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

/* ============================
   Bedroom two memory vignette (apt two)
   Restless, late-night, transitional. Open suitcase, glowing phone,
   stacked bins under a clip lamp. Each visit re-rolls the suitcase
   contents and the disappearing object on the floor.
   ============================ */

const bedroomTwoMemoryHoverTips = {
    'hit-bed': 'the corner of the mattress. you have not slept facing this side of the room yet.',
    'hit-clothes-pile': 'a small pile next to the bed. clothes you wore once and have not yet decided about.',
    'hit-disappearing': 'something on the floor. tomorrow it might be something else. tomorrow it might be nothing.',
    'hit-power-strip': 'one outlet, six things. the apartment was wired before phones existed.',
    'hit-suitcase-lid': 'the lid of the suitcase, propped open. the inside is darker than it should be.',
    'hit-suitcase': 'the open suitcase. it has been like this for two weeks. you keep meaning to.',
    'hit-bins': 'two storage bins stacked taller than they want to be. the top one leans.',
    'hit-lamp': 'the small clip lamp on top of the bins. the only working light source in the room right now.',
    'hit-phone': 'the phone. screen on, but barely. a notification waits. you can feel it.',
    'hit-window': 'the window. one window across the street is on. and off. and on again.',
    'hit-wall-marks': 'a small framed print of a sun rising behind two terracotta mountains. you bought it before any of this. it is the warmest thing in the room.',
    'hit-floor': 'the floor. cool wood. the suitcase has been here long enough to leave a faint outline underneath.'
};

const bedroomTwoMemoryClickFragments = {
    'hit-bed': 'you sit on the corner. the mattress is fine. the room is the part that is not yet right.',
    'hit-clothes-pile': 'you reach toward the pile. you decide nothing. you withdraw your hand.',
    'hit-power-strip': 'you check the power strip. one of the outlets is loose. you have a strong opinion about which.',
    'hit-bins': 'you set a hand on the top bin. it leans the other way for a second, then leans back.',
    'hit-lamp': 'you nudge the lamp. the warm pool on the wall slides a few inches. it does not slide back.',
    'hit-window': 'you watch the window across the street. it goes off. it stays off long enough that you start to count. it comes back on.',
    'hit-wall-marks': 'you straighten the frame. the warm horizon sits exactly where it has always sat. you let your hand fall back.',
    'hit-floor': 'you sit on the floor instead of the bed. it makes the room feel like it was always meant to be temporary.'
};

// suitcase contents: 3 variants. each visit advances by one.
const BEDROOM_TWO_SUITCASE_VARIANTS = ['b2-suitcase-contents-a', 'b2-suitcase-contents-b', 'b2-suitcase-contents-c'];
const BEDROOM_TWO_SUITCASE_HOVER_TIPS = [
    'cool blues and a rust shirt. a sock peeks out. something small and hard to identify on top.',
    'a knit sweater, jeans rolled tight, a belt, a toiletry bag. the version of you who packs neatly.',
    'a single folded blanket. a book on top of it. a bookmark you do not remember putting there.'
];
const BEDROOM_TWO_SUITCASE_CLICK_FRAGMENTS = [
    'you push the contents around. they shift, but the suitcase is somehow no lighter.',
    'you lift the rolled jeans. they are heavier than they should be. you do not look closer.',
    'you take the book out. the bookmark is still where you left it. you have not finished it. you have not started it. it depends.'
];

// disappearing object: 3 variants — glass / charger / nothing.
const BEDROOM_TWO_DISAPPEAR_VARIANTS = ['b2-disappear-glass', 'b2-disappear-charger', 'b2-disappear-empty'];
const BEDROOM_TWO_DISAPPEAR_HOVER_TIPS = [
    'a glass of water on the floor. half-full. you have stopped remembering when you set it down.',
    'a phone charger plug, just lying on the floor. it is not connected to anything. it is not connected to a phone.',
    'nothing here right now. there was something. you can almost see the outline of where it sat.'
];
const BEDROOM_TWO_DISAPPEAR_CLICK_FRAGMENTS = [
    'you reach for the glass. it is colder than the room. you do not drink from it.',
    'you pick up the charger. you turn it over. you put it back down in exactly the same spot.',
    'your fingertips find the floor where it used to be. for a second you can almost feel its weight.'
];

// phone: tap toggles between "asleep" and "awake" (a brighter glow + a fresh tip).
const BEDROOM_TWO_PHONE_TIPS = {
    asleep: 'the phone, face down. a glow leaks around the edges. someone is awake.',
    awake: 'you flip the phone briefly. the screen is too bright. the notification is from earlier than you thought.'
};

const BEDROOM_TWO_VISIT_KEY = 'b2-aptdos.visitCount';
let bedroomTwoHumCtx = null;
let bedroomTwoHumOscA = null;
let bedroomTwoHumOscB = null;

function openBedroomTwoMemory() {
    // cache-bust so re-opens always re-roll the SVG variants from scratch
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
    if (tip) tip.textContent = 'hover for fragments. click anything to remember. click the suitcase to rearrange. tap the phone to wake it.';
    startBedroomTwoHum();
    setupBedroomTwoMemorySvgRuntime();
}

function closeBedroomTwoMemory() {
    const overlay = document.getElementById('bedroom-two-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopBedroomTwoHum();
}

function startBedroomTwoHum() {
    stopBedroomTwoHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        bedroomTwoHumCtx = new Ctx();
        // a layered city-distant hum: low fundamental + a faint high body
        // for the late-night, restless quality.
        const masterGain = bedroomTwoHumCtx.createGain();
        masterGain.gain.value = 0.024;
        masterGain.connect(bedroomTwoHumCtx.destination);

        bedroomTwoHumOscA = bedroomTwoHumCtx.createOscillator();
        bedroomTwoHumOscA.type = 'sine';
        bedroomTwoHumOscA.frequency.value = 56;
        const gainA = bedroomTwoHumCtx.createGain();
        gainA.gain.value = 0.85;
        bedroomTwoHumOscA.connect(gainA);
        gainA.connect(masterGain);

        bedroomTwoHumOscB = bedroomTwoHumCtx.createOscillator();
        bedroomTwoHumOscB.type = 'triangle';
        bedroomTwoHumOscB.frequency.value = 144;
        const gainB = bedroomTwoHumCtx.createGain();
        gainB.gain.value = 0.18;
        bedroomTwoHumOscB.connect(gainB);
        gainB.connect(masterGain);

        bedroomTwoHumOscA.start();
        bedroomTwoHumOscB.start();
        if (bedroomTwoHumCtx.state === 'suspended') bedroomTwoHumCtx.resume();
    } catch (_) {
        bedroomTwoHumCtx = null;
        bedroomTwoHumOscA = null;
        bedroomTwoHumOscB = null;
    }
}

function stopBedroomTwoHum() {
    try {
        bedroomTwoHumOscA?.stop();
        bedroomTwoHumOscB?.stop();
        bedroomTwoHumCtx?.close?.();
    } catch (_) {}
    bedroomTwoHumOscA = null;
    bedroomTwoHumOscB = null;
    bedroomTwoHumCtx = null;
}

/**
 * On every open, advance the visit counter and pick fresh suitcase /
 * disappearing-object variants. Returns the chosen indices so hover
 * handlers can read whatever is currently visible.
 */
function applyBedroomTwoRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BEDROOM_TWO_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BEDROOM_TWO_VISIT_KEY, String(visits)); } catch (_) {}

    const suitcaseIdx = (visits - 1) % BEDROOM_TWO_SUITCASE_VARIANTS.length;
    BEDROOM_TWO_SUITCASE_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === suitcaseIdx ? 'visible' : 'hidden');
    });

    // disappearing object rotates on a different cadence so it doesn't
    // change in lockstep with the suitcase
    const disappearIdx = (visits + 1) % BEDROOM_TWO_DISAPPEAR_VARIANTS.length;
    BEDROOM_TWO_DISAPPEAR_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === disappearIdx ? 'visible' : 'hidden');
    });

    return { suitcaseIdx, disappearIdx, phoneAwake: false };
}

function cycleBedroomTwoSuitcase(svgDoc, svgRoot) {
    const state = svgRoot._b2Rotations || { suitcaseIdx: 0 };
    const next = (state.suitcaseIdx + 1) % BEDROOM_TWO_SUITCASE_VARIANTS.length;
    BEDROOM_TWO_SUITCASE_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === next ? 'visible' : 'hidden');
    });
    state.suitcaseIdx = next;
    svgRoot._b2Rotations = state;
    return next;
}

function setupBedroomTwoMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroom-two-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        // every open: re-roll suitcase contents + disappearing object.
        const rotations = applyBedroomTwoRotations(svgDoc);
        svgRoot._b2Rotations = rotations;

        if (svgRoot.dataset.b2Bound === 'true') return;

        const tipEl = document.getElementById('bedroom-two-memory-tip');
        const defaultTip = 'hover for fragments. click anything to remember. click the suitcase to rearrange. tap the phone to wake it.';

        Object.entries(bedroomTwoMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                if (hotspotId === 'hit-suitcase' || hotspotId === 'hit-suitcase-lid') {
                    const idx = (svgRoot._b2Rotations || {}).suitcaseIdx ?? 0;
                    tipEl.textContent = BEDROOM_TWO_SUITCASE_HOVER_TIPS[idx] || tip;
                } else if (hotspotId === 'hit-disappearing') {
                    const idx = (svgRoot._b2Rotations || {}).disappearIdx ?? 0;
                    tipEl.textContent = BEDROOM_TWO_DISAPPEAR_HOVER_TIPS[idx] || tip;
                } else if (hotspotId === 'hit-phone') {
                    const awake = (svgRoot._b2Rotations || {}).phoneAwake;
                    tipEl.textContent = awake ? BEDROOM_TWO_PHONE_TIPS.awake : BEDROOM_TWO_PHONE_TIPS.asleep;
                } else {
                    tipEl.textContent = tip;
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // suitcase click cycles to the next contents variant
        ['hit-suitcase', 'hit-suitcase-lid'].forEach((hitId) => {
            const node = svgDoc.getElementById(hitId);
            if (!node) return;
            node.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = cycleBedroomTwoSuitcase(svgDoc, svgRoot);
                if (tipEl) tipEl.textContent = BEDROOM_TWO_SUITCASE_CLICK_FRAGMENTS[next] || bedroomTwoMemoryClickFragments[hitId];
            });
        });

        // phone tap: toggle between asleep / awake; awake briefly bumps the glow
        const phoneHit = svgDoc.getElementById('hit-phone');
        const phoneGlow = svgDoc.getElementById('b2-phone-glow');
        if (phoneHit) {
            phoneHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const state = svgRoot._b2Rotations || {};
                state.phoneAwake = !state.phoneAwake;
                svgRoot._b2Rotations = state;
                if (phoneGlow) {
                    const ellipse = phoneGlow.querySelector('ellipse');
                    if (ellipse) {
                        ellipse.setAttribute('rx', state.phoneAwake ? '88' : '62');
                        ellipse.setAttribute('ry', state.phoneAwake ? '30' : '22');
                    }
                }
                if (tipEl) tipEl.textContent = state.phoneAwake ? BEDROOM_TWO_PHONE_TIPS.awake : BEDROOM_TWO_PHONE_TIPS.asleep;
            });
        }

        // disappearing object click reads the variant-specific fragment
        const disappearHit = svgDoc.getElementById('hit-disappearing');
        if (disappearHit) {
            disappearHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const idx = (svgRoot._b2Rotations || {}).disappearIdx ?? 0;
                if (tipEl) tipEl.textContent = BEDROOM_TWO_DISAPPEAR_CLICK_FRAGMENTS[idx] || bedroomTwoMemoryHoverTips['hit-disappearing'];
            });
        }

        // window click: there is no scene cycling here (the window is a tiny
        // background detail), but clicking still surfaces a memory fragment.
        const windowHit = svgDoc.getElementById('hit-window');
        if (windowHit) {
            windowHit.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = bedroomTwoMemoryClickFragments['hit-window'];
            });
        }

        // generic click handlers for the rest
        Object.entries(bedroomTwoMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            // skip the ones that have custom click handlers above
            if (hotspotId === 'hit-suitcase' || hotspotId === 'hit-suitcase-lid' || hotspotId === 'hit-window') return;
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        svgRoot.dataset.b2Bound = 'true';
    };

    if (!roomObject.dataset.b2LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.b2LoadHooked = 'true';
    }
    bind();
}

const bedroomTwoCloseBtn = document.getElementById('bedroom-two-memory-close');
if (bedroomTwoCloseBtn) bedroomTwoCloseBtn.addEventListener('click', closeBedroomTwoMemory);

/* ============================
   Kitchen memory vignette (apt two)
   Late-night fluorescent + cracked-open fridge spilling warm light onto a
   half-unpacked counter. Each visit re-rolls the fridge interior, the
   freezer-door magnets/notes arrangement, and rotates which counter object
   is "temporarily misplaced" (faded out). Audio: a low, slightly distorted
   fridge hum that wobbles in pitch.
   ============================ */

const kitchenMemoryHoverTips = {
    'hit-fridge-interior': 'the inside of the fridge. brighter than the rest of the room. the cold air smells like other people\u2019s leftovers.',
    'hit-fridge-door':     'the open fridge door. it never quite closes flush. you have stopped trying.',
    'hit-magnets':         'the freezer door. magnets, a few notes, something that has been there since you moved in.',
    'hit-light':           'the fluorescent. it is buzzing in a register only you seem to hear at this hour.',
    'hit-moka':            'the same moka pot. it has been on every counter in every apartment. the steam is the same steam.',
    'hit-dishes':          'a stack of mismatched plates from the move. the small one was your grandmother\u2019s.',
    'hit-yogurt-tub':      'a yogurt tub that holds beans now. the date in sharpie may or may not still apply.',
    'hit-takeout':         'a takeout clamshell, half-open. the smell is somewhere between dinner and tomorrow.',
    'hit-grocery-bag':     'a grocery bag, half-unpacked. you have been promising yourself you would finish this for an hour.',
    'hit-counter':         'the counter. there is a routine somewhere in this clutter, if you squint.',
    'hit-floor':           'the kitchen floor. cool linoleum. a thin warm pool from the fridge laps at your foot.'
};

const kitchenMemoryClickFragments = {
    'hit-fridge-door':  'you nudge the door. it eases open another inch on its own. the warm light spills further.',
    'hit-magnets':      'you press a magnet flat. it lifts again the second you let go.',
    'hit-light':        'you look up at the tube. it answers with a longer flicker than usual. you look back down.',
    'hit-moka':         'you set it on the counter the same way you do every morning, in every apartment. she taught you to fill it just below the valve.',
    'hit-dishes':       'you straighten the plates. the small sage one is still chipped. you knew that. you check anyway.',
    'hit-grocery-bag':  'you pull one item out of the bag. you put it on the counter. you close the bag again.',
    'hit-counter':      'you wipe a circle on the counter with your sleeve. the rest of the surface looks worse for the comparison.',
    'hit-floor':        'you move your foot out of the warm patch. the cold linoleum underneath is somehow more comforting.'
};

// Fridge interior contents: 3 variants. Each visit advances by one.
const KITCHEN_INTERIOR_VARIANTS = ['k2-interior-a', 'k2-interior-b', 'k2-interior-c'];
const KITCHEN_INTERIOR_HOVER_TIPS = [
    'inside the fridge: a butter tub of beans, a green jar, a foil packet, leftovers under cling wrap, takeout boxes stacked underneath.',
    'inside the fridge: nearly empty. a jar pushed to the back, a single takeout box, a soda bottle, a jug that has seen better weeks.',
    'inside the fridge: a bag of bread on the top shelf. a bowl of cereal where the leftovers used to be. a pair of sandals. you stop reading the shelves.'
];
const KITCHEN_INTERIOR_CLICK_FRAGMENTS = [
    'you reach for the butter tub. you read the date through the lid and decide nothing.',
    'you stare at the empty shelf. the wire grid is somehow louder than the hum.',
    'you close the door slowly, then open it again. the sandals are gone. the bread is back where it should be.'
];

// Magnets/notes arrangements: 3 variants. Different cadence so they don\u2019t move in lockstep.
const KITCHEN_MAGNETS_VARIANTS = ['k2-magnets-a', 'k2-magnets-b', 'k2-magnets-c'];
const KITCHEN_MAGNETS_HOVER_TIPS = [
    'a takeout menu, a child\u2019s drawing of a sun, a postcard from somewhere with sand. all held by mismatched magnets.',
    'just one card, centered. a date, a polaroid in the corner. the rest of the door looks bigger without the others.',
    'a wall of overlapping notes. phone numbers, a grocery list, a wedding invite at an angle. your eyes choose where to land.'
];
const KITCHEN_MAGNETS_CLICK_FRAGMENTS = [
    'you tap the postcard. the corner is curling. you do not bother to flatten it again.',
    'you check the date on the card. it has already passed. you leave it where it is anyway.',
    'you peel the invite off and slide it back behind the others. it stays where it last was. you do not check.'
];

// "Temporarily misplaced" object cycle: each visit, one counter object\u2019s opacity dips.
const KITCHEN_MISPLACED_CYCLE = ['k2-yogurt-tub', 'k2-takeout', 'k2-grocery-bag', null];
const KITCHEN_MISPLACED_TIPS = {
    'k2-yogurt-tub': 'wait \u2014 the yogurt tub. it is here, but only barely. you are sure you put it in the fridge.',
    'k2-takeout':    'the takeout box looks faint at the edges. as though it is half-remembering being on the counter.',
    'k2-grocery-bag':'the grocery bag is fading at the edges. you put your hand on it. it firms up.'
};

const KITCHEN_VISIT_KEY = 'kitchen-aptdos.visitCount';
let kitchenHumCtx = null;
let kitchenHumOscA = null;
let kitchenHumOscB = null;
let kitchenHumLfo  = null;

function openKitchenMemory() {
    // cache-bust so re-opens always re-roll the SVG variants from scratch
    const roomObject = document.getElementById('kitchen-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('kitchen-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('kitchen-memory-tip');
    if (tip) tip.textContent = 'hover for fragments. click anything to remember. open the fridge to find something different inside.';
    startKitchenHum();
    setupKitchenMemorySvgRuntime();
}

function closeKitchenMemory() {
    const overlay = document.getElementById('kitchen-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopKitchenHum();
}

function startKitchenHum() {
    stopKitchenHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        kitchenHumCtx = new Ctx();
        // a low fridge fundamental + a faint warbling overtone, modulated by an
        // LFO so the hum drifts in and out of focus the way fridges do at night.
        const masterGain = kitchenHumCtx.createGain();
        masterGain.gain.value = 0.028;
        masterGain.connect(kitchenHumCtx.destination);

        kitchenHumOscA = kitchenHumCtx.createOscillator();
        kitchenHumOscA.type = 'sine';
        kitchenHumOscA.frequency.value = 62;
        const gainA = kitchenHumCtx.createGain();
        gainA.gain.value = 0.85;
        kitchenHumOscA.connect(gainA);
        gainA.connect(masterGain);

        kitchenHumOscB = kitchenHumCtx.createOscillator();
        kitchenHumOscB.type = 'triangle';
        kitchenHumOscB.frequency.value = 188;
        const gainB = kitchenHumCtx.createGain();
        gainB.gain.value = 0.16;
        kitchenHumOscB.connect(gainB);
        gainB.connect(masterGain);

        // LFO that wobbles the fundamental's pitch a few cents, giving the
        // distorted, drifting quality of a struggling compressor.
        kitchenHumLfo = kitchenHumCtx.createOscillator();
        kitchenHumLfo.type = 'sine';
        kitchenHumLfo.frequency.value = 0.18;
        const lfoGain = kitchenHumCtx.createGain();
        lfoGain.gain.value = 1.6;
        kitchenHumLfo.connect(lfoGain);
        lfoGain.connect(kitchenHumOscA.frequency);

        kitchenHumOscA.start();
        kitchenHumOscB.start();
        kitchenHumLfo.start();
        if (kitchenHumCtx.state === 'suspended') kitchenHumCtx.resume();
    } catch (_) {
        kitchenHumCtx = null;
        kitchenHumOscA = null;
        kitchenHumOscB = null;
        kitchenHumLfo = null;
    }
}

function stopKitchenHum() {
    try {
        kitchenHumOscA?.stop();
        kitchenHumOscB?.stop();
        kitchenHumLfo?.stop();
        kitchenHumCtx?.close?.();
    } catch (_) {}
    kitchenHumOscA = null;
    kitchenHumOscB = null;
    kitchenHumLfo = null;
    kitchenHumCtx = null;
}

/**
 * On every open: advance the visit counter and pick a fresh fridge interior,
 * a fresh magnet/notes arrangement (different cadence), and a "temporarily
 * misplaced" counter object that fades out for this visit.
 */
function applyKitchenRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(KITCHEN_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(KITCHEN_VISIT_KEY, String(visits)); } catch (_) {}

    const interiorIdx = (visits - 1) % KITCHEN_INTERIOR_VARIANTS.length;
    KITCHEN_INTERIOR_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === interiorIdx ? 'visible' : 'hidden');
    });

    const magnetsIdx = (visits + 1) % KITCHEN_MAGNETS_VARIANTS.length;
    KITCHEN_MAGNETS_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === magnetsIdx ? 'visible' : 'hidden');
    });

    const misplacedIdx = (visits + 2) % KITCHEN_MISPLACED_CYCLE.length;
    const misplacedId = KITCHEN_MISPLACED_CYCLE[misplacedIdx];
    KITCHEN_MISPLACED_CYCLE.forEach((id) => {
        if (!id) return;
        const node = svgDoc.getElementById(id);
        if (node) node.removeAttribute('opacity');
    });
    if (misplacedId) {
        const node = svgDoc.getElementById(misplacedId);
        if (node) node.setAttribute('opacity', '0.45');
    }

    return { interiorIdx, magnetsIdx, misplacedIdx, misplacedId };
}

function cycleKitchenInterior(svgDoc, svgRoot) {
    const state = svgRoot._kRotations || { interiorIdx: 0 };
    const next = (state.interiorIdx + 1) % KITCHEN_INTERIOR_VARIANTS.length;
    KITCHEN_INTERIOR_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === next ? 'visible' : 'hidden');
    });
    state.interiorIdx = next;
    svgRoot._kRotations = state;
    return next;
}

function cycleKitchenMagnets(svgDoc, svgRoot) {
    const state = svgRoot._kRotations || { magnetsIdx: 0 };
    const next = (state.magnetsIdx + 1) % KITCHEN_MAGNETS_VARIANTS.length;
    KITCHEN_MAGNETS_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === next ? 'visible' : 'hidden');
    });
    state.magnetsIdx = next;
    svgRoot._kRotations = state;
    return next;
}

function setupKitchenMemorySvgRuntime() {
    const roomObject = document.getElementById('kitchen-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const rotations = applyKitchenRotations(svgDoc);
        svgRoot._kRotations = rotations;

        if (svgRoot.dataset.kBound === 'true') return;

        const tipEl = document.getElementById('kitchen-memory-tip');
        const defaultTip = 'hover for fragments. click anything to remember. open the fridge to find something different inside.';

        Object.entries(kitchenMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                if (hotspotId === 'hit-fridge-interior' || hotspotId === 'hit-fridge-door') {
                    const idx = (svgRoot._kRotations || {}).interiorIdx ?? 0;
                    tipEl.textContent = KITCHEN_INTERIOR_HOVER_TIPS[idx] || tip;
                } else if (hotspotId === 'hit-magnets') {
                    const idx = (svgRoot._kRotations || {}).magnetsIdx ?? 0;
                    tipEl.textContent = KITCHEN_MAGNETS_HOVER_TIPS[idx] || tip;
                } else {
                    // if the hovered hotspot corresponds to the "misplaced" object,
                    // surface the spookier tip instead of the default.
                    const misplacedId = (svgRoot._kRotations || {}).misplacedId;
                    const map = {
                        'hit-yogurt-tub':   'k2-yogurt-tub',
                        'hit-takeout':      'k2-takeout',
                        'hit-grocery-bag':  'k2-grocery-bag'
                    };
                    if (map[hotspotId] && map[hotspotId] === misplacedId) {
                        tipEl.textContent = KITCHEN_MISPLACED_TIPS[misplacedId] || tip;
                    } else {
                        tipEl.textContent = tip;
                    }
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // fridge interior + door click: cycle to the next interior variant,
        // and surface the variant-specific click fragment.
        ['hit-fridge-interior', 'hit-fridge-door'].forEach((hitId) => {
            const node = svgDoc.getElementById(hitId);
            if (!node) return;
            node.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = cycleKitchenInterior(svgDoc, svgRoot);
                if (tipEl) tipEl.textContent = KITCHEN_INTERIOR_CLICK_FRAGMENTS[next] || kitchenMemoryClickFragments[hitId];
            });
        });

        // magnets click: cycle to the next magnets arrangement.
        const magnetsHit = svgDoc.getElementById('hit-magnets');
        if (magnetsHit) {
            magnetsHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = cycleKitchenMagnets(svgDoc, svgRoot);
                if (tipEl) tipEl.textContent = KITCHEN_MAGNETS_CLICK_FRAGMENTS[next] || kitchenMemoryClickFragments['hit-magnets'];
            });
        }

        // generic click handlers for the rest
        Object.entries(kitchenMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            if (hotspotId === 'hit-fridge-interior' || hotspotId === 'hit-fridge-door' || hotspotId === 'hit-magnets') return;
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        // a couple of hotspots only show a hover tip, no special click fragment.
        // tap them to surface the hover tip text as the lingering line.
        ['hit-yogurt-tub', 'hit-takeout'].forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (!tipEl) return;
                const misplacedId = (svgRoot._kRotations || {}).misplacedId;
                const map = { 'hit-yogurt-tub': 'k2-yogurt-tub', 'hit-takeout': 'k2-takeout' };
                if (map[hotspotId] && map[hotspotId] === misplacedId) {
                    tipEl.textContent = KITCHEN_MISPLACED_TIPS[misplacedId];
                } else {
                    tipEl.textContent = kitchenMemoryHoverTips[hotspotId];
                }
            });
        });

        svgRoot.dataset.kBound = 'true';
    };

    if (!roomObject.dataset.kLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.kLoadHooked = 'true';
    }
    bind();
}

const kitchenCloseBtn = document.getElementById('kitchen-memory-close');
if (kitchenCloseBtn) kitchenCloseBtn.addEventListener('click', closeKitchenMemory);

/* ============================
   Bathroom memory vignette (apt two)
   Transitional, fluorescent-lit, dissociative. Frameless mirror with three
   rotating reflection states (faint silhouette / absent / condensation
   reveals hidden word). Sparse counter, half-unpacked toiletries, an amber
   medicine bottle whose printed date drifts each visit. Audio: a low,
   slow ventilation hum with a faint upper-body airy whisper.
   ============================ */

const bathroomMemoryHoverTips = {
    'hit-mirror':       'the mirror. you look. the reflection takes a half-second longer than it should to arrive.',
    'hit-condensation': 'the lower edge of the mirror, fogged. there is something written in the steam if you look long enough.',
    'hit-light':        'the fluorescent above. the warmer half of the tube went out months ago. you have not replaced it.',
    'hit-toothbrush-cup':'a glass with one toothbrush. the water inside is older than today.',
    'hit-toothpaste':   'a half-used tube, cap missing, lying on its side. a small squeeze has dried at the nozzle.',
    'hit-medicine':     'an amber bottle. the date on the label still looks like it might apply, depending.',
    'hit-shampoo':      'a shampoo bottle still in its cardboard box. the price sticker is still on it.',
    'hit-soap':         'a soap dispenser. half-full of pale pink soap. you do not remember buying this one.',
    'hit-towel':        'a thin hand towel. damp at the bottom from the morning. nobody has straightened it.',
    'hit-faucet':       'the faucet. the slow drip is a problem you will deal with later.',
    'hit-sink':         'the sink. there is a faint ring of water around the drain. it will dry. it will come back.',
    'hit-counter':      'the counter. cold to the touch. there are not enough things on it for the surface to feel used.'
};

const bathroomMemoryClickFragments = {
    'hit-light':        'you look up at the tube. the dim half flickers a little harder, as if it heard you.',
    'hit-toothbrush-cup':'you pick up the cup, pour the old water out, set it back. the toothbrush stays where it was.',
    'hit-toothpaste':   'you cap the tube. you uncap it. you cap it again. you set it down exactly where it was.',
    'hit-shampoo':      'you finally pull the bottle out of the box. you set the empty box back on the counter anyway.',
    'hit-soap':         'you press the pump. nothing comes out. you press it again. it remembers what it is for.',
    'hit-towel':        'you straighten the towel. the damp line at the bottom does not move.',
    'hit-faucet':       'you turn the handle hard. the drip waits a beat, then resumes.',
    'hit-sink':         'you watch the drain. the water ring in the porcelain looks darker the longer you look.',
    'hit-counter':      'you trace a fingertip across the counter. it leaves a faint clean line through dust you did not know was there.'
};

// Reflection variants: 3 rotating states.
const BATHROOM_REFLECTION_VARIANTS = ['present', 'absent', 'word'];
const BATHROOM_REFLECTION_HOVER_TIPS = [
    'the mirror. you look. the reflection takes a half-second longer than it should to arrive.',
    'the mirror. nothing in it. just the room behind you. you check anyway.',
    'the mirror. the steam at the bottom edge has a word in it. you cannot quite tell who wrote it.'
];
const BATHROOM_REFLECTION_CLICK_FRAGMENTS = [
    'you blink. the reflection blinks a moment later. you both let it go.',
    'you wave. the doorway behind you waves back. nothing closer to the glass moves.',
    'you read the word. it is "stay." you look at your hand. it is dry.'
];

// Medicine label date: 3 swappable variants.
const BATHROOM_MED_DATE_VARIANTS = ['b2t-med-date-a', 'b2t-med-date-b', 'b2t-med-date-c'];

const BATHROOM_VISIT_KEY = 'bathroom-aptdos.visitCount';
let bathroomHumCtx = null;
let bathroomHumOscA = null;
let bathroomHumOscB = null;
let bathroomHumNoise = null;
let bathroomHumNoiseGain = null;

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
    if (tip) tip.textContent = 'hover for fragments. click anything to remember. tap the mirror to look again.';
    startBathroomHum();
    setupBathroomMemorySvgRuntime();
}

function closeBathroomMemory() {
    const overlay = document.getElementById('bathroom-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopBathroomHum();
}

function startBathroomHum() {
    stopBathroomHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        bathroomHumCtx = new Ctx();
        // a low ventilation fan rumble + a faint upper-body whoosh that
        // approximates moving air in a small humid room.
        const masterGain = bathroomHumCtx.createGain();
        masterGain.gain.value = 0.026;
        masterGain.connect(bathroomHumCtx.destination);

        bathroomHumOscA = bathroomHumCtx.createOscillator();
        bathroomHumOscA.type = 'sine';
        bathroomHumOscA.frequency.value = 78;
        const gainA = bathroomHumCtx.createGain();
        gainA.gain.value = 0.6;
        bathroomHumOscA.connect(gainA);
        gainA.connect(masterGain);

        bathroomHumOscB = bathroomHumCtx.createOscillator();
        bathroomHumOscB.type = 'triangle';
        bathroomHumOscB.frequency.value = 168;
        const gainB = bathroomHumCtx.createGain();
        gainB.gain.value = 0.12;
        bathroomHumOscB.connect(gainB);
        gainB.connect(masterGain);

        // very faint pink-ish noise via a buffer source
        const bufferSize = 2 * bathroomHumCtx.sampleRate;
        const noiseBuffer = bathroomHumCtx.createBuffer(1, bufferSize, bathroomHumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.6;
        }
        bathroomHumNoise = bathroomHumCtx.createBufferSource();
        bathroomHumNoise.buffer = noiseBuffer;
        bathroomHumNoise.loop = true;
        const noiseFilter = bathroomHumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 480;
        bathroomHumNoiseGain = bathroomHumCtx.createGain();
        bathroomHumNoiseGain.gain.value = 0.18;
        bathroomHumNoise.connect(noiseFilter);
        noiseFilter.connect(bathroomHumNoiseGain);
        bathroomHumNoiseGain.connect(masterGain);

        bathroomHumOscA.start();
        bathroomHumOscB.start();
        bathroomHumNoise.start();
        if (bathroomHumCtx.state === 'suspended') bathroomHumCtx.resume();
    } catch (_) {
        bathroomHumCtx = null;
        bathroomHumOscA = null;
        bathroomHumOscB = null;
        bathroomHumNoise = null;
        bathroomHumNoiseGain = null;
    }
}

function stopBathroomHum() {
    try {
        bathroomHumOscA?.stop();
        bathroomHumOscB?.stop();
        bathroomHumNoise?.stop();
        bathroomHumCtx?.close?.();
    } catch (_) {}
    bathroomHumOscA = null;
    bathroomHumOscB = null;
    bathroomHumNoise = null;
    bathroomHumNoiseGain = null;
    bathroomHumCtx = null;
}

/**
 * Show one of the three reflection states by toggling visibility on the
 * relevant SVG nodes.
 *  - 'present': default mirror glass + figure visible, no overlay, no word.
 *  - 'absent':  the figure node is hidden + the "absent" mirror overlay
 *               (a flatter, darker glass) is shown on top of the room.
 *  - 'word':    the figure visible but partially faded, and the hidden
 *               condensation word appears at the bottom-left.
 */
function applyBathroomReflection(svgDoc, variant) {
    const figure  = svgDoc.getElementById('b2t-mirror-figure');
    const absent  = svgDoc.getElementById('b2t-mirror-absent');
    const wordNode= svgDoc.getElementById('b2t-condensation-word');
    const room    = svgDoc.getElementById('b2t-mirror-room');
    if (!figure || !absent || !wordNode || !room) return;

    if (variant === 'absent') {
        figure.setAttribute('visibility', 'hidden');
        absent.setAttribute('visibility', 'visible');
        wordNode.setAttribute('visibility', 'hidden');
        room.setAttribute('opacity', '0.4');
    } else if (variant === 'word') {
        figure.setAttribute('visibility', 'visible');
        figure.setAttribute('opacity', '0.55');
        absent.setAttribute('visibility', 'hidden');
        wordNode.setAttribute('visibility', 'visible');
        room.removeAttribute('opacity');
    } else {
        // present
        figure.setAttribute('visibility', 'visible');
        figure.removeAttribute('opacity');
        absent.setAttribute('visibility', 'hidden');
        wordNode.setAttribute('visibility', 'hidden');
        room.removeAttribute('opacity');
    }
}

function applyBathroomRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BATHROOM_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BATHROOM_VISIT_KEY, String(visits)); } catch (_) {}

    const reflectionIdx = (visits - 1) % BATHROOM_REFLECTION_VARIANTS.length;
    const variant = BATHROOM_REFLECTION_VARIANTS[reflectionIdx];
    applyBathroomReflection(svgDoc, variant);

    // medicine bottle date drifts on a different cadence
    const dateIdx = (visits + 1) % BATHROOM_MED_DATE_VARIANTS.length;
    BATHROOM_MED_DATE_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === dateIdx ? 'visible' : 'hidden');
    });

    return { reflectionIdx, dateIdx };
}

function cycleBathroomReflection(svgDoc, svgRoot) {
    const state = svgRoot._b2tRotations || { reflectionIdx: 0 };
    const next = (state.reflectionIdx + 1) % BATHROOM_REFLECTION_VARIANTS.length;
    applyBathroomReflection(svgDoc, BATHROOM_REFLECTION_VARIANTS[next]);
    state.reflectionIdx = next;
    svgRoot._b2tRotations = state;
    return next;
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
        svgRoot._b2tRotations = rotations;

        if (svgRoot.dataset.b2tBound === 'true') return;

        const tipEl = document.getElementById('bathroom-memory-tip');
        const defaultTip = 'hover for fragments. click anything to remember. tap the mirror to look again.';

        Object.entries(bathroomMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                if (hotspotId === 'hit-mirror' || hotspotId === 'hit-condensation') {
                    const idx = (svgRoot._b2tRotations || {}).reflectionIdx ?? 0;
                    tipEl.textContent = BATHROOM_REFLECTION_HOVER_TIPS[idx] || tip;
                } else {
                    tipEl.textContent = tip;
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // mirror tap cycles to the next reflection state
        ['hit-mirror', 'hit-condensation'].forEach((hitId) => {
            const node = svgDoc.getElementById(hitId);
            if (!node) return;
            node.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = cycleBathroomReflection(svgDoc, svgRoot);
                if (tipEl) tipEl.textContent = BATHROOM_REFLECTION_CLICK_FRAGMENTS[next] || bathroomMemoryHoverTips['hit-mirror'];
            });
        });

        // generic click handlers for the rest
        Object.entries(bathroomMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            if (hotspotId === 'hit-mirror' || hotspotId === 'hit-condensation') return;
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        // a couple of hover-only hotspots: tap them to keep the hover tip
        // lingering as the surfaced line.
        ['hit-medicine'].forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = bathroomMemoryHoverTips[hotspotId];
            });
        });

        svgRoot.dataset.b2tBound = 'true';
    };

    if (!roomObject.dataset.b2tLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.b2tLoadHooked = 'true';
    }
    bind();
}

const bathroomCloseBtn = document.getElementById('bathroom-memory-close');
if (bathroomCloseBtn) bathroomCloseBtn.addEventListener('click', closeBathroomMemory);

/* ============================
   Living room memory vignette (apt two)
   Temporarily-assembled space. CRT TV on a milk-crate stand glows at center,
   couch arm intrudes from the right, folding chair holds a draped hoodie,
   moving boxes lean against the wall. Channels rotate (news / nature / pure
   static). Box contents rotate (cables / books / a single houseplant). The
   shadow on the floor drifts independently of any object.
   Audio: a quiet TV-static rumble + a low neighboring-apartment bleed.
   ============================ */

const livingRoomMemoryHoverTips = {
    'hit-tv':         'the small CRT. you are not really watching. the channel is mostly noise.',
    'hit-crate':      'a milk crate doing the work of a tv stand. somebody else is going to call this temporary.',
    'hit-couch':      'the arm of the couch. thrifted. the upholstery feels older than the building.',
    'hit-blanket':    'a folded blanket on the arm. you have not slept under it. you keep meaning to.',
    'hit-boxes':      'boxes you have been meaning to unpack. the labels are honest, but the contents have rearranged.',
    'hit-cables':     'a power strip and three cords going three different directions. one of them is not plugged into anything.',
    'hit-frame':      'a framed picture leaning against the wall. you have not decided where it goes. you may not decide.',
    'hit-shadow':     'a shadow on the floor. when you look up, there is nobody there. when you look back down, it has moved.',
    'hit-floor':      'the floor. cool wood. the cord coils are warmer than they should be.',
    'hit-wall-marks': 'a faint rectangle of older paint. something used to hang here. you do not know what.'
};

const livingRoomMemoryClickFragments = {
    'hit-crate':      'you nudge the crate with your foot. the tv leans. it settles back. the picture stays.',
    'hit-couch':      'you sit on the couch arm. the cushion does not push back. you sit anyway.',
    'hit-blanket':    'you unfold the blanket. it is still cold to the touch. you fold it back.',
    'hit-cables':     'you trace the cord. it runs out the back of the room and stops at nothing in particular.',
    'hit-frame':      'you lift the frame, hold it against the wall in three places, set it back down. it stays leaning.',
    'hit-shadow':     'you stand in the path of the shadow. it slides around you and continues on its way.',
    'hit-floor':      'you sit on the floor. the room looks bigger from down here, and somehow more borrowed.',
    'hit-wall-marks': 'you press a fingertip to the rectangle of older paint. it is warmer than the rest of the wall.'
};

// TV channel variants: 3 rotating broadcasts.
const LIVING_ROOM_CHANNEL_VARIANTS = ['lv-channel-a', 'lv-channel-b', 'lv-channel-c'];
const LIVING_ROOM_CHANNEL_HOVER_TIPS = [
    'on the tv: a late-night news desk. the ticker says things you cannot quite read in time.',
    'on the tv: a nature documentary. the subtitle is one beat ahead of the silhouettes on screen.',
    'on the tv: pure static. if you listen long enough, you can almost hear a sentence inside it.'
];
const LIVING_ROOM_CHANNEL_CLICK_FRAGMENTS = [
    'you change the channel. the ticker reads the same thing again, in a different order.',
    'you change the channel. the silhouettes are facing the other way now.',
    'you change the channel. the static gets a tiny bit softer for a second, like it heard you.'
];

// Box contents: 3 rotating peek-out variants.
const LIVING_ROOM_BOX_VARIANTS = ['lv-box-contents-a', 'lv-box-contents-b', 'lv-box-contents-c'];
const LIVING_ROOM_BOX_HOVER_TIPS = [
    'inside the open box: cables and a remote. the remote does not match the tv.',
    'inside the open box: a stack of books. you have read one. the other two are not yours.',
    'inside the open box: a houseplant in a terracotta pot. you do not remember packing this.'
];
const LIVING_ROOM_BOX_CLICK_FRAGMENTS = [
    'you push the cables aside. underneath, more cables.',
    'you lift the top book. the cover is not the title you expected.',
    'you touch a leaf. it is alive. it has been in the box this entire time.'
];

const LIVING_ROOM_VISIT_KEY = 'livingroom-aptdos.visitCount';
let livingRoomHumCtx = null;
let livingRoomHumOscA = null;
let livingRoomHumNoise = null;

function openLivingRoomMemory() {
    const roomObject = document.getElementById('living-room-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('living-room-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('living-room-memory-tip');
    if (tip) tip.textContent = 'hover for fragments. click anything to remember. tap the tv to change the channel.';
    startLivingRoomHum();
    setupLivingRoomMemorySvgRuntime();
}

function closeLivingRoomMemory() {
    const overlay = document.getElementById('living-room-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopLivingRoomHum();
}

function startLivingRoomHum() {
    stopLivingRoomHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        livingRoomHumCtx = new Ctx();
        // a soft TV-static rumble + a faint sub-bass body that approximates
        // distant neighbor-apartment audio bleeding through the wall.
        const masterGain = livingRoomHumCtx.createGain();
        masterGain.gain.value = 0.028;
        masterGain.connect(livingRoomHumCtx.destination);

        livingRoomHumOscA = livingRoomHumCtx.createOscillator();
        livingRoomHumOscA.type = 'sine';
        livingRoomHumOscA.frequency.value = 64;
        const gainA = livingRoomHumCtx.createGain();
        gainA.gain.value = 0.55;
        livingRoomHumOscA.connect(gainA);
        gainA.connect(masterGain);

        // pink-ish noise via a low-passed buffer source
        const bufferSize = 2 * livingRoomHumCtx.sampleRate;
        const noiseBuffer = livingRoomHumCtx.createBuffer(1, bufferSize, livingRoomHumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.7;
        }
        livingRoomHumNoise = livingRoomHumCtx.createBufferSource();
        livingRoomHumNoise.buffer = noiseBuffer;
        livingRoomHumNoise.loop = true;
        const noiseFilter = livingRoomHumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 720;
        const noiseGain = livingRoomHumCtx.createGain();
        noiseGain.gain.value = 0.30;
        livingRoomHumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        livingRoomHumOscA.start();
        livingRoomHumNoise.start();
        if (livingRoomHumCtx.state === 'suspended') livingRoomHumCtx.resume();
    } catch (_) {
        livingRoomHumCtx = null;
        livingRoomHumOscA = null;
        livingRoomHumNoise = null;
    }
}

function stopLivingRoomHum() {
    try {
        livingRoomHumOscA?.stop();
        livingRoomHumNoise?.stop();
        livingRoomHumCtx?.close?.();
    } catch (_) {}
    livingRoomHumOscA = null;
    livingRoomHumNoise = null;
    livingRoomHumCtx = null;
}

function applyLivingRoomRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(LIVING_ROOM_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(LIVING_ROOM_VISIT_KEY, String(visits)); } catch (_) {}

    const channelIdx = (visits - 1) % LIVING_ROOM_CHANNEL_VARIANTS.length;
    LIVING_ROOM_CHANNEL_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === channelIdx ? 'visible' : 'hidden');
    });

    const boxIdx = (visits + 1) % LIVING_ROOM_BOX_VARIANTS.length;
    LIVING_ROOM_BOX_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === boxIdx ? 'visible' : 'hidden');
    });

    return { channelIdx, boxIdx };
}

function cycleLivingRoomChannel(svgDoc, svgRoot) {
    const state = svgRoot._lvRotations || { channelIdx: 0 };
    const next = (state.channelIdx + 1) % LIVING_ROOM_CHANNEL_VARIANTS.length;
    LIVING_ROOM_CHANNEL_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === next ? 'visible' : 'hidden');
    });
    state.channelIdx = next;
    svgRoot._lvRotations = state;
    return next;
}

function cycleLivingRoomBox(svgDoc, svgRoot) {
    const state = svgRoot._lvRotations || { boxIdx: 0 };
    const next = (state.boxIdx + 1) % LIVING_ROOM_BOX_VARIANTS.length;
    LIVING_ROOM_BOX_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (node) node.setAttribute('visibility', i === next ? 'visible' : 'hidden');
    });
    state.boxIdx = next;
    svgRoot._lvRotations = state;
    return next;
}

function setupLivingRoomMemorySvgRuntime() {
    const roomObject = document.getElementById('living-room-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const rotations = applyLivingRoomRotations(svgDoc);
        svgRoot._lvRotations = rotations;

        if (svgRoot.dataset.lvBound === 'true') return;

        const tipEl = document.getElementById('living-room-memory-tip');
        const defaultTip = 'hover for fragments. click anything to remember. tap the tv to change the channel.';

        Object.entries(livingRoomMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                if (hotspotId === 'hit-tv') {
                    const idx = (svgRoot._lvRotations || {}).channelIdx ?? 0;
                    tipEl.textContent = LIVING_ROOM_CHANNEL_HOVER_TIPS[idx] || tip;
                } else if (hotspotId === 'hit-boxes') {
                    const idx = (svgRoot._lvRotations || {}).boxIdx ?? 0;
                    tipEl.textContent = LIVING_ROOM_BOX_HOVER_TIPS[idx] || tip;
                } else {
                    tipEl.textContent = tip;
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // tv tap cycles to the next channel
        const tvHit = svgDoc.getElementById('hit-tv');
        if (tvHit) {
            tvHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = cycleLivingRoomChannel(svgDoc, svgRoot);
                if (tipEl) tipEl.textContent = LIVING_ROOM_CHANNEL_CLICK_FRAGMENTS[next] || livingRoomMemoryHoverTips['hit-tv'];
            });
        }

        // boxes tap cycles to the next contents variant
        const boxesHit = svgDoc.getElementById('hit-boxes');
        if (boxesHit) {
            boxesHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = cycleLivingRoomBox(svgDoc, svgRoot);
                if (tipEl) tipEl.textContent = LIVING_ROOM_BOX_CLICK_FRAGMENTS[next] || livingRoomMemoryHoverTips['hit-boxes'];
            });
        }

        // generic click handlers for the rest
        Object.entries(livingRoomMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            if (hotspotId === 'hit-tv' || hotspotId === 'hit-boxes') return;
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        svgRoot.dataset.lvBound = 'true';
    };

    if (!roomObject.dataset.lvLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.lvLoadHooked = 'true';
    }
    bind();
}

const livingRoomCloseBtn = document.getElementById('living-room-memory-close');
if (livingRoomCloseBtn) livingRoomCloseBtn.addEventListener('click', closeLivingRoomMemory);

/* ============================
   Foyer memory vignette (apt two)
   The threshold between staying and leaving. Hover tips, click fragments,
   plus three magical-realism rotations: the apartment number quietly changes
   between visits, the light bleeding under the door cycles colors, and the
   peephole reveals a different hallway each time you look. A low ambient
   stairwell hum plays while the overlay is open.
   ============================ */

const foyerMemoryHoverTips = {
    'hit-door':       'the door. cool metal. it has been opened more times this month than the door at the last place.',
    'hit-peephole':   'the peephole. you have looked through it more than you have used it.',
    'hit-chain':      'the chain lock. fully drawn across. you do not remember sliding it.',
    'hit-knob':       'the knob. brass. faintly warm even when nobody has touched it in hours.',
    'hit-kickplate':  'the kick plate at the bottom. small dents. someone with hands full kicks doors open.',
    'hit-under-door': 'the strip of light under the door. it is not the color it was yesterday.',
    'hit-mat':        'the mat. the welcome on it has worn down to a few half-letters. you read whatever you want to read.',
    'hit-keys':       'three keys on a ring. one of them is for somewhere you no longer go.',
    'hit-key-hook':   'the small hook in the wall. the kind a previous tenant put up. you never replaced it.',
    'hit-duffel':     'a packed duffel bag on the floor. zipped. ready. it has been ready for nine days.',
    'hit-boxes':      'two moving boxes against the wall. the FRAGILE one was never unpacked. you keep meaning to.',
    'hit-shoes':      'shoes scattered across the floor. the pair you wear most is missing one. you stopped looking for it.'
};

const foyerMemoryClickFragments = {
    'hit-door':       'you put a hand flat on the door. cold. the kind of cold that makes you think about leaving.',
    'hit-knob':       'you turn the knob a quarter inch and let it spring back. you are not opening it. not yet.',
    'hit-kickplate':  'you nudge the kick plate with the side of your foot. a small soft thump. the apartment heard it. nobody else did.',
    'hit-mat':        'you scuff the mat with your toe. a few crumbs of old dirt come loose. yours? someone else\u2019s? unclear.',
    'hit-keys':       'you take the silver one off the ring. you put it back. you take the bronze one off. you put it back too.',
    'hit-key-hook':   'you press the hook to make sure it is screwed in. it is. you check this more often than you should.',
    'hit-duffel':     'you unzip the duffel a couple of inches. clothes. a charger. a toothbrush. you zip it back up.',
    'hit-boxes':      'you peel up the corner of the FRAGILE tape. it makes a small sticky sound. you press it back down.',
    'hit-shoes':      'you nudge the lone dress shoe with your foot. its pair is somewhere. you do not remember packing it. you do not remember not packing it.'
};

// MAGICAL REALISM ROTATIONS

// the light bleeding under the door cycles between four colors per visit.
const FOYER_LIGHT_VARIANTS = [
    'fy-under-strip-warm',
    'fy-under-strip-cool',
    'fy-under-strip-green',
    'fy-under-strip-red'
];
const FOYER_LIGHT_HOVER_TIPS = [
    'the strip of light under the door. warm sodium. the hallway bulb is doing its job tonight.',
    'the strip of light under the door. cold blue. the hallway bulb has never been blue.',
    'the strip of light under the door. faint green. the kind of green that shouldn\u2019t happen in a hallway.',
    'the strip of light under the door. red. somewhere out there a fire exit sign is open. or one is being looked at.'
];
const FOYER_LIGHT_CLICK_FRAGMENTS = [
    'you crouch and put a hand near the warm strip of light. the light is warmer than the floor.',
    'you crouch and put a hand near the cold strip of light. you can\u2019t feel it. but it is there.',
    'you crouch close to the green strip of light. you do not put a hand near it. you do not know why.',
    'you crouch close to the red strip of light. you stand up too fast. the room rearranges.'
];

// the peephole shows a different hallway each click. (only the tip text changes.)
const FOYER_PEEPHOLE_FRAGMENTS = [
    'you look through the peephole. the hallway you remember. fluorescent tube. brown carpet. nobody.',
    'you look through the peephole. a hallway with the wallpaper from your old apartment. nobody.',
    'you look through the peephole. a hallway you do not recognize. the lights are off. you can hear them anyway.',
    'you look through the peephole. someone is standing too close. you do not look again for a while.',
    'you look through the peephole. the lens is fogged. it has never been fogged before.'
];

const FOYER_VISIT_KEY = 'foyer-aptdos.visitCount';
let foyerHumCtx = null;
let foyerHumOscA = null;
let foyerHumNoise = null;
let foyerKnockTimer = null;

function openFoyerMemory() {
    const roomObject = document.getElementById('foyer-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('foyer-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('foyer-memory-tip');
    if (tip) tip.textContent = 'hover for fragments. click anything to remember. peek through the peephole. the light beneath the door keeps changing color.';
    startFoyerHum();
    setupFoyerMemorySvgRuntime();
}

function closeFoyerMemory() {
    const overlay = document.getElementById('foyer-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopFoyerHum();
}

function startFoyerHum() {
    stopFoyerHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        foyerHumCtx = new Ctx();
        // a slow stairwell rumble (a low oscillator) + faint hallway noise
        // (low-passed white noise). occasional muffled "knock" pulses on top.
        const masterGain = foyerHumCtx.createGain();
        masterGain.gain.value = 0.026;
        masterGain.connect(foyerHumCtx.destination);

        foyerHumOscA = foyerHumCtx.createOscillator();
        foyerHumOscA.type = 'sine';
        foyerHumOscA.frequency.value = 56;
        const gainA = foyerHumCtx.createGain();
        gainA.gain.value = 0.50;
        foyerHumOscA.connect(gainA);
        gainA.connect(masterGain);

        const bufferSize = 2 * foyerHumCtx.sampleRate;
        const noiseBuffer = foyerHumCtx.createBuffer(1, bufferSize, foyerHumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.6;
        }
        foyerHumNoise = foyerHumCtx.createBufferSource();
        foyerHumNoise.buffer = noiseBuffer;
        foyerHumNoise.loop = true;
        const noiseFilter = foyerHumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 540;
        const noiseGain = foyerHumCtx.createGain();
        noiseGain.gain.value = 0.32;
        foyerHumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        foyerHumOscA.start();
        foyerHumNoise.start();

        // schedule occasional "knocks" (muffled low pulses)
        const scheduleKnock = () => {
            if (!foyerHumCtx) return;
            const ctx = foyerHumCtx;
            const knockGain = ctx.createGain();
            knockGain.gain.value = 0;
            knockGain.connect(masterGain);
            const knockOsc = ctx.createOscillator();
            knockOsc.type = 'sine';
            knockOsc.frequency.value = 92;
            knockOsc.connect(knockGain);
            const t = ctx.currentTime;
            // two short pulses (knock-knock)
            knockGain.gain.setValueAtTime(0, t);
            knockGain.gain.linearRampToValueAtTime(0.22, t + 0.012);
            knockGain.gain.linearRampToValueAtTime(0, t + 0.10);
            knockGain.gain.linearRampToValueAtTime(0.22, t + 0.22);
            knockGain.gain.linearRampToValueAtTime(0, t + 0.32);
            knockOsc.start(t);
            knockOsc.stop(t + 0.40);
            const nextDelay = 14000 + Math.random() * 22000;
            foyerKnockTimer = setTimeout(scheduleKnock, nextDelay);
        };
        foyerKnockTimer = setTimeout(scheduleKnock, 8000 + Math.random() * 8000);

        if (foyerHumCtx.state === 'suspended') foyerHumCtx.resume();
    } catch (_) {
        foyerHumCtx = null;
        foyerHumOscA = null;
        foyerHumNoise = null;
    }
}

function stopFoyerHum() {
    try {
        foyerHumOscA?.stop();
        foyerHumNoise?.stop();
        foyerHumCtx?.close?.();
    } catch (_) {}
    if (foyerKnockTimer) {
        clearTimeout(foyerKnockTimer);
        foyerKnockTimer = null;
    }
    foyerHumOscA = null;
    foyerHumNoise = null;
    foyerHumCtx = null;
}

function applyFoyerRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(FOYER_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(FOYER_VISIT_KEY, String(visits)); } catch (_) {}

    // under-door light color
    const lightIdx = (visits + 1) % FOYER_LIGHT_VARIANTS.length;
    FOYER_LIGHT_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        if (i === lightIdx) {
            node.setAttribute('visibility', 'visible');
            node.setAttribute('opacity', '0.95');
        } else {
            node.setAttribute('visibility', 'hidden');
            node.setAttribute('opacity', '0');
        }
    });

    // peephole scene starts at a fresh index per visit
    const peepholeIdx = (visits - 1) % FOYER_PEEPHOLE_FRAGMENTS.length;

    return { lightIdx, peepholeIdx };
}

function cycleFoyerLight(svgDoc, svgRoot) {
    const state = svgRoot._fyRotations || { lightIdx: 0 };
    const next = (state.lightIdx + 1) % FOYER_LIGHT_VARIANTS.length;
    FOYER_LIGHT_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        if (i === next) {
            node.setAttribute('visibility', 'visible');
            node.setAttribute('opacity', '0.95');
        } else {
            node.setAttribute('visibility', 'hidden');
            node.setAttribute('opacity', '0');
        }
    });
    state.lightIdx = next;
    svgRoot._fyRotations = state;
    return next;
}

function cycleFoyerPeephole(svgRoot) {
    const state = svgRoot._fyRotations || { peepholeIdx: 0 };
    const next = (state.peepholeIdx + 1) % FOYER_PEEPHOLE_FRAGMENTS.length;
    state.peepholeIdx = next;
    svgRoot._fyRotations = state;
    return next;
}

function setupFoyerMemorySvgRuntime() {
    const roomObject = document.getElementById('foyer-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        const rotations = applyFoyerRotations(svgDoc);
        svgRoot._fyRotations = rotations;

        if (svgRoot.dataset.fyBound === 'true') return;

        const tipEl = document.getElementById('foyer-memory-tip');
        const defaultTip = 'hover for fragments. click anything to remember. peek through the peephole. the light beneath the door keeps changing color.';

        Object.entries(foyerMemoryHoverTips).forEach(([hotspotId, tip]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                if (hotspotId === 'hit-under-door') {
                    const idx = (svgRoot._fyRotations || {}).lightIdx ?? 0;
                    tipEl.textContent = FOYER_LIGHT_HOVER_TIPS[idx] || tip;
                } else {
                    tipEl.textContent = tip;
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // peephole click cycles to the next hallway
        const peepholeHit = svgDoc.getElementById('hit-peephole');
        if (peepholeHit) {
            peepholeHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = cycleFoyerPeephole(svgRoot);
                if (tipEl) tipEl.textContent = FOYER_PEEPHOLE_FRAGMENTS[next] || foyerMemoryHoverTips['hit-peephole'];
            });
        }

        // under-door click cycles to the next color
        const underHit = svgDoc.getElementById('hit-under-door');
        if (underHit) {
            underHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = cycleFoyerLight(svgDoc, svgRoot);
                if (tipEl) tipEl.textContent = FOYER_LIGHT_CLICK_FRAGMENTS[next] || foyerMemoryHoverTips['hit-under-door'];
            });
        }

        // chain click does NOT undo it (it's stuck) — gives a stuck-chain fragment
        const chainHit = svgDoc.getElementById('hit-chain');
        if (chainHit) {
            chainHit.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = 'you slide the chain. it does not slide. you slide it again. it does not slide.';
            });
        }

        // generic click handlers for the rest
        Object.entries(foyerMemoryClickFragments).forEach(([hotspotId, fragment]) => {
            if (hotspotId === 'hit-peephole' || hotspotId === 'hit-under-door' ||
                hotspotId === 'hit-chain') return;
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                if (tipEl) tipEl.textContent = fragment;
            });
        });

        svgRoot.dataset.fyBound = 'true';
    };

    if (!roomObject.dataset.fyLoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.fyLoadHooked = 'true';
    }
    bind();
}

const foyerCloseBtn = document.getElementById('foyer-memory-close');
if (foyerCloseBtn) foyerCloseBtn.addEventListener('click', closeFoyerMemory);

// ============================================================
// bedroom three memory vignette (apartment two) - softly between identities
// the room slowly transformed into something else but is still warmly kept.
// hotspots offer rotating ("overlapping") hover and click fragments — the
// same object remembers different years on different visits. the window
// scenery, the doorway position, and the mug position rotate per visit.
// hovering the lamp briefly intensifies the warm light and surfaces the
// glow-patch growth chart.
// ============================================================
const bedroomThreeMemoryHoverTips = {
    'hit-stars':         [
        'glow-in-the-dark stars on the wall. they were there long before you painted over them. they came back through the paint.',
        'tiny pixel stars. they always glowed at almost-bedtime.',
        'a constellation that does not exist in any sky. you arranged it yourself. you do not remember when.'
    ],
    'hit-string-lights': [
        'a string of warm bulbs draped along the ceiling. they have outlasted three uses for this room.',
        'fairy lights. you put them up for one evening, two years ago. they have stayed.'
    ],
    'hit-frame':         [
        'a small framed crayon drawing. a house, a sun, a name in pencil along the bottom.',
        'a child\u2019s drawing of a house. it does not look like any house you have lived in.'
    ],
    'hit-glow-patch':    [
        'a soft warm patch on the wall. something faint underneath it. it brightens when you look.',
        'a glow on the wallpaper. the wall remembers something just under the surface.'
    ],
    'hit-doorway':       [
        'the doorway. the same doorway as last time, mostly. the frame is in roughly the same place.',
        'a doorway with warm light leaking through from the next room. it is open just enough.',
        'the door to the rest of the apartment. it has shifted by maybe an inch since the last time you stood here.'
    ],
    'hit-window':        [
        'the window. the view through it is a little different than you remember.',
        'a window in a wooden frame. the weather outside does not match what you saw earlier.',
        'the window. it shows you a different evening every time you look back at it.'
    ],
    'hit-curtains':      [
        'sheer curtains. a thin warm veil. they were a hand-me-down. so were you.',
        'gauzy curtains hanging still. they catch the lamp light more than the window light.'
    ],
    'hit-plush':         [
        'a small plush bear with a pink ribbon. older than the rest of the room.',
        'the bear. you keep meaning to put it in a box. you keep not doing it.',
        'a plush bear sitting on the pillow. it has watched the room change purposes more than once.'
    ],
    'hit-daybed':        [
        'a daybed with cream linens. it was a real bed, once. then a couch. then this.',
        'a low daybed. you sit here when the rest of the apartment feels like too much.',
        'a daybed and a folded throw. the room rearranges itself around it.'
    ],
    'hit-lamp':          [
        'a small nightstand lamp. the warmest light in the apartment.',
        'the lamp you bought used. you have moved it into four different rooms now.',
        'a soft amber lamp. it lights more of the room than it should be able to.'
    ],
    'hit-books':         [
        'a stack of three books. one of them is from a class you took years ago.',
        'books you mean to read again. one of them is dog-eared on a page you do not remember marking.'
    ],
    'hit-mug':           [
        'a small ceramic mug with a faint thread of steam. you do not remember pouring it.',
        'a mug on top of the books. it is warm. it has been warm for a while now.',
        'the mug, in a slightly different spot than last time. always still warm.'
    ],
    'hit-plant':         [
        'a houseplant in a clay pot. it gets exactly enough light here.',
        'the plant. it has been with you longer than the apartment has been yours.'
    ],
    'hit-rug':           [
        'a soft striped rug. the corners curl up where you walk most.',
        'a rug. you remember it being a different color in a different apartment.'
    ],
    'hit-boxes':         [
        'two soft moving boxes. one is labeled "winter". the other has a small heart drawn on it.',
        'boxes you keep meaning to unpack. you opened one once. you closed it again gently.'
    ]
};

const bedroomThreeMemoryClickFragments = {
    'hit-stars':         [
        'you trace one of the little stars with a fingertip. it leaves a faint warm afterglow against the paint.',
        'the stars are stickers. they have been re-stuck so many times the paint underneath has changed color.',
        'you remember being told the constellation\u2019s name. you remember making the name up.'
    ],
    'hit-string-lights': [
        'you reach up and touch one of the bulbs. it is warm in the way only small lights are warm.',
        'the lights flicker, just barely, in the rhythm of someone humming.'
    ],
    'hit-frame':         [
        'a small house. a sun above it. a name in pencil along the bottom edge of the page that is almost yours.',
        'you take the frame off the wall and set it back exactly where it was.'
    ],
    'hit-glow-patch':    [
        'you press your palm flat against the warm patch. you can feel the wall remembering something underneath.',
        'the glow shifts as you watch. just under it, a faint pencil line and a name you have not said in years.'
    ],
    'hit-doorway':       [
        'you stand in the doorway. the rest of the apartment is right where it should be. mostly.',
        'warm light from the hall. a soft floor-creak from the next room. nothing alarming.',
        'the door is open just enough to let the warmth pass through both ways.'
    ],
    'hit-window':        [
        'you look through the window. dusk and rooftops and one warm window across the street.',
        'you look through the window. soft snow falling slow. the lit windows in the distance are warm.',
        'you look through the window. a pink dawn. a single bird. you do not know what time it is.'
    ],
    'hit-curtains':      [
        'you pull the curtain aside. the lamp light catches it. for a moment the whole room is softer.',
        'the curtains move very slightly even though there is no draft.'
    ],
    'hit-plush':         [
        'you adjust the bear so the ribbon is straight. you sit with it for a second longer than you meant to.',
        'the bear has the same name it had when you were small. it has not been said out loud in years.',
        'you put the bear back exactly where it was. it knows the spot.'
    ],
    'hit-daybed':        [
        'you sit on the edge of the daybed. it holds your weight the way it has every other version of you.',
        'you smooth the cream linens. the room feels a little more like a room.',
        'you fold the throw blanket again, slightly differently than you found it.'
    ],
    'hit-lamp':          [
        'the lamp warms the room a little more whenever you stand near it. you stay for a moment longer.',
        'you turn the lamp\u2019s base. the warmth deepens, then settles back into itself.',
        'the lamp glow falls across the bed and the books and the mug and you. all four of you are warm.'
    ],
    'hit-books':         [
        'you slide one of the books out, look at the spine, and put it back without opening it.',
        'the dog-eared page is dog-eared in a hand that almost looks like yours.',
        'you read three sentences from somewhere in the middle. they are exactly the sentences you needed.'
    ],
    'hit-mug':           [
        'the mug is warm. you do not remember pouring it. you take a small sip anyway.',
        'the mug shifts slightly on top of the books each time you look back at it.',
        'still warm. it has been "still warm" for as long as the room has been like this.'
    ],
    'hit-plant':         [
        'you brush a leaf with a fingertip. the plant has new growth at its center.',
        'you give the soil a careful press. it is exactly damp enough.'
    ],
    'hit-rug':           [
        'you nudge the corner of the rug back into place with the side of your foot.',
        'the rug is warmer than the floor in a way that feels intentional.'
    ],
    'hit-boxes':         [
        'you put a hand on the smaller box. you do not open it. you just let it know you are there.',
        'the heart on the smaller box was drawn by someone. probably you. you cannot quite remember.',
        '"winter" is the only legible label. inside is more than just winter.'
    ]
};

const B3_DOORWAY_VARIANTS = ['b3-doorway-a', 'b3-doorway-b', 'b3-doorway-c'];
const B3_WINDOW_VARIANTS = ['b3-window-a', 'b3-window-b', 'b3-window-c'];
const B3_MUG_VARIANTS = ['b3-mug-a', 'b3-mug-b', 'b3-mug-c'];
const B3_WINDOW_CLICK_FRAGMENTS = [
    'you look through the window. dusk and rooftops and one warm window across the street.',
    'you look through the window. soft snow falling slow. the lit windows in the distance are warm.',
    'you look through the window. a pink dawn. a single bird. you do not know what time it is.'
];
const B3_WINDOW_HOVER_TIPS = [
    'a window onto a warm dusk. rooftops. a single lit window across the street.',
    'a window onto a slow blue snowfall. distant warm windows in the dark.',
    'a window onto a soft pink dawn. a thin streak of cloud and a far-off bird.'
];
const BEDROOM_THREE_VISIT_KEY = 'bedroomthree-aptdos.visitCount';

let b3HumCtx = null;
let b3HumOscA = null;
let b3HumOscB = null;
let b3HumNoise = null;
let b3ChimeTimer = null;

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
    if (tip) tip.textContent = 'hover and click to remember. some objects belong to more than one year. the window keeps showing different weather. the doorway is in roughly the same place.';
    startBedroomThreePad();
    setupBedroomThreeMemorySvgRuntime();
}

function closeBedroomThreeMemory() {
    const overlay = document.getElementById('bedroom-three-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    stopBedroomThreeHum();
}

// a warm dreamy pad: two oscillators tuned to a soft minor third + gentle
// low-passed noise floor + occasional warm chime tones at slow, irregular
// (but pleasant) intervals. nothing glitches, nothing skips.
function startBedroomThreePad() {
    stopBedroomThreeHum();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        b3HumCtx = new Ctx();

        const masterGain = b3HumCtx.createGain();
        masterGain.gain.value = 0.024;
        masterGain.connect(b3HumCtx.destination);

        // a warm minor third low in the register (A2 + C3 area)
        b3HumOscA = b3HumCtx.createOscillator();
        b3HumOscA.type = 'sine';
        b3HumOscA.frequency.value = 110;
        const gainA = b3HumCtx.createGain();
        gainA.gain.value = 0.50;
        b3HumOscA.connect(gainA);
        gainA.connect(masterGain);

        b3HumOscB = b3HumCtx.createOscillator();
        b3HumOscB.type = 'sine';
        b3HumOscB.frequency.value = 130.8;
        const gainB = b3HumCtx.createGain();
        gainB.gain.value = 0.42;
        b3HumOscB.connect(gainB);
        gainB.connect(masterGain);

        // soft low-passed noise floor (gentle apartment ambience)
        const bufferSize = 2 * b3HumCtx.sampleRate;
        const noiseBuffer = b3HumCtx.createBuffer(1, bufferSize, b3HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.45;
        }
        b3HumNoise = b3HumCtx.createBufferSource();
        b3HumNoise.buffer = noiseBuffer;
        b3HumNoise.loop = true;
        const noiseFilter = b3HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 320;
        const noiseGain = b3HumCtx.createGain();
        noiseGain.gain.value = 0.22;
        b3HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        b3HumOscA.start();
        b3HumOscB.start();
        b3HumNoise.start();

        // schedule occasional warm chime tones (sine, gentle envelope, far apart).
        // pitches drawn from a small warm scale so any combination sounds fine.
        const chimeNotes = [523.25, 659.25, 784.0, 880.0]; // C5, E5, G5, A5
        const scheduleChime = () => {
            if (!b3HumCtx) return;
            const ctx = b3HumCtx;
            const t = ctx.currentTime;
            const note = chimeNotes[Math.floor(Math.random() * chimeNotes.length)];

            const chimeGain = ctx.createGain();
            chimeGain.gain.value = 0;
            chimeGain.connect(masterGain);
            const chimeOsc = ctx.createOscillator();
            chimeOsc.type = 'sine';
            chimeOsc.frequency.value = note;
            chimeOsc.connect(chimeGain);
            chimeGain.gain.setValueAtTime(0, t);
            chimeGain.gain.linearRampToValueAtTime(0.10, t + 0.04);
            chimeGain.gain.exponentialRampToValueAtTime(0.0008, t + 1.6);
            chimeOsc.start(t);
            chimeOsc.stop(t + 1.7);

            // long, slow, gentle spacing — feels like a memory passing through
            const nextDelay = 11000 + Math.random() * 14000;
            b3ChimeTimer = setTimeout(scheduleChime, nextDelay);
        };
        b3ChimeTimer = setTimeout(scheduleChime, 5000 + Math.random() * 4000);

        if (b3HumCtx.state === 'suspended') b3HumCtx.resume();
    } catch (_) {
        b3HumCtx = null;
        b3HumOscA = null;
        b3HumOscB = null;
        b3HumNoise = null;
    }
}

function stopBedroomThreeHum() {
    try {
        b3HumOscA?.stop();
        b3HumOscB?.stop();
        b3HumNoise?.stop();
        b3HumCtx?.close?.();
    } catch (_) {}
    if (b3ChimeTimer) {
        clearTimeout(b3ChimeTimer);
        b3ChimeTimer = null;
    }
    b3HumOscA = null;
    b3HumOscB = null;
    b3HumNoise = null;
    b3HumCtx = null;
}

function applyBedroomThreeRotations(svgDoc) {
    let visits = 0;
    try { visits = parseInt(localStorage.getItem(BEDROOM_THREE_VISIT_KEY) || '0', 10); } catch (_) {}
    visits = Number.isFinite(visits) ? visits + 1 : 1;
    try { localStorage.setItem(BEDROOM_THREE_VISIT_KEY, String(visits)); } catch (_) {}

    // doorway position drifts subtly
    const doorIdx = (visits - 1) % B3_DOORWAY_VARIANTS.length;
    B3_DOORWAY_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === doorIdx ? 'visible' : 'hidden');
    });

    // window scenery: a different view through the window each visit (offset
    // from the doorway rotation so the room never feels exactly the same)
    const windowIdx = (visits + 1) % B3_WINDOW_VARIANTS.length;
    B3_WINDOW_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === windowIdx ? 'visible' : 'hidden');
    });

    // the teacup migrates across the top of the book stack between visits
    const mugIdx = (visits + 2) % B3_MUG_VARIANTS.length;
    B3_MUG_VARIANTS.forEach((id, i) => {
        const node = svgDoc.getElementById(id);
        if (!node) return;
        node.setAttribute('visibility', i === mugIdx ? 'visible' : 'hidden');
    });

    return { doorIdx, windowIdx, mugIdx, visits };
}

// pulls the next item from a per-hotspot rotating array. each visit-then-click
// cycle goes through "overlapping" memories of the same object (different years).
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

        if (svgRoot.dataset.b3Bound === 'true') return;

        const tipEl = document.getElementById('bedroom-three-memory-tip');
        const defaultTip = 'hover and click to remember. some objects belong to more than one year. the window keeps showing different weather. the doorway is in roughly the same place.';

        // per-hotspot rotation indices, separate for hover vs click,
        // so revisiting the same object surfaces a different layer of memory.
        const hoverState = {};
        const clickState = {};

        // bind generic hover/click for every hotspot in the tips map
        Object.keys(bedroomThreeMemoryHoverTips).forEach((hotspotId) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';
            hotspot.addEventListener('mouseenter', () => {
                if (!tipEl) return;
                if (hotspotId === 'hit-window') {
                    const idx = (svgRoot._b3Rotations || {}).windowIdx ?? 0;
                    tipEl.textContent = B3_WINDOW_HOVER_TIPS[idx] || pickRotatingFragment(bedroomThreeMemoryHoverTips, hotspotId, hoverState);
                } else {
                    const next = pickRotatingFragment(bedroomThreeMemoryHoverTips, hotspotId, hoverState);
                    if (next) tipEl.textContent = next;
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                if (tipEl) tipEl.textContent = defaultTip;
            });
        });

        // window click cycles to the next scene
        const windowHit = svgDoc.getElementById('hit-window');
        if (windowHit) {
            windowHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const state = svgRoot._b3Rotations || { windowIdx: 0 };
                const next = (state.windowIdx + 1) % B3_WINDOW_VARIANTS.length;
                B3_WINDOW_VARIANTS.forEach((id, i) => {
                    const node = svgDoc.getElementById(id);
                    if (!node) return;
                    node.setAttribute('visibility', i === next ? 'visible' : 'hidden');
                });
                state.windowIdx = next;
                svgRoot._b3Rotations = state;
                if (tipEl) tipEl.textContent = B3_WINDOW_CLICK_FRAGMENTS[next] || '';
            });
        }

        // hovering the lamp briefly intensifies the pool of warm light AND
        // surfaces the glow patch's hidden growth-chart line for a moment.
        const lampHit = svgDoc.getElementById('hit-lamp');
        const lampPool = svgRoot.querySelector('ellipse[fill="url(#b3LampPool)"]');
        const growthChart = svgDoc.getElementById('b3-growth-chart');
        if (lampHit) {
            let restoreTimer = null;
            lampHit.addEventListener('mouseenter', () => {
                if (restoreTimer) { clearTimeout(restoreTimer); restoreTimer = null; }
                if (lampPool) lampPool.setAttribute('opacity', '1.25');
                if (growthChart) growthChart.setAttribute('opacity', '0.55');
            });
            lampHit.addEventListener('mouseleave', () => {
                restoreTimer = setTimeout(() => {
                    if (lampPool) lampPool.removeAttribute('opacity');
                    if (growthChart) growthChart.setAttribute('opacity', '0');
                    restoreTimer = null;
                }, 600);
            });
        }

        // hovering the glow patch fades the hidden growth chart in directly
        // (and on click reveals it longer with a memory fragment)
        const glowHit = svgDoc.getElementById('hit-glow-patch');
        if (glowHit && growthChart) {
            let restoreTimer = null;
            glowHit.addEventListener('mouseenter', () => {
                if (restoreTimer) { clearTimeout(restoreTimer); restoreTimer = null; }
                growthChart.setAttribute('opacity', '0.7');
            });
            glowHit.addEventListener('mouseleave', () => {
                restoreTimer = setTimeout(() => {
                    growthChart.setAttribute('opacity', '0');
                    restoreTimer = null;
                }, 600);
            });
            glowHit.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = pickRotatingFragment(bedroomThreeMemoryClickFragments, 'hit-glow-patch', clickState);
                if (tipEl && next) tipEl.textContent = next;
                growthChart.setAttribute('opacity', '0.85');
                setTimeout(() => { growthChart.setAttribute('opacity', '0'); }, 2400);
            });
        }

        // generic click handlers for everything else
        Object.keys(bedroomThreeMemoryClickFragments).forEach((hotspotId) => {
            if (hotspotId === 'hit-window' || hotspotId === 'hit-glow-patch') return;
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const next = pickRotatingFragment(bedroomThreeMemoryClickFragments, hotspotId, clickState);
                if (tipEl && next) tipEl.textContent = next;
            });
        });

        svgRoot.dataset.b3Bound = 'true';
    };

    if (!roomObject.dataset.b3LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.b3LoadHooked = 'true';
    }
    bind();
}

const bedroomThreeCloseBtn = document.getElementById('bedroom-three-memory-close');
if (bedroomThreeCloseBtn) bedroomThreeCloseBtn.addEventListener('click', closeBedroomThreeMemory);

// "leave something behind" routes to the existing closet/wall-writing mechanic.
// closing the vignette first so the closet's dim layer reads cleanly.
const bedroomThreeLeaveBtn = document.getElementById('bedroom-three-memory-leave');
if (bedroomThreeLeaveBtn) {
    bedroomThreeLeaveBtn.addEventListener('click', () => {
        closeBedroomThreeMemory();
        if (typeof openCloset === 'function') openCloset();
    });
}
