import React, { useState } from 'react';
import { Download, Share2, PlusSquare, XCircle, CheckCircle, WifiOff, Smartphone, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC<{ variant?: 'intro' | 'compact' }> = ({ variant = 'intro' }) => {
  const { canInstall, isInstalled, isIOS, isOnline, installApp } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // If already installed in standalone mode and user is online, show a subtle badge or nothing
  if (isDismissed) return null;

  const handleInstallClick = () => {
    if (canInstall) {
      installApp();
    } else if (isIOS) {
      setShowIOSModal(true);
    } else {
      // General instructions for Android/Chrome/Desktop
      setShowIOSModal(true);
    }
  };

  return (
    <>
      {variant === 'intro' ? (
        <div className="mt-3 p-2.5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-indigo-950/80 to-blue-950/80 border border-yellow-500/30 text-left flex items-center justify-between gap-2.5 shadow-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center shrink-0 text-yellow-400">
              {!isOnline ? <WifiOff size={16} className="text-amber-400 animate-pulse" /> : <Smartphone size={16} />}
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-white flex items-center gap-1.5 truncate">
                <span>{isInstalled ? 'Đã cài đặt App (Chạy mượt offline)' : 'Chơi offline trên điện thoại'}</span>
                {!isOnline && (
                  <span className="bg-amber-500/30 text-amber-300 text-[9px] px-1.5 py-0.2 rounded font-bold">
                    Không có Wifi
                  </span>
                )}
              </div>
              <p className="text-[10px] text-blue-200 truncate">
                {isInstalled 
                  ? 'Không tốn 4G/Wifi, dữ liệu lưu ngay trên máy' 
                  : 'Cài ra màn hình chính, mở chơi mọi lúc không cần mạng'}
              </p>
            </div>
          </div>

          {!isInstalled && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="shrink-0 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-[11px] font-extrabold px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-[0_2px_0_0_#a16207] active:translate-y-0.5 transition-all cursor-pointer"
            >
              <Download size={13} />
              <span>Cài App</span>
            </button>
          )}
        </div>
      ) : (
        /* Compact variant for header or small bars */
        <button
          type="button"
          onClick={handleInstallClick}
          title="Cài app để chơi offline"
          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/15 border border-yellow-500/40 text-yellow-300 hover:bg-yellow-500/25 text-[11px] font-bold transition-all"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Cài App</span>
        </button>
      )}

      {/* Guide Modal for iOS Safari / Chrome */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-yellow-500/60 rounded-3xl p-5 w-full max-w-sm relative text-white shadow-2xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm md:text-base font-bold text-yellow-400 flex items-center gap-2">
                <Sparkles size={18} /> Cài đặt App chơi không cần Wifi
              </h3>
              <button 
                onClick={() => setShowIOSModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <XCircle size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Bạn có thể đưa trò chơi ra màn hình chính điện thoại như một App thông thường để ôn tập mọi lúc mà không cần mạng:
            </p>

            <div className="space-y-3 bg-slate-950/70 p-3.5 rounded-2xl border border-blue-500/30 text-xs">
              {isIOS ? (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <p className="leading-snug">
                      Nhấn vào nút <span className="text-yellow-400 font-bold inline-flex items-center gap-1"><Share2 size={13} /> Chia sẻ</span> (biểu tượng mũi tên đi lên ở thanh dưới Safari).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <p className="leading-snug">
                      Cuộn xuống và chọn <span className="text-yellow-400 font-bold inline-flex items-center gap-1"><PlusSquare size={13} /> Thêm vào MH chính</span> (Add to Home Screen).
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <p className="leading-snug">
                      Nhấn <span className="text-yellow-400 font-bold">Thêm (Add)</span> ở góc trên phải. Biểu tượng App sẽ xuất hiện trên màn hình điện thoại!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                    <p className="leading-snug">
                      Nhấn vào biểu tượng <span className="text-yellow-400 font-bold">Menu (⋮)</span> ở góc trên trình duyệt Chrome/Cốc Cốc.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                    <p className="leading-snug">
                      Chọn <span className="text-yellow-400 font-bold">Cài đặt ứng dụng</span> hoặc <span className="text-yellow-400 font-bold">Thêm vào Màn hình chính</span>.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                    <p className="leading-snug">
                      Nhấn xác nhận <span className="text-yellow-400 font-bold">Cài đặt</span>. App sẽ mở toàn màn hình mượt mà không cần mạng.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Đã hiểu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
