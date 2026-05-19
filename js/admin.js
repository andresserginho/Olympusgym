/*ADMIN.JS — Panel de Administración Olympus*/

let _adminTab = 'dashboard';
let _userSearch = '';

/*Stats reales desde localStorage*/
function _getRealStats() {
  const testUsers  = window.AppState.testUsers || [];
  const savedUsers = JSON.parse(localStorage.getItem('olympus_users') || '[]');

  const seen = new Set();
  const all  = [];
  [...testUsers, ...savedUsers].forEach(u => {
    if (!seen.has(u.email)) { seen.add(u.email); all.push(u); }
  });

  const now    = new Date();
  const weekMs = 7 * 86400000;
  let totalWorkouts=0, totalCal=0, activeWk=0;
  const atRisk=[];

  all.forEach(u => {
    const s = JSON.parse(localStorage.getItem(`olympus_stats_${u.email}`)||'{}');
    totalWorkouts += s.total_entrenamientos || 0;
    totalCal      += s.total_calorias       || 0;
    if (s.ultimo_entrenamiento) {
      const diff = now - new Date(s.ultimo_entrenamiento);
      if (diff <= weekMs) activeWk++;
      if (diff > weekMs * 2 && (s.total_entrenamientos||0) > 0)
        atRisk.push({ ...u, streak:s.racha_actual||0, last:s.ultimo_entrenamiento });
    }
  });

  return { totalUsers:all.length, activeWk, totalWorkouts, totalCal, atRisk:atRisk.slice(0,5), all };
}

function _getAllUsers() {
  const testUsers  = window.AppState.testUsers || [];
  const savedUsers = JSON.parse(localStorage.getItem('olympus_users') || '[]');
  const susp       = JSON.parse(localStorage.getItem('olympus_admin_suspensions') || '{}');
  const seen = new Set();
  const all  = [];
  [...testUsers, ...savedUsers].forEach(u => {
    if (seen.has(u.email)) return;
    seen.add(u.email);
    const s = JSON.parse(localStorage.getItem(`olympus_stats_${u.email}`)||'{}');
    const ini = (u.name||'?').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    const colors = ['#22c55e','#f97316','#a855f7','#00f5ff','#fbbf24','#ef4444','#0ea5e9'];
    const bg = colors[Math.abs(u.email.split('').reduce((a,c)=>a+c.charCodeAt(0),0)) % colors.length];
    all.push({
      id: u.email, name:u.name, email:u.email, ini, bg,
      status: susp[u.email] || ((s.racha_actual||0)===0 && (s.total_entrenamientos||0)>0 ? 'riesgo':'activo'),
      level: u.level||1, streak:s.racha_actual||0, workouts:s.total_entrenamientos||0,
    });
  });
  return all;
}

/*Nav inferior del admin*/
function _adminNav(current) {
  const items = [
    ['admin-dashboard','bar-chart-2','Dashboard'],
    ['admin-usuarios', 'users',      'Usuarios'],
    ['admin-seguridad','shield',     'Seguridad'],
    ['admin-contenido','package',    'Contenido'],
    ['admin-config',   'settings',  'Config'],
  ];
  return `
  <div style="flex-shrink:0;display:flex;justify-content:space-around;align-items:center;
    background:rgba(5,5,5,.97);border-top:1px solid rgba(0,245,255,.15);
    padding:8px 0 max(18px,env(safe-area-inset-bottom,18px));min-height:62px;">
    ${items.map(([route,icon,label])=>`
      <button type="button" class="nav-item admin-tab-btn ${current===route?'active':''}" data-route="${route}"
        style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;
          background:none;border:none;cursor:pointer;padding:5px 2px;font-family:inherit;
          color:${current===route?'var(--cyan,#00f5ff)':'#666'};font-size:9px;font-weight:500;">
        <i data-lucide="${icon}" style="width:22px;height:22px;color:${current===route?'var(--cyan,#00f5ff)':'#555'};"></i>
        ${label}
      </button>`).join('')}
  </div>`;
}

/*Header mini del admin*/
function _adminMiniHeader() {
  return `
  <div style="flex-shrink:0;background:#040408;border-bottom:1px solid rgba(0,245,255,.12);
    padding:10px 20px;display:flex;justify-content:space-between;align-items:center;">
    <div style="display:flex;align-items:center;gap:8px;">
      <div style="width:28px;height:28px;border-radius:6px;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.3);
        display:flex;align-items:center;justify-content:center;font-weight:800;color:var(--cyan,#00f5ff);font-size:11px;">AK</div>
      <div>
        <p style="font-size:11px;font-weight:700;color:#fff;">Panel Administrador</p>
        <p style="font-size:9px;color:var(--cyan,#00f5ff);">${window.AppState?.user?.email||'admin@olympus.com'}</p>
      </div>
    </div>
    <button type="button" id="adm-logout"
      style="padding:5px 12px;border-radius:8px;background:transparent;border:1px solid rgba(239,68,68,.4);
        color:#ef4444;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;
        display:flex;align-items:center;gap:4px;">
      <i data-lucide="log-out" style="width:12px;height:12px;"></i> Salir
    </button>
  </div>`;
}

// ═══════════════════════════════════════════════════
// FIX: _adminCommonInit — layout corregido
// ═══════════════════════════════════════════════════
function _adminCommonInit() {
  const app = document.getElementById('app');
  const sc  = document.getElementById('screen-container');

  // Expandir a pantalla completa SIN romper la altura fija
  if (app) {
    app.style.maxWidth  = '100%';
    app.style.width     = '100%';
    app.style.height    = '100vh';   // ← FIJO: no 'auto'
    app.style.minHeight = '';         // ← SIN min-height extra
    app.style.overflow  = 'hidden';  // ← NO scrolleable en el contenedor raíz
  }
  // El screen-container tampoco debe scrollear (cada pantalla admin maneja su scroll interno)
  if (sc) {
    sc.style.overflow = 'hidden';
    sc.style.height   = '100%';
  }

  // Nav tabs
  document.querySelectorAll('.admin-tab-btn').forEach(btn =>
    btn.addEventListener('click', () => navigateTo(btn.dataset.route))
  );

  // Logout — restaurar layout de usuario normal
  document.getElementById('adm-logout')?.addEventListener('click', () => {
    if (confirm('¿Cerrar sesión del panel de administrador?')) {
      const app2 = document.getElementById('app');
      const sc2  = document.getElementById('screen-container');
      if (app2) {
        app2.style.maxWidth  = '430px';
        app2.style.width     = '';
        app2.style.height    = '100vh';
        app2.style.minHeight = '';
        app2.style.overflow  = 'hidden';
      }
      if (sc2) { sc2.style.overflow = ''; sc2.style.height = ''; }

      localStorage.removeItem('olympus_session');
      localStorage.removeItem('olympus_active_tab');
      sessionStorage.removeItem('olympus_tab');
      window.AppState.user = {name:'',email:'',role:'user',gender:'male',level:1,xp:0,xpToNext:1000,streak:0,emailVerified:false};
      _adminTab = 'dashboard';
      const nav = document.getElementById('bottom-nav');
      if (nav) { nav.hidden=true; nav.classList.add('hidden'); }
      navigateTo('welcome');
    }
  });

  if (window.lucide) lucide.createIcons();
}

/*DASHBOARD ADMIN*/
window.screens['admin-dashboard'] = {
  render() {
    const s = _getRealStats();

    const kpi = (icon,val,label,color,badge) => `
      <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;position:relative;">
        <i data-lucide="${icon}" style="width:18px;height:18px;color:${color};margin-bottom:8px;"></i>
        <div style="font-size:28px;font-weight:900;color:${color};line-height:1;">${typeof val==='number'?val.toLocaleString():val}</div>
        <div style="font-size:11px;color:#888;margin-top:4px;">${label}</div>
        ${badge?`<span style="position:absolute;top:12px;right:12px;font-size:9px;font-weight:700;color:#000;background:${color};padding:2px 6px;border-radius:10px;">${badge}</span>`:''}
      </div>`;

    const feed = [
      { ini:'MG', bg:'#22c55e', text:'María González completó Full Body Power',    time:'Hace 2 min' },
      { ini:'CR', bg:'#f97316', text:'Carlos Ruiz desbloqueó Semana de Fuego',     time:'Hace 8 min' },
      { ini:'JM', bg:'#00f5ff', text:'José Martínez alcanzó Nivel 20',             time:'Hace 1h'    },
      { ini:'SC', bg:'#ef4444', text:'Sofia Chen lleva 0 días de racha',           time:'Hace 3h'    },
    ];

    return `
    <div style="display:flex;flex-direction:column;height:100%;background:#080810;color:#fff;">
      ${_adminMiniHeader()}
      <div style="flex:1;overflow-y:auto;padding:16px;">

        <p style="font-size:9px;font-weight:700;letter-spacing:.1em;color:#555;margin-bottom:10px;">DATOS REALES DEL SISTEMA</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px;">
          ${kpi('users',      s.totalUsers,    'Usuarios totales',      '#fbbf24', `+${s.totalUsers}`)}
          ${kpi('dumbbell',   s.totalWorkouts, 'Entrenamientos totales','#22c55e', null)}
          ${kpi('zap',        s.activeWk,      'Activos esta semana',   '#00f5ff', null)}
          ${kpi('flame',      s.totalCal,      'Kcal totales quemadas', '#f97316', null)}
        </div>

        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;margin-bottom:16px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <p style="font-size:12px;font-weight:700;">Tasa de Retención</p>
            <span style="font-size:16px;font-weight:800;color:#22c55e;">
              ${s.totalUsers > 0 ? Math.round((s.activeWk/s.totalUsers)*100) : 0}%
            </span>
          </div>
          <svg width="100%" height="50" viewBox="0 0 400 50" preserveAspectRatio="none">
            <defs><linearGradient id="rg2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#22c55e" stop-opacity=".25"/>
              <stop offset="100%" stop-color="#22c55e" stop-opacity=".02"/>
            </linearGradient></defs>
            <path d="M0,40 C50,38 80,22 130,20 C180,18 220,28 260,18 C300,10 340,14 400,10 L400,55 L0,55 Z" fill="url(#rg2)"/>
            <path d="M0,40 C50,38 80,22 130,20 C180,18 220,28 260,18 C300,10 340,14 400,10" fill="none" stroke="#22c55e" stroke-width="2"/>
          </svg>
        </div>

        ${s.atRisk.length > 0 ? `
        <div style="background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.35);border-radius:12px;padding:14px;margin-bottom:16px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
            <i data-lucide="alert-triangle" style="width:15px;height:15px;color:#ef4444;"></i>
            <p style="font-size:12px;font-weight:700;color:#ef4444;">⚠️ Usuarios en riesgo (${s.atRisk.length})</p>
          </div>
          <p style="font-size:10px;color:#888;margin-bottom:10px;">Más de 14 días sin entrenar</p>
          ${s.atRisk.map(u=>`
            <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid rgba(255,255,255,.05);">
              <div><p style="font-size:11px;font-weight:600;">${u.name}</p><p style="font-size:10px;color:#888;">${u.email}</p></div>
              <span style="font-size:10px;color:#ef4444;font-weight:600;">Racha: ${u.streak}d</span>
            </div>`).join('')}
          <button type="button" id="adm-notify-risk"
            style="width:100%;margin-top:10px;padding:9px;border-radius:8px;background:rgba(239,68,68,.12);
              border:1px solid rgba(239,68,68,.3);color:#ef4444;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;">
            Enviar notificación automática
          </button>
        </div>` : `
        <div style="background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.2);border-radius:12px;padding:14px;margin-bottom:16px;">
          <p style="font-size:12px;color:#22c55e;font-weight:700;">✅ Sin usuarios en riesgo</p>
          <p style="font-size:10px;color:#888;margin-top:4px;">Todos los usuarios han entrenado recientemente</p>
        </div>`}

        <p style="font-size:9px;font-weight:700;letter-spacing:.1em;color:#555;margin-bottom:10px;">DISTRIBUCIÓN</p>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:16px;">
          <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#22c55e;">${s.activeWk}</div>
            <div style="font-size:9px;color:#888;margin-top:3px;">Activos</div>
          </div>
          <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#fbbf24;" id="adm-live-total">${s.totalUsers}</div>
            <div style="font-size:9px;color:#888;margin-top:3px;">Total users</div>
          </div>
          <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:14px;text-align:center;">
            <div style="font-size:22px;font-weight:800;color:#ef4444;">${s.atRisk.length}</div>
            <div style="font-size:9px;color:#888;margin-top:3px;">En riesgo</div>
          </div>
        </div>

        <p style="font-size:9px;font-weight:700;letter-spacing:.1em;color:#555;margin-bottom:10px;">FEED DE ACTIVIDAD</p>
        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;">
          ${feed.map(f=>`
            <div style="display:flex;align-items:center;gap:10px;padding:11px 14px;border-bottom:1px solid rgba(255,255,255,.04);">
              <div style="width:30px;height:30px;border-radius:50%;background:${f.bg}22;border:1px solid ${f.bg}55;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:${f.bg};flex-shrink:0;">${f.ini}</div>
              <p style="flex:1;font-size:11px;color:#ccc;">${f.text}</p>
              <span style="font-size:9px;color:#555;white-space:nowrap;">${f.time}</span>
            </div>`).join('')}
        </div>
        <div style="height:16px;"></div>
      </div>
      ${_adminNav('admin-dashboard')}
    </div>`;
  },
  init() {
    _adminCommonInit();
    document.getElementById('adm-notify-risk')?.addEventListener('click',
      () => alert('✅ Notificación enviada a usuarios en riesgo')
    );
  }
};

/*USUARIOS GESTION ADMIN*/
window.screens['admin-usuarios'] = {
  render() {
    const allUsers = _getAllUsers();
    const filtered = _userSearch
      ? allUsers.filter(u =>
          u.name.toLowerCase().includes(_userSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(_userSearch.toLowerCase()))
      : allUsers;

    const badge = (status) => {
      const map = { activo:['Activo','#22c55e'], riesgo:['En riesgo','#ef4444'], suspendido:['Suspendido','#f97316'], inactivo:['Inactivo','#888'] };
      const [l,c] = map[status]||['?','#888'];
      return `<span style="font-size:9px;font-weight:700;color:#000;background:${c};padding:2px 8px;border-radius:20px;">${l}</span>`;
    };

    return `
    <div style="display:flex;flex-direction:column;height:100%;background:#080810;color:#fff;">
      ${_adminMiniHeader()}
      <div style="flex:1;overflow-y:auto;padding:14px;">

        <div style="position:relative;margin-bottom:14px;">
          <i data-lucide="search" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);width:15px;height:15px;color:#555;"></i>
          <input type="text" id="adm-search" value="${_userSearch}"
            placeholder="Buscar usuarios por nombre o correo..."
            style="width:100%;padding:11px 14px 11px 38px;background:#0a0a12;border:1px solid rgba(255,255,255,.12);
              border-radius:10px;color:#fff;font-size:13px;font-family:inherit;outline:none;">
        </div>

        <p style="font-size:10px;color:#555;margin-bottom:10px;">${filtered.length} usuario(s) · ${_getAllUsers().length} total</p>

        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;">
          ${filtered.map(u => `
            <div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.04);">
              <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
                <div style="width:38px;height:38px;border-radius:50%;background:${u.bg}22;border:1px solid ${u.bg}55;
                  display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:${u.bg};flex-shrink:0;">${u.ini}</div>
                <div style="flex:1;min-width:0;">
                  <p style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.name}</p>
                  <p style="font-size:10px;color:#888;">${u.email}</p>
                </div>
                <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;">
                  ${badge(u.status)}
                  <span style="font-size:9px;color:#666;">Nv ${u.level} · ${u.streak}d racha · ${u.workouts} entrenos</span>
                </div>
              </div>
              <div style="display:flex;gap:6px;">
                ${u.status!=='activo'?`<button type="button" class="adm-action" data-uid="${u.id}" data-a="activar"
                  style="flex:1;padding:6px;border-radius:8px;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.3);color:#22c55e;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;">✓ Activar</button>`:''}
                ${u.status==='activo'?`<button type="button" class="adm-action" data-uid="${u.id}" data-a="desactivar"
                  style="flex:1;padding:6px;border-radius:8px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#888;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;">✕ Desactivar</button>`:''}
                <button type="button" class="adm-action" data-uid="${u.id}" data-a="suspender"
                  style="flex:1;padding:6px;border-radius:8px;background:rgba(249,115,22,.1);border:1px solid rgba(249,115,22,.3);color:#f97316;font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;">⏸ Suspender</button>
                <button type="button" class="adm-action" data-uid="${u.id}" data-a="ver"
                  style="flex:1;padding:6px;border-radius:8px;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);color:var(--cyan,#00f5ff);font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;">📊 Ver</button>
              </div>
            </div>`).join('') || `<div style="padding:40px;text-align:center;color:#888;">Sin resultados</div>`}
          <div style="height:1px;"></div>
        </div>
        <div style="height:16px;"></div>
      </div>
      ${_adminNav('admin-usuarios')}
    </div>`;
  },
  init() {
    _adminCommonInit();
    document.getElementById('adm-search')?.addEventListener('input', e => {
      _userSearch = e.target.value;
      navigateTo('admin-usuarios');
    });
    document.querySelectorAll('.adm-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const uid=btn.dataset.uid, action=btn.dataset.a;
        const susp=JSON.parse(localStorage.getItem('olympus_admin_suspensions')||'{}');
        if (action==='activar')    { delete susp[uid]; }
        if (action==='desactivar') { susp[uid]='inactivo'; }
        if (action==='suspender')  { susp[uid]='suspendido'; }
        if (action==='ver') {
          const u=_getAllUsers().find(x=>x.id===uid);
          if(u)alert(`📊 ${u.name}\n\nEmail: ${u.email}\nNivel: ${u.level}\nRacha: ${u.streak} días\nEntrenos: ${u.workouts}`);
          return;
        }
        localStorage.setItem('olympus_admin_suspensions',JSON.stringify(susp));
        navigateTo('admin-usuarios');
      });
    });
  }
};

/*SEGURIDAD GESTION ADMIN*/
window.screens['admin-seguridad'] = {
  render() {
    return `
    <div style="display:flex;flex-direction:column;height:100%;background:#080810;color:#fff;">
      ${_adminMiniHeader()}
      <div style="flex:1;overflow-y:auto;padding:16px;">
        <h2 style="font-size:16px;font-weight:700;margin-bottom:4px;">Seguridad y Acceso</h2>
        <p style="font-size:11px;color:#888;margin-bottom:18px;">Roles: solo Usuario y Administrador. Sin rol Coach.</p>

        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;margin-bottom:14px;">
          <p style="font-size:12px;font-weight:700;color:var(--cyan,#00f5ff);margin-bottom:12px;">Roles del Sistema</p>
          ${[
            {r:'👤 Usuario', d:'Acceso al entrenamiento, progreso, retos y perfil personal.', c:'#22c55e'},
            {r:'🛡️ Administrador', d:'Acceso completo al panel de administración y gestión.', c:'var(--cyan,#00f5ff)'},
          ].map(x=>`
            <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:10px 0;border-bottom:1px solid rgba(255,255,255,.05);">
              <div><p style="font-size:12px;font-weight:700;color:${x.c};">${x.r}</p><p style="font-size:10px;color:#888;margin-top:2px;">${x.d}</p></div>
              <span style="font-size:9px;color:#22c55e;font-weight:700;background:rgba(34,197,94,.1);border:1px solid rgba(34,197,94,.2);padding:2px 7px;border-radius:10px;white-space:nowrap;flex-shrink:0;margin-left:8px;">ACTIVO</span>
            </div>`).join('')}
        </div>

        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;margin-bottom:14px;">
          <p style="font-size:12px;font-weight:700;color:var(--cyan,#00f5ff);margin-bottom:12px;">Administradores</p>
          <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:rgba(0,245,255,.04);border:1px solid rgba(0,245,255,.15);border-radius:10px;">
            <div style="width:34px;height:34px;border-radius:50%;background:rgba(0,245,255,.15);border:1px solid rgba(0,245,255,.3);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--cyan,#00f5ff);">AP</div>
            <div style="flex:1;"><p style="font-size:12px;font-weight:600;">Admin Principal</p><p style="font-size:10px;color:#888;">admin@olympus.com</p></div>
            <span style="font-size:9px;font-weight:700;color:#000;background:var(--cyan,#00f5ff);padding:2px 7px;border-radius:10px;">Super Admin</span>
          </div>
        </div>

        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;">
          <p style="font-size:12px;font-weight:700;color:var(--cyan,#00f5ff);margin-bottom:12px;">Últimos Accesos</p>
          ${[['Hoy','Chrome / Windows','✅'],['Ayer','Safari / iPhone','✅'],['Hace 3 días','Chrome / Windows','✅']].map(([t,d,s])=>`
            <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);font-size:10px;">
              <span style="color:#888;">${t}</span><span style="color:#ccc;flex:1;margin:0 10px;">${d}</span><span>${s}</span>
            </div>`).join('')}
        </div>
        <div style="height:16px;"></div>
      </div>
      ${_adminNav('admin-seguridad')}
    </div>`;
  },
  init() { _adminCommonInit(); }
};

/*CONTENIDO ADMIN*/
window.screens['admin-contenido'] = {
  _sub: 'retos',
  render() {
    const sub = this._sub;
    const RETOS_DEF = [
      {id:'ch1',nombre:'Semana de Fuego',descripcion:'5 entrenamientos en una semana',xp:500,meta:5},
      {id:'ch2',nombre:'Maratón de Cardio',descripcion:'3 sesiones de cardio en una semana',xp:300,meta:3},
      {id:'ch3',nombre:'Reto del Mes',descripcion:'14 entrenamientos en el mes',xp:1000,meta:14},
      {id:'ch4',nombre:'Sin Excusas',descripcion:'10 días seguidos de entrenamiento',xp:200,meta:10},
      {id:'ch5',nombre:'King of HIIT',descripcion:'5 sesiones HIIT consecutivas',xp:400,meta:5},
    ];
    const LOGROS_DEF = [
      {id:'a0',nombre:'En Fuego',descripcion:'8 días seguidos',icono:'flame',xp:100},
      {id:'a1',nombre:'Iron Man',descripcion:'30 entrenamientos completados',icono:'dumbbell',xp:200},
      {id:'a2',nombre:'Élite',descripcion:'Top 10% del mes',icono:'star',xp:300},
      {id:'a3',nombre:'Constante',descripcion:'4 semanas activo',icono:'calendar',xp:150},
      {id:'a4',nombre:'Explosivo',descripcion:'5 HIIT seguidos',icono:'zap',xp:200},
      {id:'a5',nombre:'Perfecto',descripcion:'Semana sin fallar',icono:'check-circle',xp:250},
    ];
    const retos  = JSON.parse(localStorage.getItem('olympus_admin_retos')  || JSON.stringify(RETOS_DEF));
    const logros = JSON.parse(localStorage.getItem('olympus_admin_logros') || JSON.stringify(LOGROS_DEF));
    const EJS = ['Sentadilla con barra','Hip Thrust','Press de banca','Dominadas','Press militar','Curl bíceps','Plancha','Burpees'];

    const subBtn = (id,label) =>
      `<button type="button" class="adm-sub-btn" data-sub="${id}"
        style="padding:7px 14px;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer;font-family:inherit;
          background:${sub===id?'rgba(0,245,255,.15)':'rgba(255,255,255,.05)'};
          border:${sub===id?'1px solid rgba(0,245,255,.4)':'1px solid rgba(255,255,255,.1)'};
          color:${sub===id?'var(--cyan,#00f5ff)':'#888'};">${label}</button>`;

    let content = '';
    if (sub==='retos') content = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <p style="font-size:13px;font-weight:700;color:var(--cyan,#00f5ff);">Retos (${retos.length})</p>
        <button type="button" id="adm-add-reto" style="padding:5px 12px;border-radius:8px;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);color:var(--cyan,#00f5ff);font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;">+ Nuevo</button>
      </div>
      ${retos.map((r,i)=>`
        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:12px;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div><p style="font-size:13px;font-weight:700;">${r.nombre}</p><p style="font-size:10px;color:#888;margin-top:2px;">${r.descripcion}</p><div style="display:flex;gap:8px;margin-top:5px;"><span style="font-size:9px;color:var(--gold,#fbbf24);">+${r.xp} XP</span><span style="font-size:9px;color:#888;">Meta: ${r.meta}</span></div></div>
            <div style="display:flex;gap:5px;flex-shrink:0;margin-left:8px;">
              <button type="button" class="adm-edit-reto" data-idx="${i}" style="padding:4px 10px;border-radius:8px;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);color:var(--cyan,#00f5ff);font-size:9px;cursor:pointer;font-family:inherit;">✏️</button>
              <button type="button" class="adm-del-reto"  data-idx="${i}" style="padding:4px 10px;border-radius:8px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#ef4444;font-size:9px;cursor:pointer;font-family:inherit;">🗑️</button>
            </div>
          </div>
        </div>`).join('')}`;

    if (sub==='logros') content = `
      <p style="font-size:13px;font-weight:700;color:var(--cyan,#00f5ff);margin-bottom:12px;">Logros (${logros.length})</p>
      ${logros.map((l,i)=>`
        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
          <div style="display:flex;align-items:center;gap:8px;">
            <i data-lucide="${l.icono}" style="width:18px;height:18px;color:var(--gold,#fbbf24);"></i>
            <div><p style="font-size:12px;font-weight:700;">${l.nombre}</p><p style="font-size:10px;color:#888;">${l.descripcion} · +${l.xp} XP</p></div>
          </div>
          <button type="button" class="adm-edit-logro" data-idx="${i}" style="padding:4px 10px;border-radius:8px;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);color:var(--cyan,#00f5ff);font-size:9px;cursor:pointer;font-family:inherit;">✏️</button>
        </div>`).join('')}`;

    if (sub==='ejercicios') content = `
      <p style="font-size:13px;font-weight:700;color:var(--cyan,#00f5ff);margin-bottom:12px;">Catálogo de Ejercicios</p>
      ${EJS.map(e=>`
        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:10px;padding:12px;margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;">
          <p style="font-size:12px;font-weight:600;">${e}</p>
          <button type="button" style="padding:4px 10px;border-radius:8px;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);color:var(--cyan,#00f5ff);font-size:9px;cursor:pointer;font-family:inherit;">✏️ Editar</button>
        </div>`).join('')}`;

    return `
    <div style="display:flex;flex-direction:column;height:100%;background:#080810;color:#fff;">
      ${_adminMiniHeader()}
      <div style="flex:1;overflow-y:auto;padding:16px;">
        <h2 style="font-size:16px;font-weight:700;margin-bottom:14px;">Contenido & Retos</h2>
        <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
          ${subBtn('retos','🏆 Retos')}
          ${subBtn('logros','⭐ Logros')}
          ${subBtn('ejercicios','🏋 Ejercicios')}
        </div>
        ${content}
        <div style="height:16px;"></div>
      </div>
      ${_adminNav('admin-contenido')}
    </div>`;
  },
  init() {
    _adminCommonInit();
    document.querySelectorAll('.adm-sub-btn').forEach(btn =>
      btn.addEventListener('click', () => { this._sub=btn.dataset.sub; navigateTo('admin-contenido'); })
    );
    document.querySelectorAll('.adm-edit-reto').forEach(btn =>
      btn.addEventListener('click', () => {
        const retos=JSON.parse(localStorage.getItem('olympus_admin_retos')||'[]');
        const r=retos[parseInt(btn.dataset.idx)];
        const nombre=prompt('Nombre:', r.nombre); if(!nombre)return;
        const desc=prompt('Descripción:', r.descripcion)||r.descripcion;
        const xp=parseInt(prompt('XP:', r.xp))||r.xp;
        const meta=parseInt(prompt('Meta:', r.meta))||r.meta;
        retos[parseInt(btn.dataset.idx)]={...r,nombre,descripcion:desc,xp,meta};
        localStorage.setItem('olympus_admin_retos',JSON.stringify(retos));
        navigateTo('admin-contenido');
      })
    );
    document.querySelectorAll('.adm-del-reto').forEach(btn =>
      btn.addEventListener('click', () => {
        if (!confirm('¿Eliminar este reto?')) return;
        const retos=JSON.parse(localStorage.getItem('olympus_admin_retos')||'[]');
        retos.splice(parseInt(btn.dataset.idx),1);
        localStorage.setItem('olympus_admin_retos',JSON.stringify(retos));
        navigateTo('admin-contenido');
      })
    );
    document.getElementById('adm-add-reto')?.addEventListener('click', () => {
      const nombre=prompt('Nombre del nuevo reto:'); if(!nombre)return;
      const retos=JSON.parse(localStorage.getItem('olympus_admin_retos')||'[]');
      retos.push({id:`ch${Date.now()}`,nombre,descripcion:prompt('Descripción:')||'',xp:parseInt(prompt('XP:')||'300'),meta:parseInt(prompt('Meta numérica:')||'5')});
      localStorage.setItem('olympus_admin_retos',JSON.stringify(retos));
      navigateTo('admin-contenido');
    });
    if (window.lucide) lucide.createIcons();
  }
};

/*CONFIG ADMIN*/
window.screens['admin-config'] = {
  render() {
    const s = _getRealStats();
    return `
    <div style="display:flex;flex-direction:column;height:100%;background:#080810;color:#fff;">
      ${_adminMiniHeader()}
      <div style="flex:1;overflow-y:auto;padding:16px;">
        <h2 style="font-size:16px;font-weight:700;margin-bottom:4px;">Configuración</h2>
        <p style="font-size:11px;color:#888;margin-bottom:18px;">${s.totalUsers} usuarios registrados en total</p>

        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;margin-bottom:14px;">
          <p style="font-size:12px;font-weight:700;color:var(--cyan,#00f5ff);margin-bottom:12px;">📣 Notificación Masiva</p>
          <textarea id="adm-notif-msg" rows="3" placeholder="Mensaje para todos los usuarios..."
            style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:10px;color:#fff;padding:10px;font-family:inherit;font-size:12px;outline:none;resize:none;margin-bottom:10px;"></textarea>
          <button type="button" id="adm-send-notif"
            style="width:100%;padding:12px;border-radius:10px;background:var(--cyan,#00f5ff);border:none;color:#000;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;justify-content:center;gap:6px;">
            <i data-lucide="send" style="width:14px;height:14px;"></i>
            Enviar a todos (${s.totalUsers} usuarios)
          </button>
        </div>

        <p style="font-size:9px;font-weight:700;letter-spacing:.1em;color:#555;margin-bottom:10px;">CONFIGURACIÓN DEL SISTEMA</p>
        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;">
          ${[
            {icon:'trophy',   color:'var(--cyan)',  title:'Gestionar retos',     sub:'Crear, editar y publicar retos',       route:'admin-contenido'},
            {icon:'shield',   color:'#22c55e',      title:'Seguridad y acceso',  sub:'Roles y permisos de administradores',  route:'admin-seguridad'},
            {icon:'download', color:'#a855f7',      title:'Exportar datos',      sub:'Descargar datos de usuarios y métricas',route:null},
            {icon:'star',     color:'var(--gold,#fbbf24)', title:'Contenido premium',sub:'Gestionar suscripciones y planes', route:null},
          ].map(c=>`
            <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;" class="adm-cfg-row" data-route="${c.route||''}">
              <div style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="${c.icon}" style="width:16px;height:16px;color:${c.color};"></i>
              </div>
              <div style="flex:1;"><p style="font-size:13px;font-weight:700;">${c.title}</p><p style="font-size:10px;color:#888;margin-top:1px;">${c.sub}</p></div>
              <i data-lucide="chevron-right" style="width:14px;height:14px;color:#555;flex-shrink:0;"></i>
            </div>`).join('')}
          <div style="height:1px;"></div>
        </div>
        <div style="height:16px;"></div>
      </div>
      ${_adminNav('admin-config')}
    </div>`;
  },
  init() {
    _adminCommonInit();
    document.getElementById('adm-send-notif')?.addEventListener('click', () => {
      const msg=document.getElementById('adm-notif-msg')?.value.trim();
      if (!msg) { alert('Escribe un mensaje primero'); return; }
      if (window.OlympusNotif) OlympusNotif.add('📢 Olympus',''+msg,'admin');
      alert(`✅ Notificación enviada:\n"${msg}"`);
      document.getElementById('adm-notif-msg').value='';
    });
    document.querySelectorAll('.adm-cfg-row').forEach(row =>
      row.addEventListener('click', () => {
        const r=row.dataset.route;
        if (r) navigateTo(r);
        else alert('Disponible en versión con backend completo.');
      })
    );
  }
};

/*SOPORTE ADMIN*/
window.screens['admin-soporte'] = {
  render() {
    const reports = JSON.parse(localStorage.getItem('olympus_reports')||'[]');
    const faq = [
      {q:'¿Cómo cambio mi objetivo?',     a:'Perfil → Editar Perfil → Objetivo principal', views:256},
      {q:'¿Puedo entrenar en casa?',       a:'Sí, selecciona "Casa sin equipo" en el onboarding', views:189},
       {q:'¿Cómo funciona la racha?',       a:'Cuenta entrenamientos según tu frecuencia objetivo', views:145},
      {q:'¿Cómo conectar mi smartwatch?',  a:'Perfil → Dispositivos → Relojes inteligentes', views:98},
    ];
    return `
    <div style="display:flex;flex-direction:column;height:100%;background:#080810;color:#fff;">
      ${_adminMiniHeader()}
      <div style="flex:1;overflow-y:auto;padding:16px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <p style="font-size:14px;font-weight:700;color:var(--cyan,#00f5ff);">Base de conocimientos</p>
          <button type="button" style="padding:5px 12px;border-radius:8px;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);color:var(--cyan,#00f5ff);font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;">+ Agregar</button>
        </div>
        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;margin-bottom:16px;">
          ${faq.map(f=>`
            <div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.04);">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
                <p style="font-size:12px;font-weight:700;color:var(--cyan,#00f5ff);">? ${f.q}</p>
                <span style="font-size:9px;color:#888;flex-shrink:0;margin-left:8px;">${f.views} vistas</span>
              </div>
              <p style="font-size:10px;color:#aaa;margin-bottom:6px;">${f.a}</p>
              <button type="button" style="padding:3px 10px;border-radius:8px;background:rgba(0,245,255,.06);border:1px solid rgba(0,245,255,.15);color:var(--cyan,#00f5ff);font-size:9px;cursor:pointer;font-family:inherit;">Editar</button>
            </div>`).join('')}
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <p style="font-size:14px;font-weight:700;color:var(--cyan,#00f5ff);">Buzón de incidencias</p>
          <span style="font-size:10px;color:#888;">${reports.length} pendiente(s)</span>
        </div>
        <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;overflow:hidden;margin-bottom:16px;">
          ${reports.length > 0 ? reports.map((r,i)=>`
            <div style="padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.04);">
              <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                <p style="font-size:11px;font-weight:700;">${r.email||'Anónimo'} <span style="background:rgba(249,115,22,.2);color:#f97316;border:1px solid rgba(249,115,22,.3);padding:1px 5px;border-radius:8px;font-size:9px;">Nuevo</span></p>
                <button type="button" class="adm-resolve" data-idx="${i}" style="font-size:9px;color:#ef4444;background:none;border:none;cursor:pointer;">Cerrar</button>
              </div>
              <p style="font-size:10px;color:#aaa;">${r.desc||r.message||'Sin descripción'}</p>
            </div>`).join('')
          : `<div style="padding:32px;text-align:center;color:#555;"><i data-lucide="inbox" style="width:30px;height:30px;margin:0 auto 8px;opacity:.4;"></i><p style="font-size:12px;">Sin incidencias pendientes</p></div>`}
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:20px;text-align:center;">
            <div style="font-size:30px;font-weight:900;color:#22c55e;">89%</div>
            <div style="font-size:10px;color:#888;margin-top:4px;">Resueltas sin escalar</div>
          </div>
          <div style="background:#0a0a12;border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:20px;text-align:center;">
            <div style="font-size:30px;font-weight:900;color:var(--cyan,#00f5ff);">1,234</div>
            <div style="font-size:10px;color:#888;margin-top:4px;">Consultas totales</div>
          </div>
        </div>
        <div style="height:16px;"></div>
      </div>
      ${_adminNav('admin-soporte')}
    </div>`;
  },
  init() {
    _adminCommonInit();
    document.querySelectorAll('.adm-resolve').forEach(btn =>
      btn.addEventListener('click', () => {
        const reports=JSON.parse(localStorage.getItem('olympus_reports')||'[]');
        reports.splice(parseInt(btn.dataset.idx),1);
        localStorage.setItem('olympus_reports',JSON.stringify(reports));
        navigateTo('admin-soporte');
      })
    );
  }
};

/*Alias para tabs faltantes*/
window.screens['admin-motor-ia'] = window.screens['admin-config'];