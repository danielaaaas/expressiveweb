/**
 * Apartment one only (loaded from index.html).
 * “Return” progression: after the full loop back from el cuarto hogar, the first home remembers — warmer plan + lamp glow + one whisper line (once).
 *
 * Storage keys (real path):
 *   uht-arriving-from-fourth-home — one-shot set in aptcuatro before navigating here
 *   uht-home-remembers — persistent after that arrival
 *   uht-first-return-whisper-done — persistent after the whisper is shown once
 *
 * Professor / rehearsal preview (does not write those keys):
 *   Open apartment one with ?demo=return  (e.g. …/index.html?demo=return )
 */
(function initReturnHome() {
  const aptOneShell = document.getElementById('apartment-one');
  if (!aptOneShell) return;

  const params = new URLSearchParams(window.location.search);
  const demoReturn = params.get('demo') === 'return';

  let arrivingFromFourth = false;
  try {
    arrivingFromFourth = localStorage.getItem('uht-arriving-from-fourth-home') === '1';
    if (arrivingFromFourth) {
      localStorage.removeItem('uht-arriving-from-fourth-home');
    }
  } catch (_err) {
    /* ignore */
  }

  if (arrivingFromFourth) {
    try {
      localStorage.setItem('uht-home-remembers', '1');
    } catch (_err) {
      /* ignore */
    }
  }

  let homeRemembers = false;
  try {
    homeRemembers = localStorage.getItem('uht-home-remembers') === '1';
  } catch (_err) {
    /* ignore */
  }

  if (homeRemembers) {
    document.body.classList.add('home-remembers');
  }

  if (demoReturn) {
    document.body.classList.add('demo-return');
  }

  if (!homeRemembers && !demoReturn) {
    return;
  }

  let whisperDone = false;
  if (homeRemembers && !demoReturn) {
    try {
      whisperDone = localStorage.getItem('uht-first-return-whisper-done') === '1';
    } catch (_err) {
      /* ignore */
    }
    if (whisperDone) {
      return;
    }
  }

  if (document.querySelector('.return-whisper')) {
    return;
  }

  const whisperText =
    'something in the walls still carries the shape of your light.';

  const h1 = document.querySelector('body.apt-one > h1');
  if (!h1) return;

  const whisper = document.createElement('p');
  whisper.className = 'return-whisper';
  whisper.textContent = whisperText;
  h1.insertAdjacentElement('afterend', whisper);

  if (demoReturn) {
    const hint = document.createElement('p');
    hint.className = 'return-demo-hint';
    hint.textContent = 'Demonstration preview (?demo=return — not saved as real progress)';
    whisper.insertAdjacentElement('afterend', hint);
  } else {
    try {
      localStorage.setItem('uht-first-return-whisper-done', '1');
    } catch (_err) {
      /* ignore */
    }
  }
})();
