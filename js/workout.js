/*WORKOUT.JS — Entrenamiento activo y timer*/

let _session = {
  workoutName:'', workoutId:null, exercises:[],
  currentEx:0, currentSet:1, completedSets:new Set(),
  elapsedSec:0, restSec:0, timerType:'countdown',
  timerInterval:null, restInterval:null,
};

function startWorkoutSession(workout) {
  if (_session.timerInterval) clearInterval(_session.timerInterval);
  if (_session.restInterval)  clearInterval(_session.restInterval);
  const timerType = window.OlympusStats ? OlympusStats.getTimerPref() : 'countdown';
  _session = {
    workoutName: workout.name, workoutId: workout.workoutId || null,
    exercises: workout.exercises || [],
    currentEx:0, currentSet:1, completedSets:new Set(),
    elapsedSec:0, restSec:0, timerType,
    timerInterval:null, restInterval:null,
  };
  navigateTo('active-workout');
}

function _fmt(s) {
  return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

window.screens['active-workout'] = {
  render() {
    const ex    = _session.exercises[_session.currentEx];
    if (!ex) return `<div style="padding:60px 20px;text-align:center;"><p style="color:#888">Sin ejercicios</p></div>`;
    const total = _session.exercises.length;
    const pct   = Math.round((_session.currentEx/total)*100);
    const isRest= _session.restSec > 0;
    const isCD  = _session.timerType === 'countdown';

    const setsHTML = Array.from({length:ex.sets},(_,i)=>{
      const n    = i+1;
      const done = _session.completedSets.has(`${_session.currentEx}-${n}`);
      const curr = n===_session.currentSet && !done && !isRest;
      return `<div style="width:42px;height:42px;border-radius:50%;
        background:${done?'rgba(34,197,94,.2)':curr?'rgba(0,245,255,.15)':'rgba(255,255,255,.08)'};
        border:2px solid ${done?'#22c55e':curr?'var(--cyan)':'rgba(255,255,255,.2)'};
        display:flex;align-items:center;justify-content:center;
        font-size:14px;font-weight:700;color:${done?'#22c55e':curr?'var(--cyan)':'#888'};">
        ${done?'✓':n}
      </div>`;
    }).join('');

    return `
    <div style="min-height:100%;background:#000;display:flex;flex-direction:column;">
      <!-- Header -->
      <div style="padding:48px 20px 12px;display:flex;align-items:center;justify-content:space-between;">
        <button type="button" id="wo-exit"
  style="display:flex;align-items:center;gap:6px;
    color:var(--cyan,#00f5ff);background:rgba(0,245,255,.1);
    border:1px solid rgba(0,245,255,.3);border-radius:20px;
    padding:6px 14px;cursor:pointer;font-size:13px;font-weight:600;">
  <i data-lucide="arrow-left" style="width:16px;height:16px;color:var(--cyan,#00f5ff);"></i>
  Salir
</button>
        <div style="text-align:center;">
          <p style="font-size:14px;font-weight:700;color:#fff;">${_session.workoutName}</p>
          <p style="font-size:11px;color:#888;">Ejercicio ${_session.currentEx+1} de ${total}</p>
        </div>
        <div style="text-align:right;">
          <span style="font-size:10px;font-weight:700;color:#22c55e;background:rgba(34,197,94,.12);border:1px solid rgba(34,197,94,.3);padding:3px 8px;border-radius:20px;">EN VIVO</span>
          <p style="font-size:10px;color:#888;margin-top:3px;">${pct}%</p>
        </div>
      </div>

      <!-- Barra de progreso -->
      <div style="height:3px;background:rgba(255,255,255,.1);margin:0 20px 8px;">
        <div style="width:${pct}%;height:100%;background:var(--cyan,#00f5ff);transition:width .3s;"></div>
      </div>

      <!-- Timer -->
      <div style="text-align:center;padding:10px 20px 6px;">
        <div id="wo-timer" style="font-size:36px;font-weight:900;color:var(--cyan,#00f5ff);font-variant-numeric:tabular-nums;">
          ${_fmt(_session.elapsedSec)}
        </div>
        <p style="font-size:11px;color:#888;">Tiempo total</p>
      </div>

      <!-- Main card -->
      <div style="flex:1;padding:0 20px 16px;">
        ${isRest ? `
          <div style="background:rgba(0,245,255,.05);border:1px solid rgba(0,245,255,.2);border-radius:20px;padding:32px 20px;text-align:center;">
            <p style="font-size:12px;color:var(--cyan,#00f5ff);font-weight:700;letter-spacing:.08em;margin-bottom:14px;">DESCANSANDO ${isCD?'⏱':'⏲'}</p>
            <div id="wo-rest" style="font-size:64px;font-weight:900;color:var(--cyan,#00f5ff);line-height:1;">
              ${isCD ? _session.restSec : _fmt(_session.restSec)}
            </div>
            ${isCD?'<p style="font-size:12px;color:#888;margin-top:8px;">segundos</p>':''}
            <button type="button" id="wo-skip"
              style="margin-top:18px;padding:10px 24px;border-radius:20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;">
              Saltar descanso
            </button>
          </div>
        ` : `
          <div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:20px;padding:20px 18px;">
            <p style="font-size:11px;color:var(--cyan,#00f5ff);font-weight:600;margin-bottom:4px;">${ex.muscle||'Ejercicio'} · ${_session.currentEx+1}/${total}</p>
            <h2 style="font-size:24px;font-weight:800;color:#fff;margin-bottom:6px;line-height:1.2;">${ex.name}</h2>
            <p style="font-size:12px;color:#888;margin-bottom:16px;line-height:1.5;">${ex.description||'Realiza el movimiento con control y buena técnica.'}</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
              ${[['star','var(--cyan,#00f5ff)',ex.sets,'Series'],
                 ['repeat','var(--cyan,#00f5ff)',ex.reps,'Reps'],
                 ['clock','var(--cyan,#00f5ff)',ex.rest+'s','Descanso']].map(([ic,cl,v,l])=>`
                <div style="text-align:center;padding:12px 4px;background:rgba(0,245,255,.07);border-radius:12px;border:1px solid rgba(0,245,255,.2);">
                  <i data-lucide="${ic}" style="width:15px;height:15px;color:${cl};margin:0 auto;"></i>
                  <div style="font-size:18px;font-weight:800;color:${cl};margin-top:4px;">${v}</div>
                  <div style="font-size:10px;color:#888;margin-top:2px;">${l}</div>
                </div>`).join('')}
            </div>
            <p style="font-size:12px;font-weight:600;color:#888;margin-bottom:10px;">Progreso de series</p>
            <div style="display:flex;gap:10px;flex-wrap:wrap;">${setsHTML}</div>
          </div>
        `}
      </div>

      <!-- Botones de acción -->
      <div style="padding:8px 20px 32px;display:flex;align-items:center;gap:10px;">
        ${_session.currentEx>0?`
          <button type="button" id="wo-prev"
            style="width:48px;height:52px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
            <i data-lucide="chevron-left" style="width:20px;height:20px;"></i>
          </button>`:''}
        <button type="button" id="wo-complete"
          style="flex:1;padding:16px;border-radius:14px;background:${isRest?'rgba(255,255,255,.08)':'var(--cyan,#00f5ff)'};
            border:none;color:${isRest?'#666':'#000'};font-size:14px;font-weight:700;cursor:pointer;
            display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;">
          ${isRest
            ? `<span>Descansando...</span>`
            : `<i data-lucide="check" style="width:18px;height:18px;color:#000;"></i> Serie ${_session.currentSet} completada`
          }
        </button>
        ${_session.currentEx<_session.exercises.length-1?`
          <button type="button" id="wo-next"
            style="width:48px;height:52px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
            <i data-lucide="chevron-right" style="width:20px;height:20px;"></i>
          </button>`:''}
      </div>
    </div>`;
  },

  init() {
    /* Cronómetro general */
    if (_session.timerInterval) clearInterval(_session.timerInterval);
    _session.timerInterval = setInterval(() => {
      _session.elapsedSec++;
      const el = document.getElementById('wo-timer');
      if (el) el.textContent = _fmt(_session.elapsedSec);
    }, 1000);

    /* Timer de descanso */
    if (_session.restSec > 0) {
      if (_session.restInterval) clearInterval(_session.restInterval);
      const isCD = _session.timerType === 'countdown';
      let counter = isCD ? _session.restSec : 0;
      _session.restInterval = setInterval(() => {
        if (isCD) { counter--; _session.restSec = counter; }
        else      { counter++; _session.restSec = counter; }
        const el = document.getElementById('wo-rest');
        if (el) el.textContent = isCD ? counter : _fmt(counter);
        if (isCD && counter <= 0) {
          clearInterval(_session.restInterval);
          _session.restSec = 0;
          navigateTo('active-workout');
        }
      }, 1000);
      document.getElementById('wo-skip')?.addEventListener('click', () => {
        clearInterval(_session.restInterval); _session.restSec=0; navigateTo('active-workout');
      });
    }

    /* Salir */
    document.getElementById('wo-exit')?.addEventListener('click', () => {
  if (confirm('¿Salir del entrenamiento?\n\nTu progreso parcial no se guardará en estadísticas.')) {
    clearInterval(_session.timerInterval);
    clearInterval(_session.restInterval);
    /* Resetear sesión */
    _session = {
      workoutName:'', workoutId:null, exercises:[], currentEx:0, currentSet:1,
      completedSets:new Set(), elapsedSec:0, restSec:0,
      timerType:'countdown', timerInterval:null, restInterval:null,
    };
    navigateTo('train');
  }
});

    /* Completar serie */
    document.getElementById('wo-complete')?.addEventListener('click', () => {
      if (_session.restSec > 0) return;
      const ex  = _session.exercises[_session.currentEx];
      const key = `${_session.currentEx}-${_session.currentSet}`;
      _session.completedSets.add(key);

      if (_session.currentSet < ex.sets) {
        _session.currentSet++;
        _session.restSec = ex.rest;
      } else if (_session.currentEx < _session.exercises.length-1) {
        _session.currentEx++;
        _session.currentSet = 1;
        _session.restSec = ex.rest;
      } else {
        /* ¡ENTRENAMIENTO COMPLETO! */
        clearInterval(_session.timerInterval); clearInterval(_session.restInterval);
        const durMin = Math.max(1, Math.round(_session.elapsedSec/60));
        const cal    = Math.round(durMin * 7.5); // ~7.5 kcal/min promedio

        /* Guardar en localStorage */
        if (window.OlympusStats) {
          const result = OlympusStats.addWorkout({
            rutina_nombre: _session.workoutName,
            duracion_min:  durMin,
            calorias:      cal,
            ejercicios:    _session.exercises.map(e=>e.name),
          });
          /* Agregar XP con el sistema OlympusXP */
          if (window.OlympusXP) {
            OlympusXP.add(50, `Entrenamiento: ${_session.workoutName}`);
            /* Verificar bonus por racha */
            const stats = OlympusStats.get();
            OlympusXP.checkStreakBonus(stats.racha_actual || 0);
          }
          if (_session.workoutId) OlympusStats.completePlanWorkout(_session.workoutId);
        }

        /* Mostrar pantalla de completado con diseño */
        const overlay = document.createElement('div');
        overlay.className = 'workout-complete-overlay';
        overlay.innerHTML = `
          <div style="text-align:center;">
            <div style="width:80px;height:80px;border-radius:50%;background:rgba(0,245,255,.15);border:2px solid var(--cyan,#00f5ff);display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
              <i data-lucide="check" style="width:40px;height:40px;color:var(--cyan,#00f5ff);"></i>
            </div>
            <h2>¡Entrenamiento completado!</h2>
            <p style="font-size:14px;color:#888;margin-top:6px;margin-bottom:20px;">${_session.workoutName}</p>
            <div class="stat-row">
              <div class="stat-item"><div class="stat-val">⏱ ${_fmt(_session.elapsedSec)}</div><div class="stat-lbl">Tiempo</div></div>
              <div class="stat-item"><div class="stat-val">🔥 ${cal}</div><div class="stat-lbl">Kcal</div></div>
              <div class="stat-item"><div class="stat-val">⭐ +50</div><div class="stat-lbl">XP</div></div>
            </div>
            <button id="wo-done-btn" style="margin-top:24px;padding:14px 32px;border-radius:14px;background:var(--cyan,#00f5ff);border:none;color:#000;font-size:16px;font-weight:800;cursor:pointer;font-family:inherit;">
              ¡Excelente! 💪
            </button>
          </div>`;
        document.body.appendChild(overlay);
        if (window.lucide) lucide.createIcons();
        document.getElementById('wo-done-btn').addEventListener('click', () => {
          overlay.remove(); navigateTo('train');
        });
        return;
      }
      navigateTo('active-workout');
    });

    /* Navegación prev/next */
    document.getElementById('wo-prev')?.addEventListener('click', () => {
      clearInterval(_session.restInterval); _session.restSec=0;
      _session.currentEx--; _session.currentSet=1; navigateTo('active-workout');
    });
    document.getElementById('wo-next')?.addEventListener('click', () => {
      clearInterval(_session.restInterval); _session.restSec=0;
      _session.currentEx++; _session.currentSet=1; navigateTo('active-workout');
    });

    if (window.lucide) lucide.createIcons();
  }
};