import React, { useState, useMemo, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Search, 
  Trash2, 
  RotateCcw, 
  XCircle, 
  Award, 
  Calendar, 
  Clock, 
  BookOpen, 
  User,
  FileSpreadsheet,
  Link as LinkIcon,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  Sparkles,
  CloudUpload,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface PlayerRecord {
  id: string;
  name: string;
  playerClass: string;
  score: number; // 0-15
  prize: string;
  timeSpent: number; // in seconds
  timeFormatted: string;
  setIndex: number; // 0 to 4
  date: string;
  isVictory: boolean;
  timestamp?: number;
}

export const INITIAL_LEADERBOARD: PlayerRecord[] = [
  {
    id: 'rec-1',
    name: 'Nguyễn Hoàng Nam',
    playerClass: '12A1',
    score: 15,
    prize: '85.000.000 VNĐ',
    timeSpent: 215,
    timeFormatted: '03:35',
    setIndex: 0,
    date: '18/08/2026 08:30',
    isVictory: true,
    timestamp: 1787041800000
  },
  {
    id: 'rec-2',
    name: 'Trần Mai Anh',
    playerClass: '12A2',
    score: 15,
    prize: '85.000.000 VNĐ',
    timeSpent: 248,
    timeFormatted: '04:08',
    setIndex: 1,
    date: '18/08/2026 09:15',
    isVictory: true,
    timestamp: 1787044500000
  },
  {
    id: 'rec-3',
    name: 'Lê Quốc Bảo',
    playerClass: '12A1',
    score: 14,
    prize: '60.000.000 VNĐ',
    timeSpent: 195,
    timeFormatted: '03:15',
    setIndex: 2,
    date: '17/08/2026 15:40',
    isVictory: false,
    timestamp: 1786981200000
  },
  {
    id: 'rec-4',
    name: 'Phạm Thu Trang',
    playerClass: '12A3',
    score: 13,
    prize: '40.000.000 VNĐ',
    timeSpent: 210,
    timeFormatted: '03:30',
    setIndex: 3,
    date: '17/08/2026 16:20',
    isVictory: false,
    timestamp: 1786983600000
  },
  {
    id: 'rec-5',
    name: 'Võ Minh Đạt',
    playerClass: '12A2',
    score: 12,
    prize: '30.000.000 VNĐ',
    timeSpent: 180,
    timeFormatted: '03:00',
    setIndex: 4,
    date: '16/08/2026 10:10',
    isVictory: false,
    timestamp: 1786875000000
  },
  {
    id: 'rec-6',
    name: 'Đặng Thanh Thảo',
    playerClass: '12A4',
    score: 10,
    prize: '14.000.000 VNĐ',
    timeSpent: 165,
    timeFormatted: '02:45',
    setIndex: 0,
    date: '16/08/2026 14:05',
    isVictory: false,
    timestamp: 1786889100000
  }
];

const STORAGE_KEY = 'ai_la_trieu_phu_toan12_bang_vang_v2';
export const GOOGLE_SHEETS_URL_KEY = 'google_sheets_sync_url_toan12b3';

export const APPS_SCRIPT_SOURCE_CODE = `/**
 * =========================================================================
 * MÃ GOOGLE APPS SCRIPT DÀNH CHO APP "AI LÀ TRIỆU PHÚ - TOÁN 12 (BÀI 3)"
 * Chủ đề: Đường tiệm cận của đồ thị hàm số (SGK Toán 12 Kết nối tri thức)
 * Tác giả: GV Mr Thanh - btx
 * =========================================================================
 * 
 * HƯỚNG DẪN CÀI ĐẶT NHANH (DÀNH CHO GIÁO VIÊN):
 * 1. Mở trang Google Sheet của bạn (hoặc tạo Google Sheet mới).
 * 2. Vào menu: Tiện ích mở rộng (Extensions) -> Chọn "Apps Script".
 * 3. Xóa hết toàn bộ code mặc định trong file "Mã.gs" và dán toàn bộ đoạn code này vào.
 * 4. Bấm biểu tượng Đĩa mềm (Ctrl + S) để lưu lại.
 * 5. Bấm nút màu xanh "Triển khai" (Deploy) ở góc trên bên phải -> Chọn "Tùy chọn triển khai mới" (New deployment).
 * 6. Bấm vào biểu tượng Bánh răng ⚙️ (chọn loại) -> Chọn "Ứng dụng web" (Web app).
 * 7. Thiết lập thông số:
 *    - Mô tả: "Triệu Phú Toán 12 - Tự động lưu điểm"
 *    - Thực thi dưới dạng (Execute as): "Tôi" (Email Google của bạn)
 *    - Ai có quyền truy cập (Who has access): Chọn "BẤT KỲ AI" (Anyone)
 *      (*CỰC KỲ QUAN TRỌNG: Phải chọn "Anyone" để app khi đưa lên Vercel hoặc điện thoại học sinh có thể gửi điểm về thành công mà không bị Google chặn quyền!)
 * 8. Bấm "Triển khai" (Deploy) -> Bấm "Ủy quyền truy cập" -> Chọn tài khoản Google của bạn -> Nhấn "Nâng cao" (Advanced) -> Nhấn "Đi tới ... (không an toàn)" -> Nhấn "Cho phép" (Allow).
 * 9. Sao chép "URL ứng dụng web" (kết thúc bằng đuôi /exec, dạng: https://script.google.com/macros/s/.../exec).
 * 
 * CÁCH ÁP DỤNG KHI ĐƯA LÊN VERCEL:
 * - Cách 1 (Khuyên dùng - Áp dụng cho 100% học sinh): 
 *   Trong trang quản trị Vercel -> Vào Project của bạn -> Settings -> Environment Variables -> Tạo biến:
 *   Key: VITE_GOOGLE_SHEETS_URL
 *   Value: [Dán link Web App /exec vừa sao chép]
 *   Sau đó bấm Redeploy. Mọi học sinh khi mở link Vercel sẽ tự động gửi điểm về Sheet!
 * 
 * - Cách 2: 
 *   Mở app trên trình duyệt, bấm vào nút "Kết nối Google Sheet" ở Bảng Vàng và dán link Web App vào.
 * 
 * - Cách 3: 
 *   Gửi link Vercel cho học sinh kèm đuôi: https://ten-app.vercel.app/?sheet=[Link_Web_App]
 */

// Hàm xử lý yêu cầu GET: Kiểm tra trạng thái hoặc nhận dữ liệu test
function doGet(e) {
  // Nếu có dữ liệu gửi qua URL parameters (ví dụ: ?name=Test&score=15) thì xử lý lưu luôn
  if (e && e.parameter && (e.parameter.name || e.parameter.score !== undefined)) {
    return handleSaveData(e.parameter);
  }

  // Phản hồi kiểm tra trạng thái hoạt động của Web App
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "Google Apps Script Web App - AI LÀ TRIỆU PHÚ TOÁN 12 đang hoạt động ổn định và sẵn sàng nhận dữ liệu!",
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

// Hàm xử lý yêu cầu POST: Nhận kết quả từ Vercel khi học sinh hoàn thành bài thi
function doPost(e) {
  var data = {};
  if (e && e.postData && e.postData.contents) {
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      data = e.parameter || {};
    }
  } else if (e && e.parameter) {
    data = e.parameter;
  }
  return handleSaveData(data);
}

// Hàm cốt lõi ghi dữ liệu vào Google Sheets với cơ chế khóa chống xung đột
function handleSaveData(data) {
  var lock = LockService.getScriptLock();
  try {
    // Đợi tối đa 30 giây để xử lý tuần tự, chống nghẽn khi hàng chục học sinh cùng nộp bài 1 lúc
    lock.waitLock(30000);

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    // Ưu tiên chọn sheet tên 'KetQua', nếu chưa có thì lấy sheet hiện tại hoặc tạo mới
    var sheet = ss.getSheetByName('KetQua');
    if (!sheet) {
      sheet = ss.getActiveSheet();
      if (!sheet || sheet.getName() === 'Trang tính1' || sheet.getName() === 'Sheet1') {
        try { sheet.setName('KetQua'); } catch (err) {}
      }
    }
    if (!sheet) {
      sheet = ss.insertSheet('KetQua');
    }

    // 1. TỰ ĐỘNG KHỞI TẠO BẢNG & TIÊU ĐỀ NẾU TRANG TÍNH ĐANG TRỐNG
    if (sheet.getLastRow() === 0) {
      var headers = [
        "STT",
        "Thời gian nộp bài",
        "Họ và tên thí sinh",
        "Lớp",
        "Bộ đề thi",
        "Số câu đúng (15)",
        "Mức tiền thưởng",
        "Thời gian làm bài",
        "Trạng thái kết quả",
        "Mã lượt chơi"
      ];
      sheet.appendRow(headers);

      // Định dạng dòng tiêu đề chuyên nghiệp (Nền xanh đen, chữ vàng chuẩn Ai Là Triệu Phú)
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#020024");
      headerRange.setFontColor("#facc15");
      headerRange.setFontWeight("bold");
      headerRange.setFontSize(11);
      headerRange.setHorizontalAlignment("center");
      headerRange.setVerticalAlignment("middle");
      sheet.setRowHeight(1, 40);
      sheet.setFrozenRows(1); // Cố định tiêu đề khi cuộn trang

      // Căn chỉnh độ rộng cột chuẩn mực
      sheet.setColumnWidth(1, 55);   // STT
      sheet.setColumnWidth(2, 160);  // Thời gian
      sheet.setColumnWidth(3, 200);  // Họ tên
      sheet.setColumnWidth(4, 90);   // Lớp
      sheet.setColumnWidth(5, 230);  // Bộ đề
      sheet.setColumnWidth(6, 120);  // Số câu đúng
      sheet.setColumnWidth(7, 140);  // Tiền thưởng
      sheet.setColumnWidth(8, 140);  // Thời gian
      sheet.setColumnWidth(9, 230);  // Trạng thái
      sheet.setColumnWidth(10, 180); // Mã lượt chơi
    }

    // 2. CHUẨN HÓA DỮ LIỆU ĐẦU VÀO
    var recordId = data.id || ("rec-" + new Date().getTime());

    // Kiểm tra chống trùng lặp nếu đường truyền gửi lại cùng 1 mã lượt chơi
    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      var checkLimit = Math.min(30, lastRow - 1);
      var existingIds = sheet.getRange(lastRow - checkLimit + 1, 10, checkLimit, 1).getValues();
      for (var i = 0; i < existingIds.length; i++) {
        if (existingIds[i][0] === recordId) {
          lock.releaseLock();
          return ContentService.createTextOutput(JSON.stringify({
            status: "success",
            message: "Lượt chơi đã được ghi nhận trước đó!",
            id: recordId
          })).setMimeType(ContentService.MimeType.JSON);
        }
      }
    }

    var stt = lastRow; // Số thứ tự tăng dần theo dòng
    var dateStr = data.date || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss");
    var name = (data.name || "Thí sinh").toString().trim();
    var playerClass = (data.playerClass || "12").toString().trim().toUpperCase();
    var setName = data.setName || ("Bộ " + ((data.setIndex !== undefined ? data.setIndex : 0) + 1));
    var score = data.score !== undefined ? Number(data.score) : 0;
    var prize = data.prize || "0 VNĐ";
    var timeFormatted = data.timeFormatted || "00:00";
    
    // Xác định trạng thái kết quả
    var status = data.status || "";
    if (!status) {
      if (data.isVictory || score >= 15) {
        status = "👑 Triệu phú Toán học (15/15)";
      } else if (data.gameEndReason === 'walkaway') {
        status = "🛡️ Dừng cuộc chơi bảo toàn (" + score + "/15)";
      } else {
        status = "❌ Dừng cuộc chơi (" + score + "/15)";
      }
    }

    // 3. THÊM DÒNG KẾT QUẢ MỚI
    var newRow = [
      stt,
      dateStr,
      name,
      playerClass,
      setName,
      score + " / 15",
      prize,
      timeFormatted,
      status,
      recordId
    ];

    sheet.appendRow(newRow);

    // 4. ĐỊNH DẠNG DÒNG DỮ LIỆU VỪA THÊM
    var newRowIndex = sheet.getLastRow();
    var rowRange = sheet.getRange(newRowIndex, 1, 1, newRow.length);
    rowRange.setVerticalAlignment("middle");
    rowRange.setFontFamily("Roboto");
    sheet.setRowHeight(newRowIndex, 32);

    // Căn lề từng cột
    sheet.getRange(newRowIndex, 1).setHorizontalAlignment("center"); // STT
    sheet.getRange(newRowIndex, 2).setHorizontalAlignment("center"); // Thời gian
    sheet.getRange(newRowIndex, 4).setHorizontalAlignment("center").setFontWeight("bold"); // Lớp
    sheet.getRange(newRowIndex, 6).setHorizontalAlignment("center").setFontWeight("bold"); // Số câu đúng
    sheet.getRange(newRowIndex, 7).setHorizontalAlignment("right").setFontWeight("bold").setFontColor("#15803d"); // Tiền thưởng xanh lá
    sheet.getRange(newRowIndex, 8).setHorizontalAlignment("center"); // Thời gian làm bài
    sheet.getRange(newRowIndex, 9).setHorizontalAlignment("center"); // Trạng thái
    sheet.getRange(newRowIndex, 10).setHorizontalAlignment("center").setFontColor("#64748b").setFontSize(9); // Mã ID

    // Tô viền mảnh cho dòng
    rowRange.setBorder(true, true, true, true, true, true, "#e2e8f0", SpreadsheetApp.BorderStyle.SOLID);

    // Hiệu ứng màu nền: Vinh danh Triệu Phú (15 câu) màu vàng nhạt, xen kẽ dòng chẵn lẻ
    if (score >= 15 || data.isVictory) {
      rowRange.setBackground("#fef08a"); // Nền vàng rực rỡ vinh danh Triệu Phú
    } else if (newRowIndex % 2 === 0) {
      rowRange.setBackground("#f8fafc"); // Dòng chẵn màu xám trắng thanh lịch
    }

    lock.releaseLock();

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Đã tự động ghi nhận kết quả của thí sinh: " + name + " (" + playerClass + ")!",
      stt: stt,
      row: newRowIndex
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    if (lock) lock.releaseLock();
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

export function getGoogleSheetsUrl(): string {
  try {
    // 1. Kiểm tra tham số URL (?sheet= hoặc ?sheet_url=)
    // Rất tiện lợi khi giáo viên gửi link Vercel kèm tham số cho học sinh
    if (typeof window !== 'undefined' && window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      const queryUrl = urlParams.get('sheet') || urlParams.get('sheet_url');
      if (queryUrl && queryUrl.trim().startsWith('http')) {
        const cleaned = queryUrl.trim();
        localStorage.setItem(GOOGLE_SHEETS_URL_KEY, cleaned);
        return cleaned;
      }
    }

    // 2. Kiểm tra bộ nhớ cục bộ localStorage
    const saved = localStorage.getItem(GOOGLE_SHEETS_URL_KEY);
    if (saved && saved.trim()) return saved.trim();

    // 3. Kiểm tra biến môi trường Vercel/Vite VITE_GOOGLE_SHEETS_URL
    const envUrl = (import.meta as any).env?.VITE_GOOGLE_SHEETS_URL;
    if (envUrl && typeof envUrl === 'string' && envUrl.trim()) return envUrl.trim();
  } catch (e) {
    // fallback
  }
  return '';
}

export function setGoogleSheetsUrl(url: string) {
  try {
    if (url && url.trim()) {
      localStorage.setItem(GOOGLE_SHEETS_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(GOOGLE_SHEETS_URL_KEY);
    }
  } catch (e) {
    // fallback
  }
}

export async function syncRecordToGoogleSheets(
  record: PlayerRecord,
  customUrl?: string
): Promise<{ success: boolean; message?: string }> {
  const url = (customUrl !== undefined ? customUrl : getGoogleSheetsUrl()).trim();
  if (!url) {
    return { success: false, message: 'Chưa cấu hình URL Google Sheets' };
  }

  const setTitles = [
    "Bộ 1: Nhận diện & Khái niệm",
    "Bộ 2: Kĩ năng & BBT",
    "Bộ 3: Phân tích & TCX",
    "Bộ 4: Tham số m & Đồ thị",
    "Bộ 5: Tổng hợp & Thực tiễn"
  ];

  const payload = {
    id: record.id,
    timestamp: record.timestamp || Date.now(),
    date: record.date,
    name: record.name,
    playerClass: record.playerClass,
    setIndex: record.setIndex,
    setName: setTitles[record.setIndex] || `Bộ ${record.setIndex + 1}`,
    score: record.score,
    prize: record.prize,
    timeSpent: record.timeSpent,
    timeFormatted: record.timeFormatted,
    isVictory: record.isVictory,
    status: record.isVictory || record.score >= 15
      ? "👑 Triệu phú Toán học (15/15)"
      : `Hoàn thành (${record.score}/15)`
  };

  const payloadJson = JSON.stringify(payload);

  try {
    // Sử dụng fetch với mode 'no-cors' và keepalive: true để đảm bảo không bị chặn CORS
    // và tiếp tục gửi dữ liệu ngay cả khi học sinh tắt trình duyệt hoặc chuyển trang trên điện thoại
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      keepalive: true,
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: payloadJson
    });
    return { success: true, message: 'Đã gửi thành công' };
  } catch (err: any) {
    // Nếu fetch lỗi mạng, thử fallback bằng navigator.sendBeacon nếu trình duyệt hỗ trợ
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      try {
        const beaconSuccess = navigator.sendBeacon(
          url, 
          new Blob([payloadJson], { type: 'text/plain;charset=utf-8' })
        );
        if (beaconSuccess) {
          return { success: true, message: 'Đã gửi qua kênh nền Beacon' };
        }
      } catch (beaconErr) {
        // ignore
      }
    }
    console.warn('Lỗi khi gửi kết quả về Google Sheets:', err);
    return { success: false, message: err?.message || 'Lỗi mạng khi kết nối' };
  }
}

const PENDING_SYNC_QUEUE_KEY = 'ai_la_trieu_phu_toan12_pending_sync_queue';

export function getStoredRecords(): PlayerRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_LEADERBOARD;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to read leaderboard records', e);
  }
  return INITIAL_LEADERBOARD;
}

export function parseRecordTimestamp(record: PlayerRecord): number {
  if (record.timestamp) return record.timestamp;
  try {
    const parts = record.date.split(' ');
    if (parts.length === 2) {
      const dParts = parts[0].split('/');
      const tParts = parts[1].split(':');
      if (dParts.length === 3 && tParts.length >= 2) {
        return new Date(
          Number(dParts[2]),
          Number(dParts[1]) - 1,
          Number(dParts[0]),
          Number(tParts[0]),
          Number(tParts[1])
        ).getTime();
      }
    }
  } catch (e) {
    // ignore
  }
  return 0;
}

export function getPendingSyncRecords(): PlayerRecord[] {
  try {
    const raw = localStorage.getItem(PENDING_SYNC_QUEUE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    // ignore
  }
  return [];
}

export function addRecordToSyncQueue(record: PlayerRecord) {
  try {
    const queue = getPendingSyncRecords();
    if (!queue.some(r => r.id === record.id)) {
      queue.push(record);
      localStorage.setItem(PENDING_SYNC_QUEUE_KEY, JSON.stringify(queue));
    }
  } catch (e) {
    // ignore
  }
}

export async function flushPendingSyncQueue(): Promise<{ syncedCount: number; remainingCount: number }> {
  const url = getGoogleSheetsUrl();
  if (!url) return { syncedCount: 0, remainingCount: 0 };

  const queue = getPendingSyncRecords();
  if (queue.length === 0) return { syncedCount: 0, remainingCount: 0 };

  let synced = 0;
  const stillPending: PlayerRecord[] = [];

  for (const record of queue) {
    try {
      const res = await syncRecordToGoogleSheets(record, url);
      if (res.success) {
        synced++;
      } else {
        stillPending.push(record);
      }
    } catch {
      stillPending.push(record);
    }
  }

  localStorage.setItem(PENDING_SYNC_QUEUE_KEY, JSON.stringify(stillPending));
  return { syncedCount: synced, remainingCount: stillPending.length };
}

export function savePlayerRecord(
  data: Omit<PlayerRecord, 'id' | 'date'> & { date?: string }
): PlayerRecord {
  const newRecord: PlayerRecord = {
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    date: data.date || new Date().toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    timestamp: Date.now(),
    name: data.name.trim(),
    playerClass: data.playerClass.trim().toUpperCase(),
    score: data.score,
    prize: data.prize,
    timeSpent: data.timeSpent,
    timeFormatted: data.timeFormatted,
    setIndex: data.setIndex,
    isVictory: data.isVictory
  };

  try {
    const existing = getStoredRecords();
    const updated = [newRecord, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Lỗi khi lưu kết quả vào localStorage:', e);
  }

  // Luôn thêm vào hàng đợi đồng bộ Google Sheets
  addRecordToSyncQueue(newRecord);

  // Nếu đang có mạng và đã có URL Google Sheets, tự động gửi ngay lập tức!
  if (typeof navigator !== 'undefined' && navigator.onLine && getGoogleSheetsUrl()) {
    flushPendingSyncQueue().catch(err => console.warn('Background sync error:', err));
  }

  return newRecord;
}

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  highlightRecordId?: string;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  highlightRecordId
}) => {
  const [records, setRecords] = useState<PlayerRecord[]>(() => getStoredRecords());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSet, setFilterSet] = useState<number | 'all'>('all');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'score' | 'recent'>('score');
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Google Sheets state
  const [isSheetModalOpen, setIsSheetModalOpen] = useState(false);
  const [currentSheetUrl, setCurrentSheetUrl] = useState(() => getGoogleSheetsUrl());
  const [sheetUrlInput, setSheetUrlInput] = useState(() => getGoogleSheetsUrl());
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncAllMsg, setSyncAllMsg] = useState<string | null>(null);
  const [hasCopiedCode, setHasCopiedCode] = useState(false);
  const [sheetTab, setSheetTab] = useState<'settings' | 'code' | 'guide'>('settings');

  // Reload records whenever modal opens
  React.useEffect(() => {
    if (isOpen) {
      setRecords(getStoredRecords());
      setCurrentSheetUrl(getGoogleSheetsUrl());
      setSheetUrlInput(getGoogleSheetsUrl());
    }
  }, [isOpen]);

  const handleSaveSheetUrl = () => {
    setGoogleSheetsUrl(sheetUrlInput);
    setCurrentSheetUrl(sheetUrlInput.trim());
    setTestResult({
      success: true,
      message: sheetUrlInput.trim() ? 'Đã lưu cấu hình Google Sheets thành công!' : 'Đã xóa cấu hình Google Sheets.'
    });
  };

  const handleTestConnection = async () => {
    if (!sheetUrlInput.trim()) {
      setTestResult({ success: false, message: 'Vui lòng dán URL Web App Google Apps Script trước!' });
      return;
    }
    setIsTestingSheet(true);
    setTestResult(null);

    // Save url first
    setGoogleSheetsUrl(sheetUrlInput);
    setCurrentSheetUrl(sheetUrlInput.trim());

    // Create a lightweight sample ping record
    const testRecord: PlayerRecord = {
      id: `test-${Date.now()}`,
      name: 'Kiểm tra kết nối',
      playerClass: 'TEST',
      score: 15,
      prize: '85.000.000 VNĐ',
      timeSpent: 120,
      timeFormatted: '02:00',
      setIndex: 0,
      date: new Date().toLocaleString('vi-VN'),
      isVictory: true
    };

    const res = await syncRecordToGoogleSheets(testRecord, sheetUrlInput.trim());
    setIsTestingSheet(false);
    if (res.success) {
      setTestResult({
        success: true,
        message: '✓ Kết nối THÀNH CÔNG! Dữ liệu mẫu đã được ghi vào bảng tính Google Sheets của bạn.'
      });
    } else {
      setTestResult({
        success: false,
        message: '✗ Không thể gửi đến URL này. Hãy đảm bảo bạn đã chọn quyền truy cập là "Bất kỳ ai (Anyone)" khi Triển khai Web App!'
      });
    }
  };

  const handleSyncAllToSheet = async () => {
    if (!currentSheetUrl) {
      setSyncAllMsg('Vui lòng lưu link Web App trước khi đồng bộ!');
      return;
    }
    setIsSyncingAll(true);
    setSyncAllMsg('Đang gửi toàn bộ kết quả lên Google Sheets...');
    
    let count = 0;
    for (const rec of records) {
      await syncRecordToGoogleSheets(rec, currentSheetUrl);
      count++;
    }
    
    setIsSyncingAll(false);
    setSyncAllMsg(`✓ Đã đồng bộ thành công ${count} lượt thi lên bảng tính Google Sheets!`);
  };

  const handleCopyAppsScriptCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_SOURCE_CODE).then(() => {
      setHasCopiedCode(true);
      setTimeout(() => setHasCopiedCode(false), 2500);
    });
  };

  const distinctClasses = useMemo(() => {
    const set = new Set<string>();
    records.forEach(r => {
      if (r.playerClass) set.add(r.playerClass.toUpperCase());
    });
    return Array.from(set).sort();
  }, [records]);

  const filteredAndSortedRecords = useMemo(() => {
    return records
      .filter(r => {
        const matchesQuery = 
          r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.playerClass.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSet = filterSet === 'all' || r.setIndex === filterSet;
        const matchesClass = filterClass === 'all' || r.playerClass.toUpperCase() === filterClass;
        return matchesQuery && matchesSet && matchesClass;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          if (b.score !== a.score) return b.score - a.score;
          return a.timeSpent - b.timeSpent; // Faster time wins on tie
        } else {
          return parseRecordTimestamp(b) - parseRecordTimestamp(a);
        }
      });
  }, [records, searchQuery, filterSet, filterClass, sortBy]);

  const confirmClearHistory = () => {
    localStorage.removeItem(STORAGE_KEY);
    setRecords([]);
    setShowConfirmClear(false);
  };

  const handleResetSample = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_LEADERBOARD));
    setRecords(INITIAL_LEADERBOARD);
    setShowConfirmClear(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-900 border-2 border-yellow-500/60 rounded-3xl shadow-[0_0_50px_rgba(234,179,8,0.25)] w-full max-w-4xl max-h-[90vh] flex flex-col relative text-white overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-blue-500/20 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-400 to-amber-600 flex items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.5)] border border-yellow-300">
              <Trophy size={26} className="text-slate-950" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-500 uppercase tracking-wide">
                Bảng Vàng Triệu Phú Toán 12
              </h2>
              <p className="text-xs md:text-sm text-blue-300">
                Chủ đề: Bài 3 - Đường tiệm cận của đồ thị hàm số — SGK Toán 12 Kết nối tri thức
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSheetUrlInput(getGoogleSheetsUrl());
                setTestResult(null);
                setSyncAllMsg(null);
                setIsSheetModalOpen(true);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                currentSheetUrl
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-yellow-500/15 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/25'
              }`}
              title="Cấu hình Google Sheets để tự động lưu kết quả"
            >
              <FileSpreadsheet size={15} className={currentSheetUrl ? "text-emerald-400" : "text-yellow-400"} />
              <span className="hidden sm:inline">{currentSheetUrl ? 'Google Sheet: Đã kết nối' : 'Kết nối Google Sheet'}</span>
              <span className="sm:hidden">{currentSheetUrl ? 'Sheet OK' : 'Sheet'}</span>
              <span className={`w-2 h-2 rounded-full shrink-0 ${currentSheetUrl ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <XCircle size={28} />
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="px-6 py-4 bg-slate-950/60 border-b border-blue-900/40 flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-2 flex-1 min-w-[280px]">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[180px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên hoặc lớp..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-800/80 border border-blue-500/30 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
              />
            </div>

            {/* Set Filter */}
            <select
              value={filterSet}
              onChange={e => setFilterSet(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="bg-slate-800 border border-blue-500/30 rounded-xl px-3 py-2 text-sm text-blue-200 focus:outline-none focus:border-yellow-400"
            >
              <option value="all">Tất cả bộ đề</option>
              <option value="0">Bộ 1 (Nhận diện & Khái niệm)</option>
              <option value="1">Bộ 2 (Kĩ năng & BBT)</option>
              <option value="2">Bộ 3 (Tiệm cận xiên & Phân thức)</option>
              <option value="3">Bộ 4 (Tham số m & Đồ thị)</option>
              <option value="4">Bộ 5 (Tổng hợp & Thực tiễn)</option>
            </select>

            {/* Class Filter */}
            {distinctClasses.length > 0 && (
              <select
                value={filterClass}
                onChange={e => setFilterClass(e.target.value)}
                className="bg-slate-800 border border-blue-500/30 rounded-xl px-3 py-2 text-sm text-blue-200 focus:outline-none focus:border-yellow-400"
              >
                <option value="all">Tất cả các lớp</option>
                {distinctClasses.map(cls => (
                  <option key={cls} value={cls}>Lớp {cls}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-xl bg-slate-800 p-1 border border-blue-500/30 text-xs">
              <button
                onClick={() => setSortBy('score')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  sortBy === 'score'
                    ? 'bg-yellow-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Top Điểm Cao
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  sortBy === 'recent'
                    ? 'bg-yellow-500 text-slate-950 shadow'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Gần Đây
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table / Cards */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 md:p-6 space-y-3">
          {filteredAndSortedRecords.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Award size={48} className="mx-auto mb-3 opacity-30 text-yellow-400" />
              <p className="text-lg font-medium">Chưa có kết quả nào phù hợp.</p>
              <p className="text-xs text-slate-500 mt-1">Hãy tham gia chơi để ghi tên mình vào Bảng Vàng!</p>
            </div>
          ) : (
            filteredAndSortedRecords.map((item, index) => {
              const isHighlight = item.id === highlightRecordId;
              const isGold = index === 0;
              const isSilver = index === 1;
              const isBronze = index === 2;

              let rankBadge = (
                <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 font-bold flex items-center justify-center text-sm border border-slate-700">
                  {index + 1}
                </div>
              );

              let cardBorder = 'border-slate-800 bg-slate-800/40 hover:bg-slate-800/70';
              if (isGold) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-500 to-amber-300 text-slate-950 font-black flex items-center justify-center text-base shadow-[0_0_15px_rgba(234,179,8,0.6)]">
                    🥇 1
                  </div>
                );
                cardBorder = 'border-yellow-500/60 bg-gradient-to-r from-yellow-950/30 via-slate-900 to-slate-900 shadow-[0_0_20px_rgba(234,179,8,0.15)]';
              } else if (isSilver) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-300 to-slate-100 text-slate-950 font-black flex items-center justify-center text-base shadow-[0_0_12px_rgba(226,232,240,0.5)]">
                    🥈 2
                  </div>
                );
                cardBorder = 'border-slate-400/50 bg-gradient-to-r from-slate-800/60 via-slate-900 to-slate-900';
              } else if (isBronze) {
                rankBadge = (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-700 to-amber-500 text-white font-black flex items-center justify-center text-base shadow-[0_0_12px_rgba(180,83,9,0.5)]">
                    🥉 3
                  </div>
                );
                cardBorder = 'border-amber-700/50 bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900';
              }

              if (isHighlight) {
                cardBorder += ' ring-2 ring-yellow-400 animate-pulse';
              }

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border ${cardBorder} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all`}
                >
                  <div className="flex items-center gap-4">
                    <div className="shrink-0">{rankBadge}</div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-bold text-white tracking-wide">
                          {item.name}
                        </span>
                        <span className="bg-blue-600/30 text-blue-300 border border-blue-400/40 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                          Lớp {item.playerClass}
                        </span>
                        {item.isVictory && (
                          <span className="bg-yellow-500/20 text-yellow-300 border border-yellow-400/40 text-xs px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                            👑 Triệu phú Toán
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <BookOpen size={13} className="text-blue-400" /> Bộ đề {item.setIndex + 1}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} className="text-amber-400" /> {item.timeFormatted}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} className="text-slate-400" /> {item.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 pl-12 md:pl-0">
                    <div className="text-left md:text-right">
                      <div className="text-xs text-slate-400 uppercase font-medium">Số câu đúng</div>
                      <div className="text-xl font-extrabold text-yellow-400">
                        {item.score} <span className="text-sm font-normal text-slate-400">/ 15</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400 uppercase font-medium">Mức thưởng</div>
                      <div className="text-lg font-bold text-emerald-400">
                        {item.prize}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-blue-900/30 flex flex-wrap items-center justify-between gap-3">
          {showConfirmClear ? (
            <div className="flex items-center gap-2 w-full sm:w-auto bg-red-950/70 border border-red-500/50 p-2 rounded-xl text-xs">
              <span className="text-red-200 font-semibold">Xóa toàn bộ kết quả Bảng Vàng?</span>
              <button
                onClick={confirmClearHistory}
                className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg cursor-pointer"
              >
                Đồng ý xóa
              </button>
              <button
                onClick={() => setShowConfirmClear(false)}
                className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg cursor-pointer"
              >
                Hủy
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSample}
                className="text-xs text-slate-400 hover:text-blue-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw size={13} /> Nạp dữ liệu mẫu
              </button>
              <button
                onClick={() => setShowConfirmClear(true)}
                className="text-xs text-red-400/80 hover:text-red-300 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/40 transition-colors cursor-pointer"
              >
                <Trash2 size={13} /> Xóa lịch sử
              </button>
            </div>
          )}

          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-lg ml-auto cursor-pointer"
          >
            Đóng
          </button>
        </div>

        {/* GOOGLE SHEETS SYNC CONFIG MODAL */}
        <AnimatePresence>
          {isSheetModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6"
            >
              <motion.div
                initial={{ scale: 0.92, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.92, y: 15 }}
                className="bg-slate-900 border-2 border-emerald-500/70 rounded-3xl shadow-[0_0_50px_rgba(16,185,129,0.3)] w-full max-w-2xl max-h-[92vh] flex flex-col relative text-white overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-4 md:p-5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400">
                      <FileSpreadsheet size={22} />
                    </div>
                    <div>
                      <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                        Tự Động Lưu Điểm Về Google Sheets
                        <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          Toán 12B3
                        </span>
                      </h3>
                      <p className="text-xs text-slate-300">
                        Học sinh chơi trên Vercel hoặc điện thoại sẽ tự động gửi kết quả về bảng tính
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsSheetModalOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
                  >
                    <XCircle size={22} />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 text-xs font-semibold">
                  <button
                    onClick={() => setSheetTab('settings')}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                      sheetTab === 'settings'
                        ? 'border-emerald-400 text-emerald-300 font-bold'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Cấu hình & Đồng bộ
                  </button>
                  <button
                    onClick={() => setSheetTab('code')}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                      sheetTab === 'code'
                        ? 'border-yellow-400 text-yellow-300 font-bold'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    2. Mã Apps Script (Mã.gs)
                  </button>
                  <button
                    onClick={() => setSheetTab('guide')}
                    className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
                      sheetTab === 'guide'
                        ? 'border-blue-400 text-blue-300 font-bold'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    3. Hướng dẫn triển khai
                  </button>
                </div>

                {/* Content body */}
                <div className="p-4 md:p-5 overflow-y-auto no-scrollbar space-y-4 text-xs">
                  {/* TAB 1: SETTINGS */}
                  {sheetTab === 'settings' && (
                    <div className="space-y-4">
                      {/* Status card */}
                      <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        currentSheetUrl
                          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                          : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      }`}>
                        <div className="flex items-center gap-2.5">
                          {currentSheetUrl ? (
                            <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                          ) : (
                            <AlertCircle size={20} className="text-amber-400 shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-sm">
                              {currentSheetUrl ? 'Đang tự động lưu điểm' : 'Chưa liên kết Google Sheets'}
                            </div>
                            <div className="text-[11px] opacity-80">
                              {currentSheetUrl
                                ? 'Mỗi khi học sinh hoàn thành bài thi, điểm và thông tin sẽ được tự động ghi nhận vào sheet'
                                : 'Dán đường dẫn Web App của Google Apps Script bên dưới để kích hoạt tự động lưu'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pending offline queue alert */}
                      {getPendingSyncRecords().length > 0 && (
                        <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                            <span>Có <strong>{getPendingSyncRecords().length}</strong> lượt thi lưu offline chờ đồng bộ.</span>
                          </div>
                          <button
                            type="button"
                            disabled={!currentSheetUrl || isSyncingAll}
                            onClick={async () => {
                              setIsSyncingAll(true);
                              const res = await flushPendingSyncQueue();
                              setIsSyncingAll(false);
                              setSyncAllMsg(`Đã đồng bộ ${res.syncedCount} lượt thi offline lên Google Sheets!`);
                            }}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-[11px] transition-colors cursor-pointer"
                          >
                            Đồng bộ ngay
                          </button>
                        </div>
                      )}

                      {/* URL Input */}
                      <div className="space-y-1.5 text-left">
                        <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wide">
                          Đường dẫn Web App của Google Apps Script (kết thúc bằng /exec):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                            value={sheetUrlInput}
                            onChange={e => setSheetUrlInput(e.target.value)}
                            className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={handleSaveSheetUrl}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shrink-0 cursor-pointer"
                          >
                            Lưu Link
                          </button>
                        </div>
                      </div>

                      {/* Action buttons: Test connection & Sync all */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <button
                          type="button"
                          disabled={isTestingSheet || !sheetUrlInput.trim()}
                          onClick={handleTestConnection}
                          className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 border border-slate-600 text-slate-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {isTestingSheet ? (
                            <RefreshCw size={14} className="animate-spin text-emerald-400" />
                          ) : (
                            <Send size={14} className="text-emerald-400" />
                          )}
                          <span>{isTestingSheet ? 'Đang kiểm tra kết nối...' : 'Kiểm tra kết nối Sheet'}</span>
                        </button>

                        <button
                          type="button"
                          disabled={isSyncingAll || !currentSheetUrl}
                          onClick={handleSyncAllToSheet}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSyncingAll ? (
                            <RefreshCw size={14} className="animate-spin text-emerald-400" />
                          ) : (
                            <CloudUpload size={14} className="text-emerald-400" />
                          )}
                          <span>Đồng bộ toàn bộ {records.length} lượt thi lên Sheet</span>
                        </button>
                      </div>

                      {/* Test feedback */}
                      {testResult && (
                        <div className={`p-3 rounded-xl border text-xs leading-relaxed ${
                          testResult.success
                            ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
                        }`}>
                          {testResult.message}
                        </div>
                      )}

                      {/* Sync all feedback */}
                      {syncAllMsg && (
                        <div className="p-3 rounded-xl border bg-blue-950/60 border-blue-500/60 text-blue-200 text-xs">
                          {syncAllMsg}
                        </div>
                      )}

                      {/* Quick tip */}
                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                        <div className="font-semibold text-yellow-400 flex items-center gap-1">
                          <Sparkles size={13} /> Lưu ý cho thầy/cô khi đưa lên Vercel:
                        </div>
                        <p>
                          • Bạn chỉ cần dán link Web App vào đây <strong>1 lần duy nhất</strong> (được lưu trực tiếp trong trình duyệt).
                        </p>
                        <p>
                          • Hoặc khi triển khai lên Vercel, thêm biến môi trường <code className="text-cyan-300">VITE_GOOGLE_SHEETS_URL</code> bằng link Web App để áp dụng cho tất cả học sinh truy cập trang web!
                        </p>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: APPS SCRIPT CODE */}
                  {sheetTab === 'code' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-300 font-bold text-xs">
                          Mã nguồn dán vào file <code className="text-yellow-400 font-mono">Mã.gs</code>:
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyAppsScriptCode}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-black transition-colors cursor-pointer"
                        >
                          {hasCopiedCode ? <Check size={13} /> : <Copy size={13} />}
                          <span>{hasCopiedCode ? 'Đã sao chép!' : 'Sao chép toàn bộ mã'}</span>
                        </button>
                      </div>

                      <div className="relative">
                        <pre className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[300px] leading-relaxed select-all">
                          {APPS_SCRIPT_SOURCE_CODE}
                        </pre>
                      </div>

                      <p className="text-[11px] text-slate-400 italic">
                        * Mã này đã có sẵn bộ khóa chống xung đột (LockService) và tự động tạo tiêu đề bảng kèm định dạng màu sắc đẹp mắt khi học sinh đầu tiên nộp bài.
                      </p>
                    </div>
                  )}

                  {/* TAB 3: DEPLOYMENT GUIDE */}
                  {sheetTab === 'guide' && (
                    <div className="space-y-3 text-left">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/30 space-y-3">
                        <h4 className="font-bold text-yellow-400 text-sm flex items-center gap-1.5">
                          <CheckCircle2 size={16} /> Các bước triển khai Web App từ Google Sheets (Toán 12B3):
                        </h4>

                        <div className="space-y-2.5 text-xs text-slate-300">
                          <div className="flex gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                            <div>
                              Trong màn hình <strong>Apps Script</strong> (dự án <strong>Toán 12B3</strong>), xóa hết mã cũ trong file <code className="text-yellow-300 font-mono">Mã.gs</code>, dán toàn bộ mã từ tab <strong>"2. Mã Apps Script"</strong> rồi bấm <strong>Lưu (Ctrl + S)</strong>.
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                            <div>
                              Nhấn nút màu xanh <strong>Triển khai (Deploy)</strong> ở góc trên bên phải → Chọn <strong>Tùy chọn triển khai mới (New deployment)</strong>.
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                            <div>
                              Bấm biểu tượng bánh răng ⚙️ bên cạnh "Chọn loại", chọn <strong>Ứng dụng web (Web app)</strong>:
                              <ul className="list-disc pl-4 mt-1 text-[11px] text-slate-300 space-y-0.5">
                                <li><strong>Mô tả:</strong> Triệu Phú Toán 12B3</li>
                                <li><strong>Thực thi dưới dạng:</strong> <span className="text-yellow-300 font-semibold">Tôi (email của bạn)</span></li>
                                <li><strong>Ai có quyền truy cập:</strong> <span className="text-emerald-400 font-bold uppercase underline">Bất kỳ ai (Anyone)</span> <span className="text-slate-400">(Bắt buộc để app trên Vercel gửi điểm được không bị chặn quyền)</span></li>
                              </ul>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">4</span>
                            <div>
                              Bấm <strong>Triển khai (Deploy)</strong> → Chọn <strong>Cấp quyền truy cập</strong> → Đăng nhập tài khoản Google → Nhấn <strong>Nâng cao (Advanced)</strong> → Chọn <strong>Đi tới Toán 12B3 (không an toàn)</strong> → Bấm <strong>Cho phép (Allow)</strong>.
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-600/40 text-blue-300 font-bold flex items-center justify-center shrink-0 text-[11px]">5</span>
                            <div>
                              Sao chép <strong>URL ứng dụng web</strong> (có đuôi kết thúc bằng <code className="text-cyan-300 font-mono">/exec</code>) và dán vào tab <strong>"1. Cấu hình & Đồng bộ"</strong> rồi bấm <strong>Lưu Link</strong>.
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-600/40 text-emerald-300 font-bold flex items-center justify-center shrink-0 text-[11px]">6</span>
                            <div>
                              <strong>Cấu hình khi đưa lên Vercel (Tùy chọn tự động cho tất cả học sinh):</strong>
                              <p className="mt-1 text-slate-300">
                                Trong Vercel Dashboard, chọn dự án của bạn → Vào <strong>Settings</strong> → <strong>Environment Variables</strong>:
                              </p>
                              <div className="mt-1.5 p-2.5 bg-slate-900 rounded-xl border border-slate-700 font-mono text-[11px] text-yellow-300">
                                <div><strong>Key:</strong> <span className="text-cyan-300">VITE_GOOGLE_SHEETS_URL</span></div>
                                <div><strong>Value:</strong> <span className="text-emerald-300">https://script.google.com/macros/s/.../exec</span></div>
                              </div>
                              <p className="mt-1.5 text-[11px] text-slate-400">
                                Sau đó bấm <strong>Redeploy</strong>. Khi đó, toàn bộ học sinh chơi trên điện thoại hay máy tính đều tự động gửi kết quả về Google Sheet của bạn mà không cần bất kỳ cài đặt nào!
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => setIsSheetModalOpen(false)}
                    className="px-5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Hoàn tất & Đóng
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
