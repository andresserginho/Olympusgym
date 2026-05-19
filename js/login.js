/*LOGIN.JS — Autenticación y Registro*/

// ========================================================
// OLYMPUS SECURITY — Crypto Utils (Web Crypto API nativa)
// ========================================================
function generateSalt() {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

/* VALIDACIONES*/
function validateName(v) {
  if (!v || !String(v).trim()) return 'El nombre es obligatorio';
  const n = String(v).trim();
  if (n.length < 2)   return 'Mínimo 2 caracteres';
  if (n.length > 255) return 'Máximo 255 caracteres';
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙñÑüÜ\s\-']+$/.test(n))
    return 'El nombre solo puede contener letras';
  return '';
}
function validateEmail(v) {
  if (!v || !String(v).trim()) return 'El correo es obligatorio';
  const e = String(v).trim();
  if (!e.includes('@'))   return 'El correo debe contener @';
  if (e.startsWith('@') || e.endsWith('@')) return 'Correo inválido';
  if (e.includes('..'))   return 'Correo inválido';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return 'Formato de correo inválido';
  return '';
}
function validatePasswordLogin(v) {
  if (!v) return 'La contraseña es obligatoria';
  if (/\s/.test(String(v))) return 'No se permiten espacios';
  return '';
}
function validatePassword(v) {
  if (!v) return 'La contraseña es obligatoria';
  const p = String(v);
  if (/\s/.test(p))     return 'No se permiten espacios';
  if (p.length < 8)     return 'Mínimo 8 caracteres';
  if (!/[A-Z]/.test(p)) return 'Falta una letra mayúscula (A-Z)';
  if (!/[a-z]/.test(p)) return 'Falta una letra minúscula (a-z)';
  if (!/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?]/.test(p))
    return 'Falta un carácter especial (!@#$...)';
  return '';
}
function passwordStrengthScore(pass) {
  const p = String(pass || '');
  return [p.length>=8, /[A-Z]/.test(p), /[a-z]/.test(p),
    /[0-9]/.test(p), /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?]/.test(p)
  ].filter(Boolean).length;
}
function updateStrengthUI(pass) {
  const segs  = document.querySelectorAll('#reg-strength .strength-segment');
  const label = document.getElementById('reg-strength-label');
  if (!label) return;
  const colors = ['','#ef4444','#f97316','#fbbf24','#22c55e','#00f5ff'];
  const texts  = ['','Muy débil','Débil','Regular','Fuerte','Muy fuerte'];
  if (!pass) {
    segs.forEach(el => { el.style.background = 'rgba(255,255,255,0.1)'; });
    label.textContent = ''; return;
  }
  const score = passwordStrengthScore(pass);
  segs.forEach((el,i) => { el.style.background = i<score ? colors[score] : 'rgba(255,255,255,0.1)'; });
  label.textContent = texts[score] || '';
  label.style.color  = colors[score] || '#888';
}
function toggleErr(input, msgEl, message) {
  if (!input || !msgEl) return;
  input.classList.toggle('error', Boolean(message));
  msgEl.textContent = message || '';
  msgEl.classList.toggle('hidden', !message);
}
function iconGoogleSVG() {
  return `<svg class="social-icon-svg" width="18" height="18" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.2-1.9 2.9l3 2.3C20.5 17.4 22 14.8 22 12c0-.6-.1-1.2-.2-1.8H12z"/>
    <path fill="#34A853" d="M12 22c2.6 0 4.8-.9 6.4-2.4l-3-2.3c-.8.6-1.9 1-3.4 1-2.6 0-4.8-1.8-5.6-4.2H3.3v2.8C4.9 20 8.2 22 12 22z"/>
    <path fill="#4A90E2" d="M6.4 13.1c-.2-.6-.3-1.2-.3-1.8s.1-1.2.3-1.8V6.7H3.3C2.5 8.2 2 9.8 2 11.3s.5 3.1 1.3 4.6l3.1-2.8z"/>
    <path fill="#FBBC05" d="M12 5.4c1.5 0 2.8.5 3.8 1.5l2.9-2.9C16.8 2.9 14.6 2 12 2 8.2 2 4.9 4 3.3 7.3l3.1 2.8C7.2 7.2 9.4 5.4 12 5.4z"/>
  </svg>`;
}
function iconXSVG() {
  return `<svg class="social-icon-svg social-icon-x" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>`;
}

/*WELCOME*/
window.screens.welcome = {
  render() {
    return `<div class="screen-container fade-in"
        style="padding:56px 32px;justify-content:space-between;align-items:center;">
      ${backgroundHTML()}
      <div class="flex items-center gap-3" style="z-index:1;">
        ${olympusLogoSVG(28)}
        <span style="letter-spacing:0.3em;font-size:14px;color:var(--cyan);">OLYMPUS</span>
      </div>
      <div class="flex flex-col items-center text-center gap-5" style="z-index:1;">
        <div class="scale-in" style="position:relative;">
          <div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(0,245,255,.22) 0%,transparent 65%);transform:scale(2);pointer-events:none;"></div>
          ${olympusLogoSVG(100)}
        </div>
        <div>
          <h1 class="fade-in" style="font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:.02em;margin-bottom:10px;">
            ¡Bienvenidos a <span style="color:var(--cyan);">OLYMPUS</span>!
          </h1>
          <p class="welcome-tagline">Descubre cómo simplificar tus entrenamientos de la mejor manera</p>
        </div>
      </div>
      <div class="flex flex-col gap-4 w-full" style="max-width:380px;z-index:1;">
        <button type="button" class="btn btn-outline"       id="btn-go-login">Iniciar Sesión</button>
        <button type="button" class="btn btn-outline-white" id="btn-go-register">Crear una Cuenta</button>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('btn-go-login').addEventListener('click',    () => navigateTo('login'));
    document.getElementById('btn-go-register').addEventListener('click', () => navigateTo('register'));
  },
};

/*LOGIN*/
window.screens.login = {
  render() {
    return `<div class="auth-screen slide-in-right">
      ${backgroundHTML()}
      <button type="button" class="link-back" id="btn-back-welcome">
        <span style="font-size:18px;">←</span> Volver
      </button>
      <div class="auth-header-row">
        ${olympusLogoSVG(32)}
        <div>
          <h2 class="auth-title">Iniciar Sesión</h2>
          <p class="auth-subtitle">Continúa tu camino al siguiente nivel</p>
        </div>
      </div>
      <div id="login-general" class="alert-error hidden" role="alert" style="margin-bottom:16px;"></div>
      <form id="login-form" class="flex flex-col gap-4 auth-form-max" autocomplete="off">
        <div class="input-group">
          <label class="input-label" for="login-email">Correo electrónico</label>
          <div class="input-wrapper">
            <input type="email" id="login-email" class="input-field auth-field"
              autocomplete="off" placeholder="tu@email.com">
          </div>
          <p id="login-email-err" class="input-error hidden"></p>
        </div>
        <div class="input-group">
          <label class="input-label" for="login-pass">Contraseña</label>
          <div class="input-wrapper">
            <input type="password" id="login-pass" class="input-field auth-field"
              autocomplete="new-password" placeholder="••••••••" style="padding-right:44px;">
            <button type="button" class="input-icon" id="login-pass-toggle">
              <i data-lucide="eye-off"></i>
            </button>
          </div>
          <p id="login-pass-err" class="input-error hidden"></p>
        </div>
        <div class="auth-forgot-row">
          <button type="button" class="link-cyan" id="login-forgot">¿Olvidaste tu contraseña?</button>
        </div>
        <button type="submit" class="btn btn-primary auth-submit">
          Iniciar Sesión <i data-lucide="chevron-right"></i>
        </button>
      </form>
      <div class="divider-or">
        <span class="divider-line"></span>
        <span class="divider-text">o continúa con</span>
        <span class="divider-line"></span>
      </div>
      <div class="social-row">
        <button type="button" class="btn-social social-btn-dark">${iconGoogleSVG()} Google</button>
        <button type="button" class="btn-social social-btn-dark">${iconXSVG()} X</button>
      </div>
      <div class="test-accounts-box">
        <p class="test-accounts-title">Cuentas de prueba (clic para rellenar)</p>
        <button type="button" class="test-account-row" data-email="demo@olympus.com"  data-password="Demo1234">
          <span>demo@olympus.com</span><span class="test-account-pass">Demo1234</span>
        </button>
        <button type="button" class="test-account-row" data-email="admin@olympus.com" data-password="Admin1234">
          <span>admin@olympus.com</span><span class="test-account-pass">Admin1234</span>
        </button>
      </div>
      <p class="auth-footer">
        ¿No tienes cuenta?
        <button type="button" class="link-cyan-inline" id="login-go-register">Regístrate gratis</button>
      </p>
    </div>`;
  },
  init() {
    const emailIn = document.getElementById('login-email');
    const passIn  = document.getElementById('login-pass');
    if (emailIn) emailIn.value = '';
    if (passIn)  passIn.value  = '';

    const form  = document.getElementById('login-form');
    const genEl = document.getElementById('login-general');
    const clear = () => { genEl.textContent = ''; genEl.classList.add('hidden'); };

    document.getElementById('btn-back-welcome').addEventListener('click', () => navigateTo('welcome'));
    document.getElementById('login-go-register').addEventListener('click', () => navigateTo('register'));
    document.getElementById('login-forgot').addEventListener('click', () =>
      alert('Para recuperar tu contraseña escribe a: olympus@gmail.com')
    );

    document.querySelectorAll('.test-account-row').forEach(row => {
      row.addEventListener('click', () => {
        if (emailIn) emailIn.value = row.dataset.email    || '';
        if (passIn)  passIn.value  = row.dataset.password || '';
        toggleErr(emailIn, document.getElementById('login-email-err'), '');
        toggleErr(passIn,  document.getElementById('login-pass-err'),  '');
        clear();
      });
    });

    passIn?.addEventListener('input', () => {
      if (passIn.value.includes(' ')) passIn.value = passIn.value.replace(/\s/g, '');
      toggleErr(passIn, document.getElementById('login-pass-err'), '');
      clear();
    });
    emailIn?.addEventListener('input', () => {
      toggleErr(emailIn, document.getElementById('login-email-err'), '');
      clear();
    });

    document.getElementById('login-pass-toggle')?.addEventListener('click', () => {
      const show = passIn.type === 'password';
      passIn.type = show ? 'text' : 'password';
      document.getElementById('login-pass-toggle').innerHTML =
        show ? '<i data-lucide="eye"></i>' : '<i data-lucide="eye-off"></i>';
      if (window.lucide) lucide.createIcons();
    });

    document.querySelectorAll('.social-row .social-btn-dark').forEach(btn =>
      btn.addEventListener('click', () => alert('Integración social no disponible en esta demo.'))
    );

    // ═══════════════════════════════════════════════════════
    // LOGIN SUBMIT — SHA-256 hash check + legacy fallback
    // ═══════════════════════════════════════════════════════
    form.addEventListener('submit', async e => {
      e.preventDefault(); clear();
      const email = emailIn.value.trim();
      const pass  = passIn.value;
      const isTest = (window.AppState.testUsers || [])
        .some(u => u.email.toLowerCase() === email.toLowerCase());
      const ee = validateEmail(email);
      const pe = isTest ? validatePasswordLogin(pass) : validatePassword(pass);
      toggleErr(emailIn, document.getElementById('login-email-err'), ee);
      toggleErr(passIn,  document.getElementById('login-pass-err'),  pe);
      if (ee || pe) return;

      // Buscar usuario solo por email
      const found = (window.AppState.testUsers || []).find(
        u => u.email.toLowerCase() === email.toLowerCase()
      );

      // Verificar contraseña: hash (nuevos) o texto plano (legacy/prueba)
      let user = null;
      if (found) {
        let passwordOk = false;
        if (found.salt) {
          const inputHash = await hashPassword(pass, found.salt);
          passwordOk = inputHash === found.password;
        } else {
          // Legacy: demo@olympus.com, admin@olympus.com
          passwordOk = found.password === pass;
        }
        if (passwordOk) user = found;
      }

      if (user) {
        Object.assign(window.AppState.user, {
          name: user.name, email: user.email,
          role: user.role || 'user', emailVerified: true,
          level:1, xp:0, xpToNext:1000, streak:0,
        });
        window.AppState.fromRegisterFlow = false;
        localStorage.setItem('olympus_session', JSON.stringify(window.AppState.user));

        if (window.OlympusXP) OlympusXP.sync();
        if (window.OlympusStats) {
          const s = OlympusStats.get();
          window.AppState.user.streak = s.racha_actual || 0;
        }
        localStorage.setItem('olympus_session', JSON.stringify(window.AppState.user));

        const token = generateSessionToken(email);
        sessionStorage.setItem('olympus_tab', token);
        localStorage.setItem('olympus_active_tab', token);
        if (window._resetInactivity) _resetInactivity();

        if (user.role === 'admin' || user.role === 'administrador') {
          navigateTo('admin-dashboard');
        } else {
          navigateTo('dashboard');
        }
      } else {
        genEl.textContent = 'Correo o contraseña incorrectos.';
        genEl.classList.remove('hidden');
      }
    });
    if (window.lucide) lucide.createIcons();
  },
};

/*REGISTRO — con persistencia de datos al ver Términos/Privacidad*/
window.screens.register = {
  render() {
    const tmp     = window._regFormTemp || {};
    const maxDate = new Date().toISOString().split('T')[0];

    return `<div class="auth-screen slide-in-right">
      ${backgroundHTML()}
      <button type="button" class="link-back" id="btn-back-reg">
        <span style="font-size:18px;">←</span> Volver
      </button>
      <div class="auth-header-row">
        ${olympusLogoSVG(32)}
        <div>
          <h2 class="auth-title">Crear Cuenta</h2>
          <p class="auth-subtitle">Comienza tu transformación hoy</p>
        </div>
      </div>
      <form id="register-form" class="flex flex-col gap-4 auth-form-max" autocomplete="off">
        <div class="input-group">
          <label class="input-label" for="reg-name">Nombre completo</label>
          <input type="text" id="reg-name" class="input-field auth-field"
            autocomplete="off" placeholder="Tu nombre completo" maxlength="255"
            value="${tmp.name || ''}">
          <p id="reg-name-err" class="input-error hidden"></p>
        </div>
        <div class="input-group">
          <label class="input-label" for="reg-email">Correo electrónico</label>
          <input type="email" id="reg-email" class="input-field auth-field"
            autocomplete="off" placeholder="tu@email.com"
            value="${tmp.email || ''}">
          <p id="reg-email-err" class="input-error hidden"></p>
        </div>
        <div class="input-group">
          <label class="input-label" for="reg-birth">Fecha de nacimiento</label>
          <input type="date" id="reg-birth" class="input-field auth-field"
            max="${maxDate}" min="1920-01-01"
            value="${tmp.birth || ''}">
          <p id="reg-birth-err" class="input-error hidden"></p>
        </div>
        <div class="input-group">
          <label class="input-label" for="reg-pass">Contraseña</label>
          <div class="input-wrapper">
            <input type="password" id="reg-pass" class="input-field auth-field"
              autocomplete="new-password" placeholder="Mínimo 8 caracteres" style="padding-right:44px;">
            <button type="button" class="input-icon" id="reg-pass-toggle">
              <i data-lucide="eye-off"></i>
            </button>
          </div>
          <div id="reg-strength" class="strength-bar" aria-hidden="true">
            <div class="strength-segment"></div><div class="strength-segment"></div>
            <div class="strength-segment"></div><div class="strength-segment"></div>
            <div class="strength-segment"></div>
          </div>
          <p id="reg-strength-label" class="strength-label"></p>
          <div id="reg-pass-requirements" style="display:none;flex-direction:column;gap:3px;margin-top:6px;">
            <p id="req-len" style="font-size:11px;">○ Mínimo 8 caracteres</p>
            <p id="req-up"  style="font-size:11px;">○ Una letra mayúscula (A-Z)</p>
            <p id="req-lo"  style="font-size:11px;">○ Una letra minúscula (a-z)</p>
            <p id="req-sp"  style="font-size:11px;">○ Un carácter especial (!@#$...)</p>
          </div>
          <p id="reg-pass-err" class="input-error hidden"></p>
        </div>
        <div class="input-group">
          <label class="input-label" for="reg-pass2">Confirmar contraseña</label>
          <div class="input-wrapper">
            <input type="password" id="reg-pass2" class="input-field auth-field"
              autocomplete="new-password" placeholder="Repite la contraseña" style="padding-right:44px;">
            <button type="button" class="input-icon" id="reg-pass2-toggle">
              <i data-lucide="eye-off"></i>
            </button>
          </div>
          <p id="reg-pass2-err" class="input-error hidden"></p>
        </div>
        <div class="terms-row" style="cursor:default;">
          <input type="checkbox" id="reg-terms" style="cursor:pointer;" ${tmp.terms ? 'checked' : ''}>
          <span>Acepto los
            <button type="button" class="link-cyan-inline terms-link" data-link="terms">Términos</button>
            y la
            <button type="button" class="link-cyan-inline terms-link" data-link="privacy">Política de Privacidad</button>
          </span>
        </div>
        <p id="reg-terms-err" class="input-error hidden" style="margin-top:-8px;"></p>
        <button type="submit" class="btn btn-primary auth-submit">
          Crear mi cuenta <i data-lucide="chevron-right"></i>
        </button>
      </form>
      <div class="divider-or">
        <span class="divider-line"></span><span class="divider-text">o regístrate con</span><span class="divider-line"></span>
      </div>
      <div class="social-row">
        <button type="button" class="btn-social social-btn-dark">${iconGoogleSVG()} Google</button>
        <button type="button" class="btn-social social-btn-dark">${iconXSVG()} X</button>
      </div>
      <p class="auth-footer">
        ¿Ya tienes cuenta?
        <button type="button" class="link-cyan-inline" id="reg-go-login">Inicia sesión</button>
      </p>
    </div>`;
  },

  init() {
    const form    = document.getElementById('register-form');
    const nameIn  = document.getElementById('reg-name');
    const emailIn = document.getElementById('reg-email');
    const birthIn = document.getElementById('reg-birth');
    const passIn  = document.getElementById('reg-pass');
    const pass2In = document.getElementById('reg-pass2');
    const terms   = document.getElementById('reg-terms');

    document.getElementById('btn-back-reg').addEventListener('click', () => {
      window._regFormTemp = null;
      navigateTo('welcome');
    });
    document.getElementById('reg-go-login').addEventListener('click', () => {
      window._regFormTemp = null;
      navigateTo('login');
    });

    document.querySelectorAll('.terms-link').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        window._regFormTemp = {
          name:  nameIn?.value  || '',
          email: emailIn?.value || '',
          birth: birthIn?.value || '',
          terms: terms?.checked || false,
        };
        navigateTo(btn.dataset.link === 'privacy' ? 'privacy-policy' : 'terms');
      });
    });

    const bindToggle = (btnId, inp) => {
      document.getElementById(btnId)?.addEventListener('click', () => {
        const show = inp.type === 'password';
        inp.type = show ? 'text' : 'password';
        document.getElementById(btnId).innerHTML =
          show ? '<i data-lucide="eye"></i>' : '<i data-lucide="eye-off"></i>';
        if (window.lucide) lucide.createIcons();
      });
    };
    bindToggle('reg-pass-toggle',  passIn);
    bindToggle('reg-pass2-toggle', pass2In);

    nameIn.addEventListener('input', () => {
      const filtrado = nameIn.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚàèìòùÀÈÌÒÙñÑüÜ\s\-']/g, '');
      if (nameIn.value !== filtrado) nameIn.value = filtrado;
      toggleErr(nameIn, document.getElementById('reg-name-err'), '');
    });
    emailIn.addEventListener('input', () =>
      toggleErr(emailIn, document.getElementById('reg-email-err'), '')
    );
    birthIn.addEventListener('change', () =>
      toggleErr(birthIn, document.getElementById('reg-birth-err'), '')
    );

    const REQ = {
      'req-len': { check: p => p.length >= 8,                                     label:'Mínimo 8 caracteres' },
      'req-up':  { check: p => /[A-Z]/.test(p),                                   label:'Una letra mayúscula (A-Z)' },
      'req-lo':  { check: p => /[a-z]/.test(p),                                   label:'Una letra minúscula (a-z)' },
      'req-sp':  { check: p => /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?]/.test(p),  label:'Un carácter especial (!@#$...)' },
    };
    passIn.addEventListener('input', () => {
      if (passIn.value.includes(' ')) passIn.value = passIn.value.replace(/\s/g, '');
      const p   = passIn.value;
      const req = document.getElementById('reg-pass-requirements');
      if (req) req.style.display = p ? 'flex' : 'none';
      Object.entries(REQ).forEach(([id, {check, label}]) => {
        const el = document.getElementById(id);
        if (!el) return;
        const met = check(p);
        el.textContent = `${met ? '✓' : '✗'} ${label}`;
        el.style.color  = met ? '#22c55e' : '#ef4444';
      });
      updateStrengthUI(p);
      toggleErr(passIn, document.getElementById('reg-pass-err'), '');
    });
    pass2In.addEventListener('input', () => {
      if (pass2In.value.includes(' ')) pass2In.value = pass2In.value.replace(/\s/g, '');
      toggleErr(pass2In, document.getElementById('reg-pass2-err'), '');
    });
    terms.addEventListener('change', () =>
      document.getElementById('reg-terms-err').classList.add('hidden')
    );
    document.querySelectorAll('.social-row .social-btn-dark').forEach(btn =>
      btn.addEventListener('click', () => alert('No disponible en esta demo.'))
    );

    // ═══════════════════════════════════════════════════════
    // REGISTER SUBMIT — contraseña hasheada con SHA-256+salt
    // ═══════════════════════════════════════════════════════
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const name  = nameIn.value;
      const email = emailIn.value.trim();
      const birth = birthIn.value;
      const pass  = passIn.value;
      const pass2 = pass2In.value;

      let be = '';
      if (!birth) {
        be = 'La fecha de nacimiento es obligatoria';
      } else {
        const edad = window.calcularEdad ? calcularEdad(birth)
          : (new Date().getFullYear() - new Date(birth).getFullYear());
        if (edad < 13) be = 'Debes tener al menos 13 años';
      }

      const ne  = validateName(name);
      const ee  = validateEmail(email);
      const pe  = validatePassword(pass);
      const p2e = pass !== pass2 ? 'Las contraseñas no coinciden' : '';

      toggleErr(nameIn,  document.getElementById('reg-name-err'),  ne);
      toggleErr(emailIn, document.getElementById('reg-email-err'), ee);
      toggleErr(birthIn, document.getElementById('reg-birth-err'), be);
      toggleErr(passIn,  document.getElementById('reg-pass-err'),  pe);
      toggleErr(pass2In, document.getElementById('reg-pass2-err'), p2e);

      const termsErr = document.getElementById('reg-terms-err');
      if (!terms.checked) {
        termsErr.textContent = 'Debes aceptar los términos para continuar';
        termsErr.classList.remove('hidden');
      } else {
        termsErr.textContent = ''; termsErr.classList.add('hidden');
      }
      if (ne || ee || be || pe || p2e || !terms.checked) return;

      const saved  = JSON.parse(localStorage.getItem('olympus_users') || '[]');
      const allU   = [...(window.AppState.testUsers || []), ...saved];
      if (allU.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        toggleErr(emailIn, document.getElementById('reg-email-err'),
          'Este correo ya está registrado, usa otro');
        return;
      }

      const edad = window.calcularEdad ? calcularEdad(birth) : null;

      // Hashear contraseña antes de guardar
      const salt       = generateSalt();
      const hashedPass = await hashPassword(pass, salt);

      const newUser = { email, password: hashedPass, salt, name: name.trim(), role: 'user', fecha_nacimiento: birth };
      saved.push(newUser);
      localStorage.setItem('olympus_users', JSON.stringify(saved));
      if (window.AppState.testUsers) window.AppState.testUsers.push(newUser);

      Object.assign(window.AppState.user, {
        name: name.trim(), email,
        pendingVerificationEmail: email,
        emailVerified: false,
        fecha_nacimiento: birth,
        age: edad,
      });
      window.AppState.fromRegisterFlow = true;
      window._regFormTemp = null;

      navigateTo('verify-email');
    });

    updateStrengthUI('');
    if (window.lucide) lucide.createIcons();
  },
};

/*VERIFICAR EMAIL*/
function otpCodeValid(code) { return /^[0-9]{6}$/.test(code); }

window.screens['verify-email'] = {
  render() {
    const email = window.AppState.user.email || window.AppState.user.pendingVerificationEmail || '';
    return `<div class="auth-screen slide-in-right verify-email-screen">
      ${backgroundHTML()}
      <button type="button" class="link-back" id="verify-back">
        <span style="font-size:18px;">←</span> Volver
      </button>
      <div class="verify-email-header">
        <h2 class="auth-title verify-title">VERIFICA TU EMAIL</h2>
        <p class="verify-lead">
          Enviamos un código a <strong class="verify-email-strong">${email}</strong>
        </p>
      </div>
      <div id="verify-otp-err" class="alert-error hidden"></div>
      <div class="otp-row">
        <input type="text" inputmode="numeric" maxlength="3"
          class="otp-box auth-field" id="otp-a" autocomplete="one-time-code">
        <span class="otp-dash">—</span>
        <input type="text" inputmode="numeric" maxlength="3"
          class="otp-box auth-field" id="otp-b" autocomplete="one-time-code">
      </div>
      <p class="verify-spam-hint">¿No lo ves? Revisa spam.</p>
      <div class="verify-actions">
        <button type="button" class="btn btn-primary auth-submit" id="verify-submit">VERIFICAR</button>
        <button type="button" class="btn btn-secondary-light" id="verify-resend">REENVIAR EMAIL</button>
      </div>
      <div class="test-accounts-box verify-hint-box">
        <p class="test-accounts-title">Código de prueba: <strong>123456</strong> (o cualquier 6 dígitos)</p>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('verify-back').addEventListener('click', () => navigateTo('register'));
    const errEl = document.getElementById('verify-otp-err');
    const otpA  = document.getElementById('otp-a');
    const otpB  = document.getElementById('otp-b');
    const full  = () => `${otpA.value.replace(/\D/g,'')}${otpB.value.replace(/\D/g,'')}`;
    const showE = msg => { errEl.textContent=msg||''; errEl.classList.toggle('hidden',!msg); };

    otpA.addEventListener('input', () => {
      otpA.value = otpA.value.replace(/\D/g,'').slice(0,3);
      if (otpA.value.length >= 3 && !otpB.value) otpB.focus();
      showE('');
    });
    otpB.addEventListener('input', () => {
      otpB.value = otpB.value.replace(/\D/g,'').slice(0,3);
      showE('');
    });
    otpA.addEventListener('keydown', e => { if(e.key==='Backspace'&&!otpA.value) otpB.focus(); });

    document.querySelector('.verify-email-screen')?.addEventListener('paste', ev => {
      const d = (ev.clipboardData?.getData('text')||'').replace(/\D/g,'').slice(0,6);
      if (d.length !== 6) return;
      ev.preventDefault();
      otpA.value = d.slice(0,3); otpB.value = d.slice(3,6); showE('');
    });

    document.getElementById('verify-submit').addEventListener('click', () => {
      if (!otpCodeValid(full())) { showE('Introduce un código de 6 dígitos.'); return; }
      window.AppState.user.emailVerified = true;
      window.AppState.user.pendingVerificationEmail = '';
      navigateTo('email-verified');
    });
    document.getElementById('verify-resend').addEventListener('click', () =>
      alert('Email reenviado (simulado).')
    );
    requestAnimationFrame(() => otpA.focus());
    if (window.lucide) lucide.createIcons();
  },
};

/*EMAIL VERIFICADO*/
window.screens['email-verified'] = {
  render() {
    return `<div class="auth-screen slide-in-right email-verified-screen" style="position:relative;">
      ${backgroundHTML()}
      <button type="button" class="link-back" id="verified-back"
        style="position:absolute;top:24px;left:24px;z-index:1;">
        <span style="font-size:18px;">←</span> Volver
      </button>
      <div class="email-verified-inner">
        <div class="verified-check-wrap">
          <i data-lucide="check" class="verified-check-icon"></i>
        </div>
        <h2 class="auth-title verified-heading">¡EMAIL VERIFICADO!</h2>
        <p class="verified-sub">Tu cuenta está lista. Sigamos con tu perfil para personalizar tu plan.</p>
        <button type="button" class="btn btn-primary auth-submit" id="verified-cta">
          CONFIGURAR MI PERFIL <i data-lucide="chevron-right"></i>
        </button>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('verified-back').addEventListener('click',  () => navigateTo('verify-email'));
    document.getElementById('verified-cta').addEventListener('click',   () => navigateTo('onboarding'));
    if (window.lucide) lucide.createIcons();
  },
};