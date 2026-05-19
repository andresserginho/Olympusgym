/*PROGRESS.JS — Estadísticas (localStorage)*/

let _chartMode = 'calories';

window.screens.progress = {
  render() {
    /* Leer stats reales */
    const stats    = window.OlympusStats ? OlympusStats.get() : {};
    const weekData = window.OlympusStats ? OlympusStats.getWeeklyData() : [];
    const u        = window.AppState.user;

    const totalEnt  = stats.total_entrenamientos || 0;
    const totalCal  = stats.total_calorias       || 0;
    const racha     = stats.racha_actual          || 0;
    const tiempoH   = ((stats.tiempo_total_min || 0) / 60).toFixed(1);

    /* SVG chart data */
    const chartValues = weekData.map(d => _chartMode === 'calories' ? d.calories : d.minutes);
    const maxVal = Math.max(...chartValues, 1);
    const W = 300, H = 70;
    const pts = chartValues.map((v, i) => ({
      x: (i / (chartValues.length - 1)) * W,
      y: H - (v / maxVal) * (H - 10) - 5
    }));
    let linePath = `M${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const cx1 = pts[i].x + (pts[i+1].x - pts[i].x) / 2.5;
      linePath += ` C${cx1},${pts[i].y} ${cx1},${pts[i+1].y} ${pts[i+1].x},${pts[i+1].y}`;
    }
    const areaPath = linePath + ` L${W},${H+5} L0,${H+5} Z`;

    const achieveHTML = _ACHIEVEMENTS.map(a => `
      <div style="padding:12px 8px;border-radius:12px;text-align:center;
        border:1px solid ${a.unlocked ? 'rgba(0,245,255,.3)' : 'rgba(255,255,255,.07)'};
        background:${a.unlocked ? 'rgba(0,245,255,.04)' : 'rgba(255,255,255,.02)'};
        opacity:${a.unlocked ? 1 : 0.5};cursor:pointer;" class="achieve-card"
        data-desc="${a.desc}" data-name="${a.name}">
        <i data-lucide="${a.icon}" style="width:20px;height:20px;
          color:${a.unlocked ? (a.color||'var(--cyan)') : '#555'};margin:0 auto 4px;"></i>
        <p style="font-size:10px;font-weight:700;color:${a.unlocked?'#fff':'#555'};margin-bottom:2px;">${a.name}</p>
        <p style="font-size:9px;color:#888;">${a.sub}</p>
        ${a.unlocked ? '' : '<p style="font-size:8px;color:#666;margin-top:2px;">🔒 Bloqueado</p>'}
      </div>`).join('');

    const unlockedCount = _ACHIEVEMENTS.filter(a => a.unlocked).length;

    const btnStyle = (mode) =>
      `padding:5px 12px;border-radius:20px;font-size:11px;font-weight:600;
      background:${_chartMode===mode?'var(--cyan)':'rgba(255,255,255,.07)'};
      color:${_chartMode===mode?'#000':'#888'};
      border:${_chartMode===mode?'none':'1px solid rgba(255,255,255,.1)'};cursor:pointer;`;

    return `
    <div class="screen-scroll" style="position:relative;">
      <div style="padding:40px 20px 14px;">
        <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:5px;">
          <i data-lucide="trending-up" style="width:11px;height:11px;color:var(--cyan);"></i> ESTADÍSTICAS
        </div>
        <h1 style="font-size:26px;font-weight:800;">Tu Progreso</h1>
      </div>

      <!-- Stats 2×2 con datos reales -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:0 20px 16px;">
        <div style="padding:14px;border-radius:14px;background:rgba(249,115,22,.04);border:1px solid rgba(249,115,22,.18);">
          <i data-lucide="flame" style="width:18px;height:18px;color:var(--orange);"></i>
          <div style="font-size:22px;font-weight:800;color:var(--orange);margin:5px 0 2px;">${totalCal.toLocaleString()}</div>
          <div style="font-size:10px;color:#888;line-height:1.3;">Calorías quemadas esta semana</div>
        </div>
        <div style="padding:14px;border-radius:14px;background:rgba(0,245,255,.03);border:1px solid rgba(0,245,255,.18);">
          <i data-lucide="clock" style="width:18px;height:18px;color:var(--cyan);"></i>
          <div style="font-size:22px;font-weight:800;color:var(--cyan);margin:5px 0 2px;">${tiempoH}</div>
          <div style="font-size:10px;color:#888;line-height:1.3;">Horas de entrenamiento</div>
        </div>
        <div style="padding:14px;border-radius:14px;background:rgba(168,85,247,.03);border:1px solid rgba(168,85,247,.18);">
          <i data-lucide="dumbbell" style="width:18px;height:18px;color:#a855f7;"></i>
          <div style="font-size:22px;font-weight:800;color:#a855f7;margin:5px 0 2px;">${totalEnt}</div>
          <div style="font-size:10px;color:#888;line-height:1.3;">Entrenamientos completados</div>
        </div>
        <div style="padding:14px;border-radius:14px;background:rgba(251,191,36,.03);border:1px solid rgba(251,191,36,.18);">
          <i data-lucide="star" style="width:18px;height:18px;color:var(--gold);"></i>
          <div style="font-size:22px;font-weight:800;color:var(--gold);margin:5px 0 2px;">${racha}</div>
          <div style="font-size:10px;color:#888;line-height:1.3;">Racha actual de días</div>
        </div>
      </div>

      <!-- Gráfica semanal -->
      <div style="padding:0 20px 16px;">
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:10px;">
          <div><p style="font-size:15px;font-weight:700;">Esta semana</p><p style="font-size:11px;color:#888;">Actividad diaria</p></div>
          <div style="display:flex;gap:6px;">
            <button type="button" id="prog-cal-btn" style="${btnStyle('calories')}">Calorías</button>
            <button type="button" id="prog-min-btn" style="${btnStyle('minutes')}">Minutos</button>
          </div>
        </div>
        <div style="background:rgba(255,255,255,.02);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:14px;overflow:hidden;">
          <svg width="100%" height="80" viewBox="0 0 300 70" preserveAspectRatio="none">
            <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#00f5ff" stop-opacity=".2"/>
              <stop offset="100%" stop-color="#00f5ff" stop-opacity=".02"/>
            </linearGradient></defs>
            <line x1="0" y1="18" x2="300" y2="18" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
            <line x1="0" y1="35" x2="300" y2="35" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
            <line x1="0" y1="52" x2="300" y2="52" stroke="rgba(255,255,255,.05)" stroke-width="1"/>
            <path d="${areaPath}" fill="url(#cg)"/>
            <path d="${linePath}" fill="none" stroke="#00f5ff" stroke-width="2" stroke-linecap="round"/>
            ${pts.map(p => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3" fill="#00f5ff" opacity=".7"/>`).join('')}
          </svg>
          <div style="display:flex;justify-content:space-around;margin-top:8px;">
            ${weekData.map(d=>`<span style="font-size:10px;color:#666;">${d.day}</span>`).join('')}
          </div>
        </div>
      </div>

      <!-- Logros con descripciones -->
      <div style="padding:0 20px 100px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
          <p style="font-size:15px;font-weight:700;">Logros</p>
          <span style="font-size:11px;font-weight:600;color:var(--gold);background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.25);padding:3px 10px;border-radius:20px;">
            ${unlockedCount}/${_ACHIEVEMENTS.length} desbloqueados
          </span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;">${achieveHTML}</div>
        <p style="font-size:10px;color:#555;text-align:center;margin-top:12px;">
          💡 Toca un logro para ver cómo desbloquearlo
        </p>
      </div>
      <button type="button" class="dash-fab-chat" id="prog-fab"><i data-lucide="message-circle"></i></button>
    </div>`;
  },
  init() {
    document.getElementById('prog-cal-btn')?.addEventListener('click', () => { _chartMode='calories'; navigateTo('progress'); });
    document.getElementById('prog-min-btn')?.addEventListener('click', () => { _chartMode='minutes'; navigateTo('progress'); });

    /* Logros clickeables — muestra descripción */
    document.querySelectorAll('.achieve-card').forEach(card => {
      card.addEventListener('click', () => {
        const name = card.dataset.name;
        const desc = card.dataset.desc;
        const panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:7000;display:flex;align-items:center;justify-content:center;padding:24px;';
        panel.innerHTML = `
          <div style="background:#0d0d0d;border:1px solid rgba(0,245,255,.2);border-radius:16px;padding:24px;max-width:360px;width:100%;text-align:center;">
            <p style="font-size:17px;font-weight:700;margin-bottom:10px;">${name}</p>
            <p style="font-size:13px;color:#aaa;line-height:1.6;margin-bottom:18px;">${desc}</p>
            <button style="padding:10px 24px;border-radius:20px;background:var(--cyan,#00f5ff);border:none;color:#000;font-weight:700;cursor:pointer;font-family:inherit;">Entendido</button>
          </div>`;
        document.body.appendChild(panel);
        panel.addEventListener('click', e => { if(e.target===panel || e.target.tagName==='BUTTON') panel.remove(); });
      });
    });
    if (window.lucide) lucide.createIcons();
  }
};

/* Catálogo de logros con descripciones de cómo desbloquear */
const _ACHIEVEMENTS = [
  { icon:'flame',      name:'En Fuego',   sub:'8 días seguidos',
    desc:'Completa un entrenamiento 8 días seguidos sin saltarte ninguno.',
    color:'var(--orange)', unlocked: false },
  { icon:'dumbbell',   name:'Iron Man',   sub:'30 entrenamientos',
    desc:'Completa un total de 30 sesiones de entrenamiento en la app.',
    color:'var(--cyan)',   unlocked: false },
  { icon:'star',       name:'Élite',      sub:'Top 10% este mes',
    desc:'Entrena más que el 90% de usuarios durante un mes completo.',
    color:'var(--gold)',   unlocked: false },
  { icon:'calendar',   name:'Constante',  sub:'4 sem activo',
    desc:'Entrena al menos 3 veces por semana durante 4 semanas seguidas.',
    color:'#22c55e',       unlocked: false },
  { icon:'zap',        name:'Explosivo',  sub:'HIIT x5 seguidos',
    desc:'Completa 5 sesiones de entrenamiento HIIT consecutivas.',
    unlocked: false },
  { icon:'check-circle',name:'Perfecto', sub:'Semana sin fallo',
    desc:'Completa TODOS los días de tu plan de entrenamiento en una semana.',
    unlocked: false },
];

/* Actualizar logros según stats reales */
function _updateAchievements() {
  if (!window.OlympusStats) return;
  const stats = OlympusStats.get();
  _ACHIEVEMENTS[0].unlocked = (stats.racha_actual || 0) >= 8;
  _ACHIEVEMENTS[1].unlocked = (stats.total_entrenamientos || 0) >= 30;
  _ACHIEVEMENTS[3].unlocked = (stats.racha_maxima || 0) >= 21; // ~4 semanas
}