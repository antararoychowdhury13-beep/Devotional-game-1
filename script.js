// Toast helper
function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.querySelector('.phone').appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 1800);
}

// Waveform bars (static decorative pattern, animated when playing)
const waveform = document.getElementById('waveform');
const barCount = 40;
const pattern = [];
for (let i = 0; i < barCount; i++) {
  const norm = Math.sin(i * 0.5) * 0.5 + Math.sin(i * 0.27) * 0.3 + Math.random() * 0.2;
  const h = 4 + Math.abs(norm) * 22;
  pattern.push(h);
  const bar = document.createElement('div');
  bar.className = 'bar';
  bar.style.height = h + 'px';
  waveform.appendChild(bar);
}

// Play / pause
let playing = false;
let animFrame = null;
const playBtn = document.getElementById('playBtn');
playBtn.addEventListener('click', () => {
  playing = !playing;
  playBtn.classList.toggle('playing', playing);
  if (playing) {
    animateWave();
    showToast('Playing mantra · Om Gam Ganapataye Namah');
  } else {
    cancelAnimationFrame(animFrame);
    document.querySelectorAll('.waveform .bar').forEach((b, i) => {
      b.style.height = pattern[i] + 'px';
    });
  }
});

function animateWave() {
  const t = Date.now() / 200;
  document.querySelectorAll('.waveform .bar').forEach((b, i) => {
    const base = pattern[i];
    const offset = Math.sin(t + i * 0.4) * 6;
    b.style.height = Math.max(3, base + offset) + 'px';
  });
  animFrame = requestAnimationFrame(animateWave);
}

// Chant counter
let chant = 108;
const chantEl = document.getElementById('chantCount');
document.querySelector('.widget.chant').addEventListener('click', () => {
  chant++;
  chantEl.textContent = chant;
  chantEl.animate(
    [{ transform: 'scale(1)' }, { transform: 'scale(1.18)' }, { transform: 'scale(1)' }],
    { duration: 280 }
  );
});

// Progress tracking
let completed = 0;
const totalSteps = 5;
const progressEl = document.getElementById('progressPercent');

function updateProgress() {
  const pct = Math.round((completed / totalSteps) * 100);
  progressEl.textContent = pct + '%';
}

// Step expand / start
document.querySelectorAll('.step-item').forEach(item => {
  item.addEventListener('click', (e) => {
    if (item.classList.contains('locked')) {
      showToast('Complete the previous step to unlock');
      return;
    }
    document.querySelectorAll('.step-item').forEach(s => s.classList.remove('expanded'));
    item.classList.add('expanded');
  });
});

// Why this step
document.querySelectorAll('.why-btn').forEach(b => {
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    showToast('Sankalpa sets your intention — the seed of your puja.');
  });
});

// Stepper navigation
document.querySelectorAll('.stepper .step').forEach(s => {
  s.addEventListener('click', () => {
    document.querySelectorAll('.stepper .step').forEach(x => x.classList.remove('active'));
    s.classList.add('active');
    const labels = ['Select Deity', 'Puja Setup', 'Ritual Steps', 'Mantras', 'Aarti & Closing'];
    showToast(labels[parseInt(s.dataset.step) - 1]);
  });
});

// CTA - start step
const startBtn = document.getElementById('startStepBtn');
const stepOrder = [
  { title: 'Sankalpa (Intention)', dur: 3000 },
  { title: 'Awahana (Invocation)', dur: 3000 },
  { title: 'Asana & Padhya', dur: 3000 },
  { title: 'Snana (Abhishekam)', dur: 3000 },
  { title: 'Alankara (Decoration)', dur: 3000 }
];
let currentStep = 1;

function refreshCTA() {
  if (currentStep > totalSteps) {
    startBtn.querySelector('strong').textContent = 'All Steps Complete';
    startBtn.querySelector('small').textContent = 'Proceed to Mantras';
    return;
  }
  const s = stepOrder[currentStep - 1];
  startBtn.querySelector('strong').textContent = `Start Step ${currentStep}`;
  startBtn.querySelector('small').textContent = s.title;
}

startBtn.addEventListener('click', () => {
  if (currentStep > totalSteps) {
    showToast('Move on to Mantras step');
    return;
  }
  const item = document.querySelector(`[data-step-item="${currentStep}"]`);
  showToast(`Beginning: ${stepOrder[currentStep - 1].title}`);

  setTimeout(() => {
    if (item) {
      item.classList.remove('locked', 'expanded');
      item.style.opacity = '0.6';
      const num = item.querySelector('.step-num');
      if (num) {
        num.innerHTML = '✓';
        num.classList.remove('small');
      }
      const lock = item.querySelector('.lock');
      if (lock) lock.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 12l5 5L20 7" fill="none" stroke="#2a8a4a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
    completed = Math.min(completed + 1, totalSteps);
    updateProgress();
    currentStep++;

    // unlock and expand next
    const next = document.querySelector(`[data-step-item="${currentStep}"]`);
    if (next) {
      next.classList.remove('locked');
      document.querySelectorAll('.step-item').forEach(s => s.classList.remove('expanded'));
      next.classList.add('expanded');
      next.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    refreshCTA();
  }, 600);
});

// Back button
document.querySelector('.back').addEventListener('click', () => showToast('Going back…'));

// Bell
document.querySelector('.bell').addEventListener('click', () => {
  showToast('No new notifications');
  document.querySelector('.bell .dot').style.display = 'none';
});

// Bottom nav
document.querySelectorAll('.nav-item').forEach(n => {
  n.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(x => x.classList.remove('active'));
    n.classList.add('active');
    const labels = { mandir: 'Mandir', sadhana: 'Sadhana', puja: 'Puja', seek: 'Seek', myspace: 'My Space' };
    showToast(labels[n.dataset.nav] || '');
  });
});

// View all
document.querySelector('.view-all').addEventListener('click', () => {
  showToast('Showing all 16 ritual steps');
});

updateProgress();
