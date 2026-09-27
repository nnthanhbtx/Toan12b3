import { MathDiagram } from './components/MathGraphic';

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  solution: string;
  level?: 'Nhận biết' | 'Thông hiểu' | 'Vận dụng' | 'Vận dụng cao';
  diagram?: MathDiagram;
  tikz?: string;
}

// Utility to dynamically shuffle question options while maintaining correct answer index
export function shuffleQuestionOptions(q: Question): Question {
  const originalIndexed = q.options.map((opt, idx) => ({
    opt,
    isCorrect: idx === q.correctAnswerIndex
  }));
  
  // Fisher-Yates shuffle
  for (let i = originalIndexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = originalIndexed[i];
    originalIndexed[i] = originalIndexed[j];
    originalIndexed[j] = temp;
  }
  
  const newOptions = originalIndexed.map(item => item.opt);
  const newCorrectIndex = originalIndexed.findIndex(item => item.isCorrect);
  
  return {
    ...q,
    options: newOptions,
    correctAnswerIndex: newCorrectIndex >= 0 ? newCorrectIndex : 0
  };
}

export const questionSets: Question[][] = [
  // =========================================================================
  // BỘ ĐỀ 1: CĂN BẢN VÀ KHÁI NIỆM TIỆM CẬN (SGK TOÁN 12 - KẾT NỐI TRI THỨC)
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Đường thẳng $y = y_0$ được gọi là đường tiệm cận ngang của đồ thị hàm số $y = f(x)$ nếu thỏa mãn điều kiện nào sau đây?",
      options: [
        "$\\lim_{x \\to +\\infty} f(x) = y_0$ hoặc $\\lim_{x \\to -\\infty} f(x) = y_0$",
        "$\\lim_{x \\to y_0} f(x) = +\\infty$",
        "$\\lim_{x \\to y_0} f(x) = -\\infty$",
        "$\\lim_{x \\to +\\infty} f(x) = +\\infty$"
      ],
      correctAnswerIndex: 0,
      solution: "Theo định nghĩa SGK Toán 12 (trang 20): Đường thẳng $y = y_0$ được gọi là đường tiệm cận ngang của đồ thị hàm số $y = f(x)$ nếu $\\lim_{x \\to +\\infty} f(x) = y_0$ hoặc $\\lim_{x \\to -\\infty} f(x) = y_0$."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Đường tiệm cận đứng của đồ thị hàm số $y = \\frac{2x - 3}{x + 1}$ là đường thẳng:",
      options: [
        "$x = 1$",
        "$x = -1$",
        "$y = 2$",
        "$y = -3$"
      ],
      correctAnswerIndex: 1,
      solution: "Ta có $\\lim_{x \\to (-1)^+} \\frac{2x - 3}{x + 1} = -\\infty$ và $\\lim_{x \\to (-1)^-} \\frac{2x - 3}{x + 1} = +\\infty$. Do đó, đường tiệm cận đứng là $x = -1$."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{3x - 2}{x + 1}$ là đường thẳng:",
      options: [
        "$x = -1$",
        "$y = -2$",
        "$y = 3$",
        "$x = 3$"
      ],
      correctAnswerIndex: 2,
      solution: "Ta có $\\lim_{x \\to +\\infty} \\frac{3x - 2}{x + 1} = 3$ và $\\lim_{x \\to -\\infty} \\frac{3x - 2}{x + 1} = 3$. Do đó tiệm cận ngang là đường thẳng $y = 3$ (Ví dụ 1 SGK tr.21)."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Đường thẳng $y = ax + b$ ($a \\neq 0$) được gọi là đường tiệm cận xiên của đồ thị hàm số $y = f(x)$ nếu:",
      options: [
        "$\\lim_{x \\to +\\infty} \\frac{f(x)}{ax + b} = 1$",
        "$\\lim_{x \\to a} f(x) = b$",
        "$\\lim_{x \\to 0} [f(x) - (ax + b)] = 0$",
        "$\\lim_{x \\to +\\infty} [f(x) - (ax + b)] = 0$ hoặc $\\lim_{x \\to -\\infty} [f(x) - (ax + b)] = 0$"
      ],
      correctAnswerIndex: 3,
      solution: "Theo định nghĩa SGK Toán 12 (trang 23): Đường thẳng $y = ax + b$ ($a \\neq 0$) là đường tiệm cận xiên của đồ thị hàm số $y = f(x)$ nếu $\\lim_{x \\to +\\infty} [f(x) - (ax + b)] = 0$ hoặc $\\lim_{x \\to -\\infty} [f(x) - (ax + b)] = 0$."
    },
    {
      id: 5,
      level: 'Thông hiểu',
      question: "Đường tiệm cận xiên của đồ thị hàm số $y = \\frac{x^2 + 2x - 2}{x + 2}$ là đường thẳng:",
      diagram: {
        type: 'asymptote_graph',
        title: 'Đồ thị hàm số y = (x² + 2x - 2)/(x + 2) (Bài 1.36 SGK tr.42)',
        graphId: 'rational_1_36',
        description: 'TCĐ: x = -2, TCX: y = x, cắt Oy tại điểm (0; -1)'
      },
      tikz: "\\begin{tikzpicture}[scale=0.75,>=stealth]\n  \\draw[->] (-4.5,0) -- (3,0) node[below] {$x$};\n  \\draw[->] (0,-4) -- (0,4) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,orange] (-2,-4) -- (-2,4) node[above] {$x=-2$};\n  \\draw[dashed,thick,purple,domain=-4:3] plot (\\x,{\\x}) node[right] {$y=x$};\n  \\draw[thick,cyan,domain=-4.5:-2.25,smooth] plot (\\x,{(\\x*\\x+2*\\x-2)/(\\x+2)});\n  \\draw[thick,cyan,domain=-1.75:2.5,smooth] plot (\\x,{(\\x*\\x+2*\\x-2)/(\\x+2)});\n  \\fill (0,-1) circle (1.5pt) node[right] {$(0;-1)$};\n\\end{tikzpicture}",
      options: [
        "$y = x + 2$",
        "$y = x$",
        "$y = x - 2$",
        "$y = -2$"
      ],
      correctAnswerIndex: 1,
      solution: "Ta chia tử cho mẫu: $y = \\frac{x(x+2) - 2}{x+2} = x - \\frac{2}{x+2}$. Vì $\\lim_{x \\to \\pm\\infty} [y - x] = \\lim_{x \\to \\pm\\infty} \\left(-\\frac{2}{x+2}\\right) = 0$, nên tiệm cận xiên là $y = x$ (Bài 1.36 SGK tr.42)."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Cho hàm số $y = f(x)$ có bảng biến thiên dưới đây. Đồ thị hàm số đã cho có tổng số đường tiệm cận ngang và tiệm cận đứng là:",
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = f(x)',
        bbtPreset: 'set1_q6',
        xValues: ["-\\infty", "2", "+\\infty"],
        yPrimeSigns: ["-", "||", "-"],
        yValues: [],
        notes: "• Tiệm cận ngang: $y = 1$ (khi $x \\to -\\infty$), $y = -1$ (khi $x \\to +\\infty$).\\, • Tiệm cận đứng: $x = 2$ (vì $\\lim_{x \\to 2^+} f(x) = +\\infty$, $\\lim_{x \\to 2^-} f(x) = -\\infty$)."
      },
      tikz: "\\begin{tikzpicture}[scale=0.85]\n  \\tkzTabInit[lgt=1.2,espcl=2.5]{$x$/1,$y'$/1,$y$/2}{$-\\infty$,$2$,$+\\infty$}\n  \\tkzTabLine{,-,d,-,}\n  \\tkzTabVar{+/$1$, -D+ / $-\\infty$ / $+\\infty$, -/$-1$}\n\\end{tikzpicture}",
      options: [
        "$2$",
        "$1$",
        "$3$ (gồm $2$ TCN $y = 1, y = -1$ và $1$ TCĐ $x = 2$)",
        "$4$"
      ],
      correctAnswerIndex: 2,
      solution: "Từ BBT:\n• $\\lim_{x \\to -\\infty} f(x) = 1 \\Rightarrow y = 1$ là đường tiệm cận ngang.\n• $\\lim_{x \\to +\\infty} f(x) = -1 \\Rightarrow y = -1$ là đường tiệm cận ngang.\n• $\\lim_{x \\to 2^+} f(x) = +\\infty$ (và $\\lim_{x \\to 2^-} f(x) = -\\infty$) $\\Rightarrow x = 2$ là đường tiệm cận đứng.\nTổng cộng đồ thị hàm số có $2 + 1 = 3$ đường tiệm cận (hàm số nghịch biến trên từng khoảng xác định, không có cực trị)."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Đồ thị hàm số $y = \\frac{2x^2}{x^2 - 1}$ có tất cả bao nhiêu đường tiệm cận (đứng và ngang)?",
      diagram: {
        type: 'asymptote_graph',
        title: 'Đồ thị hàm số y = 2x² / (x² - 1) (Hình 1.26 SGK tr.25)',
        graphId: 'rational_1_26',
        description: 'TCN: y = 2; hai TCĐ: x = -1 và x = 1 (Bài tập 1.16 SGK tr.25)'
      },
      tikz: "\\begin{tikzpicture}[scale=0.75,>=stealth]\n  \\draw[->] (-3.5,0) -- (3.5,0) node[below] {$x$};\n  \\draw[->] (0,-1) -- (0,4.5) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,orange] (-1,-1) -- (-1,4.5) node[above] {$x=-1$};\n  \\draw[dashed,thick,orange] (1,-1) -- (1,4.5) node[above] {$x=1$};\n  \\draw[dashed,thick,cyan] (-3.5,2) -- (3.5,2) node[right] {$y=2$};\n  \\draw[thick,pink,domain=-3.5:-1.15,smooth] plot (\\x,{(2*\\x*\\x)/(\\x*\\x-1)});\n  \\draw[thick,pink,domain=-0.85:0.85,smooth] plot (\\x,{(2*\\x*\\x)/(\\x*\\x-1)});\n  \\draw[thick,pink,domain=1.15:3.5,smooth] plot (\\x,{(2*\\x*\\x)/(\\x*\\x-1)});\n\\end{tikzpicture}",
      options: [
        "$3$",
        "$2$",
        "$1$",
        "$4$"
      ],
      correctAnswerIndex: 0,
      solution: "Tiệm cận ngang: $\\lim_{x \\to \\pm\\infty} \\frac{2x^2}{x^2 - 1} = 2 \\Rightarrow y = 2$ (1 TCN). Tiệm cận đứng: $x^2 - 1 = 0 \\Leftrightarrow x = 1$ hoặc $x = -1$ (2 TCĐ). Tổng số đường tiệm cận là $1 + 2 = 3$ (Bài tập 1.16 SGK tr.25)."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Đường thẳng $x = 1$ có phải là tiệm cận đứng của đồ thị hàm số $y = \\frac{x^2 + 2x - 3}{x - 1}$ hay không?",
      options: [
        "Có, vì mẫu số bằng $0$ khi $x = 1$.",
        "Có, vì hàm số không xác định tại $x = 1$.",
        "Không, vì $\\lim_{x \\to 1} y = 4$ là một số hữu hạn, đồ thị không có tiệm cận đứng.",
        "Không, vì đường tiệm cận đứng phải là $y = 1$."
      ],
      correctAnswerIndex: 2,
      solution: "Ta có $x^2 + 2x - 3 = (x - 1)(x + 3)$. Với mọi $x \\neq 1$, $y = x + 3$. Giới hạn $\\lim_{x \\to 1} y = \\lim_{x \\to 1}(x + 3) = 4$ (hữu hạn). Vì không có giới hạn vô cực khi $x \\to 1$ nên $x = 1$ không phải là tiệm cận đứng (Bài tập 1.17 SGK tr.25)."
    },
    {
      id: 9,
      level: 'Vận dụng',
      question: "Tọa độ giao điểm $I$ của đường tiệm cận đứng và đường tiệm cận ngang của đồ thị hàm số $y = \\frac{2x + 1}{x - 3}$ là:",
      options: [
        "$I(-3; 2)$",
        "$I(3; 1)$",
        "$I(2; 3)$",
        "$I(3; 2)$"
      ],
      correctAnswerIndex: 3,
      solution: "Tiệm cận đứng là $x = 3$, tiệm cận ngang là $y = 2$. Giao điểm của hai đường tiệm cận là $I(3; 2)$."
    },
    {
      id: 10,
      level: 'Vận dụng',
      question: "Tìm các đường tiệm cận ngang của đồ thị hàm số $y = \\frac{\\sqrt{x^2 + 1}}{x}$.",
      diagram: {
        type: 'asymptote_graph',
        title: 'Đồ thị hàm số y = √(x²+1)/x (Hình 1.21 SGK tr.21)',
        graphId: 'sqrt_1_21',
        description: 'TCN: y = 1 (khi x → +∞) và y = -1 (khi x → -∞)'
      },
      tikz: "\\begin{tikzpicture}[scale=0.8,>=stealth]\n  \\draw[->] (-3.5,0) -- (3.5,0) node[below] {$x$};\n  \\draw[->] (0,-3) -- (0,3) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,cyan] (-3.5,1) -- (3.5,1) node[right] {$y=1$};\n  \\draw[dashed,thick,cyan] (-3.5,-1) -- (3.5,-1) node[right] {$y=-1$};\n  \\draw[thick,blue,domain=0.3:3.5,smooth] plot (\\x,{ sqrt(\\x*\\x+1)/\\x });\n  \\draw[thick,blue,domain=-3.5:-0.3,smooth] plot (\\x,{ -sqrt(\\x*\\x+1)/abs(\\x) });\n\\end{tikzpicture}",
      options: [
        "Chỉ có một đường thẳng $y = 1$",
        "Hai đường thẳng $y = 1$ và $y = -1$",
        "Chỉ có một đường thẳng $y = -1$",
        "Không có tiệm cận ngang"
      ],
      correctAnswerIndex: 1,
      solution: "Khi $x \\to +\\infty$: $\\lim_{x \\to +\\infty} \\frac{\\sqrt{x^2+1}}{x} = \\lim_{x \\to +\\infty} \\sqrt{1 + \\frac{1}{x^2}} = 1 \\Rightarrow y = 1$.\nKhi $x \\to -\\infty$: $\\lim_{x \\to -\\infty} \\frac{\\sqrt{x^2+1}}{x} = \\lim_{x \\to -\\infty} \\left(-\\sqrt{1 + \\frac{1}{x^2}}\\right) = -1 \\Rightarrow y = -1$ (Ví dụ 2 SGK tr.21)."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Đường tiệm cận xiên của đồ thị hàm số $y = \\frac{x^2 - 4x + 2}{1 - x}$ là:",
      options: [
        "$y = -x + 3$",
        "$y = x - 3$",
        "$y = -x - 3$",
        "$y = x + 3$"
      ],
      correctAnswerIndex: 0,
      solution: "Chia đa thức: $x^2 - 4x + 2 = (1 - x)(-x + 3) - 1 \\Rightarrow y = -x + 3 - \\frac{1}{1-x}$. Vì $\\lim_{x \\to \\pm\\infty} [y - (-x + 3)] = 0$, nên tiệm cận xiên là $y = -x + 3$ (Luyện tập 3 SGK tr.24)."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Cho hàm số $y = \\frac{2x - 1}{x - 1}$. Khoảng cách từ gốc tọa độ $O(0; 0)$ đến giao điểm $I$ của hai đường tiệm cận của đồ thị hàm số bằng:",
      options: [
        "$5$",
        "$\\sqrt{5}$",
        "$\\sqrt{3}$",
        "$3$"
      ],
      correctAnswerIndex: 1,
      solution: "Tiệm cận đứng là $x = 1$, tiệm cận ngang là $y = 2$. Giao điểm $I(1; 2)$. Khoảng cách $OI = \\sqrt{1^2 + 2^2} = \\sqrt{5}$."
    },
    {
      id: 13,
      level: 'Vận dụng cao',
      question: "Để loại bỏ $p$% một loại tảo độc khỏi hồ nước, chi phí ước tính là $C(p) = \\frac{45p}{100 - p}$ (triệu đồng, $0 \\le p < 100$). Đường tiệm cận đứng $p = 100$ nói lên ý nghĩa thực tiễn gì?",
      options: [
        "Chi phí cần thiết để làm sạch hồ nước luôn cố định là $45$ triệu đồng.",
        "Cần tối đa $100$ ngày để loại bỏ hoàn toàn tảo độc khỏi hồ.",
        "Chi phí tiến tới vô cùng lớn khi muốn loại bỏ gần như hoàn toàn ($100$%) chất độc, nghĩa là trên thực tế không thể loại bỏ $100$% chất độc.",
        "Hồ nước chỉ chứa tối đa $100$ kg chất độc."
      ],
      correctAnswerIndex: 2,
      solution: "Vì $\\lim_{p \\to 100^-} C(p) = \\lim_{p \\to 100^-} \\frac{45p}{100-p} = +\\infty$, nên chi phí bỏ ra tăng vọt tới vô cực khi mức độ làm sạch tiến sát $100$%. Điều này giải thích trên thực tế không thể loại bỏ tuyệt đối $100$% độc tố (Vận dụng 2 SGK tr.22)."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Một công ty sản xuất đồ gia dụng có hàm chi phí $C(x) = 2x + 50$ (triệu đồng) cho $x$ sản phẩm. Chi phí sản xuất trung bình cho mỗi sản phẩm là $f(x) = \\frac{C(x)}{x} = \\frac{2x + 50}{x}$ ($x > 0$). Khi số sản phẩm sản xuất $x \\to +\\infty$, chi phí trung bình tiệm cận đến mức nào?",
      options: [
        "$50$ triệu đồng / sản phẩm",
        "$0$ đồng",
        "$25$ triệu đồng / sản phẩm",
        "$2$ triệu đồng / sản phẩm"
      ],
      correctAnswerIndex: 3,
      solution: "Ta có $\\lim_{x \\to +\\infty} f(x) = \\lim_{x \\to +\\infty} \\frac{2x + 50}{x} = 2$. Điều này có nghĩa khi quy mô sản xuất tăng rất lớn, chi phí sản xuất trung bình của mỗi sản phẩm sẽ tiến dần về mức tối thiểu $2$ triệu đồng (tiệm cận ngang $y = 2$) (Bài tập 1.19 SGK tr.25)."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Tìm tất cả các giá trị thực của tham số $m$ để đồ thị hàm số $y = \\frac{x + 1}{x^2 - 2mx + 9}$ có đúng hai đường tiệm cận đứng.",
      options: [
        "$m > 3$ hoặc ($m < -3$ và $m \\neq -5$)",
        "$-3 < m < 3$",
        "$m > 3$ hoặc $m < -3$",
        "$m = 3$ hoặc $m = -3$"
      ],
      correctAnswerIndex: 0,
      solution: "Đồ thị có 2 tiệm cận đứng khi và chỉ khi mẫu $g(x) = x^2 - 2mx + 9 = 0$ có 2 nghiệm phân biệt khác nghiệm tử $x = -1$.\n1) $\\Delta' = m^2 - 9 > 0 \\Leftrightarrow m > 3$ hoặc $m < -3$.\n2) $g(-1) = (-1)^2 - 2m(-1) + 9 = 2m + 10 \\neq 0 \\Leftrightarrow m \\neq -5$.\nKết hợp lại: $m > 3$ hoặc ($m < -3$ và $m \\neq -5$)."
    }
  ],

  // =========================================================================
  // BỘ ĐỀ 2: KĨ NĂNG TÍNH TOÁN & ĐỌC BẢNG BIẾN THIÊN / ĐỒ THỊ
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$. Nếu $\\lim_{x \\to +\\infty} \\frac{f(x)}{x} = a \\neq 0$ và $\\lim_{x \\to +\\infty} [f(x) - ax] = b$ thì đường thẳng nào là tiệm cận xiên của đồ thị hàm số khi $x \\to +\\infty$?",
      options: [
        "$y = ax - b$",
        "$y = ax + b$",
        "$y = bx + a$",
        "$x = a$"
      ],
      correctAnswerIndex: 1,
      solution: "Theo định lí tìm tiệm cận xiên (SGK trang 24): Nếu $a = \\lim_{x \\to +\\infty} \\frac{f(x)}{x} \\neq 0$ và $b = \\lim_{x \\to +\\infty} [f(x) - ax]$ thì đường thẳng $y = ax + b$ là tiệm cận xiên của đồ thị hàm số khi $x \\to +\\infty$."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Đường tiệm cận đứng của đồ thị hàm số $y = \\frac{3 - x}{x + 2}$ là đường thẳng:",
      options: [
        "$x = 3$",
        "$y = -1$",
        "$x = -2$",
        "$y = 3$"
      ],
      correctAnswerIndex: 2,
      solution: "Mẫu số triệt tiêu tại $x = -2$ và tử số $3 - (-2) = 5 \\neq 0$. Do $\\lim_{x \\to (-2)^+} y = +\\infty$, tiệm cận đứng là $x = -2$ (Ví dụ 3 SGK tr.22)."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{1 - 4x}{2x + 3}$ là đường thẳng:",
      options: [
        "$y = 2$",
        "$y = \\frac{1}{2}$",
        "$x = -\\frac{3}{2}$",
        "$y = -2$"
      ],
      correctAnswerIndex: 3,
      solution: "Ta có $\\lim_{x \\to \\pm\\infty} \\frac{1 - 4x}{2x + 3} = \\frac{-4}{2} = -2$. Vậy tiệm cận ngang là đường thẳng $y = -2$."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Cho hàm số $y = x - 1 + \\frac{2}{x + 1}$. Tiệm cận xiên của đồ thị hàm số là đường thẳng:",
      options: [
        "$y = x - 1$",
        "$y = x + 1$",
        "$y = x$",
        "$x = -1$"
      ],
      correctAnswerIndex: 0,
      solution: "Vì $\\lim_{x \\to \\pm\\infty} [y - (x - 1)] = \\lim_{x \\to \\pm\\infty} \\frac{2}{x+1} = 0$, nên đường tiệm cận xiên là $y = x - 1$ (HĐ3 SGK tr.23)."
    },
    {
      id: 5,
      level: 'Thông hiểu',
      question: "Cho hàm số $y = f(x)$ xác định trên $\\mathbb{R} \\setminus \\{1; 3\\}$, có bảng biến thiên dưới đây. Khẳng định nào sau đây SAI?",
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên bài 1.37 SGK Toán 12 (trang 43)',
        bbtPreset: 'set2_q5',
        xValues: ["-\\infty", "1", "2", "3", "+\\infty"],
        yPrimeSigns: ["-", "||", "-", "0", "+", "||", "+"],
        yValues: [
          { val: "1", pos: "top" },
          { val: "-1", pos: "bottom" },
          { val: "||", pos: "mid", isDoubleBar: true },
          { val: "7", pos: "top" },
          { val: "5", pos: "bottom" },
          { val: "+\\infty", pos: "top" },
          { val: "||", pos: "mid", isDoubleBar: true },
          { val: "-4", pos: "bottom" },
          { val: "-1", pos: "top" }
        ],
        notes: "• Tiệm cận ngang: $y = 1$ (khi $x \\to -\\infty$), $y = -1$ (khi $x \\to +\\infty$).\\, • Tiệm cận đứng: $x = 3$.\\, • Điểm cực tiểu: $x_{\\text{CT}} = 2$, giá trị cực tiểu: $y_{\\text{CT}} = 5$."
      },
      tikz: "\\begin{tikzpicture}[scale=0.85]\n  \\tkzTabInit[lgt=1.5,espcl=2]{$x$/1,$y'$/1,$y$/2}{$-\\infty$,$1$,$2$,$3$,$+\\infty$}\n  \\tkzTabLine{,-,d,-,0,+,d,+,}\n  \\tkzTabVar{+/$1$, -D+ / $-1$ / $7$, -/$5$, +D- / $+\\infty$ / $-4$, +/$-1$}\n\\end{tikzpicture}",
      options: [
        "Đường thẳng $y = 1$ là tiệm cận ngang của đồ thị hàm số.",
        "Đường thẳng $x = 1$ là tiệm cận đứng của đồ thị hàm số đã cho.",
        "Đường thẳng $y = -1$ là tiệm cận ngang của đồ thị hàm số.",
        "Đường thẳng $x = 3$ là tiệm cận đứng của đồ thị hàm số."
      ],
      correctAnswerIndex: 1,
      solution: "Quan sát BBT (Bài 1.37 SGK tr.43):\n• Tiệm cận ngang: $\\lim_{x \\to -\\infty} f(x) = 1 \\Rightarrow y = 1$ là TCN; $\\lim_{x \\to +\\infty} f(x) = -1 \\Rightarrow y = -1$ là TCN.\n• Tiệm cận đứng: $\\lim_{x \\to 3^-} f(x) = +\\infty \\Rightarrow x = 3$ là TCĐ.\n• Tại $x = 1$: $\\lim_{x \\to 1^-} f(x) = -1$ và $\\lim_{x \\to 1^+} f(x) = 7$ (cả hai giới hạn một bên đều là số hữu hạn, không có vô cực) nên $x = 1$ KHÔNG phải là tiệm cận đứng. Vì vậy khẳng định '$x = 1$ là tiệm cận đứng' là khẳng định SAI.\n• Về cực trị: Hàm số đạt cực tiểu tại điểm $x_{\\text{CT}} = 2$ với giá trị cực tiểu là $y_{\\text{CT}} = 5$."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Đồ thị hàm số $y = \\frac{x^2 + 2}{x}$ có bao nhiêu đường tiệm cận?",
      diagram: {
        type: 'asymptote_graph',
        title: 'Đồ thị hàm số y = (x² + 2)/x (Ví dụ 4 SGK tr.22)',
        graphId: 'rational_ex4',
        description: 'TCĐ: x = 0 (trục tung Oy), TCX: y = x. Cực tiểu tại A(√2; 2√2) với y_CT = 2√2, cực đại tại B(-√2; -2√2) với y_CĐ = -2√2'
      },
      tikz: "\\begin{tikzpicture}[scale=0.75,>=stealth]\n  \\draw[->] (-3.5,0) -- (3.5,0) node[below] {$x$};\n  \\draw[->] (0,-4) -- (0,4) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,orange] (0,-4) -- (0,4) node[left] {$x=0$};\n  \\draw[dashed,thick,purple,domain=-3:3] plot (\\x,{\\x}) node[right] {$y=x$};\n  \\draw[thick,teal,domain=0.5:3.2,smooth] plot (\\x,{(\\x*\\x+2)/\\x});\n  \\draw[thick,teal,domain=-3.2:-0.5,smooth] plot (\\x,{(\\x*\\x+2)/\\x});\n  \\fill[yellow] (1.414,2.828) circle (2pt) node[right] {$A(\\sqrt{2}; 2\\sqrt{2})$};\n  \\fill[yellow] (-1.414,-2.828) circle (2pt) node[left] {$B(-\\sqrt{2}; -2\\sqrt{2})$};\n\\end{tikzpicture}",
      options: [
        "$1$ (chỉ có tiệm cận đứng $x = 0$)",
        "$2$ (gồm $1$ tiệm cận đứng $x = 0$ và $1$ tiệm cận ngang $y = 1$)",
        "$2$ (gồm $1$ tiệm cận đứng $x = 0$ và $1$ tiệm cận xiên $y = x$)",
        "$0$ (không có tiệm cận nào)"
      ],
      correctAnswerIndex: 2,
      solution: "Viết $y = x + \\frac{2}{x}$. Khi $x \\to 0^{\\pm} \\Rightarrow y \\to \\pm\\infty \\Rightarrow$ TCĐ là đường thẳng $x = 0$. Khi $x \\to \\pm\\infty$, $\\lim_{x \\to \\pm\\infty} [y - x] = \\lim_{x \\to \\pm\\infty} \\frac{2}{x} = 0 \\Rightarrow$ TCX là đường thẳng $y = x$. Tổng cộng đồ thị hàm số có đúng 2 đường tiệm cận. (Đồ thị có điểm cực tiểu $A(\\sqrt{2}; 2\\sqrt{2})$ với giá trị cực tiểu $y_{\\text{CT}} = 2\\sqrt{2}$ và điểm cực đại $B(-\\sqrt{2}; -2\\sqrt{2})$ với giá trị cực đại $y_{\\text{CĐ}} = -2\\sqrt{2}$)."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Tìm các đường tiệm cận ngang của đồ thị hàm số $y = \\frac{\\sqrt{4x^2 + 1} - 1}{x - 2}$.",
      options: [
        "Chỉ có một đường thẳng $y = 2$",
        "Chỉ có một đường thẳng $y = 4$",
        "Không có tiệm cận ngang",
        "Hai đường thẳng $y = 2$ và $y = -2$"
      ],
      correctAnswerIndex: 3,
      solution: "Khi $x \\to +\\infty$: $\\lim_{x \\to +\\infty} y = \\lim_{x \\to +\\infty} \\frac{2x\\sqrt{1+\\frac{1}{4x^2}} - 1}{x - 2} = 2 \\Rightarrow y = 2$.\nKhi $x \\to -\\infty$: $\\lim_{x \\to -\\infty} y = \\lim_{x \\to -\\infty} \\frac{-2x\\sqrt{1+\\frac{1}{4x^2}} - 1}{x - 2} = -2 \\Rightarrow y = -2$."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Đồ thị trong Hình 1.37 SGK (trang 43) có đường tiệm cận đứng $x = -1$ và tiệm cận ngang $y = 2$, đồng thời đi qua điểm $(0; 1)$. Đó là đồ thị của hàm số nào?",
      diagram: {
        type: 'asymptote_graph',
        title: 'Nhận dạng đồ thị hàm phân thức (Hình 1.37 SGK tr.43)',
        graphId: 'hyperbola_1_37',
        description: 'TCĐ: x = -1, TCN: y = 2, cắt Oy tại (0; 1), cắt Ox tại (-0.5; 0)'
      },
      tikz: "\\begin{tikzpicture}[scale=0.75,>=stealth]\n  \\draw[->] (-3.5,0) -- (3,0) node[below] {$x$};\n  \\draw[->] (0,-2) -- (0,4.5) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,orange] (-1,-2) -- (-1,4.5) node[above] {$x=-1$};\n  \\draw[dashed,thick,cyan] (-3.5,2) -- (3,2) node[right] {$y=2$};\n  \\draw[thick,magenta,domain=-3.5:-1.25,smooth] plot (\\x,{(2*\\x+1)/(\\x+1)});\n  \\draw[thick,magenta,domain=-0.75:2.5,smooth] plot (\\x,{(2*\\x+1)/(\\x+1)});\n  \\fill (0,1) circle (1.5pt) node[right] {$(0;1)$};\n\\end{tikzpicture}",
      options: [
        "$y = \\frac{2x + 1}{x + 1}$",
        "$y = \\frac{x + 2}{x + 1}$",
        "$y = \\frac{x - 1}{x + 1}$",
        "$y = \\frac{x + 3}{1 - x}$"
      ],
      correctAnswerIndex: 0,
      solution: "Đồ thị có TCĐ $x = -1$, TCN $y = 2$ và cắt trục tung tại điểm $(0; 1)$.\n- Xét $y = \\frac{2x + 1}{x + 1}$: TCĐ $x = -1$, TCN $y = \\frac{2}{1} = 2$, tại $x = 0 \\Rightarrow y = 1$ (thỏa mãn tất cả các điều kiện) (Bài 1.38 SGK tr.43)."
    },
    {
      id: 9,
      level: 'Vận dụng',
      question: "Tìm tiệm cận xiên của đồ thị hàm số $y = \\frac{x^2 - x + 2}{x + 1}$.",
      options: [
        "$y = x + 2$",
        "$y = x - 2$",
        "$y = x - 1$",
        "$y = x$"
      ],
      correctAnswerIndex: 1,
      solution: "Thực hiện phép chia đa thức: $x^2 - x + 2 = (x + 1)(x - 2) + 4 \\Rightarrow y = x - 2 + \\frac{4}{x+1}$. Do $\\lim_{x \\to \\pm\\infty} \\frac{4}{x+1} = 0$, tiệm cận xiên là $y = x - 2$ (Ví dụ 6 SGK tr.24)."
    },
    {
      id: 10,
      level: 'Vận dụng',
      question: "Cho hàm số $y = \\frac{2x^2 + x - 1}{x + 2}$. Gọi $I$ là giao điểm của đường tiệm cận đứng và đường tiệm cận xiên của đồ thị hàm số. Tọa độ của điểm $I$ là:",
      options: [
        "$I(-2; 1)$",
        "$I(2; 5)$",
        "$I(-2; -7)$",
        "$I(-2; -3)$"
      ],
      correctAnswerIndex: 2,
      solution: "Ta có TCĐ là $x = -2$. Chia đa thức: $2x^2 + x - 1 = (x + 2)(2x - 3) + 5 \\Rightarrow y = 2x - 3 + \\frac{5}{x+2}$. Vậy TCX là $y = 2x - 3$. Thay hoành độ $x = -2$ vào phương trình TCX ta được $y = 2(-2) - 3 = -7$. Do đó giao điểm $I(-2; -7)$."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Tìm giá trị của tham số $m$ để đường tiệm cận ngang của đồ thị hàm số $y = \\frac{mx - 1}{2x + 3}$ đi qua điểm $A(1; 2)$.",
      options: [
        "$m = 2$",
        "$m = -4$",
        "$m = 1$",
        "$m = 4$"
      ],
      correctAnswerIndex: 3,
      solution: "Tiệm cận ngang của đồ thị hàm số là đường thẳng $y = \\frac{m}{2}$. Để đường thẳng này đi qua $A(1; 2)$ thì $\\frac{m}{2} = 2 \\Leftrightarrow m = 4$."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Số đường tiệm cận đứng của đồ thị hàm số $y = \\frac{\\sqrt{x + 4} - 2}{x^2 - x}$ là:",
      options: [
        "$1$ (chỉ có đường thẳng $x = 1$)",
        "$2$ (gồm $x = 0$ và $x = 1$)",
        "$0$",
        "$3$"
      ],
      correctAnswerIndex: 0,
      solution: "ĐKXĐ: $x \\ge -4, x \\neq 0, x \\neq 1$.\n- Tại $x = 0$: Nhân liên hợp ta có $\\lim_{x \\to 0} y = \\lim_{x \\to 0} \\frac{1}{(x-1)(\\sqrt{x+4}+2)} = -\\frac{1}{4}$ (hữu hạn, nên $x=0$ không phải TCĐ).\n- Tại $x = 1$: $\\lim_{x \\to 1^+} y = +\\infty \\Rightarrow x = 1$ là tiệm cận đứng duy nhất."
    },
    {
      id: 13,
      level: 'Vận dụng cao',
      question: "Một mảnh vườn hình chữ nhật có diện tích không đổi bằng $144\\text{ m}^2$. Gọi độ dài một cạnh là $x\\text{ (m)}$ ($x > 0$). Biểu thức tính chu vi mảnh vườn là $P(x) = 2x + \\frac{288}{x}$. Tìm tiệm cận xiên của hàm số $y = P(x)$ và nêu ý nghĩa thực tiễn.",
      options: [
        "Tiệm cận xiên là $y = 288x$. Khi $x$ lớn thì chu vi bằng $288$ lần cạnh dài.",
        "Tiệm cận xiên là $y = 2x$. Khi một cạnh $x$ rất lớn thì chiều rộng $\\frac{144}{x}$ rất nhỏ, chu vi $P(x)$ xấp xỉ bằng $2$ lần cạnh dài ($2x$).",
        "Tiệm cận xiên là $y = x + 144$. Chu vi luôn lớn hơn $144\\text{ m}$.",
        "Tiệm cận xiên là $y = 2x + 144$."
      ],
      correctAnswerIndex: 1,
      solution: "Ta có $P(x) - 2x = \\frac{288}{x} \\to 0$ khi $x \\to +\\infty$, nên tiệm cận xiên là $y = 2x$. Ý nghĩa: khi mảnh vườn được kéo rất dài theo một chiều ($x \\to +\\infty$), cạnh còn lại hẹp dần về $0$, khi đó chu vi mảnh đất xấp xỉ bằng độ dài $2$ cạnh dài ($2x$) (Bài tập 1.20 SGK tr.25)."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Xét một thấu kính hội tụ có tiêu cự $f = 20\\text{ cm}$. Khoảng cách $q$ từ thấu kính đến ảnh liên hệ với khoảng cách vật $p$ theo công thức $q = g(p) = \\frac{20p}{p - 20}$ với $p > 20$. Tiệm cận đứng $p = 20$ và tiệm cận ngang $q = 20$ biểu thị điều gì?",
      options: [
        "Thấu kính chỉ có thể tạo ảnh khi vật đặt cách thấu kính đúng $20\\text{ cm}$.",
        "Khoảng cách ảnh luôn luôn lớn hơn $40\\text{ cm}$.",
        "Khi vật đặt càng gần tiêu điểm ($p \\to 20^+$) thì ảnh ở rất xa vô cực ($q \\to +\\infty$); còn khi vật ở rất xa ($p \\to +\\infty$) thì ảnh hội tụ tại tiêu điểm ($q \\to 20$).",
        "Tiêu cự của thấu kính sẽ thay đổi khi vật di chuyển."
      ],
      correctAnswerIndex: 2,
      solution: "Vì $\\lim_{p \\to 20^+} g(p) = +\\infty$ nên khi vật ở sát tiêu điểm ($p \\to 20$), chùm tia ló song song và ảnh ở vô cực ($q \\to +\\infty$). Vì $\\lim_{p \\to +\\infty} g(p) = 20$ nên khi vật ở rất xa vô cực ($p \\to +\\infty$), ảnh hội tụ đúng tại mặt phẳng tiêu diện ($q = 20\\text{ cm}$) (Bài 1.44 SGK tr.44)."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Tìm tất cả các giá trị thực của tham số $m$ để đồ thị hàm số $y = \\frac{x - 2}{x^2 - 4x + m}$ có đúng một đường tiệm cận đứng.",
      options: [
        "$m < 4$",
        "$m > 4$",
        "$m = 4$ và $m = 0$",
        "$m = 4$"
      ],
      correctAnswerIndex: 3,
      solution: "Để đồ thị có đúng 1 tiệm cận đứng:\n- Trường hợp 1: Mẫu $x^2 - 4x + m = 0$ có nghiệm kép $\\Delta' = 4 - m = 0 \\Leftrightarrow m = 4$. Khi đó $y = \\frac{x-2}{(x-2)^2} = \\frac{1}{x-2}$, có 1 TCĐ là $x = 2$ (thỏa mãn).\n- Trường hợp 2: Mẫu có 2 nghiệm phân biệt trong đó có nghiệm $x = 2$: $2^2 - 4(2) + m = 0 \\Leftrightarrow m = 4$ (trùng TH1).\n- Trường hợp 3: Mẫu vô nghiệm $\\Delta' < 0 \\Leftrightarrow m > 4 \\Rightarrow$ không có tiệm cận đứng nào.\nVậy giá trị duy nhất cần tìm là $m = 4$."
    }
  ],

  // =========================================================================
  // BỘ ĐỀ 3: PHÂN TÍCH PHÂN THỨC & TIỆM CẬN XIÊN
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Đồ thị của hàm số nào sau đây KHÔNG có đường tiệm cận ngang?",
      options: [
        "$y = \\frac{2x - 1}{x + 1}$",
        "$y = \\frac{x^2 - 2x + 3}{x - 1}$",
        "$y = \\frac{3}{x^2 + 1}$",
        "$y = \\frac{4x^2 + 1}{2x^2 - 3}$"
      ],
      correctAnswerIndex: 1,
      solution: "Hàm số $y = \\frac{x^2 - 2x + 3}{x - 1}$ có bậc tử (bậc 2) lớn hơn bậc mẫu (bậc 1) nên $\\lim_{x \\to \\pm\\infty} y = \\pm\\infty$, không có tiệm cận ngang (hàm số này có tiệm cận xiên $y = x - 1$)."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Đường tiệm cận đứng của đồ thị hàm số $y = \\frac{5}{2x - 6}$ là:",
      options: [
        "$x = -3$",
        "$y = 0$",
        "$x = 3$",
        "$y = \\frac{5}{2}$"
      ],
      correctAnswerIndex: 2,
      solution: "Cho mẫu số bằng $0$: $2x - 6 = 0 \\Leftrightarrow x = 3$. Do $\\lim_{x \\to 3^+} \\frac{5}{2x-6} = +\\infty$, tiệm cận đứng là $x = 3$."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{x^2 - 3x + 2}{2x^2 + 5}$ là:",
      options: [
        "$y = 1$",
        "$y = 2$",
        "$y = 0$",
        "$y = \\frac{1}{2}$"
      ],
      correctAnswerIndex: 3,
      solution: "Bậc tử bằng bậc mẫu, ta có $\\lim_{x \\to \\pm\\infty} \\frac{x^2 - 3x + 2}{2x^2 + 5} = \\frac{1}{2}$. Vậy tiệm cận ngang là $y = \\frac{1}{2}$."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Đường tiệm cận xiên của đồ thị hàm số $y = 3x + 2 - \\frac{4}{x - 1}$ là:",
      options: [
        "$y = 3x + 2$",
        "$y = 3x - 2$",
        "$y = -3x + 2$",
        "$x = 1$"
      ],
      correctAnswerIndex: 0,
      solution: "Vì $\\lim_{x \\to \\pm\\infty} [y - (3x + 2)] = \\lim_{x \\to \\pm\\infty} \\left(-\\frac{4}{x-1}\\right) = 0$, nên đường tiệm cận xiên là $y = 3x + 2$."
    },
    {
      id: 5,
      level: 'Thông hiểu',
      question: "Tọa độ tâm đối xứng $I$ (giao điểm của hai đường tiệm cận) của đồ thị hàm số $y = \\frac{3x + 1}{x - 2}$ là:",
      diagram: {
        type: 'asymptote_graph',
        title: 'Tâm đối xứng I(2; 3) của đồ thị y = (3x+1)/(x-2)',
        graphId: 'hyperbola_set3_q5',
        description: 'TCĐ: x = 2, TCN: y = 3, giao điểm I(2; 3) là tâm đối xứng của đồ thị'
      },
      tikz: "\\begin{tikzpicture}[scale=0.75,>=stealth]\n  \\draw[->] (-2,0) -- (5,0) node[below] {$x$};\n  \\draw[->] (0,-1) -- (0,5.5) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,orange] (2,-1) -- (2,5.5) node[above] {$x=2$};\n  \\draw[dashed,thick,cyan] (-2,3) -- (5,3) node[right] {$y=3$};\n  \\fill[red] (2,3) circle (2pt) node[above right] {$I(2;3)$};\n  \\draw[thick,blue,domain=-2:1.6,smooth] plot (\\x,{(3*\\x+1)/(\\x-2)});\n  \\draw[thick,blue,domain=2.4:5,smooth] plot (\\x,{(3*\\x+1)/(\\x-2)});\n\\end{tikzpicture}",
      options: [
        "$I(-2; 3)$",
        "$I(2; 3)$",
        "$I(2; -3)$",
        "$I(3; 2)$"
      ],
      correctAnswerIndex: 1,
      solution: "Tiệm cận đứng là $x = 2$, tiệm cận ngang là $y = 3$. Tâm đối xứng là giao điểm của hai tiệm cận $I(2; 3)$."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Tìm đường tiệm cận xiên của đồ thị hàm số $y = \\frac{2x^2 - 3x + 5}{x - 2}$.",
      options: [
        "$y = 2x - 1$",
        "$y = 2x - 3$",
        "$y = 2x + 1$",
        "$y = x + 1$"
      ],
      correctAnswerIndex: 2,
      solution: "Chia tử cho mẫu: $2x^2 - 3x + 5 = (x - 2)(2x + 1) + 7 \\Rightarrow y = 2x + 1 + \\frac{7}{x - 2}$. Suy ra tiệm cận xiên là $y = 2x + 1$."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Tìm tiệm cận xiên khi $x \\to +\\infty$ của đồ thị hàm số $y = \\sqrt{x^2 + 2x + 3}$.",
      options: [
        "$y = x - 1$",
        "$y = -x - 1$",
        "$y = x + 2$",
        "$y = x + 1$"
      ],
      correctAnswerIndex: 3,
      solution: "Ta có $a = \\lim_{x \\to +\\infty} \\frac{\\sqrt{x^2+2x+3}}{x} = 1$.\n$b = \\lim_{x \\to +\\infty} [\\sqrt{x^2+2x+3} - x] = \\lim_{x \\to +\\infty} \\frac{2x+3}{\\sqrt{x^2+2x+3}+x} = \\frac{2}{2} = 1$.\nVậy tiệm cận xiên khi $x \\to +\\infty$ là $y = x + 1$."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Tổng số đường tiệm cận (đứng và ngang) của đồ thị hàm số $y = \\frac{x - 1}{\\sqrt{x^2 - 1}}$ là:",
      diagram: {
        type: 'asymptote_graph',
        title: 'Đồ thị có 3 tiệm cận y = (x-1)/√(x²-1)',
        graphId: 'sqrt_set3_q8',
        description: 'TCĐ: x = -1, hai TCN: y = 1 (khi x → +∞) và y = -1 (khi x → -∞)'
      },
      tikz: "\\begin{tikzpicture}[scale=0.8,>=stealth]\n  \\draw[->] (-4,0) -- (4,0) node[below] {$x$};\n  \\draw[->] (0,-3) -- (0,3) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,orange] (-1,-3) -- (-1,3) node[above] {$x=-1$};\n  \\draw[dashed,thick,cyan] (-4,1) -- (4,1) node[right] {$y=1$};\n  \\draw[dashed,thick,cyan] (-4,-1) -- (4,-1) node[right] {$y=-1$};\n  \\draw[thick,purple,domain=-4:-1.08,smooth] plot (\\x,{ (\\x-1)/sqrt(\\x*\\x-1) });\n  \\draw[thick,purple,domain=1.05:4,smooth] plot (\\x,{ (\\x-1)/sqrt(\\x*\\x-1) });\n\\end{tikzpicture}",
      options: [
        "$3$ (gồm $x = -1, y = 1, y = -1$)",
        "$2$",
        "$4$",
        "$1$"
      ],
      correctAnswerIndex: 0,
      solution: "TXĐ: $D = (-\\infty; -1) \\cup (1; +\\infty)$.\n- TCĐ: Tại $x = -1$, $\\lim_{x \\to (-1)^-} \\frac{x-1}{\\sqrt{x^2-1}} = -\\infty \\Rightarrow x = -1$ là TCĐ. Tại $x = 1$, $\\lim_{x \\to 1^+} \\frac{x-1}{\\sqrt{x^2-1}} = 0$ (không có TCĐ $x=1$).\n- TCN: $\\lim_{x \\to +\\infty} y = 1 \\Rightarrow y = 1$; $\\lim_{x \\to -\\infty} y = -1 \\Rightarrow y = -1$.\nTổng cộng có 3 đường tiệm cận."
    },
    {
      id: 9,
      level: 'Vận dụng',
      question: "Đồ thị hàm số $y = \\frac{x^2 - x + 2}{x - 1}$ có tiệm cận xiên là $d$. Diện tích của tam giác tạo bởi $d$ và hai trục tọa độ bằng:",
      options: [
        "$1$",
        "$0$ (vì đường tiệm cận xiên $y = x$ đi qua gốc toạ độ $O$)",
        "$2$",
        "$\\frac{1}{2}$"
      ],
      correctAnswerIndex: 1,
      solution: "Chia tử cho mẫu: $y = x + \\frac{2}{x-1}$, do đó tiệm cận xiên là $d: y = x$. Vì $d$ đi qua gốc tọa độ $O(0;0)$ nên $d$ cắt hai trục tọa độ tại chính gốc $O$, do đó tam giác tạo thành suy biến có diện tích bằng $0$."
    },
    {
      id: 10,
      level: 'Vận dụng',
      question: "Cho hàm số $y = \\frac{3x^2 - 2x + 1}{x + 1}$. Tọa độ giao điểm của tiệm cận xiên và trục hoành $Ox$ là:",
      options: [
        "$(-\\frac{5}{3}; 0)$",
        "$(0; -5)$",
        "$(\\frac{5}{3}; 0)$",
        "$(1; 0)$"
      ],
      correctAnswerIndex: 2,
      solution: "Chia đa thức: $3x^2 - 2x + 1 = (x + 1)(3x - 5) + 6 \\Rightarrow y = 3x - 5 + \\frac{6}{x+1}$. Tiệm cận xiên là $y = 3x - 5$. Giao điểm với trục hoành $Ox$ ($y = 0$) là $3x - 5 = 0 \\Leftrightarrow x = \\frac{5}{3}$. Tọa độ là $(\\frac{5}{3}; 0)$."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Tìm giá trị của tham số $m$ để tiệm cận đứng và tiệm cận ngang của đồ thị hàm số $y = \\frac{2x - m}{x + 1}$ cùng với hai trục tọa độ tạo thành một hình chữ nhật có diện tích bằng $4$.",
      options: [
        "$m = 2$",
        "$m = 4$",
        "$m = -4$",
        "Mọi giá trị $m \\neq -2$ đều thỏa mãn diện tích bằng $2$, không thể tạo ra diện tích bằng $4$."
      ],
      correctAnswerIndex: 3,
      solution: "Tiệm cận đứng là $x = -1$, tiệm cận ngang là $y = 2$. Bốn đường thẳng $x = -1, x = 0, y = 2, y = 0$ tạo thành hình chữ nhật có các kích thước $1$ và $2$, nên diện tích luôn bằng $1 \\times 2 = 2$ (không phụ thuộc vào $m$). Do đó không có giá trị $m$ nào để diện tích bằng $4$."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Góc tạo bởi đường tiệm cận xiên của đồ thị hàm số $y = \\frac{\\sqrt{3}x^2 + 2x - 1}{x + 1}$ và trục hoành $Ox$ bằng:",
      options: [
        "$60^{\\circ}$",
        "$30^{\\circ}$",
        "$45^{\\circ}$",
        "$90^{\\circ}$"
      ],
      correctAnswerIndex: 0,
      solution: "Chia đa thức: $y = \\sqrt{3}x + (2 - \\sqrt{3}) + \\frac{\\sqrt{3}-3}{x+1}$. Hệ số góc của tiệm cận xiên là $k = \\sqrt{3}$. Ta có $\\tan \\alpha = k = \\sqrt{3} \\Rightarrow \\alpha = 60^{\\circ}$."
    },
    {
      id: 13,
      level: 'Vận dụng cao',
      question: "Nồng độ muối trong một bể nuôi hải sản sau $t$ phút pha thêm nước biển nhân tạo được tính theo công thức $C(t) = \\frac{30t + 50}{t + 100}$ (gam/lít, $t \\ge 0$). Nồng độ muối trong bể sẽ tiến dần tới giá trị nào khi thời gian $t \\to +\\infty$?",
      options: [
        "$50$ g/lít",
        "$30$ g/lít",
        "$0{,}5$ g/lít",
        "$100$ g/lít"
      ],
      correctAnswerIndex: 1,
      solution: "Ta có $\\lim_{t \\to +\\infty} C(t) = \\lim_{t \\to +\\infty} \\frac{30t + 50}{t + 100} = 30$. Điều này có nghĩa sau thời gian rất dài, nồng độ muối trong bể sẽ ổn định và tiệm cận đến mức $30$ g/lít (tiệm cận ngang $y = 30$)."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Khối lượng còn lại của một chất phóng xạ sau $t$ ngày phân rã được mô tả bởi hàm số $m(t) = 15e^{-0,012t}$ (gam). Đường tiệm cận ngang $y = 0$ của đồ thị hàm số $m(t)$ thể hiện điều gì?",
      options: [
        "Khối lượng chất phóng xạ giảm dần theo thời gian và sẽ tiến gần về $0$ gam khi thời gian $t$ đủ lớn ($t \\to +\\infty$).",
        "Sau đúng $15$ ngày chất phóng xạ sẽ phân rã hết.",
        "Ban đầu khối lượng chất phóng xạ là $0$ gam.",
        "Tốc độ phân rã luôn là một hằng số không đổi."
      ],
      correctAnswerIndex: 0,
      solution: "Vì $\\lim_{t \\to +\\infty} 15e^{-0,012t} = 0$, nên đồ thị có tiệm cận ngang là trục hoành $y = 0$. Thể hiện rằng sau khoảng thời gian rất dài, lượng chất phóng xạ còn lại sẽ tiêu biến dần về $0$ (Hình 1.18 SGK tr.20)."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Tìm giá trị của tham số $m$ để đồ thị hàm số $y = \\frac{x^2 + mx - 1}{x - 1}$ có đường tiệm cận xiên đi qua điểm $M(2; 5)$.",
      options: [
        "$m = 3$",
        "$m = -2$",
        "$m = 2$",
        "$m = 1$"
      ],
      correctAnswerIndex: 2,
      solution: "Chia tử cho mẫu: $x^2 + mx - 1 = (x - 1)(x + m + 1) + m \\Rightarrow y = x + m + 1 + \\frac{m}{x-1}$.\nTiệm cận xiên là đường thẳng $y = x + m + 1$.\nĐể tiệm cận xiên đi qua $M(2; 5)$ thì: $5 = 2 + m + 1 \\Leftrightarrow m = 2$."
    }
  ],

  // =========================================================================
  // BỘ ĐỀ 4: ĐỒ THỊ NÂNG CAO & THAM SỐ M
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ có bảng biến thiên dưới đây. Đồ thị hàm số có bao nhiêu đường tiệm cận ngang?",
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = f(x)',
        bbtPreset: 'set4_q1',
        xValues: ["-\\infty", "0", "+\\infty"],
        yPrimeSigns: ["+", "0", "-"],
        yValues: [],
        notes: "• Tiệm cận ngang: $y = 3$ (khi $x \\to -\\infty$) và $y = -2$ (khi $x \\to +\\infty$).\\, • Điểm cực đại: $x_{\\text{CĐ}} = 0$, giá trị cực đại: $y_{\\text{CĐ}} = 5$."
      },
      tikz: "\\begin{tikzpicture}[scale=0.85]\n  \\tkzTabInit[lgt=1.2,espcl=2.5]{$x$/1,$y'$/1,$y$/2}{$-\\infty$,$0$,$+\\infty$}\n  \\tkzTabLine{,+,0,-,}\n  \\tkzTabVar{-/$3$, +/$5$, -/$-2$}\n\\end{tikzpicture}",
      options: [
        "$1$",
        "$2$ (gồm $y = 3$ và $y = -2$)",
        "$0$",
        "Vô số"
      ],
      correctAnswerIndex: 1,
      solution: "Từ BBT:\n• Khi $x \\to -\\infty \\Rightarrow f(x) \\to 3 \\Rightarrow y = 3$ là đường tiệm cận ngang.\n• Khi $x \\to +\\infty \\Rightarrow f(x) \\to -2 \\Rightarrow y = -2$ là đường tiệm cận ngang.\nVậy đồ thị hàm số có đúng $2$ đường tiệm cận ngang là $y = 3$ và $y = -2$.\n(Lưu ý về cực trị: Tại điểm $x_{\\text{CĐ}} = 0$, hàm số đạt cực đại với giá trị cực đại $y_{\\text{CĐ}} = 5$)."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Cho hàm số $y = f(x)$ có $\\lim_{x \\to 2^+} f(x) = -\\infty$ và $\\lim_{x \\to 2^-} f(x) = 5$. Khẳng định nào sau đây ĐÚNG?",
      options: [
        "Đường thẳng $y = 2$ là đường tiệm cận ngang của đồ thị hàm số.",
        "Đường thẳng $x = 5$ là đường tiệm cận đứng của đồ thị hàm số.",
        "Đường thẳng $x = 2$ là đường tiệm cận đứng của đồ thị hàm số.",
        "Đồ thị hàm số không có tiệm cận đứng."
      ],
      correctAnswerIndex: 2,
      solution: "Theo định nghĩa: Chỉ cần một trong các giới hạn một bên khi $x \\to x_0$ bằng $\\pm\\infty$ thì $x = x_0$ là tiệm cận đứng. Ở đây $\\lim_{x \\to 2^+} f(x) = -\\infty$ nên $x = 2$ là tiệm cận đứng."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{1}{x - 4}$ là:",
      options: [
        "$x = 4$",
        "$y = 1$",
        "$y = 4$",
        "$y = 0$ (trục hoành $Ox$)"
      ],
      correctAnswerIndex: 3,
      solution: "Ta có $\\lim_{x \\to \\pm\\infty} \\frac{1}{x-4} = 0$, do đó trục hoành $y = 0$ là đường tiệm cận ngang."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Đường tiệm cận đứng của đồ thị hàm số $y = \\frac{2x + 3}{4 - x}$ là:",
      options: [
        "$x = 4$",
        "$x = -4$",
        "$y = -2$",
        "$y = 2$"
      ],
      correctAnswerIndex: 0,
      solution: "Mẫu số triệt tiêu tại $x = 4$. Giới hạn $\\lim_{x \\to 4^+} \\frac{2x+3}{4-x} = -\\infty$. Do đó $x = 4$ là tiệm cận đứng."
    },
    {
      id: 5,
      level: 'Thông hiểu',
      question: "Số đường tiệm cận đứng của đồ thị hàm số $y = \\frac{x^2 + x - 2}{x - 1}$ là:",
      options: [
        "$1$",
        "$0$",
        "$2$",
        "$3$"
      ],
      correctAnswerIndex: 1,
      solution: "Ta có $x^2 + x - 2 = (x - 1)(x + 2)$. Với mọi $x \\neq 1$, $y = x + 2$. Giới hạn $\\lim_{x \\to 1} y = 3$ (hữu hạn). Do đó đồ thị không có đường tiệm cận đứng nào ($0$ đường)."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Tìm phương trình đường tiệm cận xiên của đồ thị hàm số $y = \\frac{-x^2 + 3x - 1}{x - 2}$.",
      options: [
        "$y = -x - 1$",
        "$y = x - 1$",
        "$y = -x + 1$",
        "$y = -x + 3$"
      ],
      correctAnswerIndex: 2,
      solution: "Chia đa thức: $-x^2 + 3x - 1 = (x - 2)(-x + 1) + 1 \\Rightarrow y = -x + 1 + \\frac{1}{x - 2}$. Vậy tiệm cận xiên là $y = -x + 1$."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Giao điểm của hai đường tiệm cận của đồ thị hàm số $y = \\frac{2x - 3}{x + 1}$ là điểm:",
      diagram: {
        type: 'asymptote_graph',
        title: 'Giao điểm hai đường tiệm cận của y = (2x-3)/(x+1)',
        graphId: 'hyperbola_set4_q7',
        description: 'TCĐ: x = -1, TCN: y = 2, giao điểm I(-1; 2)'
      },
      tikz: "\\begin{tikzpicture}[scale=0.75,>=stealth]\n  \\draw[->] (-3.5,0) -- (3,0) node[below] {$x$};\n  \\draw[->] (0,-2) -- (0,4.5) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,orange] (-1,-2) -- (-1,4.5) node[above] {$x=-1$};\n  \\draw[dashed,thick,cyan] (-3.5,2) -- (3,2) node[right] {$y=2$};\n  \\fill[red] (-1,2) circle (2pt) node[above left] {$I(-1;2)$};\n  \\draw[thick,blue,domain=-3.5:-1.2,smooth] plot (\\x,{(2*\\x-3)/(\\x+1)});\n  \\draw[thick,blue,domain=-0.7:3,smooth] plot (\\x,{(2*\\x-3)/(\\x+1)});\n\\end{tikzpicture}",
      options: [
        "$I(1; 2)$",
        "$I(-1; -3)$",
        "$I(2; -1)$",
        "$I(-1; 2)$"
      ],
      correctAnswerIndex: 3,
      solution: "Tiệm cận đứng là $x = -1$, tiệm cận ngang là $y = 2$. Giao điểm là $I(-1; 2)$."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Đồ thị trong Hình 1.38 SGK (trang 43) có tiệm cận đứng $x = -1$ và tiệm cận xiên $y = x - 2$, cắt trục tung tại điểm $(0; 1)$. Đó là đồ thị hàm số nào?",
      diagram: {
        type: 'asymptote_graph',
        title: 'Đồ thị hàm phân thức bậc 2 trên bậc 1 (Hình 1.38 SGK tr.43)',
        graphId: 'rational_1_38',
        description: 'TCĐ: x = -1, TCX: y = x - 2, cắt Oy tại (0; 1)'
      },
      tikz: "\\begin{tikzpicture}[scale=0.7,>=stealth]\n  \\draw[->] (-4,0) -- (3.5,0) node[below] {$x$};\n  \\draw[->] (0,-4) -- (0,4) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,orange] (-1,-4) -- (-1,4) node[above] {$x=-1$};\n  \\draw[dashed,thick,purple,domain=-2:3.5] plot (\\x,{\\x-2}) node[right] {$y=x-2$};\n  \\draw[thick,cyan,domain=-4:-1.35,smooth] plot (\\x,{(\\x*\\x-\\x+1)/(\\x+1)});\n  \\draw[thick,cyan,domain=-0.65:3.2,smooth] plot (\\x,{(\\x*\\x-\\x+1)/(\\x+1)});\n  \\fill (0,1) circle (1.5pt) node[right] {$(0;1)$};\n\\end{tikzpicture}",
      options: [
        "$y = \\frac{x^2 - x + 1}{x + 1}$",
        "$y = \\frac{x^2 + x + 1}{x + 1}$",
        "$y = x - \\frac{1}{x + 1}$",
        "$y = \\frac{2x + 1}{x + 1}$"
      ],
      correctAnswerIndex: 0,
      solution: "Ta phân tích hàm $y = \\frac{x^2 - x + 1}{x + 1} = x - 2 + \\frac{3}{x+1}$.\n- Có TCĐ là $x = -1$.\n- Có TCX là $y = x - 2$.\n- Tại $x = 0 \\Rightarrow y = 1$ (cắt $Oy$ tại $(0; 1)$). Thỏa mãn toàn bộ đồ thị Hình 1.38 SGK (Bài 1.39 SGK tr.43)."
    },
    {
      id: 9,
      level: 'Vận dụng',
      question: "Tìm giá trị của tham số $m$ để đường tiệm cận đứng của đồ thị hàm số $y = \\frac{2x + 1}{x - m}$ cắt đường thẳng $y = 3$ tại điểm có hoành độ bằng $5$.",
      options: [
        "$m = 3$",
        "$m = 5$",
        "$m = -5$",
        "$m = 2$"
      ],
      correctAnswerIndex: 1,
      solution: "Tiệm cận đứng của đồ thị là đường thẳng $x = m$. Điểm cắt đường thẳng $y = 3$ có hoành độ bằng $5$ nghĩa là $x = 5$. Vậy $m = 5$."
    },
    {
      id: 10,
      level: 'Vận dụng',
      question: "Tổng số tất cả các đường tiệm cận (đứng và ngang) của đồ thị hàm số $y = \\frac{x}{\\sqrt{x^2 - 4}}$ là:",
      options: [
        "$2$",
        "$3$",
        "$4$ (gồm $2$ TCĐ $x = 2, x = -2$ và $2$ TCN $y = 1, y = -1$)",
        "$1$"
      ],
      correctAnswerIndex: 2,
      solution: "TXĐ: $(-\\infty; -2) \\cup (2; +\\infty)$.\n- TCĐ: $\\lim_{x \\to 2^+} y = +\\infty \\Rightarrow x = 2$; $\\lim_{x \\to (-2)^-} y = -\\infty \\Rightarrow x = -2$ (2 TCĐ).\n- TCN: $\\lim_{x \\to +\\infty} y = 1 \\Rightarrow y = 1$; $\\lim_{x \\to -\\infty} y = -1 \\Rightarrow y = -1$ (2 TCN).\nTổng cộng có 4 đường tiệm cận."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Cho hàm số $y = \\frac{x^2 - 3x + m}{x - 2}$. Tìm giá trị của tham số $m$ để đồ thị hàm số không có tiệm cận đứng.",
      options: [
        "$m = -2$",
        "$m = 0$",
        "$m = 4$",
        "$m = 2$"
      ],
      correctAnswerIndex: 3,
      solution: "Để đồ thị không có TCĐ, nghiệm của mẫu $x = 2$ phải là nghiệm của tử số: $2^2 - 3(2) + m = 0 \\Leftrightarrow m - 2 = 0 \\Leftrightarrow m = 2$. Khi $m = 2$, $y = \\frac{(x-2)(x-1)}{x-2} = x - 1$ với $x \\neq 2$, giới hạn $\\lim_{x \\to 2} y = 1$ nên không có TCĐ."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Tìm góc nhọn tạo bởi hai đường tiệm cận xiên của hai đồ thị hàm số $y = \\frac{x^2 + 1}{x}$ và $y = \\frac{-x^2 + 1}{x}$.",
      diagram: {
        type: 'asymptote_graph',
        title: 'Hai tiệm cận xiên vuông góc y = x và y = -x',
        graphId: 'perpendicular_asymptotes',
        description: 'TCX y = x (k₁ = 1) và TCX y = -x (k₂ = -1) vuông góc với nhau (90°)'
      },
      tikz: "\\begin{tikzpicture}[scale=0.75,>=stealth]\n  \\draw[->] (-3.5,0) -- (3.5,0) node[below] {$x$};\n  \\draw[->] (0,-3.5) -- (0,3.5) node[left] {$y$};\n  \\draw (0,0) node[below right] {$O$};\n  \\draw[dashed,thick,red,domain=-3:3] plot (\\x,{\\x}) node[right] {$y=x$};\n  \\draw[dashed,thick,blue,domain=-3:3] plot (\\x,{-\\x}) node[right] {$y=-x$};\n  \\draw[thick,teal,domain=0.5:2.5,smooth] plot (\\x,{(\\x*\\x+1)/\\x});\n  \\draw[thick,teal,domain=-2.5:-0.5,smooth] plot (\\x,{(\\x*\\x+1)/\\x});\n  \\draw[thick,orange,domain=0.5:2.5,smooth] plot (\\x,{(-\\x*\\x+1)/\\x});\n  \\draw[thick,orange,domain=-2.5:-0.5,smooth] plot (\\x,{(-\\x*\\x+1)/\\x});\n\\end{tikzpicture}",
      options: [
        "$90^{\\circ}$",
        "$45^{\\circ}$",
        "$60^{\\circ}$",
        "$30^{\\circ}$"
      ],
      correctAnswerIndex: 0,
      solution: "Hàm số thứ nhất có TCX $d_1: y = x$ (hệ số góc $k_1 = 1$). Hàm số thứ hai có TCX $d_2: y = -x$ (hệ số góc $k_2 = -1$). Tích hai hệ số góc $k_1 \\cdot k_2 = 1 \\cdot (-1) = -1$, nên hai đường tiệm cận xiên vuông góc với nhau ($90^{\\circ}$)."
    },
    {
      id: 13,
      level: 'Vận dụng cao',
      question: "Chi phí vận chuyển $x$ tấn nông sản của một hợp tác xã được mô hình bởi hàm số $C(x) = 50 + 10x + \\frac{200}{x}$ (nghìn đồng, với $x > 0$). Đường tiệm cận xiên của hàm số $y = C(x)$ là đường thẳng nào?",
      options: [
        "$y = 10x$",
        "$y = 10x + 50$",
        "$y = 50$",
        "$y = 10x + 200$"
      ],
      correctAnswerIndex: 1,
      solution: "Ta có $\\lim_{x \\to +\\infty} [C(x) - (10x + 50)] = \\lim_{x \\to +\\infty} \\frac{200}{x} = 0$. Do đó, đường tiệm cận xiên là $y = 10x + 50$."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Một bể chứa ban đầu có $200$ lít nước sạch. Người ta bơm thêm nước khử trùng với tốc độ $40$ lít/phút, đồng thời cho vào $20$ gam chất khử trùng mỗi phút. Nồng độ chất khử trùng trong bể sau $t$ phút là $C(t) = \\frac{20t}{200 + 40t}$ (gam/lít, $t \\ge 0$). Vì sao nồng độ chất khử trùng không bao giờ vượt quá $0{,}5$ gam/lít?",
      options: [
        "Vì sau $10$ phút lượng chất khử trùng đã bão hòa.",
        "Vì thể tích bể chứa tối đa chỉ được $200$ lít.",
        "Vì hàm số $C(t)$ luôn đồng biến và có tiệm cận ngang $y = \\lim_{t \\to +\\infty} C(t) = 0{,}5$ gam/lít, nên $C(t) < 0{,}5$ với mọi $t \\ge 0$.",
        "Vì khối lượng chất khử trùng mỗi phút chỉ có $20$ gam."
      ],
      correctAnswerIndex: 2,
      solution: "Rút gọn $C(t) = \\frac{20t}{40t + 200} = \\frac{t}{2t + 10}$. Ta có đạo hàm $C'(t) = \\frac{10}{(2t+10)^2} > 0$ (hàm số luôn tăng) và $\\lim_{t \\to +\\infty} C(t) = \\frac{1}{2} = 0{,}5$. Do đó nồng độ luôn tăng nhưng luôn nhỏ hơn $0{,}5$ gam/lít (tiệm cận ngang $y = 0{,}5$) (Vận dụng 1 SGK tr.30)."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Tìm các giá trị thực của tham số $m$ để khoảng cách từ gốc toạ độ $O(0; 0)$ đến đường tiệm cận xiên của đồ thị hàm số $y = \\frac{x^2 + mx + 1}{x - 1}$ bằng $\\frac{1}{\\sqrt{2}}$.",
      options: [
        "$m = 1$ hoặc $m = 3$",
        "$m = 0$ hoặc $m = -2$",
        "$m = -1$ hoặc $m = -3$",
        "$m = 2$ hoặc $m = -2$"
      ],
      correctAnswerIndex: 1,
      solution: "Chia đa thức: $x^2 + mx + 1 = (x - 1)(x + m + 1) + m + 2 \\Rightarrow$ Tiệm cận xiên là $\\Delta: y = x + m + 1 \\Leftrightarrow x - y + m + 1 = 0$.\nKhoảng cách từ $O(0; 0)$ đến $\\Delta$ là:\n$d(O, \\Delta) = \\frac{|0 - 0 + m + 1|}{\\sqrt{1^2 + (-1)^2}} = \\frac{|m + 1|}{\\sqrt{2}}$.\nTheo đề bài $\\frac{|m+1|}{\\sqrt{2}} = \\frac{1}{\\sqrt{2}} \\Leftrightarrow |m + 1| = 1 \\Leftrightarrow m + 1 = 1$ hoặc $m + 1 = -1 \\Leftrightarrow m = 0$ hoặc $m = -2$."
    }
  ],

  // =========================================================================
  // BỘ ĐỀ 5: TỔNG HỢP & THỰC TIỄN GDPT 2018
  // =========================================================================
  [
    {
      id: 1,
      level: 'Nhận biết',
      question: "Khẳng định nào sau đây là ĐÚNG về đường tiệm cận đứng của đồ thị hàm số $y = f(x)$?",
      options: [
        "Đường thẳng $x = x_0$ là tiệm cận đứng nếu ít nhất một trong các giới hạn $\\lim_{x \\to x_0^+} f(x)$, $\\lim_{x \\to x_0^-} f(x)$ bằng $+\\infty$ hoặc $-\\infty$.",
        "Đường thẳng $x = x_0$ là tiệm cận đứng nếu $\\lim_{x \\to +\\infty} f(x) = x_0$.",
        "Đường thẳng $y = x_0$ là tiệm cận đứng nếu $\\lim_{x \\to x_0} f(x) = 0$.",
        "Mọi hàm số không xác định tại $x_0$ đều nhận $x = x_0$ làm tiệm cận đứng."
      ],
      correctAnswerIndex: 0,
      solution: "Theo định nghĩa SGK Toán 12 Kết nối tri thức (trang 21): Đường thẳng $x = x_0$ là tiệm cận đứng nếu ít nhất một trong các điều kiện sau được thỏa mãn: $\\lim_{x \\to x_0^+} f(x) = \\pm\\infty$ hoặc $\\lim_{x \\to x_0^-} f(x) = \\pm\\infty$."
    },
    {
      id: 2,
      level: 'Nhận biết',
      question: "Khẳng định nào sau đây ĐÚNG về đường tiệm cận xiên của đồ thị hàm số $y = f(x)$?",
      options: [
        "Hệ số $a$ trong tiệm cận xiên luôn bằng $0$.",
        "Nếu đường thẳng $y = ax + b$ là tiệm cận xiên thì hệ số $a \\neq 0$.",
        "Tiệm cận xiên luôn song song với trục tung.",
        "Mọi hàm đa thức bậc hai đều có tiệm cận xiên."
      ],
      correctAnswerIndex: 1,
      solution: "Đường thẳng $y = ax + b$ là tiệm cận xiên thì bắt buộc hệ số $a \\neq 0$ (nếu $a = 0$ thì nó trở thành tiệm cận ngang $y = b$)."
    },
    {
      id: 3,
      level: 'Nhận biết',
      question: "Đường tiệm cận ngang của đồ thị hàm số $y = \\frac{7x - 3}{1 - 2x}$ là:",
      options: [
        "$y = \\frac{7}{2}$",
        "$y = 7$",
        "$y = -\\frac{7}{2}$",
        "$x = \\frac{1}{2}$"
      ],
      correctAnswerIndex: 2,
      solution: "Ta có $\\lim_{x \\to \\pm\\infty} \\frac{7x - 3}{-2x + 1} = -\\frac{7}{2}$. Do đó tiệm cận ngang là đường thẳng $y = -\\frac{7}{2}$."
    },
    {
      id: 4,
      level: 'Nhận biết',
      question: "Đường tiệm cận đứng của đồ thị hàm số $y = \\frac{x + 2}{x^2 - 4}$ là:",
      options: [
        "$x = -2$",
        "$x = 2$ và $x = -2$",
        "Không có tiệm cận đứng",
        "$x = 2$"
      ],
      correctAnswerIndex: 3,
      solution: "Ta có $x^2 - 4 = (x - 2)(x + 2)$. Với $x \\neq -2$, $y = \\frac{1}{x - 2}$.\n- Tại $x = -2$: $\\lim_{x \\to -2} y = -\\frac{1}{4}$ (hữu hạn, không phải TCĐ).\n- Tại $x = 2$: $\\lim_{x \\to 2^+} y = +\\infty \\Rightarrow x = 2$ là tiệm cận đứng duy nhất."
    },
    {
      id: 5,
      level: 'Thông hiểu',
      question: "Đường tiệm cận xiên của đồ thị hàm số $y = 2x - 3 + \\frac{5}{x + 1}$ là:",
      options: [
        "$y = 2x - 3$",
        "$y = 2x + 3$",
        "$y = -2x - 3$",
        "$x = -1$"
      ],
      correctAnswerIndex: 0,
      solution: "Vì $\\lim_{x \\to \\pm\\infty} [y - (2x - 3)] = \\lim_{x \\to \\pm\\infty} \\frac{5}{x+1} = 0$, nên tiệm cận xiên là đường thẳng $y = 2x - 3$."
    },
    {
      id: 6,
      level: 'Thông hiểu',
      question: "Tổng số đường tiệm cận đứng và tiệm cận ngang của đồ thị hàm số $y = \\frac{x^2 + 1}{x^2 - 1}$ là:",
      options: [
        "$2$",
        "$3$ (gồm $1$ TCN $y = 1$ và $2$ TCĐ $x = 1, x = -1$)",
        "$1$",
        "$4$"
      ],
      correctAnswerIndex: 1,
      solution: "TCN: $\\lim_{x \\to \\pm\\infty} \\frac{x^2+1}{x^2-1} = 1 \\Rightarrow y = 1$ (1 TCN). TCĐ: $x^2 - 1 = 0 \\Leftrightarrow x = 1$ hoặc $x = -1$ (2 TCĐ vì tử số $1^2+1=2 \\neq 0$). Tổng cộng có $1 + 2 = 3$ đường tiệm cận."
    },
    {
      id: 7,
      level: 'Thông hiểu',
      question: "Cho hàm số $y = f(x)$ có bảng biến thiên dưới đây. Tổng số đường tiệm cận (đứng và ngang) của đồ thị hàm số là:",
      diagram: {
        type: 'bbt',
        title: 'Bảng biến thiên hàm số y = f(x)',
        bbtPreset: 'set5_q7',
        xValues: ["-\\infty", "1", "+\\infty"],
        yPrimeSigns: ["+", "||", "+"],
        yValues: [
          { val: "2", pos: "bottom" },
          { val: "+\\infty", pos: "top" },
          { val: "||", pos: "mid", isDoubleBar: true },
          { val: "-\\infty", pos: "bottom" },
          { val: "2", pos: "top" }
        ],
        notes: "• Tiệm cận ngang: $y = 2$ (khi $x \\to \\pm\\infty$).\\, • Tiệm cận đứng: $x = 1$ (vì $\\lim_{x \\to 1^-} f(x) = +\\infty$ và $\\lim_{x \\to 1^+} f(x) = -\\infty$)."
      },
      tikz: "\\begin{tikzpicture}[scale=0.85]\n  \\tkzTabInit[lgt=1.2,espcl=2.5]{$x$/1,$y'$/1,$y$/2}{$-\\infty$,$1$,$+\\infty$}\n  \\tkzTabLine{,+,d,+,}\n  \\tkzTabVar{-/$2$, +D- / $+\\infty$ / $-\\infty$, +/$2$}\n\\end{tikzpicture}",
      options: [
        "$3$",
        "$1$",
        "$2$ (gồm $1$ TCN $y = 2$ và $1$ TCĐ $x = 1$)",
        "$4$"
      ],
      correctAnswerIndex: 2,
      solution: "Từ BBT:\n• $\\lim_{x \\to -\\infty} f(x) = 2$ và $\\lim_{x \\to +\\infty} f(x) = 2 \\Rightarrow$ đồ thị có đúng 1 tiệm cận ngang $y = 2$.\n• $\\lim_{x \\to 1^-} f(x) = +\\infty$ và $\\lim_{x \\to 1^+} f(x) = -\\infty \\Rightarrow$ đồ thị có đúng 1 tiệm cận đứng $x = 1$.\nTổng số đường tiệm cận của đồ thị hàm số là $1 + 1 = 2$ đường (hàm số đồng biến trên từng khoảng xác định, không có cực trị)."
    },
    {
      id: 8,
      level: 'Thông hiểu',
      question: "Cho hàm số bậc nhất trên bậc nhất $y = \\frac{ax + b}{cx + d}$ có đồ thị nhận $x = 1$ làm tiệm cận đứng, $y = 2$ làm tiệm cận ngang và cắt trục tung tại $(0; -1)$. Hàm số đó là:",
      options: [
        "$y = \\frac{2x - 1}{x - 1}$",
        "$y = \\frac{2x - 2}{x + 1}$",
        "$y = \\frac{x + 1}{x - 1}$",
        "$y = \\frac{2x + 1}{x - 1}$"
      ],
      correctAnswerIndex: 3,
      solution: "Hàm số dạng $y = \\frac{2x + b}{x - 1}$ (để có TCĐ $x = 1$, TCN $y = 2$). Đồ thị cắt $Oy$ tại $(0; -1)$ nên $-1 = \\frac{b}{-1} \\Leftrightarrow b = 1$. Vậy hàm số là $y = \\frac{2x + 1}{x - 1}$."
    },
    {
      id: 9,
      level: 'Vận dụng',
      question: "Cho hàm số $y = \\frac{x^2 + 2x - 3}{x - 2}$. Tọa độ giao điểm $I$ của đường tiệm cận xiên và đường tiệm cận đứng của đồ thị hàm số là:",
      options: [
        "$I(2; 6)$",
        "$I(2; 4)$",
        "$I(-2; 6)$",
        "$I(2; 0)$"
      ],
      correctAnswerIndex: 0,
      solution: "Chia đa thức: $x^2 + 2x - 3 = (x - 2)(x + 4) + 5 \\Rightarrow y = x + 4 + \\frac{5}{x - 2}$.\n- TCĐ: $x = 2$.\n- TCX: $y = x + 4$.\nThay $x = 2$ vào TCX ta được $y = 2 + 4 = 6$. Giao điểm là $I(2; 6)$."
    },
    {
      id: 10,
      level: 'Vận dụng',
      question: "Số đường tiệm cận của đồ thị hàm số $y = \\frac{\\sqrt{x - 1}}{x^2 - 4}$ là:",
      options: [
        "$3$",
        "$2$ (gồm $1$ TCĐ $x = 2$ và $1$ TCN $y = 0$ khi $x \\to +\\infty$)",
        "$1$",
        "$4$"
      ],
      correctAnswerIndex: 1,
      solution: "TXĐ: $x \\ge 1$ và $x \\neq 2$.\n- TCĐ: Tại $x = 2$, $\\lim_{x \\to 2^+} y = +\\infty \\Rightarrow x = 2$ là TCĐ. Điểm $x = -2$ không thuộc TXĐ nên không xét.\n- TCN: $\\lim_{x \\to +\\infty} \\frac{\\sqrt{x-1}}{x^2-4} = 0 \\Rightarrow y = 0$. Không có giới hạn khi $x \\to -\\infty$.\nTổng cộng có 2 đường tiệm cận."
    },
    {
      id: 11,
      level: 'Vận dụng',
      question: "Tìm tất cả các giá trị của tham số $m$ để đồ thị hàm số $y = \\frac{x - 1}{x^2 - 2x + m}$ có đúng 2 đường tiệm cận (gồm tiệm cận đứng và tiệm cận ngang).",
      options: [
        "$m < 1$",
        "$m > 1$",
        "$m = 1$",
        "$m = 0$"
      ],
      correctAnswerIndex: 2,
      solution: "Vì bậc tử (1) nhỏ hơn bậc mẫu (2) nên luôn có 1 TCN là $y = 0$. Để đồ thị có đúng 2 tiệm cận thì phải có thêm đúng 1 TCĐ.\n- Mẫu $g(x) = x^2 - 2x + m = 0$ có nghiệm kép: $\\Delta' = 1 - m = 0 \\Leftrightarrow m = 1$. Khi đó $y = \\frac{x-1}{(x-1)^2} = \\frac{1}{x-1}$ có 1 TCĐ $x = 1$ (thỏa mãn).\n- Mẫu có 2 nghiệm phân biệt trong đó có 1 nghiệm $x = 1$: $1 - 2 + m = 0 \\Leftrightarrow m = 1$ (trùng trường hợp trên).\nVậy $m = 1$."
    },
    {
      id: 12,
      level: 'Vận dụng',
      question: "Diện tích của tam giác tạo bởi hai trục tọa độ $Ox, Oy$ và đường tiệm cận xiên của đồ thị hàm số $y = \\frac{2x^2 - x + 3}{x - 1}$ bằng:",
      options: [
        "$\\frac{1}{2}$",
        "$1$",
        "$2$",
        "$\\frac{1}{4}$"
      ],
      correctAnswerIndex: 3,
      solution: "Chia đa thức: $2x^2 - x + 3 = (x - 1)(2x + 1) + 4 \\Rightarrow y = 2x + 1 + \\frac{4}{x-1}$. Tiệm cận xiên là $d: y = 2x + 1$.\n- Giao điểm của $d$ với $Oy$ ($x=0$) là $A(0; 1) \\Rightarrow OA = 1$.\n- Giao điểm của $d$ với $Ox$ ($y=0$) là $B(-\\frac{1}{2}; 0) \\Rightarrow OB = \\frac{1}{2}$.\nDiện tích tam giác vuông $OAB$ là $S = \\frac{1}{2} OA \\cdot OB = \\frac{1}{2} \\cdot 1 \\cdot \\frac{1}{2} = \\frac{1}{4}$."
    },
    {
      id: 13,
      level: 'Vận dụng cao',
      question: "Chi phí sản xuất $x$ tấn sản phẩm của một nhà máy là $C(x) = 3x + 120$ (triệu đồng). Giá thành trung bình trên mỗi tấn là $\\bar{C}(x) = \\frac{3x + 120}{x}$ (triệu đồng). Tiệm cận ngang $y = 3$ của hàm số này nói lên điều gì trong kinh tế?",
      options: [
        "Khi quy mô sản xuất càng lớn ($x \\to +\\infty$), chi phí trung bình trên mỗi tấn sản phẩm giảm dần và tiệm cận đến mức tối thiểu $3$ triệu đồng.",
        "Nhà máy phải sản xuất tối thiểu $3$ tấn sản phẩm mỗi ngày.",
        "Lợi nhuận của nhà máy luôn đạt tối đa $120$ triệu đồng.",
        "Chi phí cố định ban đầu của nhà máy là $3$ triệu đồng."
      ],
      correctAnswerIndex: 0,
      solution: "Ta có $\\lim_{x \\to +\\infty} \\bar{C}(x) = \\lim_{x \\to +\\infty} \\frac{3x + 120}{x} = 3$. Trong kinh tế quy mô, khi sản lượng $x$ rất lớn, chi phí cố định ($120$ triệu) được phân bổ cho vô số sản phẩm nên chi phí đơn vị tiến sát chi phí biến đổi là $3$ triệu đồng/tấn (tiệm cận ngang $y = 3$)."
    },
    {
      id: 14,
      level: 'Vận dụng cao',
      question: "Trong vật lí, một điện trở cố định $8\\,\\Omega$ mắc song song với một biến trở $x\\,(\\Omega)$ ($x > 0$). Điện trở tương đương toàn mạch là $R(x) = \\frac{8x}{8 + x}\\,(\\Omega)$. Tiệm cận ngang $y = 8$ của đồ thị hàm số giải thích vì sao:",
      options: [
        "Điện trở toàn mạch luôn bằng đúng $8\\,\\Omega$ ở mọi giá trị biến trở.",
        "Điện trở tương đương của đoạn mạch mắc song song luôn nhỏ hơn điện trở của mỗi nhánh ($R(x) < 8\\,\\Omega$) và không bao giờ vượt quá $8\\,\\Omega$ dù biến trở $x$ tăng vô hạn.",
        "Biến trở $x$ chỉ có thể nhận giá trị tối đa là $8\\,\\Omega$.",
        "Dòng điện trong mạch sẽ bị ngắt khi biến trở đạt $8\\,\\Omega$."
      ],
      correctAnswerIndex: 1,
      solution: "Vì $R(x) = \\frac{8x}{x + 8} = 8 - \\frac{64}{x + 8} < 8$ với mọi $x > 0$ và $\\lim_{x \\to +\\infty} R(x) = 8$. Điều này chứng minh quy luật vật lí: Điện trở tương đương của đoạn mạch song song luôn nhỏ hơn mọi điện trở thành phần và không thể vượt quá $8\\,\\Omega$ (Bài tập 1.25 SGK tr.33)."
    },
    {
      id: 15,
      level: 'Vận dụng cao',
      question: "Tìm giá trị của tham số $m$ để đường tiệm cận xiên của đồ thị hàm số $y = \\frac{(m - 1)x^2 + 2x + 3}{x + 1}$ vuông góc với đường thẳng $d: y = -\\frac{1}{2}x + 4$.",
      options: [
        "$m = 2$",
        "$m = -1$",
        "$m = 3$",
        "$m = 1$"
      ],
      correctAnswerIndex: 2,
      solution: "Để hàm số có tiệm cận xiên thì $m - 1 \\neq 0 \\Leftrightarrow m \\neq 1$. Khi đó chia đa thức:\n$(m - 1)x^2 + 2x + 3 = (x + 1)[(m - 1)x + (3 - m)] + m \\Rightarrow$ Tiệm cận xiên có hệ số góc là $k_1 = m - 1$.\nĐường thẳng $d$ có hệ số góc $k_2 = -\\frac{1}{2}$.\nĐể hai đường thẳng vuông góc thì $k_1 \\cdot k_2 = -1 \\Leftrightarrow (m - 1)\\left(-\\frac{1}{2}\\right) = -1 \\Leftrightarrow m - 1 = 2 \\Leftrightarrow m = 3$."
    }
  ]
];
