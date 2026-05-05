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
                window.location.href = 'https://danielaaaas.github.io/unhogartemporal/aptdos/apttres/aptcuatro/index.html';
            }, 1500);
        };

        // if no, remain on the page...nothing fancy ( sparkles would be nice though )
        document.getElementById('note-no').onclick = () => {
            note.classList.remove('visible');
            noteOverlay.classList.remove('visible');
        };
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
  if (e.key === 'Escape') closeNotebook();
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