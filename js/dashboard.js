/* DASHBOARD.JS — Pantalla de Control Principal */

function cyclePhaseMock() {
  const u = window.AppState.user;
  if (!u.lastCycleDate || !u.cycleOptIn)
    return { day:'?', phase:'No configurado', detail:'Configura en perfil.' };
  const diff = Math.floor(Math.abs(new Date()-new Date(u.lastCycleDate))/86400000);
  const day  = (diff%28)+1;
  if (day<=5)  return {day, phase:'Menstrual', detail:'Prioriza recuperación.'};
  if (day<=14) return {day, phase:'Folicular',  detail:'Energía en ascenso.'};
  if (day<=17) return {day, phase:'Ovulación',  detail:'Pico de fuerza.'};
  return {day, phase:'Lútea', detail:'Cuidado con la fatiga.'};
}

const _WEEK_DAYS = ['L','M','X','J','V','S','D'];

window.screens.dashboard = {
  render() {
    const u = window.AppState.user;

    /* Stats reales */
    let stats={}, wp={completados:0,objetivo:3,diasEntrenados:new Set()};
    let totalCal=0, totalEnt=0, unread=0;
    try {
      stats      = window.OlympusStats ? OlympusStats.get() : {};
      wp         = window.OlympusStats ? OlympusStats.getWeeklyProgress() : wp;
      totalCal   = stats.total_calorias || 0;
      totalEnt   = stats.total_entrenamientos || 0;
      unread     = window.OlympusNotif  ? OlympusNotif.count() : 0;
    } catch(_) {}

    const xpPct = Math.min(100, ((u.xp||0)/(u.xpToNext||1000))*100);
    const cycle = cyclePhaseMock();

    /* Actividad reciente — solo entrenamientos reales */
    let recentWorkouts = [];
    try {
      recentWorkouts = (window.OlympusStats?OlympusStats.getWorkouts():[])
        .slice(-3).reverse();
    } catch(_) {}

    const actHTML = recentWorkouts.length > 0
      ? recentWorkouts.map(w => `
          <div class="card" style="padding:12px 14px;display:flex;align-items:center;gap:11px;border-color:rgba(255,255,255,.07);">
            <div style="width:40px;height:40px;border-radius:11px;background:rgba(0,245,255,.07);border:1px solid rgba(0,245,255,.16);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="dumbbell" style="width:17px;height:17px;color:var(--cyan);"></i>
            </div>
            <div style="flex:1;min-width:0;">
              <p style="font-size:13px;font-weight:600;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${w.rutina_nombre}</p>
              <p style="font-size:11px;color:#888;">${w.duracion_min} min · ${w.calorias} kcal</p>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;">
              <span style="font-size:10px;color:#666;">${w.hora || w.fecha}</span>
              <span style="font-size:10px;font-weight:600;color:var(--cyan);background:rgba(0,245,255,.1);padding:2px 8px;border-radius:10px;">+${w.xp_ganado||50} XP</span>
            </div>
          </div>`)
          .join('')
      : `<div style="padding:24px;text-align:center;color:#666;font-size:13px;">
           <i data-lucide="dumbbell" style="width:32px;height:32px;margin:0 auto 8px;opacity:.3;"></i>
           <p>Aún no tienes entrenamientos.</p>
           <p style="font-size:12px;margin-top:4px;">¡Ve a Entrena y completa tu primera rutina!</p>
         </div>`;

    /* Días de la semana con checkmarks */
    const weekHTML = _WEEK_DAYS.map((d, i) => {
      const done = wp.diasEntrenados.has(i);
      return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;">
        <div style="width:100%;max-width:38px;aspect-ratio:1;border-radius:10px;
          background:${done?'var(--cyan)':'rgba(255,255,255,.06)'};
          border:1px solid ${done?'var(--cyan)':'rgba(255,255,255,.1)'};
          display:flex;align-items:center;justify-content:center;">
          ${done?'<i data-lucide="check" style="width:13px;height:13px;color:#000;"></i>':''}
        </div>
        <span style="font-size:10px;color:${done?'var(--cyan)':'#666'};">${d}</span>
      </div>`;
    }).join('');

    return `
    <div class="screen-scroll dash-screen" style="position:relative;">
      <!-- Header -->
      <div class="fade-in" style="padding:52px 20px 14px;display:flex;justify-content:space-between;align-items:flex-start;">
        <div>
          <p style="font-size:11px;color:#666;margin-bottom:2px;">${formatDate()}</p>
          <h1 style="font-size:23px;font-weight:800;line-height:1.2;">
            Hola, <span style="color:var(--cyan);">${u.name||'Atleta'}</span> 👋
          </h1>
          <p style="font-size:12px;color:#888;margin-top:3px;">Listo para superar tus límites?</p>
        </div>
        <button id="dash-notif-btn"
          style="width:42px;height:42px;border-radius:50%;background:rgba(255,255,255,.04);
            border:1px solid rgba(0,245,255,.25);display:flex;align-items:center;
            justify-content:center;flex-shrink:0;position:relative;">
          <i data-lucide="bell" style="width:19px;height:19px;color:#888;"></i>
          ${unread>0?`<span style="position:absolute;top:-2px;right:-2px;width:16px;height:16px;
            border-radius:50%;background:#ef4444;border:2px solid #080808;font-size:9px;font-weight:700;
            display:flex;align-items:center;justify-content:center;color:#fff;">${unread>9?'9+':unread}</span>`:''}
        </button>
      </div>

      <!-- XP -->
      <div class="fade-in-up delay-1" style="padding:0 20px 14px;">
        <div class="card" style="padding:13px 15px;border-color:rgba(0,245,255,.12);background:rgba(0,245,255,.02);">
          <div style="display:flex;align-items:center;gap:10px;">
            <i data-lucide="star" style="color:var(--gold,#fbbf24);width:18px;height:18px;flex-shrink:0;"></i>
            <div style="flex:1;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                <span style="font-size:13px;font-weight:700;">Nivel ${u.level||1}</span>
                <span style="font-size:11px;color:#888;">${u.xp||0}/${u.xpToNext||1000} XP <span style="color:var(--gold,#fbbf24);font-weight:600;">→ Nv ${(u.level||1)+1}</span></span>
              </div>
              <div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
                <div style="width:${xpPct}%;height:100%;background:linear-gradient(90deg,var(--cyan),#0099cc);border-radius:3px;transition:width .5s;"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats reales -->
      <div class="fade-in-up delay-2" style="padding:0 20px 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
        <div class="stat-card" style="text-align:center;padding:13px 6px;">
          <i data-lucide="flame" style="color:var(--orange,#f97316);"></i>
          <div style="font-size:20px;font-weight:700;color:var(--orange,#f97316);margin-top:3px;">${u.streak||stats.racha_actual||0}</div>
          <div style="font-size:9px;color:#666;margin-top:1px;">Racha</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:13px 6px;">
          <i data-lucide="zap" style="color:var(--cyan);"></i>
          <div style="font-size:20px;font-weight:700;color:var(--cyan);margin-top:3px;">${totalCal>999?(totalCal/1000).toFixed(1)+'k':totalCal}</div>
          <div style="font-size:9px;color:#666;margin-top:1px;">Kcal total</div>
        </div>
        <div class="stat-card" style="text-align:center;padding:13px 6px;">
          <i data-lucide="trophy" style="color:var(--gold,#fbbf24);"></i>
          <div style="font-size:20px;font-weight:700;color:var(--gold,#fbbf24);margin-top:3px;">${totalEnt}</div>
          <div style="font-size:9px;color:#666;margin-top:1px;">Entrenos</div>
        </div>
      </div>

      <!-- Ciclo menstrual -->
      ${u.gender==='female'&&u.cycleOptIn?`
      <div class="fade-in-up delay-3" style="padding:0 20px 14px;">
        <div class="card" style="padding:15px;border-color:rgba(236,72,153,.3);">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
            <div>
              <p style="font-size:10px;color:var(--pink,#ec4899);letter-spacing:.06em;margin-bottom:3px;">CICLO MENSTRUAL</p>
              <strong style="font-size:15px;">Fase: ${cycle.phase}</strong>
              <p style="font-size:12px;color:#888;margin-top:4px;">Día ${cycle.day} · ${cycle.detail}</p>
            </div>
            <i data-lucide="heart" style="width:20px;height:20px;color:var(--pink,#ec4899);flex-shrink:0;"></i>
          </div>
        </div>
      </div>`:''}

      <!-- Reto activo -->
      <div class="fade-in-up delay-3" style="padding:0 20px 14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h2 style="font-size:15px;font-weight:700;">Reto activo</h2>
          <button type="button" id="dash-ver-retos"
            style="font-size:12px;color:var(--cyan);background:none;border:none;cursor:pointer;padding:0;">
            Ver todos
          </button>
        </div>
        ${(()=>{
          let ch={progress:0,status:'pendiente'};
          try{ ch=(window.OlympusStats?OlympusStats.getChallenges():{'ch1':{progress:0,status:'pendiente'}})['ch1']||ch; }catch(_){}
          const pct=Math.round((ch.progress/5)*100);
          return `<div class="card" style="padding:16px;border-color:rgba(255,165,0,.2);background:rgba(255,100,0,.03);">
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
              <div>
                <p style="font-size:15px;font-weight:700;margin-bottom:3px;">Semana de Fuego 🔥</p>
                <p style="font-size:11px;color:#888;">${ch.progress}/5 entrenamientos · ${ch.status==='completado'?'¡Completado!':'En progreso'}</p>
              </div>
              <span style="font-size:11px;font-weight:700;color:var(--gold,#fbbf24);background:rgba(255,165,0,.15);border:1px solid rgba(255,165,0,.3);padding:4px 10px;border-radius:20px;white-space:nowrap;flex-shrink:0;margin-left:10px;">+500 XP</span>
            </div>
            <div style="height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
              <div style="width:${pct}%;height:100%;background:linear-gradient(90deg,var(--orange,#f97316),var(--gold,#fbbf24));border-radius:3px;"></div>
            </div>
          </div>`;
        })()}
      </div>

      <!-- Entrenamiento del día -->
      <div class="fade-in-up delay-4" style="padding:0 20px 14px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h2 style="font-size:15px;font-weight:700;">Entrenamiento de hoy</h2>
          <span style="font-size:11px;color:var(--cyan);background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);padding:3px 10px;border-radius:20px;">Día 1</span>
        </div>
        <div class="card" style="position:relative;overflow:hidden;background:#050505;border-color:rgba(0,245,255,.15);">
          <div style="position:absolute;inset:0;background:url('https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?w=800&q=80') center/cover;opacity:.18;"></div>
          <div style="position:relative;padding:18px;">
            <div style="display:inline-flex;align-items:center;gap:5px;background:rgba(0,245,255,.12);border:1px solid rgba(0,245,255,.3);padding:4px 12px;border-radius:20px;margin-bottom:10px;">
              <i data-lucide="zap" style="width:11px;height:11px;color:var(--cyan);"></i>
              <span style="font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);">FUERZA</span>
            </div>
            <h3 style="font-size:21px;font-weight:800;margin-bottom:3px;">Full Body Power</h3>
            <p style="font-size:12px;color:#888;margin-bottom:16px;">6 ejercicios · Intermedio</p>
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;gap:14px;">
                <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#888;"><i data-lucide="clock" style="width:13px;height:13px;"></i><span>45 min</span></div>
                <div style="display:flex;align-items:center;gap:5px;font-size:11px;color:#888;"><i data-lucide="flame" style="width:13px;height:13px;color:var(--orange,#f97316);"></i><span>~350 kcal</span></div>
              </div>
              <button id="dash-play-btn" type="button"
                style="width:48px;height:48px;border-radius:50%;background:var(--cyan);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 0 20px rgba(0,245,255,.5);">
                <i data-lucide="play" style="width:20px;height:20px;color:#000;margin-left:2px;"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Progreso semanal REAL -->
      <div class="fade-in-up delay-5" style="padding:0 20px 14px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
          <div>
            <h2 style="font-size:15px;font-weight:700;">Progreso semanal</h2>
            <p style="font-size:11px;color:#888;margin-top:2px;">${wp.completados} de ${wp.objetivo} días completados</p>
          </div>
          <span style="font-size:11px;font-weight:600;color:${wp.completados>=wp.objetivo?'#22c55e':'var(--cyan)'};background:${wp.completados>=wp.objetivo?'rgba(34,197,94,.1)':'rgba(0,245,255,.1)'};border:1px solid ${wp.completados>=wp.objetivo?'rgba(34,197,94,.25)':'rgba(0,245,255,.25)'};padding:3px 10px;border-radius:20px;">
            ${wp.completados}/${wp.objetivo}
          </span>
        </div>
        <div style="display:flex;gap:6px;justify-content:space-between;">${weekHTML}</div>
      </div>

      <!-- Actividad reciente REAL -->
      <div class="fade-in-up delay-5" style="padding:0 20px 24px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <h2 style="font-size:15px;font-weight:700;">Actividad reciente</h2>
          <button type="button" id="dash-ver-actividad"
            style="font-size:12px;color:var(--cyan);background:none;border:none;cursor:pointer;padding:0;">
            Ver todo
          </button>
        </div>
        <div style="display:flex;flex-direction:column;gap:9px;">${actHTML}</div>
      </div>

      <button type="button" class="dash-fab-chat" id="dash-chat-fab">
        <i data-lucide="message-circle"></i>
      </button>
    </div>`;
  },
  init() {
    document.getElementById('dash-notif-btn')?.addEventListener('click', () => window._openNotifPanel && _openNotifPanel());
    document.getElementById('dash-play-btn')?.addEventListener('click',      () => navigateTo('train'));
    document.getElementById('dash-ver-retos')?.addEventListener('click',     () => navigateTo('challenges'));
    document.getElementById('dash-ver-actividad')?.addEventListener('click', () => navigateTo('progress'));
    if (window.lucide) lucide.createIcons();
    window._initFABDrag && window._initFABDrag();
  }
};