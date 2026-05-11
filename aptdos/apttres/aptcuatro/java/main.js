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
        text: 'sometimes too cold, sometimes too hot, but music always flows, laughs are thrown around carefree and family feels closer than ever when spending time here.'
    },

    'bedroom-two': {
        title: 'bedroom two',
        text: 'where the cat runs off when everything feels too overwhelming.'
    },

    'bedroom-three': {
        title: 'bedroom three',
        text: 'a sort of wasteland where a gumpry troll lives...at least, she always keeps things interesting.'
    },

    'closet-one': {
        title: 'closet one',
        text: 'the reset, a place to reminisce once more.'
    },

    'closet-two': {
        title: 'closet two',
        text: 'this time, these spaces have a little less meaning, but they hold a thousand treasures all the same.'
    },

    'closet-three': {
        title: 'closet three',
        text: 'this time, these spaces have a little less meaning, but they hold a thousand treasures all the same.'
    },

     'closet-four': {
        title: 'closet four',
        text: 'this time, these spaces have a little less meaning, but they hold a thousand treasures all the same.'
    },

    'bathroom': {
        title: 'bathroom',
        text: 'a place to leave a message or two...'
    },

    'living-kitchen': {
        title: 'living room & kitchen',
        text: 'the space where multiple generations collide, sometimes for the best and sometimes for the worst, with dinners had, messes made and memories stitched into the fabric of their minds forever.'
    },

    'front-closet': {
        title: 'front closet',
        text: 'a place to leave your secrets...'
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

const NOTEBOOK_SHELL_DEFAULT = '../../../elements/room-shell-only.svg';
const NOTEBOOK_SHELL_BATHROOM = '../../../elements/room-shell-bathroom-notebook.svg';
const NOTEBOOK_SHELL_MASTER = '../../../elements/room-shell-master-bedroom.svg';

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

    // bedroom one opens its memory vignette (preserved, sharply remembered)
    if (id === 'bedroom-one') {
        visited[id] = true;
        room.classList.add('visited');
        openBedroomOneMemory();
        return;
    }

    // bedroom two opens its memory vignette (suspended workspace)
    if (id === 'bedroom-two') {
        visited[id] = true;
        room.classList.add('visited');
        openBedroomTwoMemory();
        return;
    }

    // bedroom three opens its memory vignette (emotionally unfinished, partially decorated)
    if (id === 'bedroom-three') {
        visited[id] = true;
        room.classList.add('visited');
        openBedroomThreeMemory();
        return;
    }

    // closet two opens its memory vignette (preserved utility closet, perfectly symmetric)
    if (id === 'closet-two') {
        visited[id] = true;
        room.classList.add('visited');
        openClosetTwoMemory();
        return;
    }

    // closet three opens its memory vignette (preserved travel, hidden notes inside bags)
    if (id === 'closet-three') {
        visited[id] = true;
        room.classList.add('visited');
        openClosetThreeMemory();
        return;
    }

    // closet four opens its memory vignette (categorized + systemized; labels rename, interactions reset)
    if (id === 'closet-four') {
        visited[id] = true;
        room.classList.add('visited');
        openClosetFourMemory();
        return;
    }

    // bedroom closet should lead to apartment numero dos
    // test
    if (id === 'closet-one') {
        //show the note first
        const note = document.getElementById('door-note');
        const noteOverlay = document.getElementById('door-note-overlay');
        note.classList.add('visible');
        noteOverlay.classList.add('visible');

        // if yes, proceed
        document.getElementById('note-yes').onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
            const door = document.getElementById('door-transition');
            door.classList.add('active');
            // First home reads this on load for “return” / light-adjacent progression (see java/return-home.js)
            try {
                localStorage.setItem('uht-arriving-from-fourth-home', '1');
            } catch (_err) { /* private mode / quota */ }
            setTimeout(() => {
                window.location.href = 'https://danielaaaas.github.io/expressiveweb/index.html';
            }, 1500);
        };

        // if no, dismiss the note and reveal the closet-one memory vignette
        document.getElementById('note-no').onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
            openClosetOneMemory();
        };
    return;
}

// living + kitchen opens its memory vignette (sparse, suspended; frozen TV broadcasts)
    if (id === 'living-kitchen') {
        visited[id] = true;
        room.classList.add('visited');
        openLivingKitchenMemory();
        return;
    }

// bathroom opens its memory vignette (polished mirror + impossible ghost reflections)
    if (id === 'bathroom') {
        visited[id] = true;
        room.classList.add('visited');
        openBathroomMemory();
        return;
    }

// front closet opens its memory vignette (the final threshold preserved)
    if (id === 'front-closet') {
        visited[id] = true;
        room.classList.add('visited');
        openFrontClosetMemory();
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
    if (typeof closeClosetOneMemory === 'function') closeClosetOneMemory();
    if (typeof closeClosetTwoMemory === 'function') closeClosetTwoMemory();
    if (typeof closeClosetThreeMemory === 'function') closeClosetThreeMemory();
    if (typeof closeClosetFourMemory === 'function') closeClosetFourMemory();
    if (typeof closeBathroomMemory === 'function') closeBathroomMemory();
    if (typeof closeLivingKitchenMemory === 'function') closeLivingKitchenMemory();
    if (typeof closeFrontClosetMemory === 'function') closeFrontClosetMemory();
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
// Bedroom One Memory Vignette (apartment four)
// preserved, sharply remembered, carefully maintained.
// less faded than apt 3 - sentences mostly finish, but the
// room is too still, too organized, too quiet to be lived in.
// ============================================================

const bedroomoneMemoryHoverTips = {
    'hit-curtain':   'a sheer curtain. it has not moved once.',
    'hit-window':    'the window. the sky outside has been the exact same shade for hours.',
    'hit-curtain-r': 'the other curtain. pulled symmetrically. neither one has moved.',
    'hit-sill':      'the windowsill. dust-free. as if she still wipes it down on sundays.',
    'hit-outlet':    'a wall outlet. nothing has been plugged in here in months.',
    'hit-headboard': 'the headboard. she chose it for how quietly it would sit against the wall.',
    'hit-pillows':   'two pillows, stacked exactly. the front one is set forward by an inch and a half.',
    'hit-comforter': 'the comforter. smoothed down. you can see where her hand passed across it last.',
    'hit-throw':     'a folded throw at the foot of the bed. the folds are too even to be casual.',
    'hit-frame':     'the bed frame. low, modern, pale. one leg is visible at the corner.',
    'hit-bed':       'the bed. made the way she always made it. nothing on it is out of place.',
    'hit-table':     'the bedside table. everything on top has its own assigned spot.',
    'hit-lamp':      'the lamp. the light it puts out is exactly the same as it was last week.',
    'hit-photo':     'a framed photograph, placed dead-center on the table. the glass is suspiciously bright.',
    'hit-clock':     'a small alarm clock. the hands are stopped. you almost don\u2019t notice at first.',
    'hit-book':      'a single book, squared to the table edge. the bookmark has not moved.',
    'hit-floor':     'the floor. the wood is paler in the rectangle where the rug used to live.',
    'hit-wall':      'a wide pale wall. she did not hang anything here. she said it was finished as it was.'
};

const bedroomoneMemoryClickFragments = {
    'hit-curtain':   'you put your hand near the curtain to feel the draft. there is no draft. there has not been one in this room for a while.',
    'hit-window':    'the sky behind the glass is exactly the sky it was an hour ago. you check twice. it does not change.',
    'hit-curtain-r': 'you reach for the second curtain. it is in the position the first one is in. you cannot remember which one of you set them like this.',
    'hit-sill':      'you run a finger along the sill, expecting dust. there is none. somebody has been keeping this clean for you.',
    'hit-outlet':    'the outlet is empty. there used to be a small night-light plugged in here, on a timer. it is not here now.',
    'hit-headboard': 'you lean back against it. it is exactly the right height. it has been exactly the right height since the day it arrived.',
    'hit-pillows':   'you press the front pillow in the middle. it holds the impression for a moment. then it returns to the exact shape it was in.',
    'hit-comforter': 'you smooth the comforter, even though it is already smooth. you find your hand doing this in this room every time.',
    'hit-throw':     'you unfold one corner of the throw and refold it. when you look back a moment later it is folded the way it was before.',
    'hit-frame':     'you sit on the edge of the bed. the frame does not creak. it has not creaked once since the move.',
    'hit-bed':       'you sit down. the room does not register that you have sat down. the bed accepts you without giving anything back.',
    'hit-table':     'you nudge the lamp half an inch to the right. when you look again it is back where it was. you do not remember moving it back.',
    'hit-lamp':      'you click the switch. the lamp is already on. it has been on at this exact warmth for as long as you can remember.',
    'hit-photo':     'you pick up the photograph. the glass holds a perfect tiny version of this room. you can count the pillows. you set it down very carefully.',
    'hit-clock':     'you check the time. the hands have not moved since the last time you checked. the second hand is not moving either. the room is paused around it.',
    'hit-book':      'you open the book. the bookmark is on the page you stopped on. you have not picked this book up in months. the bookmark has not slid even one page.',
    'hit-floor':     'you step into the lighter rectangle on the floor. the wood is cooler there. the rug was here. you know exactly when you took it out.',
    'hit-wall':      'you put your palm flat against the wall. the wall is the exact temperature of the air around it. nothing in the room is warmer than anything else.'
};

// fragments that surface ON THEIR OWN every 28-44 seconds while the
// vignette is open - quieter and slower than apt 3, with the same
// fixed-room, fixed-light quality as the brief.
const bedroomoneSurfacingFragments = [
    'the room is almost exactly the way you left it. almost.',
    'the light has barely shifted since you came in. there is a warmth at the corner of the wall that you do not remember being there.',
    'the curtains have not moved. you have started watching them, just in case.',
    'the lamp pool is in the same place on the table. it is a little softer than it was.',
    'the photograph is still placed dead-center.',
    'the clock has not advanced. you stop expecting it to.',
    'somewhere in the apartment, a fridge hum. it could be the kitchen. it could be a memory of a kitchen.',
    'the comforter is still smoothed down where your hand left it.',
    'the bed has not been slept in since you made it last.',
    'a faint smell of brewed coffee from another room - though no one has made any.',
    'the room is preserved. you have not yet decided whether you live here.'
];

let bo4HumCtx = null;
let bo4HumOscA = null;
let bo4HumOscB = null;
let bo4HumLfo = null;
let bo4SurfacingTimerId = null;

function openBedroomOneMemory() {
    const roomObject = document.getElementById('bedroomone-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bedroomone-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bedroomone-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. nothing in this room moves. some interactions return slowly. fragments may surface on their own.';
    startBedroomOnePad();
    setupBedroomOneMemorySvgRuntime();
}

function closeBedroomOneMemory() {
    const overlay = document.getElementById('bedroomone-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (bo4SurfacingTimerId) {
        clearTimeout(bo4SurfacingTimerId);
        bo4SurfacingTimerId = null;
    }
    stopBedroomOnePad();
}

// a very quiet, very still pad: a low C2 sine + a soft G2 fifth above
// at very low gain, with no noise floor. the slow LFO breathes
// imperceptibly. it should feel like the room is only barely there.
function startBedroomOnePad() {
    stopBedroomOnePad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        bo4HumCtx = new Ctx();

        const masterGain = bo4HumCtx.createGain();
        masterGain.gain.value = 0.012;
        masterGain.connect(bo4HumCtx.destination);

        bo4HumOscA = bo4HumCtx.createOscillator();
        bo4HumOscA.type = 'sine';
        bo4HumOscA.frequency.value = 65.4; // C2
        const gainA = bo4HumCtx.createGain();
        gainA.gain.value = 0.6;
        bo4HumOscA.connect(gainA);
        gainA.connect(masterGain);

        bo4HumOscB = bo4HumCtx.createOscillator();
        bo4HumOscB.type = 'sine';
        bo4HumOscB.frequency.value = 98.0; // G2 (open fifth - hollow, not warm)
        const gainB = bo4HumCtx.createGain();
        gainB.gain.value = 0.32;
        bo4HumOscB.connect(gainB);
        gainB.connect(masterGain);

        // very slow LFO (~28s period) - imperceptible swell
        bo4HumLfo = bo4HumCtx.createOscillator();
        bo4HumLfo.type = 'sine';
        bo4HumLfo.frequency.value = 1 / 28;
        const lfoDepth = bo4HumCtx.createGain();
        lfoDepth.gain.value = 0.006;
        bo4HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        bo4HumOscA.start();
        bo4HumOscB.start();
        bo4HumLfo.start();
        if (bo4HumCtx.state === 'suspended') bo4HumCtx.resume();
    } catch (_) {
        bo4HumCtx = null;
        bo4HumOscA = null;
        bo4HumOscB = null;
        bo4HumLfo = null;
    }
}

function stopBedroomOnePad() {
    try {
        bo4HumOscA?.stop();
        bo4HumOscB?.stop();
        bo4HumLfo?.stop();
        bo4HumCtx?.close?.();
    } catch (_) {}
    bo4HumOscA = null;
    bo4HumOscB = null;
    bo4HumLfo = null;
    bo4HumCtx = null;
}

// a single, very short, glassy chime when an unprompted fragment surfaces.
// quieter and shorter than apt 3 so it does not break the stillness.
function playBedroomOneChime() {
    if (!bo4HumCtx) return;
    try {
        const now = bo4HumCtx.currentTime;
        const osc = bo4HumCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 783.99; // a soft G5
        const g = bo4HumCtx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.014, now + 0.55);
        g.gain.linearRampToValueAtTime(0, now + 2.8);
        osc.connect(g);
        g.connect(bo4HumCtx.destination);
        osc.start(now);
        osc.stop(now + 3.0);
    } catch (_) {}
}

function setupBedroomOneMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroomone-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.bo4Bound === 'true') {
            scheduleBedroomOneSurfacing();
            return;
        }

        const tipEl = document.getElementById('bedroomone-memory-tip');
        const defaultTip = 'hover and click to remember. nothing in this room moves. some interactions return slowly. fragments may surface on their own.';

        let pendingTipTimer = null;
        // longer fade than apt 3 - "interactions respond slightly slowly"
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 720);
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
                    if (!document.getElementById('bedroomone-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 4200);
                pendingTipTimer = null;
            }, 600);
        };
        svgRoot._bo4SetTipSurfacing = setTipSurfacing;

        Object.entries(bedroomoneMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                setTipSlow(hoverText);
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = bedroomoneMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
            });
        });

        svgRoot.dataset.bo4Bound = 'true';
        scheduleBedroomOneSurfacing();
    };

    if (!roomObject.dataset.bo4LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.bo4LoadHooked = 'true';
    }
    bind();
}

// schedules a hidden fragment to surface on its own every 28-44 seconds.
// longer interval than apt 3 - "almost silent" room.
function scheduleBedroomOneSurfacing() {
    if (bo4SurfacingTimerId) clearTimeout(bo4SurfacingTimerId);
    const overlay = document.getElementById('bedroomone-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 28000 + Math.floor(Math.random() * 16000);
    bo4SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('bedroomone-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('bedroomone-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = bedroomoneSurfacingFragments[Math.floor(Math.random() * bedroomoneSurfacingFragments.length)];
        if (svgRoot?._bo4SetTipSurfacing) {
            svgRoot._bo4SetTipSurfacing(fragment);
            playBedroomOneChime();
        }
        scheduleBedroomOneSurfacing();
    }, wait);
}

const bedroomoneCloseBtn = document.getElementById('bedroomone-memory-close');
if (bedroomoneCloseBtn) bedroomoneCloseBtn.addEventListener('click', closeBedroomOneMemory);

// ============================================================
// Bedroom Two Memory Vignette (apartment four)
// suspended workspace. desk-focused. emotionally restrained.
// even cleaner / more sterile than bedroom one. nothing animates.
// ============================================================

const bedroomtwoMemoryHoverTips = {
    'hit-window':      'the window. the sky has held this exact shade for hours.',
    'hit-curtain':     'a single sheer panel pulled to one side. it has not shifted once.',
    'hit-sill':        'the windowsill. clean. nothing rests on it.',
    'hit-frame':       'a small framed print on the wall. perfectly level. nothing else hangs near it.',
    'hit-desk':        'a low oak desk. nothing on it overlaps anything else.',
    'hit-drawer':      'the drawer. closed. you cannot remember what is inside.',
    'hit-monitor':     'the monitor. the screen is on. it has been on the same view for a long time.',
    'hit-screen':      'the screen reflects the room back too cleanly. you can count the notebooks in it.',
    'hit-keyboard':    'a slim wireless keyboard. centered. dust-free.',
    'hit-lamp':        'a small arc lamp. the shade is over the desk at exactly the same angle as last time.',
    'hit-shadow':      'the lamp\u2019s shadow on the desk. the edge is too sharp. the angle has not moved.',
    'hit-mug':         'a coffee mug. half full. the coffee in it is room-temperature.',
    'hit-notebooks':   'two notebooks, stacked. the top one\u2019s elastic strap is exactly centered.',
    'hit-pen':         'a single pen, squared on top of the notebooks. parallel to the spine.',
    'hit-cables':      'cables. clipped to the back leg in a neat vertical run. none of them are tangled.',
    'hit-chair':       'a mid-back office chair. the mesh has not been creased by anyone sitting in it today.',
    'hit-wheels':      'the chair\u2019s wheels. the casters are aligned. nobody has rolled the chair in or out.',
    'hit-wastebasket': 'a small wastebasket beside the desk. empty. the rim is clean.',
    'hit-floor':       'the floor under the desk. there is no scuff where the chair would normally roll.',
    'hit-wall':        'a wide pale wall above the desk. carefully unfilled.'
};

const bedroomtwoMemoryClickFragments = {
    'hit-window':      'you watch the sky for a few seconds longer than usual. it does not change. you stop watching it.',
    'hit-curtain':     'you reach for the curtain to feel for the draft. there is no draft. the curtain has not been pulled in a different direction once.',
    'hit-sill':        'you run a finger along the sill. there is nothing on it for the dust to gather around. you cannot remember if you cleaned it.',
    'hit-frame':       'you straighten the frame. it is already straight. it has been straight every time you have come into this room.',
    'hit-desk':        'you set your hand flat on the desk. the wood is the exact temperature of the air. nothing is warmer than anything else.',
    'hit-drawer':      'you slide the drawer open an inch. the contents are arranged. you slide it closed again. it does not catch.',
    'hit-monitor':     'you look at the monitor. it shows the same view it has been showing. it does not occur to you to wake it up further.',
    'hit-screen':      'in the screen, a tiny version of the desk. you can see the lamp, the mug, the notebooks. the cursor in it is not blinking either.',
    'hit-keyboard':    'you press a key. the cursor does not move on the screen. you press another. the screen accepts neither input.',
    'hit-lamp':        'you click the switch. the lamp is already on. it has been on at this exact warmth since you walked in.',
    'hit-shadow':      'the shadow on the desk has not changed angle since you sat down. you tilt the lamp arm slightly. the shadow stays where it was.',
    'hit-mug':         'you pick up the mug. the coffee is room temperature. it has been room temperature whenever you have checked.',
    'hit-notebooks':   'you flip the top notebook open. the page is blank. the page next to it is also blank. you close it carefully.',
    'hit-pen':         'you uncap the pen. the ink starts immediately. you draw a single line on the back of your hand. the line does not fade.',
    'hit-cables':      'you press a thumb on the cable clip. it does not give. the cables behind it are looped exactly the way you would loop them.',
    'hit-chair':       'you press the chair back gently. it does not give. the mesh holds its shape as if no one ever leans against it.',
    'hit-wheels':      'you nudge the chair half an inch with your foot. it rolls. when you look back later it has returned to where it was.',
    'hit-wastebasket': 'you look into the wastebasket. it is empty. the bottom is clean enough to suggest it was empty when you moved in.',
    'hit-floor':       'you look at the floor. there is no rolled-out arc where the chair has been pushed back over and over. the boards are flat.',
    'hit-wall':        'you put your palm on the wall above the desk. the paint is even. the wall does not register the warmth of your hand.'
};

// fragments that surface ON THEIR OWN every 30-46 seconds while the
// vignette is open. quieter and stiller than bo1 - the room is suspended.
const bedroomtwoSurfacingFragments = [
    'the cursor on the screen has not blinked since you came in. the warmth on the wall behind it is gentler than it was a minute ago.',
    'the lamp\u2019s shadow on the desk has not changed angle.',
    'nothing on the desk has shifted by even a millimeter.',
    'the chair has not been sat in since you arrived.',
    'the sky behind the window is the sky it was a moment ago, give or take a minute that did not pass.',
    'the coffee in the mug is still room temperature. you can almost smell coffee from another room - though it is the wrong room for it.',
    'the cables are looped the way you would loop them. you did not loop them.',
    'the room is not waiting for you. the room is just waiting.',
    'the print on the wall is still perfectly level. you should stop checking.',
    'a faint click from somewhere in the apartment. nothing in this room responds to it.',
    'a hallway door, somewhere. it does not open. it does not close. it is just there.'
];

let bt4HumCtx = null;
let bt4HumOscA = null;
let bt4HumOscB = null;
let bt4HumNoise = null;
let bt4HumLfo = null;
let bt4SurfacingTimerId = null;

function openBedroomTwoMemory() {
    const roomObject = document.getElementById('bedroomtwo-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bedroomtwo-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bedroomtwo-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. the room responds slightly slowly. nothing on the desk has moved. fragments may surface on their own.';
    startBedroomTwoPad();
    setupBedroomTwoMemorySvgRuntime();
}

function closeBedroomTwoMemory() {
    const overlay = document.getElementById('bedroomtwo-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (bt4SurfacingTimerId) {
        clearTimeout(bt4SurfacingTimerId);
        bt4SurfacingTimerId = null;
    }
    stopBedroomTwoPad();
}

// a clinical "empty workspace" room tone:
// - very low D2 sine (room hum)
// - soft A2 fifth above (hollow, not warm)
// - a faint low-passed noise floor (HVAC / distant air)
// - very slow LFO so the tone breathes almost imperceptibly.
function startBedroomTwoPad() {
    stopBedroomTwoPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        bt4HumCtx = new Ctx();

        const masterGain = bt4HumCtx.createGain();
        masterGain.gain.value = 0.011;
        masterGain.connect(bt4HumCtx.destination);

        bt4HumOscA = bt4HumCtx.createOscillator();
        bt4HumOscA.type = 'sine';
        bt4HumOscA.frequency.value = 73.42; // D2
        const gainA = bt4HumCtx.createGain();
        gainA.gain.value = 0.55;
        bt4HumOscA.connect(gainA);
        gainA.connect(masterGain);

        bt4HumOscB = bt4HumCtx.createOscillator();
        bt4HumOscB.type = 'sine';
        bt4HumOscB.frequency.value = 110.00; // A2 (open fifth - hollow)
        const gainB = bt4HumCtx.createGain();
        gainB.gain.value = 0.30;
        bt4HumOscB.connect(gainB);
        gainB.connect(masterGain);

        // distant-air noise floor: brown-ish via low-pass on white noise
        const bufferSize = 2 * bt4HumCtx.sampleRate;
        const noiseBuffer = bt4HumCtx.createBuffer(1, bufferSize, bt4HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.32;
        }
        bt4HumNoise = bt4HumCtx.createBufferSource();
        bt4HumNoise.buffer = noiseBuffer;
        bt4HumNoise.loop = true;
        const noiseFilter = bt4HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 200;
        const noiseGain = bt4HumCtx.createGain();
        noiseGain.gain.value = 0.13;
        bt4HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // very slow LFO (~30s period) on master gain
        bt4HumLfo = bt4HumCtx.createOscillator();
        bt4HumLfo.type = 'sine';
        bt4HumLfo.frequency.value = 1 / 30;
        const lfoDepth = bt4HumCtx.createGain();
        lfoDepth.gain.value = 0.005;
        bt4HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        bt4HumOscA.start();
        bt4HumOscB.start();
        bt4HumNoise.start();
        bt4HumLfo.start();
        if (bt4HumCtx.state === 'suspended') bt4HumCtx.resume();
    } catch (_) {
        bt4HumCtx = null;
        bt4HumOscA = null;
        bt4HumOscB = null;
        bt4HumNoise = null;
        bt4HumLfo = null;
    }
}

function stopBedroomTwoPad() {
    try {
        bt4HumOscA?.stop();
        bt4HumOscB?.stop();
        bt4HumNoise?.stop();
        bt4HumLfo?.stop();
        bt4HumCtx?.close?.();
    } catch (_) {}
    bt4HumOscA = null;
    bt4HumOscB = null;
    bt4HumNoise = null;
    bt4HumLfo = null;
    bt4HumCtx = null;
}

// a single soft cool tick when an unprompted fragment surfaces -
// like a distant electronic chime in an empty office.
function playBedroomTwoChime() {
    if (!bt4HumCtx) return;
    try {
        const now = bt4HumCtx.currentTime;
        const osc = bt4HumCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = 880; // A5 - cool, glassy
        const g = bt4HumCtx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.012, now + 0.45);
        g.gain.linearRampToValueAtTime(0, now + 2.4);
        osc.connect(g);
        g.connect(bt4HumCtx.destination);
        osc.start(now);
        osc.stop(now + 2.6);
    } catch (_) {}
}

function setupBedroomTwoMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroomtwo-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.bt4Bound === 'true') {
            scheduleBedroomTwoSurfacing();
            return;
        }

        const tipEl = document.getElementById('bedroomtwo-memory-tip');
        const defaultTip = 'hover and click to remember. the room responds slightly slowly. nothing on the desk has moved. fragments may surface on their own.';

        let pendingTipTimer = null;
        // even longer fade than bo1 - "objects respond with slight delay"
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 820);
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
                    if (!document.getElementById('bedroomtwo-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 4400);
                pendingTipTimer = null;
            }, 640);
        };
        svgRoot._bt4SetTipSurfacing = setTipSurfacing;

        Object.entries(bedroomtwoMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                setTipSlow(hoverText);
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = bedroomtwoMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
            });
        });

        svgRoot.dataset.bt4Bound = 'true';
        scheduleBedroomTwoSurfacing();
    };

    if (!roomObject.dataset.bt4LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.bt4LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 30-46 seconds while the vignette is open
function scheduleBedroomTwoSurfacing() {
    if (bt4SurfacingTimerId) clearTimeout(bt4SurfacingTimerId);
    const overlay = document.getElementById('bedroomtwo-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 30000 + Math.floor(Math.random() * 16000);
    bt4SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('bedroomtwo-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('bedroomtwo-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = bedroomtwoSurfacingFragments[Math.floor(Math.random() * bedroomtwoSurfacingFragments.length)];
        if (svgRoot?._bt4SetTipSurfacing) {
            svgRoot._bt4SetTipSurfacing(fragment);
            playBedroomTwoChime();
        }
        scheduleBedroomTwoSurfacing();
    }, wait);
}

const bedroomtwoCloseBtn = document.getElementById('bedroomtwo-memory-close');
if (bedroomtwoCloseBtn) bedroomtwoCloseBtn.addEventListener('click', closeBedroomTwoMemory);
// ============================================================
// Bedroom Three Memory Vignette (apartment four)
// emotionally unfinished, partially decorated.
// the room has not fully settled into memory yet.
// even sparser audio than bo2; interactions pause longer; text fades quickly.
// ============================================================

const bedroomthreeMemoryHoverTips = {
    'hit-window':       'the window. the sky has not changed shade since you walked in.',
    'hit-curtain':      'a single sheer panel hung only on the right side. it has not stirred.',
    'hit-hooks':        'a row of bare curtain hooks on the left half of the rod.',
    'hit-sill':         'the sill. nothing rests on it. the dust has not settled either.',

    'hit-chair':        'a small black folding chair near the window. nothing is sitting in it.',
    'hit-sheets':       'a stack of bedsheets still in their plastic. the seal has not been broken.',

    'hit-bed':          'a single bed against the wall. neatly made for the first time in a while.',
    'hit-pillow':       'a single pillow at the head of the bed. unrumpled.',
    'hit-blanket':      'a small folded throw at the foot of the bed. perfectly square.',
    'hit-bed-frame':    'a low wooden bed frame. clean. there is no dust under it yet.',

    'hit-cord':         'a black cord drops from the ceiling. it does not sway.',
    'hit-bulb':         'a bare bulb. warm. you have not bought a shade for it.',

    'hit-box':          'a cardboard moving box, sealed. it is doing the job of a nightstand for now.',
    'hit-tape':         'the packing tape across the box. you have not gotten around to opening it.',
    'hit-glass':        'a small water glass on top of the box. the water in it is exactly half.',

    'hit-mirror':       'a leaning mirror against the wall. you have not hung it yet.',
    'hit-reflection':   'in the mirror, the room. a little crisper than the room itself.',

    'hit-nail':         'a single bare nail in the wall. nothing hangs from it yet.',
    'hit-photo':        'one small photo, taped to the wall. the only thing actually up.',

    'hit-floor':        'the floor between the chair and the box. clean. unscuffed.',
    'hit-wall':         'a wide pale wall above the bed. mostly bare. you have plans for it.'
};

const bedroomthreeMemoryClickFragments = {
    'hit-window':       'you watch the sky for a little longer. the shade does not deepen. you wonder when the light will start to slant.',
    'hit-curtain':      'you reach for the loose sheer. it is cool. you forgot to buy a second panel for the left side.',
    'hit-hooks':        'you run a finger along the bare hooks on the left. they are not warm. nothing has hung here for long enough to leave a mark.',
    'hit-sill':         'you set your hand on the sill. it is the same temperature as the wall. you have not put anything here yet.',
    'hit-chair':        'you press the seat of the folding chair. it gives a little. nobody has actually sat in it since it was opened.',
    'hit-sheets':       'you pinch the plastic wrap on the sheets. it crinkles. you have been meaning to put these on the bed.',
    'hit-bed':          'you smooth the duvet, although it does not need smoothing. the surface is exactly as flat as it was a moment ago.',
    'hit-pillow':       'you press a thumb into the pillow. the dent fills back in slowly. nobody has slept on it long enough to shape it.',
    'hit-blanket':      'you adjust the folded throw a quarter inch. it sits exactly where it was. you put it back.',
    'hit-bed-frame':    'you tap the side of the bed frame. it sounds new. the wood has not warmed yet.',
    'hit-cord':         'you brush the cord with one finger. the bulb above it does not swing. the cord does not even rotate slightly.',
    'hit-bulb':         'you look up at the bare bulb. the warmth on your face has not changed since you walked in. you keep meaning to buy a shade.',
    'hit-box':          'you rest a palm on the cardboard. it is cool. you cannot remember which box this one is.',
    'hit-tape':         'you slide a fingernail along the seam of the tape. it does not lift. you do not open it now either.',
    'hit-glass':        'you pick up the water glass. the water level does not shift. you set it back down on the same ring.',
    'hit-mirror':       'you tilt the mirror frame slightly. the lean stays the same. you keep meaning to mount it on the wall.',
    'hit-reflection':   'in the reflection, the room is the same room, only sharper. you can count more details there than you can here.',
    'hit-nail':         'you press the nail with your thumb. it is in level. you have not picked which frame goes here.',
    'hit-photo':        'you straighten the washi tape around the photo. it is already straight. it is the only thing actually on the wall.',
    'hit-floor':        'you look at the floor. there is no path worn between the chair and the bed. the boards still feel like a stranger\u2019s floor.',
    'hit-wall':         'you put a palm flat against the wall. the paint is fresh enough that the wall does not register your warmth.'
};

// fragments that surface ON THEIR OWN every 32-48 seconds while the
// vignette is open. quieter than bo1/bo2 - the room is still in transit.
const bedroomthreeSurfacingFragments = [
    'the bulb above the bed has not flickered. it has gotten gently warmer for a moment, then back.',
    'the box has been the nightstand for longer than you meant.',
    'the second curtain panel is in one of these boxes.',
    'the sky behind the window is the same shade as the wall.',
    'the bedsheets in the plastic are the ones you actually wanted on the bed.',
    'in the mirror, your half of the room looks finished. that is not quite right.',
    'the nail is still waiting for the right photo.',
    'the chair has held the same stack of sheets for days.',
    'nothing in this room has had time to leave a mark on anything else yet.',
    'the throw at the foot of the bed has not been unfolded once.',
    'a fridge hum, very faint, from the other side of the apartment. it is the only sound that has been here the whole time.'
];

let b34HumCtx = null;
let b34HumOscA = null;
let b34HumNoise = null;
let b34HumLfo = null;
let b34SurfacingTimerId = null;

function openBedroomThreeMemory() {
    const roomObject = document.getElementById('bedroomthree-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('bedroomthree-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('bedroomthree-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. this room has not fully settled. interactions pause before responding. fragments may surface on their own.';
    startBedroomThreePad();
    setupBedroomThreeMemorySvgRuntime();
}

function closeBedroomThreeMemory() {
    const overlay = document.getElementById('bedroomthree-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (b34SurfacingTimerId) {
        clearTimeout(b34SurfacingTimerId);
        b34SurfacingTimerId = null;
    }
    stopBedroomThreePad();
}

// "freshly-moved-in" room tone:
// - one very low D2 sine, slightly detuned (nothing has broken in yet)
// - a faint air-handler noise floor (low-passed white noise, slightly higher cut than bo2)
// - very slow LFO so the tone breathes almost imperceptibly.
// no second oscillator (no comfortable open fifth) - the room is quieter than bo2.
function startBedroomThreePad() {
    stopBedroomThreePad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        b34HumCtx = new Ctx();

        const masterGain = b34HumCtx.createGain();
        masterGain.gain.value = 0.009;
        masterGain.connect(b34HumCtx.destination);

        b34HumOscA = b34HumCtx.createOscillator();
        b34HumOscA.type = 'sine';
        b34HumOscA.frequency.value = 73.92; // D2, slightly sharp - "not yet tuned"
        const gainA = b34HumCtx.createGain();
        gainA.gain.value = 0.5;
        b34HumOscA.connect(gainA);
        gainA.connect(masterGain);

        // distant air-handler noise floor
        const bufferSize = 2 * b34HumCtx.sampleRate;
        const noiseBuffer = b34HumCtx.createBuffer(1, bufferSize, b34HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.30;
        }
        b34HumNoise = b34HumCtx.createBufferSource();
        b34HumNoise.buffer = noiseBuffer;
        b34HumNoise.loop = true;
        const noiseFilter = b34HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 240;
        const noiseGain = b34HumCtx.createGain();
        noiseGain.gain.value = 0.16;
        b34HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // very slow LFO (~36s period) on master gain
        b34HumLfo = b34HumCtx.createOscillator();
        b34HumLfo.type = 'sine';
        b34HumLfo.frequency.value = 1 / 36;
        const lfoDepth = b34HumCtx.createGain();
        lfoDepth.gain.value = 0.004;
        b34HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        b34HumOscA.start();
        b34HumNoise.start();
        b34HumLfo.start();
        if (b34HumCtx.state === 'suspended') b34HumCtx.resume();
    } catch (_) {
        b34HumCtx = null;
        b34HumOscA = null;
        b34HumNoise = null;
        b34HumLfo = null;
    }
}

function stopBedroomThreePad() {
    try {
        b34HumOscA?.stop();
        b34HumNoise?.stop();
        b34HumLfo?.stop();
        b34HumCtx?.close?.();
    } catch (_) {}
    b34HumOscA = null;
    b34HumNoise = null;
    b34HumLfo = null;
    b34HumCtx = null;
}

// a single soft cardboard/paper rustle when an unprompted fragment surfaces -
// like something brushing against a sealed box or a sheet of plastic.
// (more "moving day" than "office chime")
function playBedroomThreeRustle() {
    if (!b34HumCtx) return;
    try {
        const now = b34HumCtx.currentTime;
        const dur = 0.55;
        const buf = b34HumCtx.createBuffer(1, Math.floor(b34HumCtx.sampleRate * dur), b34HumCtx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
            const t = i / ch.length;
            // shaped, brief, mid-band-feeling noise envelope
            const env = Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.sin(t * 32));
            ch[i] = (Math.random() * 2 - 1) * env * 0.55;
        }
        const src = b34HumCtx.createBufferSource();
        src.buffer = buf;
        const bp = b34HumCtx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1700;
        bp.Q.value = 0.85;
        const g = b34HumCtx.createGain();
        g.gain.value = 0.05;
        src.connect(bp);
        bp.connect(g);
        g.connect(b34HumCtx.destination);
        src.start(now);
        src.stop(now + dur + 0.05);
    } catch (_) {}
}

function setupBedroomThreeMemorySvgRuntime() {
    const roomObject = document.getElementById('bedroomthree-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.b34Bound === 'true') {
            scheduleBedroomThreeSurfacing();
            return;
        }

        const tipEl = document.getElementById('bedroomthree-memory-tip');
        const defaultTip = 'hover and click to remember. this room has not fully settled. interactions pause before responding. fragments may surface on their own.';

        let pendingTipTimer = null;
        // even longer delay than bo2 to suggest "interactions pause briefly before responding"
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 940);
        };
        const setTipImmediate = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('fading');
            tipEl.classList.remove('surfacing');
            tipEl.textContent = text;
        };
        // surfacing fragments fade quickly back to default ("hidden text fades quickly")
        const setTipSurfacing = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                tipEl.classList.add('surfacing');
                setTimeout(() => {
                    if (!document.getElementById('bedroomthree-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 3400);
                pendingTipTimer = null;
            }, 720);
        };
        svgRoot._b34SetTipSurfacing = setTipSurfacing;

        Object.entries(bedroomthreeMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                setTipSlow(hoverText);
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = bedroomthreeMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
            });
        });

        svgRoot.dataset.b34Bound = 'true';
        scheduleBedroomThreeSurfacing();
    };

    if (!roomObject.dataset.b34LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.b34LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 32-48 seconds while the vignette is open
function scheduleBedroomThreeSurfacing() {
    if (b34SurfacingTimerId) clearTimeout(b34SurfacingTimerId);
    const overlay = document.getElementById('bedroomthree-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 32000 + Math.floor(Math.random() * 16000);
    b34SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('bedroomthree-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('bedroomthree-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = bedroomthreeSurfacingFragments[Math.floor(Math.random() * bedroomthreeSurfacingFragments.length)];
        if (svgRoot?._b34SetTipSurfacing) {
            svgRoot._b34SetTipSurfacing(fragment);
            playBedroomThreeRustle();
        }
        scheduleBedroomThreeSurfacing();
    }, wait);
}

const bedroomthreeCloseBtn = document.getElementById('bedroomthree-memory-close');
if (bedroomthreeCloseBtn) bedroomthreeCloseBtn.addEventListener('click', closeBedroomThreeMemory);

// ============================================================
// Closet One Memory Vignette (apartment four)
// carefully categorized closet, organized + emotionally restrained.
// the door-note "no" branch reveals this; "yes" still loops back to apt one.
// magical realism: labels occasionally change wording, on their own.
// ============================================================

const closetoneMemoryHoverTips = {
    'hit-wall':        'the back wall of the closet. evenly painted, evenly lit.',
    'hit-light':       'an even overhead light. the brightness has not shifted.',
    'hit-floor':       'the closet floor in front of the bins. nothing has been dropped here.',

    'hit-shelf-top':   'the top shelf. things kept up here are kept up here on purpose.',
    'hit-shelf-mid':   'the middle shelf. the stacks are squared up to the front edge.',
    'hit-shelf-bot':   'the bottom shelf. the two large boxes touch nothing on either side.',

    'hit-tin-1':       'a small tin. the lid sits perfectly seated. the label tag is centered.',
    'hit-tin-2':       'a second tin, taller. the lid has a small knob, polished.',
    'hit-tin-3':       'a small kraft basket with two handles. the handles are folded in.',

    'hit-stack-1':     'a stack of folded cream pieces. each one is the same width as the one beneath it.',
    'hit-stack-2':     'a stack of folded sage pieces. the seam lines all face right.',
    'hit-stack-3':     'a stack of folded slate pieces. the corners are aligned to within a thread.',
    'hit-cube':        'a lidded fabric cube. the loop handle on top sits exactly straight up.',

    'hit-coats':       'a large lidded linen storage box. the pull handle is perfectly centered.',
    'hit-papers':      'a large kraft cardboard box. the side handles are aligned across both sides.',

    'hit-bin-sage':    'a sage fabric bin. its tag is on the front-left corner.',
    'hit-bin-cream':   'a cream fabric bin. its tag is on the front-left corner.',
    'hit-bin-slate':   'a slate fabric bin. its tag is on the front-left corner.',
    'hit-bin-rose':    'a rose fabric bin. its tag is on the front-left corner.'
};

const closetoneMemoryClickFragments = {
    'hit-wall':        'you press a palm flat to the back wall. it is the same temperature as the air. nothing has leaned against it long enough to leave a mark.',
    'hit-light':       'you look up at the light. the brightness is the brightness it has been. you do not remember turning it on.',
    'hit-floor':       'you look at the floor in front of the bins. there is no scuff where you would have stepped to reach for a coat.',

    'hit-shelf-top':   'you run a finger along the front edge of the top shelf. dust does not gather here. nothing has been moved fast enough to disturb it.',
    'hit-shelf-mid':   'you check the middle shelf with the flat of your hand. the stacks are exactly the right height for the gap above them.',
    'hit-shelf-bot':   'you crouch and look along the bottom shelf. both large boxes leave the same amount of space on either side.',

    'hit-tin-1':       'you lift the lid of the first tin. inside, a few folded letters. you set the lid back. when you check it again the label has the same handwriting and is in the same position.',
    'hit-tin-2':       'you open the second tin. it is full of folded fabric. you press the lid back on, and the lid settles itself with a quiet click.',
    'hit-tin-3':       'you flip the kraft basket open. small things, sorted. you put it back. the handles fold themselves in.',

    'hit-stack-1':     'you lift the top fold from the cream stack. underneath, an identical fold. you put it back. the stack is the same height it was.',
    'hit-stack-2':     'you press the sage stack at its corner. it does not give. when you take your hand away the corner is the corner it was.',
    'hit-stack-3':     'you slide a finger between two folds in the slate stack. the gap closes behind your finger. you take your hand out. the stack does not lean.',
    'hit-cube':        'you lift the lid of the fabric cube. inside, folded linens, organized by size. you set the lid back. the loop handle stands itself back up exactly straight.',

    'hit-coats':       'you slide the lid off the linen box. wool and a wool blend, folded by length. you replace the lid. the pull handle settles exactly center again.',
    'hit-papers':      'you lift the lid of the kraft box. files in folders, alphabetized. you put the lid back. the side handles return to level.',

    'hit-bin-sage':    'you reach into the sage bin. small soft items, organized. you let your hand out. the bin\u2019s shape does not deform.',
    'hit-bin-cream':   'you reach into the cream bin. linens that did not fit upstairs. you let your hand out. the tag rotates back to the front.',
    'hit-bin-slate':   'you reach into the slate bin. cables, coiled. you let your hand out. the coils sit exactly the way they were.',
    'hit-bin-rose':    'you reach into the rose bin. small fabric scraps, folded. you let your hand out. the tag is on the front-left corner again.'
};

// fragments that surface ON THEIR OWN every 30-44 seconds while the
// vignette is open. quiet, restrained, archival.
const closetoneSurfacingFragments = [
    'every label is in the position you would have put it in.',
    'nothing on any shelf is touching anything next to it.',
    'the stacks are the same height they were when you started.',
    'the two large boxes have not shifted toward each other.',
    'the bins along the floor are spaced the same distance apart.',
    'a label has changed words. it is still the right word for what is inside.',
    'the light has not shifted brightness, but a warmth has settled along the top shelf that you do not remember.',
    'the cube\u2019s loop handle is straight up again.',
    'the kraft box\u2019s handles are still aligned across both sides.',
    'every tag is on the front-left corner of every bin.',
    'somewhere on the other side of the wall, the fridge is humming. it is the same hum it has been since you opened the door.'
];

// label rotation pool - used for the "labels occasionally change wording" trick.
// each label cycles through words from its own category so the change feels
// quietly organized rather than chaotic.
const closetoneLabelPool = {
    'co41-label-1': ['letters', 'notes', 'cards', 'photos', 'postcards'],
    'co41-label-2': ['winter', 'sweaters', 'wool', 'knits', 'scarves'],
    'co41-label-3': ['tapes', 'films', 'reels', 'cassettes', 'spools'],
    'co41-label-4': ['linens', 'sheets', 'pillowcases', 'towels', 'cotton'],
    'co41-label-5': ['coats', 'jackets', 'wool coats', 'overcoats', 'parkas'],
    'co41-label-6': ['papers', 'files', 'documents', 'records', 'receipts']
};

let co41HumCtx = null;
let co41HumOscA = null;
let co41HumNoise = null;
let co41HumLfo = null;
let co41SurfacingTimerId = null;
let co41LabelTimerId = null;

function openClosetOneMemory() {
    const roomObject = document.getElementById('closetone-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('closetone-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('closetone-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. each shelf is in order. interactions respond a little slowly. labels may quietly change.';
    startClosetOnePad();
    setupClosetOneMemorySvgRuntime();
}

function closeClosetOneMemory() {
    const overlay = document.getElementById('closetone-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (co41SurfacingTimerId) {
        clearTimeout(co41SurfacingTimerId);
        co41SurfacingTimerId = null;
    }
    if (co41LabelTimerId) {
        clearTimeout(co41LabelTimerId);
        co41LabelTimerId = null;
    }
    stopClosetOnePad();
}

// archival room tone:
// - very low E2 sine (almost subaural - the closet feels enclosed)
// - faint low-passed noise floor (sealed-room ambience)
// - very slow LFO breathing.
function startClosetOnePad() {
    stopClosetOnePad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        co41HumCtx = new Ctx();

        const masterGain = co41HumCtx.createGain();
        masterGain.gain.value = 0.010;
        masterGain.connect(co41HumCtx.destination);

        co41HumOscA = co41HumCtx.createOscillator();
        co41HumOscA.type = 'sine';
        co41HumOscA.frequency.value = 82.41; // E2 - low, anchored
        const gainA = co41HumCtx.createGain();
        gainA.gain.value = 0.55;
        co41HumOscA.connect(gainA);
        gainA.connect(masterGain);

        // sealed-room noise floor
        const bufferSize = 2 * co41HumCtx.sampleRate;
        const noiseBuffer = co41HumCtx.createBuffer(1, bufferSize, co41HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.28;
        }
        co41HumNoise = co41HumCtx.createBufferSource();
        co41HumNoise.buffer = noiseBuffer;
        co41HumNoise.loop = true;
        const noiseFilter = co41HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 220;
        const noiseGain = co41HumCtx.createGain();
        noiseGain.gain.value = 0.12;
        co41HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // very slow LFO (~34s period)
        co41HumLfo = co41HumCtx.createOscillator();
        co41HumLfo.type = 'sine';
        co41HumLfo.frequency.value = 1 / 34;
        const lfoDepth = co41HumCtx.createGain();
        lfoDepth.gain.value = 0.0045;
        co41HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        co41HumOscA.start();
        co41HumNoise.start();
        co41HumLfo.start();
        if (co41HumCtx.state === 'suspended') co41HumCtx.resume();
    } catch (_) {
        co41HumCtx = null;
        co41HumOscA = null;
        co41HumNoise = null;
        co41HumLfo = null;
    }
}

function stopClosetOnePad() {
    try {
        co41HumOscA?.stop();
        co41HumNoise?.stop();
        co41HumLfo?.stop();
        co41HumCtx?.close?.();
    } catch (_) {}
    co41HumOscA = null;
    co41HumNoise = null;
    co41HumLfo = null;
    co41HumCtx = null;
}

// a soft paper/card slip when a label changes wording -
// like an index card being reseated in its slot.
function playClosetOneSlip() {
    if (!co41HumCtx) return;
    try {
        const now = co41HumCtx.currentTime;
        const dur = 0.32;
        const buf = co41HumCtx.createBuffer(1, Math.floor(co41HumCtx.sampleRate * dur), co41HumCtx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
            const t = i / ch.length;
            const env = Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.sin(t * 28));
            ch[i] = (Math.random() * 2 - 1) * env * 0.5;
        }
        const src = co41HumCtx.createBufferSource();
        src.buffer = buf;
        const bp = co41HumCtx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 2200;
        bp.Q.value = 0.9;
        const g = co41HumCtx.createGain();
        g.gain.value = 0.04;
        src.connect(bp);
        bp.connect(g);
        g.connect(co41HumCtx.destination);
        src.start(now);
        src.stop(now + dur + 0.05);
    } catch (_) {}
}

function setupClosetOneMemorySvgRuntime() {
    const roomObject = document.getElementById('closetone-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.co41Bound === 'true') {
            scheduleClosetOneSurfacing();
            scheduleClosetOneLabelChange();
            return;
        }

        const tipEl = document.getElementById('closetone-memory-tip');
        const defaultTip = 'hover and click to remember. each shelf is in order. interactions respond a little slowly. labels may quietly change.';

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
            }, 720);
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
                    if (!document.getElementById('closetone-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 4000);
                pendingTipTimer = null;
            }, 640);
        };
        svgRoot._co41SetTipSurfacing = setTipSurfacing;
        svgRoot._co41SvgDoc = svgDoc;

        Object.entries(closetoneMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                setTipSlow(hoverText);
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = closetoneMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
            });
        });

        svgRoot.dataset.co41Bound = 'true';
        scheduleClosetOneSurfacing();
        scheduleClosetOneLabelChange();
    };

    if (!roomObject.dataset.co41LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.co41LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 30-44 seconds while the vignette is open
function scheduleClosetOneSurfacing() {
    if (co41SurfacingTimerId) clearTimeout(co41SurfacingTimerId);
    const overlay = document.getElementById('closetone-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 30000 + Math.floor(Math.random() * 14000);
    co41SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('closetone-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('closetone-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = closetoneSurfacingFragments[Math.floor(Math.random() * closetoneSurfacingFragments.length)];
        if (svgRoot?._co41SetTipSurfacing) {
            svgRoot._co41SetTipSurfacing(fragment);
        }
        scheduleClosetOneSurfacing();
    }, wait);
}

// every 22-34 seconds, quietly change the wording on ONE random label
// to a different word in its own category. magical realism: labels
// occasionally change wording, but always to something still appropriate.
function scheduleClosetOneLabelChange() {
    if (co41LabelTimerId) clearTimeout(co41LabelTimerId);
    const overlay = document.getElementById('closetone-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 22000 + Math.floor(Math.random() * 12000);
    co41LabelTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('closetone-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('closetone-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        if (svgDoc) {
            const labelIds = Object.keys(closetoneLabelPool);
            const labelId = labelIds[Math.floor(Math.random() * labelIds.length)];
            const labelEl = svgDoc.getElementById(labelId);
            if (labelEl) {
                const pool = closetoneLabelPool[labelId] || [];
                const current = (labelEl.textContent || '').trim();
                const choices = pool.filter((w) => w !== current);
                if (choices.length > 0) {
                    const next = choices[Math.floor(Math.random() * choices.length)];
                    labelEl.textContent = next;
                    playClosetOneSlip();
                }
            }
        }
        scheduleClosetOneLabelChange();
    }, wait);
}

const closetoneCloseBtn = document.getElementById('closetone-memory-close');
if (closetoneCloseBtn) closetoneCloseBtn.addEventListener('click', closeClosetOneMemory);

// ============================================================
// Closet Two Memory Vignette (apartment four)
// preserved utility closet. perfectly symmetric across the center.
// magical realism: objects subtly reset positions when interacted with.
// room tone never changes (no LFO on master gain).
// ============================================================

const closettwoMemoryHoverTips = {
    'hit-wall':         'the back wall of the closet. the paint is even, the seam down the middle is true.',
    'hit-light':        'the overhead light. the brightness has not shifted since you opened the door.',
    'hit-floor':        'the floor of the closet. clean. the items on it are placed exactly even of the wall.',
    'hit-axis':         'a faint vertical seam down the middle of the closet. everything mirrors across it.',

    'hit-shelf-top':    'the top shelf. four matching jars. the gaps between them are equal.',
    'hit-shelf-mid':    'the middle shelf. a folded towel stack centered between two pairs of bottles.',
    'hit-shelf-bot':    'the bottom shelf. a four-pack of paper towels, with one large bottle on each side.',

    'hit-jar-1L':       'a glass apothecary jar of cotton. the lid is seated.',
    'hit-jar-2L':       'a glass apothecary jar of swabs. the lid is seated.',
    'hit-jar-2R':       'a glass apothecary jar of swabs. the lid is seated. it matches the one across.',
    'hit-jar-1R':       'a glass apothecary jar of cotton. the lid is seated. it matches the one across.',

    'hit-spray-1L':     'a slate spray bottle. the trigger is in the closed position.',
    'hit-spray-2L':     'a sand-colored spray bottle. the trigger is in the closed position.',
    'hit-towels':       'a stack of folded towels, centered. each fold the same width as the one beneath.',
    'hit-spray-2R':     'a sand-colored spray bottle, identical to the one opposite.',
    'hit-spray-1R':     'a slate spray bottle, identical to the one opposite.',

    'hit-bottle-L':     'a large refill bottle. the cap is on tight. the label is squared up.',
    'hit-paper-towels': 'a four-pack of paper towels, still in shrink wrap.',
    'hit-bottle-R':     'a large refill bottle, identical to the one opposite.',

    'hit-bucket-L':     'a small pail. the handle is folded down. the rim is dust-free.',
    'hit-stool':        'a low painted step stool. centered exactly between the pails.',
    'hit-bucket-R':     'a small pail, identical to the one opposite. handle folded the same way.'
};

const closettwoMemoryClickFragments = {
    'hit-wall':         'you press a palm flat to the back wall. it is the same temperature as the air. nothing leans on it long enough to leave heat behind.',
    'hit-light':        'you look up at the light. the brightness does not shift. your eyes do not adjust because there is nothing to adjust to.',
    'hit-floor':        'you crouch and look along the floor. there is no scuff between the pails and the stool. nobody walks here.',
    'hit-axis':         'you look down the center of the closet. every item on the left has its match on the right. the spacing is the same on both sides.',

    'hit-shelf-top':    'you sweep a finger across the top shelf. the gaps between jars are unchanged. the dust does not move because there is no dust.',
    'hit-shelf-mid':    'you check the middle shelf with a flat hand. the towel stack is centered to within a thread. the spray bottles outside it are exactly equidistant.',
    'hit-shelf-bot':    'you press the front edge of the bottom shelf. it does not give. the four-pack between the bottles has not shifted.',

    'hit-jar-1L':       'you nudge the cotton jar slightly to the right. you let go. it sits exactly where it was when you opened the door.',
    'hit-jar-2L':       'you nudge the swab jar slightly to the right. you let go. it returns to its original position. the swabs inside do not move.',
    'hit-jar-2R':       'you nudge this jar slightly to the left. you let go. it sits exactly opposite the other one again.',
    'hit-jar-1R':       'you nudge this jar slightly to the left. you let go. it sits exactly opposite the other one again. the cotton inside is undisturbed.',

    'hit-spray-1L':     'you tilt the slate spray bottle. the liquid inside does not move. you let go. it stands itself straight again.',
    'hit-spray-2L':     'you tilt the sand bottle. the liquid does not move. you let go. it stands straight again. the trigger is closed again.',
    'hit-towels':       'you press a thumb into the folded towel stack. the stack does not give. you take your hand away. the surface of the top towel has no print.',
    'hit-spray-2R':     'you tilt this bottle. it returns to position. it returns mirroring the other one exactly.',
    'hit-spray-1R':     'you tilt this bottle. it returns to position. it returns mirroring the other one exactly.',

    'hit-bottle-L':     'you push the large bottle one inch toward the center. you let go. it slides back without you. the label faces the same way.',
    'hit-paper-towels': 'you press the shrink wrap on the paper towels. it does not crinkle. nobody has opened this pack.',
    'hit-bottle-R':     'you push the large bottle one inch toward the center. you let go. it slides back without you. the label faces the same way.',

    'hit-bucket-L':     'you tilt the pail with your foot. the handle does not rattle. you let go. the pail rocks back to upright on its own.',
    'hit-stool':        'you nudge the step stool an inch to the right. it slides back to centered without you. the legs leave no marks.',
    'hit-bucket-R':     'you tilt this pail with your foot. it rocks back upright without you. the handle is folded down again, the same direction as the other one.'
};

// fragments that surface on their own. very quiet, very few, very preserved.
const closettwoSurfacingFragments = [
    'every item on the left still has its match on the right.',
    'the four jars on the top shelf are still equally spaced.',
    'the towel stack is centered to within a thread.',
    'the bottom-shelf bottles are still mirroring across the four-pack.',
    'the pails on the floor still tilt the same way as each other.',
    'the step stool is still centered between the pails.',
    'the brightness in here has barely changed since you opened the door. there is a tender warmth in the bottom-left corner that is new.',
    'nothing on any shelf has shifted toward anything next to it.',
    'no dust gathers in the seams between the items.',
    'the room tone holds. underneath it, very faintly, the apartment is breathing in a different room.',
    'a faint click from across the apartment. nothing in here answers it.'
];

// items that visibly nudge-and-snap-back when clicked. the magical realism
// "objects subtly reset positions" is sold by an actually-visible micro-nudge.
// each item gets a horizontal offset chosen to push it AWAY from the symmetry
// axis (left items nudge left, right items nudge right) so the symmetry breaks
// and then re-asserts itself.
const closettwoNudgeMap = {
    'hit-jar-1L':        { groupId: 'co42-jar-1L-art',         dx: -2 },
    'hit-jar-2L':        { groupId: 'co42-jar-2L-art',         dx: -2 },
    'hit-jar-2R':        { groupId: 'co42-jar-2R-art',         dx:  2 },
    'hit-jar-1R':        { groupId: 'co42-jar-1R-art',         dx:  2 },
    'hit-spray-1L':      { groupId: 'co42-spray-1L-art',       dx: -2 },
    'hit-spray-2L':      { groupId: 'co42-spray-2L-art',       dx: -2 },
    'hit-towels':        { groupId: 'co42-towels-art',         dx:  0, dy: -1 },
    'hit-spray-2R':      { groupId: 'co42-spray-2R-art',       dx:  2 },
    'hit-spray-1R':      { groupId: 'co42-spray-1R-art',       dx:  2 },
    'hit-bottle-L':      { groupId: 'co42-bottle-L-art',       dx: -2 },
    'hit-paper-towels':  { groupId: 'co42-paper-towels-art',   dx:  0, dy: -1 },
    'hit-bottle-R':      { groupId: 'co42-bottle-R-art',       dx:  2 },
    'hit-bucket-L':      { groupId: 'co42-bucket-L-art',       dx: -2 },
    'hit-stool':         { groupId: 'co42-stool-art',          dx:  0, dy: -1 },
    'hit-bucket-R':      { groupId: 'co42-bucket-R-art',       dx:  2 }
};

let co42HumCtx = null;
let co42HumOscA = null;
let co42HumNoise = null;
let co42HumLfo = null;
let co42SurfacingTimerId = null;

function openClosetTwoMemory() {
    const roomObject = document.getElementById('closettwo-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('closettwo-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('closettwo-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. each shelf is mirrored across the center. objects return to where they were.';
    startClosetTwoPad();
    setupClosetTwoMemorySvgRuntime();
}

function closeClosetTwoMemory() {
    const overlay = document.getElementById('closettwo-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (co42SurfacingTimerId) {
        clearTimeout(co42SurfacingTimerId);
        co42SurfacingTimerId = null;
    }
    stopClosetTwoPad();
}

// preserved-room tone:
// - very low E2 sine
// - faint low-passed noise floor (lower than co41, even more sealed)
// - very slow LFO (~38s period) - tender warmth beneath restraint, just
//   enough to stop the room from feeling sterile.
function startClosetTwoPad() {
    stopClosetTwoPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        co42HumCtx = new Ctx();

        const masterGain = co42HumCtx.createGain();
        masterGain.gain.value = 0.0085;
        masterGain.connect(co42HumCtx.destination);

        co42HumOscA = co42HumCtx.createOscillator();
        co42HumOscA.type = 'sine';
        co42HumOscA.frequency.value = 82.41; // E2
        const gainA = co42HumCtx.createGain();
        gainA.gain.value = 0.55;
        co42HumOscA.connect(gainA);
        gainA.connect(masterGain);

        const bufferSize = 2 * co42HumCtx.sampleRate;
        const noiseBuffer = co42HumCtx.createBuffer(1, bufferSize, co42HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.22;
        }
        co42HumNoise = co42HumCtx.createBufferSource();
        co42HumNoise.buffer = noiseBuffer;
        co42HumNoise.loop = true;
        const noiseFilter = co42HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 180;
        const noiseGain = co42HumCtx.createGain();
        noiseGain.gain.value = 0.10;
        co42HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // very slow gentle breathing - "warmth beneath restraint"
        co42HumLfo = co42HumCtx.createOscillator();
        co42HumLfo.type = 'sine';
        co42HumLfo.frequency.value = 1 / 38;
        const lfoDepth = co42HumCtx.createGain();
        lfoDepth.gain.value = 0.0009;
        co42HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        co42HumOscA.start();
        co42HumNoise.start();
        co42HumLfo.start();
        if (co42HumCtx.state === 'suspended') co42HumCtx.resume();
    } catch (_) {
        co42HumCtx = null;
        co42HumOscA = null;
        co42HumNoise = null;
        co42HumLfo = null;
    }
}

function stopClosetTwoPad() {
    try {
        co42HumOscA?.stop();
        co42HumNoise?.stop();
        co42HumLfo?.stop();
        co42HumCtx?.close?.();
    } catch (_) {}
    co42HumOscA = null;
    co42HumNoise = null;
    co42HumLfo = null;
    co42HumCtx = null;
}

// nudge an item group, then snap it back to identity.
// also temporarily disables CSS transitions to make the snap feel like a reset
// rather than a slide.
function nudgeAndResetClosetTwo(svgDoc, groupId, dx, dy) {
    if (!svgDoc || !groupId) return;
    const g = svgDoc.getElementById(groupId);
    if (!g) return;
    // smooth nudge out, then a snap back
    g.style.transition = 'transform 220ms ease-out';
    g.style.transform = `translate(${dx || 0}px, ${dy || 0}px)`;
    setTimeout(() => {
        g.style.transition = 'transform 0s';
        g.style.transform = 'translate(0px, 0px)';
        // restore default transition for next interaction
        setTimeout(() => { g.style.transition = ''; }, 30);
    }, 360);
}

function setupClosetTwoMemorySvgRuntime() {
    const roomObject = document.getElementById('closettwo-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.co42Bound === 'true') {
            scheduleClosetTwoSurfacing();
            return;
        }

        const tipEl = document.getElementById('closettwo-memory-tip');
        const defaultTip = 'hover and click to remember. each shelf is mirrored across the center. objects return to where they were.';

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
            }, 720);
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
                    if (!document.getElementById('closettwo-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 4000);
                pendingTipTimer = null;
            }, 640);
        };
        svgRoot._co42SetTipSurfacing = setTipSurfacing;

        Object.entries(closettwoMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                setTipSlow(hoverText);
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = closettwoMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
                const nudge = closettwoNudgeMap[hotspotId];
                if (nudge) {
                    nudgeAndResetClosetTwo(svgDoc, nudge.groupId, nudge.dx, nudge.dy);
                }
            });
        });

        svgRoot.dataset.co42Bound = 'true';
        scheduleClosetTwoSurfacing();
    };

    if (!roomObject.dataset.co42LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.co42LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 32-46 seconds while the vignette is open
function scheduleClosetTwoSurfacing() {
    if (co42SurfacingTimerId) clearTimeout(co42SurfacingTimerId);
    const overlay = document.getElementById('closettwo-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 32000 + Math.floor(Math.random() * 14000);
    co42SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('closettwo-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('closettwo-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = closettwoSurfacingFragments[Math.floor(Math.random() * closettwoSurfacingFragments.length)];
        if (svgRoot?._co42SetTipSurfacing) {
            svgRoot._co42SetTipSurfacing(fragment);
        }
        scheduleClosetTwoSurfacing();
    }, wait);
}

const closettwoCloseBtn = document.getElementById('closettwo-memory-close');
if (closettwoCloseBtn) closettwoCloseBtn.addEventListener('click', closeClosetTwoMemory);

// ============================================================
// Closet Three Memory Vignette (apartment four)
// preserved travel/transition. luggage that has been there for a long time
// without being moved. magical realism: hidden things tucked inside bags
// surface only when something is opened. doorway light from beneath the
// door never changes.
// ============================================================

const closetthreeMemoryHoverTips = {
    'hit-wall':           'the back wall of the closet. evenly painted, evenly aged.',
    'hit-floor':          'the closet floor in front of the rod. clean. no path worn between the door and the rod.',
    'hit-doorlight':      'a thin warm strip of light beneath the closet door. it has not changed in any way.',

    'hit-shelf-top':      'the top shelf. luggage and folded jackets, all the way across.',
    'hit-rod':            'the closet rod. straight. the hangers on it are evenly spaced.',
    'hit-shelf-shoes':    'the lower shoe rack. four pairs lined up by the toe.',

    'hit-suitcase':       'a hardshell suitcase, laid flat on the top shelf. dust on top has not been disturbed.',
    'hit-suitcase-tag':   'a small luggage tag tied to the handle. the writing on it has not faded.',
    'hit-folded-stack':   'a small stack of folded jackets. the corners are aligned.',
    'hit-duffel':         'a soft duffel bag. the zipper is closed. the shoulder strap is laid across the top.',
    'hit-pouch':          'a small toiletries pouch resting on top of the duffel. the zipper is closed.',

    'hit-coat-long':      'a long charcoal coat on a hanger. the shoulders are square.',
    'hit-coat-cream':     'a cream jacket on a hanger. the collar is folded down evenly.',
    'hit-coat-slate':     'a slate blazer on a hanger. the breast pocket is empty.',
    'hit-backpack':       'an olive backpack hung by its top strap. the shoulder straps drape evenly.',
    'hit-hat':            'a black hat on a small wall hook. the brim is round, the crown is held.',
    'hit-scarf':          'a long maroon scarf draped from a small hook. the fringe is even at the bottom.',

    'hit-shoe-loafers':   'a pair of brown loafers. polished, paired by the toe.',
    'hit-shoe-sneakers':  'a pair of white sneakers. the laces are tied the same way on both shoes.',
    'hit-shoe-flats':     'a pair of black flats. unworn at the heel.',
    'hit-shoe-boots':     'a pair of beige boots. paired tight against each other.',

    'hit-tote':           'a folded carry tote in the corner. the handles are folded over the body.',
    'hit-slippers':       'a pair of slippers near the door. paired by the toe, facing into the closet.'
};

const closetthreeMemoryClickFragments = {
    'hit-wall':           'you press a palm to the back wall. the paint is cool. nothing leans on it long enough to leave a warm spot.',
    'hit-floor':          'you look at the floor. there is no scuff between the door and the rod. nothing has been dragged across it.',
    'hit-doorlight':      'you crouch and look at the strip of light at the bottom of the door. the warmth of it does not flicker. nothing in the hallway has crossed in front of it.',

    'hit-shelf-top':      'you run a finger along the front edge of the top shelf. the dust at the front has not been disturbed by anybody reaching in.',
    'hit-rod':            'you slide one hanger an inch to the left. you let go. it rolls itself back. the spacing on the rod is even again.',
    'hit-shelf-shoes':    'you crouch by the shoe rack. all four pairs are squared up to the front edge. nothing is half-out.',

    'hit-suitcase':       'you press the latches in. they unlatch. the lid is heavier than you expected. inside: a folded shawl, a small bag of currency from somewhere you cannot quite name, and an unopened stick of gum. you close it. the dust on top has not been disturbed.',
    'hit-suitcase-tag':   'you turn the luggage tag over. the address on it is still the address you wrote down. the ink has not bled.',
    'hit-folded-stack':   'you lift the top fold. underneath, a folded receipt with a date on it. you put the fold back. the stack returns to the height it was.',
    'hit-duffel':         'you unzip the duffel. inside: a folded boarding pass tucked into the side pocket, a sock without its match, a small notebook with two pages used. you zip it back. the strap settles on top exactly the way it was.',
    'hit-pouch':          'you unzip the toiletries pouch. inside: a hotel toothbrush still in its wrapper, a tiny bottle of shampoo half-full, a single foreign coin. you zip it back. the pouch sits exactly square on the duffel again.',

    'hit-coat-long':      'you slip a hand into the long coat\u2019s pocket. inside: a metro ticket from a city you can name but do not know how you knew. you put it back. the pocket lays flat again.',
    'hit-coat-cream':     'you slip a hand into the cream jacket\u2019s pocket. inside: a folded note. it has handwriting that looks like yours and like someone else\u2019s. you put it back. the jacket hangs straight again.',
    'hit-coat-slate':     'you slip a hand into the slate blazer\u2019s breast pocket. inside: a key, smaller than a house key, with no tag. you put it back. the breast pocket lays flat again.',
    'hit-backpack':       'you unzip the backpack\u2019s front pocket. inside: a pen with the cap still on, a folded receipt, a small tin with two mints. you zip it back. the front pocket settles flat again.',
    'hit-hat':            'you take the hat off its hook and turn it over. inside the band: a folded slip of paper with someone\u2019s phone number on it. you set the hat back on the hook. the brim sits round again.',
    'hit-scarf':          'you lift the scarf off the hook. it weighs almost nothing. as it shifts, a small pressed flower falls out from one of the folds. you tuck it back in and rehang the scarf. the fringe lines up the way it did.',

    'hit-shoe-loafers':   'you slide a hand inside the right loafer. there is a folded paper insole inside. you put the loafer back. the pair sits paired by the toe again.',
    'hit-shoe-sneakers':  'you press the toe of the right sneaker. it does not give. inside, you can feel the shape of a balled-up sock. you let it be. the laces remain tied the same way.',
    'hit-shoe-flats':     'you tilt the right flat. nothing falls out. the leather is unworn at the heel. the pair settles back together.',
    'hit-shoe-boots':     'you reach into the right boot. there is a folded bus ticket at the bottom, and a few grains of sand. you let the boot sit back. the pair is paired tight against each other again.',

    'hit-tote':           'you unfold the tote one fold. inside: a folded grocery receipt, a single plastic spoon. you fold it back to the same square it was. the handle folds itself back over the body.',
    'hit-slippers':       'you slide a foot into one of the slippers, then back out. it is exactly the right size. you nudge the pair half an inch toward the door. they nudge themselves back, facing into the closet again.'
};

// fragments that surface ON THEIR OWN every 32-46 seconds while open.
// quiet, archival, travel-tinged.
const closetthreeSurfacingFragments = [
    'the dust on top of the suitcase moves a little, very slowly. you cannot tell if it is the dust or your eyes.',
    'the strip of light at the bottom of the door is the same warmth as before. it has gotten gently softer.',
    'the hangers on the rod are still evenly spaced.',
    'the shoes on the rack are still paired toe-to-toe.',
    'the duffel\u2019s shoulder strap is still draped exactly how you left it.',
    'a faint sound from somewhere down the hallway. nothing in this closet responds.',
    'no luggage in here looks like it has been picked up since you put it down.',
    'the slippers by the door are still facing in.',
    'the scarf\u2019s fringe is still even at the bottom.',
    'the address on the luggage tag is still the address.',
    'a soft fridge hum reaches you through the wall. the kitchen is on the other side. it is the only sound that crosses.'
];

let co43HumCtx = null;
let co43HumOscA = null;
let co43HumNoise = null;
let co43HumLfo = null;
let co43SurfacingTimerId = null;

function openClosetThreeMemory() {
    const roomObject = document.getElementById('closetthree-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('closetthree-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('closetthree-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. the bags have not moved. clicking may turn out something tucked away inside.';
    startClosetThreePad();
    setupClosetThreeMemorySvgRuntime();
}

function closeClosetThreeMemory() {
    const overlay = document.getElementById('closetthree-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (co43SurfacingTimerId) {
        clearTimeout(co43SurfacingTimerId);
        co43SurfacingTimerId = null;
    }
    stopClosetThreePad();
}

// distant-hallway tone:
// - low D2 sine for the closed-room body
// - faint very-low-passed warm noise (suggests the hallway breathing
//   on the other side of the door)
// - very slow LFO (~36s) so the hallway side feels alive without
//   the closet itself moving.
function startClosetThreePad() {
    stopClosetThreePad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        co43HumCtx = new Ctx();

        const masterGain = co43HumCtx.createGain();
        masterGain.gain.value = 0.0098;
        masterGain.connect(co43HumCtx.destination);

        co43HumOscA = co43HumCtx.createOscillator();
        co43HumOscA.type = 'sine';
        co43HumOscA.frequency.value = 73.42; // D2
        const gainA = co43HumCtx.createGain();
        gainA.gain.value = 0.55;
        co43HumOscA.connect(gainA);
        gainA.connect(masterGain);

        // hallway-warmth noise: very low cut, slightly louder noise floor than co42
        const bufferSize = 2 * co43HumCtx.sampleRate;
        const noiseBuffer = co43HumCtx.createBuffer(1, bufferSize, co43HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.32;
        }
        co43HumNoise = co43HumCtx.createBufferSource();
        co43HumNoise.buffer = noiseBuffer;
        co43HumNoise.loop = true;
        const noiseFilter = co43HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 200;
        const noiseGain = co43HumCtx.createGain();
        noiseGain.gain.value = 0.16;
        co43HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        // very slow LFO (~36s) - the hallway breathes; the closet does not.
        co43HumLfo = co43HumCtx.createOscillator();
        co43HumLfo.type = 'sine';
        co43HumLfo.frequency.value = 1 / 36;
        const lfoDepth = co43HumCtx.createGain();
        lfoDepth.gain.value = 0.004;
        co43HumLfo.connect(lfoDepth);
        lfoDepth.connect(noiseGain.gain);

        co43HumOscA.start();
        co43HumNoise.start();
        co43HumLfo.start();
        if (co43HumCtx.state === 'suspended') co43HumCtx.resume();
    } catch (_) {
        co43HumCtx = null;
        co43HumOscA = null;
        co43HumNoise = null;
        co43HumLfo = null;
    }
}

function stopClosetThreePad() {
    try {
        co43HumOscA?.stop();
        co43HumNoise?.stop();
        co43HumLfo?.stop();
        co43HumCtx?.close?.();
    } catch (_) {}
    co43HumOscA = null;
    co43HumNoise = null;
    co43HumLfo = null;
    co43HumCtx = null;
}

// a soft distant footstep-like thud when an unprompted fragment surfaces -
// like someone passing in the hallway, never coming in.
function playClosetThreeStep() {
    if (!co43HumCtx) return;
    try {
        const now = co43HumCtx.currentTime;
        const dur = 0.42;
        const buf = co43HumCtx.createBuffer(1, Math.floor(co43HumCtx.sampleRate * dur), co43HumCtx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
            const t = i / ch.length;
            const env = Math.exp(-3 * t);
            ch[i] = (Math.random() * 2 - 1) * env * 0.55;
        }
        const src = co43HumCtx.createBufferSource();
        src.buffer = buf;
        const lp = co43HumCtx.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 220;
        const g = co43HumCtx.createGain();
        g.gain.value = 0.05;
        src.connect(lp);
        lp.connect(g);
        g.connect(co43HumCtx.destination);
        src.start(now);
        src.stop(now + dur + 0.05);
    } catch (_) {}
}

function setupClosetThreeMemorySvgRuntime() {
    const roomObject = document.getElementById('closetthree-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.co43Bound === 'true') {
            scheduleClosetThreeSurfacing();
            return;
        }

        const tipEl = document.getElementById('closetthree-memory-tip');
        const defaultTip = 'hover and click to remember. the bags have not moved. clicking may turn out something tucked away inside.';

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
            }, 760);
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
                    if (!document.getElementById('closetthree-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 4400);
                pendingTipTimer = null;
            }, 660);
        };
        svgRoot._co43SetTipSurfacing = setTipSurfacing;

        Object.entries(closetthreeMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                setTipSlow(hoverText);
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = closetthreeMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
            });
        });

        svgRoot.dataset.co43Bound = 'true';
        scheduleClosetThreeSurfacing();
    };

    if (!roomObject.dataset.co43LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.co43LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 32-46 seconds while the vignette is open.
// occasionally accompanied by the distant hallway-step sound.
function scheduleClosetThreeSurfacing() {
    if (co43SurfacingTimerId) clearTimeout(co43SurfacingTimerId);
    const overlay = document.getElementById('closetthree-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 32000 + Math.floor(Math.random() * 14000);
    co43SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('closetthree-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('closetthree-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = closetthreeSurfacingFragments[Math.floor(Math.random() * closetthreeSurfacingFragments.length)];
        if (svgRoot?._co43SetTipSurfacing) {
            svgRoot._co43SetTipSurfacing(fragment);
            // the hallway sometimes; not every time.
            if (Math.random() < 0.5) playClosetThreeStep();
        }
        scheduleClosetThreeSurfacing();
    }, wait);
}

const closetthreeCloseBtn = document.getElementById('closetthree-memory-close');
if (closetthreeCloseBtn) closetthreeCloseBtn.addEventListener('click', closeClosetThreeMemory);

// ============================================================
// Closet Four Memory Vignette (apartment four)
// categorized + systemized. controlled, precise, subtly uncanny.
// signature behaviors:
//   - labels occasionally rename themselves (often 1, sometimes 2 at once)
//   - interactions reset perfectly (click-nudge-snap-back)
//   - shelves remain impossibly orderly (rare clicks trigger a unison
//     row-snap, where every item on that shelf nudges and snaps back together)
// ============================================================

const closetfourMemoryHoverTips = {
    'hit-wall':         'the back wall of the closet. evenly painted, evenly aged.',
    'hit-floor':        'the closet floor. nothing has been dropped in front of the totes.',

    'hit-shelf-top':    'the top shelf. six identical archival cubes in a row.',
    'hit-shelf-mid':    'the middle shelf. three identical lidded boxes, evenly spaced.',
    'hit-shelf-bot':    'the bottom shelf. a labeled drawer cabinet between two folded linen stacks.',

    'hit-cube-1':       'a small archival cube. lid seated. label on the front-center.',
    'hit-cube-2':       'a small archival cube. lid seated. label on the front-center.',
    'hit-cube-3':       'a small archival cube. lid seated. label on the front-center.',
    'hit-cube-4':       'a small archival cube. lid seated. label on the front-center.',
    'hit-cube-5':       'a small archival cube. lid seated. label on the front-center.',
    'hit-cube-6':       'a small archival cube. lid seated. label on the front-center.',

    'hit-box-1':        'a medium lidded box. weave texture. handle cutout in the front.',
    'hit-box-2':        'a medium lidded box, identical to the one beside it.',
    'hit-box-3':        'a medium lidded box, identical to the others. label centered.',

    'hit-linen-L':      'a stack of folded linens. corners aligned to the front edge.',
    'hit-cabinet':      'a small wood drawer cabinet. six labeled drawers, two rows of three.',
    'hit-linen-R':      'a stack of folded linens, identical to the one across.',

    'hit-drawer-1':     'a labeled drawer. brass pull. closed.',
    'hit-drawer-2':     'a labeled drawer, identical to the one beside it.',
    'hit-drawer-3':     'a labeled drawer, identical to the rest of the row.',
    'hit-drawer-4':     'a labeled drawer in the lower row. closed.',
    'hit-drawer-5':     'a labeled drawer in the lower row. identical to its neighbors.',
    'hit-drawer-6':     'a labeled drawer in the lower row. identical to the rest.',

    'hit-tote-L':       'a large lidded storage tote on the floor. handles even.',
    'hit-tote-R':       'a large lidded storage tote, identical to the one beside it.'
};

const closetfourMemoryClickFragments = {
    'hit-wall':         'you press a palm to the back wall. it is the same temperature as the air. nothing leans on it long enough to leave a warm spot.',
    'hit-floor':        'you look at the floor. there is no scuff in front of the totes. nothing has been dragged across it.',

    'hit-shelf-top':    'you sweep a finger along the top shelf. all six cubes are equally spaced. the spacing has not changed since you opened the door.',
    'hit-shelf-mid':    'you press the front edge of the middle shelf. the three boxes are evenly spaced and they do not touch each other.',
    'hit-shelf-bot':    'you crouch and look along the bottom shelf. the cabinet is centered. the linen stacks on either side are the same height as each other.',

    'hit-cube-1':       'you nudge the cube to the right. you let go. it slides back to the position it was in. the label faces the front again.',
    'hit-cube-2':       'you nudge the cube to the right. you let go. it slides back. the label is in the position it was in.',
    'hit-cube-3':       'you tilt the lid of this cube up. inside, the contents are organized to the same depth as the others. you press the lid back down. it seats with a small click.',
    'hit-cube-4':       'you nudge the cube to the right. you let go. it slides back to its column.',
    'hit-cube-5':       'you tilt the lid up. inside, the contents are organized to the same depth as the others. you press the lid back down. the cube is exactly the same height it was.',
    'hit-cube-6':       'you nudge the cube to the right. you let go. it slides back. the label faces the front again.',

    'hit-box-1':        'you slide the lid off the medium box. inside, neatly folded items at the same depth as the other boxes. you replace the lid. the handle cutout returns to centered.',
    'hit-box-2':        'you slide the lid off this box. inside, neatly folded items at the same depth. you replace the lid. it seats flush with the other lids.',
    'hit-box-3':        'you slide the lid off this box. the contents are organized like the others. you replace the lid. all three lids sit at the same height again.',

    'hit-linen-L':      'you press a thumb into the linen stack. the stack does not give. you take your thumb away. the surface of the top linen has no print.',
    'hit-cabinet':      'you press a hand on the cabinet face. it does not give. all six drawer fronts sit flush with each other.',
    'hit-linen-R':      'you press a thumb into the linen stack. it does not give. when you take your thumb away the top fold sits as it was. the right stack is the same height as the left.',

    'hit-drawer-1':     'you pull the drawer out an inch. inside, contents organized in their slots. you slide it closed. it closes itself the rest of the way and clicks into place.',
    'hit-drawer-2':     'you pull this drawer out an inch. inside, contents organized in their slots. you slide it closed. it clicks flush.',
    'hit-drawer-3':     'you pull this drawer out an inch. inside, contents organized in their slots. you slide it closed. all three top-row drawer faces are flush with each other again.',
    'hit-drawer-4':     'you pull this drawer out an inch. contents organized, slotted. you slide it closed. the lower row of drawer faces sits flush with the upper row.',
    'hit-drawer-5':     'you pull this drawer out an inch. it slides smoothly. you let go. it closes itself the rest of the way.',
    'hit-drawer-6':     'you pull this drawer out an inch. you let go. it closes the rest of the way and clicks into place. all six drawer fronts are flush again.',

    'hit-tote-L':       'you tip the tote toward you. the lid stays on. you let go. it tips back. the handles return to the same level as the other tote\u2019s handles.',
    'hit-tote-R':       'you tip the tote toward you. the lid stays on. you let go. it tips back. the handles return to level. both totes\u2019 lids sit at the same height.'
};

const closetfourSurfacingFragments = [
    'all six cubes on the top shelf are still equally spaced.',
    'the three boxes on the middle shelf are still evenly spaced.',
    'a label has changed words. it is still the right word for what is inside.',
    'two labels have changed words. both still match what is inside their containers.',
    'every drawer face is still flush with every other drawer face.',
    'both linen stacks on the bottom shelf are still the exact same height.',
    'the totes on the floor still have their handles at exactly the same level.',
    'nothing on any shelf has shifted toward anything next to it.',
    'the room remains impossibly orderly. a small warmth has gathered in the upper corner that is new.',
    'the system holds. the system has been holding for some time now.',
    'a soft sound from another room - maybe a door, maybe a fridge. it does not change anything in here.'
];

// label rotation pools - each label cycles within its own category
const closetfourLabelPool = {
    'co44-label-cube-1':   ['socks', 'gloves', 'mittens', 'liners', 'wool'],
    'co44-label-cube-2':   ['bulbs', 'fuses', 'sockets', 'plugs', 'lamps'],
    'co44-label-cube-3':   ['candles', 'tapers', 'tealights', 'wicks', 'matches'],
    'co44-label-cube-4':   ['batteries', 'cells', 'chargers', 'cables', 'cords'],
    'co44-label-cube-5':   ['matches', 'lighters', 'flints', 'fuses', 'tinder'],
    'co44-label-cube-6':   ['tools', 'wrenches', 'pliers', 'drivers', 'spanners'],
    'co44-label-box-1':    ['spare bedding', 'guest sheets', 'extra pillows', 'flat sheets', 'duvet covers'],
    'co44-label-box-2':    ['holiday decor', 'winter decor', 'season ornaments', 'string lights', 'paper crowns'],
    'co44-label-box-3':    ['picture frames', 'small frames', 'glass frames', 'old frames', 'spare frames'],
    'co44-label-drawer-1': ['pens', 'inks', 'pencils', 'markers', 'liners'],
    'co44-label-drawer-2': ['clips', 'pins', 'tacks', 'rings', 'fasteners'],
    'co44-label-drawer-3': ['stamps', 'seals', 'inks', 'pads', 'rollers'],
    'co44-label-drawer-4': ['cords', 'cables', 'chargers', 'plugs', 'leads'],
    'co44-label-drawer-5': ['nails', 'screws', 'bolts', 'tacks', 'pins'],
    'co44-label-drawer-6': ['hooks', 'hangers', 'clasps', 'latches', 'rings'],
    'co44-label-tote-L':   ['blankets', 'throws', 'wool throws', 'fleece', 'flannel'],
    'co44-label-tote-R':   ['comforters', 'duvets', 'down duvets', 'quilts', 'spreads']
};

// nudge map - each item knows which group to translate and by how much
// (chosen mostly outward from the centerline, like in co42)
const closetfourNudgeMap = {
    'hit-cube-1':    { groupId: 'co44-cube-1-art',    dx: -2 },
    'hit-cube-2':    { groupId: 'co44-cube-2-art',    dx: -2 },
    'hit-cube-3':    { groupId: 'co44-cube-3-art',    dx: -1, dy: -1 },
    'hit-cube-4':    { groupId: 'co44-cube-4-art',    dx:  1, dy: -1 },
    'hit-cube-5':    { groupId: 'co44-cube-5-art',    dx:  2 },
    'hit-cube-6':    { groupId: 'co44-cube-6-art',    dx:  2 },
    'hit-box-1':     { groupId: 'co44-box-1-art',     dx: -2 },
    'hit-box-2':     { groupId: 'co44-box-2-art',     dx:  0, dy: -1 },
    'hit-box-3':     { groupId: 'co44-box-3-art',     dx:  2 },
    'hit-linen-L':   { groupId: 'co44-linen-L-art',   dx: -2 },
    'hit-cabinet':   { groupId: 'co44-cabinet-art',   dx:  0, dy: -1 },
    'hit-linen-R':   { groupId: 'co44-linen-R-art',   dx:  2 },
    'hit-drawer-1':  { groupId: 'co44-drawer-1-art',  dx: -2 },
    'hit-drawer-2':  { groupId: 'co44-drawer-2-art',  dx:  0, dy: -1 },
    'hit-drawer-3':  { groupId: 'co44-drawer-3-art',  dx:  2 },
    'hit-drawer-4':  { groupId: 'co44-drawer-4-art',  dx: -2 },
    'hit-drawer-5':  { groupId: 'co44-drawer-5-art',  dx:  0, dy: -1 },
    'hit-drawer-6':  { groupId: 'co44-drawer-6-art',  dx:  2 },
    'hit-tote-L':    { groupId: 'co44-tote-L-art',    dx: -2 },
    'hit-tote-R':    { groupId: 'co44-tote-R-art',    dx:  2 }
};

// row groups - which group ids belong to each shelf row, used for the rare
// "shelf remains impossibly orderly" coordinated unison snap
const closetfourRowGroups = {
    'top': ['co44-cube-1-art', 'co44-cube-2-art', 'co44-cube-3-art', 'co44-cube-4-art', 'co44-cube-5-art', 'co44-cube-6-art'],
    'mid': ['co44-box-1-art', 'co44-box-2-art', 'co44-box-3-art'],
    'bot': ['co44-linen-L-art', 'co44-cabinet-art', 'co44-linen-R-art',
            'co44-drawer-1-art', 'co44-drawer-2-art', 'co44-drawer-3-art',
            'co44-drawer-4-art', 'co44-drawer-5-art', 'co44-drawer-6-art'],
    'flr': ['co44-tote-L-art', 'co44-tote-R-art']
};

// which row each hit-id belongs to
const closetfourHitRow = {
    'hit-cube-1': 'top', 'hit-cube-2': 'top', 'hit-cube-3': 'top',
    'hit-cube-4': 'top', 'hit-cube-5': 'top', 'hit-cube-6': 'top',
    'hit-box-1':  'mid', 'hit-box-2':  'mid', 'hit-box-3':  'mid',
    'hit-linen-L': 'bot', 'hit-cabinet': 'bot', 'hit-linen-R': 'bot',
    'hit-drawer-1': 'bot', 'hit-drawer-2': 'bot', 'hit-drawer-3': 'bot',
    'hit-drawer-4': 'bot', 'hit-drawer-5': 'bot', 'hit-drawer-6': 'bot',
    'hit-tote-L': 'flr', 'hit-tote-R': 'flr'
};

let co44HumCtx = null;
let co44HumOscA = null;
let co44HumNoise = null;
let co44HumLfo = null;
let co44SurfacingTimerId = null;
let co44LabelTimerId = null;

function openClosetFourMemory() {
    const roomObject = document.getElementById('closetfour-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('closetfour-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('closetfour-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. each shelf is in line with the next. labels reorganize themselves. interactions reset.';
    startClosetFourPad();
    setupClosetFourMemorySvgRuntime();
}

function closeClosetFourMemory() {
    const overlay = document.getElementById('closetfour-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (co44SurfacingTimerId) {
        clearTimeout(co44SurfacingTimerId);
        co44SurfacingTimerId = null;
    }
    if (co44LabelTimerId) {
        clearTimeout(co44LabelTimerId);
        co44LabelTimerId = null;
    }
    stopClosetFourPad();
}

// systemized-room tone:
// - very low D2 sine, even quieter than co42
// - ultra-faint low-passed noise floor
// - very slow LFO (~42s period) - the system still holds, but it breathes
//   gently. memory rather than mechanism.
function startClosetFourPad() {
    stopClosetFourPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        co44HumCtx = new Ctx();

        const masterGain = co44HumCtx.createGain();
        masterGain.gain.value = 0.0078;
        masterGain.connect(co44HumCtx.destination);

        co44HumOscA = co44HumCtx.createOscillator();
        co44HumOscA.type = 'sine';
        co44HumOscA.frequency.value = 73.42; // D2
        const gainA = co44HumCtx.createGain();
        gainA.gain.value = 0.55;
        co44HumOscA.connect(gainA);
        gainA.connect(masterGain);

        const bufferSize = 2 * co44HumCtx.sampleRate;
        const noiseBuffer = co44HumCtx.createBuffer(1, bufferSize, co44HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.20;
        }
        co44HumNoise = co44HumCtx.createBufferSource();
        co44HumNoise.buffer = noiseBuffer;
        co44HumNoise.loop = true;
        const noiseFilter = co44HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 170;
        const noiseGain = co44HumCtx.createGain();
        noiseGain.gain.value = 0.09;
        co44HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        co44HumLfo = co44HumCtx.createOscillator();
        co44HumLfo.type = 'sine';
        co44HumLfo.frequency.value = 1 / 42;
        const lfoDepth = co44HumCtx.createGain();
        lfoDepth.gain.value = 0.0008;
        co44HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        co44HumOscA.start();
        co44HumNoise.start();
        co44HumLfo.start();
        if (co44HumCtx.state === 'suspended') co44HumCtx.resume();
    } catch (_) {
        co44HumCtx = null;
        co44HumOscA = null;
        co44HumNoise = null;
        co44HumLfo = null;
    }
}

function stopClosetFourPad() {
    try {
        co44HumOscA?.stop();
        co44HumNoise?.stop();
        co44HumLfo?.stop();
        co44HumCtx?.close?.();
    } catch (_) {}
    co44HumOscA = null;
    co44HumNoise = null;
    co44HumLfo = null;
    co44HumCtx = null;
}

// soft index-card slip used both for label changes and item resets
function playClosetFourSlip() {
    if (!co44HumCtx) return;
    try {
        const now = co44HumCtx.currentTime;
        const dur = 0.30;
        const buf = co44HumCtx.createBuffer(1, Math.floor(co44HumCtx.sampleRate * dur), co44HumCtx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
            const t = i / ch.length;
            const env = Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.sin(t * 30));
            ch[i] = (Math.random() * 2 - 1) * env * 0.5;
        }
        const src = co44HumCtx.createBufferSource();
        src.buffer = buf;
        const bp = co44HumCtx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 2400;
        bp.Q.value = 0.9;
        const g = co44HumCtx.createGain();
        g.gain.value = 0.035;
        src.connect(bp);
        bp.connect(g);
        g.connect(co44HumCtx.destination);
        src.start(now);
        src.stop(now + dur + 0.05);
    } catch (_) {}
}

// nudge an item group, then snap it back to identity
function nudgeAndResetClosetFour(svgDoc, groupId, dx, dy) {
    if (!svgDoc || !groupId) return;
    const g = svgDoc.getElementById(groupId);
    if (!g) return;
    g.style.transition = 'transform 220ms ease-out';
    g.style.transform = `translate(${dx || 0}px, ${dy || 0}px)`;
    setTimeout(() => {
        g.style.transition = 'transform 0s';
        g.style.transform = 'translate(0px, 0px)';
        setTimeout(() => { g.style.transition = ''; }, 30);
    }, 360);
}

// nudge an entire shelf's worth of items in unison (the "impossibly orderly" beat)
function nudgeRowAndResetClosetFour(svgDoc, rowKey) {
    if (!svgDoc || !rowKey) return;
    const groupIds = closetfourRowGroups[rowKey];
    if (!groupIds) return;
    // pick a single horizontal direction for the whole row so they move together
    const dx = Math.random() < 0.5 ? -2 : 2;
    groupIds.forEach((groupId) => {
        const g = svgDoc.getElementById(groupId);
        if (!g) return;
        g.style.transition = 'transform 240ms ease-out';
        g.style.transform = `translate(${dx}px, 0px)`;
    });
    setTimeout(() => {
        groupIds.forEach((groupId) => {
            const g = svgDoc.getElementById(groupId);
            if (!g) return;
            g.style.transition = 'transform 0s';
            g.style.transform = 'translate(0px, 0px)';
            setTimeout(() => { g.style.transition = ''; }, 30);
        });
    }, 380);
    playClosetFourSlip();
}

function setupClosetFourMemorySvgRuntime() {
    const roomObject = document.getElementById('closetfour-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.co44Bound === 'true') {
            scheduleClosetFourSurfacing();
            scheduleClosetFourLabelChange();
            return;
        }

        const tipEl = document.getElementById('closetfour-memory-tip');
        const defaultTip = 'hover and click to remember. each shelf is in line with the next. labels reorganize themselves. interactions reset.';

        let pendingTipTimer = null;
        // longer delay than co41 to satisfy "objects respond with delayed precision"
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 820);
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
                    if (!document.getElementById('closetfour-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 4200);
                pendingTipTimer = null;
            }, 660);
        };
        svgRoot._co44SetTipSurfacing = setTipSurfacing;

        Object.entries(closetfourMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => {
                setTipSlow(hoverText);
            });
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = closetfourMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
                const nudge = closetfourNudgeMap[hotspotId];
                if (nudge) {
                    nudgeAndResetClosetFour(svgDoc, nudge.groupId, nudge.dx, nudge.dy);
                }
                // ~14% of clicks on a categorized item also trigger a unison row-snap
                const rowKey = closetfourHitRow[hotspotId];
                if (rowKey && Math.random() < 0.14) {
                    setTimeout(() => nudgeRowAndResetClosetFour(svgDoc, rowKey), 120);
                }
            });
        });

        svgRoot.dataset.co44Bound = 'true';
        scheduleClosetFourSurfacing();
        scheduleClosetFourLabelChange();
    };

    if (!roomObject.dataset.co44LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.co44LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 32-46 seconds while the vignette is open
function scheduleClosetFourSurfacing() {
    if (co44SurfacingTimerId) clearTimeout(co44SurfacingTimerId);
    const overlay = document.getElementById('closetfour-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 32000 + Math.floor(Math.random() * 14000);
    co44SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('closetfour-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('closetfour-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = closetfourSurfacingFragments[Math.floor(Math.random() * closetfourSurfacingFragments.length)];
        if (svgRoot?._co44SetTipSurfacing) {
            svgRoot._co44SetTipSurfacing(fragment);
        }
        scheduleClosetFourSurfacing();
    }, wait);
}

// every 22-32 seconds, rotate one (or, ~30% of the time, two) labels.
// each label only ever rotates within its own category pool, so the system
// stays internally consistent even as it reorganizes.
function scheduleClosetFourLabelChange() {
    if (co44LabelTimerId) clearTimeout(co44LabelTimerId);
    const overlay = document.getElementById('closetfour-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 22000 + Math.floor(Math.random() * 10000);
    co44LabelTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('closetfour-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('closetfour-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        if (svgDoc) {
            const labelIds = Object.keys(closetfourLabelPool);
            const rotateOne = () => {
                const labelId = labelIds[Math.floor(Math.random() * labelIds.length)];
                const labelEl = svgDoc.getElementById(labelId);
                if (!labelEl) return;
                const pool = closetfourLabelPool[labelId] || [];
                const current = (labelEl.textContent || '').trim();
                const choices = pool.filter((w) => w !== current);
                if (choices.length === 0) return;
                const next = choices[Math.floor(Math.random() * choices.length)];
                labelEl.textContent = next;
            };
            rotateOne();
            playClosetFourSlip();
            // ~30% chance the system reorganizes a second label at the same moment
            if (Math.random() < 0.30) {
                setTimeout(() => {
                    rotateOne();
                    playClosetFourSlip();
                }, 220);
            }
        }
        scheduleClosetFourLabelChange();
    }, wait);
}

const closetfourCloseBtn = document.getElementById('closetfour-memory-close');
if (closetfourCloseBtn) closetfourCloseBtn.addEventListener('click', closeClosetFourMemory);

// ============================================================
// Bathroom Memory Vignette (apartment four)
// polished, sterile, subtly uncanny.
// signature behaviors:
//   - each toiletry on the counter has a tender ghost-reflection inside
//     the lower mirror; on hover, the real item brightens first and the
//     ghost catches up ~280ms later. on click, the ghost nudges back at
//     the real item with the same tender delay.
//   - the drop never falls; the vanity light pulses very faintly.
//   - reflections feel slightly delayed - lucid memory rather than mirror.
// ============================================================

const bathroomMemoryHoverTips = {
    'hit-wall':            'the bathroom wall. cool paint. no marks.',
    'hit-floor':            'the tiled bathroom floor. evenly mopped, evenly dry.',
    'hit-light':            'the vanity light bar. two bulbs. perfectly steady.',

    'hit-mirror':           'the mirror. polished. no condensation, no smudge.',
    'hit-mirror-art':       'a small framed print, reflected from the wall behind you.',
    'hit-mirror-doorway':   'the bathroom doorway, reflected. a sliver of warm hall light beneath it.',
    'hit-mirror-towelring': 'the towel ring on the wall behind you, reflected. a folded hand towel.',

    'hit-backsplash':       'the backsplash tile. one seam runs across at exactly mid-height.',
    'hit-counter':           'the counter top. clean.',

    'hit-faucet':           'the wall-mounted faucet. a single drop hangs from the spout. it does not fall.',
    'hit-sink':             'the porcelain sink. the drain is centered. the bowl is dry.',

    'hit-soap':             'a slim brass soap dispenser. nozzle facing the sink.',
    'hit-towel':            'a small folded hand towel. the embroidered band runs straight across.',
    'hit-tumbler':          'a glass tumbler. one toothbrush stands inside it.',
    'hit-soapdish':         'a ceramic soap dish. one sage bar of soap, dry on top.',
    'hit-vase':             'a small white vase. a single sprig of eucalyptus.',

    'hit-vanity':            'the vanity cabinet. two doors. brass pulls. closed.'
};

const bathroomMemoryClickFragments = {
    'hit-wall':            'you press a palm to the wall. it is cool. it is cool the same way the air is cool.',
    'hit-floor':           'you look down at the floor. there is no print of a foot anywhere on it.',
    'hit-light':            'you look up at the vanity light. the bulbs are not warmer than they were a minute ago. they are not colder either.',

    'hit-mirror':           'you look into the mirror. it shows the room behind you, every detail in its right place. you tilt your head. the reflection tilts perfectly. there is no warp at the edges. there is nothing on the surface that should not be there.',
    'hit-mirror-art':       'a small framed print, reflected. it is the same horizon line you remember on the wall behind you. in the reflection it is sharper than it is in person.',
    'hit-mirror-doorway':   'the doorway is slightly ajar in the reflection. a sliver of warm hall light bleeds in from beyond it. the sliver does not change width.',
    'hit-mirror-towelring': 'a hand towel hangs through a chrome ring on the wall behind you. it is folded the way it was folded yesterday. it has not shifted.',

    'hit-backsplash':       'you press a fingertip to the tile. the tile is the same temperature as the rest of the wall. there is no grout missing.',
    'hit-counter':          'you sweep a palm across the counter. it is dry. there is no ring where the tumbler sits.',

    'hit-faucet':           'you look closely at the drop hanging from the spout. it is perfectly shaped. you wait for it to fall. it does not fall. you put a finger under it. nothing transfers.',
    'hit-sink':             'you look into the bowl. it is dry. the drain is centered. the porcelain holds a soft warm reflection of the wall behind you for a moment longer than it should.',

    'hit-soap':             'you press the pump. it gives, then returns. nothing comes out. in the mirror, a moment later, the ghost of the dispenser nods softly in the opposite direction.',
    'hit-towel':            'you press the folded towel. it does not give. you pull your hand away. a heartbeat later, its ghost on the right of the glass settles back into place, gently.',
    'hit-tumbler':          'you tap the side of the tumbler. it does not ring. the toothbrush inside it does not lean. in the mirror, after a small pause, the ghost of the tumbler answers, mirrored.',
    'hit-soapdish':         'you tilt the dish. the bar of soap does not shift. you let go. the dish settles. the ghost of it in the mirror has settled already.',
    'hit-vase':             'you touch a leaf of the sprig. it is dry but not brittle. the sprig in the mirror has the same number of leaves it should not have at all - kept there by something tender.',

    'hit-vanity':           'you press the cabinet door. it does not give. the brass pull is room temperature. neither pull is loose.'
};

const bathroomSurfacingFragments = [
    'the drop on the faucet has not fallen. it is being held by something tender.',
    'the bulbs in the vanity light have a faint warmth that gently rises and falls, slowly enough that you almost do not notice.',
    'the reflection of the doorway is a sliver of warm hall light. the sliver does not move.',
    'every ghost in the lower mirror is mirrored across the sink, but each one answers a small moment after the real thing.',
    'the tile seam in the backsplash runs across at the same height. it has not jogged.',
    'the bar of soap on the dish is still dry. it smells of something familiar from the next room.',
    'the tumbler still has one toothbrush in it. it has had one toothbrush in it the whole time.',
    'there is no fog on the mirror, but the warm corner of the glass is softer than it was a minute ago.',
    'the room is still. it is not the stillness of a sealed room. it is the stillness of a remembered one.',
    'you are not in the reflection yet. the mirror is waiting to remember you.'
];

// real item -> ghost reflection mapping (and how to nudge each)
// dx is the direction to nudge the REAL item; the ghost gets -dx (mirrored).
const bathroomGhostMap = {
    'hit-soap':     { realId: 'b45-soap-art',     ghostId: 'b45-ghost-soap-art',     dx: -2 },
    'hit-towel':    { realId: 'b45-towel-art',    ghostId: 'b45-ghost-towel-art',    dx: -2 },
    'hit-tumbler':  { realId: 'b45-tumbler-art',  ghostId: 'b45-ghost-tumbler-art',  dx:  2 },
    'hit-soapdish': { realId: 'b45-soapdish-art', ghostId: 'b45-ghost-soapdish-art', dx:  2 },
    'hit-vase':     { realId: 'b45-vase-art',     ghostId: 'b45-ghost-vase-art',     dx:  2 }
};

// non-ghost-paired items still nudge-and-snap, just without a mirror echo
const bathroomLoneNudgeMap = {
    'hit-faucet':   { groupId: 'b45-faucet-art',   dx:  0, dy: -1 },
    'hit-sink':     { groupId: 'b45-sink-art',     dx:  0, dy:  1 }
};

let b45HumCtx = null;
let b45HumOscA = null;
let b45HumOscB = null;
let b45HumNoise = null;
let b45HumLfo = null;
let b45SurfacingTimerId = null;

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
    if (tip) tip.textContent = 'hover and click to remember. the mirror is polished. it remembers each gesture a moment late, tenderly.';
    startBathroomPad();
    setupBathroomMemorySvgRuntime();
}

function closeBathroomMemory() {
    const overlay = document.getElementById('bathroom-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (b45SurfacingTimerId) {
        clearTimeout(b45SurfacingTimerId);
        b45SurfacingTimerId = null;
    }
    stopBathroomPad();
}

// tile-room tone:
// - very low E2 sine (the room hum)
// - a faint, very high sustained partial (a tile-room presence)
// - a low-passed noise floor
// - very slow LFO (~32s period) - lighting still never visibly flickers, but
//   the room exhales gently. tender rather than mechanical.
function startBathroomPad() {
    stopBathroomPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        b45HumCtx = new Ctx();

        const masterGain = b45HumCtx.createGain();
        masterGain.gain.value = 0.0085;
        masterGain.connect(b45HumCtx.destination);

        b45HumOscA = b45HumCtx.createOscillator();
        b45HumOscA.type = 'sine';
        b45HumOscA.frequency.value = 82.41; // E2
        const gainA = b45HumCtx.createGain();
        gainA.gain.value = 0.55;
        b45HumOscA.connect(gainA);
        gainA.connect(masterGain);

        // a barely-audible high partial - the "tile room" sustained ringing
        b45HumOscB = b45HumCtx.createOscillator();
        b45HumOscB.type = 'sine';
        b45HumOscB.frequency.value = 5800;
        const gainB = b45HumCtx.createGain();
        gainB.gain.value = 0.018;
        b45HumOscB.connect(gainB);
        gainB.connect(masterGain);

        const bufferSize = 2 * b45HumCtx.sampleRate;
        const noiseBuffer = b45HumCtx.createBuffer(1, bufferSize, b45HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.18;
        }
        b45HumNoise = b45HumCtx.createBufferSource();
        b45HumNoise.buffer = noiseBuffer;
        b45HumNoise.loop = true;
        const noiseFilter = b45HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 220;
        const noiseGain = b45HumCtx.createGain();
        noiseGain.gain.value = 0.10;
        b45HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        b45HumLfo = b45HumCtx.createOscillator();
        b45HumLfo.type = 'sine';
        b45HumLfo.frequency.value = 1 / 32;
        const lfoDepth = b45HumCtx.createGain();
        lfoDepth.gain.value = 0.0009;
        b45HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        b45HumOscA.start();
        b45HumOscB.start();
        b45HumNoise.start();
        b45HumLfo.start();
        if (b45HumCtx.state === 'suspended') b45HumCtx.resume();
    } catch (_) {
        b45HumCtx = null;
        b45HumOscA = null;
        b45HumOscB = null;
        b45HumNoise = null;
        b45HumLfo = null;
    }
}

function stopBathroomPad() {
    try {
        b45HumOscA?.stop();
        b45HumOscB?.stop();
        b45HumNoise?.stop();
        b45HumLfo?.stop();
        b45HumCtx?.close?.();
    } catch (_) {}
    b45HumOscA = null;
    b45HumOscB = null;
    b45HumNoise = null;
    b45HumLfo = null;
    b45HumCtx = null;
}

// soft "porcelain tap" - dry, quick, no resonance
function playBathroomTap() {
    if (!b45HumCtx) return;
    try {
        const now = b45HumCtx.currentTime;
        const dur = 0.06;
        const osc = b45HumCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2400, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + dur);
        const g = b45HumCtx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.045, now + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g);
        g.connect(b45HumCtx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
    } catch (_) {}
}

// nudge an item (or its ghost) and snap it back. uses inline transform on the
// SVG group so nothing pollutes the original SVG layout.
function nudgeAndResetBathroom(svgDoc, groupId, dx, dy) {
    if (!svgDoc || !groupId) return;
    const g = svgDoc.getElementById(groupId);
    if (!g) return;
    g.style.transition = 'transform 200ms ease-out';
    g.style.transform = `translate(${dx || 0}px, ${dy || 0}px)`;
    setTimeout(() => {
        g.style.transition = 'transform 0s';
        g.style.transform = 'translate(0px, 0px)';
        setTimeout(() => { g.style.transition = ''; }, 30);
    }, 320);
}

// hover-link: the real item brightens softly; its mirror ghost brightens
// with a tender ~280ms delay so the reflection always feels like it is
// remembering the gesture a fraction of a second after it happened.
const b45GhostTimers = new WeakMap();
function setBathroomHoverLink(svgDoc, realId, ghostId, on) {
    if (!svgDoc) return;
    const realEl = realId ? svgDoc.getElementById(realId) : null;
    const ghostEl = ghostId ? svgDoc.getElementById(ghostId) : null;

    if (realEl) {
        if (on) {
            realEl.style.transition = 'filter 160ms ease-out';
            realEl.style.filter = 'brightness(1.14) saturate(1.04)';
        } else {
            realEl.style.transition = 'filter 220ms ease-in';
            realEl.style.filter = '';
        }
    }

    if (ghostEl) {
        const prev = b45GhostTimers.get(ghostEl);
        if (prev) clearTimeout(prev);
        const delay = on ? 280 : 220;
        const t = setTimeout(() => {
            if (on) {
                ghostEl.style.transition = 'filter 200ms ease-out';
                ghostEl.style.filter = 'brightness(1.12) saturate(1.03)';
            } else {
                ghostEl.style.transition = 'filter 240ms ease-in';
                ghostEl.style.filter = '';
            }
        }, delay);
        b45GhostTimers.set(ghostEl, t);
    }
}

function setupBathroomMemorySvgRuntime() {
    const roomObject = document.getElementById('bathroom-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.b45Bound === 'true') {
            scheduleBathroomSurfacing();
            return;
        }

        const tipEl = document.getElementById('bathroom-memory-tip');
        const defaultTip = 'hover and click to remember. the mirror is polished. it remembers each gesture a moment late, tenderly.';

        let pendingTipTimer = null;
        // delayed-precision tip transitions, matching the apt4 "interactions
        // respond with delay" beat
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 760);
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
                }, 4200);
                pendingTipTimer = null;
            }, 660);
        };
        svgRoot._b45SetTipSurfacing = setTipSurfacing;

        Object.entries(bathroomMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            const ghostEntry = bathroomGhostMap[hotspotId];

            hotspot.addEventListener('mouseenter', () => {
                setTipSlow(hoverText);
                if (ghostEntry) {
                    setBathroomHoverLink(svgDoc, ghostEntry.realId, ghostEntry.ghostId, true);
                }
            });
            hotspot.addEventListener('mouseleave', () => {
                setTipSlow(defaultTip);
                if (ghostEntry) {
                    setBathroomHoverLink(svgDoc, ghostEntry.realId, ghostEntry.ghostId, false);
                }
            });

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = bathroomMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);

                if (ghostEntry) {
                    // the real item moves on click; the ghost in the mirror
                    // catches up a tender ~240ms later, mirrored. the room
                    // remembers the gesture rather than echoing it instantly.
                    nudgeAndResetBathroom(svgDoc, ghostEntry.realId, ghostEntry.dx, 0);
                    setTimeout(() => {
                        nudgeAndResetBathroom(svgDoc, ghostEntry.ghostId, -ghostEntry.dx, 0);
                    }, 240);
                    playBathroomTap();
                    return;
                }

                const lone = bathroomLoneNudgeMap[hotspotId];
                if (lone) {
                    nudgeAndResetBathroom(svgDoc, lone.groupId, lone.dx, lone.dy);
                    playBathroomTap();
                }
            });
        });

        svgRoot.dataset.b45Bound = 'true';
        scheduleBathroomSurfacing();
    };

    if (!roomObject.dataset.b45LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.b45LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 30-44 seconds while the vignette is open
function scheduleBathroomSurfacing() {
    if (b45SurfacingTimerId) clearTimeout(b45SurfacingTimerId);
    const overlay = document.getElementById('bathroom-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 30000 + Math.floor(Math.random() * 14000);
    b45SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('bathroom-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('bathroom-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = bathroomSurfacingFragments[Math.floor(Math.random() * bathroomSurfacingFragments.length)];
        if (svgRoot?._b45SetTipSurfacing) {
            svgRoot._b45SetTipSurfacing(fragment);
        }
        scheduleBathroomSurfacing();
    }, wait);
}

const bathroomMemoryCloseBtn = document.getElementById('bathroom-memory-close');
if (bathroomMemoryCloseBtn) bathroomMemoryCloseBtn.addEventListener('click', closeBathroomMemory);

// ============================================================
// Living + Kitchen Memory Vignette (apartment four)
// controlled, sparse, emotionally suspended in time.
// signature behaviors:
//   - the television cycles through 6 FROZEN broadcasts on click; each
//     broadcast LOCKS for ~1.4s (no rapid-fire), satisfying "broadcasts
//     remain frozen briefly" and "interactions feel slightly delayed."
//     each channel surfaces a restrained memory fragment as its caption.
//   - the moka pot does not steam. nothing animates.
//   - fridge hum is a perfectly consistent low sine - NO LFO.
// ============================================================

const lk4MemoryHoverTips = {
    'hit-wall':       'the back wall. evenly painted, evenly aged.',
    'hit-floor':      'the wood floor. no scuff in the open space between the kitchen and the couch.',

    'hit-fridge':     'a slim modern fridge. the cool seam-glow at the freezer line never wavers.',
    'hit-cabinet':    'an upper kitchen cabinet. closed. two doors. no handles.',
    'hit-counter':    'a clean counter. nothing has been left out except what is meant to be there.',

    'hit-canister':   'a small canister. lid sealed.',
    'hit-moka':       'the moka pot. cold to the touch. the same moka pot.',
    'hit-mug':        'a single ceramic mug. empty.',

    'hit-window':     'a small window. the view does not change. it has not changed since you arrived.',

    'hit-tv':         'a wall-mounted television. each broadcast holds completely still.',

    'hit-couch':      'the corner of a slate-blue couch. the cushion is even.',
    'hit-pillow':     'a single warm throw pillow tucked into the corner of the arm.'
};

const lk4MemoryClickFragments = {
    'hit-wall':       'you press a hand to the back wall. the temperature is the same as the air. the wall does not warm under your palm.',
    'hit-floor':      'you look at the floor between the kitchen and the couch. there is no print. no one has crossed it just before you.',

    'hit-fridge':     'you put a hand flat on the fridge door. you feel the steady, unbroken hum on the other side. it is the same note it was a minute ago.',
    'hit-cabinet':    'you press the cabinet door. it gives a fraction of an inch and returns. you do not open it. you would only find it organized.',
    'hit-counter':    'you sweep a palm across the counter. it is dry. there is no ring under the moka pot. there has never been a ring under the moka pot here.',

    'hit-canister':   'you lift the canister. it is the weight you expect. you set it back down inside its own mark. there is no mark.',
    'hit-moka':       'you wrap a hand around the moka pot. it is cold. you remember it being warm in another kitchen. it does not become warm now.',
    'hit-mug':        'you turn the mug on its base. the handle returns to facing left, the way it was. you did not move it enough to matter.',

    'hit-window':     'you look out the window. the rooftops are exactly where they were. the cloud has not crossed any building. it will not.',

    'hit-tv':         null,

    'hit-couch':      'you press a hand into the couch arm. it gives slowly. you take your hand away. the cushion returns to itself at the same speed it gave.',
    'hit-pillow':     'you adjust the pillow in the corner. it sits the way you adjusted it. it does not slump.'
};

const lk4SurfacingFragments = [
    'the broadcast on the television has not advanced.',
    'the cloud in the window is the same shape it was when you opened the door.',
    'the seam-light along the freezer door has not flickered. the warmth in the corner of the floor is gentler than it was a moment ago.',
    'the moka pot has not warmed. you can almost smell coffee anyway.',
    'the wall clock above the cabinet says one time. the timestamp on the television says another. neither has moved since you came in.',
    'the throw pillow on the couch has not settled.',
    'no one has walked between the kitchen and the couch the entire time you have been here.',
    'the room remains gently lit. a soft warmth has gathered along the lower wall that you do not remember.',
    'the system is holding. underneath it, the apartment is breathing very slowly.',
    'a faint sound from another room. it could be a door, a hanger, a tap. it does not advance anything in here.'
];

// channels in cycle order. each has a caption (memory fragment) that surfaces
// in the tip when the channel is shown.
const lk4Channels = [
    {
        id: 'lk4-tv-channel-A',
        caption: 'channel one. test pattern. the bars are the same width they were yesterday and the day before.'
    },
    {
        id: 'lk4-tv-channel-B',
        caption: 'channel two. an empty doorway. a warm light from a room beyond it. you do not see anyone walk through.'
    },
    {
        id: 'lk4-tv-channel-C',
        caption: 'channel three. a flat sky and one cloud. the cloud has been in this position for a long time.'
    },
    {
        id: 'lk4-tv-channel-D',
        caption: 'channel four. a desk lamp on a desk. the page underneath it is unread. it stays unread.'
    },
    {
        id: 'lk4-tv-channel-E',
        caption: 'channel five. a colored field with a timestamp. the timestamp is 07:42. the timestamp does not advance.'
    },
    {
        id: 'lk4-tv-channel-F',
        caption: 'channel six. a kitchen counter with a moka pot in the center. the counter is this counter. the broadcast is this room.'
    }
];

let lk4HumCtx = null;
let lk4HumOscFridge = null;
let lk4HumOscRoom = null;
let lk4HumNoise = null;
let lk4HumLfo = null;
let lk4SurfacingTimerId = null;

function openLivingKitchenMemory() {
    const roomObject = document.getElementById('livingkitchen-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('livingkitchen-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('livingkitchen-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. the television holds each broadcast still. the fridge hum never wavers. nothing here moves.';
    startLivingKitchenPad();
    setupLivingKitchenMemorySvgRuntime();
}

function closeLivingKitchenMemory() {
    const overlay = document.getElementById('livingkitchen-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (lk4SurfacingTimerId) {
        clearTimeout(lk4SurfacingTimerId);
        lk4SurfacingTimerId = null;
    }
    stopLivingKitchenPad();
}

// suspended-room tone:
// - very low D2 sine (the fridge hum, near-consistent)
// - a quiet A2 a fifth above (room presence)
// - low-passed noise floor
// - very slow LFO (~40s period) - the fridge breathes a little. memory-warm.
function startLivingKitchenPad() {
    stopLivingKitchenPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        lk4HumCtx = new Ctx();

        const masterGain = lk4HumCtx.createGain();
        masterGain.gain.value = 0.0095;
        masterGain.connect(lk4HumCtx.destination);

        lk4HumOscFridge = lk4HumCtx.createOscillator();
        lk4HumOscFridge.type = 'sine';
        lk4HumOscFridge.frequency.value = 73.42; // D2 - the fridge note
        const gainFridge = lk4HumCtx.createGain();
        gainFridge.gain.value = 0.55;
        lk4HumOscFridge.connect(gainFridge);
        gainFridge.connect(masterGain);

        lk4HumOscRoom = lk4HumCtx.createOscillator();
        lk4HumOscRoom.type = 'sine';
        lk4HumOscRoom.frequency.value = 110; // A2 - the room presence
        const gainRoom = lk4HumCtx.createGain();
        gainRoom.gain.value = 0.18;
        lk4HumOscRoom.connect(gainRoom);
        gainRoom.connect(masterGain);

        const bufferSize = 2 * lk4HumCtx.sampleRate;
        const noiseBuffer = lk4HumCtx.createBuffer(1, bufferSize, lk4HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.18;
        }
        lk4HumNoise = lk4HumCtx.createBufferSource();
        lk4HumNoise.buffer = noiseBuffer;
        lk4HumNoise.loop = true;
        const noiseFilter = lk4HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 200;
        const noiseGain = lk4HumCtx.createGain();
        noiseGain.gain.value = 0.10;
        lk4HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        lk4HumLfo = lk4HumCtx.createOscillator();
        lk4HumLfo.type = 'sine';
        lk4HumLfo.frequency.value = 1 / 40;
        const lfoDepth = lk4HumCtx.createGain();
        lfoDepth.gain.value = 0.0010;
        lk4HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        lk4HumOscFridge.start();
        lk4HumOscRoom.start();
        lk4HumNoise.start();
        lk4HumLfo.start();
        if (lk4HumCtx.state === 'suspended') lk4HumCtx.resume();
    } catch (_) {
        lk4HumCtx = null;
        lk4HumOscFridge = null;
        lk4HumOscRoom = null;
        lk4HumNoise = null;
        lk4HumLfo = null;
    }
}

function stopLivingKitchenPad() {
    try {
        lk4HumOscFridge?.stop();
        lk4HumOscRoom?.stop();
        lk4HumNoise?.stop();
        lk4HumLfo?.stop();
        lk4HumCtx?.close?.();
    } catch (_) {}
    lk4HumOscFridge = null;
    lk4HumOscRoom = null;
    lk4HumNoise = null;
    lk4HumLfo = null;
    lk4HumCtx = null;
}

// quiet relay-style channel-change pop, dry and short
function playLivingKitchenChannelTick() {
    if (!lk4HumCtx) return;
    try {
        const now = lk4HumCtx.currentTime;
        const dur = 0.045;
        const osc = lk4HumCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + dur);
        const g = lk4HumCtx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.04, now + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g);
        g.connect(lk4HumCtx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
    } catch (_) {}
}

// nudge an item and snap it back to identity (like the other apt4 vignettes)
function nudgeAndResetLivingKitchen(svgDoc, groupId, dx, dy) {
    if (!svgDoc || !groupId) return;
    const g = svgDoc.getElementById(groupId);
    if (!g) return;
    g.style.transition = 'transform 220ms ease-out';
    g.style.transform = `translate(${dx || 0}px, ${dy || 0}px)`;
    setTimeout(() => {
        g.style.transition = 'transform 0s';
        g.style.transform = 'translate(0px, 0px)';
        setTimeout(() => { g.style.transition = ''; }, 30);
    }, 360);
}

// hit-id -> group to nudge on click. the moka pot, mug, canister, pillow
// each respond smoothly but quietly.
const lk4NudgeMap = {
    'hit-canister': { groupId: 'lk4-canister-art', dx: -2 },
    'hit-moka':     { groupId: 'lk4-moka-art',     dx:  0, dy: -1 },
    'hit-mug':      { groupId: 'lk4-mug-art',      dx:  2 },
    'hit-pillow':   { groupId: 'lk4-pillow-art',   dx:  2, dy: -1 },
    'hit-couch':    { groupId: 'lk4-couch-art',    dx:  0, dy: -1 }
};

function setupLivingKitchenMemorySvgRuntime() {
    const roomObject = document.getElementById('livingkitchen-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.lk4Bound === 'true') {
            scheduleLivingKitchenSurfacing();
            return;
        }

        const tipEl = document.getElementById('livingkitchen-memory-tip');
        const defaultTip = 'hover and click to remember. the television holds each broadcast still. the fridge hum never wavers. nothing here moves.';

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
            }, 760);
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
                    if (!document.getElementById('livingkitchen-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 4200);
                pendingTipTimer = null;
            }, 660);
        };
        svgRoot._lk4SetTipSurfacing = setTipSurfacing;

        // TV channel rotation state - the broadcast LOCKS for a beat
        let tvChannelIdx = 0;
        let tvLocked = false;
        const showChannel = (idx) => {
            lk4Channels.forEach((ch, i) => {
                const g = svgDoc.getElementById(ch.id);
                if (!g) return;
                g.style.display = (i === idx) ? '' : 'none';
            });
        };
        // ensure default channel is visible at bind time
        showChannel(tvChannelIdx);

        Object.entries(lk4MemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => setTipSlow(hoverText));
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();

                // the TV is its own special interaction
                if (hotspotId === 'hit-tv') {
                    if (tvLocked) {
                        // broadcast is still frozen briefly. honor the dwell.
                        return;
                    }
                    tvLocked = true;
                    tvChannelIdx = (tvChannelIdx + 1) % lk4Channels.length;
                    showChannel(tvChannelIdx);
                    playLivingKitchenChannelTick();
                    setTipImmediate(lk4Channels[tvChannelIdx].caption);
                    setTimeout(() => { tvLocked = false; }, 1400);
                    return;
                }

                const fragment = lk4MemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
                const nudge = lk4NudgeMap[hotspotId];
                if (nudge) nudgeAndResetLivingKitchen(svgDoc, nudge.groupId, nudge.dx, nudge.dy);
            });
        });

        svgRoot.dataset.lk4Bound = 'true';
        scheduleLivingKitchenSurfacing();
    };

    if (!roomObject.dataset.lk4LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.lk4LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 30-44 seconds while the vignette is open
function scheduleLivingKitchenSurfacing() {
    if (lk4SurfacingTimerId) clearTimeout(lk4SurfacingTimerId);
    const overlay = document.getElementById('livingkitchen-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 30000 + Math.floor(Math.random() * 14000);
    lk4SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('livingkitchen-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('livingkitchen-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = lk4SurfacingFragments[Math.floor(Math.random() * lk4SurfacingFragments.length)];
        if (svgRoot?._lk4SetTipSurfacing) {
            svgRoot._lk4SetTipSurfacing(fragment);
        }
        scheduleLivingKitchenSurfacing();
    }, wait);
}

const livingkitchenMemoryCloseBtn = document.getElementById('livingkitchen-memory-close');
if (livingkitchenMemoryCloseBtn) livingkitchenMemoryCloseBtn.addEventListener('click', closeLivingKitchenMemory);

// ============================================================
// Front Closet Memory Vignette (apartment four)
// the final threshold preserved.
// signature behaviors:
//   - the door is ajar by a sliver; clicking the door does NOT open or close
//     it (it only ticks against the jamb and settles back). the gap is fixed.
//   - the hallway through the gap never changes - no light flicker, no
//     opposing-door movement, no walker.
//   - one hanger between the coats is EMPTY; surfacing fragments occasionally
//     remind you of the coat that was taken.
// ============================================================

const frontclosetMemoryHoverTips = {
    'hit-wall':           'the entryway wall above the door. evenly painted.',
    'hit-floor':          'the entryway floor. swept. no salt, no leaf, no print.',

    'hit-front-door':     'the front door of the apartment. it is ajar by a sliver.',
    'hit-door-handle':    'the door handle. brushed nickel. cool to the touch.',
    'hit-hallway':        'the hallway beyond the door. a warm wall sconce. an opposite door. no one passing.',

    'hit-keys':           'a set of keys on a wall hook. a brass key, a silver key, a small ring.',

    'hit-shelf':          'the closet top shelf. clean board. two things on it.',
    'hit-hatbox':         'a hat box on the shelf. lid down. ribbon tied.',
    'hit-scarf':          'a folded scarf on the shelf. dusty rose. fringe on the bottom.',

    'hit-coat-charcoal':  'a long charcoal overcoat on the rod. the longest coat in the row.',
    'hit-coat-tan':       'a tan trench coat. belt threaded. brass buckle.',
    'hit-coat-empty':     'an empty hanger between the coats. nothing hanging from it.',
    'hit-coat-black':     'a black blazer. two buttons. lapels straight.',

    'hit-mat':            'a pale runner along the closet floor. corners aligned to the back wall.',
    'hit-shoes-1':        'a pair of charcoal ankle boots. left and right. evenly placed.',
    'hit-shoes-2':        'a pair of brown loafers. seam lines straight.',
    'hit-shoes-3':        'a pair of cream sneakers. laces tied.',
    'hit-shoes-4':        'a pair of black flats. toe boxes side by side.',

    'hit-umbrella':       'a charcoal cane umbrella in the corner of the closet. dry.'
};

const frontclosetMemoryClickFragments = {
    'hit-wall':           'you press a hand to the wall above the door. it is the same temperature as the air. nothing has been hung here.',
    'hit-floor':          'you look at the floor in front of the door. there is no track. no one came in just before you. no one left just before you.',

    'hit-front-door':     'you push the door. it is heavier than you remember. it does not move further open. you let go. it taps lightly against the jamb and settles. the gap is the same width it was.',
    'hit-door-handle':    'you wrap a hand around the handle. it is the temperature of the air. you do not turn it. you would feel the latch if you did.',
    'hit-hallway':        'you look out into the hallway. the sconce is the same warmth it was a minute ago. the opposite door is closed. no one is walking down the hall. no one walks down the hall the entire time you are at the door.',

    'hit-keys':           'you reach for the keys. you do not take them. you bring your hand back. the keys do not swing. they are the same way they were when you came in.',

    'hit-shelf':          'you sweep a hand along the shelf board. it is dust-free. it is the way you arranged it.',
    'hit-hatbox':         'you put two fingers under the lid of the hat box. it lifts a fraction. you let it down again. the ribbon settles in the same position.',
    'hit-scarf':          'you press the scarf flat. it does not unfold. you take your hand away. the fringe sits in the same line at the bottom.',

    'hit-coat-charcoal':  'you put a hand into the coat\u2019s pocket. it is empty. you remember it being heavier when it was being worn. you let go. it returns flat against the wall.',
    'hit-coat-tan':       'you tighten the belt of the trench, then you let it go. it returns to the position it was in. the buckle faces forward.',
    'hit-coat-empty':     'you put a hand on the empty hanger. it is room temperature. you remember the weight that should be on it. it is not on it. it was not on it the last time you stood here either.',
    'hit-coat-black':     'you adjust the lapel of the blazer with one finger. it returns. the lapels are still straight.',

    'hit-mat':            'you press a foot onto the runner. the pile gives a fraction and recovers. there is no print left.',
    'hit-shoes-1':        'you nudge the boots an inch to the left. you take your hand away. they slide back into their position.',
    'hit-shoes-2':        'you turn one loafer. you let go. it returns to facing forward, beside its pair.',
    'hit-shoes-3':        'you tug a lace. it does not loosen. the bow returns to its shape.',
    'hit-shoes-4':        'you slide one flat outward. you let go. it slides back into its position next to its pair.',

    'hit-umbrella':       'you lift the umbrella by the cane. the canopy is dry. you set it back. it leans into the same corner at the same angle.'
};

const frontclosetSurfacingFragments = [
    'the door is still ajar by the same sliver. the warm hall light has gotten gentler for a moment, then back.',
    'the hallway beyond the door has not produced anyone.',
    'the sconce in the hallway has not warmed. it does have a little more glow at the top of the wall than before.',
    'the keys have not moved from the hook.',
    'the empty hanger between the coats has stayed empty.',
    'every shoe is still aligned with its pair.',
    'the umbrella is still leaning at the same angle.',
    'the runner has not picked up a print the entire time you have been here.',
    'the small clock on the wall says one time. the kitchen, somewhere on the other side of the apartment, has its own.',
    'a faint fridge hum from far inside the apartment. it is the longest-lived sound in here.',
    'the room remains a final threshold. it is being preserved, tenderly.',
    'one of the coats is missing. it has been missing the whole time. you knew that when you came in.'
];

// nudge map - which group to translate on click
const frontclosetNudgeMap = {
    'hit-front-door':    { groupId: 'fc4-door-art',          dx:  1, dy:  0 },
    'hit-door-handle':   { groupId: 'fc4-door-art',          dx:  1, dy:  0 },
    'hit-keys':          { groupId: 'fc4-keys-art',          dx:  0, dy:  1 },
    'hit-hatbox':        { groupId: 'fc4-hatbox-art',        dx:  0, dy: -1 },
    'hit-scarf':         { groupId: 'fc4-scarf-art',         dx:  1, dy:  0 },
    'hit-coat-charcoal': { groupId: 'fc4-coat-charcoal-art', dx: -1, dy:  0 },
    'hit-coat-tan':      { groupId: 'fc4-coat-tan-art',      dx:  1, dy:  0 },
    'hit-coat-empty':    { groupId: 'fc4-coat-empty-art',    dx:  0, dy:  1 },
    'hit-coat-black':    { groupId: 'fc4-coat-black-art',    dx:  1, dy:  0 },
    'hit-shoes-1':       { groupId: 'fc4-shoes-1-art',       dx: -1 },
    'hit-shoes-2':       { groupId: 'fc4-shoes-2-art',       dx:  1 },
    'hit-shoes-3':       { groupId: 'fc4-shoes-3-art',       dx: -1 },
    'hit-shoes-4':       { groupId: 'fc4-shoes-4-art',       dx:  1 },
    'hit-umbrella':      { groupId: 'fc4-umbrella-art',      dx: -1, dy:  0 }
};

let fc4HumCtx = null;
let fc4HumOscRoom = null;
let fc4HumNoise = null;
let fc4HumLfo = null;
let fc4SurfacingTimerId = null;

function openFrontClosetMemory() {
    const roomObject = document.getElementById('frontcloset-memory-svg');
    if (roomObject) {
        const raw = roomObject.getAttribute('data') || '';
        const base = raw.replace(/[?#].*/, '');
        const url = `${base}?cb=${Date.now()}`;
        roomObject.setAttribute('data', url);
        roomObject.data = url;
    }

    const overlay = document.getElementById('frontcloset-memory-overlay');
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    const tip = document.getElementById('frontcloset-memory-tip');
    if (tip) tip.textContent = 'hover and click to remember. the front door is ajar by a sliver. the hallway beyond it does not change. one hanger is empty.';
    startFrontClosetPad();
    setupFrontClosetMemorySvgRuntime();
}

function closeFrontClosetMemory() {
    const overlay = document.getElementById('frontcloset-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    if (fc4SurfacingTimerId) {
        clearTimeout(fc4SurfacingTimerId);
        fc4SurfacingTimerId = null;
    }
    stopFrontClosetPad();
}

// distant-hallway tone:
// - very low E2 sine (the room hum)
// - VERY low-passed warm noise (the building's air far away, behind the door)
// - very slow LFO (~46s period) - the hallway exhales gently. light still
//   stays apparently constant; the air on the other side of the door breathes.
function startFrontClosetPad() {
    stopFrontClosetPad();
    try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        fc4HumCtx = new Ctx();

        const masterGain = fc4HumCtx.createGain();
        masterGain.gain.value = 0.0085;
        masterGain.connect(fc4HumCtx.destination);

        fc4HumOscRoom = fc4HumCtx.createOscillator();
        fc4HumOscRoom.type = 'sine';
        fc4HumOscRoom.frequency.value = 82.41; // E2
        const gainRoom = fc4HumCtx.createGain();
        gainRoom.gain.value = 0.55;
        fc4HumOscRoom.connect(gainRoom);
        gainRoom.connect(masterGain);

        const bufferSize = 2 * fc4HumCtx.sampleRate;
        const noiseBuffer = fc4HumCtx.createBuffer(1, bufferSize, fc4HumCtx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.20;
        }
        fc4HumNoise = fc4HumCtx.createBufferSource();
        fc4HumNoise.buffer = noiseBuffer;
        fc4HumNoise.loop = true;
        const noiseFilter = fc4HumCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 130; // very dark - "distant" feel
        const noiseGain = fc4HumCtx.createGain();
        noiseGain.gain.value = 0.12;
        fc4HumNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(masterGain);

        fc4HumLfo = fc4HumCtx.createOscillator();
        fc4HumLfo.type = 'sine';
        fc4HumLfo.frequency.value = 1 / 46;
        const lfoDepth = fc4HumCtx.createGain();
        lfoDepth.gain.value = 0.0009;
        fc4HumLfo.connect(lfoDepth);
        lfoDepth.connect(masterGain.gain);

        fc4HumOscRoom.start();
        fc4HumNoise.start();
        fc4HumLfo.start();
        if (fc4HumCtx.state === 'suspended') fc4HumCtx.resume();
    } catch (_) {
        fc4HumCtx = null;
        fc4HumOscRoom = null;
        fc4HumNoise = null;
        fc4HumLfo = null;
    }
}

function stopFrontClosetPad() {
    try {
        fc4HumOscRoom?.stop();
        fc4HumNoise?.stop();
        fc4HumLfo?.stop();
        fc4HumCtx?.close?.();
    } catch (_) {}
    fc4HumOscRoom = null;
    fc4HumNoise = null;
    fc4HumLfo = null;
    fc4HumCtx = null;
}

// soft door-against-jamb tick: dry, low, brief
function playFrontClosetDoorTick() {
    if (!fc4HumCtx) return;
    try {
        const now = fc4HumCtx.currentTime;
        const dur = 0.07;
        const osc = fc4HumCtx.createOscillator();
        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(96, now + dur);
        const g = fc4HumCtx.createGain();
        g.gain.setValueAtTime(0.0001, now);
        g.gain.exponentialRampToValueAtTime(0.04, now + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(g);
        g.connect(fc4HumCtx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.02);
    } catch (_) {}
}

// soft fabric/leather settle for non-door clicks
function playFrontClosetSettle() {
    if (!fc4HumCtx) return;
    try {
        const now = fc4HumCtx.currentTime;
        const dur = 0.18;
        const buf = fc4HumCtx.createBuffer(1, Math.floor(fc4HumCtx.sampleRate * dur), fc4HumCtx.sampleRate);
        const ch = buf.getChannelData(0);
        for (let i = 0; i < ch.length; i++) {
            const t = i / ch.length;
            const env = Math.sin(Math.PI * t) * (0.55 + 0.35 * Math.sin(t * 18));
            ch[i] = (Math.random() * 2 - 1) * env * 0.45;
        }
        const src = fc4HumCtx.createBufferSource();
        src.buffer = buf;
        const bp = fc4HumCtx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 1100;
        bp.Q.value = 0.7;
        const g = fc4HumCtx.createGain();
        g.gain.value = 0.025;
        src.connect(bp);
        bp.connect(g);
        g.connect(fc4HumCtx.destination);
        src.start(now);
        src.stop(now + dur + 0.05);
    } catch (_) {}
}

// nudge an item and snap it back to identity
function nudgeAndResetFrontCloset(svgDoc, groupId, dx, dy) {
    if (!svgDoc || !groupId) return;
    const g = svgDoc.getElementById(groupId);
    if (!g) return;
    g.style.transition = 'transform 220ms ease-out';
    g.style.transform = `translate(${dx || 0}px, ${dy || 0}px)`;
    setTimeout(() => {
        g.style.transition = 'transform 0s';
        g.style.transform = 'translate(0px, 0px)';
        setTimeout(() => { g.style.transition = ''; }, 30);
    }, 360);
}

function setupFrontClosetMemorySvgRuntime() {
    const roomObject = document.getElementById('frontcloset-memory-svg');
    if (!roomObject) return;

    const bind = () => {
        const svgDoc = roomObject.contentDocument;
        if (!svgDoc) return;
        const svgRoot = svgDoc.documentElement;
        if (!svgRoot) return;

        if (svgRoot.dataset.fc4Bound === 'true') {
            scheduleFrontClosetSurfacing();
            return;
        }

        const tipEl = document.getElementById('frontcloset-memory-tip');
        const defaultTip = 'hover and click to remember. the front door is ajar by a sliver. the hallway beyond it does not change. one hanger is empty.';

        let pendingTipTimer = null;
        // delayed-precision tip transitions
        const setTipSlow = (text) => {
            if (!tipEl) return;
            if (pendingTipTimer) { clearTimeout(pendingTipTimer); pendingTipTimer = null; }
            tipEl.classList.remove('surfacing');
            tipEl.classList.add('fading');
            pendingTipTimer = setTimeout(() => {
                tipEl.textContent = text;
                tipEl.classList.remove('fading');
                pendingTipTimer = null;
            }, 780);
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
                    if (!document.getElementById('frontcloset-memory-overlay')?.classList.contains('active')) return;
                    setTipSlow(defaultTip);
                }, 4200);
                pendingTipTimer = null;
            }, 660);
        };
        svgRoot._fc4SetTipSurfacing = setTipSurfacing;

        Object.entries(frontclosetMemoryHoverTips).forEach(([hotspotId, hoverText]) => {
            const hotspot = svgDoc.getElementById(hotspotId);
            if (!hotspot) return;
            hotspot.style.cursor = 'pointer';

            hotspot.addEventListener('mouseenter', () => setTipSlow(hoverText));
            hotspot.addEventListener('mouseleave', () => setTipSlow(defaultTip));

            hotspot.addEventListener('click', (event) => {
                event.stopPropagation();
                const fragment = frontclosetMemoryClickFragments[hotspotId];
                if (fragment) setTipImmediate(fragment);
                const nudge = frontclosetNudgeMap[hotspotId];
                if (nudge) nudgeAndResetFrontCloset(svgDoc, nudge.groupId, nudge.dx, nudge.dy);

                // door + handle get the door tick; everything else gets the soft settle
                if (hotspotId === 'hit-front-door' || hotspotId === 'hit-door-handle') {
                    playFrontClosetDoorTick();
                } else if (nudge) {
                    playFrontClosetSettle();
                }
            });
        });

        svgRoot.dataset.fc4Bound = 'true';
        scheduleFrontClosetSurfacing();
    };

    if (!roomObject.dataset.fc4LoadHooked) {
        roomObject.addEventListener('load', bind);
        roomObject.dataset.fc4LoadHooked = 'true';
    }
    bind();
}

// surface a hidden fragment every 30-44 seconds while the vignette is open
function scheduleFrontClosetSurfacing() {
    if (fc4SurfacingTimerId) clearTimeout(fc4SurfacingTimerId);
    const overlay = document.getElementById('frontcloset-memory-overlay');
    if (!overlay || !overlay.classList.contains('active')) return;
    const wait = 30000 + Math.floor(Math.random() * 14000);
    fc4SurfacingTimerId = setTimeout(() => {
        const overlayNow = document.getElementById('frontcloset-memory-overlay');
        if (!overlayNow || !overlayNow.classList.contains('active')) return;
        const roomObject = document.getElementById('frontcloset-memory-svg');
        const svgDoc = roomObject?.contentDocument;
        const svgRoot = svgDoc?.documentElement;
        const fragment = frontclosetSurfacingFragments[Math.floor(Math.random() * frontclosetSurfacingFragments.length)];
        if (svgRoot?._fc4SetTipSurfacing) {
            svgRoot._fc4SetTipSurfacing(fragment);
        }
        scheduleFrontClosetSurfacing();
    }, wait);
}

const frontclosetMemoryCloseBtn = document.getElementById('frontcloset-memory-close');
if (frontclosetMemoryCloseBtn) frontclosetMemoryCloseBtn.addEventListener('click', closeFrontClosetMemory);
