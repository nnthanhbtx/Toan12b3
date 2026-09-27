import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  HelpCircle, 
  Phone, 
  Users, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Lightbulb, 
  Trophy, 
  Star, 
  Medal, 
  Award, 
  Flame, 
  Sparkles, 
  BookOpen, 
  Clock, 
  ShieldCheck,
  Menu,
  ChevronRight,
  Volume2,
  VolumeX,
  Shuffle,
  WifiOff,
  FileSpreadsheet,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { questionSets, Question, shuffleQuestionOptions } from './data';
import { 
  LeaderboardModal, 
  savePlayerRecord, 
  getGoogleSheetsUrl, 
  flushPendingSyncQueue 
} from './components/LeaderboardModal';
import { MathGraphic } from './components/MathGraphic';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { usePWAInstall } from './hooks/usePWAInstall';
import Latex from 'react-latex-next';

// --- Pure Web Audio API Engine (Works 100% Offline with zero network dependencies) ---
class AudioEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  
  init() {
    if (!this.enabled) return;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('AudioContext not supported or blocked');
    }
  }

  playTone(frequency: number, type: OscillatorType, duration: number, volume = 0.1) {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio error catch
    }
  }

  playHover() { this.playTone(600, 'sine', 0.08, 0.04); }
  playSelect() {
    this.playTone(220, 'sine', 1.8, 0.08);
    this.playTone(329.63, 'sine', 1.8, 0.05);
  }
  playLifeline() {
    this.playTone(523.25, 'sine', 0.18, 0.08);
    setTimeout(() => this.playTone(659.25, 'sine', 0.18, 0.08), 70);
    setTimeout(() => this.playTone(783.99, 'sine', 0.35, 0.1), 140);
  }
  playStop() {
    this.playTone(392, 'sine', 0.25, 0.08);
    setTimeout(() => this.playTone(329.63, 'sine', 0.45, 0.08), 140);
  }
  playCorrect() {
    this.playTone(440, 'sine', 0.35, 0.1); // A4
    setTimeout(() => this.playTone(554.37, 'sine', 0.35, 0.1), 90); // C#5
    setTimeout(() => this.playTone(659.25, 'sine', 0.7, 0.12), 180); // E5
  }
  playWrong() {
    this.playTone(220, 'sawtooth', 0.4, 0.1);
    setTimeout(() => this.playTone(160, 'sawtooth', 0.7, 0.12), 200);
  }
  playWin() {
    [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.5, 0.1), i * 140);
    });
  }
}

const audio = new AudioEngine();

const PRIZE_LADDER = [
  "100.000 VNĐ",
  "200.000 VNĐ",
  "300.000 VNĐ",
  "500.000 VNĐ",
  "1.000.000 VNĐ", // Mốc an toàn 1 (Câu 5)
  "2.000.000 VNĐ",
  "3.600.000 VNĐ",
  "6.000.000 VNĐ",
  "10.000.000 VNĐ",
  "14.000.000 VNĐ", // Mốc an toàn 2 (Câu 10)
  "22.000.000 VNĐ",
  "30.000.000 VNĐ",
  "40.000.000 VNĐ",
  "60.000.000 VNĐ",
  "85.000.000 VNĐ"  // Triệu phú Toán học (Câu 15)
];

const SET_TITLES = [
  "Bộ 1: Nhận diện & Khái niệm cơ bản",
  "Bộ 2: Kĩ năng tính toán & Đọc bảng biến thiên",
  "Bộ 3: Phân tích phân thức & Tiệm cận xiên",
  "Bộ 4: Đồ thị nâng cao & Tham số m",
  "Bộ 5: Tổng hợp & Thực tiễn GDPT 2018"
];

export default function App() {
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameover' | 'victory'>('intro');
  const [playerName, setPlayerName] = useState('');
  const [playerClass, setPlayerClass] = useState('');
  
  const [selectedSetMode, setSelectedSetMode] = useState<number | 'random'>('random');
  const [questionSetIndex, setQuestionSetIndex] = useState(0);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [showResultStatus, setShowResultStatus] = useState<'none' | 'correct' | 'wrong'>('none');
  const [gameEndReason, setGameEndReason] = useState<'victory' | 'walkaway' | 'wrong'>('wrong');
  
  const [lifelines, setLifelines] = useState({ fiftyFifty: true, askAudience: true, callFriend: true });
  const [hiddenOptions, setHiddenOptions] = useState<number[]>([]);
  
  const [activeModal, setActiveModal] = useState<'none' | 'audience' | 'friend' | 'solution' | 'stopConfirm'>('none');
  const [audienceData, setAudienceData] = useState<number[]>([]);
  const [friendMessage, setFriendMessage] = useState('');
  
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isMobileLadderOpen, setIsMobileLadderOpen] = useState(false);
  const [latestRecordId, setLatestRecordId] = useState<string | undefined>(undefined);
  const [hasRecordedSession, setHasRecordedSession] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const { isOnline } = usePWAInstall();

  // Mobile Web Audio unlock on initial user touch or click
  useEffect(() => {
    const handleFirstInteraction = () => {
      audio.init();
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
    };
  }, []);

  const [timeElapsed, setTimeElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'queued' | 'no_url'>('idle');

  // Auto-sync offline pending records whenever app comes online
  useEffect(() => {
    const handleOnlineSync = () => {
      flushPendingSyncQueue().then(res => {
        if (res.syncedCount > 0) {
          console.log(`[Google Sheets] Tự động đồng bộ ${res.syncedCount} lượt chơi vừa kết thúc.`);
        }
      }).catch(() => {});
    };

    if (typeof navigator !== 'undefined' && navigator.onLine) {
      handleOnlineSync();
    }

    window.addEventListener('online', handleOnlineSync);
    return () => window.removeEventListener('online', handleOnlineSync);
  }, []);

  const currentQ = currentQuestions[currentQIndex] || questionSets[0][0];

  // Toggle Sound
  const toggleSound = () => {
    const nextMuted = !isSoundMuted;
    setIsSoundMuted(nextMuted);
    audio.enabled = !nextMuted;
    if (!nextMuted) {
      audio.init();
    }
  };

  // Global Timer
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  const startGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || !playerClass.trim()) return;
    audio.init();
    audio.playWin();

    // Determine question set index
    let setIdx = 0;
    if (selectedSetMode === 'random') {
      setIdx = Math.floor(Math.random() * questionSets.length);
    } else {
      setIdx = selectedSetMode;
    }
    setQuestionSetIndex(setIdx);

    // Shuffle options dynamically for every question in this game session
    // ensuring the options A, B, C, D are randomized every single time
    const rawQuestions = questionSets[setIdx] || questionSets[0];
    const randomizedQuestions = rawQuestions.map(q => shuffleQuestionOptions(q));
    setCurrentQuestions(randomizedQuestions);

    setGameState('playing');
    setTimeElapsed(0);
    setCurrentQIndex(0);
    setHasRecordedSession(false);
    setLatestRecordId(undefined);
    setGameEndReason('wrong');
    resetQuestionState();
  };

  const resetQuestionState = () => {
    setSelectedAnswer(null);
    setIsAnswerLocked(false);
    setShowResultStatus('none');
    setHiddenOptions([]);
    setActiveModal('none');
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getPrizeWon = (score: number, endStatus: 'victory' | 'walkaway' | 'wrong') => {
    if (endStatus === 'victory' || score >= 15) return PRIZE_LADDER[14];
    if (endStatus === 'walkaway') {
      return score === 0 ? "0 VNĐ" : PRIZE_LADDER[score - 1];
    }
    // Trả lời sai (wrong): áp dụng luật mốc an toàn 5 và 10 của Ai Là Triệu Phú
    if (score >= 10) return PRIZE_LADDER[9]; // Mốc an toàn 2 (Câu 10: 14.000.000 VNĐ)
    if (score >= 5) return PRIZE_LADDER[4];  // Mốc an toàn 1 (Câu 5: 1.000.000 VNĐ)
    return "0 VNĐ";
  };

  const handleSelectAnswer = (index: number) => {
    if (isAnswerLocked || hiddenOptions.includes(index)) return;
    audio.init();
    audio.playSelect();
    setSelectedAnswer(index);
    setIsAnswerLocked(true);

    // Wait 1.8 seconds before showing result
    setTimeout(() => {
      if (index === currentQ.correctAnswerIndex) {
        audio.playCorrect();
        setShowResultStatus('correct');
      } else {
        audio.playWrong();
        setShowResultStatus('wrong');
      }
    }, 1800);
  };

  const recordGameOverOrVictory = (finalScore: number, endStatus: 'victory' | 'walkaway' | 'wrong') => {
    if (!hasRecordedSession && playerName.trim()) {
      const prize = getPrizeWon(finalScore, endStatus);
      const sheetUrl = getGoogleSheetsUrl();
      
      if (!sheetUrl) {
        setSyncStatus('no_url');
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        setSyncStatus('queued');
      } else {
        setSyncStatus('syncing');
      }

      const saved = savePlayerRecord({
        name: playerName.trim(),
        playerClass: playerClass.trim().toUpperCase(),
        score: finalScore,
        prize,
        timeSpent: timeElapsed,
        timeFormatted: formatTime(timeElapsed),
        setIndex: questionSetIndex,
        isVictory: endStatus === 'victory'
      });
      if (saved) {
        setLatestRecordId(saved.id);
        if (sheetUrl && typeof navigator !== 'undefined' && navigator.onLine) {
          // Sync was triggered in background by savePlayerRecord
          setTimeout(() => {
            setSyncStatus('synced');
          }, 900);
        }
      }
      setHasRecordedSession(true);
    }
  };

  const handleNextAction = () => {
    if (showResultStatus === 'correct') {
      if (currentQIndex === 14) {
        audio.playWin();
        setGameEndReason('victory');
        recordGameOverOrVictory(15, 'victory');
        setGameState('victory');
      } else {
        setCurrentQIndex(prev => prev + 1);
        resetQuestionState();
      }
    } else if (showResultStatus === 'wrong') {
      setGameEndReason('wrong');
      recordGameOverOrVictory(currentQIndex, 'wrong');
      setGameState('gameover');
    }
  };

  const handleStopGame = () => {
    if (isAnswerLocked) return;
    audio.init();
    audio.playHover();
    setActiveModal('stopConfirm');
  };

  const confirmStopGame = () => {
    audio.init();
    audio.playStop();
    setActiveModal('none');
    setGameEndReason('walkaway');
    recordGameOverOrVictory(currentQIndex, 'walkaway');
    setGameState('gameover');
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || isAnswerLocked) return;
    audio.init();
    audio.playLifeline();
    setLifelines(prev => ({ ...prev, fiftyFifty: false }));
    
    let wrongOptions = [0, 1, 2, 3].filter(i => i !== currentQ.correctAnswerIndex);
    wrongOptions.sort(() => Math.random() - 0.5);
    setHiddenOptions([wrongOptions[0], wrongOptions[1]]);
  };

  const useAskAudience = () => {
    if (!lifelines.askAudience || isAnswerLocked) return;
    audio.init();
    audio.playLifeline();
    setLifelines(prev => ({ ...prev, askAudience: false }));
    
    let data = [0, 0, 0, 0];
    let remaining = 100;
    
    const correctShare = Math.floor(Math.random() * 26) + 52; 
    data[currentQ.correctAnswerIndex] = correctShare;
    remaining -= correctShare;
    
    const otherIndices = [0, 1, 2, 3].filter(i => i !== currentQ.correctAnswerIndex && !hiddenOptions.includes(i));
    otherIndices.forEach((idx, i) => {
      if (i === otherIndices.length - 1) {
        data[idx] = remaining;
      } else {
        const share = Math.floor(Math.random() * (remaining * 0.7));
        data[idx] = share;
        remaining -= share;
      }
    });
    
    setAudienceData(data);
    setActiveModal('audience');
  };

  const useCallFriend = () => {
    if (!lifelines.callFriend || isAnswerLocked) return;
    audio.init();
    audio.playLifeline();
    setLifelines(prev => ({ ...prev, callFriend: false }));
    
    const isCorrect = Math.random() < 0.85;
    const suggestedIndex = isCorrect 
      ? currentQ.correctAnswerIndex 
      : [0,1,2,3].filter(i => i !== currentQ.correctAnswerIndex && !hiddenOptions.includes(i))[0] ?? currentQ.correctAnswerIndex;
    
    const optionsText = ['A', 'B', 'C', 'D'];
    setFriendMessage(`Alo ${playerName} à! Mình vừa học xong phần Đường tiệm cận của đồ thị hàm số này rồi. Mình tự tin 90% đáp án đúng là phương án ${optionsText[suggestedIndex]}. Hãy chọn thật chính xác nhé!`);
    setActiveModal('friend');
  };

  const restartGame = () => {
    setGameState('intro');
    setLifelines({ fiftyFifty: true, askAudience: true, callFriend: true });
    resetQuestionState();
  };

  const getFeedbackMessage = (score: number) => {
    if (score >= 15) return "Tuyệt đỉnh xuất sắc! Bạn là Nhà Triệu Phú Toán Học 12 đích thực với giải thưởng 85.000.000 VNĐ!";
    if (score >= 11) return "Rất xuất sắc! Bạn nắm cực kì vững kiến thức Vận dụng cao về Tiệm cận ngang, Tiệm cận đứng và Tiệm cận xiên!";
    if (score >= 6) return "Khá tốt! Bạn đã vượt qua các mốc kiến thức Thông hiểu quan trọng về Đường tiệm cận. Hãy luyện tập thêm để chinh phục câu 15!";
    return "Cố gắng lên nhé! Hãy đọc kĩ lại Bài 3: Đường tiệm cận của đồ thị hàm số (SGK Toán 12 Kết nối tri thức) để chinh phục đỉnh cao!";
  };

  // ==========================================
  // INTRO SCREEN
  // ==========================================
  if (gameState === 'intro') {
    return (
      <div className="min-h-[100dvh] bg-[#020024] flex items-center justify-center p-3 md:p-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(9,9,121,0.5)_0%,rgba(2,0,36,1)_100%)] z-0"></div>
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] min-w-[300px] min-h-[300px] bg-blue-500/20 rounded-full blur-[90px] pointer-events-none"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] min-w-[300px] min-h-[300px] bg-purple-500/20 rounded-full blur-[90px] pointer-events-none"></div>
        
        {/* Sound button on top-right */}
        <button 
          onClick={toggleSound}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-slate-800/80 border border-blue-500/40 text-yellow-300 hover:bg-slate-700 transition-colors shadow-lg"
          title={isSoundMuted ? "Bật âm thanh" : "Tắt âm thanh"}
        >
          {isSoundMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/95 backdrop-blur-xl p-5 md:p-8 rounded-3xl shadow-2xl z-10 border-2 border-yellow-500/50 w-full max-w-md text-center relative max-h-[92dvh] overflow-y-auto no-scrollbar"
        >
          <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-b from-yellow-300 to-yellow-600 rounded-full mx-auto flex items-center justify-center shadow-[0_0_25px_rgba(234,179,8,0.6)] mb-3 border-4 border-slate-800">
            <span className="text-3xl md:text-4xl font-black text-slate-950">$</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 mb-1 uppercase tracking-wider">
            Ai Là Triệu Phú
          </h1>
          <h2 className="text-xs md:text-sm font-bold text-blue-200 mb-1 uppercase tracking-widest">
            Bài 3: Đường Tiệm Cận Của Đồ Thị Hàm Số
          </h2>

          <div className="text-[11px] font-semibold text-slate-400 mb-3">
            GV <span className="text-white font-bold">Mr Thanh</span><span className="text-yellow-400 font-bold">btx</span>
          </div>
          
          <form onSubmit={startGame} className="space-y-3 text-left">
            <div>
              <label className="block text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-1">
                Họ và tên thí sinh:
              </label>
              <input 
                type="text" 
                placeholder="Nhập họ và tên của bạn..." 
                required
                value={playerName}
                onChange={e => setPlayerName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-blue-400/40 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-1">
                Lớp học:
              </label>
              <input 
                type="text" 
                placeholder="Ví dụ: 12A1, 12A2, 12D1..." 
                required
                value={playerClass}
                onChange={e => setPlayerClass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-blue-400/40 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all text-sm md:text-base"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-blue-300 uppercase tracking-wider mb-1">
                Chọn bộ câu hỏi (15 câu phân loại chuẩn):
              </label>
              <select
                value={selectedSetMode}
                onChange={e => setSelectedSetMode(e.target.value === 'random' ? 'random' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 border border-blue-400/40 text-yellow-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/30 transition-all text-xs md:text-sm font-semibold"
              >
                <option value="random">🎲 Chọn ngẫu nhiên bộ đề (Bộ 1 - 5)</option>
                {SET_TITLES.map((title, idx) => (
                  <option key={idx} value={idx}>{title}</option>
                ))}
              </select>
            </div>

            <div className="pt-2 space-y-2.5">
              <button 
                type="submit"
                className="w-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-slate-950 font-extrabold py-3 px-5 rounded-xl shadow-[0_4px_0_0_#a16207] active:shadow-none active:translate-y-1 transition-all text-base md:text-lg flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer min-h-[48px]"
              >
                <Play fill="currentColor" size={18} /> Bắt đầu chơi
              </button>

              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(true)}
                className="w-full bg-gradient-to-r from-amber-600/30 via-yellow-500/20 to-amber-600/30 hover:bg-yellow-500/30 border border-yellow-500/60 text-yellow-300 font-bold py-2.5 px-4 rounded-xl transition-all text-xs md:text-sm flex items-center justify-center gap-2 uppercase tracking-wider shadow-[0_0_15px_rgba(234,179,8,0.2)] cursor-pointer min-h-[42px]"
              >
                <Trophy size={16} className="text-yellow-400" /> Bảng Vàng Vinh Danh
              </button>

              {/* Google Sheets Sync Quick Status Button */}
              {(() => {
                const sheetUrl = getGoogleSheetsUrl();
                return (
                  <button
                    type="button"
                    onClick={() => setIsLeaderboardOpen(true)}
                    className={`w-full py-2 px-3 rounded-xl border text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      sheetUrl
                        ? 'bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                        : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700 text-slate-300 hover:text-yellow-300'
                    }`}
                    title="Bấm để cấu hình hoặc kiểm tra kết nối Google Sheets"
                  >
                    <FileSpreadsheet size={14} className={sheetUrl ? 'text-emerald-400' : 'text-yellow-400'} />
                    <span>
                      {sheetUrl 
                        ? 'Tự động lưu Google Sheets: Đang bật' 
                        : 'Thầy/cô bấm để kết nối Google Sheets'}
                    </span>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${sheetUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
                  </button>
                );
              })()}
            </div>
          </form>

          {/* PWA / Offline capability banner */}
          <PWAInstallBanner variant="intro" />
        </motion.div>

        {/* Leaderboard Modal */}
        <LeaderboardModal 
          isOpen={isLeaderboardOpen} 
          onClose={() => setIsLeaderboardOpen(false)} 
        />
      </div>
    );
  }

  // ==========================================
  // GAME OVER / VICTORY SCREEN
  // ==========================================
  if (gameState === 'gameover' || gameState === 'victory') {
    const isVictory = gameState === 'victory';
    const finalScore = isVictory ? 15 : currentQIndex;
    const finalPrize = getPrizeWon(finalScore, gameEndReason);
    
    return (
      <div className="min-h-[100dvh] bg-[#020024] flex items-center justify-center p-3 md:p-6 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] relative overflow-hidden">
        {/* Confetti */}
        {isVictory && (
          <div className="absolute inset-0 pointer-events-none z-0 flex flex-wrap justify-center overflow-hidden">
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: -50, x: Math.random() * window.innerWidth, rotate: 0 }}
                animate={{ y: window.innerHeight + 50, x: Math.random() * window.innerWidth, rotate: 360 }}
                transition={{ duration: 2 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 2 }}
                className="w-2.5 h-2.5 absolute"
                style={{ backgroundColor: ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#ec4899'][Math.floor(Math.random() * 6)] }}
              />
            ))}
          </div>
        )}
        
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(9,9,121,0.5)_0%,rgba(2,0,36,1)_100%)] z-0"></div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900/95 backdrop-blur-xl p-5 md:p-8 rounded-3xl shadow-2xl z-10 border-2 border-yellow-500/50 w-full max-w-lg text-center max-h-[95dvh] overflow-y-auto no-scrollbar"
        >
          <div className="mb-3 flex justify-center">
            {isVictory ? (
              <div className="relative">
                <Trophy size={64} className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.7)] animate-bounce" />
                <Sparkles size={24} className="text-amber-300 absolute -top-2 -right-2 animate-spin" />
              </div>
            ) : gameEndReason === 'walkaway' ? (
              <div className="relative">
                <ShieldCheck size={60} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
              </div>
            ) : (
              <Medal size={60} className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
            )}
          </div>
          
          <h1 className="text-xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 mb-1 uppercase tracking-wide">
            {isVictory 
              ? 'BẠN LÀ TRIỆU PHÚ TOÁN 12!' 
              : gameEndReason === 'walkaway' 
              ? 'BẢO TOÀN THƯỞNG THÀNH CÔNG!' 
              : 'KẾT THÚC CUỘC CHƠI!'}
          </h1>
          
          <div className="text-sm md:text-base text-blue-100 mb-1 font-medium">
            Thí sinh: <span className="text-yellow-400 font-bold">{playerName}</span> — Lớp: <span className="text-yellow-400 font-bold">{playerClass}</span>
          </div>
          <div className="text-xs text-slate-400 mb-4 font-semibold">
            {SET_TITLES[questionSetIndex]}
            {gameEndReason === 'walkaway' && <span className="text-emerald-400 block mt-0.5"> (Dừng cuộc chơi bảo toàn thưởng)</span>}
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-blue-500/20">
              <div className="text-[10px] text-blue-300 mb-0.5 uppercase font-medium">Số câu đúng</div>
              <div className="text-lg md:text-2xl font-black text-yellow-400">{finalScore} / 15</div>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-blue-500/20">
              <div className="text-[10px] text-blue-300 mb-0.5 uppercase font-medium">Mức thưởng</div>
              <div className="text-sm md:text-lg font-black text-emerald-400 truncate">{finalPrize}</div>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded-xl border border-blue-500/20">
              <div className="text-[10px] text-blue-300 mb-0.5 uppercase font-medium">Thời gian</div>
              <div className="text-lg md:text-2xl font-black text-white">{formatTime(timeElapsed)}</div>
            </div>
          </div>
          
          <div className="bg-blue-950/60 p-3.5 rounded-xl border border-blue-500/30 mb-4">
            <p className="text-xs md:text-sm text-blue-100 font-medium leading-relaxed">
              {getFeedbackMessage(finalScore)}
            </p>
          </div>

          {/* Real-time Google Sheets Auto-Save Status Badge */}
          <div className="mb-5 flex justify-center">
            {syncStatus === 'synced' && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={15} className="text-emerald-400" />
                <span>Đã tự động lưu kết quả vào Google Sheets thành công!</span>
              </div>
            )}
            {syncStatus === 'syncing' && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/50 text-blue-300 text-xs font-semibold animate-pulse shadow-[0_0_12px_rgba(59,130,246,0.25)]">
                <RefreshCw size={14} className="animate-spin text-blue-400" />
                <span>Đang tự động gửi điểm về Google Sheets...</span>
              </div>
            )}
            {syncStatus === 'queued' && (
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-950/80 border border-amber-500/50 text-amber-300 text-xs font-semibold">
                <WifiOff size={14} className="text-amber-400" />
                <span>Đã lưu offline (sẽ tự động gửi lên Google Sheets khi có mạng)</span>
              </div>
            )}
            {syncStatus === 'no_url' && (
              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-yellow-500/40 text-slate-300 hover:text-yellow-300 text-[11px] transition-all cursor-pointer"
                title="Bấm để thiết lập tự động lưu về Google Sheets"
              >
                <FileSpreadsheet size={13} className="text-yellow-400" />
                <span>Đã lưu trên máy • Thầy/cô bấm để liên kết Google Sheets</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <button 
              onClick={() => setIsLeaderboardOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold py-2.5 px-5 rounded-xl shadow-[0_3px_0_0_#92400e] active:translate-y-0.5 transition-all text-xs md:text-sm inline-flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer min-h-[42px]"
            >
              <Trophy size={16} /> Bảng Vàng Vinh Danh
            </button>

            <button 
              onClick={restartGame}
              className="w-full sm:w-auto bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-[0_3px_0_0_#1e3a8a] active:translate-y-0.5 transition-all text-xs md:text-sm inline-flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer min-h-[42px]"
            >
              <RotateCcw size={16} /> Chơi Lại / Chọn Đề Khác
            </button>
          </div>
        </motion.div>

        {/* Leaderboard Modal */}
        <LeaderboardModal 
          isOpen={isLeaderboardOpen} 
          onClose={() => setIsLeaderboardOpen(false)}
          highlightRecordId={latestRecordId}
        />
      </div>
    );
  }

  // ==========================================
  // PLAYING SCREEN (Mobile & Desktop Optimized)
  // ==========================================
  return (
    <div className="h-[100dvh] bg-[#020024] text-white font-sans overflow-hidden flex flex-col relative select-none">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(9,9,121,0.5)_0%,rgba(2,0,36,1)_100%)] z-0"></div>

      {/* Header Area */}
      <header className="relative z-10 w-full px-2.5 sm:px-4 md:px-6 pt-[max(0.5rem,env(safe-area-inset-top))] pb-2 pl-[max(0.6rem,env(safe-area-inset-left))] pr-[max(0.6rem,env(safe-area-inset-right))] flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-blue-500/30 shrink-0">
        <div className="flex items-center space-x-1.5 sm:space-x-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-tr from-yellow-400 to-amber-600 rounded-full flex items-center justify-center border-2 border-white shadow-[0_0_12px_rgba(251,191,36,0.5)] shrink-0">
            <span className="text-sm sm:text-base font-black italic text-slate-950">TP</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-[11px] sm:text-xs md:text-base font-bold bg-gradient-to-r from-yellow-300 via-amber-200 to-white bg-clip-text text-transparent uppercase tracking-wide truncate">
              TRIỆU PHÚ TOÁN 12
            </h1>
            <p className="text-[9px] sm:text-[11px] text-blue-200 truncate max-w-[120px] sm:max-w-[200px]">
              {playerName} ({playerClass})
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3">
          {/* Offline indicator */}
          {!isOnline && (
            <div className="hidden xs:flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold shrink-0">
              <WifiOff size={11} className="animate-pulse" />
              <span>Offline</span>
            </div>
          )}

          {/* Sound Toggle */}
          <button 
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-full bg-slate-800/80 border border-blue-500/40 text-yellow-300 hover:bg-slate-700 transition-colors cursor-pointer"
            title={isSoundMuted ? "Bật âm thanh" : "Tắt âm thanh"}
          >
            {isSoundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>

          {/* Mobile Ladder Button */}
          <button
            onClick={() => setIsMobileLadderOpen(true)}
            className="flex lg:hidden items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-[11px] font-bold cursor-pointer active:scale-95"
          >
            <Trophy size={13} />
            <span>Câu {currentQIndex + 1}</span>
          </button>

          {/* Leaderboard Button */}
          <button
            onClick={() => setIsLeaderboardOpen(true)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 text-xs font-bold transition-all cursor-pointer"
          >
            <Trophy size={14} className="text-yellow-400" /> Bảng Vàng
          </button>

          {/* Timer */}
          <div className="text-center bg-slate-900/80 px-2 py-1 rounded-lg border border-blue-500/30">
            <p className="text-[11px] sm:text-xs md:text-sm font-mono font-bold text-yellow-400">{formatTime(timeElapsed)}</p>
          </div>
          
          {/* Lifelines */}
          <div className="flex space-x-1 sm:space-x-1.5">
            <button 
              title="Trợ giúp 50:50"
              disabled={!lifelines.fiftyFifty || isAnswerLocked}
              onClick={useFiftyFifty}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center font-bold text-[10px] md:text-xs transition-all shadow ${lifelines.fiftyFifty ? 'border-yellow-400 bg-blue-900/90 text-yellow-400 hover:bg-blue-800 cursor-pointer active:scale-90' : 'border-gray-600 bg-gray-800 text-gray-500 opacity-40 relative'}`}
            >
              {!lifelines.fiftyFifty && <div className="absolute w-full h-[2px] bg-red-600 rotate-45"></div>}
              50:50
            </button>
            <button 
              title="Hỏi ý kiến khán giả"
              disabled={!lifelines.askAudience || isAnswerLocked}
              onClick={useAskAudience}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all shadow ${lifelines.askAudience ? 'border-yellow-400 bg-blue-900/90 text-yellow-400 hover:bg-blue-800 cursor-pointer active:scale-90' : 'border-gray-600 bg-gray-800 text-gray-500 opacity-40 relative'}`}
            >
              {!lifelines.askAudience && <div className="absolute w-full h-[2px] bg-red-600 rotate-45"></div>}
              <Users size={13} />
            </button>
            <button 
              title="Gọi điện người thân"
              disabled={!lifelines.callFriend || isAnswerLocked}
              onClick={useCallFriend}
              className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-all shadow ${lifelines.callFriend ? 'border-yellow-400 bg-blue-900/90 text-yellow-400 hover:bg-blue-800 cursor-pointer active:scale-90' : 'border-gray-600 bg-gray-800 text-gray-500 opacity-40 relative'}`}
            >
              {!lifelines.callFriend && <div className="absolute w-full h-[2px] bg-red-600 rotate-45"></div>}
              <Phone size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <div className="flex-1 relative z-10 flex flex-col lg:flex-row w-full overflow-hidden">
        
        {/* Left Side: Question and Answers with scroll wrapper for short mobile screens */}
        <div className="flex-1 overflow-y-auto no-scrollbar w-full flex flex-col">
          <div className="min-h-full flex flex-col justify-between items-center px-2.5 sm:px-4 md:px-8 py-2 md:py-4 w-full max-w-3xl mx-auto">
            
            {/* Progress Info & Level Badge */}
            <div className="flex items-center gap-2 mb-1.5 sm:mb-2 shrink-0">
              <div className="flex items-center space-x-1.5 bg-blue-600/30 px-2.5 py-0.5 rounded-full border border-blue-400/40 text-[10px] md:text-xs">
                <span className="text-yellow-400 font-bold uppercase tracking-wider">
                  CÂU {String(currentQIndex + 1).padStart(2, '0')} / 15
                </span>
              </div>

              {currentQ.level && (
                <span className={`text-[9px] md:text-xs font-bold px-2 py-0.5 rounded-full border ${
                  currentQ.level === 'Nhận biết'
                    ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                    : currentQ.level === 'Thông hiểu'
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                    : currentQ.level === 'Vận dụng'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                    : 'bg-rose-950 text-rose-300 border-rose-500/40'
                }`}>
                  {currentQ.level}
                </span>
              )}
            </div>

            {/* Question Box */}
            <motion.div 
              key={`q-${questionSetIndex}-${currentQIndex}`}
              initial={{ y: 8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="relative w-full max-w-3xl my-1 sm:my-auto"
            >
              <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 border-2 border-blue-400 py-3 sm:py-4 md:py-6 px-3 sm:px-4 md:px-8 text-center rounded-2xl md:rounded-3xl shadow-[0_0_25px_rgba(30,58,138,0.5)] max-h-[42vh] md:max-h-[46vh] overflow-y-auto no-scrollbar">
                <h2 className="text-xs sm:text-sm md:text-xl font-medium leading-relaxed drop-shadow-md">
                  <Latex>{currentQ.question}</Latex>
                </h2>
                {/* Graphic Diagram / Tikz rendering */}
                <MathGraphic tikz={currentQ.tikz} diagram={currentQ.diagram} />
              </div>
            </motion.div>

            {/* Answer Grid (1 column on mobile, 2 columns on tablet/desktop) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5 md:gap-4 w-full max-w-3xl mt-2 sm:mt-auto pt-1 pb-1 shrink-0">
              {currentQ.options.map((opt, idx) => {
                const optionLabels = ['A', 'B', 'C', 'D'];
                const isHidden = hiddenOptions.includes(idx);
                const isSelected = selectedAnswer === idx;
                const isCorrectAnswer = currentQ.correctAnswerIndex === idx;
                
                let btnClass = "w-full py-2.5 md:py-3.5 px-3 md:px-6 rounded-2xl text-left transition-all text-xs md:text-base relative z-20 flex items-center min-h-[44px] sm:min-h-[48px] md:min-h-[52px] cursor-pointer active:scale-[0.98] ";
                
                if (isHidden) {
                  btnClass += "opacity-0 pointer-events-none";
                } else if (!isAnswerLocked) {
                  btnClass += "bg-gradient-to-r from-blue-950 to-blue-900 border border-blue-400 hover:bg-yellow-500 hover:border-white group-hover:text-black";
                } else if (isSelected && showResultStatus === 'none') {
                  // Locked
                  btnClass += "bg-gradient-to-r from-yellow-500 to-yellow-600 border-2 border-white text-black font-semibold shadow-[0_0_15px_rgba(234,179,8,0.5)]";
                } else if (showResultStatus !== 'none') {
                  if (isCorrectAnswer) {
                    btnClass += "bg-gradient-to-r from-green-500 to-green-600 border-2 border-white text-white font-bold shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-pulse";
                  } else if (isSelected && showResultStatus === 'wrong') {
                    btnClass += "bg-gradient-to-r from-red-500 to-red-600 border-2 border-white text-white font-bold shadow-[0_0_15px_rgba(239,68,68,0.6)] animate-shake";
                  } else {
                    btnClass += "bg-blue-950/40 border border-blue-900/30 text-white/30";
                  }
                }

                return (
                  <button
                    key={`opt-${idx}`}
                    disabled={isAnswerLocked || isHidden}
                    onClick={() => handleSelectAnswer(idx)}
                    onMouseEnter={() => !isAnswerLocked && audio.playHover()}
                    className={btnClass}
                  >
                    <span className={`font-black mr-2 md:mr-3 text-xs sm:text-sm md:text-base shrink-0 ${(!isAnswerLocked || (isSelected && showResultStatus === 'none')) && !isHidden ? 'text-yellow-400' : ''}`}>
                      {optionLabels[idx]}:
                    </span>
                    <span className="font-medium flex-1 text-left leading-snug break-words">
                      <Latex>{opt}</Latex>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
          
        {/* Right Side: Score Ladder (Desktop) */}
        <div className="hidden lg:flex flex-1 bg-black/50 border-l border-blue-900/60 p-4 flex-col justify-between overflow-y-auto no-scrollbar min-w-[260px] max-w-xs">
          <div className="space-y-1 flex flex-col-reverse h-full justify-end">
            {[...Array(15)].map((_, i) => {
              const isCurrent = i === currentQIndex;
              const isPassed = i < currentQIndex;
              const isSafeHaven = (i + 1) % 5 === 0;
              
              let itemClass = "flex items-center justify-between px-3 py-1 rounded-lg text-xs transition-all ";
              let spanNumClass = "w-5 font-bold ";
              let spanLineClass = "flex-1 border-b mx-2 ";
              let spanPrizeClass = "font-semibold ";
              
              if (isCurrent) {
                itemClass += "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow-[0_0_12px_rgba(245,158,11,0.6)] scale-[1.02]";
                spanLineClass += "border-slate-950/40";
              } else if (isPassed) {
                itemClass += "text-yellow-400/90";
                spanLineClass += "border-yellow-400/20";
              } else if (isSafeHaven) {
                itemClass += "bg-white/15 text-white font-bold";
                spanLineClass += "border-white/20";
                spanPrizeClass += "text-yellow-300";
              } else {
                itemClass += "text-slate-500";
                spanNumClass += "text-slate-500";
                spanLineClass += "border-slate-800";
                spanPrizeClass += "italic";
              }

              return (
                <div key={i} className={itemClass}>
                  <span className={spanNumClass}>{i + 1}</span>
                  <span className={spanLineClass}></span>
                  <span className={spanPrizeClass}>{PRIZE_LADDER[i]}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800">
            <button 
              onClick={handleStopGame}
              className="w-full py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 rounded-xl text-xs text-red-200 font-bold transition-colors cursor-pointer"
            >
              DỪNG CUỘC CHƠI BẢO TOÀN THƯỞNG
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="relative z-10 px-3 md:px-6 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] pl-[max(0.75rem,env(safe-area-inset-left))] pr-[max(0.75rem,env(safe-area-inset-right))] flex justify-between items-center bg-black/80 border-t border-blue-900/50 shrink-0">
        <div className="flex-1 flex items-center justify-between">
          <AnimatePresence>
            {showResultStatus !== 'none' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 w-full justify-between"
              >
                <div
                  onClick={() => setActiveModal('solution')}
                  className="flex items-center space-x-1.5 group cursor-pointer inline-flex bg-blue-900/40 px-3 py-1.5 rounded-xl border border-blue-400/40 hover:bg-blue-800/60"
                >
                  <Lightbulb size={16} className="text-yellow-300 group-hover:text-white shrink-0" />
                  <span className="text-xs font-bold text-blue-300 group-hover:text-white transition-colors">
                    Xem lời giải chi tiết
                  </span>
                </div>

                <button
                  onClick={handleNextAction}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950 font-black rounded-xl shadow-lg uppercase tracking-wider text-xs md:text-sm transition-all cursor-pointer min-h-[38px]"
                >
                  {showResultStatus === 'correct' ? (currentQIndex === 14 ? '👑 Nhận giải Triệu Phú' : 'Câu tiếp ➔') : 'Kết thúc'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {showResultStatus === 'none' && (
            <div className="flex items-center justify-between w-full text-[11px] text-slate-400">
              <span>{SET_TITLES[questionSetIndex]}</span>
              <button
                onClick={handleStopGame}
                className="text-red-400 hover:text-red-300 text-[11px] font-semibold underline lg:hidden"
              >
                Dừng cuộc chơi
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Ladder Modal */}
      <AnimatePresence>
        {isMobileLadderOpen && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }} 
              exit={{ scale: 0.9 }}
              className="bg-slate-900 border-2 border-yellow-500/60 rounded-3xl p-5 w-full max-w-sm relative text-white max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-yellow-400 flex items-center gap-2">
                  <Trophy size={18} /> Thang tiền thưởng (15 Câu)
                </h3>
                <button 
                  onClick={() => setIsMobileLadderOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <XCircle size={22} />
                </button>
              </div>

              <div className="space-y-1 flex flex-col-reverse">
                {[...Array(15)].map((_, i) => {
                  const isCurrent = i === currentQIndex;
                  const isPassed = i < currentQIndex;
                  const isSafeHaven = (i + 1) % 5 === 0;
                  
                  let itemClass = "flex items-center justify-between px-3 py-1.5 rounded-lg text-xs ";
                  if (isCurrent) {
                    itemClass += "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black shadow";
                  } else if (isPassed) {
                    itemClass += "text-yellow-400/90";
                  } else if (isSafeHaven) {
                    itemClass += "bg-white/15 text-white font-bold";
                  } else {
                    itemClass += "text-slate-500";
                  }

                  return (
                    <div key={i} className={itemClass}>
                      <span className="w-6 font-bold">{i + 1}</span>
                      <span className="font-semibold">{PRIZE_LADDER[i]}</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setIsMobileLadderOpen(false)}
                className="w-full mt-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-xs uppercase"
              >
                Đóng
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lifeline & Solution Modals */}
      <AnimatePresence>
        {activeModal !== 'none' && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15 }} 
              animate={{ scale: 1, y: 0 }} 
              exit={{ scale: 0.9, y: 15 }}
              className="bg-slate-900 border-2 border-blue-400 rounded-3xl shadow-2xl p-5 md:p-6 w-full max-w-lg relative text-white max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <button 
                onClick={() => setActiveModal('none')}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>

              {activeModal === 'audience' && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                    <Users size={20} /> Ý kiến khán giả trường quay
                  </h3>
                  <div className="flex h-40 md:h-48 items-end justify-center gap-4 md:gap-6 border-b border-slate-700 pb-2">
                    {['A', 'B', 'C', 'D'].map((label, idx) => (
                      <div key={label} className="flex flex-col items-center w-10 md:w-12 group">
                        <div className="text-xs font-bold text-white mb-1.5">{audienceData[idx]}%</div>
                        <div 
                          className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-1000 group-hover:from-yellow-600 group-hover:to-yellow-400"
                          style={{ height: `${audienceData[idx]}%` }}
                        ></div>
                        <div className="mt-2 font-bold text-yellow-400 text-xs md:text-sm">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === 'friend' && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <Phone size={20} /> Trợ giúp từ người thân
                  </h3>
                  <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-blue-100 relative leading-relaxed text-xs md:text-sm">
                    <div className="absolute -left-2 top-4 w-3.5 h-3.5 bg-slate-800/80 border-l border-t border-slate-700 rotate-[-45deg]"></div>
                    "{friendMessage}"
                  </div>
                </div>
              )}

              {activeModal === 'solution' && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <Lightbulb size={20} /> Hướng dẫn giải chi tiết
                  </h3>
                  <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 text-blue-100 leading-relaxed text-sm md:text-base">
                    <Latex>{currentQ.solution}</Latex>
                    <MathGraphic tikz={currentQ.tikz} diagram={currentQ.diagram} />
                  </div>
                </div>
              )}

              {activeModal === 'stopConfirm' && (
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-amber-400 mb-2 flex items-center gap-2">
                    <ShieldCheck size={22} className="text-emerald-400" /> Xác nhận Dừng cuộc chơi
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 mb-4">
                    Bạn có chắc chắn muốn dừng cuộc chơi tại <span className="text-yellow-400 font-bold">Câu {currentQIndex + 1}</span> để bảo toàn số tiền thưởng đã tích lũy?
                  </p>

                  <div className="bg-slate-800/90 p-4 rounded-2xl border border-blue-500/30 mb-5 space-y-2 text-xs md:text-sm">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Mức thưởng bảo toàn mang về:</span>
                      <span className="text-emerald-400 font-black text-base md:text-lg">
                        {currentQIndex > 0 ? PRIZE_LADDER[currentQIndex - 1] : "0 VNĐ"}
                      </span>
                    </div>
                    <div className="border-t border-slate-700/80 pt-2 text-[11px] md:text-xs text-amber-200/80 leading-relaxed">
                      Lưu ý: Nếu tiếp tục và trả lời sai ở câu hỏi này, bạn sẽ nhận mức an toàn là:{" "}
                      <span className="text-yellow-300 font-bold">
                        {currentQIndex >= 10 ? PRIZE_LADDER[9] : currentQIndex >= 5 ? PRIZE_LADDER[4] : "0 VNĐ"}
                      </span>.
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setActiveModal('none')}
                      className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs md:text-sm transition-all border border-slate-600 cursor-pointer"
                    >
                      Tiếp tục thi đấu
                    </button>
                    <button
                      onClick={confirmStopGame}
                      className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold rounded-xl text-xs md:text-sm transition-all shadow-lg cursor-pointer"
                    >
                      Dừng & Nhận thưởng
                    </button>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Leaderboard Modal */}
      <LeaderboardModal 
        isOpen={isLeaderboardOpen} 
        onClose={() => setIsLeaderboardOpen(false)} 
        highlightRecordId={latestRecordId}
      />
      
      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          10%, 90% { transform: translate3d(-1px, 0, 0); }
          20%, 80% { transform: translate3d(2px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-3px, 0, 0); }
          40%, 60% { transform: translate3d(3px, 0, 0); }
        }
        .animate-shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
      `}} />
    </div>
  );
}
