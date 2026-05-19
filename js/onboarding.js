/*ONBOARDING.JS — Personalización*/

function buildOnboardingSteps(selections) {
  const gender = selections.gender && selections.gender[0];

  const core = [
    {
      id: 'gender',
      title: '¿Cómo te identificas?',
      subtitle: 'Personalizamos tu perfil',
      layout: 'column', multi: false,
      options: [
        { id:'male',   label:'Hombre', description:'Plan masculino optimizado',       icon:'user' },
        { id:'female', label:'Mujer',  description:'Plan femenino + ciclo menstrual', icon:'users', pink:true },
      ],
    },
    {
      id: 'goal',
      title: '¿Cuál es tu objetivo?',
      subtitle: 'Puedes elegir uno o varios',
      layout: 'grid', multi: true,
      options: [
        { id:'lose',      label:'Perder peso',       description:'Quema grasa con déficit controlado',  icon:'flame' },
        { id:'muscle',    label:'Ganar músculo',      description:'Hipertrofia y fuerza progresiva',    icon:'dumbbell' },
        { id:'endurance', label:'Resistencia',        description:'Más capacidad cardiovascular',       icon:'activity' },
        { id:'fit',       label:'Mantenerme fit',     description:'Salud y constancia sin extremos',    icon:'target' },
        { id:'sport',     label:'Deporte específico', description:'Rendimiento para tu disciplina',     icon:'trophy' },
      ],
    },
    {
      id: 'level',
      title: '¿Cuál es tu nivel?',
      subtitle: 'Sinceridad ante todo',
      layout: 'column', multi: false,
      options: [
        { id:'beginner',     label:'Principiante', description:'Menos de 6 meses entrenando',     icon:'sparkles' },
        { id:'intermediate', label:'Intermedio',   description:'6 meses a 2 años de experiencia', icon:'star' },
        { id:'advanced',     label:'Avanzado',     description:'Más de 2 años con técnica sólida', icon:'zap' },
      ],
    },
    {
      id: 'frequency',
      title: '¿Cuántas veces entrenas a la semana?',
      subtitle: 'Así calculamos tu racha correctamente',
      layout: 'grid', multi: false,
      options: [
        { id:'1', label:'1 vez',   description:'Inicio suave',       icon:'calendar' },
        { id:'2', label:'2 veces', description:'Constante',          icon:'calendar' },
        { id:'3', label:'3 veces', description:'Lo más recomendado', icon:'calendar' },
        { id:'4', label:'4 veces', description:'Avanzado',           icon:'calendar' },
        { id:'5', label:'5 veces', description:'Alta intensidad',    icon:'calendar' },
        { id:'6', label:'6 veces', description:'Muy avanzado',       icon:'calendar' },
        { id:'7', label:'7 veces', description:'Todos los días',     icon:'calendar' },
      ],
    },
    {
      id: 'location',
      title: '¿Dónde entrenas?',
      subtitle: 'Adaptamos equipamiento y ejercicios',
      layout: 'column', multi: false,
      options: [
        { id:'home-none', label:'Casa sin equipo',  description:'Peso corporal y bandas',      icon:'home' },
        { id:'home-gear', label:'Casa con equipo',  description:'Mancuernas, banco o bandas',  icon:'package' },
        { id:'gym',       label:'Gimnasio completo',description:'Máquinas, barras y peso libre',icon:'building-2' },
      ],
    },
    {
      id: 'areas',
      title: '¿Qué áreas quieres trabajar?',
      subtitle: 'Elige una o varias',
      layout: 'grid', multi: true,
      options: [
        { id:'full',  label:'Cuerpo completo', description:'Equilibrio general',        icon:'layers' },
        { id:'upper', label:'Tren superior',   description:'Empuje, tracción y brazos', icon:'dumbbell' },
        { id:'lower', label:'Tren inferior',   description:'Piernas y cadena posterior',icon:'footprints' },
        { id:'core',  label:'Core & abdomen',  description:'Estabilidad y torso',       icon:'circle' },
        { id:'cardio',label:'Cardio',          description:'Condición y quema extra',   icon:'activity' },
      ],
    },
  ];

  if (gender === 'female') {
    core.push({
      id: 'cyclePref',
      title: 'Ciclo Menstrual',
      subtitle: 'Ajustamos la intensidad según tu fase',
      layout: 'column', multi: false, customTop: true,
      options: [
        { id:'track', label:'Sí quiero seguimiento', description:'Recomendaciones por fase', icon:'heart' },
        { id:'skip',  label:'Prefiero omitirlo',      description:'Plan estándar',            icon:'minus-circle' },
      ],
    });
  }
  return core;
}

window.screens.onboarding = {
  currentStep: 0,
  render() {
    return `<div id="onboarding-screen" class="screen-container" style="overflow:hidden;min-height:100vh;display:flex;flex-direction:column;">
      ${backgroundHTML()}
      <div style="position:relative;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:48px 24px 8px;">
        <button type="button" id="ob-back" class="link-back" style="margin-bottom:0;">← Volver</button>
        <div class="flex items-center gap-1">
          <span style="font-size:12px;color:var(--gray-500,#666);">Paso</span>
          <span id="ob-step-num" style="font-size:14px;font-weight:600;color:var(--cyan);">1</span>
          <span id="ob-step-total" style="font-size:12px;color:var(--gray-500,#666);">/ 6</span>
        </div>
      </div>
      <div style="position:relative;z-index:10;padding:8px 24px 16px;">
        <div class="progress-bar" style="height:4px;background:rgba(255,255,255,.1);">
          <div id="ob-progress" style="width:16%;height:100%;background:var(--cyan);transition:width .3s;"></div>
        </div>
      </div>
      <div id="ob-content" style="position:relative;z-index:10;flex:1;padding:0 24px;overflow-y:auto;"></div>
      <div class="ob-footer-bar" style="padding:20px;z-index:10;">
        <button type="button" id="ob-next" class="btn btn-primary" disabled style="width:100%;height:52px;">
          Continuar <i data-lucide="chevron-right"></i>
        </button>
      </div>
    </div>`;
  },
  init() {
    const self = this; self.currentStep = 0;
    const selections = {};

    const renderStep = () => {
      const steps = buildOnboardingSteps(selections);
      const step  = steps[self.currentStep];
      const selected = selections[step.id] || [];

      document.getElementById('ob-step-num').textContent   = String(self.currentStep + 1);
      document.getElementById('ob-step-total').textContent = `/ ${steps.length}`;
      document.getElementById('ob-progress').style.width   = `${((self.currentStep+1)/steps.length)*100}%`;

      let optHTML = step.options.map(opt => `
        <button class="option-card ${selected.includes(opt.id)?(opt.pink?'selected selected-pink':'selected'):''}"
          data-option="${opt.id}" style="margin-bottom:0;">
          <div class="option-card-content">
            <div class="option-icon"><i data-lucide="${opt.icon}"></i></div>
            <div class="flex-1 min-w-0">
              <div class="option-label">${opt.label}</div>
              <p class="option-description">${opt.description||''}</p>
            </div>
            <div class="option-check"><i data-lucide="check" style="width:12px;height:12px;color:#000;"></i></div>
          </div>
        </button>`).join('');

      let wrapClass = step.layout==='grid' ? 'onboarding-grid' : 'flex flex-col gap-3';
      let customInput = '';
      if (step.id === 'cyclePref' && selected.includes('track')) {
        customInput = `<div class="card" style="margin-top:16px;padding:14px;border-color:rgba(236,72,153,.2);">
          <label style="font-size:12px;color:var(--pink,#ec4899);display:block;margin-bottom:8px;">Fecha de tu último ciclo:</label>
          <input type="date" id="ob-cycle-date" class="input-field auth-field" style="height:42px;">
        </div>`;
      }

      document.getElementById('ob-content').innerHTML = `
        <div class="fade-in">
          <h2 class="dash-greeting">${step.title}</h2>
          <p style="color:var(--gray-400,#888);margin-bottom:20px;font-size:14px;">${step.subtitle}</p>
          <div class="${wrapClass}">${optHTML}</div>
          ${customInput}
        </div>`;

      document.getElementById('ob-next').disabled = selected.length === 0;
      if (window.lucide) lucide.createIcons();

      document.querySelectorAll('.option-card').forEach(card => {
        card.addEventListener('click', () => {
          const id = card.dataset.option;
          if (step.multi) {
            if (!selections[step.id]) selections[step.id] = [];
            selections[step.id] = selections[step.id].includes(id)
              ? selections[step.id].filter(x=>x!==id)
              : [...selections[step.id], id];
          } else {
            selections[step.id] = [id];
          }
          renderStep();
        });
      });
    };

    document.getElementById('ob-back').addEventListener('click', () => {
      if (self.currentStep > 0) { self.currentStep--; renderStep(); }
      else navigateTo('email-verified');
    });

    document.getElementById('ob-next').addEventListener('click', () => {
      const steps = buildOnboardingSteps(selections);
      if (self.currentStep < steps.length - 1) {
        self.currentStep++; renderStep();
      } else {
        /* Guardar todo en AppState */
        Object.assign(window.AppState.user, {
          gender:    selections.gender?.[0]   || 'male',
          goal:      selections.goal?.[0]     || '',
          levelName: selections.level?.[0]    || '',
          daysPerWeek: selections.frequency?.[0] || '3',  // ← nueva
          location:  selections.location?.[0] || '',
          areas:     selections.areas         || [],
          cycleOptIn: selections.cyclePref?.[0] === 'track',
          lastCycleDate: document.getElementById('ob-cycle-date')?.value || null,
        });
        localStorage.setItem('olympus_session', JSON.stringify(window.AppState.user));
        localStorage.removeItem(`olympus_plan_${window.AppState.user.email}`); // reset plan
        navigateTo('dashboard');
      }
    });

    renderStep();
  }
};

window.screens.onboarding = {
  currentStep: 0,
  render() {
    return `<div id="onboarding-screen" class="screen-container" style="overflow:hidden; min-height:100vh; display:flex; flex-direction:column;">
      ${backgroundHTML()}
      <div style="position:relative; z-index:10; display:flex; align-items:center; justify-content:space-between; padding:48px 24px 8px;">
        <button type="button" id="ob-back" class="link-back" style="margin-bottom:0;">← Volver</button>
        <div class="flex items-center gap-1">
          <span style="font-size:12px; color:var(--gray-500);">Paso</span>
          <span id="ob-step-num" style="font-size:14px; font-weight:600; color:var(--cyan);">1</span>
          <span id="ob-step-total" style="font-size:12px; color:var(--gray-500);">/ 6</span>
        </div>
      </div>
      <div style="position:relative; z-index:10; padding:8px 24px 16px;">
        <div class="progress-bar" style="height:4px; background:rgba(255,255,255,0.1);"><div id="ob-progress" style="width:16%; height:100%; background:var(--cyan); transition:width 0.3s ease;"></div></div>
      </div>
      <div id="ob-content" style="position:relative; z-index:10; flex:1; padding:0 24px; overflow-y:auto;"></div>
      <div class="ob-footer-bar" style="padding:20px; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); border-top:1px solid rgba(255,255,255,0.1);">
        <button type="button" id="ob-next" class="btn btn-primary" disabled style="width:100%; height:52px;">Continuar <i data-lucide="chevron-right"></i></button>
      </div>
    </div>`;
  },
  init() {
    const self = this; self.currentStep = 0;
    const selections = {};

    const renderStep = () => {
      const steps = buildOnboardingSteps(selections);
      const step = steps[self.currentStep];
      const selected = selections[step.id] || [];

      document.getElementById('ob-step-num').textContent = String(self.currentStep + 1);
      document.getElementById('ob-step-total').textContent = `/ ${steps.length}`;
      document.getElementById('ob-progress').style.width = `${((self.currentStep + 1) / steps.length) * 100}%`;
      
      let optionsHTML = step.options.map(opt => `
        <button class="option-card ${selected.includes(opt.id) ? (opt.pink ? 'selected selected-pink' : 'selected') : ''}" data-option="${opt.id}">
          <div class="option-card-content">
            <div class="option-icon"><i data-lucide="${opt.icon}"></i></div>
            <div class="flex-1 min-w-0">
              <div class="option-label">${opt.label}</div>
              <p class="option-description">${opt.description || ''}</p>
            </div>
            <div class="option-check"><i data-lucide="check" style="width:12px;height:12px;color:black;"></i></div>
          </div>
        </button>`).join('');

      let wrapClass = step.layout === 'grid' ? 'onboarding-grid' : 'flex flex-col gap-3';
      let customInput = '';
      
      // CAPTURA DE FECHA SI ES MUJER Y QUIERE SEGUIMIENTO
      if (step.id === 'cyclePref') {
        customInput = `<div class="card" style="margin-top:20px; padding:15px; background:rgba(236,72,153,0.05); border-color:rgba(236,72,153,0.2);">
          <label style="font-size:12px; color:var(--pink); display:block; margin-bottom:8px;">Fecha de tu último ciclo:</label>
          <input type="date" id="ob-cycle-date" class="input-field auth-field" style="width:100%; height:40px; padding:0 10px;">
        </div>`;
      }

      document.getElementById('ob-content').innerHTML = `
        <div class="fade-in">
          <h2 class="dash-greeting">${step.title}</h2>
          <p style="color:var(--gray-400); margin-bottom:20px; font-size:14px;">${step.subtitle}</p>
          <div class="${wrapClass}">${optionsHTML}</div>
          ${customInput}
        </div>`;
      
      document.getElementById('ob-next').disabled = selected.length === 0;
      if (window.lucide) lucide.createIcons();

      document.querySelectorAll('.option-card').forEach(card => {
        card.onclick = () => {
          const id = card.dataset.option;
          if (step.multi) {
            if (!selections[step.id]) selections[step.id] = [];
            selections[step.id] = selections[step.id].includes(id) ? selections[step.id].filter(x => x !== id) : [...selections[step.id], id];
          } else { selections[step.id] = [id]; }
          renderStep();
        };
      });
    };

    document.getElementById('ob-back').onclick = () => { if (self.currentStep > 0) { self.currentStep--; renderStep(); } };
    document.getElementById('ob-next').onclick = () => {
      const steps = buildOnboardingSteps(selections);
      if (self.currentStep < steps.length - 1) { self.currentStep++; renderStep(); } 
      else { 
        window.AppState.user.gender = selections.gender?.[0];
        window.AppState.user.goal = selections.goal?.[0];
        window.AppState.user.levelName = selections.level?.[0];
        window.AppState.user.location = selections.location?.[0];
        window.AppState.user.cycleOptIn = selections.cyclePref?.[0] === 'track';
        
        // Guardar la fecha seleccionada
        const dateVal = document.getElementById('ob-cycle-date')?.value;
        window.AppState.user.lastCycleDate = dateVal || null;

        localStorage.setItem('onboarding_complete', 'true');
        localStorage.setItem('olympus_user_profile', JSON.stringify(window.AppState.user));
        navigateTo('dashboard'); 
      }
    };
    renderStep();
  }
};