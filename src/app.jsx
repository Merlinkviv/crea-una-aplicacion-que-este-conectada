import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Moon,
  Bell,
  BellRing,
  Film,
  Cpu,
  MessageSquare,
  MessageCircle,
  Clock,
  Flame,
  Play,
  Pause,
  Music,
  Music2,
  Wand2,
  Trash2,
  Send,
  CheckCircle,
  CheckCircle2,
  Radio,
  ArrowUpRight,
  Radar,
  TrendingUp,
  Clapperboard,
  ShieldCheck,
  PlusCircle,
  VideoOff,
  X,
  Wifi,
  Battery,
  Heart,
  BadgeCheck,
  Sliders,
  Check,
  Mic,
  Smile,
  Loader2,
  PlayCircle,
  Smartphone,
  Settings,
  RefreshCw,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Edit3
} from 'lucide-react';

import { VideoRenderer } from './video-engine.js';
import { INITIAL_VIDEOS, INITIAL_TRENDS, AgentPipelineService } from './agent-engine.js';
import { soundFx } from './sound-effects.js';

const agentService = new AgentPipelineService();

function InstagramIcon({ className = "w-4 h-4", ...props }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function App() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState('videos'); // 'videos' | 'pipeline' | 'notifications' | 'account'

  // Instagram Account State
  const [account, setAccount] = useState(() => {
    const saved = localStorage.getItem('instaviral_account');
    return saved ? JSON.parse(saved) : {
      handle: '@creadores.ia',
      name: 'Creadores IA & Tech',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      followers: '48.5K',
      engagementRate: '6.2%',
      niche: 'Inteligencia Artificial & Productividad',
      targetAudience: 'Emprendedores, programadores y creadores de habla hispana',
      isConnected: true,
      graphApiToken: 'EAAGm0PX4ZB1... (Token de larga duración activo)',
      businessAccountId: '178414053092144',
      autoPublishWithoutApproval: false
    };
  });

  // Notification Preferences State
  const [notificationConfig, setNotificationConfig] = useState(() => {
    const saved = localStorage.getItem('instaviral_notifications');
    return saved ? JSON.parse(saved) : {
      time: '08:30',
      enabled: true,
      channel: 'whatsapp', // 'whatsapp' | 'telegram' | 'push'
      phoneNumber: '+34 612 34 56 78',
      telegramHandle: '@usuario_demo',
      includePreviews: true
    };
  });

  // Daily Videos Queue State
  const [videos, setVideos] = useState(() => {
    const saved = localStorage.getItem('instaviral_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  // Trends State
  const [trends, setTrends] = useState(INITIAL_TRENDS);

  // Active Video Modal for 9:16 vertical player
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState({ current: 0, total: 16 });
  const [likedVideos, setLikedVideos] = useState({});
  const [isMuted, setIsMuted] = useState(false);

  // AI Prompt Modification inside Player or Modal
  const [aiPromptInput, setAiPromptInput] = useState('');
  const [aiModifying, setAiModifying] = useState(false);
  const [aiModificationSuccess, setAiModificationSuccess] = useState('');

  // Nightly Pipeline Simulation State
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(null);
  const [pipelineLogs, setPipelineLogs] = useState([]);
  const [showPipelineModal, setShowPipelineModal] = useState(false);

  // WhatsApp Simulation Modal State
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  // Manual Edit Modal State
  const [editingVideo, setEditingVideo] = useState(null);

  // Sound FX toggle
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Canvas Video Player Ref
  const canvasRef = useRef(null);
  const videoRendererRef = useRef(null);

  // Save to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem('instaviral_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('instaviral_account', JSON.stringify(account));
  }, [account]);

  useEffect(() => {
    localStorage.setItem('instaviral_notifications', JSON.stringify(notificationConfig));
  }, [notificationConfig]);

  // Initialize or attach VideoRenderer when selectedVideo changes
  useEffect(() => {
    if (selectedVideo && canvasRef.current) {
      if (!videoRendererRef.current) {
        videoRendererRef.current = new VideoRenderer(canvasRef.current);
      }
      const renderer = videoRendererRef.current;
      renderer.onTimeUpdate = (current, total) => {
        setVideoProgress({ current, total });
      };
      renderer.onEnded = () => {
        setVideoPlaying(false);
      };
      renderer.loadReel(selectedVideo);
      setVideoPlaying(false);
      setVideoProgress({ current: 0, total: selectedVideo.duration || 16 });
    }

    return () => {
      if (videoRendererRef.current) {
        videoRendererRef.current.stopAudio();
      }
    };
  }, [selectedVideo]);

  // Video Player Controls
  const togglePlay = () => {
    if (!videoRendererRef.current) return;
    soundFx.playPop();
    if (videoPlaying) {
      videoRendererRef.current.pause();
      setVideoPlaying(false);
    } else {
      videoRendererRef.current.play();
      setVideoPlaying(true);
    }
  };

  const handleSeek = (e) => {
    if (!videoRendererRef.current) return;
    const time = parseFloat(e.target.value);
    videoRendererRef.current.seek(time);
  };

  const toggleLike = (videoId) => {
    soundFx.playPop();
    setLikedVideos(prev => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  const toggleSound = () => {
    const newState = soundFx.toggle();
    setSoundEnabled(newState);
  };

  // AI Modification handler
  const handleApplyAiPrompt = (promptText = aiPromptInput) => {
    if (!promptText.trim() || !selectedVideo) return;
    setAiModifying(true);
    soundFx.playPop();

    setTimeout(() => {
      const updated = agentService.modifyReelWithAI(selectedVideo, promptText);
      setVideos(prev => prev.map(v => v.id === updated.id ? updated : v));
      setSelectedVideo(updated);
      if (videoRendererRef.current) {
        videoRendererRef.current.loadReel(updated);
      }
      setAiModifying(false);
      setAiPromptInput('');
      setAiModificationSuccess(`¡Cambios aplicados con éxito! (${promptText})`);
      soundFx.playSuccess();
      setTimeout(() => setAiModificationSuccess(''), 4500);
    }, 900);
  };

  // Remove / Dismiss video
  const handleDismissVideo = (videoId) => {
    soundFx.playTrash();
    const confirmed = confirm('¿Quieres quitar este vídeo de la programación de hoy? Puedes generar uno nuevo si prefieres.');
    if (!confirmed) return;

    setVideos(prev => prev.filter(v => v.id !== videoId));
    if (selectedVideo && selectedVideo.id === videoId) {
      if (videoRendererRef.current) {
        videoRendererRef.current.stopAudio();
      }
      setSelectedVideo(null);
    }
  };

  // Generate an alternative replacement video
  const handleRegenerateVideo = (index = 0) => {
    soundFx.playPop();
    const newReel = agentService.generateAlternativeReel(index);
    setVideos(prev => [newReel, ...prev]);
    soundFx.playSuccess();
  };

  // Publish Now to Instagram
  const handlePublishNow = (videoId) => {
    soundFx.playPop();
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        return {
          ...v,
          status: 'published',
          publishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return v;
    }));
    soundFx.playSuccess();
    alert('🎉 ¡Reel publicado exitosamente en tu cuenta de Instagram (@creadores.ia) a través de Instagram Graph API!');
    if (selectedVideo && selectedVideo.id === videoId) {
      setSelectedVideo(prev => ({ ...prev, status: 'published' }));
    }
  };

  // Trigger manual Nightly Pipeline
  const runNightlySimulation = async () => {
    soundFx.playPop();
    setShowPipelineModal(true);
    setPipelineRunning(true);
    setPipelineLogs([]);

    await agentService.runNightlyPipeline((progress) => {
      setPipelineStep(progress);
      if (progress.stepData) {
        setPipelineLogs(prev => [
          ...prev,
          {
            time: new Date().toLocaleTimeString(),
            agent: progress.stepData.agent,
            action: progress.stepData.action,
            detail: progress.stepData.detail
          }
        ]);
      }
      if (progress.status === 'completed') {
        soundFx.playSuccess();
        setPipelineRunning(false);
      }
    });
  };

  // Simulate Morning Notification
  const handleTriggerMorningNotification = () => {
    soundFx.playNotificationChime();
    setShowWhatsAppModal(true);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-rose-900/20 via-purple-900/10 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#07090e]/85 border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl ig-gradient flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                  InstaViral <span className="ig-gradient-text">AI</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/25">
                  Agentes Nocturnos
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Análisis de tendencias nocturno & generación autónoma de Reels
              </p>
            </div>
          </div>

          {/* Quick Actions & Account Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Run Nightly Scan Now Button */}
            <button
              onClick={runNightlySimulation}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-rose-500/20 transition-all active:scale-95"
              title="Ejecuta la pipeline de agentes IA nocturna ahora mismo"
            >
              <Moon className="w-4 h-4" />
              <span className="hidden md:inline">Ejecutar Análisis Nocturno</span>
              <span className="md:hidden">Ciclo IA</span>
            </button>

            {/* Test Notification Button */}
            <button
              onClick={handleTriggerMorningNotification}
              className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all active:scale-95"
              title={`Simula el aviso de las ${notificationConfig.time}`}
            >
              <BellRing className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Aviso {notificationConfig.time}</span>
            </button>

            {/* Sound Effects Toggle */}
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title={soundEnabled ? 'Sonidos activados' : 'Sonidos silenciados'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Account pill */}
            <div
              onClick={() => setActiveTab('account')}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors"
            >
              <img
                src={account.avatar}
                alt="Avatar"
                className="w-7 h-7 rounded-full object-cover ring-2 ring-rose-500/50"
              />
              <div className="hidden lg:block text-left">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  {account.handle}
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>
                <div className="text-[10px] text-slate-400">{account.followers} seguidores</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-7xl mx-auto mt-3 flex items-center gap-2 overflow-x-auto border-t border-slate-800/60 pt-2.5 scrollbar-none">
          <button
            onClick={() => { soundFx.playPop(); setActiveTab('videos'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'videos'
                ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            Vídeos de Hoy ({videos.filter(v => v.status !== 'dismissed').length})
          </button>

          <button
            onClick={() => { soundFx.playPop(); setActiveTab('pipeline'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pipeline'
                ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Pipeline de Agentes IA & Tendencias
          </button>

          <button
            onClick={() => { soundFx.playPop(); setActiveTab('notifications'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'notifications'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Avisos y WhatsApp ({notificationConfig.time})
          </button>

          <button
            onClick={() => { soundFx.playPop(); setActiveTab('account'); }}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'account'
                ? 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            Instagram Graph API & Nicho
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 lg:px-8 py-6">
        {/* Morning Notification Callout Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-800/80 to-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-slate-100">
                  Aviso diario programado para las {notificationConfig.time}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Canal: WhatsApp ({notificationConfig.phoneNumber})
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cada mañana a esta hora recibes el mensaje con los enlaces directos para revisar, editar con IA o quitar cualquier vídeo antes de su publicación automática.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <button
              onClick={handleTriggerMorningNotification}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              Ver Notificación Simulada
            </button>
            <button
              onClick={() => { soundFx.playPop(); setActiveTab('notifications'); }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs transition-colors"
              title="Cambiar hora de aviso"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* TAB 1: VIDEOS DE HOY */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                  Vídeos Preparados para Hoy
                  <span className="text-xs font-normal px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {videos.length} Reels programados
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Generados anoche tras analizar qué temas y audios fueron tendencia. Cada uno está calculado para el pico horario de mayor impacto.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRegenerateVideo(videos.length)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
                  title="Pide a la IA que cree otro vídeo alternativo"
                >
                  <PlusCircle className="w-4 h-4 text-rose-400" />
                  Crear Vídeo Extra con IA
                </button>
              </div>
            </div>

            {/* Empty state if user dismissed all */}
            {videos.length === 0 && (
              <div className="p-12 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/40">
                <VideoOff className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                <h3 className="text-lg font-bold text-slate-200">No hay vídeos en la cola de hoy</h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Has quitado todos los vídeos o aún no se ha ejecutado el ciclo nocturno. Puedes generar nuevos vídeos o ejecutar los agentes ahora.
                </p>
                <button
                  onClick={() => setVideos(INITIAL_VIDEOS)}
                  className="px-4 py-2 rounded-xl ig-gradient text-white font-semibold text-xs shadow-lg shadow-rose-500/20"
                >
                  Restaurar Vídeos de Hoy
                </button>
              </div>
            )}

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((reel) => {
                const isPublished = reel.status === 'published';
                return (
                  <div
                    key={reel.id}
                    className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col border border-slate-800/90 relative group"
                  >
                    {/* Top Status & Scheduled Time Header */}
                    <div className="p-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
                        <span className="text-xs font-extrabold text-rose-400 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {reel.scheduledTime}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          {isPublished ? '(Publicado)' : '(Hoy)'}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-400" />
                        {reel.predictedVirality}% Viral
                      </span>
                    </div>

                    {/* 9:16 Interactive Mini Preview Canvas / Card Area */}
                    <div
                      onClick={() => {
                        soundFx.playPop();
                        setSelectedVideo(reel);
                      }}
                      className="relative h-64 bg-slate-950 flex flex-col justify-end p-5 cursor-pointer overflow-hidden group/thumb"
                    >
                      {/* Generative Background preview representation */}
                      <div className={`absolute inset-0 opacity-80 transition-transform duration-500 group-hover/thumb:scale-105 ${
                        reel.theme === 'luxury-gold'
                          ? 'bg-gradient-to-b from-[#1a140a] via-[#2a1e0b] to-[#0c0904]'
                          : reel.theme === 'synthwave'
                          ? 'bg-gradient-to-b from-[#12042b] via-[#3b0b54] to-[#ff3366]/40'
                          : reel.theme === 'emerald-matrix'
                          ? 'bg-gradient-to-b from-[#021008] via-[#052414] to-[#010904]'
                          : 'bg-gradient-to-b from-[#090814] via-[#130d2e] to-[#07050d]'
                      }`} />

                      {/* Animated decorative grid lines */}
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                      {/* Hook Badge */}
                      <div className="relative z-10 mb-2">
                        <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full bg-rose-600 text-white shadow-lg">
                          {reel.hookBadge || 'VIRAL HOOK'}
                        </span>
                      </div>

                      {/* Hook Text */}
                      <p className="relative z-10 text-sm font-extrabold text-white leading-snug drop-shadow-md line-clamp-3">
                        "{reel.hook}"
                      </p>

                      {/* Play overlay hover icon */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity z-20 backdrop-blur-[2px]">
                        <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-xl transform scale-90 group-hover/thumb:scale-100 transition-transform">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      </div>

                      {/* Bottom duration & theme indicators */}
                      <div className="relative z-10 mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                        <span className="flex items-center gap-1">
                          <Music className="w-3 h-3 text-rose-400" />
                          {reel.soundTrack ? reel.soundTrack.split('(')[0] : 'Trending Lo-Fi'}
                        </span>
                        <span className="font-mono bg-black/50 px-1.5 py-0.5 rounded text-[10px]">
                          00:{reel.duration || 16}s
                        </span>
                      </div>
                    </div>

                    {/* Content Details & Viral Rationale */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="font-bold text-sm text-slate-200 line-clamp-1">{reel.title}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                          {reel.script}
                        </p>
                      </div>

                      {/* Algorithm Rationale pill */}
                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-300">¿Por qué a las {reel.scheduledTime}?</strong> {reel.scheduledReason}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            soundFx.playPop();
                            setSelectedVideo(reel);
                          }}
                          className="flex-1 py-2 px-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-rose-300" />
                          Ver Reel (9:16)
                        </button>

                        <button
                          onClick={() => {
                            soundFx.playPop();
                            setSelectedVideo(reel);
                            setTimeout(() => {
                              const el = document.getElementById('ai-prompt-input-player');
                              if (el) el.focus();
                            }, 300);
                          }}
                          className="py-2 px-2.5 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          title="Pide a la IA que cambie el gancho, el fondo, la música o el horario"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          Editar con IA
                        </button>

                        {/* Discard button */}
                        <button
                          onClick={() => handleDismissVideo(reel.id)}
                          className="p-2 rounded-xl hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Quitar / Eliminar este vídeo de la programación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Publish immediate button */}
                      {!isPublished ? (
                        <button
                          onClick={() => handlePublishNow(reel.id)}
                          className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-medium flex items-center justify-center gap-1.5 transition-colors border border-slate-700/60"
                        >
                          <Send className="w-3 h-3 text-emerald-400" />
                          Publicar en Instagram ahora (sin esperar)
                        </button>
                      ) : (
                        <div className="w-full py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Publicado en Instagram ({reel.publishedAt || 'Hoy'})
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PIPELINE DE AGENTES IA NOCTURNOS */}
        {activeTab === 'pipeline' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                  Pipeline Autónomo de Agentes IA
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  Arquitectura multi-agente que opera cada noche mientras duermes para analizar el mercado y producir vídeos virales listos para mañana.
                </p>
              </div>

              <button
                onClick={runNightlySimulation}
                className="px-4 py-2.5 rounded-xl ig-gradient hover:opacity-95 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-rose-500/25 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                Lanzar Análisis Nocturno Ahora
              </button>
            </div>

            {/* Visual Multi-Agent Architecture Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Agent 1 */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 relative">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
                  <Radar className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Agente 1</div>
                <h3 className="font-bold text-slate-100 text-sm mt-0.5">Radar de Tendencias</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Escanea miles de Reels y TikToks de las últimas 24 horas. Detecta audios en aceleración exponencial y hashtags en rotura.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  2,418 fuentes monitoreadas
                </div>
              </div>

              {/* Agent 2 */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 relative">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Agente 2</div>
                <h3 className="font-bold text-slate-100 text-sm mt-0.5">Estratega de Viralidad</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Cruza el nicho de tu cuenta con las horas de mayor actividad de tu audiencia para fijar los momentos exactos de publicación.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Picos calculados: 13:45, 18:30, 21:15
                </div>
              </div>

              {/* Agent 3 */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 relative">
                <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                  <Clapperboard className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">Agente 3</div>
                <h3 className="font-bold text-slate-100 text-sm mt-0.5">Productor Audiovisual</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Redacta guiones magnéticos, genera la cinemática de fondo 9:16, sincroniza subtítulos estilo Alex Hormozi y locución de voz.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Motor 9:16 a 60fps & Subtítulos IA
                </div>
              </div>

              {/* Agent 4 */}
              <div className="glass-card p-5 rounded-2xl border border-slate-800 relative">
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Agente 4</div>
                <h3 className="font-bold text-slate-100 text-sm mt-0.5">Inspector de Safe-Zone</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Garantiza que ningún texto quede tapado por los botones de Instagram, revisa copyright de música y prepara la cola de entrega.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  100% Cumplimiento Instagram API
                </div>
              </div>
            </div>

            {/* Daily Trend Radar Monitored Today */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Radio className="w-4 h-4 text-rose-500" />
                  Radar de Tendencias Detectadas Hoy
                </h3>
                <span className="text-xs text-slate-400">Actualizado hace 2 horas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trends.map((trend) => (
                  <div key={trend.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          {trend.category}
                        </span>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          {trend.growth}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-200">{trend.topic}</h4>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Music2 className="w-3.5 h-3.5 text-rose-400" />
                        {trend.audioTrack}
                      </span>
                      <span className="text-slate-300 font-medium">{trend.avgViews} vistas media</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AVISOS Y NOTIFICACIONES */}
        {activeTab === 'notifications' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                Configuración de Avisos y Notificaciones
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                La aplicación te avisará puntualmente a la hora que tú elijas para que revises los vídeos preparados antes de que se publiquen automáticamente.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
              {/* Daily Hour Selector */}
              <div>
                <label className="block text-sm font-bold text-slate-200 mb-1.5">
                  ¿A qué hora quieres recibir el mensaje cada mañana?
                </label>
                <p className="text-xs text-slate-400 mb-3">
                  Te enviaremos el resumen de los vídeos preparados para el día, sus horas de publicación y el enlace para editarlos o descartarlos.
                </p>
                <div className="flex items-center gap-4">
                  <input
                    type="time"
                    value={notificationConfig.time}
                    onChange={(e) => setNotificationConfig({ ...notificationConfig, time: e.target.value })}
                    className="px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-lg font-bold text-white focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-xs text-slate-400">
                    Sugerido: <strong>08:30</strong> (con tiempo antes del primer pico de las 13:45)
                  </span>
                </div>
              </div>

              {/* Delivery Channels */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-sm font-bold text-slate-200 mb-3">
                  Canal de envío del mensaje
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => {
                      soundFx.playPop();
                      setNotificationConfig({ ...notificationConfig, channel: 'whatsapp' });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      notificationConfig.channel === 'whatsapp'
                        ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <MessageCircle className="w-4 h-4 text-emerald-400" />
                      WhatsApp
                    </div>
                    <p className="text-[11px] mt-1 text-slate-400">Mensaje directo con vista previa interactiva</p>
                  </div>

                  <div
                    onClick={() => {
                      soundFx.playPop();
                      setNotificationConfig({ ...notificationConfig, channel: 'telegram' });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      notificationConfig.channel === 'telegram'
                        ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Send className="w-4 h-4 text-sky-400" />
                      Telegram Bot
                    </div>
                    <p className="text-[11px] mt-1 text-slate-400">Bot privado con botones de aprobación</p>
                  </div>

                  <div
                    onClick={() => {
                      soundFx.playPop();
                      setNotificationConfig({ ...notificationConfig, channel: 'push' });
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      notificationConfig.channel === 'push'
                        ? 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <Bell className="w-4 h-4 text-rose-400" />
                      Web Push
                    </div>
                    <p className="text-[11px] mt-1 text-slate-400">Notificación nativa en tu navegador o móvil</p>
                  </div>
                </div>

                {/* WhatsApp Phone Field */}
                {notificationConfig.channel === 'whatsapp' && (
                  <div className="mt-4">
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Número de teléfono (con prefijo internacional)
                    </label>
                    <input
                      type="text"
                      value={notificationConfig.phoneNumber}
                      onChange={(e) => setNotificationConfig({ ...notificationConfig, phoneNumber: e.target.value })}
                      className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                      placeholder="+34 600 00 00 00"
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  Configuración guardada automáticamente
                </span>

                <button
                  onClick={handleTriggerMorningNotification}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  Enviar Notificación de Prueba Ahora
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CONEXION INSTAGRAM GRAPH API */}
        {activeTab === 'account' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
                Conexión con Cuenta de Instagram
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Conexión directa mediante la API de Instagram Graph para creadores y cuentas profesionales.
              </p>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
              {/* Account Card Profile */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src={account.avatar}
                    alt="Instagram Avatar"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-rose-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-100 text-base">{account.name}</h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                        🟢 Conectado Oficial
                      </span>
                    </div>
                    <p className="text-xs text-rose-400 font-semibold">{account.handle}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
                      <span><strong>{account.followers}</strong> seguidores</span>
                      <span>•</span>
                      <span><strong>{account.engagementRate}</strong> tasa de interacción</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundFx.playPop();
                    const newHandle = prompt('Ingresa el nuevo @handle de Instagram:', account.handle);
                    if (newHandle) setAccount({ ...account, handle: newHandle });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
                >
                  Editar Perfil
                </button>
              </div>

              {/* Niche & Audience Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nicho de Contenido (guía a los agentes IA)
                  </label>
                  <select
                    value={account.niche}
                    onChange={(e) => setAccount({ ...account, niche: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
                  >
                    <option value="Inteligencia Artificial & Productividad">Inteligencia Artificial & Productividad</option>
                    <option value="Marketing Digital & Creadores">Marketing Digital & Creadores</option>
                    <option value="Fitness & Nutrición">Fitness & Nutrición</option>
                    <option value="Finanzas Personales & Inversión">Finanzas Personales & Inversión</option>
                    <option value="Humor & Entretenimiento">Humor & Entretenimiento</option>
                    <option value="Emprendimiento & Startups">Emprendimiento & Startups</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Descripción del Público Objetivo
                  </label>
                  <textarea
                    rows={2}
                    value={account.targetAudience}
                    onChange={(e) => setAccount({ ...account, targetAudience: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Instagram Graph API details */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Permisos de Instagram Graph API v21.0
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    instagram_content_publish (Subida de Reels)
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    instagram_manage_insights (Métricas)
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    instagram_basic (Perfil e ID)
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center gap-2 text-slate-300">
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    pages_read_engagement (Página FB asociada)
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL 1: SMARTPHONE 9:16 VERTICAL REEL PLAYER & AI EDITOR */}
      {/* ======================================================== */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative max-w-4xl w-full flex flex-col lg:flex-row items-center justify-center gap-6 my-auto">
            {/* Close button */}
            <button
              onClick={() => {
                if (videoRendererRef.current) videoRendererRef.current.stopAudio();
                setSelectedVideo(null);
                setVideoPlaying(false);
              }}
              className="absolute top-2 right-2 lg:-top-2 lg:-right-4 w-9 h-9 rounded-full bg-slate-800/90 hover:bg-slate-700 text-white flex items-center justify-center z-50 transition-colors shadow-lg"
              title="Cerrar reproductor"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Smartphone 9:16 Frame */}
            <div className="phone-mockup shrink-0 flex flex-col justify-between">
              {/* Phone Top Notch & Status */}
              <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-between px-6 z-30 text-[10px] text-white font-medium pointer-events-none">
                <span>09:41</span>
                <div className="w-20 h-4 bg-black rounded-b-xl mx-auto -mt-1"></div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3 h-3" />
                  <Battery className="w-3 h-3" />
                </div>
              </div>

              {/* Real-time HTML5 9:16 Canvas Renderer */}
              <div className="relative w-full h-full flex items-center justify-center bg-black">
                <canvas
                  ref={canvasRef}
                  width={360}
                  height={640}
                  onClick={togglePlay}
                  className="w-full h-full object-cover cursor-pointer"
                />

                {/* Big play button overlay when paused */}
                {!videoPlaying && (
                  <div
                    onClick={togglePlay}
                    className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer z-20"
                  >
                    <div className="w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl pl-1 transform active:scale-90 transition-transform">
                      <Play className="w-8 h-8 fill-white" />
                    </div>
                  </div>
                )}

                {/* Instagram Reels Right Sidebar Overlay (Likes, Comments, Share) */}
                <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4 z-20 text-white drop-shadow-lg">
                  <button
                    onClick={() => toggleLike(selectedVideo.id)}
                    className="flex flex-col items-center gap-1 active:scale-125 transition-transform"
                  >
                    <Heart
                      className={`w-7 h-7 ${likedVideos[selectedVideo.id] ? 'fill-rose-500 text-rose-500' : 'text-white'}`}
                    />
                    <span className="text-[11px] font-semibold">14.2K</span>
                  </button>

                  <div className="flex flex-col items-center gap-1">
                    <MessageCircle className="w-7 h-7 text-white" />
                    <span className="text-[11px] font-semibold">482</span>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <Share2 className="w-7 h-7 text-white" />
                    <span className="text-[11px] font-semibold">3.8K</span>
                  </div>

                  {/* Spinning Audio Vinyl Disc */}
                  <div className={`w-8 h-8 rounded-full border-2 border-white/60 p-1 bg-black ${videoPlaying ? 'spin-slow' : ''}`}>
                    <img
                      src={account.avatar}
                      alt="Sound icon"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Instagram Reels Bottom Caption Overlay */}
                <div className="absolute left-3 right-14 bottom-6 z-20 text-white text-left pointer-events-none drop-shadow-md">
                  <div className="flex items-center gap-2 mb-1.5">
                    <img
                      src={account.avatar}
                      alt="Avatar"
                      className="w-6 h-6 rounded-full object-cover ring-1 ring-white"
                    />
                    <span className="text-xs font-bold">{account.handle}</span>
                    <button className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/60 pointer-events-auto">
                      Seguir
                    </button>
                  </div>
                  <p className="text-xs font-medium line-clamp-2 leading-tight">
                    {selectedVideo.title} • {selectedVideo.tags?.slice(0, 3).join(' ')}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-200">
                    <Music className="w-3 h-3" />
                    <span className="truncate">{selectedVideo.soundTrack || 'Audio en tendencia original'}</span>
                  </div>
                </div>

                {/* Video Scrub Timeline Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30">
                  <div
                    className="h-full bg-rose-500 transition-all duration-100"
                    style={{ width: `${(videoProgress.current / videoProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Side Controls & AI Editor Panel */}
            <div className="glass-card p-5 rounded-3xl border border-slate-800 w-full max-w-md flex flex-col justify-between max-h-[640px] overflow-y-auto">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      Reel para las {selectedVideo.scheduledTime}
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">{selectedVideo.title}</h3>
                  </div>
                  <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    {selectedVideo.predictedVirality}% Viral
                  </span>
                </div>

                {/* Scrub Controller */}
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{Math.floor(videoProgress.current)}s</span>
                    <span className="font-semibold text-rose-400">
                      {videoPlaying ? '🔊 Reproduciendo voz y música' : '⏸ En pausa'}
                    </span>
                    <span>{Math.floor(videoProgress.total)}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={videoProgress.total}
                    step="0.1"
                    value={videoProgress.current}
                    onChange={handleSeek}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                {/* AI Modifier Box */}
                <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-bold text-purple-300 mb-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    Modificar este vídeo con Inteligencia Artificial
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2.5">
                    Pídele cualquier ajuste en lenguaje natural (gancho, duración, estilo de subtítulos, hora o tema visual):
                  </p>

                  {/* Suggestion Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {[
                      'Haz el gancho más agresivo',
                      'Fondo de Lujo Dorado',
                      'Subtítulos Neon Verde',
                      'Cambiar hora a 20:30',
                      'Añadir llamada para comentar'
                    ].map((chip) => (
                      <button
                        key={chip}
                        onClick={() => handleApplyAiPrompt(chip)}
                        className="text-[10px] px-2 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/40 text-slate-300 hover:text-purple-200 border border-slate-700 transition-colors"
                      >
                        + {chip}
                      </button>
                    ))}
                  </div>

                  {/* Custom Prompt Input */}
                  <div className="flex items-center gap-2">
                    <input
                      id="ai-prompt-input-player"
                      type="text"
                      value={aiPromptInput}
                      onChange={(e) => setAiPromptInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyAiPrompt()}
                      placeholder="Ej: Haz el texto más corto y pon fondo synthwave..."
                      className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                    />
                    <button
                      onClick={() => handleApplyAiPrompt()}
                      disabled={aiModifying || !aiPromptInput.trim()}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-semibold flex items-center gap-1 transition-all"
                    >
                      {aiModifying ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Wand2 className="w-3.5 h-3.5" />
                      )}
                      Aplicar
                    </button>
                  </div>

                  {aiModificationSuccess && (
                    <div className="mt-2 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <Check className="w-3 h-3" />
                      {aiModificationSuccess}
                    </div>
                  )}
                </div>

                {/* Full Script Details */}
                <div className="text-xs space-y-1.5">
                  <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    Guión y Subtítulos en pantalla
                  </div>
                  <p className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 leading-relaxed max-h-24 overflow-y-auto">
                    {selectedVideo.script}
                  </p>
                </div>
              </div>

              {/* Bottom Actions inside Modal */}
              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleDismissVideo(selectedVideo.id)}
                  className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-900/50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Quitar Vídeo
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      soundFx.playSuccess();
                      alert('💾 Reel guardado y aprobado para la publicación programada.');
                      setSelectedVideo(null);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    Listo
                  </button>

                  <button
                    onClick={() => handlePublishNow(selectedVideo.id)}
                    className="px-4 py-2 rounded-xl ig-gradient text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/20 active:scale-95 transition-all"
                  >
                    <Send className="w-3.5 h-3.5 fill-white" />
                    Publicar Ahora
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: SIMULATED WHATSAPP MORNING NOTIFICATION MODAL   */}
      {/* ======================================================== */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-md w-full bg-[#0b141a] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto text-slate-100">
            {/* WhatsApp Top Bar */}
            <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full ig-gradient flex items-center justify-center text-white">
                  <BotIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">InstaViral AI Bot</span>
                    <BadgeCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-[10px] text-emerald-400">en línea • Automatización Instagram</span>
                </div>
              </div>
              <button
                onClick={() => setShowWhatsAppModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="p-4 space-y-4 bg-[#0b141a] bg-[radial-gradient(#1f2c34_1px,transparent_1px)] [background-size:16px_16px] max-h-[460px] overflow-y-auto">
              {/* Date divider */}
              <div className="text-center">
                <span className="text-[10px] bg-[#182229] text-slate-400 px-3 py-1 rounded-md">
                  Hoy a las {notificationConfig.time} AM
                </span>
              </div>

              {/* Bot Message Bubble */}
              <div className="bg-[#005c4b] text-white p-4 rounded-2xl rounded-tl-sm shadow-md space-y-2 text-xs leading-relaxed max-w-[92%]">
                <div className="flex items-center gap-1.5 font-bold text-emerald-200">
                  <span>¡Buenos días @{account.handle.replace('@','')}! 🌅</span>
                </div>

                <p>
                  Tus agentes de IA han terminado el análisis de tendencias de esta noche. Hemos creado y programado <strong>{videos.length} vídeos</strong> en los picos de máxima viralidad de hoy:
                </p>

                <div className="space-y-1.5 py-1">
                  {videos.map((v) => (
                    <div key={v.id} className="p-2 rounded-lg bg-black/20 border border-white/10 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">⏰ {v.scheduledTime}</span>: {v.title}
                      </div>
                      <span className="text-[10px] text-amber-300 font-bold ml-2 shrink-0">
                        🔥 {v.predictedVirality}%
                      </span>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] text-emerald-100">
                  👉 Puedes revisarlos antes de que salgan, cambiarles cualquier detalle con IA o descartar los que no te convenzan.
                </p>

                <div className="text-[10px] text-right text-emerald-200/70 pt-1">
                  {notificationConfig.time} AM ✓✓
                </div>
              </div>

              {/* Interactive WhatsApp Quick Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    setShowWhatsAppModal(false);
                    setActiveTab('videos');
                    if (videos.length > 0) setSelectedVideo(videos[0]);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-emerald-400 text-xs font-bold flex items-center justify-center gap-2 shadow transition-all"
                >
                  <PlayCircle className="w-4 h-4" />
                  Ver y Reproducir Primer Vídeo (9:16)
                </button>

                <button
                  onClick={() => {
                    setShowWhatsAppModal(false);
                    setActiveTab('videos');
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#202c33] hover:bg-[#2a3942] border border-[#2a3942] text-white text-xs font-medium flex items-center justify-center gap-2 shadow transition-all"
                >
                  <Sliders className="w-4 h-4" />
                  Revisar los {videos.length} Vídeos
                </button>

                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    alert('✅ Todos los vídeos han sido confirmados para publicarse a sus horas.');
                    setShowWhatsAppModal(false);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition-all"
                >
                  <Check className="w-4 h-4" />
                  Aprobar Todos para Publicación Automática
                </button>
              </div>
            </div>

            {/* Bottom Input Simulation */}
            <div className="p-3 bg-[#202c33] flex items-center gap-2 border-t border-slate-800 text-xs text-slate-400">
              <Smile className="w-5 h-5 text-slate-400" />
              <div className="flex-1 bg-[#2a3942] px-3 py-2 rounded-full text-slate-300">
                Escribe a la IA para modificar vídeos...
              </div>
              <div className="w-8 h-8 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                <Mic className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: LIVE NIGHTLY PIPELINE RUNNER LOGS               */}
      {/* ======================================================== */}
      {showPipelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-2xl w-full glass-card rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto text-slate-100 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl ig-gradient flex items-center justify-center text-white">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Ciclo Nocturno de Agentes IA</h3>
                  <p className="text-xs text-slate-400">
                    {pipelineRunning ? 'Ejecutando escaneo en tiempo real...' : 'Completado con éxito'}
                  </p>
                </div>
              </div>
              {!pipelineRunning && (
                <button
                  onClick={() => setShowPipelineModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Progress status */}
            <div className="py-4">
              <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
                <span>
                  {pipelineStep ? pipelineStep.stepData?.agent || 'Inicializando...' : 'Iniciando agentes...'}
                </span>
                <span className="font-bold text-rose-400">
                  {pipelineStep ? `${pipelineStep.currentStep} de ${pipelineStep.totalSteps}` : '0 / 4'}
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full ig-gradient transition-all duration-500"
                  style={{
                    width: pipelineStep
                      ? `${(pipelineStep.currentStep / pipelineStep.totalSteps) * 100}%`
                      : '10%'
                  }}
                />
              </div>
            </div>

            {/* Live Terminal Logs */}
            <div className="p-4 rounded-xl bg-black/70 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 max-h-64 overflow-y-auto">
              {pipelineLogs.map((log, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-400 text-[11px]">
                    <span>[{log.time}]</span>
                    <strong className="text-white">{log.agent}</strong>
                  </div>
                  <p className="text-slate-300 pl-4">{log.action}</p>
                  <p className="text-emerald-400 text-[11px] pl-4">✓ {log.detail}</p>
                </div>
              ))}
              {pipelineRunning && (
                <div className="flex items-center gap-2 text-purple-400 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Agente procesando análisis de retención...</span>
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPipelineModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Cerrar
              </button>
              {!pipelineRunning && (
                <button
                  onClick={() => {
                    setShowPipelineModal(false);
                    setActiveTab('videos');
                  }}
                  className="px-4 py-2 rounded-xl ig-gradient text-white text-xs font-bold shadow-lg shadow-rose-500/20"
                >
                  Ver Vídeos Generados
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 bg-[#05070a]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>InstaViral AI • Automatización autónoma para creadores de Instagram</span>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Graph API v21.0</span>
            <span>•</span>
            <span>Meta Webhooks</span>
            <span>•</span>
            <span>WhatsApp Cloud API</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BotIcon({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 8V4H8" />
      <rect width="16" height="12" x="4" y="8" rx="2" />
      <path d="M2 14h2" />
      <path d="M20 14h2" />
      <path d="M15 13v2" />
      <path d="M9 13v2" />
    </svg>
  );
}
