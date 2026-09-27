/**
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
}
