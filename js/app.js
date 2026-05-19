/* APP.JS — Router SPA, Dark Mode, LocalStorage, Chat Overlay*/

window.AppState = {
  user: {
    name:'', email:'', role:'user', gender:'male',
    level:1, xp:0, xpToNext:1000, streak:0,
    goal:'', levelName:'', location:'',
    emailVerified:false, pendingVerificationEmail:'',
    cycleOptIn:false, lastCycleDate:null,
    daysPerWeek:'', areas:[],
    height:'', weight:'', age:'', bio:'',
  },
  fromRegisterFlow: false,
  currentScreen: 'welcome',
  testUsers: [
    { email:'demo@olympus.com',  password:'Demo1234',  name:'Demo User',     role:'user'  },
    { email:'admin@olympus.com', password:'Admin1234', name:'Admin Olympus', role:'admin' },
  ],
};

window.screens = {};

// ========================================================
// OLYMPUS SECURITY — Session Token Utils
// ========================================================
function generateSessionToken(userEmail) {
  const payload = {
    sub: userEmail,
    iat: Date.now(),
    exp: Date.now() + (2 * 60 * 60 * 1000), // expira en 2 horas
    jti: (typeof crypto.randomUUID === 'function')
      ? crypto.randomUUID()
      : (Date.now().toString(36) + Math.random().toString(36).slice(2))
  };
  return btoa(JSON.stringify(payload));
}

function isTokenValid(token, userEmail) {
  try {
    const p = JSON.parse(atob(token));
    if (!p || p.sub !== userEmail) return false;
    if (p.exp < Date.now()) return false;
    return true;
  } catch { return false; }
}

/*Dark Mode*/
window.toggleDarkMode = function() {
  const curr = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = curr === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('olympus_theme', next);
};
window.isDarkMode = function() {
  return (document.documentElement.getAttribute('data-theme') || 'dark') === 'dark';
};

/*Pantallas donde el FAB global es visible */
const _FAB_SCREENS = [
  'dashboard','train','progress','challenges','profile',
  'notif-history','notifications-settings','watches','preferences',
  'privacy-data','change-password','my-data','app-permissions',
  'help-support','help-center','report-problem','edit-profile',
  'manual-routine','active-workout','chat'
];

/*Router*/
function navigateTo(screenName) {
  const container = document.getElementById('screen-container');
  const nav       = document.getElementById('bottom-nav');
  const screen    = window.screens[screenName];
  if (!screen) {
    console.error(`❌ Pantalla "${screenName}" no encontrada. Registradas:`, Object.keys(window.screens));
    return;
  }
  window.AppState.currentScreen = screenName;
  container.innerHTML = screen.render();
  container.scrollTop = 0;

  const navScreens = ['dashboard','train','progress','challenges','profile'];
  if (navScreens.includes(screenName)) {
    nav.hidden = false;
    nav.classList.remove('hidden');
    updateNavActive(screenName);
  } else {
    nav.hidden = true;
    nav.classList.add('hidden');
  }

  if (window.lucide) lucide.createIcons();
  if (screen.init) requestAnimationFrame(() => screen.init());

  /*FAB global: mostrar/ocultar según pantalla*/
  const globalFab = document.getElementById('global-ai-fab');
  if (globalFab) {
    const _fabScreens = [
      'dashboard','train','progress','challenges','profile',
      'notif-history','notifications-settings','watches','preferences',
      'privacy-data','change-password','my-data','app-permissions',
      'help-support','help-center','report-problem','edit-profile',
      'manual-routine','active-workout','chat'
    ];
    globalFab.style.display = _fabScreens.includes(screenName) ? 'flex' : 'none';
    if (window.lucide) lucide.createIcons();
  }

  requestAnimationFrame(() => {
    window._updateGlobalFabPos && window._updateGlobalFabPos();
  });
  window._startLiveUpdates && window._startLiveUpdates();
}

function updateNavActive(name) {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.route === name);
  });
}

/*Chat Overlay*/
window._openChat = function() {
  const overlay = document.getElementById('chat-overlay');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  overlay.style.display = 'flex';
  const msgsEl = document.getElementById('chat-msgs');
  if (msgsEl && window._renderChatMsgs) {
    msgsEl.innerHTML = window._renderChatMsgs();
    if (window.lucide) lucide.createIcons();
    msgsEl.scrollTop = msgsEl.scrollHeight;
  }
  setTimeout(() => document.getElementById('chat-input')?.focus(), 300);
};

window._closeChat = function() {
  const overlay = document.getElementById('chat-overlay');
  if (!overlay) return;
  overlay.classList.add('hidden');
  overlay.style.display = 'none';
};

/*Helpers*/
function olympusLogoSVG(size = 40) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="45" stroke="#00f5ff" stroke-width="2" opacity="0.3"/>
    <circle cx="50" cy="50" r="30" stroke="#00f5ff" stroke-width="2.5" opacity="0.6"/>
    <polygon points="50,20 65,45 58,45 68,70 50,50 32,70 42,45 35,45" fill="#00f5ff"/>
    <circle cx="50" cy="50" r="48" stroke="#00f5ff" stroke-width="1" opacity="0.15"/>
  </svg>`;
}
function backgroundHTML() {
  return `<div class="bg-glow bg-glow-top"></div><div class="bg-glow bg-glow-bottom"></div><div class="bg-grid"></div>`;
}
function formatDate() {
  return new Date().toLocaleDateString('es-ES', { weekday:'long', day:'numeric', month:'long' });
}

/*INACTIVIDAD — cierra sesión tras 2 horas sin tocar la app*/
let _inactivityTimer = null;
function _resetInactivity() {
  clearTimeout(_inactivityTimer);
  if (!window.AppState?.user?.emailVerified) return;
  _inactivityTimer = setTimeout(() => {
    alert('Tu sesión fue cerrada automáticamente por 2 horas de inactividad.');
    localStorage.removeItem('olympus_session');
    localStorage.removeItem('olympus_active_tab');
    sessionStorage.removeItem('olympus_tab');
    window.AppState.user = {
      name:'', email:'', role:'user', gender:'male',
      level:1, xp:0, xpToNext:1000, streak:0, emailVerified:false
    };
    navigateTo('welcome');
  }, 2 * 60 * 60 * 1000);
}
['click','keydown','touchstart','scroll','mousemove'].forEach(evt =>
  document.addEventListener(evt, _resetInactivity, { passive: true })
);

/*Posicionar el FAB relativo al borde derecho de #app*/
window._updateGlobalFabPos = function() {
  const fab = document.getElementById('global-ai-fab');
  const app = document.getElementById('app');
  if (!fab || !app) return;
  const rect  = app.getBoundingClientRect();
  const right = window.innerWidth - rect.right + 20;
  fab.style.right  = Math.max(8, right) + 'px';
  fab.style.bottom = '82px';
};
window.addEventListener('resize', window._updateGlobalFabPos);

/*Init*/
document.addEventListener('DOMContentLoaded', () => {

  /* 1. Tema */
  document.documentElement.setAttribute('data-theme',
    localStorage.getItem('olympus_theme') || 'dark');

  /* 2. Cargar usuarios registrados */
  const savedUsers = JSON.parse(localStorage.getItem('olympus_users') || '[]');
  savedUsers.forEach(u => {
    if (!window.AppState.testUsers.some(t => t.email.toLowerCase() === u.email.toLowerCase()))
      window.AppState.testUsers.push(u);
  });

  /* 3. Nav clicks */
  document.querySelectorAll('.nav-item').forEach(item =>
    item.addEventListener('click', () => navigateTo(item.dataset.route))
  );

  /* 4. FAB global → abre chat */
  document.getElementById('global-ai-fab')?.addEventListener('click', () => {
    window._openChat && window._openChat();
  });

  /* 5. Inicializar overlay del chat */
  _initChatOverlay();

  /* 6. Restaurar sesión */
  const savedSession = JSON.parse(localStorage.getItem('olympus_session') || 'null');
  if (savedSession && savedSession.emailVerified && savedSession.name) {
    const myTabToken  = sessionStorage.getItem('olympus_tab');
    const activeToken = localStorage.getItem('olympus_active_tab');

    // ── Token expirado → logout silencioso ──
    if (activeToken && !isTokenValid(activeToken, savedSession.email)) {
      localStorage.removeItem('olympus_session');
      localStorage.removeItem('olympus_active_tab');
      navigateTo('welcome');
    // ── Otra pestaña activa → no restaurar ──
    } else if (activeToken && myTabToken !== activeToken) {
      navigateTo('welcome');
    // ── Misma pestaña o primera carga → restaurar con token fresco ──
    } else {
      const token = generateSessionToken(savedSession.email);
      sessionStorage.setItem('olympus_tab', token);
      localStorage.setItem('olympus_active_tab', token);
      window.AppState.user = { ...window.AppState.user, ...savedSession };
      navigateTo('dashboard');
      _resetInactivity();
    }
  } else {
    navigateTo('welcome');
  }

  /* Sincronizar XP real desde localStorage */
  if (window.OlympusXP && window.AppState.user.email) {
    OlympusXP.sync();
  }

  /* Iniciar actualizaciones en tiempo real */
  window._startLiveUpdates && window._startLiveUpdates();

  /* Posicionar FAB al cargar */
  setTimeout(() => window._updateGlobalFabPos && window._updateGlobalFabPos(), 100);

  /* 7. calcularEdad global */
  window.calcularEdad = function(fechaNacimiento) {
    if (!fechaNacimiento) return null;
    const hoy = new Date(), nac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nac.getFullYear();
    const m = hoy.getMonth() - nac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
    return edad;
  };
});

/*Listeners del chat overlay */
function _initChatOverlay() {
  document.getElementById('chat-close-btn')?.addEventListener('click', window._closeChat);
  document.getElementById('chat-min-btn')?.addEventListener('click', window._closeChat);
  document.getElementById('chat-backdrop')?.addEventListener('click', window._closeChat);

  document.getElementById('chat-mic-btn')?.addEventListener('click', () =>
    alert('Función de voz próximamente 🎙️')
  );

  const send = () => {
    const inp = document.getElementById('chat-input');
    const msg = (inp?.value || '').trim();
    if (!msg) return;
    inp.value = '';
    if (window._sendChatMsg) window._sendChatMsg(msg);
  };
  document.getElementById('chat-send-btn')?.addEventListener('click', send);
  document.getElementById('chat-input')?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  document.querySelectorAll('.chat-chip').forEach(btn =>
    btn.addEventListener('click', () => {
      const inp = document.getElementById('chat-input');
      if (inp) { inp.value = btn.textContent.trim(); send(); }
    })
  );
}

/*OLYMPUS XP*/
window.OlympusXP = {
  _key()    { return `olympus_xp_${window.AppState?.user?.email || 'guest'}`; },
  _session(){ return `olympus_session`; },

  _calcLevel(totalXP) {
    let level = 1;
    let rem   = totalXP;
    while (rem >= level * 1000) { rem -= level * 1000; level++; }
    return { level, xpInLevel: rem, xpToNext: level * 1000 - rem };
  },

  get() {
    return JSON.parse(localStorage.getItem(this._key()) || JSON.stringify(
      { totalXP:0, xp:0, level:1, xpToNext:1000 }
    ));
  },

  sync() {
    if (!window.AppState?.user?.email) return;
    const d = this.get();
    window.AppState.user.xp      = d.xp;
    window.AppState.user.level   = d.level;
    window.AppState.user.xpToNext= d.xpToNext;
    if (window.OlympusStats) {
      const s = OlympusStats.get();
      window.AppState.user.streak = s.racha_actual || 0;
    }
  },

  add(amount, motivo = '') {
    if (!window.AppState?.user?.email) return null;
    const d        = this.get();
    const oldLevel = d.level;
    d.totalXP      = (d.totalXP || 0) + amount;
    const calc     = this._calcLevel(d.totalXP);
    d.xp           = calc.xpInLevel;
    d.level        = calc.level;
    d.xpToNext     = calc.xpToNext;

    localStorage.setItem(this._key(), JSON.stringify(d));

    window.AppState.user.xp       = d.xp;
    window.AppState.user.level    = d.level;
    window.AppState.user.xpToNext = d.xpToNext;
    localStorage.setItem('olympus_session', JSON.stringify(window.AppState.user));

    if (d.level > oldLevel && window.OlympusNotif) {
      OlympusNotif.add(
        `🎉 ¡Subiste al Nivel ${d.level}!`,
        `${motivo} · Nivel ${oldLevel} → Nivel ${d.level}. ¡Sigue así!`,
        'levelup'
      );
    }

    _liveUpdateXPBar();

    return { ...calc, gained: amount, leveledUp: d.level > oldLevel };
  },

  checkStreakBonus(rachaActual) {
    const bonuses = { 3:50, 7:100, 14:200, 30:500 };
    const key     = `olympus_streak_bonus_${window.AppState?.user?.email||'guest'}`;
    const done    = JSON.parse(localStorage.getItem(key)||'[]');
    Object.entries(bonuses).forEach(([dias, xp]) => {
      if (rachaActual >= parseInt(dias) && !done.includes(parseInt(dias))) {
        done.push(parseInt(dias));
        localStorage.setItem(key, JSON.stringify(done));
        this.add(xp, `Racha de ${dias} días`);
        if (window.OlympusNotif)
          OlympusNotif.add(`🔥 Racha de ${dias} días`, `+${xp} XP por mantener tu constancia`, 'streak');
      }
    });
  },
};

/*Actualizar barra XP en tiempo real (sin re-render)*/
function _liveUpdateXPBar() {
  const u      = window.AppState.user;
  const xpPct  = Math.min(100, ((u.xp||0) / (u.xpToNext||1000)) * 100);
  const bar    = document.querySelector('[id="xp-bar-fill"]');
  if (bar) bar.style.width = xpPct + '%';
  const lvTxt  = document.querySelectorAll('[id="xp-level-txt"]');
  lvTxt.forEach(el => { el.textContent = `Nivel ${u.level||1}`; });
  const pBar   = document.querySelector('[id="profile-xp-fill"]');
  if (pBar) pBar.style.width = xpPct + '%';
}

/*Actualización en tiempo real cada 3 segundos*/
window._startLiveUpdates = function() {
  if (window._liveInterval) clearInterval(window._liveInterval);
  window._liveInterval = setInterval(() => {
    const screen = window.AppState.currentScreen;
    if (!screen) return;
    try {
      if (window.OlympusXP) OlympusXP.sync();
      _liveUpdateXPBar();

      if (screen === 'admin-dashboard' || screen === 'admin-usuarios') {
        const totalEl = document.getElementById('adm-live-total');
        if (totalEl && window._getRealStats) {
          const s = _getRealStats();
          totalEl.textContent = s.totalUsers;
        }
      }
    } catch(e) {}
  }, 3000);
};

/*SISTEMA DE NOTIFICACIONES*/
window.OlympusNotif = {
  _key()     { return `olympus_notifs_${window.AppState?.user?.email||'guest'}`; },
  _prefKey() { return `olympus_notif_prefs_${window.AppState?.user?.email||'guest'}`; },

  add(titulo, cuerpo, tipo = 'general') {
    const all = this._load();
    all.push({ id:Date.now(), titulo, cuerpo, tipo,
               fecha:new Date().toISOString(), leida:false });
    localStorage.setItem(this._key(), JSON.stringify(all));
  },

  _load() {
    const raw   = JSON.parse(localStorage.getItem(this._key()) || '[]');
    const corte = new Date();
    corte.setDate(corte.getDate() - 7);
    return raw.filter(n => new Date(n.fecha) > corte);
  },

  getAll()    { return this._load(); },
  getUnread() { return this._load().filter(n => !n.leida); },
  count()     { return this.getUnread().length; },

  markAllRead() {
    const all = this._load().map(n => ({ ...n, leida:true }));
    localStorage.setItem(this._key(), JSON.stringify(all));
  },

  getPrefs() {
    return JSON.parse(localStorage.getItem(this._prefKey()) || JSON.stringify({
      recordatorio_entrenamiento: true,
      resumen_semanal:            true,
      retos_nuevos:               true,
      consejos_nutricion:         false,
    }));
  },
  setPrefs(prefs) { localStorage.setItem(this._prefKey(), JSON.stringify(prefs)); },
  togglePref(key) {
    const p = this.getPrefs(); p[key] = !p[key]; this.setPrefs(p); return p[key];
  },
};

/*Panel de notificaciones*/
window._openNotifPanel = function () {
  OlympusNotif.markAllRead();
  const notifs   = OlympusNotif.getAll().slice(-5).reverse();
  const existing = document.getElementById('notif-panel');
  if (existing) { existing.remove(); return; }

  const panel = document.createElement('div');
  panel.id = 'notif-panel';
  panel.style.cssText = `
    position:fixed;top:0;left:50%;transform:translateX(-50%);
    width:100%;max-width:430px;height:100%;
    background:rgba(0,0,0,.6);backdrop-filter:blur(4px);
    z-index:8000;display:flex;align-items:flex-start;justify-content:center;
    padding-top:60px;`;

  const items = notifs.length
    ? notifs.map(n => `
        <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.06);">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
            <i data-lucide="bell" style="width:13px;height:13px;color:var(--cyan);flex-shrink:0;"></i>
            <p style="font-size:13px;font-weight:600;">${n.titulo}</p>
          </div>
          <p style="font-size:11px;color:#888;padding-left:21px;">${n.cuerpo}</p>
          <p style="font-size:10px;color:#555;padding-left:21px;margin-top:2px;">
            ${new Date(n.fecha).toLocaleDateString('es-ES',{weekday:'short',day:'numeric',month:'short'})}
          </p>
        </div>`).join('')
    : `<p style="text-align:center;color:#888;padding:24px;font-size:13px;">Sin notificaciones nuevas</p>`;

  panel.innerHTML = `
    <div style="width:100%;max-width:390px;background:#0d0d0d;border-radius:16px;overflow:hidden;
      border:1px solid rgba(255,255,255,.1);box-shadow:0 8px 32px rgba(0,0,0,.6);">
      <div style="display:flex;justify-content:space-between;align-items:center;
        padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08);">
        <p style="font-size:15px;font-weight:700;">Notificaciones</p>
        <button id="notif-close" style="background:none;border:none;color:#888;cursor:pointer;font-size:20px;line-height:1;">✕</button>
      </div>
      <div style="max-height:320px;overflow-y:auto;">${items}</div>
      <div style="padding:12px 16px;border-top:1px solid rgba(255,255,255,.06);">
        <button id="notif-history-btn"
          style="width:100%;padding:10px;border-radius:10px;background:rgba(0,245,255,.08);
            border:1px solid rgba(0,245,255,.2);color:var(--cyan,#00f5ff);font-size:13px;
            font-weight:600;cursor:pointer;font-family:inherit;">
          Ver historial de notificaciones
        </button>
      </div>
    </div>`;

  document.body.appendChild(panel);
  if (window.lucide) lucide.createIcons();

  panel.addEventListener('click', e => { if (e.target === panel) panel.remove(); });
  document.getElementById('notif-close').addEventListener('click', () => panel.remove());
  document.getElementById('notif-history-btn').addEventListener('click', () => {
    panel.remove(); navigateTo('notif-history');
  });
};

/*OLYMPUS STATS — Estadísticas reales por usuario*/
window.OlympusStats = {
  _key()    { return `olympus_stats_${window.AppState?.user?.email||'guest'}`; },
  _wKey()   { return `olympus_workouts_${window.AppState?.user?.email||'guest'}`; },
  _ppKey()  { return `olympus_plan_${window.AppState?.user?.email||'guest'}`; },
  _achKey() { return `olympus_ach_${window.AppState?.user?.email||'guest'}`; },
  _chKey()  { return `olympus_ch_${window.AppState?.user?.email||'guest'}`; },
  _timerKey(){ return `olympus_timer_${window.AppState?.user?.email||'guest'}`; },

  get() {
    const freq = parseInt(window.AppState?.user?.daysPerWeek) || 3;
    const def  = {
      total_entrenamientos:0, total_calorias:0, tiempo_total_min:0,
      racha_actual:0, racha_maxima:0, ultimo_entrenamiento:null,
      dias_objetivo_semana:freq, entrenamientos_esta_semana:0, semana_inicio:null,
    };
    const saved = JSON.parse(localStorage.getItem(this._key())||'null');
    return saved ? {...def,...saved, dias_objetivo_semana:freq} : def;
  },
  save(s) { localStorage.setItem(this._key(), JSON.stringify(s)); },
  getWorkouts() { return JSON.parse(localStorage.getItem(this._wKey())||'[]'); },

  _monday(d = new Date()) {
    const day  = d.getDay();
    const diff = d.getDate() - day + (day===0?-6:1);
    const m    = new Date(d); m.setDate(diff);
    return m.toISOString().split('T')[0];
  },

  getTimerPref() { return localStorage.getItem(this._timerKey()) || 'countdown'; },
  setTimerPref(v){ localStorage.setItem(this._timerKey(), v); },

  addWorkout({ rutina_nombre, duracion_min=45, calorias=300, ejercicios=[] }) {
    const s     = this.get();
    const today = new Date().toISOString().split('T')[0];
    const freq  = s.dias_objetivo_semana || 3;
    const maxRest = Math.ceil(7/freq) + 1;

    if (s.ultimo_entrenamiento !== today) {
      s.total_entrenamientos++;
      s.total_calorias   += calorias;
      s.tiempo_total_min += duracion_min;

      if (!s.ultimo_entrenamiento) {
        s.racha_actual = 1;
      } else {
        const dias = Math.floor((new Date(today)-new Date(s.ultimo_entrenamiento))/86400000);
        s.racha_actual = dias <= maxRest ? s.racha_actual + 1 : 1;
      }
      s.racha_maxima = Math.max(s.racha_maxima, s.racha_actual);
      s.ultimo_entrenamiento = today;

      const monday = this._monday();
      if (s.semana_inicio !== monday) {
        s.entrenamientos_esta_semana = 1; s.semana_inicio = monday;
      } else {
        s.entrenamientos_esta_semana++;
      }
    } else {
      s.total_calorias   += calorias;
      s.tiempo_total_min += duracion_min;
    }

    this.save(s);

    const hist = this.getWorkouts();
    hist.push({
      id:Date.now(), fecha:today,
      hora:new Date().toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'}),
      rutina_nombre, duracion_min, calorias, xp_ganado:50, ejercicios
    });
    localStorage.setItem(this._wKey(), JSON.stringify(hist));

    const xp = 50;
    window.AppState.user.xp     = (window.AppState.user.xp||0) + xp;
    window.AppState.user.streak = s.racha_actual;
    const lv = Math.max(1, Math.floor(window.AppState.user.xp/1000)+1);
    window.AppState.user.level    = lv;
    window.AppState.user.xpToNext = (lv*1000) - window.AppState.user.xp;
    localStorage.setItem('olympus_session', JSON.stringify(window.AppState.user));

    this._updateChallenges(s);
    this._updateAchievements(s);

    if (window.OlympusNotif) OlympusNotif.add(
      '¡Entrenamiento completado! 💪',
      `${rutina_nombre} · +${xp} XP · ${duracion_min} min · ${calorias} kcal`, 'workout'
    );
    return { stats:s, xpGanado:xp };
  },

  getWeeklyProgress() {
    const s   = this.get();
    const freq= s.dias_objetivo_semana || 3;
    const mon = this._monday();
    const wk  = this.getWorkouts().filter(w => w.fecha >= mon);
    const dSet= new Set(wk.map(w => { const d=new Date(w.fecha).getDay(); return d===0?6:d-1; }));
    return { completados:Math.min(wk.length,freq), objetivo:freq, diasEntrenados:dSet };
  },

  getWeeklyData() {
    const days = ['L','M','X','J','V','S','D'];
    const res  = days.map(d => ({ day:d, calories:0, minutes:0 }));
    const mon  = this._monday();
    this.getWorkouts().filter(w=>w.fecha>=mon).forEach(w=>{
      const d=new Date(w.fecha).getDay();
      const i=d===0?6:d-1;
      if (res[i]) { res[i].calories+=w.calorias||0; res[i].minutes+=w.duracion_min||0; }
    });
    return res;
  },

  getPlanProgress() {
    const def = {1:'today',2:'pending',3:'pending',4:'pending',5:'pending'};
    return JSON.parse(localStorage.getItem(this._ppKey()) || JSON.stringify(def));
  },
  completePlanWorkout(id) {
    const p = this.getPlanProgress();
    p[id] = 'done';
    for (let i=id+1; i<=5; i++) { if(p[i]==='pending'||p[i]==='today'){p[i]='today';break;} }
    localStorage.setItem(this._ppKey(), JSON.stringify(p));
    return p;
  },

  getAchievements() { return JSON.parse(localStorage.getItem(this._achKey())||'{}'); },
  _updateAchievements(s) {
    const a = this.getAchievements();
    if ((s.racha_actual||0)>=8)          a['ach0']=true;
    if ((s.total_entrenamientos||0)>=30) a['ach1']=true;
    if ((s.racha_maxima||0)>=21)         a['ach3']=true;
    localStorage.setItem(this._achKey(), JSON.stringify(a));
  },

  getChallenges() { return JSON.parse(localStorage.getItem(this._chKey())||'{}'); },
  _updateChallenges(s) {
    const ch  = this.getChallenges();
    const mon = this._monday();
    const wk  = this.getWorkouts().filter(w=>w.fecha>=mon).length;
    const mes = this.getWorkouts().filter(w=>w.fecha.slice(0,7)===new Date().toISOString().slice(0,7)).length;
    const upd = (id,prog,target)=>{
      ch[id]=ch[id]||{progress:0,status:'pendiente'};
      ch[id].progress=Math.min(prog,target);
      if(prog>=target)ch[id].status='completado';
    };
    upd('ch1',wk,5);
    upd('ch3',mes,14);
    upd('ch4',s.racha_actual||0,10);
    localStorage.setItem(this._chKey(),JSON.stringify(ch));
  },
};

/*Historial de notificaciones (pantalla)*/
window.screens['notif-history'] = {
  render() {
    const notifs = OlympusNotif.getAll().reverse();
    const items = notifs.length
      ? notifs.map(n => `
          <div style="padding:13px 16px;border-bottom:1px solid rgba(255,255,255,.06);
            display:flex;align-items:flex-start;gap:10px;">
            <div style="width:36px;height:36px;border-radius:50%;background:rgba(0,245,255,.1);
              border:1px solid rgba(0,245,255,.2);display:flex;align-items:center;
              justify-content:center;flex-shrink:0;">
              <i data-lucide="bell" style="width:15px;height:15px;color:var(--cyan);"></i>
            </div>
            <div style="flex:1;">
              <p style="font-size:13px;font-weight:600;margin-bottom:2px;">${n.titulo}</p>
              <p style="font-size:11px;color:#888;margin-bottom:3px;">${n.cuerpo}</p>
              <p style="font-size:10px;color:#555;">
                ${new Date(n.fecha).toLocaleDateString('es-ES',{weekday:'long',day:'numeric',month:'long'})}
              </p>
            </div>
          </div>`).join('')
      : `<div style="padding:48px 20px;text-align:center;">
           <i data-lucide="bell-off" style="width:48px;height:48px;color:rgba(255,255,255,.15);margin:0 auto 12px;"></i>
           <p style="color:#888;font-size:14px;">Sin notificaciones esta semana</p>
           <p style="color:#555;font-size:12px;margin-top:6px;">Las notificaciones se borran cada 7 días</p>
         </div>`;
    return `
    <div class="screen-scroll" style="position:relative;">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;
        border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="nh-back"
          style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);
            border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;
            justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;color:var(--cyan);"></i>
        </button>
        <div>
          <h2 style="font-size:17px;font-weight:700;">Historial</h2>
          <p style="font-size:11px;color:#888;">Últimos 7 días · se borra automáticamente</p>
        </div>
      </div>
      <div style="padding-bottom:80px;">${items}</div>
    </div>`;
  },
  init() {
    document.getElementById('nh-back')?.addEventListener('click', () => navigateTo('dashboard'));
    if (window.lucide) lucide.createIcons();
  }
};

/*calcularEdad global*/
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) return null;
  const hoy = new Date(), nac = new Date(fechaNacimiento);
  let edad  = hoy.getFullYear() - nac.getFullYear();
  const m   = hoy.getMonth() - nac.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < nac.getDate())) edad--;
  return edad;
}
window.calcularEdad = calcularEdad;