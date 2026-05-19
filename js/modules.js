/*MODULES.JS — Chat ATENA IA + Retos + Noticias + Legal*/

const _AI = [
  { t:['hola','hey','buenas','saludos','hi','qué tal'],
    r:'¡Hola! 💪 Soy **ATENA**, tu asistente de fitness Olympus.\n\nPuedo ayudarte con:\n• Técnica de ejercicios\n• Nutrición y dieta\n• Planes de entrenamiento\n• Recuperación y descanso\n\n¿En qué puedo orientarte hoy?' },
  { t:['sentadilla','squat','piernas','cuadriceps'],
    r:'La **sentadilla** es el rey de los ejercicios 🏆\n\n✅ Pies al ancho de hombros\n✅ Rodillas alineadas con los pies\n✅ Pecho arriba, espalda neutral\n✅ Baja hasta paralelo o más\n✅ Empuja a través de los talones\n\n💡 Empieza sin peso para aprender la técnica.' },
  { t:['perder peso','bajar','adelgazar','quemar grasa','déficit'],
    r:'Para **perder grasa** efectivamente:\n\n🔥 Déficit de 300-500 kcal/día\n🥩 Proteína: 1.6-2g/kg de peso\n🏋 Combina cardio + entrenamiento de fuerza\n😴 Duerme 7-9 horas\n💧 2-3 litros de agua al día\n\n⚠️ No pierdas más de 0.5-1kg por semana.' },
  { t:['ganar músculo','músculo','hipertrofia','volumen'],
    r:'Para **ganar músculo** necesitas:\n\n💪 Superávit calórico de 200-300 kcal\n🥩 Proteína: 1.8-2.2g/kg\n📈 Progresión de cargas constante\n🏋 3-5 días de entrenamiento\n😴 El músculo crece mientras descansas' },
  { t:['proteina','nutrición','dieta','comer','alimentación'],
    r:'**Nutrición** básica para rendir:\n\n🥩 Proteína: pollo, huevo, atún, legumbres\n🍚 Carbohidratos: avena, arroz, patata\n🥑 Grasas buenas: aguacate, nueces\n🚫 Evita ultraprocesados\n⏰ Come cada 3-4 horas' },
  { t:['descanso','recuperación','dormir','agujetas'],
    r:'La **recuperación** es igual de importante:\n\n😴 7-9h de sueño optimizan hormonas\n⏱ 24-48h de descanso por grupo muscular\n🧘 Estiramiento suave post-entrenamiento\n💧 Hidratación acelera la recuperación' },
  { t:['hiit','cardio','resistencia','correr','aeróbico'],
    r:'**HIIT** = cardio de alta intensidad:\n\n⚡ 20-30 min HIIT = 45-60 min cardio normal\n📋 30s esfuerzo máximo + 30s descanso × 10\n🔥 Mayor quema post-ejercicio\n⚠️ Máx 2-3 sesiones/semana' },
  { t:['calentamiento','estirar','movilidad'],
    r:'**Calentamiento** (10 min antes):\n\n🚴 5 min cardio ligero\n🔄 Movilidad articular: hombros, caderas, tobillos\n💪 Series con poco peso\n\n**Post-entreno**: 30-45s por músculo, sin rebotes' },
  { t:['rutina','plan','programa','frecuencia'],
    r:'**Rutinas** según nivel:\n\n🟢 Principiante (3 días): Full Body\n🟡 Intermedio (4 días): Upper/Lower\n🔴 Avanzado (5-6 días): PPL\n\nLa **Rutina IA** de Olympus se adapta automáticamente 🤖' },
  { t:['suplemento','creatina','whey','proteina en polvo'],
    r:'Suplementos más útiles:\n\n1️⃣ Creatina 3-5g/día — más respaldado ✅\n2️⃣ Proteína whey — conveniente\n3️⃣ Cafeína 150-200mg pre-entreno\n4️⃣ Omega-3 2-3g/día\n\n💡 Sin buena dieta, los sups no sirven.' },
  { t:['espalda','dorsal','remo','dominadas'],
    r:'Para la **espalda**:\n\n🏋 Dominadas: el mejor ejercicio de espalda\n🏋 Remo con barra: espalda recta, jala al abdomen\n🏋 Jalón en polea: controla la bajada\n\n💡 La espalda es el músculo más grande del tren superior.' },
  { t:['cuanto descansar','tiempo descanso','descanso entre series'],
    r:'**Tiempos de descanso** recomendados:\n\n💪 Fuerza (1-5 reps): 3-5 minutos\n🏋 Hipertrofia (6-12 reps): 60-120 segundos\n⚡ Resistencia (>15 reps): 30-60 segundos\n\n💡 Menos descanso = más fatiga metabólica' },
  { t:['pecho','banca','press','pectoral'],
    r:'Para el **pecho**:\n\n🏋 Press de banca inclinado: contrae al subir\n🏋 Fondos en paralelas: excelente para pecho\n🏋 Aperturas: estira bien el pecho\n\n💡 Usa rango completo de movimiento.' },
  { t:['olympus','atena','app','asistente','cómo funciona'],
    r:'**Olympus** es tu app de fitness completa 💪\n\n📋 Entrena con planes IA personalizados\n📊 Ve tu progreso con estadísticas reales\n🏆 Completa retos y logros\n💬 ¡Soy ATENA, tu asistente 24/7! 😊\n\n¿En qué sección necesitas ayuda?' },
];

const _DEFAULT = 'Interesante pregunta 🤔 Puedo ayudarte con:\n• **Ejercicios y técnica**\n• **Nutrición y dieta**\n• **Planes de entrenamiento**\n• **Recuperación**\n\nSé más específico y te daré una respuesta detallada.';

let _chatHistory = [
  { role:'bot', text:'¡Hola! 💪 Soy **ATENA**, tu asistente de fitness de Olympus.\n\nEstoy aquí para ayudarte con entrenamientos, nutrición, recuperación y más.\n\n¿En qué puedo ayudarte hoy?' }
];

function _aiReply(msg) {
  const norm = t => t.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,'');
  const q = norm(msg);
  for (const item of _AI) {
    if (item.t.some(t => q.includes(norm(t)))) return item.r;
  }
  return _DEFAULT;
}

function _renderBubbles(msgs) {
  return msgs.map(m => {
    const isBot = m.role === 'bot';
    const html  = (m.text||'').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
    return `
      <div style="display:flex;${isBot?'':'flex-direction:row-reverse;'}gap:8px;margin-bottom:16px;align-items:flex-end;">
        ${isBot ? `<div style="width:30px;height:30px;border-radius:50%;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="bot" style="width:14px;height:14px;color:var(--cyan,#00f5ff);"></i></div>` : ''}
        <div style="max-width:82%;padding:11px 14px;font-size:13px;line-height:1.55;
          border-radius:${isBot?'4px 14px 14px 14px':'14px 4px 14px 14px'};
          background:${isBot?'rgba(255,255,255,.06)':'var(--cyan,#00f5ff)'};
          color:${isBot?'#fff':'#000'};
          border:${isBot?'1px solid rgba(255,255,255,.08)':'none'};">
          ${html}
        </div>
      </div>`;
  }).join('');
}

window._renderChatMsgs = function() { return _renderBubbles(_chatHistory); };

window._sendChatMsg = function(msg) {
  _chatHistory.push({ role:'user', text:msg });
  const el = document.getElementById('chat-msgs');
  if (el) {
    el.innerHTML = _renderBubbles(_chatHistory) + `
      <div id="typing-dots" style="display:flex;gap:8px;align-items:flex-end;">
        <div style="width:30px;height:30px;border-radius:50%;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.25);display:flex;align-items:center;justify-content:center;">
          <i data-lucide="bot" style="width:14px;height:14px;color:var(--cyan,#00f5ff);"></i>
        </div>
        <div style="padding:10px 14px;border-radius:4px 14px 14px 14px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);">
          <span style="display:flex;gap:5px;align-items:center;">
            <span style="width:7px;height:7px;border-radius:50%;background:var(--cyan,#00f5ff);animation:pulse 1s infinite;"></span>
            <span style="width:7px;height:7px;border-radius:50%;background:var(--cyan,#00f5ff);animation:pulse 1s .2s infinite;"></span>
            <span style="width:7px;height:7px;border-radius:50%;background:var(--cyan,#00f5ff);animation:pulse 1s .4s infinite;"></span>
          </span>
        </div>
      </div>`;
    if (window.lucide) lucide.createIcons();
    el.scrollTop = el.scrollHeight;
  }
  setTimeout(() => {
    _chatHistory.push({ role:'bot', text:_aiReply(msg) });
    if (el) { el.innerHTML=_renderBubbles(_chatHistory); if(window.lucide)lucide.createIcons(); el.scrollTop=el.scrollHeight; }
  }, 700 + Math.random()*500);
};

/* ── PANTALLA DE CHAT ── */
window.screens.chat = {
  render() {
    return `
    <div style="display:flex;flex-direction:column;height:100%;min-height:100%;background:var(--background,#080808);">
      <div style="padding:48px 20px 12px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,.07);flex-shrink:0;">
        <button type="button" id="chat-back"
          style="width:36px;height:36px;border-radius:50%;background:rgba(0,245,255,.1);border:1px solid rgba(0,245,255,.3);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;color:var(--cyan,#00f5ff);"></i>
        </button>
        <div style="width:42px;height:42px;border-radius:50%;background:rgba(0,245,255,.12);border:1px solid rgba(0,245,255,.3);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i data-lucide="bot" style="width:20px;height:20px;color:var(--cyan,#00f5ff);"></i>
        </div>
        <div style="flex:1;">
          <p style="font-size:14px;font-weight:700;">Asistente ATENA Olympus</p>
          <p style="font-size:11px;color:var(--cyan,#00f5ff);">● IA · disponible</p>
        </div>
        <button type="button" id="chat-clear" style="font-size:11px;color:#888;background:none;border:none;cursor:pointer;padding:4px 8px;">
          Limpiar
        </button>
      </div>
      <div id="chat-msgs" style="flex:1;overflow-y:auto;padding:16px 20px;scrollbar-width:none;min-height:0;">
        ${_renderBubbles(_chatHistory)}
      </div>
      <div style="display:flex;flex-wrap:nowrap;gap:6px;overflow-x:auto;padding:8px 14px 4px;scrollbar-width:none;border-top:1px solid rgba(255,255,255,.05);flex-shrink:0;">
        <button class="chat-chip">¿Cuál es mi rutina de hoy?</button>
        <button class="chat-chip">Consejo para ganar músculo</button>
        <button class="chat-chip">¿Qué comer antes?</button>
        <button class="chat-chip">Ejercicio para espalda</button>
        <button class="chat-chip">¿Cuánto descansar?</button>
        <button class="chat-chip">Tips para cardio</button>
        <button class="chat-chip">¿Qué es HIIT?</button>
        <button class="chat-chip">Técnica de sentadilla</button>
      </div>
      <div style="padding:10px 16px 24px;display:flex;gap:10px;align-items:flex-end;border-top:1px solid rgba(255,255,255,.07);flex-shrink:0;">
        <input type="text" id="chat-input" class="chat-inp"
          placeholder="Escríbelo o usa el micrófono..." autocomplete="off">
        <button class="chat-send-btn" id="chat-send-btn">
          <i data-lucide="send" style="width:16px;height:16px;color:#000;"></i>
        </button>
      </div>
    </div>`;
  },
  init() {
    const scroll = () => { const el=document.getElementById('chat-msgs'); if(el)el.scrollTop=el.scrollHeight; };
    scroll();
    document.getElementById('chat-back')?.addEventListener('click', () =>
      navigateTo(window.AppState._chatPrevScreen || 'dashboard')
    );
    document.getElementById('chat-clear')?.addEventListener('click', () => {
      _chatHistory = [{ role:'bot', text:'¡Chat reiniciado! 💪 ¿En qué puedo ayudarte?' }];
      navigateTo('chat');
    });
    const send = () => {
      const inp = document.getElementById('chat-input');
      const msg = (inp?.value||'').trim();
      if (!msg) return;
      inp.value = '';
      window._sendChatMsg(msg);
    };
    document.getElementById('chat-send-btn')?.addEventListener('click', send);
    document.getElementById('chat-input')?.addEventListener('keydown', e => {
      if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(); }
    });
    document.querySelectorAll('.chat-chip').forEach(btn =>
      btn.addEventListener('click', () => {
        const inp = document.getElementById('chat-input');
        if (inp) { inp.value = btn.textContent.trim(); send(); }
      })
    );
    if (window.lucide) lucide.createIcons();
  }
};

/* ── PANTALLA DE RETOS ── */
window.screens.challenges = {
  render() {
    const stored = window.OlympusStats ? OlympusStats.getChallenges() : {};
    const RETOS = [
      { id:'ch1', name:'Semana de Fuego 🔥', xp:'+500 XP',
        desc:'Completa 5 entrenamientos en una sola semana (lunes a domingo).',
        target:5, border:'rgba(255,165,0,.2)', bg:'rgba(255,100,0,.03)',
        barColor:'linear-gradient(90deg,var(--orange,#f97316),var(--gold,#fbbf24))' },
      { id:'ch2', name:'Maratón de Cardio ⚡', xp:'+300 XP',
        desc:'Realiza 3 sesiones de cardio en una misma semana.',
        target:3, border:'rgba(0,245,255,.15)', bg:'rgba(0,245,255,.02)',
        barColor:'linear-gradient(90deg,var(--cyan,#00f5ff),#0099cc)' },
      { id:'ch3', name:'Reto del Mes 🏆', xp:'+1000 XP',
        desc:'Completa 14 entrenamientos durante el mismo mes.',
        target:14, border:'rgba(251,191,36,.2)', bg:'rgba(251,191,36,.02)',
        barColor:'linear-gradient(90deg,var(--gold,#fbbf24),#f59e0b)' },
      { id:'ch4', name:'Sin Excusas 💪', xp:'+200 XP',
        desc:'Entrena 10 veces seguidas sin interrumpir tu racha.',
        target:10, border:'rgba(168,85,247,.2)', bg:'rgba(168,85,247,.02)',
        barColor:'linear-gradient(90deg,#a855f7,#7c3aed)' },
      { id:'ch5', name:'King of HIIT ⚡', xp:'+400 XP',
        desc:'Completa 5 sesiones de HIIT de alta intensidad.',
        target:5, border:'rgba(239,68,68,.2)', bg:'rgba(239,68,68,.02)',
        barColor:'linear-gradient(90deg,#ef4444,#dc2626)' },
    ];
    const retosHTML = RETOS.map(r => {
      const uch  = stored[r.id] || { progress:0, status:'pendiente' };
      const pct  = Math.min(100, Math.round((uch.progress/r.target)*100));
      const done = uch.status === 'completado';
      return `
        <div style="border:1px solid ${r.border};background:${r.bg};border-radius:14px;padding:16px;margin-bottom:10px;cursor:pointer;"
          class="ch-card" data-id="${r.id}" data-name="${r.name}" data-desc="${r.desc}" data-xp="${r.xp}">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
            <div style="flex:1;">
              <p style="font-size:15px;font-weight:700;margin-bottom:3px;">${r.name}</p>
              <p style="font-size:11px;color:#888;">${uch.progress}/${r.target} · ${done?'¡Completado! 🎉':'En progreso'}</p>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;margin-left:10px;">
              <span style="font-size:11px;font-weight:700;color:var(--gold,#fbbf24);background:rgba(255,165,0,.15);border:1px solid rgba(255,165,0,.3);padding:4px 10px;border-radius:20px;">${r.xp}</span>
              ${done?`<span style="font-size:9px;color:#22c55e;font-weight:700;">✓ COMPLETADO</span>`:''}
            </div>
          </div>
          <div style="height:5px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
            <div style="width:${pct}%;height:100%;background:${r.barColor};border-radius:3px;transition:width .3s;"></div>
          </div>
          <p style="font-size:9px;color:#555;text-align:right;margin-top:4px;">${pct}% completado</p>
        </div>`;
    }).join('');
    return `
    <div class="screen-scroll" style="position:relative;">
      <div style="padding:40px 20px 14px;">
        <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:5px;">
          <i data-lucide="trophy" style="width:11px;height:11px;color:var(--cyan);"></i> RETOS
        </div>
        <h1 style="font-size:26px;font-weight:800;">Tus Retos</h1>
        <p style="font-size:12px;color:#888;margin-top:3px;">Toca un reto para ver cómo completarlo</p>
      </div>
      <div style="padding:0 20px 100px;">${retosHTML}</div>
    </div>`;
  },
  init() {
    document.querySelectorAll('.ch-card').forEach(card => {
      card.addEventListener('click', () => {
        const panel = document.createElement('div');
        panel.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:7000;display:flex;align-items:center;justify-content:center;padding:24px;backdrop-filter:blur(4px);';
        panel.innerHTML = `
          <div style="background:#0d0d0d;border:1px solid rgba(0,245,255,.2);border-radius:16px;padding:24px;max-width:360px;width:100%;text-align:center;">
            <p style="font-size:17px;font-weight:700;margin-bottom:8px;">${card.dataset.name}</p>
            <div style="background:rgba(251,191,36,.1);border:1px solid rgba(251,191,36,.25);border-radius:8px;padding:8px 12px;margin-bottom:12px;display:inline-block;">
              <span style="color:var(--gold,#fbbf24);font-weight:700;">${card.dataset.xp}</span>
            </div>
            <p style="font-size:13px;color:#aaa;line-height:1.6;margin-bottom:18px;"><strong style="color:#fff;">¿Cómo lograrlo?</strong><br>${card.dataset.desc}</p>
            <button style="padding:10px 24px;border-radius:20px;background:var(--cyan,#00f5ff);border:none;color:#000;font-weight:700;cursor:pointer;font-family:inherit;">¡Voy a lograrlo! 💪</button>
          </div>`;
        document.body.appendChild(panel);
        panel.addEventListener('click', e => { if(e.target===panel||e.target.tagName==='BUTTON')panel.remove(); });
      });
    });
    if (window.lucide) lucide.createIcons();
  }
};

/* ── NOTICIAS ── */
window.screens.news = {
  render() {
    const articles = [
      { cat:'TÉCNICA',     title:'5 tips para mejorar tu sentadilla',              mins:3, icon:'dumbbell',      color:'var(--cyan)' },
      { cat:'NUTRICIÓN',   title:'Qué comer antes y después de entrenar',           mins:5, icon:'apple',         color:'#22c55e' },
      { cat:'RECUPERACIÓN',title:'Por qué el descanso es clave para ganar músculo', mins:4, icon:'moon',          color:'#a855f7' },
      { cat:'MOTIVACIÓN',  title:'Cómo mantener la constancia en el gym',           mins:3, icon:'zap',           color:'var(--orange,#f97316)' },
      { cat:'CIENCIA',     title:'La creatina: el suplemento más estudiado',        mins:6, icon:'flask-conical', color:'var(--gold,#fbbf24)' },
    ];
    return `
    <div class="screen-scroll" style="position:relative;">
      <div style="padding:40px 20px 14px;">
        <div style="display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:.08em;color:var(--cyan);margin-bottom:5px;">
          <i data-lucide="newspaper" style="width:11px;height:11px;color:var(--cyan);"></i> NOTICIAS
        </div>
        <h1 style="font-size:26px;font-weight:800;">Artículos</h1>
      </div>
      <div style="padding:0 20px 100px;display:flex;flex-direction:column;gap:10px;">
        ${articles.map(a=>`
          <div style="border-radius:14px;border:1px solid rgba(255,255,255,.07);background:rgba(255,255,255,.025);padding:16px;cursor:pointer;" class="news-art">
            <div style="display:flex;align-items:center;gap:12px;">
              <div style="width:42px;height:42px;border-radius:11px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i data-lucide="${a.icon}" style="width:18px;height:18px;color:${a.color};"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <span style="font-size:9px;font-weight:700;letter-spacing:.07em;color:${a.color};">${a.cat}</span>
                <p style="font-size:13px;font-weight:600;margin:3px 0 5px;line-height:1.3;">${a.title}</p>
                <div style="display:flex;align-items:center;gap:5px;font-size:10px;color:#888;">
                  <i data-lucide="clock" style="width:11px;height:11px;"></i><span>${a.mins} min lectura</span>
                </div>
              </div>
              <i data-lucide="chevron-right" style="width:16px;height:16px;color:#555;flex-shrink:0;"></i>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  },
  init() {
    document.querySelectorAll('.news-art').forEach(a =>
      a.addEventListener('click', () => alert('Artículo completo próximamente 📰'))
    );
    if (window.lucide) lucide.createIcons();
  }
};

/*CONTENIDO LEGAL COMPARTIDO (Términos + Privacidad)*/
function _renderLegalContent() {
  return `
    <div style="font-size:12px;color:rgba(255,255,255,.82);line-height:1.75;display:flex;flex-direction:column;gap:18px;">

      <div style="background:rgba(0,245,255,.06);border:1px solid rgba(0,245,255,.2);border-radius:14px;padding:16px;">
        <p style="font-size:15px;font-weight:800;color:#fff;margin-bottom:6px;">OLYMPUS FITNESS APP</p>
        <p style="color:#888;font-size:11px;margin-bottom:8px;">Última actualización: Mayo 2025 · Aplicable en Colombia y Latinoamérica</p>
        <p style="color:rgba(255,255,255,.75);">El presente documento constituye un contrato legal y vinculante entre el usuario (en adelante, el <strong style="color:#fff;">"Usuario"</strong>) y Olympus Fitness App (en adelante, el <strong style="color:#fff;">"Titular"</strong>). La descarga, instalación y uso de la Aplicación implica la aceptación expresa, plena y sin reservas de todas y cada una de las disposiciones aquí contenidas. Si no está de acuerdo con estos términos, absténgase de utilizar la Aplicación.</p>
      </div>

      <!-- CAPÍTULO I -->
      <div style="border-radius:12px;border:1px solid rgba(239,68,68,.35);overflow:hidden;">
        <div style="padding:13px 16px;background:rgba(239,68,68,.12);">
          <p style="font-size:13px;font-weight:700;color:#ef4444;">⚠️ CAPÍTULO I: EXONERACIÓN DE RESPONSABILIDAD MÉDICA Y NUTRICIONAL</p>
          <p style="font-size:10px;color:#aaa;margin-top:2px;">Cláusula de Protección Principal</p>
        </div>
        <div style="padding:14px 16px;display:flex;flex-direction:column;gap:14px;">
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">1.1. Naturaleza Informativa y Educativa</p>
            <p>El contenido interactivo, audiovisual, textual, los planes de entrenamiento, sugerencias calóricas, macros y cualquier información relacionada con nutrición y ejercicio físico proporcionada por la Aplicación tiene carácter exclusivamente <strong style="color:#fff;">informativo, ilustrativo y educativo.</strong></p>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">1.2. Inexistencia de Criterio Médico Absoluto y Declaración de Limitación</p>
            <p>El Titular manifiesta expresamente que:</p>
            <ul style="margin:8px 0 0 16px;display:flex;flex-direction:column;gap:6px;">
              <li>El contenido ha sido recopilado mediante fuentes de información general sobre acondicionamiento físico y nutrición.</li>
              <li>El Titular <strong style="color:#ef4444;">NO garantiza</strong> que dicha información sea infalible, exacta, completa o aplicable a su caso particular, en tanto la ciencia del deporte y la nutrición no son ciencias exactas y varían según la biotipología de cada individuo.</li>
              <li>La Aplicación <strong style="color:#ef4444;">NO posee, ni pretende sustituir</strong> el criterio médico, clínico, terapéutico o nutricional personalizado.</li>
            </ul>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">1.3. Exención de Responsabilidad por Lesiones o Daños a la Salud</p>
            <p>El Usuario asume bajo su propio riesgo el uso de la Aplicación. El Titular, sus desarrolladores, directores o colaboradores <strong style="color:#ef4444;">no serán responsables</strong> en ningún caso por:</p>
            <ul style="margin:8px 0 0 16px;display:flex;flex-direction:column;gap:6px;">
              <li>Lesiones físicas, desgarros, fracturas, patologías cardiovasculares, metabólicas o cualquier daño a la salud derivado de la ejecución de los ejercicios mostrados.</li>
              <li>Reacciones adversas, desbalances nutricionales o afectaciones médicas derivadas de seguir las sugerencias de alimentación.</li>
            </ul>
            <div style="margin-top:12px;background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.25);border-radius:8px;padding:12px;">
              <p style="color:#ef4444;font-weight:700;margin-bottom:4px;">🩺 Obligación de Consulta Previa:</p>
              <p>Es responsabilidad <strong>obligatoria</strong> del Usuario consultar con un médico de cabecera, deportólogo o nutricionista certificado <strong style="color:#fff;">antes de iniciar cualquier plan</strong> de entrenamiento o régimen alimenticio sugerido por esta Aplicación.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- CAPÍTULO II -->
      <div style="border-radius:12px;border:1px solid rgba(0,245,255,.2);overflow:hidden;">
        <div style="padding:13px 16px;background:rgba(0,245,255,.06);">
          <p style="font-size:13px;font-weight:700;color:var(--cyan,#00f5ff);">CAPÍTULO II: TÉRMINOS DE USO DE LA APLICACIÓN</p>
        </div>
        <div style="padding:14px 16px;display:flex;flex-direction:column;gap:14px;">
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">2.1. Capacidad Legal</p>
            <p>El Usuario declara ser mayor de <strong style="color:#fff;">13 años</strong> y contar con capacidad legal para contratar y obligarse bajo estos términos. El uso por menores de edad requiere supervisión y autorización expresa de sus padres o tutores legales, quienes asumirán responsabilidad por los daños que el menor pueda causarse.</p>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">2.2. Uso Permitido</p>
            <p>El Usuario podrá utilizar Olympus exclusivamente para: registro y seguimiento de entrenamientos personales, exploración de rutinas y planes de ejercicio, monitoreo de progreso físico personal y fines educativos propios.</p>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">2.3. Uso Prohibido</p>
            <p>Queda expresamente prohibido: intentar acceder a cuentas de otros usuarios, utilizar la Aplicación con fines comerciales no autorizados, reproducir o distribuir el contenido sin autorización previa y escrita, o usar la Aplicación para actividades ilegales.</p>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">2.4. Propiedad Intelectual</p>
            <p>Todos los derechos de propiedad intelectual sobre el código fuente, diseño gráfico, interfaces, bases de datos y textos son propiedad exclusiva del Titular. Su reproducción, distribución o explotación comercial sin autorización previa escrita está prohibida.</p>
          </div>
        </div>
      </div>

      <!-- CAPÍTULO III -->
      <div style="border-radius:12px;border:1px solid rgba(168,85,247,.25);overflow:hidden;">
        <div style="padding:13px 16px;background:rgba(168,85,247,.08);">
          <p style="font-size:13px;font-weight:700;color:#a855f7;">CAPÍTULO III: POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES</p>
          <p style="font-size:10px;color:#888;margin-top:2px;">En cumplimiento de la Ley 1581 de 2012 de Colombia y normas concordantes de Latinoamérica</p>
        </div>
        <div style="padding:14px 16px;display:flex;flex-direction:column;gap:14px;">
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">3.1. Responsable del Tratamiento</p>
            <p>El responsable del tratamiento de sus datos personales es <strong style="color:#fff;">Olympus Fitness App</strong>, con correo electrónico de contacto: <span style="color:var(--cyan,#00f5ff);">olympus@gmail.com</span></p>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">3.2. Datos Recolectados y Finalidad</p>
            <p>La Aplicación recolectará datos personales tales como: nombre, correo electrónico, fecha de nacimiento, peso, estatura y objetivos de rendimiento físico. Estos datos serán tratados para:</p>
            <ul style="margin:8px 0 0 16px;display:flex;flex-direction:column;gap:5px;">
              <li>Personalizar la experiencia de usuario y cálculo estimativo de requerimientos físicos.</li>
              <li>Enviar notificaciones técnicas o recordatorios relacionados con la Aplicación.</li>
              <li>Realizar análisis estadísticos disociados para mejorar las funciones de la plataforma.</li>
            </ul>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">3.3. Almacenamiento Local de Datos</p>
            <p>Todos sus datos se almacenan <strong style="color:#fff;">localmente en su dispositivo</strong> mediante localStorage del navegador. No se transmite información a servidores externos ni a terceros. Los datos permanecen en su dispositivo hasta que los elimine manualmente o limpie el caché del navegador.</p>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">3.4. Derechos del Usuario — Habeas Data</p>
            <p>De conformidad con la ley, el Usuario tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de sus datos personales. Para ejercer estos derechos envíe una solicitud formal a: <span style="color:var(--cyan,#00f5ff);">olympus@gmail.com</span></p>
          </div>
          <div>
            <p style="font-weight:700;color:#fff;margin-bottom:5px;">3.5. Cookies</p>
            <p>Esta aplicación <strong style="color:#fff;">no utiliza cookies</strong>. Se emplea localStorage, que es distinto: no se transmite automáticamente al servidor y no puede rastrearse entre diferentes sitios web.</p>
          </div>
        </div>
      </div>

      <!-- CAPÍTULO IV -->
      <div style="border-radius:12px;border:1px solid rgba(251,191,36,.2);overflow:hidden;">
        <div style="padding:13px 16px;background:rgba(251,191,36,.06);">
          <p style="font-size:13px;font-weight:700;color:var(--gold,#fbbf24);">CAPÍTULO IV: LEY APLICABLE Y JURISDICCIÓN</p>
        </div>
        <div style="padding:14px 16px;">
          <p>Este contrato se regirá e interpretará de acuerdo con las leyes de la República de Colombia. Cualquier controversia derivada del uso de la Aplicación, su interpretación o incumplimiento, se someterá en primera instancia a una etapa de conciliación directa y, en su defecto, a los tribunales competentes del país del Usuario.</p>
        </div>
      </div>

      <!-- ACEPTACIÓN EXPRESA -->
      <div style="background:rgba(34,197,94,.06);border:1px solid rgba(34,197,94,.25);border-radius:12px;padding:16px;">
        <p style="font-size:13px;font-weight:700;color:#22c55e;margin-bottom:8px;">✅ ACEPTACIÓN EXPRESA DEL USUARIO</p>
        <p>Al presionar el botón <strong style="color:#fff;">"Continuar y Aceptar"</strong> o al continuar con el uso y navegación de esta Aplicación, el Usuario manifiesta que ha leído, entendido y aceptado en su totalidad las cláusulas aquí descritas, especialmente aquellas referidas a la <strong style="color:#fff;">exoneración de responsabilidad civil y médica</strong> del Titular.</p>
      </div>

      <div style="height:4px;"></div>
    </div>`;
}

/*PANTALLA TÉRMINOS*/
window.screens['terms'] = {
  render() {
    return `
    <div style="display:flex;flex-direction:column;min-height:100%;background:var(--background,#080808);">
      <!-- Header fijo -->
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;
        border-bottom:1px solid rgba(255,255,255,.07);background:var(--background,#080808);
        position:sticky;top:0;z-index:10;">
        <button type="button" id="terms-back"
          style="width:38px;height:38px;border-radius:50%;background:rgba(0,245,255,.1);
            border:1px solid rgba(0,245,255,.3);display:flex;align-items:center;
            justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;color:var(--cyan,#00f5ff);"></i>
        </button>
        <div>
          <h2 style="font-size:17px;font-weight:700;">Términos y Condiciones</h2>
          <p style="font-size:11px;color:#888;">Lee todo antes de aceptar</p>
        </div>
      </div>

      <!-- Contenido legal scrolleable -->
      <div style="flex:1;overflow-y:auto;padding:20px;">
        ${_renderLegalContent()}
      </div>

      <!-- Botón continuar (siempre visible abajo) -->
      <div style="padding:16px 20px 32px;background:var(--background,#080808);
        border-top:1px solid rgba(255,255,255,.08);">
        <button type="button" id="terms-accept"
          style="width:100%;padding:16px;border-radius:14px;background:var(--cyan,#00f5ff);
            border:none;color:#000;font-size:15px;font-weight:800;cursor:pointer;
            display:flex;align-items:center;justify-content:center;gap:10px;font-family:inherit;
            box-shadow:0 0 24px rgba(0,245,255,.35);">
          <i data-lucide="check-circle" style="width:20px;height:20px;color:#000;"></i>
          Continuar y Aceptar
        </button>
        <p style="font-size:10px;color:#555;text-align:center;margin-top:10px;">
          Al continuar confirmas que has leído y aceptas todos los términos
        </p>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('terms-back')?.addEventListener('click', () => {
      navigateTo('register');
    });
    document.getElementById('terms-accept')?.addEventListener('click', () => {
      /* Marca el checkbox de términos como aceptado al volver */
      window._regFormTemp = { ...(window._regFormTemp || {}), terms: true };
      navigateTo('register');
    });
    if (window.lucide) lucide.createIcons();
  }
};

/*PANTALLA POLÍTICA DE PRIVACIDAD*/
window.screens['privacy-policy'] = {
  render() {
    return `
    <div style="display:flex;flex-direction:column;min-height:100%;background:var(--background,#080808);">
      <div style="padding:52px 20px 14px;display:flex;align-items:center;gap:12px;
        border-bottom:1px solid rgba(255,255,255,.07);background:var(--background,#080808);
        position:sticky;top:0;z-index:10;">
        <button type="button" id="pp-back"
          style="width:38px;height:38px;border-radius:50%;background:rgba(0,245,255,.1);
            border:1px solid rgba(0,245,255,.3);display:flex;align-items:center;
            justify-content:center;cursor:pointer;flex-shrink:0;">
          <i data-lucide="arrow-left" style="width:18px;height:18px;color:var(--cyan,#00f5ff);"></i>
        </button>
        <div>
          <h2 style="font-size:17px;font-weight:700;">Política de Privacidad</h2>
          <p style="font-size:11px;color:#888;">Lee todo antes de aceptar</p>
        </div>
      </div>

      <div style="flex:1;overflow-y:auto;padding:20px;">
        ${_renderLegalContent()}
      </div>

      <div style="padding:16px 20px 32px;background:var(--background,#080808);
        border-top:1px solid rgba(255,255,255,.08);">
        <button type="button" id="pp-accept"
          style="width:100%;padding:16px;border-radius:14px;background:var(--cyan,#00f5ff);
            border:none;color:#000;font-size:15px;font-weight:800;cursor:pointer;
            display:flex;align-items:center;justify-content:center;gap:10px;font-family:inherit;
            box-shadow:0 0 24px rgba(0,245,255,.35);">
          <i data-lucide="check-circle" style="width:20px;height:20px;color:#000;"></i>
          Continuar y Aceptar
        </button>
        <p style="font-size:10px;color:#555;text-align:center;margin-top:10px;">
          Al continuar confirmas que has leído y aceptas la política de privacidad
        </p>
      </div>
    </div>`;
  },
  init() {
    document.getElementById('pp-back')?.addEventListener('click', () => {
      navigateTo('register');
    });
    document.getElementById('pp-accept')?.addEventListener('click', () => {
      window._regFormTemp = { ...(window._regFormTemp || {}), terms: true };
      navigateTo('register');
    });
    if (window.lucide) lucide.createIcons();
  }
};