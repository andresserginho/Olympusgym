/*TRAIN.JS — Módulo de Entrenamiento */

/*BASE DE DATOS DE EJERCICIOS Y PLANES IA*/
const _PLAN_KEY = () =>
  `olympus_plan_data_${window.AppState?.user?.email || 'guest'}`;

const _EX_DB = {
  pecho_gym: [
    { name:'Press de banca',             sets:4, reps:10, rest:90,  description:'Contrae el pecho al subir, controla la bajada con 3 segundos.' },
    { name:'Press inclinado mancuernas', sets:3, reps:12, rest:75,  description:'Inclinación 30-45°, codos a 45° del cuerpo.' },
    { name:'Aperturas en máquina',       sets:3, reps:15, rest:60,  description:'Estira bien el pecho en el punto más bajo.' },
  ],
  pecho_home: [
    { name:'Flexiones estándar',   sets:4, reps:15, rest:60, description:'Cuerpo recto como una tabla, pecho al suelo.' },
    { name:'Flexiones inclinadas', sets:3, reps:12, rest:60, description:'Manos sobre silla o sofá, ángulo 30°.' },
    { name:'Flexiones diamante',   sets:3, reps:10, rest:60, description:'Pulgares e índices forman un diamante.' },
  ],
  espalda_gym: [
    { name:'Dominadas',           sets:4, reps:8,  rest:90, description:'Agarre prono, baja hasta brazos extendidos.' },
    { name:'Remo con barra',      sets:4, reps:10, rest:90, description:'Espalda neutra, jala hacia el abdomen.' },
    { name:'Jalón en polea alta', sets:3, reps:12, rest:60, description:'Lleva la barra al pecho, controla la subida.' },
  ],
  espalda_home: [
    { name:'Superman',                 sets:4, reps:15, rest:45, description:'Boca abajo, eleva pecho y piernas simultáneamente.' },
    { name:'Remo invertido bajo mesa', sets:3, reps:12, rest:60, description:'Túmbate bajo una mesa y jala el cuerpo.' },
    { name:'Good morning sin peso',    sets:3, reps:15, rest:45, description:'Inclina el torso adelante con espalda recta.' },
  ],
  piernas_gym: [
    { name:'Sentadilla con barra', sets:4, reps:8,  rest:120, description:'Baja hasta muslos paralelos al suelo. Espalda neutral.' },
    { name:'Prensa de piernas',    sets:3, reps:12, rest:90,  description:'Pies al ancho de hombros, no bloquees las rodillas.' },
    { name:'Curl femoral',         sets:3, reps:15, rest:60,  description:'Contrae el femoral al máximo en cada repetición.' },
  ],
  piernas_home: [
    { name:'Sentadilla libre', sets:4, reps:20, rest:60, description:'Baja hasta donde la movilidad lo permita.' },
    { name:'Zancadas',         sets:3, reps:12, rest:60, description:'Paso largo, rodilla trasera casi al suelo.' },
    { name:'Sentadilla sumo',  sets:3, reps:15, rest:60, description:'Pies más anchos que los hombros, puntas afuera.' },
  ],
  gluteos_gym: [
    { name:'Hip Thrust',              sets:4, reps:10, rest:90, description:'Hombro en banco, empuja la cadera arriba con fuerza.' },
    { name:'Sentadilla búlgara',      sets:3, reps:10, rest:75, description:'Pie trasero en banco, baja el cuerpo controlado.' },
    { name:'Patada trasera en polea', sets:3, reps:15, rest:45, description:'Cadera estable, extiende la pierna hacia atrás.' },
  ],
  gluteos_home: [
    { name:'Hip Thrust en suelo',           sets:4, reps:20, rest:45, description:'Hombros en suelo, sube la cadera explosivo.' },
    { name:'Patada trasera en cuadrupedia', sets:3, reps:20, rest:30, description:'Rodilla 90°, talón hacia el techo.' },
    { name:'Puente de glúteos',             sets:4, reps:20, rest:40, description:'Tumbado, sube y baja la cadera controlado.' },
  ],
  hombros_gym: [
    { name:'Press militar con barra', sets:4, reps:10, rest:90, description:'Empuja verticalmente, no arquees la espalda.' },
    { name:'Elevaciones laterales',   sets:4, reps:15, rest:60, description:'Codos ligeramente flexionados, sube hasta paralelo.' },
    { name:'Face pull en polea',      sets:3, reps:15, rest:60, description:'Lleva la cuerda hacia la cara, codos atrás.' },
  ],
  hombros_home: [
    { name:'Pike push-up',              sets:4, reps:12, rest:60, description:'Caderas en alto formando una V invertida.' },
    { name:'Elevaciones frontales',     sets:3, reps:15, rest:45, description:'Codo ligeramente flexionado, sube hasta hombro.' },
    { name:'Handstand contra la pared', sets:3, reps:5,  rest:90, description:'Pies en la pared, empuja el suelo con fuerza.' },
  ],
  core_gym: [
    { name:'Plancha',         sets:3, reps:1,  rest:30, description:'Mantén 45 segundos. Cuerpo recto como una tabla.' },
    { name:'Crunch en polea', sets:4, reps:20, rest:30, description:'Contrae el abdomen en el punto más bajo.' },
    { name:'Rueda abdominal', sets:3, reps:10, rest:60, description:'Salida controlada, no dejes que la cadera caiga.' },
  ],
  core_home: [
    { name:'Plancha',          sets:4, reps:1,  rest:30, description:'Mantén 45 segundos. Abdomen tenso todo el tiempo.' },
    { name:'Crunch clásico',   sets:4, reps:25, rest:30, description:'Exhala al subir, no jales el cuello.' },
    { name:'Mountain climbers',sets:3, reps:20, rest:30, description:'Alterna rodillas al pecho lo más rápido posible.' },
  ],
  cardio_gym: [
    { name:'Sprint en cinta HIIT', sets:6, reps:1, rest:60, description:'30s al máximo + 60s caminata. 6 rondas.' },
    { name:'Bicicleta estática',   sets:1, reps:1, rest:0,  description:'15 min al 75% de frecuencia cardíaca máxima.' },
    { name:'Remo ergómetro',       sets:1, reps:1, rest:0,  description:'10 min a ritmo constante y fuerte.' },
  ],
  cardio_home: [
    { name:'Burpees',           sets:4, reps:15, rest:30, description:'Flexión al bajar, salto con brazos arriba. Sin pausas.' },
    { name:'Jumping jacks',     sets:4, reps:30, rest:20, description:'Ritmo constante, aterrizaje suave.' },
    { name:'High knees sprint', sets:4, reps:30, rest:30, description:'Rodillas al pecho lo más alto posible.' },
  ],
};

const _GOAL_PLANS = {
  muscle: [
    { name:'Pecho & Tríceps 💪',  muscle:'pecho',   dur:45 },
    { name:'Espalda & Bíceps 🏋', muscle:'espalda', dur:50 },
    { name:'Piernas & Glúteos 🦵',muscle:'piernas', dur:55 },
    { name:'Hombros & Core ⚡',   muscle:'hombros', dur:40 },
    { name:'Full Body Power 🔥',  muscle:'core',    dur:45 },
  ],
  lose: [
    { name:'HIIT Cardio ⚡',      muscle:'cardio',  dur:25 },
    { name:'Piernas & Glúteos 🦵',muscle:'piernas', dur:40 },
    { name:'HIIT Full Body 🔥',   muscle:'cardio',  dur:25 },
    { name:'Upper Body 💪',       muscle:'pecho',   dur:35 },
    { name:'Cardio & Core 🏃',    muscle:'core',    dur:30 },
  ],
  endurance: [
    { name:'Cardio Base 🏃',        muscle:'cardio',  dur:45 },
    { name:'HIIT Intervalos ⚡',    muscle:'cardio',  dur:30 },
    { name:'Full Body 💪',          muscle:'core',    dur:40 },
    { name:'Core & Estabilidad 🎯', muscle:'core',    dur:35 },
    { name:'Cardio Largo 🏃',       muscle:'cardio',  dur:40 },
  ],
  fit: [
    { name:'Full Body A 💪',       muscle:'pecho',   dur:45 },
    { name:'Cardio & Core 🏃',     muscle:'cardio',  dur:30 },
    { name:'Piernas & Glúteos 🦵', muscle:'piernas', dur:45 },
    { name:'Hombros & Brazos ⚡',  muscle:'hombros', dur:40 },
    { name:'Full Body B 🔥',       muscle:'core',    dur:40 },
  ],
  sport: [
    { name:'Fuerza Explosiva 🦵',  muscle:'piernas', dur:45 },
    { name:'Upper Potencia 💪',    muscle:'pecho',   dur:45 },
    { name:'HIIT Velocidad 🏃',    muscle:'cardio',  dur:30 },
    { name:'Core Estabilidad 🎯',  muscle:'core',    dur:35 },
    { name:'Full Body Potencia 🔥',muscle:'espalda', dur:50 },
  ],
};

function _generateIAPlan(user) {
  const goal     = user?.goal      || 'fit';
  const lvl      = user?.levelName || 'beginner';
  const isGym    = (user?.location || '').includes('gym');
  const loc      = isGym ? 'gym' : 'home';
  const template = _GOAL_PLANS[goal] || _GOAL_PLANS.fit;

  return template.map((day, idx) => {
    const dbKey    = `${day.muscle}_${loc}`;
    const baseList = _EX_DB[dbKey] || _EX_DB[`core_${loc}`] || _EX_DB.core_home;

    const exercises = baseList.map(e => {
      let s = e.sets, r = e.reps;
      if (lvl === 'beginner') { s = Math.max(2, s - 1); r = Math.max(8, r - 2); }
      if (lvl === 'advanced') { s = s + 1; r = r + 2; }
      const muscleName = day.muscle.charAt(0).toUpperCase() + day.muscle.slice(1);
      return { ...e, sets: s, reps: r, muscle: muscleName };
    });

    return {
      id: idx + 1, name: day.name,
      ex: exercises.length, dur: day.dur,
      status: 'pending', exercises,
    };
  });
}

function _getOrGeneratePlan() {
  const key   = _PLAN_KEY();
  const saved = JSON.parse(localStorage.getItem(key) || 'null');
  if (saved && saved.length > 0) return saved;
  const plan  = _generateIAPlan(window.AppState?.user);
  localStorage.setItem(key, JSON.stringify(plan));
  return plan;
}

function _regeneratePlan() {
  /* Generar plan completamente nuevo según perfil actual del usuario */
  const newPlan = _generateIAPlan(window.AppState?.user);
  localStorage.setItem(_PLAN_KEY(), JSON.stringify(newPlan));

  /* Reiniciar TODO el progreso desde cero — día 1 activo, resto pendiente */
  const newStatus = {1:'today', 2:'pending', 3:'pending', 4:'pending', 5:'pending'};
  if (window.OlympusStats)
    localStorage.setItem(OlympusStats._ppKey(), JSON.stringify(newStatus));

  return newPlan;
}

let _trainOpen = null;
let _activeTab  = 'plan';
let _locFilter  = 'all';
let _favorites  = new Set();

/* ── RECOMENDADOS ── */
const _RECOMMENDED = [
  { id:'r1', name:'Upper Body Strength', level:'Intermedio', dur:45, ex:5, kcal:220,
    loc:['gym'], img:'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=70',
    exercises:[
      { name:'Press de banca Inclinado', muscle:'Pecho',   sets:4, reps:10, rest:90, description:'Contrae el pecho al subir, controla la bajada.' },
      { name:'Remo con barra',           muscle:'Espalda', sets:4, reps:10, rest:90, description:'Mantén la espalda recta y jala hacia el abdomen.' },
      { name:'Press militar',            muscle:'Hombros', sets:3, reps:10, rest:90, description:'Empuja sin arquear la espalda.' },
      { name:'Curl de bíceps',           muscle:'Bíceps',  sets:3, reps:12, rest:60, description:'Codos fijos, sube controlado.' },
      { name:'Tríceps en polea',         muscle:'Tríceps', sets:3, reps:12, rest:60, description:'Codos pegados al cuerpo.' },
    ]},
  { id:'r2', name:'HIIT Cardio Blast', level:'Avanzado', dur:20, ex:5, kcal:450,
    loc:['gym','home'], img:'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=70',
    exercises:[
      { name:'Burpees',           muscle:'Full body', sets:3, reps:15, rest:30, description:'Salta arriba al terminar.' },
      { name:'Mountain Climbers', muscle:'Core',      sets:3, reps:20, rest:30, description:'Alterna rodillas al pecho.' },
      { name:'Jump Squats',       muscle:'Piernas',   sets:3, reps:15, rest:45, description:'Aterriza suave y baja de inmediato.' },
      { name:'Box Jumps',         muscle:'Piernas',   sets:3, reps:12, rest:45, description:'Salta y baja controlado.' },
      { name:'Plank to Push-up',  muscle:'Core',      sets:3, reps:10, rest:30, description:'Alterna plank con flexiones.' },
    ]},
  { id:'r3', name:'Yoga Flow', level:'Principiante', dur:30, ex:4, kcal:120,
    loc:['home'], img:'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=70',
    exercises:[
      { name:'Saludo al Sol',    muscle:'Full body', sets:3, reps:5, rest:30, description:'Flujo continuo de posiciones.' },
      { name:'Guerrero I',       muscle:'Piernas',   sets:2, reps:8, rest:20, description:'Mantén 30 segundos cada lado.' },
      { name:'Tabla (Plank)',    muscle:'Core',      sets:3, reps:1, rest:30, description:'Sostén 45 segundos.' },
      { name:'Postura del niño', muscle:'Espalda',   sets:2, reps:1, rest:20, description:'Relaja completamente la espalda.' },
    ]},
];

/* ── HERO ── */
function _heroHTML() {
  return `
  <div style="position:relative;height:175px;overflow:hidden;">
    <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80"
      style="width:100%;height:100%;object-fit:cover;opacity:.35;">
    <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.2),#080808);"></div>
    <div style="position:absolute;bottom:0;left:0;right:0;padding:18px 20px;">
      <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:6px;">
        <i data-lucide="zap" style="width:11px;height:11px;color:var(--cyan);"></i> MÓDULO DE ENTRENAMIENTO
      </div>
      <h1 style="font-size:21px;font-weight:800;margin-bottom:7px;">Tu Plan de Rutinas</h1>
      <div style="display:flex;gap:14px;">
        <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa;"><i data-lucide="calendar" style="width:12px;height:12px;"></i><span>5 días</span></div>
        <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa;"><i data-lucide="clock" style="width:12px;height:12px;"></i><span>210 min</span></div>
        <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#aaa;"><i data-lucide="flame" style="width:12px;height:12px;color:var(--orange,#f97316);"></i><span>+1,500 kcal</span></div>
      </div>
    </div>
  </div>`;
}

/* ── TABS ── */
function _tabsHTML() {
  const tabs = [['plan','Mi Plan'],['recomendados','Recomendados'],['favoritos','Favoritos'],['historial','Historial']];
  return `<div style="padding:13px 20px;display:flex;gap:7px;overflow-x:auto;scrollbar-width:none;">
    ${tabs.map(([id,label]) => `
      <button type="button" class="train-tab-btn" data-tab="${id}"
        style="padding:7px 15px;border-radius:20px;font-size:12px;font-weight:600;
          background:${_activeTab===id?'var(--cyan)':'rgba(255,255,255,.07)'};
          color:${_activeTab===id?'#000':'#888'};
          border:${_activeTab===id?'none':'1px solid rgba(255,255,255,.1)'};
          cursor:pointer;white-space:nowrap;flex-shrink:0;font-family:inherit;">${label}
      </button>`).join('')}
  </div>`;
}

/*RENDER: MI PLAN*/
function _renderPlan() {
  const PLAN       = _getOrGeneratePlan();
  const planStatus = window.OlympusStats ? OlympusStats.getPlanProgress() : {};
  const timerPref  = window.OlympusStats ? OlympusStats.getTimerPref() : 'countdown';

  /* Encontrar el día activo automáticamente */
  if (_trainOpen === null) {
    for (let i = 1; i <= PLAN.length; i++) {
      if ((planStatus[i] || '') === 'today') { _trainOpen = i; break; }
    }
    if (_trainOpen === null) _trainOpen = 1;
  }

  const wp = window.OlympusStats ? OlympusStats.getWeeklyProgress() : {completados:0,objetivo:3};

  /* ── Rutinas manuales guardadas por el usuario ── */
  const manualKey    = `olympus_manual_${window.AppState?.user?.email||'guest'}`;
  const savedManuals = JSON.parse(localStorage.getItem(manualKey)||'[]').slice(-5).reverse();

  const savedManualHTML = savedManuals.length > 0 ? `
    <div style="padding:0 20px 14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <p style="font-size:14px;font-weight:700;">Mis rutinas guardadas</p>
        <span style="font-size:11px;color:#888;">${savedManuals.length} guardadas</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${savedManuals.map((r, idx) => {
          const estimMin  = r.exercises ? r.exercises.reduce((s,e)=>s+e.sets*3,0) : 0;
          const estimKcal = Math.round(estimMin * 7.5);
          return `
            <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:14px;">
              <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">
                <div style="flex:1;min-width:0;">
                  <p style="font-size:13px;font-weight:700;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.name}</p>
                  <p style="font-size:11px;color:#888;">${r.exercises?.length||0} ejercicios · ~${estimMin} min · ~${estimKcal} kcal</p>
                </div>
                <button type="button" class="manual-delete" data-idx="${idx}"
                  style="width:30px;height:30px;border-radius:50%;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.2);color:#ef4444;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:8px;">
                  <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
                </button>
              </div>
              ${r.exercises && r.exercises.length > 0 ? `
                <div style="margin-bottom:10px;display:flex;flex-wrap:wrap;gap:4px;">
                  ${r.exercises.slice(0,4).map(e => `
                    <span style="font-size:9px;font-weight:600;padding:2px 8px;border-radius:20px;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.18);color:var(--cyan,#00f5ff);">${e.name}</span>`).join('')}
                  ${r.exercises.length > 4 ? `<span style="font-size:9px;color:#888;padding:2px 6px;">+${r.exercises.length-4} más</span>` : ''}
                </div>` : ''}
              <button type="button" class="manual-start-saved" data-idx="${idx}"
                style="width:100%;padding:10px;border-radius:10px;background:var(--cyan,#00f5ff);border:none;color:#000;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;">
                <i data-lucide="play" style="width:14px;height:14px;color:#000;"></i>
                Iniciar esta rutina
              </button>
            </div>`;
        }).join('')}
      </div>
    </div>` : '';

  const wHTML = PLAN.map(w => {
    const realStatus = planStatus[w.id] || (w.id === 1 ? 'today' : 'pending');
    const isOpen     = w.id === _trainOpen && realStatus === 'today';

    let numEl = '';
    if      (realStatus === 'done')  numEl = `<div style="width:28px;height:28px;border-radius:8px;background:rgba(34,197,94,.15);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i data-lucide="check" style="width:14px;height:14px;color:#22c55e;"></i></div>`;
    else if (realStatus === 'today') numEl = `<div style="width:28px;height:28px;border-radius:8px;background:rgba(0,245,255,.15);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:var(--cyan);flex-shrink:0;">${w.id}</div>`;
    else                             numEl = `<div style="width:28px;height:28px;border-radius:8px;background:rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#666;flex-shrink:0;">${w.id}</div>`;

    let stEl = '';
    if      (realStatus === 'done')  stEl = `<span style="font-size:11px;font-weight:600;color:#22c55e;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.25);padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;">✓ Completado</span>`;
    else if (realStatus === 'today') stEl = `<button type="button" class="train-toggle" data-wid="${w.id}" style="font-size:11px;font-weight:600;color:var(--cyan);background:rgba(0,245,255,.12);border:1px solid rgba(0,245,255,.25);padding:4px 10px;border-radius:20px;cursor:pointer;white-space:nowrap;flex-shrink:0;font-family:inherit;">Hoy ${isOpen?'▲':'▼'}</button>`;
    else                             stEl = `<span style="font-size:11px;color:#666;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;">Pendiente</span>`;

    let exSec = '';
    if (isOpen && w.exercises) {
      const rows = w.exercises.map((e, idx) => {
        const mc = (e.muscle==='Piernas'||e.muscle==='Gluteos')
          ? 'background:rgba(168,85,247,.15);color:#a855f7'
          : 'background:rgba(0,245,255,.1);color:var(--cyan)';
        return `<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(255,255,255,.04);border-radius:10px;border:1px solid rgba(255,255,255,.06);">
          <div style="flex:1;">
            <p style="font-size:12px;font-weight:600;margin-bottom:2px;">${e.name}</p>
            <p style="font-size:10px;color:var(--gray-400,#888);">
              ${e.sets} series · ${e.reps} reps ·
              <span id="rest-label-${w.id}-${idx}">${e.rest}s</span> descanso
              <button type="button" class="edit-rest-btn"
                data-wid="${w.id}" data-idx="${idx}" data-rest="${e.rest}"
                style="background:none;border:none;color:var(--cyan,#00f5ff);font-size:10px;cursor:pointer;padding:0 4px;">
                ✏️ editar
              </button>
            </p>
          </div>
          <span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:8px;white-space:nowrap;${mc};">${e.muscle}</span>
        </div>`;
      }).join('');

      exSec = `<div style="padding:0 14px 14px;">
        <div style="margin-bottom:12px;display:flex;align-items:center;justify-content:space-between;">
          <p style="font-size:11px;color:#888;">Tipo de cronómetro:</p>
          <div style="display:flex;gap:6px;">
            <button type="button" class="timer-pref-btn" data-pref="countdown"
              style="padding:5px 10px;border-radius:20px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;
                background:${timerPref==='countdown'?'var(--cyan)':'rgba(255,255,255,.07)'};
                border:${timerPref==='countdown'?'none':'1px solid rgba(255,255,255,.15)'};
                color:${timerPref==='countdown'?'#000':'#888'};">
              ⏱ Cuenta regresiva
            </button>
            <button type="button" class="timer-pref-btn" data-pref="stopwatch"
              style="padding:5px 10px;border-radius:20px;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;
                background:${timerPref==='stopwatch'?'var(--cyan)':'rgba(255,255,255,.07)'};
                border:${timerPref==='stopwatch'?'none':'1px solid rgba(255,255,255,.15)'};
                color:${timerPref==='stopwatch'?'#000':'#888'};">
              ⏲ Cronómetro
            </button>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;margin-bottom:12px;">${rows}</div>
        <button type="button" id="train-start-btn"
          style="width:100%;padding:13px;border-radius:12px;background:var(--cyan,#00f5ff);border:none;color:#000;font-size:14px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;">
          <i data-lucide="play" style="width:16px;height:16px;color:#000;"></i>
          Iniciar entrenamiento
          <i data-lucide="zap" style="width:14px;height:14px;color:#000;"></i>
        </button>
      </div>`;
    }

    const bdr = realStatus === 'today'
      ? 'border-color:rgba(0,245,255,.28);background:rgba(0,245,255,.02);'
      : 'border-color:rgba(255,255,255,.07);background:rgba(255,255,255,.025);';

    return `<div style="border:1px solid;border-radius:13px;overflow:hidden;${bdr}">
      <div style="display:flex;align-items:center;gap:10px;padding:13px 14px;">
        ${numEl}
        <div style="flex:1;min-width:0;">
          <p style="font-size:13px;font-weight:600;margin-bottom:2px;">${w.name}</p>
          <p style="font-size:11px;color:var(--gray-400,#888);">${w.ex} ejercicios · ${w.dur} min</p>
        </div>
        ${stEl}
      </div>
      ${exSec}
    </div>`;
  }).join('');

  const userLevel = window.AppState?.user?.levelName || 'beginner';

  return `
  ${savedManualHTML}
  <div style="padding:0 20px 12px;">
    <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#555;margin-bottom:8px;">TIPO DE RUTINA</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:9px;">
      <div style="padding:12px 13px;border-radius:13px;background:rgba(0,245,255,.07);border:1px solid rgba(0,245,255,.35);">
        <i data-lucide="cpu" style="width:18px;height:18px;color:var(--cyan);margin-bottom:6px;"></i>
        <p style="font-size:13px;font-weight:700;color:var(--cyan);margin-bottom:3px;">Rutina IA</p>
        <p style="font-size:10px;color:#888;line-height:1.4;">Generada según tu perfil y objetivos</p>
      </div>
      <div style="padding:12px 13px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);cursor:pointer;" id="btn-rutina-manual">
        <i data-lucide="edit-3" style="width:18px;height:18px;color:#aaa;margin-bottom:6px;"></i>
        <p style="font-size:13px;font-weight:700;color:#aaa;margin-bottom:3px;">Manual</p>
        <p style="font-size:10px;color:#666;line-height:1.4;">Crea tus propios ejercicios</p>
      </div>
    </div>
  </div>
  <div style="padding:0 20px 12px;">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);border-radius:11px;">
      <span style="font-size:11px;color:#888;">Plan generado · Semana 1 · ${userLevel}</span>
      <button type="button" id="train-regen-btn"
        style="font-size:11px;color:var(--cyan);background:none;border:none;cursor:pointer;display:flex;align-items:center;gap:4px;font-weight:600;padding:0;font-family:inherit;">
        <i data-lucide="refresh-cw" style="width:13px;height:13px;"></i> Regenerar
      </button>
    </div>
  </div>
  <div style="padding:0 20px 14px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:9px;">
      <span style="font-size:14px;font-weight:700;">Progreso de la semana</span>
      <span style="font-size:14px;font-weight:700;color:var(--cyan);">${wp.completados}/${wp.objetivo} días</span>
    </div>
    <div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
      <div style="width:${Math.min(100,Math.round((wp.completados/wp.objetivo)*100))}%;height:100%;background:linear-gradient(90deg,var(--cyan),#0099cc);border-radius:3px;"></div>
    </div>
  </div>
  <div style="padding:0 20px 100px;display:flex;flex-direction:column;gap:8px;">${wHTML}</div>`;
}

/*RENDER: RECOMENDADOS*/
function _renderRecomendados() {
  const filtered = _locFilter==='all' ? _RECOMMENDED : _RECOMMENDED.filter(r=>r.loc.includes(_locFilter));
  const cardsHTML = filtered.map(r => {
    const isFav = _favorites.has(r.id);
    return `<div style="border-radius:16px;overflow:hidden;background:#0a0a0a;border:1px solid rgba(255,255,255,.08);margin-bottom:12px;">
      <div style="position:relative;height:130px;overflow:hidden;">
        <img src="${r.img}" style="width:100%;height:100%;object-fit:cover;opacity:.5;">
        <div style="position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.6));"></div>
        <span style="position:absolute;top:10px;left:10px;font-size:10px;font-weight:700;background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.2);color:#fff;padding:3px 10px;border-radius:20px;">${r.level}</span>
        <button type="button" class="train-fav-btn" data-rid="${r.id}"
          style="position:absolute;top:8px;right:10px;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,.5);border:1px solid rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;cursor:pointer;">
          <i data-lucide="heart" style="width:15px;height:15px;color:${isFav?'#ec4899':'#888'};${isFav?'fill:#ec4899':''}"></i>
        </button>
      </div>
      <div style="padding:14px;">
        <h3 style="font-size:15px;font-weight:700;margin-bottom:6px;">${r.name}</h3>
        <div style="display:flex;gap:14px;margin-bottom:12px;">
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#888;"><i data-lucide="clock" style="width:12px;height:12px;"></i><span>${r.dur} min</span></div>
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#888;"><i data-lucide="dumbbell" style="width:12px;height:12px;"></i><span>${r.ex} ejercicios</span></div>
          <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:#888;"><i data-lucide="flame" style="width:12px;height:12px;color:var(--orange,#f97316);"></i><span>${r.kcal} kcal</span></div>
        </div>
        <div style="display:flex;gap:8px;">
          <button type="button" style="flex:1;padding:10px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;font-family:inherit;">
            <i data-lucide="eye" style="width:14px;height:14px;"></i> Preview
          </button>
          <button type="button" class="train-recom-start" data-rid="${r.id}"
            style="flex:1;padding:10px;border-radius:10px;background:var(--cyan,#00f5ff);border:none;color:#000;font-size:12px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:5px;font-family:inherit;">
            <i data-lucide="play" style="width:14px;height:14px;color:#000;"></i> Iniciar
          </button>
        </div>
      </div>
    </div>`;
  }).join('');
  return `
  <div style="padding:0 20px 14px;">
    <div style="display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;">
      ${[['all','Todos'],['gym','Gimnasio'],['home','Casa']].map(([id,label]) => `
        <button type="button" class="train-loc-btn" data-loc="${id}"
          style="padding:7px 15px;border-radius:20px;font-size:12px;font-weight:600;
            background:${_locFilter===id?'var(--cyan)':'rgba(255,255,255,.07)'};
            color:${_locFilter===id?'#000':'#888'};
            border:${_locFilter===id?'none':'1px solid rgba(255,255,255,.1)'};
            cursor:pointer;white-space:nowrap;flex-shrink:0;font-family:inherit;">${label}
        </button>`).join('')}
    </div>
  </div>
  <div style="padding:0 20px 100px;">
    ${cardsHTML || `<div style="text-align:center;padding:40px 0;color:#888;">Sin resultados para este filtro</div>`}
  </div>`;
}

/*RENDER: FAVORITOS*/
function _renderFavoritos() {
  const favs = _RECOMMENDED.filter(r => _favorites.has(r.id));
  if (!favs.length) return `<div style="padding:60px 20px;text-align:center;">
    <i data-lucide="heart" style="width:48px;height:48px;color:rgba(255,255,255,.1);margin:0 auto 12px;"></i>
    <p style="font-size:15px;font-weight:600;color:#888;margin-bottom:6px;">Sin favoritos aún</p>
    <p style="font-size:13px;color:#555;">Toca ❤️ en Recomendados para guardar rutinas</p>
  </div>`;
  return `<div style="padding:0 20px 100px;">
    ${favs.map(r => `
      <div style="border-radius:14px;overflow:hidden;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:12px;padding:13px 14px;">
          <div style="width:48px;height:48px;border-radius:10px;overflow:hidden;flex-shrink:0;">
            <img src="${r.img}" style="width:100%;height:100%;object-fit:cover;opacity:.7;">
          </div>
          <div style="flex:1;min-width:0;">
            <p style="font-size:13px;font-weight:600;margin-bottom:2px;">${r.name}</p>
            <p style="font-size:11px;color:#888;">${r.dur} min · ${r.ex} ejercicios · ${r.kcal} kcal</p>
          </div>
          <button type="button" class="train-fav-btn" data-rid="${r.id}"
            style="width:34px;height:34px;border-radius:50%;background:rgba(236,72,153,.15);border:1px solid rgba(236,72,153,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;">
            <i data-lucide="heart" style="width:15px;height:15px;color:#ec4899;fill:#ec4899;"></i>
          </button>
        </div>
        <div style="padding:0 14px 13px;">
          <button type="button" class="train-recom-start" data-rid="${r.id}"
            style="width:100%;padding:11px;border-radius:10px;background:var(--cyan,#00f5ff);border:none;color:#000;font-size:13px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:6px;font-family:inherit;">
            <i data-lucide="play" style="width:14px;height:14px;color:#000;"></i> Iniciar entrenamiento
          </button>
        </div>
      </div>`).join('')}
  </div>`;
}

/*RENDER: HISTORIAL*/
function _renderHistorial() {
  let workouts = [];
  try { workouts = window.OlympusStats ? OlympusStats.getWorkouts().slice().reverse() : []; } catch(_){}
  const items = workouts.map(h => ({ name:h.rutina_nombre, date:h.hora||h.fecha, dur:h.duracion_min, kcal:h.calorias, ex:h.ejercicios?.length||3 }));
  return `
  <div style="padding:0 20px 6px;">
    <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#666;margin-bottom:12px;">SESIONES COMPLETADAS</p>
  </div>
  <div style="padding:0 20px 100px;">
    ${items.length > 0 ? items.map(h => `
      <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:13px;padding:14px 16px;margin-bottom:9px;">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;">
          <div>
            <p style="font-size:14px;font-weight:700;margin-bottom:3px;">${h.name}</p>
            <p style="font-size:11px;color:#888;">${h.date}</p>
          </div>
          <div style="width:28px;height:28px;border-radius:50%;background:rgba(34,197,94,.15);border:1px solid rgba(34,197,94,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
            <i data-lucide="check" style="width:13px;height:13px;color:#22c55e;"></i>
          </div>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
          <div style="text-align:center;padding:8px 4px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06);">
            <div style="font-size:13px;font-weight:700;color:var(--cyan);">${h.dur} min</div>
            <div style="font-size:9px;color:#888;margin-top:2px;">Tiempo</div>
          </div>
          <div style="text-align:center;padding:8px 4px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06);">
            <div style="font-size:13px;font-weight:700;color:var(--orange,#f97316);">${h.kcal} kcal</div>
            <div style="font-size:9px;color:#888;margin-top:2px;">Calorías</div>
          </div>
          <div style="text-align:center;padding:8px 4px;background:rgba(255,255,255,.03);border-radius:10px;border:1px solid rgba(255,255,255,.06);">
            <div style="font-size:13px;font-weight:700;color:#a855f7;">${h.ex}</div>
            <div style="font-size:9px;color:#888;margin-top:2px;">Ejercicios</div>
          </div>
        </div>
      </div>`).join('')
    : `<div style="padding:40px 20px;text-align:center;color:#888;">
        <i data-lucide="calendar" style="width:40px;height:40px;margin:0 auto 12px;opacity:.3;"></i>
        <p style="font-size:14px;font-weight:600;margin-bottom:6px;">Sin sesiones aún</p>
        <p style="font-size:12px;">Completa tu primer entrenamiento para ver tu historial</p>
      </div>`}
  </div>`;
}

/*CATÁLOGO PARA RUTINAS MANUALES*/
const _MUSCLE_GROUPS = [
  { id:'piernas',  label:'🦵 Piernas',    exercises:['Sentadilla','Prensa de piernas','Extensión cuádriceps','Curl femoral','Zancadas','Elevación de pantorrilla','Peso muerto rumano','Hip Thrust'] },
  { id:'pecho',    label:'💪 Pecho',      exercises:['Press de banca','Press inclinado','Press declinado','Aperturas mancuernas','Fondos en paralelas','Crossover polea','Press máquina'] },
  { id:'espalda',  label:'🏋 Espalda',    exercises:['Dominadas','Remo con barra','Jalón en polea','Remo con mancuerna','Peso muerto','Pullover','Remo en máquina'] },
  { id:'hombros',  label:'⚡ Hombros',    exercises:['Press militar','Elevaciones laterales','Elevaciones frontales','Face pull','Encogimientos','Press Arnold'] },
  { id:'brazos',   label:'🤜 Brazos',     exercises:['Curl bíceps','Curl martillo','Curl concentrado','Extensión tríceps','Fondos en banco','Tríceps en polea','Skull crushers'] },
  { id:'core',     label:'🎯 Core',       exercises:['Plancha','Crunch','Elevación de piernas','Russian twist','Rueda abdominal','Bicicleta','Crunches inversos'] },
  { id:'cardio',   label:'🏃 Cardio',     exercises:['Carrera','Bicicleta estática','Elíptica','Saltar cuerda','HIIT circuito','Escalera','Remo ergómetro'] },
  { id:'fullbody', label:'🔥 Full Body',  exercises:['Burpees','Swing kettlebell','Thruster','Box jump','Wall ball','Clean & press','Turkish get-up'] },
];

let _manualRoutine = { name:'Mi Rutina Personalizada', exercises:[] };

/*PANTALLA: CONSTRUCTOR DE RUTINA MANUAL*/
window.screens['manual-routine'] = {
  render() {
    const r = _manualRoutine;
    const estimMin  = r.exercises.reduce((s,e) => s + e.sets*3, 0);
    const estimKcal = Math.round(estimMin * 7.5);
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="mr-back"
          style="width:38px;height:38px;border-radius:50%;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;color:var(--cyan,#00f5ff);"></i>
        </button>
        <div style="flex:1;">
          <h2 style="font-size:17px;font-weight:700;">Crear Rutina Manual</h2>
          <p style="font-size:11px;color:#888;">Personaliza tus ejercicios libremente</p>
        </div>
        <button type="button" id="mr-save"
          style="padding:8px 18px;border-radius:20px;background:var(--cyan,#00f5ff);border:none;color:#000;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;">
          Guardar e iniciar
        </button>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:18px;">
        <div>
          <label style="font-size:10px;font-weight:700;letter-spacing:.07em;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;">Nombre de la rutina</label>
          <input type="text" id="mr-name" value="${r.name}"
            style="width:100%;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:14px;font-family:inherit;outline:none;">
        </div>
        <div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <p style="font-size:14px;font-weight:700;">Ejercicios <span style="color:#888;font-size:12px;">(${r.exercises.length})</span></p>
            <button type="button" id="mr-add-ex"
              style="padding:8px 16px;border-radius:20px;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);color:var(--cyan,#00f5ff);font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:5px;">
              <i data-lucide="plus" style="width:14px;height:14px;"></i> Agregar
            </button>
          </div>
          ${r.exercises.length === 0
            ? `<div style="padding:40px 20px;text-align:center;background:rgba(255,255,255,.02);border:2px dashed rgba(255,255,255,.1);border-radius:14px;">
                <i data-lucide="dumbbell" style="width:40px;height:40px;color:rgba(255,255,255,.12);margin:0 auto 12px;"></i>
                <p style="font-size:14px;font-weight:600;color:#666;margin-bottom:4px;">Sin ejercicios aún</p>
                <p style="font-size:12px;color:#555;">Toca "Agregar" para añadir el primero</p>
              </div>`
            : r.exercises.map((e, idx) => `
                <div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:13px;padding:14px;margin-bottom:8px;">
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">
                    <div>
                      <p style="font-size:13px;font-weight:700;">${e.name}</p>
                      <p style="font-size:11px;color:var(--cyan,#00f5ff);margin-top:2px;">${e.muscle}</p>
                    </div>
                    <button type="button" class="mr-del-ex" data-idx="${idx}"
                      style="width:28px;height:28px;border-radius:50%;background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);color:#ef4444;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;">
                      <i data-lucide="x" style="width:14px;height:14px;"></i>
                    </button>
                  </div>
                  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">
                    ${[['star','#00f5ff',e.sets,'Series'],['repeat','#00f5ff',e.reps,'Reps'],['clock','#00f5ff',e.rest+'s','Descanso']].map(([ic,cl,v,l])=>`
                      <div style="text-align:center;padding:8px;background:rgba(0,245,255,.06);border-radius:10px;border:1px solid rgba(0,245,255,.15);">
                        <div style="font-size:16px;font-weight:800;color:${cl};">${v}</div>
                        <div style="font-size:9px;color:#888;margin-top:2px;">${l}</div>
                      </div>`).join('')}
                  </div>
                </div>`).join('')}
        </div>
        ${r.exercises.length >= 1 ? `
          <div style="background:rgba(0,245,255,.04);border:1px solid rgba(0,245,255,.15);border-radius:12px;padding:16px;">
            <p style="font-size:12px;font-weight:700;color:var(--cyan,#00f5ff);margin-bottom:8px;">📊 Resumen estimado</p>
            <div style="display:flex;gap:20px;">
              <div><div style="font-size:20px;font-weight:800;color:var(--cyan,#00f5ff);">${estimMin}</div><div style="font-size:10px;color:#888;">min</div></div>
              <div><div style="font-size:20px;font-weight:800;color:var(--orange,#f97316);">${estimKcal}</div><div style="font-size:10px;color:#888;">kcal est.</div></div>
              <div><div style="font-size:20px;font-weight:800;color:#22c55e;">${r.exercises.length}</div><div style="font-size:10px;color:#888;">ejercicios</div></div>
            </div>
          </div>` : ''}
        <div style="height:20px;"></div>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('mr-back')?.addEventListener('click', () => navigateTo('train'));
    document.getElementById('mr-name')?.addEventListener('input', e => { _manualRoutine.name = e.target.value; });
    document.querySelectorAll('.mr-del-ex').forEach(btn =>
      btn.addEventListener('click', () => {
        _manualRoutine.exercises.splice(parseInt(btn.dataset.idx), 1);
        navigateTo('manual-routine');
      })
    );
    document.getElementById('mr-save')?.addEventListener('click', () => {
      if (_manualRoutine.exercises.length === 0) { alert('⚠️ Agrega al menos un ejercicio.'); return; }
      _manualRoutine.name = document.getElementById('mr-name')?.value.trim() || _manualRoutine.name;
      /* Guardar en localStorage */
      const key     = `olympus_manual_${window.AppState?.user?.email||'guest'}`;
      const manuals = JSON.parse(localStorage.getItem(key)||'[]');
      manuals.push({ ...JSON.parse(JSON.stringify(_manualRoutine)), id:Date.now(), createdAt:new Date().toISOString() });
      localStorage.setItem(key, JSON.stringify(manuals));
      /* Iniciar entrenamiento */
      const exercises = _manualRoutine.exercises.map(e => ({
        ...e, description: e.description || `${e.sets} series de ${e.reps} repeticiones. Descanso: ${e.rest}s.`
      }));
      const nombre = _manualRoutine.name;
      _manualRoutine = { name:'Mi Rutina Personalizada', exercises:[] };
      startWorkoutSession({ name: nombre, workoutId: null, exercises });
    });
    document.getElementById('mr-add-ex')?.addEventListener('click', () => _showMuscleGroupPicker());
    if (window.lucide) lucide.createIcons();
  }
};

function _showMuscleGroupPicker() {
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9000;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);';
  ov.innerHTML = `
    <div style="width:100%;max-width:430px;background:#0d0d0d;border:1px solid rgba(0,245,255,.2);border-radius:20px 20px 0 0;padding:20px;max-height:85vh;overflow-y:auto;">
      <div style="width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,.2);margin:0 auto 16px;"></div>
      <p style="font-size:15px;font-weight:700;margin-bottom:4px;">Grupo muscular</p>
      <p style="font-size:11px;color:#888;margin-bottom:16px;">¿Qué músculo trabajarás?</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
        ${_MUSCLE_GROUPS.map(mg => `
          <button type="button" class="mg-pick" data-id="${mg.id}"
            style="padding:14px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;text-align:left;">
            ${mg.label}
          </button>`).join('')}
      </div>
      <button type="button" id="mg-cancel"
        style="width:100%;padding:11px;border-radius:12px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#888;font-size:13px;cursor:pointer;font-family:inherit;">Cancelar</button>
    </div>`;
  document.body.appendChild(ov);
  if (window.lucide) lucide.createIcons();
  ov.addEventListener('click', e => { if(e.target===ov) ov.remove(); });
  document.getElementById('mg-cancel')?.addEventListener('click', () => ov.remove());
  ov.querySelectorAll('.mg-pick').forEach(btn =>
    btn.addEventListener('click', () => {
      const mg = _MUSCLE_GROUPS.find(m => m.id === btn.dataset.id);
      ov.remove(); _showExercisePicker(mg);
    })
  );
}

function _showExercisePicker(mg) {
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9000;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);';
  ov.innerHTML = `
    <div style="width:100%;max-width:430px;background:#0d0d0d;border:1px solid rgba(0,245,255,.2);border-radius:20px 20px 0 0;padding:20px;max-height:85vh;overflow-y:auto;">
      <div style="width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,.2);margin:0 auto 16px;"></div>
      <p style="font-size:15px;font-weight:700;margin-bottom:2px;">${mg.label}</p>
      <p style="font-size:11px;color:#888;margin-bottom:14px;">Elige el ejercicio</p>
      ${mg.exercises.map(ex => `
        <button type="button" class="ex-pick" data-name="${ex}"
          style="width:100%;padding:12px 14px;border-radius:10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;text-align:left;margin-bottom:6px;">
          ${ex}
        </button>`).join('')}
      <div style="margin-top:4px;margin-bottom:8px;">
        <input type="text" id="custom-ex" placeholder="O escribe uno personalizado..."
          style="width:100%;padding:11px 14px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid rgba(0,245,255,.2);color:#fff;font-size:13px;font-family:inherit;outline:none;">
      </div>
      <button type="button" id="ex-add-custom"
        style="width:100%;padding:11px;border-radius:10px;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);color:var(--cyan,#00f5ff);font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;margin-bottom:6px;">
        + Agregar ejercicio personalizado
      </button>
      <button type="button" id="ex-cancel"
        style="width:100%;padding:10px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#888;font-size:12px;cursor:pointer;font-family:inherit;">Cancelar</button>
    </div>`;
  document.body.appendChild(ov);
  ov.addEventListener('click', e => { if(e.target===ov) ov.remove(); });
  document.getElementById('ex-cancel')?.addEventListener('click', () => ov.remove());
  document.getElementById('ex-add-custom')?.addEventListener('click', () => {
    const v = document.getElementById('custom-ex')?.value.trim();
    if (!v) return;
    ov.remove(); _showParamsPicker(v, mg.label);
  });
  ov.querySelectorAll('.ex-pick').forEach(btn =>
    btn.addEventListener('click', () => {
      ov.remove(); _showParamsPicker(btn.dataset.name, mg.label);
    })
  );
}

function _showParamsPicker(exName, muscleName) {
  const ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:9000;display:flex;align-items:flex-end;justify-content:center;backdrop-filter:blur(4px);';
  ov.innerHTML = `
    <div style="width:100%;max-width:430px;background:#0d0d0d;border:1px solid rgba(0,245,255,.2);border-radius:20px 20px 0 0;padding:20px;">
      <div style="width:40px;height:4px;border-radius:2px;background:rgba(255,255,255,.2);margin:0 auto 16px;"></div>
      <p style="font-size:15px;font-weight:700;">${exName}</p>
      <p style="font-size:11px;color:var(--cyan,#00f5ff);margin-bottom:18px;">${muscleName}</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:18px;">
        <div>
          <p style="font-size:10px;font-weight:700;letter-spacing:.07em;color:#888;margin-bottom:6px;text-transform:uppercase;">Series</p>
          <input type="number" id="p-sets" value="3" min="1" max="20"
            style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:20px;font-weight:800;font-family:inherit;outline:none;text-align:center;-moz-appearance:textfield;appearance:textfield;">
        </div>
        <div>
          <p style="font-size:10px;font-weight:700;letter-spacing:.07em;color:#888;margin-bottom:6px;text-transform:uppercase;">Reps</p>
          <input type="number" id="p-reps" value="12" min="1" max="100"
            style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:20px;font-weight:800;font-family:inherit;outline:none;text-align:center;-moz-appearance:textfield;appearance:textfield;">
        </div>
        <div>
          <p style="font-size:10px;font-weight:700;letter-spacing:.07em;color:#888;margin-bottom:6px;text-transform:uppercase;">Descanso (s)</p>
          <input type="number" id="p-rest" value="60" min="0" max="600" step="15"
            style="width:100%;padding:12px;border-radius:10px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:20px;font-weight:800;font-family:inherit;outline:none;text-align:center;-moz-appearance:textfield;appearance:textfield;">
        </div>
      </div>
      <button type="button" id="p-confirm"
        style="width:100%;padding:15px;border-radius:12px;background:var(--cyan,#00f5ff);border:none;color:#000;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:8px;">
        <i data-lucide="check" style="width:18px;height:18px;color:#000;"></i> Agregar a la rutina
      </button>
      <button type="button" id="p-cancel"
        style="width:100%;padding:11px;border-radius:10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#888;font-size:13px;cursor:pointer;font-family:inherit;">Cancelar</button>
    </div>`;
  document.body.appendChild(ov);
  if (window.lucide) lucide.createIcons();
  ov.addEventListener('click', e => { if(e.target===ov) ov.remove(); });
  document.getElementById('p-cancel')?.addEventListener('click', () => ov.remove());
  document.getElementById('p-confirm')?.addEventListener('click', () => {
    const sets = parseInt(document.getElementById('p-sets')?.value) || 3;
    const reps = parseInt(document.getElementById('p-reps')?.value) || 12;
    const rest = parseInt(document.getElementById('p-rest')?.value) || 60;
    _manualRoutine.exercises.push({ name:exName, muscle:muscleName, sets, reps, rest });
    ov.remove();
    navigateTo('manual-routine');
  });
}

/*PANTALLA PRINCIPAL DE ENTRENAMIENTO*/
window.screens.train = {
  render() {
    const content = {
      plan:         _renderPlan,
      recomendados: _renderRecomendados,
      favoritos:    _renderFavoritos,
      historial:    _renderHistorial,
    }[_activeTab]?.() ?? _renderPlan();

    return `
    <div class="screen-scroll" style="position:relative;">
      ${_heroHTML()}
      ${_tabsHTML()}
      ${content}
      <button type="button" class="dash-fab-chat" id="train-fab">
        <i data-lucide="message-circle"></i>
      </button>
    </div>`;
  },

  init() {
    /* Tabs */
    document.querySelectorAll('.train-tab-btn').forEach(btn =>
      btn.addEventListener('click', () => { _activeTab = btn.dataset.tab; navigateTo('train'); })
    );
    /* Toggle expandir día */
    document.querySelectorAll('.train-toggle').forEach(btn =>
      btn.addEventListener('click', () => {
        const wid = parseInt(btn.dataset.wid);
        _trainOpen = _trainOpen === wid ? null : wid;
        navigateTo('train');
      })
    );
    /* Tipo de cronómetro */
    document.querySelectorAll('.timer-pref-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        if (window.OlympusStats) OlympusStats.setTimerPref(btn.dataset.pref);
        navigateTo('train');
      })
    );
    /* Editar descanso */
    document.querySelectorAll('.edit-rest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const curr  = parseInt(btn.dataset.rest);
        const nuevo = prompt(`Tiempo de descanso actual: ${curr}s\nNuevo valor (segundos):`, curr);
        if (nuevo === null) return;
        const val = parseInt(nuevo);
        if (isNaN(val) || val < 0) return;
        const plan = _getOrGeneratePlan();
        const wid  = parseInt(btn.dataset.wid);
        const idx  = parseInt(btn.dataset.idx);
        if (plan[wid-1]?.exercises?.[idx]) {
          plan[wid-1].exercises[idx].rest = val;
          localStorage.setItem(_PLAN_KEY(), JSON.stringify(plan));
        }
        navigateTo('train');
      });
    });
    /* Iniciar entrenamiento del plan IA */
    document.getElementById('train-start-btn')?.addEventListener('click', () => {
      const plan = _getOrGeneratePlan();
      const w    = plan.find(x => x.id === _trainOpen);
      if (w?.exercises) startWorkoutSession({ name: w.name, workoutId: w.id, exercises: w.exercises });
    });
    /* Rutina Manual */
    document.getElementById('btn-rutina-manual')?.addEventListener('click', () => {
      _manualRoutine = { name:'Mi Rutina Personalizada', exercises:[] };
      navigateTo('manual-routine');
    });
      /* Regenerar plan con IA */
    document.getElementById('train-regen-btn')?.addEventListener('click', () => {
      const u    = window.AppState?.user || {};
      const goal = { lose:'Perder peso', muscle:'Ganar músculo', endurance:'Resistencia', fit:'Fit', sport:'Deporte' }[u.goal] || 'general';
      const loc  = u.location?.includes('gym') ? 'Gimnasio' : 'Casa';
      const lvl  = { beginner:'Principiante', intermediate:'Intermedio', advanced:'Avanzado' }[u.levelName] || u.levelName || 'Principiante';

      if (confirm(
        `🔄 Regenerar plan con IA\n\n` +
        `Se generarán NUEVOS ejercicios según tu perfil:\n` +
        `• Objetivo: ${goal}\n` +
        `• Nivel: ${lvl}\n` +
        `• Lugar: ${loc}\n\n` +
        `⚠️ El progreso actual se reiniciará desde el Día 1.\n¿Continuar?`
      )) {
        _regeneratePlan();
        _trainOpen = null;   
        navigateTo('train');
      }
    });
    /* Location filter */
    document.querySelectorAll('.train-loc-btn').forEach(btn =>
      btn.addEventListener('click', () => { _locFilter = btn.dataset.loc; navigateTo('train'); })
    );
    /* Favoritos */
    document.querySelectorAll('.train-fav-btn').forEach(btn =>
      btn.addEventListener('click', () => {
        const rid = btn.dataset.rid;
        _favorites.has(rid) ? _favorites.delete(rid) : _favorites.add(rid);
        navigateTo('train');
      })
    );
    /* Iniciar recomendado/favorito */
    document.querySelectorAll('.train-recom-start').forEach(btn =>
      btn.addEventListener('click', () => {
        const r = _RECOMMENDED.find(x => x.id === btn.dataset.rid);
        if (r) startWorkoutSession({ name: r.name, workoutId: null, exercises: r.exercises });
      })
    );

    /*Iniciar rutina manual guardada*/
    document.querySelectorAll('.manual-start-saved').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx     = parseInt(btn.dataset.idx);
        const key     = `olympus_manual_${window.AppState?.user?.email||'guest'}`;
        const manuals = JSON.parse(localStorage.getItem(key)||'[]').reverse();
        const r       = manuals[idx];
        if (r?.exercises?.length > 0) {
          startWorkoutSession({
            name:      r.name,
            workoutId: null,
            exercises: r.exercises.map(e => ({
              ...e,
              description: e.description || `${e.sets} series de ${e.reps} repeticiones. Descanso: ${e.rest}s.`
            }))
          });
        }
      });
    });

    /*Eliminar rutina manual guardada */
    document.querySelectorAll('.manual-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('¿Eliminar esta rutina guardada?')) return;
        const idx     = parseInt(btn.dataset.idx);
        const key     = `olympus_manual_${window.AppState?.user?.email||'guest'}`;
        const manuals = JSON.parse(localStorage.getItem(key)||'[]').reverse();
        manuals.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(manuals.reverse()));
        navigateTo('train');
      });
    });

    if (window.lucide) lucide.createIcons();
    window._updateGlobalFabPos && window._updateGlobalFabPos();
  }
};