/*PROFILE.JS — Perfil, Notificaciones, Relojes, Privacidad, Preferencias, Ayuda & Soporte*/

/* HELPERS*/
const _devicesKey = () => `olympus_devices_${window.AppState.user.email||'guest'}`;
const _permKey    = () => `olympus_perms_${window.AppState.user.email||'guest'}`;

/* PERFIL PRINCIPAL*/
window.screens.profile = {
  render() {
    const u       = window.AppState.user;
    const pct     = Math.min(100, (u.xp / u.xpToNext) * 100);
    const dark    = window.isDarkMode ? window.isDarkMode() : true;
    const initials= (u.name||'DU').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    const prefs   = window.OlympusNotif ? OlympusNotif.getPrefs() : {};

    /* Notificaciones expandidas */
    const notifExpanded = false; // toggleable

    const row = (it) => `
      <div style="display:flex;align-items:center;gap:12px;padding:13px 14px;
        background:rgba(255,255,255,.025);border-bottom:1px solid rgba(255,255,255,.05);"
        class="${it.nav?'prof-nav-item':''}" data-nav="${it.nav||''}">
        <div style="width:34px;height:34px;border-radius:10px;background:rgba(${it.bg});
          display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="${it.icon}" style="width:16px;height:16px;color:${it.color};"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <p style="font-size:13px;font-weight:600;margin-bottom:2px;">${it.title}</p>
          <p style="font-size:11px;color:${it.subColor||'#888'};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${it.sub}</p>
        </div>
        ${it.toggle
          ? `<div id="${it.id}" style="width:42px;height:24px;border-radius:12px;
               background:${dark?'var(--cyan)':'rgba(255,255,255,.15)'};
               position:relative;cursor:pointer;flex-shrink:0;transition:background .3s;">
               <div style="width:18px;height:18px;border-radius:50%;background:#fff;position:absolute;
                 top:3px;${dark?'right:3px':'left:3px'};transition:all .25s;box-shadow:0 1px 3px rgba(0,0,0,.3);"></div>
             </div>`
          : `<i data-lucide="chevron-right" style="width:16px;height:16px;color:#555;flex-shrink:0;"></i>`
        }
      </div>`;

    const stats   = window.OlympusStats ? OlympusStats.get() : {};
    const goalLabels = {lose:'Perder peso',muscle:'Ganar músculo',endurance:'Resistencia',fit:'Mantenerme fit',sport:'Deporte específico'};

    const cuentaItems = [
      { icon:'user',   bg:'0,245,255,.08',  color:'var(--cyan)', title:'Datos personales',
        sub:`${u.height||'--'} cm · ${u.weight||'--'} kg${u.age?` · ${u.age} años`:''}`, nav:'edit-profile' },
      { icon:'target', bg:'168,85,247,.08', color:'#a855f7', title:'Mis objetivos',
        sub:goalLabels[u.goal]||'Ganar músculo', nav:'edit-profile' },
      { icon:'bell',   bg:'251,191,36,.08', color:'var(--gold)', title:'Notificaciones',
        sub:'Recordatorios de entrenamiento', nav:'notifications-settings' },
    ];
    const devItems = [
      { icon:'watch',  bg:'34,197,94,.08',  color:'#22c55e', title:'Relojes inteligentes',
        sub:'Garmin conectado', subColor:'#22c55e', nav:'watches' },
    ];
    const appItems = [
      { icon:'settings',    bg:'255,255,255,.05', color:'#888',       title:'Preferencias',      sub:'Unidades de medida', nav:'preferences' },
      { icon:'moon',        bg:'0,245,255,.06',   color:'var(--cyan)',title:'Modo oscuro',
        sub:dark?'Tema oscuro activo':'Tema claro activo', toggle:true, id:'profile-dark-toggle' },
      { icon:'lock',        bg:'255,255,255,.05', color:'#888',       title:'Privacidad y datos', sub:'Contraseña, datos, permisos', nav:'privacy-data' },
      { icon:'help-circle', bg:'255,255,255,.05', color:'#888',       title:'Ayuda y soporte',    sub:'Soporte, centro de ayuda', nav:'help-support' },
    ];

    const sec = (label, items) => `
      <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#666;padding:0 20px;margin-bottom:8px;">${label}</p>
      <div style="margin:0 20px 14px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.07);">
        ${items.map(row).join('')}<div style="height:1px;"></div>
      </div>`;

    return `
    <div class="screen-scroll" style="position:relative;">
      <div style="padding:40px 20px 14px;">
        <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:5px;">
          <i data-lucide="user" style="width:11px;height:11px;color:var(--cyan);"></i> MI PERFIL
        </div>
        <h1 style="font-size:26px;font-weight:800;">Cuenta</h1>
      </div>

      <!-- Tarjeta usuario -->
      <div style="margin:0 20px 14px;padding:16px;border-radius:16px;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.08);">
        <div style="display:flex;align-items:center;gap:13px;margin-bottom:12px;">
          <div style="position:relative;flex-shrink:0;">
            <div style="width:62px;height:62px;border-radius:50%;background:rgba(0,245,255,.18);border:2px solid rgba(0,245,255,.45);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:var(--cyan);">${initials}</div>
            <button type="button" id="dash-edit-profile-btn"
              style="position:absolute;bottom:-2px;right:-2px;width:22px;height:22px;border-radius:50%;background:var(--cyan);border:2px solid #080808;display:flex;align-items:center;justify-content:center;cursor:pointer;">
              <i data-lucide="pencil" style="width:11px;height:11px;color:#000;"></i>
            </button>
          </div>
          <div style="flex:1;min-width:0;">
            <p style="font-size:16px;font-weight:700;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.name||'Demo User'}</p>
            <p style="font-size:11px;color:#888;margin-bottom:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.email||''}</p>
            <div style="display:flex;gap:6px;flex-wrap:wrap;">
              <span style="font-size:10px;font-weight:600;color:var(--gold);background:rgba(251,191,36,.15);border:1px solid rgba(251,191,36,.3);padding:2px 8px;border-radius:10px;">Intermedio</span>
              <span style="font-size:10px;font-weight:600;color:var(--cyan);background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.3);padding:2px 8px;border-radius:10px;">Nivel ${u.level||1}</span>
            </div>
          </div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:5px;">
          <span>${u.xp||0} / ${u.xpToNext||1000} XP</span>
          <span style="color:var(--gold);font-weight:600;">→ Nivel ${(u.level||1)+1}</span>
        </div>
        <div style="height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
          <div style="width:${pct}%;height:100%;background:var(--cyan);border-radius:3px;transition:width .5s;"></div>
        </div>
        <p style="font-size:10px;color:#888;margin-top:5px;">${(u.xpToNext||1000)} XP para Nivel ${(u.level||1)+1}</p>
      </div>

      <!-- Stats -->
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:9px;padding:0 20px 16px;">
        <div style="padding:12px 6px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);text-align:center;">
          <i data-lucide="flame" style="width:18px;height:18px;color:var(--orange);margin:0 auto;"></i>
          <div style="font-size:18px;font-weight:800;color:var(--orange);margin-top:4px;">${stats.total_entrenamientos||0}</div>
          <div style="font-size:9px;color:#666;margin-top:2px;">Entrenos</div>
        </div>
        <div style="padding:12px 6px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);text-align:center;">
          <i data-lucide="calendar" style="width:18px;height:18px;color:var(--cyan);margin:0 auto;"></i>
          <div style="font-size:18px;font-weight:800;color:var(--cyan);margin-top:4px;">${stats.racha_maxima||0}d</div>
          <div style="font-size:9px;color:#666;margin-top:2px;">Racha máx</div>
        </div>
        <div style="padding:12px 6px;border-radius:13px;background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.07);text-align:center;">
          <i data-lucide="trophy" style="width:18px;height:18px;color:var(--gold);margin:0 auto;"></i>
          <div style="font-size:18px;font-weight:800;color:var(--gold);margin-top:4px;">0</div>
          <div style="font-size:9px;color:#666;margin-top:2px;">Logros</div>
        </div>
      </div>

      ${sec('MI CUENTA', cuentaItems)}
      ${sec('DISPOSITIVOS', devItems)}
      ${sec('APP', appItems)}

      <button type="button" id="profile-logout"
        style="margin:4px 20px 24px;padding:14px;border-radius:12px;background:transparent;
          border:1px solid rgba(239,68,68,.4);color:#ef4444;font-size:14px;font-weight:600;
          cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;
          width:calc(100% - 40px);font-family:inherit;">
        <i data-lucide="log-out" style="width:16px;height:16px;color:#ef4444;"></i>
        Cerrar sesión
      </button>
      <button type="button" class="dash-fab-chat"><i data-lucide="message-circle"></i></button>
    </div>`;
  },
  init() {
    document.getElementById('profile-dark-toggle')?.addEventListener('click', () => {
      if (window.toggleDarkMode) window.toggleDarkMode();
      navigateTo('profile');
    });
    document.getElementById('dash-edit-profile-btn')?.addEventListener('click', () => navigateTo('edit-profile'));
    document.querySelectorAll('.prof-nav-item').forEach(el => {
      el.style.cursor = 'pointer';
      el.addEventListener('click', () => {
        const nav = el.dataset.nav;
        if (nav) navigateTo(nav);
      });
    });
    document.getElementById('profile-logout')?.addEventListener('click', () => {
      if (confirm('¿Seguro que quieres cerrar sesión?')) {
        localStorage.removeItem('olympus_session');
        window.AppState.user = { name:'',email:'',role:'user',gender:'male',level:1,xp:0,xpToNext:1000,streak:0,goal:'',levelName:'',location:'',emailVerified:false };
        navigateTo('welcome');
      }
    });
    if (window.lucide) lucide.createIcons();
  }
};

/*EDIT PROFILE (restringido)*/
window.screens['edit-profile'] = {
  render() {
    const u=window.AppState.user;
    const initials=(u.name||'DU').split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);
    const goals=[{id:'lose',l:'Perder peso'},{id:'muscle',l:'Ganar músculo'},{id:'endurance',l:'Mejorar resistencia'},{id:'fit',l:'Mantenerme fit'},{id:'sport',l:'Deporte específico'}];
    const iS=`width:100%;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:14px;font-family:inherit;outline:none;`;
    const lS=`font-size:10px;font-weight:700;letter-spacing:.07em;color:#888;display:block;margin-bottom:6px;text-transform:uppercase;`;
    const rdS=`${iS}background:rgba(255,255,255,.03);border-color:rgba(255,255,255,.07);color:#555;cursor:not-allowed;`;
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="ep-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <h2 style="font-size:18px;font-weight:700;flex:1;">Editar Perfil</h2>
        <button type="button" id="ep-save-top" style="padding:8px 18px;border-radius:20px;background:var(--cyan);border:none;color:#000;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;">Guardar</button>
      </div>
      <div style="padding:24px 20px 8px;display:flex;flex-direction:column;align-items:center;gap:8px;">
        <div style="width:80px;height:80px;border-radius:50%;background:rgba(0,245,255,.18);border:3px solid rgba(0,245,255,.5);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:var(--cyan);">${initials}</div>
        <p style="font-size:12px;color:var(--cyan);">Cambiar foto (próximamente)</p>
      </div>
      <div style="padding:16px 20px;display:flex;flex-direction:column;gap:16px;">

        <!-- NOMBRE Y ALTURA: solo lectura con mensaje de soporte -->
        <div style="background:rgba(251,191,36,.06);border:1px solid rgba(251,191,36,.2);border-radius:12px;padding:12px 14px;">
          <p style="font-size:11px;color:var(--gold);font-weight:600;">ℹ️ Nombre y estatura</p>
          <p style="font-size:11px;color:#aaa;margin-top:4px;">Estos datos no se pueden modificar desde la app. Para cambiarlos, contacta a soporte: olympus@gmail.com</p>
        </div>

        <div><label style="${lS}">Nombre completo (solo lectura)</label>
          <input type="text" value="${u.name||''}" readonly style="${rdS}">
        </div>
        <div><label style="${lS}">Correo electrónico (solo lectura)</label>
          <input type="email" value="${u.email||''}" readonly style="${rdS}">
          <p style="font-size:10px;color:#666;margin-top:4px;">El correo es tu identificador de cuenta</p>
        </div>
         <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div><label style="${lS}">Estatura (solo lectura)</label>
            <div style="position:relative;"><input type="number" value="${u.height||''}" readonly style="${rdS}padding-right:44px;">
              <span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:11px;color:#555;">cm</span>
            </div>
          </div>
          <div><label style="${lS}">Edad (solo lectura)</label>
            <input type="number" id="ep-age" value="${u.age||''}" readonly style="${rdS}">
          </div>
        </div>
        <p style="font-size:11px;color:#aaa;margin-top:4px;">Nombre, estatura y edad no se pueden modificar. Para cambiarlos: olympus@gmail.com</p>

        <div><label style="${lS}">Peso actual</label>
          <div style="position:relative;"><input type="number" id="ep-weight" value="${u.weight||''}" placeholder="70" min="30" max="300" step="0.1" style="${iS}padding-right:44px;">
            <span style="position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:11px;color:#888;">kg</span>
          </div>
        </div>
        <div><label style="${lS}">Objetivo principal</label>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
            ${goals.map(g=>`<button type="button" class="ep-goal-btn" data-goal="${g.id}"
              style="padding:10px 12px;border-radius:12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;
                background:${u.goal===g.id?'rgba(0,245,255,.12)':'rgba(255,255,255,.05)'};
                border:1px solid ${u.goal===g.id?'var(--cyan)':'rgba(255,255,255,.1)'};
                color:${u.goal===g.id?'var(--cyan)':'#888'};">${g.l}</button>`).join('')}
          </div>
        </div>
        <div><label style="${lS}">Bio (opcional)</label>
          <textarea id="ep-bio" rows="3" placeholder="Cuéntanos algo sobre ti..." style="${iS}resize:none;">${u.bio||''}</textarea>
        </div>
        <button type="button" id="ep-save-bottom"
          style="width:100%;padding:15px;border-radius:14px;background:var(--cyan);border:none;color:#000;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px;font-family:inherit;">
          <i data-lucide="check" style="width:18px;height:18px;color:#000;"></i> Guardar cambios
        </button>
        <div style="height:20px;"></div>
      </div>
    </div>`;
  },
  init() {
    let selGoal = window.AppState.user.goal||'';
    document.getElementById('ep-back')?.addEventListener('click', ()=>navigateTo('profile'));
    document.querySelectorAll('.ep-goal-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        selGoal=btn.dataset.goal;
        document.querySelectorAll('.ep-goal-btn').forEach(b=>{
          b.style.background  = b.dataset.goal===selGoal?'rgba(0,245,255,.12)':'rgba(255,255,255,.05)';
          b.style.borderColor = b.dataset.goal===selGoal?'var(--cyan)':'rgba(255,255,255,.1)';
          b.style.color       = b.dataset.goal===selGoal?'var(--cyan)':'#888';
        });
      });
    });
    const save=()=>{
       Object.assign(window.AppState.user, {
        weight: document.getElementById('ep-weight')?.value||'',
        bio:    document.getElementById('ep-bio')?.value||'',
        goal:   selGoal,
      });
      localStorage.setItem('olympus_session',JSON.stringify(window.AppState.user));
      navigateTo('profile');
      setTimeout(()=>alert('✅ Perfil actualizado'),100);
    };
    document.getElementById('ep-save-top')?.addEventListener('click',save);
    document.getElementById('ep-save-bottom')?.addEventListener('click',save);
    if(window.lucide)lucide.createIcons();
  }
};

/*NOTIFICACIONES (configuración)*/
window.screens['notifications-settings'] = {
  render() {
    const prefs = OlympusNotif.getPrefs();
    const toggle = (key, label, sub, id) => `
      <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.05);">
        <div style="flex:1;">
          <p style="font-size:13px;font-weight:600;margin-bottom:2px;">${label}</p>
          <p style="font-size:11px;color:#888;">${sub}</p>
        </div>
        <div id="${id}" data-key="${key}" class="notif-toggle"
          style="width:44px;height:26px;border-radius:13px;cursor:pointer;flex-shrink:0;position:relative;
            background:${prefs[key]?'var(--cyan,#00f5ff)':'rgba(255,255,255,.15)'};transition:background .25s;">
          <div style="width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:3px;
            ${prefs[key]?'right:3px':'left:3px'};transition:all .25s;box-shadow:0 1px 3px rgba(0,0,0,.3);"></div>
        </div>
      </div>`;
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="ns-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Notificaciones</h2><p style="font-size:11px;color:#888;">Personaliza tus alertas</p></div>
      </div>
      <div style="padding:16px 20px 80px;">
        <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden;">
          ${toggle('recordatorio_entrenamiento','Recordatorio de entrenamiento','Aviso diario 30 min antes','t1')}
          ${toggle('resumen_semanal','Resumen semanal','Estadísticas cada domingo','t2')}
          ${toggle('retos_nuevos','Retos nuevos','Cuando se publique un reto','t3')}
          ${toggle('consejos_nutricion','Consejos de nutrición','Tips diarios de Olympus IA','t4')}
          <div style="height:1px;"></div>
        </div>
        <p style="font-size:11px;color:#555;margin-top:12px;text-align:center;">Las notificaciones push requieren permisos del dispositivo</p>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('ns-back')?.addEventListener('click',()=>navigateTo('profile'));
    document.querySelectorAll('.notif-toggle').forEach(tog=>{
      tog.addEventListener('click',()=>{
        const key=tog.dataset.key;
        const val=OlympusNotif.togglePref(key);
        tog.style.background=val?'var(--cyan,#00f5ff)':'rgba(255,255,255,.15)';
        const thumb=tog.querySelector('div');
        thumb.style.right=val?'3px':''; thumb.style.left=val?'':'3px';
      });
    });
    if(window.lucide)lucide.createIcons();
  }
};

/*RELOJES INTELIGENTES*/
window.screens.watches = {
  render() {
    const devs = JSON.parse(localStorage.getItem(_devicesKey())||'{"garmin":true}');
    const watches = [
      { id:'apple',  name:'Apple Watch',        logo:'🍎', color:'#888' },
      { id:'garmin', name:'Garmin',              logo:'🟢', color:'#22c55e' },
      { id:'fitbit', name:'Fitbit',              logo:'💜', color:'#888' },
      { id:'samsung',name:'Samsung Galaxy Watch',logo:'🔵', color:'#888' },
      { id:'polar',  name:'Polar',               logo:'🔴', color:'#888' },
      { id:'amazfit',name:'Amazfit',             logo:'🔴', color:'#888' },
    ];
    const items = watches.map(w => {
      const connected = !!devs[w.id];
      return `
        <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;
          border-bottom:1px solid rgba(255,255,255,.05);
          ${connected?'background:rgba(34,197,94,.04);':''}" >
          <span style="font-size:22px;flex-shrink:0;">${w.logo}</span>
          <div style="flex:1;min-width:0;">
            <p style="font-size:13px;font-weight:600;">${w.name}</p>
            <p style="font-size:11px;color:${connected?'#22c55e':'#888'};">
              ${connected?'Conectado · Sincronizado hace 5 min':'No conectado'}
            </p>
          </div>
          <button type="button" class="watch-btn" data-id="${w.id}" data-connected="${connected}"
            style="padding:7px 14px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;
              background:${connected?'rgba(239,68,68,.12)':'rgba(0,245,255,.1)'};
              border:1px solid ${connected?'rgba(239,68,68,.4)':'rgba(0,245,255,.3)'};
              color:${connected?'#ef4444':'var(--cyan,#00f5ff)'};white-space:nowrap;">
            ${connected?'✕ Desconectar':'⬆ Conectar'}
          </button>
        </div>`;
    }).join('');
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="wt-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Relojes inteligentes</h2><p style="font-size:11px;color:#888;">Sincroniza tu dispositivo</p></div>
      </div>
      <div style="margin:16px 20px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.07);">
        ${items}
        <div style="height:1px;"></div>
      </div>
      <div style="padding:0 20px 80px;display:flex;align-items:center;gap:8px;">
        <i data-lucide="zap" style="width:14px;height:14px;color:var(--cyan);flex-shrink:0;"></i>
        <p style="font-size:11px;color:#888;">FC, calorías, pasos y sueño se sincronizan automáticamente.</p>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('wt-back')?.addEventListener('click',()=>navigateTo('profile'));
    document.querySelectorAll('.watch-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const devs=JSON.parse(localStorage.getItem(_devicesKey())||'{}');
        const id=btn.dataset.id;
        const was=btn.dataset.connected==='true';
        if(was){ delete devs[id]; alert(`${id} desconectado`); }
        else { devs[id]=true; alert(`${id} conectado (simulado)`); }
        localStorage.setItem(_devicesKey(),JSON.stringify(devs));
        navigateTo('watches');
      });
    });
    if(window.lucide)lucide.createIcons();
  }
};

/*PREFERENCIAS*/
window.screens.preferences = {
  render() {
    const dark=window.isDarkMode?window.isDarkMode():true;
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="pr-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Preferencias</h2></div>
      </div>
      <div style="padding:16px 20px 80px;display:flex;flex-direction:column;gap:10px;">
        <!-- Unidades -->
        <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#666;">UNIDADES DE MEDIDA</p>
        <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden;">
          <div style="padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.05);">
            <p style="font-size:13px;font-weight:600;margin-bottom:6px;">Peso</p>
            <div style="display:flex;gap:8px;">
              <button type="button" class="unit-btn active-unit" data-unit="kg" id="unit-kg"
                style="flex:1;padding:8px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;background:rgba(0,245,255,.12);border:1px solid var(--cyan,#00f5ff);color:var(--cyan,#00f5ff);">kg</button>
              <button type="button" class="unit-btn" data-unit="lb" id="unit-lb"
                style="flex:1;padding:8px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#888;">lb</button>
            </div>
          </div>
          <div style="padding:14px 16px;">
            <p style="font-size:13px;font-weight:600;margin-bottom:6px;">Altura</p>
            <div style="display:flex;gap:8px;">
              <button type="button" class="height-btn active-height" data-h="cm" id="h-cm"
                style="flex:1;padding:8px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;background:rgba(0,245,255,.12);border:1px solid var(--cyan,#00f5ff);color:var(--cyan,#00f5ff);">cm</button>
              <button type="button" class="height-btn" data-h="ft" id="h-ft"
                style="flex:1;padding:8px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:#888;">ft / in</button>
            </div>
          </div>
        </div>
        <!-- Apariencia -->
        <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#666;margin-top:6px;">APARIENCIA</p>
        <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden;">
          <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;">
            <i data-lucide="moon" style="width:18px;height:18px;color:var(--cyan);"></i>
            <div style="flex:1;"><p style="font-size:13px;font-weight:600;">Modo oscuro</p><p style="font-size:11px;color:#888;">${dark?'Activo':'Inactivo'}</p></div>
            <div id="pref-dark-toggle" style="width:44px;height:26px;border-radius:13px;cursor:pointer;position:relative;background:${dark?'var(--cyan,#00f5ff)':'rgba(255,255,255,.15)'};transition:background .25s;">
              <div style="width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:3px;${dark?'right:3px':'left:3px'};transition:all .25s;"></div>
            </div>
          </div>
        </div>
        <!-- Idioma (deshabilitado) -->
        <p style="font-size:10px;font-weight:700;letter-spacing:.08em;color:#444;margin-top:6px;">IDIOMA (próximamente)</p>
        <div style="background:rgba(255,255,255,.01);border:1px solid rgba(255,255,255,.04);border-radius:14px;padding:14px 16px;opacity:.4;">
          <div style="display:flex;align-items:center;justify-content:space-between;">
            <div><p style="font-size:13px;font-weight:600;color:#666;">Idioma de la app</p><p style="font-size:11px;color:#555;">Español</p></div>
            <i data-lucide="lock" style="width:16px;height:16px;color:#444;"></i>
          </div>
        </div>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('pr-back')?.addEventListener('click',()=>navigateTo('profile'));
    document.getElementById('pref-dark-toggle')?.addEventListener('click',()=>{
      if(window.toggleDarkMode)window.toggleDarkMode();
      navigateTo('preferences');
    });
    if(window.lucide)lucide.createIcons();
  }
};

/*PRIVACIDAD Y DATOS */
window.screens['privacy-data'] = {
  render() {
    const items=[
      {icon:'key',   color:'var(--cyan)', bg:'0,245,255,.08', title:'Cambiar contraseña',      sub:'Enviar código de verificación al correo', nav:'change-password'},
      {icon:'database',color:'#a855f7',  bg:'168,85,247,.08', title:'Mis datos y privacidad',  sub:'Ver, descargar o eliminar mis datos', nav:'my-data'},
      {icon:'shield', color:'#22c55e',   bg:'34,197,94,.08',  title:'Permisos de la app',      sub:'Notificaciones, cámara, ubicación', nav:'app-permissions'},
    ];
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="pd-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Privacidad y datos</h2></div>
      </div>
      <div style="padding:16px 20px 80px;">
        <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:14px;overflow:hidden;">
          ${items.map(it=>`
            <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.05);cursor:pointer;" class="pd-nav" data-nav="${it.nav}">
              <div style="width:36px;height:36px;border-radius:10px;background:rgba(${it.bg});display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="${it.icon}" style="width:16px;height:16px;color:${it.color};"></i>
              </div>
              <div style="flex:1;"><p style="font-size:13px;font-weight:600;margin-bottom:2px;">${it.title}</p><p style="font-size:11px;color:#888;">${it.sub}</p></div>
              <i data-lucide="chevron-right" style="width:16px;height:16px;color:#555;flex-shrink:0;"></i>
            </div>`).join('')}
          <div style="height:1px;"></div>
        </div>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('pd-back')?.addEventListener('click',()=>navigateTo('profile'));
    document.querySelectorAll('.pd-nav').forEach(el=>el.addEventListener('click',()=>navigateTo(el.dataset.nav)));
    if(window.lucide)lucide.createIcons();
  }
};

/*CAMBIAR CONTRASEÑA (con OTP al correo)*/
window.screens['change-password'] = {
  _step: 1, _otp: '',
  render() {
    const step = this._step;
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="cp-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Cambiar contraseña</h2></div>
      </div>
      <div style="padding:24px 20px;display:flex;flex-direction:column;gap:16px;">
        ${step===1?`
          <div style="background:rgba(0,245,255,.04);border:1px solid rgba(0,245,255,.15);border-radius:12px;padding:16px;text-align:center;">
            <i data-lucide="mail" style="width:36px;height:36px;color:var(--cyan);margin:0 auto 8px;"></i>
            <p style="font-size:14px;font-weight:600;margin-bottom:6px;">Verificación por correo</p>
            <p style="font-size:12px;color:#888;">Enviaremos un código de 6 dígitos a<br><strong style="color:#fff;">${window.AppState.user.email}</strong></p>
          </div>
          <button type="button" id="cp-send" class="btn btn-primary" style="height:52px;">
            Enviar código al correo
          </button>`:`
          <p style="font-size:13px;color:#888;text-align:center;">Código enviado a ${window.AppState.user.email}</p>
          <div class="otp-row">
            <input type="text" inputmode="numeric" maxlength="3" id="cp-otp-a" class="otp-box auth-field">
            <span class="otp-dash">—</span>
            <input type="text" inputmode="numeric" maxlength="3" id="cp-otp-b" class="otp-box auth-field">
          </div>
          <div class="input-group">
            <label class="input-label">Nueva contraseña</label>
            <div class="input-wrapper">
              <input type="password" id="cp-new" class="input-field auth-field" placeholder="Mínimo 8 caracteres">
              <button type="button" class="input-icon" id="cp-toggle"><i data-lucide="eye-off"></i></button>
            </div>
          </div>
          <div class="input-group">
            <label class="input-label">Confirmar nueva contraseña</label>
            <input type="password" id="cp-confirm" class="input-field auth-field" placeholder="Repite la contraseña">
          </div>
          <div id="cp-err" class="alert-error hidden"></div>
          <button type="button" id="cp-change" class="btn btn-primary" style="height:52px;">
            Cambiar contraseña
          </button>
          <p style="font-size:11px;color:#555;text-align:center;">Código de prueba: <strong>123456</strong></p>
        `}
      </div>
    </div>`;
  },
  init() {
    const self=this;
    document.getElementById('cp-back')?.addEventListener('click',()=>{self._step=1;navigateTo('privacy-data');});
    document.getElementById('cp-send')?.addEventListener('click',()=>{
      self._otp='123456'; /* simulado */
      alert(`Código enviado a ${window.AppState.user.email} (demo: 123456)`);
      self._step=2; navigateTo('change-password');
    });
    document.getElementById('cp-change')?.addEventListener('click',()=>{
      const otpA=document.getElementById('cp-otp-a')?.value||'';
      const otpB=document.getElementById('cp-otp-b')?.value||'';
      const code=otpA+otpB;
      const np  =document.getElementById('cp-new')?.value||'';
      const nc  =document.getElementById('cp-confirm')?.value||'';
      const err =document.getElementById('cp-err');
      if(code!==self._otp){err.textContent='Código incorrecto';err.classList.remove('hidden');return;}
      if(np.length<8){err.textContent='Mínimo 8 caracteres';err.classList.remove('hidden');return;}
      if(np!==nc){err.textContent='Las contraseñas no coinciden';err.classList.remove('hidden');return;}
      /* Actualizar contraseña en localStorage */
      const users=JSON.parse(localStorage.getItem('olympus_users')||'[]');
      const idx=users.findIndex(u=>u.email===window.AppState.user.email);
      if(idx>=0){users[idx].password=np;localStorage.setItem('olympus_users',JSON.stringify(users));}
      alert('✅ Contraseña actualizada correctamente');
      self._step=1; navigateTo('profile');
    });
    const t=document.getElementById('cp-toggle');
    if(t){const inp=document.getElementById('cp-new');t.addEventListener('click',()=>{inp.type=inp.type==='password'?'text':'password';t.innerHTML=inp.type==='password'?'<i data-lucide="eye-off"></i>':'<i data-lucide="eye"></i>';if(window.lucide)lucide.createIcons();});}
    if(window.lucide)lucide.createIcons();
  }
};

/*MIS DATOS Y PRIVACIDAD*/
window.screens['my-data'] = {
  render() {
    const u=window.AppState.user;
    const stats=window.OlympusStats?OlympusStats.get():{};
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="md-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <h2 style="font-size:17px;font-weight:700;">Mis datos y privacidad</h2>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:14px;">
        <!-- Datos almacenados -->
        <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:16px;">
          <p style="font-size:13px;font-weight:700;margin-bottom:12px;">📋 Datos almacenados</p>
          ${[['Nombre',u.name||'--'],['Correo',u.email||'--'],['Entrenamientos',stats.total_entrenamientos||0],['Calorías totales',(stats.total_calorias||0)+' kcal']].map(([k,v])=>`
            <div style="display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid rgba(255,255,255,.04);">
              <span style="font-size:12px;color:#888;">${k}</span>
              <span style="font-size:12px;color:#fff;font-weight:500;">${v}</span>
            </div>`).join('')}
        </div>
        <!-- Acciones -->
        <button type="button" id="md-download"
          style="width:100%;padding:13px;border-radius:12px;background:rgba(0,245,255,.08);border:1px solid rgba(0,245,255,.2);color:var(--cyan,#00f5ff);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;">
          <i data-lucide="download" style="width:16px;height:16px;"></i> Descargar mis datos
        </button>
        <button type="button" id="md-delete"
          style="width:100%;padding:13px;border-radius:12px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.3);color:#ef4444;font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;font-family:inherit;">
          <i data-lucide="trash-2" style="width:16px;height:16px;"></i> Eliminar mi cuenta y datos
        </button>
        <p style="font-size:10px;color:#555;text-align:center;">Al eliminar tu cuenta, todos tus datos se borrarán permanentemente</p>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('md-back')?.addEventListener('click',()=>navigateTo('privacy-data'));
    document.getElementById('md-download')?.addEventListener('click',()=>{
      const data={user:window.AppState.user,stats:window.OlympusStats?OlympusStats.get():{}};
      const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
      const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='olympus_datos.json';a.click();
    });
    document.getElementById('md-delete')?.addEventListener('click',()=>{
      if(confirm('⚠️ Esta acción eliminará tu cuenta y todos tus datos permanentemente. ¿Continuar?')){
        const email=window.AppState.user.email;
        const users=JSON.parse(localStorage.getItem('olympus_users')||'[]').filter(u=>u.email!==email);
        localStorage.setItem('olympus_users',JSON.stringify(users));
        ['olympus_session','olympus_theme'].forEach(k=>localStorage.removeItem(k));
        ['olympus_stats_','olympus_workouts_','olympus_notifs_','olympus_ch_','olympus_devices_'].forEach(p=>localStorage.removeItem(p+email));
        window.AppState.user={name:'',email:'',role:'user',gender:'male',level:1,xp:0,xpToNext:1000,streak:0};
        alert('Cuenta eliminada.');
        navigateTo('welcome');
      }
    });
    if(window.lucide)lucide.createIcons();
  }
};

/*PERMISOS DE LA APP*/
window.screens['app-permissions'] = {
  render() {
    const perms=JSON.parse(localStorage.getItem(_permKey())||'{"notifs":true,"cam":false,"loc":false}');
    const perm=(id,icon,title,sub)=>`
      <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.05);">
        <i data-lucide="${icon}" style="width:18px;height:18px;color:var(--cyan);flex-shrink:0;"></i>
        <div style="flex:1;"><p style="font-size:13px;font-weight:600;">${title}</p><p style="font-size:11px;color:#888;">${sub}</p></div>
        <div id="pm-${id}" data-key="${id}" class="perm-toggle"
          style="width:44px;height:26px;border-radius:13px;cursor:pointer;flex-shrink:0;position:relative;
            background:${perms[id]?'var(--cyan,#00f5ff)':'rgba(255,255,255,.15)'};transition:background .25s;">
          <div style="width:20px;height:20px;border-radius:50%;background:#fff;position:absolute;top:3px;
            ${perms[id]?'right:3px':'left:3px'};transition:all .25s;"></div>
        </div>
      </div>`;
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="ap-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Permisos de la app</h2></div>
      </div>
      <div style="margin:16px 20px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.07);">
        ${perm('notifs','bell','Notificaciones','Alertas y recordatorios de entrenamiento')}
        ${perm('cam','camera','Cámara','Para foto de perfil (próximamente)')}
        ${perm('loc','map-pin','Ubicación','Para encontrar gimnasios cercanos (próximamente)')}
        <div style="height:1px;"></div>
      </div>
      <p style="font-size:11px;color:#555;padding:0 20px;text-align:center;">En la versión web, algunos permisos dependen del navegador</p>
    </div>`;
  },
  init() {
    document.getElementById('ap-back')?.addEventListener('click',()=>navigateTo('privacy-data'));
    document.querySelectorAll('.perm-toggle').forEach(tog=>{
      tog.addEventListener('click',()=>{
        const perms=JSON.parse(localStorage.getItem(_permKey())||'{"notifs":true,"cam":false,"loc":false}');
        const key=tog.dataset.key;
        perms[key]=!perms[key];
        localStorage.setItem(_permKey(),JSON.stringify(perms));
        tog.style.background=perms[key]?'var(--cyan,#00f5ff)':'rgba(255,255,255,.15)';
        const thumb=tog.querySelector('div');
        thumb.style.right=perms[key]?'3px':''; thumb.style.left=perms[key]?'':'3px';
      });
    });
    if(window.lucide)lucide.createIcons();
  }
};

/*AYUDA Y SOPORTE */
window.screens['help-support'] = {
  render() {
    const items=[
      {icon:'message-circle',color:'#888',title:'Chat de soporte',sub:'No disponible · Próximamente',nav:'',disabled:true},
      {icon:'phone',         color:'#22c55e',title:'Llamar a soporte',sub:'3201233459',nav:'call'},
      {icon:'book-open',     color:'var(--cyan)',title:'Centro de ayuda',sub:'Aprende a usar Olympus',nav:'help-center'},
      {icon:'alert-triangle',color:'var(--orange)',title:'Reportar un problema',sub:'Enviar a olympus@gmail.com',nav:'report-problem'},
    ];
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="hs-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Ayuda y soporte</h2></div>
      </div>
      <div style="margin:16px 20px;border-radius:14px;overflow:hidden;border:1px solid rgba(255,255,255,.07);">
        ${items.map(it=>`
          <div style="display:flex;align-items:center;gap:12px;padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.05);
            cursor:${it.disabled?'not-allowed':'pointer'};opacity:${it.disabled?.5:1};" class="hs-nav" data-nav="${it.nav}">
            <div style="width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.05);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <i data-lucide="${it.icon}" style="width:16px;height:16px;color:${it.color};"></i>
            </div>
            <div style="flex:1;"><p style="font-size:13px;font-weight:600;">${it.title}</p><p style="font-size:11px;color:#888;">${it.sub}</p></div>
            ${!it.disabled?`<i data-lucide="chevron-right" style="width:16px;height:16px;color:#555;flex-shrink:0;"></i>`:''}
          </div>`).join('')}
        <div style="height:1px;"></div>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('hs-back')?.addEventListener('click',()=>navigateTo('profile'));
    document.querySelectorAll('.hs-nav').forEach(el=>{
      el.addEventListener('click',()=>{
        const nav=el.dataset.nav;
        if(!nav)return;
        if(nav==='call'){window.location.href='tel:3201233459';}
        else navigateTo(nav);
      });
    });
    if(window.lucide)lucide.createIcons();
  }
};

/*CENTRO DE AYUDA*/
window.screens['help-center'] = {
  render() {
    const secs=[
      {t:'🏠 Cómo funciona Olympus',c:`Olympus es tu app de fitness personalizada. Cuando creas tu cuenta y completas el onboarding, generamos un plan de entrenamiento adaptado a tus objetivos, nivel y equipo disponible.`},
      {t:'💪 Módulo Entrena',c:`Ve a "Entrena" para ver tu plan semanal. Puedes expandir cada día para ver los ejercicios. Al tocar "Iniciar entrenamiento", comienza el timer y puedes marcar cada serie como completada. El descanso se cuenta automáticamente.`},
      {t:'📊 Módulo Progreso',c:`Ve a "Progreso" para ver tus estadísticas. Con cada entrenamiento completado se actualizan: calorías quemadas, tiempo activo, número de entrenamientos y racha de días. Las gráficas muestran tu actividad semanal.`},
      {t:'🏆 Retos y Logros',c:`En "Retos" verás los desafíos disponibles. Toca cualquier reto para ver cómo completarlo. Los logros se desbloquean automáticamente cuando cumples la condición (ej: 8 días seguidos de entrenamiento).`},
      {t:'👤 Tu Perfil',c:`En "Perfil" puedes editar tu peso, edad, objetivo y bio. El nombre y la estatura solo se pueden cambiar contactando a soporte. En Preferencias puedes cambiar las unidades y el modo oscuro. En Privacidad puedes cambiar tu contraseña o descargar tus datos.`},
      {t:'🤖 Asistente Atlas IA',c:`El botón azul-verde (abajo-derecha) abre el asistente Atlas. Puedes preguntarle sobre técnica de ejercicios, nutrición, rutinas, recuperación y más. Toca las sugerencias rápidas para empezar.`},
    ];
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="hc-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Centro de ayuda</h2></div>
      </div>
      <div style="padding:16px 20px 80px;display:flex;flex-direction:column;gap:10px;">
        ${secs.map(s=>`
          <div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:16px;">
            <p style="font-size:13px;font-weight:700;margin-bottom:8px;">${s.t}</p>
            <p style="font-size:12px;color:#aaa;line-height:1.65;">${s.c}</p>
          </div>`).join('')}
      </div>
    </div>`;
  },
  init() {
    document.getElementById('hc-back')?.addEventListener('click',()=>navigateTo('help-support'));
    if(window.lucide)lucide.createIcons();
  }
};

/*REPORTAR UN PROBLEMA */
window.screens['report-problem'] = {
  render() {
    return `
    <div class="screen-scroll" style="background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);">
        <button type="button" id="rp-back" style="width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;"></i>
        </button>
        <div><h2 style="font-size:17px;font-weight:700;">Reportar un problema</h2></div>
      </div>
      <div style="padding:20px;display:flex;flex-direction:column;gap:16px;">
        <div style="background:rgba(249,115,22,.06);border:1px solid rgba(249,115,22,.2);border-radius:12px;padding:14px;">
          <p style="font-size:12px;color:#aaa;line-height:1.6;">Tu reporte se enviará a <strong style="color:#00f5ff;">olympus@gmail.com</strong> · Responderemos en menos de 24 horas</p>
        </div>
        <div class="input-group">
          <label class="input-label">Tipo de problema</label>
          <select id="rp-type" style="width:100%;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:14px;font-family:inherit;outline:none;appearance:none;">
            <option value="bug">Error / Bug en la app</option>
            <option value="account">Problema con mi cuenta</option>
            <option value="feature">Sugerencia de mejora</option>
            <option value="other">Otro</option>
          </select>
        </div>
        <div class="input-group">
          <label class="input-label">Descripción del problema</label>
          <textarea id="rp-desc" rows="5" placeholder="Describe detalladamente el problema que encontraste..."
            style="width:100%;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.15);color:#fff;font-size:14px;font-family:inherit;outline:none;resize:none;"></textarea>
        </div>
        <div id="rp-err" class="alert-error hidden"></div>
        <button type="button" id="rp-send" class="btn btn-primary" style="height:52px;">
          <i data-lucide="send" style="width:18px;height:18px;color:#000;"></i>
          Enviar reporte
        </button>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('rp-back')?.addEventListener('click',()=>navigateTo('help-support'));
    document.getElementById('rp-send')?.addEventListener('click',()=>{
      const desc=document.getElementById('rp-desc')?.value.trim();
      const err=document.getElementById('rp-err');
      if(!desc||desc.length<10){err.textContent='Por favor describe el problema (mínimo 10 caracteres)';err.classList.remove('hidden');return;}
      err.classList.add('hidden');
      const type=document.getElementById('rp-type')?.value;
      const mailto=`mailto:olympus@gmail.com?subject=Reporte: ${type}&body=${encodeURIComponent(`Usuario: ${window.AppState.user.email}\n\nProblema: ${desc}`)}`;
      window.location.href=mailto;
      setTimeout(()=>alert('✅ Gracias por tu reporte. Te responderemos pronto.'),500);
    });
    if(window.lucide)lucide.createIcons();
  }
};