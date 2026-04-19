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

const visited = {};

Object.keys(visited).forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.classList.add('visited');
});

// click listener for rooms
document.querySelectorAll('.room').forEach(room => {
  room.addEventListener('click', () => {
    const id = room.id;

    // bedroom closet should lead to apartment numero tres
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
                window.location.href = 'https://danielaaaas.github.io/unhogartemporal/aptdos/apttres/index.html';
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

    // only typewrite if notebook isn't already showing this room
        if (document.getElementById('notebook-title').textContent !== data.title) {
            typeWriter(data.text, 'notebook-text');
            } else {
            document.getElementById('notebook-text').textContent = data.text;
        }

    // opens the notebook 
    document.getElementById('notebook-title').textContent = data.title;
    // typeWriter(data.text, 'notebook-text');
    document.getElementById('notebook').classList.add('open');
    document.getElementById('overlay').classList.add('active');
  });
});

// closes the notebook
function closeNotebook() {
    document.getElementById('notebook').classList.remove('open');
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