/**
 * InstaViral AI - Autonomous Nightly Multi-Agent Pipeline & AI Editing Engine
 */

export const INITIAL_TRENDS = [
  {
    id: 'tr-1',
    topic: 'Agentes Autónomos de IA vs Trabajo Humano en 2026',
    category: 'Tecnología & IA',
    growth: '+380% hoy',
    audioTrack: 'Chasing Shadows (Viral Sound #1)',
    format: 'Controversy + Solution Hook',
    avgViews: '1.2M'
  },
  {
    id: 'tr-2',
    topic: '3 Herramientas secretas que reemplazan 10 horas de oficina',
    category: 'Productividad & Negocios',
    growth: '+240% hoy',
    audioTrack: 'Midnight Lo-Fi Chill Hop (Trending)',
    format: 'Listicle de ritmo ultra-rápido',
    avgViews: '850K'
  },
  {
    id: 'tr-3',
    topic: 'El truco psicológico del 1% para triplicar ingresos',
    category: 'Mentalidad & Finanzas',
    growth: '+195% hoy',
    audioTrack: 'Deep Focus Ambient Pulse',
    format: 'Storytelling personal + Inversión de Creencia',
    avgViews: '940K'
  },
  {
    id: 'tr-4',
    topic: 'Lo que nadie te dijo sobre la actualización del algoritmo de Instagram',
    category: 'Marketing Digital',
    growth: '+310% hoy',
    audioTrack: 'Dramatic Synthwave Rise',
    format: 'Alerta Roja / Revelación',
    avgViews: '1.5M'
  }
];

export const INITIAL_VIDEOS = [
  {
    id: 'vid-1',
    title: 'El Secreto de IA que el 99% Ignora',
    hookBadge: '🔥 96% VIRAL SCORE',
    hook: 'Deja de usar ChatGPT como un novato. Si haces esto, tus respuestas serán 10 veces mejores.',
    script: 'Deja de usar ChatGPT como un novato. El verdadero secreto que usan los expertos es la inversión de roles. En vez de darle órdenes, dile: Hazme tú a mí las cinco preguntas clave que necesitas para darme el mejor resultado posible. Pruébalo hoy mismo y guarda este reel para no olvidarlo.',
    scheduledTime: '13:45',
    scheduledReason: 'Pico de almuerzo en tu nicho (Tech & Negocios). Máxima retención en descansos móviles.',
    status: 'scheduled', // 'scheduled' | 'approved' | 'published' | 'dismissed'
    theme: 'cyberpunk',
    subtitleStyle: 'hormozi',
    duration: 16,
    soundTrack: 'Cyberpunk Lo-Fi Chill #4',
    voiceName: 'Voz Dinámica Pro (Español)',
    predictedVirality: 96,
    predictedViews: '120K - 340K',
    tags: ['#InteligenciaArtificial', '#ChatGPTTips', '#Productividad', '#TechHacks', '#Emprendedores'],
    aiPromptHistory: ['Generado automáticamente en el escaneo nocturno']
  },
  {
    id: 'vid-2',
    title: '3 Herramientas que Ahorran 15 Horas Semanales',
    hookBadge: '⚡ TOP HERRAMIENTAS',
    hook: 'Estas tres herramientas deberían ser ilegales de lo potentes que son para tu trabajo.',
    script: 'Estas tres herramientas te van a ahorrar 15 horas de trabajo. Primera: Gamma App, crea presentaciones completas con diseño profesional en 30 segundos. Segunda: ElevenLabs, para clonar tu voz con realismo brutal. Y tercera: Perplexity Pro, para investigar sin perderte en Google. Comenta APPS y te envío los enlaces.',
    scheduledTime: '18:30',
    scheduledReason: 'Final de jornada laboral. Audiencia buscando optimizar su tiempo para el día siguiente.',
    status: 'scheduled',
    theme: 'luxury-gold',
    subtitleStyle: 'neon-green',
    duration: 16,
    soundTrack: 'Deep Focus Ambient Pulse',
    voiceName: 'Voz Convincente (Español)',
    predictedVirality: 92,
    predictedViews: '85K - 210K',
    tags: ['#HerramientasIA', '#ProductividadExtrema', '#TrabajoRemoto', '#AppsQueNoConocias', '#NegociosDigitales'],
    aiPromptHistory: ['Generado automáticamente en el escaneo nocturno']
  },
  {
    id: 'vid-3',
    title: 'La Advertencia de 2026 que Nadie Quiere Ver',
    hookBadge: '⚠️ ALERTA URGENTE',
    hook: 'Si tu trabajo depende de una pantalla, necesitas escuchar esto antes de que sea tarde.',
    script: 'Si tu trabajo depende de una pantalla, escucha con atención. La automatización ya no es el futuro lejano, está pasando ahora mismo. Quienes aprendan a liderar agentes de IA multiplicarán sus oportunidades; quienes sigan haciendo tareas mecánicas quedarán atrás. ¿De qué lado vas a estar? Sígueme para dominar la IA.',
    scheduledTime: '21:15',
    scheduledReason: 'Pico nocturno (Bedtime scroll). Máxima receptividad para reflexiones profundas y llamadas a seguir.',
    status: 'scheduled',
    theme: 'synthwave',
    subtitleStyle: 'bold-white',
    duration: 16,
    soundTrack: 'Dramatic Synthwave Rise',
    voiceName: 'Voz Reflexiva (Español)',
    predictedVirality: 94,
    predictedViews: '110K - 290K',
    tags: ['#FuturoDelTrabajo', '#Automatizacion', '#AgentesIA', '#DesarrolloProfesional', '#Tecnologia'],
    aiPromptHistory: ['Generado automáticamente en el escaneo nocturno']
  }
];

export class AgentPipelineService {
  constructor() {
    this.logs = [];
  }

  // Simulate Nightly AI Agent Pipeline execution
  async runNightlyPipeline(onProgress) {
    const steps = [
      {
        agent: 'Agente 1: Radar de Tendencias',
        role: 'Scout de Redes Sociales',
        action: 'Escaneando las últimas 24 horas de Instagram Reels, TikTok y YouTube Shorts...',
        detail: 'Analizados 2,418 vídeos en tu nicho. Detectados 4 patrones de audio viral con retención > 72% y 3 fórmulas de hook con rotura de patrón visual.',
        delay: 1100
      },
      {
        agent: 'Agente 2: Estratega de Viralidad',
        role: 'Predictor de Algoritmo & Horarios',
        action: 'Calculando ventanas de audiencia de máxima concurrencia para mañana...',
        detail: 'Identificados 3 picos estratégicos: 13:45 (Almuerzo tech), 18:30 (Salida oficina), 21:15 (Scroll nocturno). Probabilidad de viralidad estimada: 92% - 96%.',
        delay: 1200
      },
      {
        agent: 'Agente 3: Productor Audiovisual & Guionista',
        role: 'Generador de Contenido 9:16',
        action: 'Redactando guiones de alta retención, kinetic typography y pistas sonoras...',
        detail: 'Generados 3 reels verticales completos con hooks magnéticos, subtítulos dinámicos estilo Hormozi y sincronización de voz y música Lo-Fi.',
        delay: 1400
      },
      {
        agent: 'Agente 4: Inspector de Calidad & Safe-Zone',
        role: 'Cumplimiento de Instagram & UI Safe Area',
        action: 'Verificando zonas seguras de pantalla 9:16, derechos de autor y políticas...',
        detail: 'Verificación 100% aprobada: ningún texto solapa botones de like o descripción. Vídeos listos en la cola para el horario programado.',
        delay: 1000
      }
    ];

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (onProgress) {
        onProgress({
          currentStep: i + 1,
          totalSteps: steps.length,
          stepData: step,
          status: 'running'
        });
      }
      await new Promise(r => setTimeout(r, step.delay));
    }

    if (onProgress) {
      onProgress({
        currentStep: steps.length,
        totalSteps: steps.length,
        status: 'completed',
        summary: 'Ciclo nocturno completado con éxito. 3 vídeos generados y preparados para mañana.'
      });
    }

    return INITIAL_VIDEOS;
  }

  // AI Modifier: Allows user to prompt modifications in natural language
  modifyReelWithAI(reel, promptText) {
    const p = promptText.toLowerCase();
    const updated = { ...reel, aiPromptHistory: [...(reel.aiPromptHistory || []), promptText] };

    // 1. Modify Tone / Hook
    if (p.includes('dramátic') || p.includes('impactante') || p.includes('agresiv') || p.includes('fuerte')) {
      updated.hookBadge = '🚨 ATENCIÓN INMEDIATA';
      updated.hook = '¡ALTO! No sigas cometiendo este error grave que está destruyendo tus resultados.';
      updated.script = '¡ALTO! No sigas cometiendo este error grave. La mayoría de personas siguen haciendo las cosas como hace diez años y se preguntan por qué no avanzan. La clave está en delegar las tareas repetitivas a la inteligencia artificial hoy mismo. Guarda este vídeo y empieza ya.';
    } else if (p.includes('divertid') || p.includes('humor') || p.includes('gracios') || p.includes('casual')) {
      updated.hookBadge = '😂 CONFESIÓN REAL';
      updated.hook = 'Pensaba que era mentira hasta que lo probé a las 3 de la mañana...';
      updated.script = 'Pensaba que era mentira hasta que lo probé anoche a las tres de la mañana. Me quedé con la boca abierta. Esta herramienta hace en dos minutos lo que a mí me costaba un dolor de cabeza de cuatro horas. Pruébalo y cuéntame si a ti también te salva la vida.';
    } else if (p.includes('profesional') || p.includes('autoridad') || p.includes('formal') || p.includes('serio')) {
      updated.hookBadge = '📊 ANÁLISIS ESTRATÉGICO';
      updated.hook = 'El informe definitivo que revela el cambio en el mercado este trimestre.';
      updated.script = 'El informe definitivo revela un cambio radical en los patrones de consumo. Las marcas que han implementado automatización autónoma reportan un incremento del 35% en retención. Si deseas la plantilla de implementación, déjame un comentario.';
    }

    // 2. Modify Visual Theme
    if (p.includes('oro') || p.includes('dorado') || p.includes('luxury') || p.includes('lujo')) {
      updated.theme = 'luxury-gold';
    } else if (p.includes('cyber') || p.includes('futurista') || p.includes('tech') || p.includes('azul')) {
      updated.theme = 'cyberpunk';
    } else if (p.includes('synth') || p.includes('sunset') || p.includes('rosa') || p.includes('retro') || p.includes('morado')) {
      updated.theme = 'synthwave';
    } else if (p.includes('matrix') || p.includes('verde') || p.includes('hacker') || p.includes('codigo')) {
      updated.theme = 'emerald-matrix';
    } else if (p.includes('minimal') || p.includes('limpio') || p.includes('blanco') || p.includes('simple')) {
      updated.theme = 'minimal-bold';
    }

    // 3. Modify Subtitle Style
    if (p.includes('hormozi') || p.includes('amarillo') || p.includes('tiktok')) {
      updated.subtitleStyle = 'hormozi';
    } else if (p.includes('verde') || p.includes('neon')) {
      updated.subtitleStyle = 'neon-green';
    } else if (p.includes('blanco') || p.includes('moderno')) {
      updated.subtitleStyle = 'bold-white';
    }

    // 4. Modify Scheduled Time
    const timeMatch = promptText.match(/(\d{1,2})[:.](\d{2})/);
    if (timeMatch) {
      const hour = timeMatch[1].padStart(2, '0');
      const min = timeMatch[2];
      updated.scheduledTime = `${hour}:${min}`;
      updated.scheduledReason = `Hora reprogramada por el usuario a las ${hour}:${min} con recalibración de retención.`;
    }

    // 5. Shorten / Lengthen
    if (p.includes('corto') || p.includes('15s') || p.includes('rapido') || p.includes('aceler')) {
      updated.duration = 14;
    } else if (p.includes('largo') || p.includes('30s') || p.includes('extender') || p.includes('detallado')) {
      updated.duration = 22;
    }

    // 6. Call to action / hashtag tweaks
    if (p.includes('coment') || p.includes('cta') || p.includes('llamada')) {
      updated.script += ' Comenta la palabra SECRETO y te paso el acceso VIP ahora mismo.';
    }

    // Recalculate Virality Score
    updated.predictedVirality = Math.min(99, updated.predictedVirality + 1);

    return updated;
  }

  // Generate an alternate fresh reel if user rejects a previous one
  generateAlternativeReel(index) {
    const alternates = [
      {
        title: 'El Error Oculto que Te Cuesta Miles de Seguidores',
        hookBadge: '🚫 ERROR CRÍTICO',
        hook: 'Si tus Reels no pasan de 1.000 vistas, estás cometiendo este fallo en los primeros 2 segundos.',
        script: 'Si tus Reels no pasan de mil reproducciones, estás cometiendo este error en los primeros dos segundos. Empezar con Hola a todos mata tu retención. Empieza directo con el resultado o con la objeción más polémica. Pruébalo en tu próximo vídeo y mira la diferencia.',
        theme: 'cyberpunk',
        subtitleStyle: 'hormozi',
        scheduledTime: '15:20',
        scheduledReason: 'Ventana de rescate vespertina de alto tráfico orgánico.',
        tags: ['#InstagramGrowth', '#ReelsVirales', '#CreadoresDeContenido', '#AlgoritmoInstagram']
      },
      {
        title: 'La Web que las Agencias No Quieren que Conozcas',
        hookBadge: '🤫 SECRETO DE AGENCIA',
        hook: 'Esta web te da gratis lo que agencias de marketing cobran miles de euros por hacer.',
        script: 'Esta web te da gratis lo que agencias cobran miles por hacer. Entra, sube tu producto y la IA te genera el plan de contenidos, los copys y los anuncios listos para publicar. Comenta WEB y te paso el link directo.',
        theme: 'luxury-gold',
        subtitleStyle: 'neon-green',
        scheduledTime: '20:45',
        scheduledReason: 'Pico de alta conversión comercial nocturna.',
        tags: ['#MarketingDigital', '#Emprendimiento', '#RecursosGratis', '#HerramientasWeb']
      }
    ];

    const chosen = alternates[index % alternates.length];
    return {
      id: 'vid-alt-' + Date.now(),
      ...chosen,
      status: 'scheduled',
      duration: 16,
      soundTrack: 'Trending Viral Beats #9',
      voiceName: 'Voz Dinámica Pro (Español)',
      predictedVirality: 95,
      predictedViews: '95K - 280K',
      aiPromptHistory: ['Generado como reemplazo tras descarte del usuario']
    };
  }
}
