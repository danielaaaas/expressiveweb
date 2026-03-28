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
    'master-bedroom': {
        title: 'master bedroom',
        text: 'to be added.'
    },

    'main-hallway': {
        title: 'main hallway',
        text: 'to be added.'
    },

    'bedroom-closet': {
        title: 'bedroom closet',
        text: 'to be added.'
    },

    'hallway-closet': {
        title: 'hallway closet',
        text: 'to be added.'
    },

    'bathroom': {
        title: 'bathroom',
        text: 'to be added.'
    },

    'living-room': {
        title: 'living room',
        text: 'to be added.'
    },

    'kitchen': {
        title: 'kitchen',
        text: 'to be added.'
    },

    'front-closet': {
        title: 'front closet',
        text: 'to be added.'
    },

    'front-hallway': {
        title: 'front hallway',
        text: 'to be added.'
    }
};

// localStorage so rooms visited can be tracked
// const visited = JSON.parse(localStorage.getItem('visited-apt1') || '{}');
const visited = {};

// so that rooms you visited can be colored...might be obsolete when i do the pixel overlay
Object.keys(visited).forEach(id => {
  const el = document.getElementById(id);
  if (el) el.classList.add('visited');
});

// click listener for rooms
document.querySelectorAll('.room').forEach(room => {
  room.addEventListener('click', () => {
    const id = room.id;

    // bedroom closet should lead to apartment numero dos
    if (id === 'bedroom-closet') {
        const door = document.getElementById('door-transition');
        door.classList.add('active');
        setTimeout(() => {
            window.location.href = 'https://danielaaaas.github.io/unhogartemporal/apartmentdos/index.html';
            }, 1500);
    return;
}

    const data = rooms[id];
    if (!data) return;

    // this will mark a room as visited
    visited[id] = true;
    // localStorage.setItem('visited-apt1', JSON.stringify(visited));
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