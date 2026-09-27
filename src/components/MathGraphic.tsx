import React, { useState } from 'react';
import Latex from 'react-latex-next';
import { Code, Eye, Copy, Check, FileCode2 } from 'lucide-react';

export interface VariationTableData {
  type: 'bbt';
  title?: string;
  xValues: string[];
  yPrimeSigns: string[];
  yValues: {
    val: string;
    pos: 'top' | 'bottom' | 'mid';
    isDoubleBar?: boolean;
    arrow?: 'up' | 'down' | 'none';
  }[];
  bbtPreset?: 'set1_q6' | 'set2_q5' | 'set4_q1' | 'set5_q7';
  notes?: string;
}

export interface AsymptoteGraphData {
  type: 'asymptote_graph';
  title?: string;
  graphId: 
    | 'hyperbola_1_37' 
    | 'rational_1_38' 
    | 'rational_1_26' 
    | 'sqrt_1_21' 
    | 'rational_1_36'
    | 'rational_ex4'
    | 'hyperbola_set3_q5'
    | 'sqrt_set3_q8'
    | 'hyperbola_set4_q7'
    | 'perpendicular_asymptotes'
    | 'rational_oblique' 
    | 'hyperbola_standard';
  description?: string;
}

export type MathDiagram = VariationTableData | AsymptoteGraphData;

interface MathGraphicProps {
  tikz?: string;
  diagram?: MathDiagram;
}

export const MathGraphic: React.FC<MathGraphicProps> = ({ tikz, diagram }) => {
  const [showTikzCode, setShowTikzCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyTikz = () => {
    if (!tikz) return;
    const fullCode = `% Gói lệnh LaTeX cần dùng:
\\usepackage{tikz}
\\usepackage{tkz-tab}
\\usepackage{amsmath,amssymb}

${tikz}`;

    navigator.clipboard.writeText(fullCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Render TikZ Code Block
  const renderTikzBlock = () => {
    if (!tikz) return null;
    return (
      <div className="mt-2 text-left bg-slate-950 rounded-xl border border-yellow-500/40 p-3 shadow-inner">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px]">
          <div className="text-yellow-400 font-bold flex items-center gap-1.5">
            <FileCode2 size={14} /> Mã nguồn TikZ chuẩn LaTeX (tkz-tab)
          </div>
          <button
            type="button"
            onClick={handleCopyTikz}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 text-[10px] font-bold transition-all cursor-pointer"
          >
            {isCopied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span>{isCopied ? 'Đã sao chép!' : 'Sao chép TikZ'}</span>
          </button>
        </div>
        <div className="text-[10px] text-slate-400 mb-2 italic">
          % Biên dịch trong Overleaf hoặc TeXmaker: thêm <span className="text-cyan-300">\usepackage&#123;tikz,tkz-tab&#125;</span> vào phần khai báo.
        </div>
        <pre className="font-mono text-[11px] text-emerald-300 whitespace-pre-wrap overflow-x-auto leading-relaxed selection:bg-yellow-400 selection:text-black">
          {tikz}
        </pre>
      </div>
    );
  };

  // 1. VARIATION TABLE (Bảng biến thiên chuẩn toán học SVG & LaTeX)
  if (diagram && diagram.type === 'bbt') {
    return (
      <div className="my-2.5 p-3 md:p-4 bg-slate-900/95 rounded-2xl border border-blue-500/40 shadow-lg text-white max-w-full overflow-x-auto select-text">
        <div className="flex items-center justify-between mb-2">
          {diagram.title ? (
            <div className="text-xs md:text-sm font-bold text-yellow-400 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              {diagram.title}
            </div>
          ) : <div></div>}
          
          {tikz && (
            <button
              type="button"
              onClick={() => setShowTikzCode(!showTikzCode)}
              className="text-[10px] md:text-xs text-blue-300 hover:text-yellow-300 px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-600/40 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {showTikzCode ? <Eye size={12} /> : <Code size={12} />}
              <span>{showTikzCode ? 'Xem bảng BBT' : 'Mã TikZ'}</span>
            </button>
          )}
        </div>

        {showTikzCode && tikz ? (
          renderTikzBlock()
        ) : (
          <div className="w-full max-w-[660px] mx-auto bg-slate-950 rounded-xl overflow-hidden border border-slate-700 shadow-md">
            {/* SVG Markers Definition */}
            <svg className="w-0 h-0 absolute">
              <defs>
                <marker id="bbt-arrow-down" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#60a5fa" />
                </marker>
                <marker id="bbt-arrow-up" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#34d399" />
                </marker>
              </defs>
            </svg>

            {/* PRESET 1: SET 2 Q5 (Bài 1.37 SGK Toán 12 tr.43) */}
            {(diagram.bbtPreset === 'set2_q5' || diagram.title?.includes('1.37')) ? (
              <svg viewBox="0 0 640 210" className="w-full h-auto block select-text font-serif">
                {/* Background & Outer Border */}
                <rect x="1" y="1" width="638" height="208" rx="8" fill="#030712" stroke="#334155" strokeWidth="1.5" />
                
                {/* Horizontal Dividers */}
                <line x1="1" y1="44" x2="639" y2="44" stroke="#334155" strokeWidth="1.5" />
                <line x1="1" y1="84" x2="639" y2="84" stroke="#334155" strokeWidth="1.5" />
                
                {/* Vertical Divider for Labels */}
                <line x1="68" y1="1" x2="68" y2="209" stroke="#334155" strokeWidth="1.5" />

                {/* Row Labels (x, y', y) */}
                <text x="34" y="29" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">x</text>
                <text x="34" y="69" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">y'</text>
                <text x="34" y="152" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">y</text>

                {/* Double Bars (Points of Discontinuity x = 1 and x = 3) */}
                {/* At x = 1 (centered at x = 245) */}
                <line x1="243" y1="44" x2="243" y2="209" stroke="#f59e0b" strokeWidth="1.6" />
                <line x1="247" y1="44" x2="247" y2="209" stroke="#f59e0b" strokeWidth="1.6" />

                {/* At x = 3 (centered at x = 465) */}
                <line x1="463" y1="44" x2="463" y2="209" stroke="#f59e0b" strokeWidth="1.6" />
                <line x1="467" y1="44" x2="467" y2="209" stroke="#f59e0b" strokeWidth="1.6" />

                {/* ROW 1: x values */}
                <text x="105" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">−∞</text>
                <text x="245" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">1</text>
                <text x="355" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">2</text>
                <text x="465" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">3</text>
                <text x="605" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">+∞</text>

                {/* ROW 2: y' signs */}
                <text x="175" y="70" fill="#f87171" fontSize="22" fontWeight="bold" textAnchor="middle">−</text>
                <text x="300" y="70" fill="#f87171" fontSize="22" fontWeight="bold" textAnchor="middle">−</text>
                <text x="355" y="69" fill="#cbd5e1" fontSize="16" fontWeight="bold" textAnchor="middle">0</text>
                <text x="410" y="70" fill="#34d399" fontSize="22" fontWeight="bold" textAnchor="middle">+</text>
                <text x="535" y="70" fill="#34d399" fontSize="22" fontWeight="bold" textAnchor="middle">+</text>

                {/* ROW 3: y values & arrows */}
                {/* 1. From -inf (y = 1) down to x -> 1- (y = -1) */}
                <text x="105" y="114" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="middle">1</text>
                <line x1="124" y1="118" x2="218" y2="170" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-down)" />
                <text x="233" y="178" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="end">−1</text>

                {/* 2. From x -> 1+ (y = 7) down to x = 2 (y_CT = 5) */}
                <text x="257" y="112" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="start">7</text>
                <line x1="272" y1="118" x2="340" y2="168" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-down)" />

                {/* Local Minimum at x = 2: y_CT = 5 */}
                <circle cx="355" cy="173" r="3" fill="#38bdf8" />
                <text x="355" y="178" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle">5</text>
                <text x="355" y="197" fill="#67e8f9" fontSize="10" fontWeight="bold" textAnchor="middle">y_CT = 5</text>

                {/* 3. From x = 2 (y = 5) up to x -> 3- (y = +inf) */}
                <line x1="370" y1="168" x2="438" y2="118" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-up)" />
                <text x="453" y="112" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="end">+∞</text>

                {/* 4. From x -> 3+ (y = -4) up to +inf (y = -1) */}
                <text x="477" y="178" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="start">−4</text>
                <line x1="495" y1="170" x2="586" y2="120" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-up)" />
                <text x="605" y="114" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="middle">−1</text>
              </svg>
            ) : diagram.bbtPreset === 'set4_q1' ? (
              /* PRESET 3: SET 4 Q1 (Local Max at x = 0, y_CĐ = 5) */
              <svg viewBox="0 0 640 210" className="w-full h-auto block select-text font-serif">
                <rect x="1" y="1" width="638" height="208" rx="8" fill="#030712" stroke="#334155" strokeWidth="1.5" />
                <line x1="1" y1="44" x2="639" y2="44" stroke="#334155" strokeWidth="1.5" />
                <line x1="1" y1="84" x2="639" y2="84" stroke="#334155" strokeWidth="1.5" />
                <line x1="68" y1="1" x2="68" y2="209" stroke="#334155" strokeWidth="1.5" />

                {/* Row Labels */}
                <text x="34" y="29" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">x</text>
                <text x="34" y="69" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">y'</text>
                <text x="34" y="152" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">y</text>

                {/* x values */}
                <text x="130" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">−∞</text>
                <text x="360" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">0</text>
                <text x="590" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">+∞</text>

                {/* y' signs */}
                <text x="245" y="70" fill="#34d399" fontSize="22" fontWeight="bold" textAnchor="middle">+</text>
                <text x="360" y="69" fill="#cbd5e1" fontSize="16" fontWeight="bold" textAnchor="middle">0</text>
                <text x="475" y="70" fill="#f87171" fontSize="22" fontWeight="bold" textAnchor="middle">−</text>

                {/* y values & arrows */}
                {/* From -inf (y = 3) up to x = 0 (y_CĐ = 5) */}
                <text x="130" y="156" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle">3</text>
                <line x1="150" y1="150" x2="335" y2="114" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-up)" />

                {/* Local Maximum at x = 0: y_CĐ = 5 */}
                <circle cx="360" cy="107" r="3" fill="#facc15" />
                <text x="360" y="106" fill="#facc15" fontSize="16" fontWeight="bold" textAnchor="middle">5</text>
                <text x="360" y="124" fill="#fde047" fontSize="10" fontWeight="bold" textAnchor="middle">y_CĐ = 5</text>

                {/* From x = 0 (y = 5) down to +inf (y = -2) */}
                <line x1="385" y1="114" x2="570" y2="170" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-down)" />
                <text x="590" y="178" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle">−2</text>
              </svg>
            ) : diagram.bbtPreset === 'set1_q6' ? (
              /* PRESET 2: SET 1 Q6 (2 TCN, 1 TCĐ) */
              <svg viewBox="0 0 640 210" className="w-full h-auto block select-text font-serif">
                <rect x="1" y="1" width="638" height="208" rx="8" fill="#030712" stroke="#334155" strokeWidth="1.5" />
                <line x1="1" y1="44" x2="639" y2="44" stroke="#334155" strokeWidth="1.5" />
                <line x1="1" y1="84" x2="639" y2="84" stroke="#334155" strokeWidth="1.5" />
                <line x1="68" y1="1" x2="68" y2="209" stroke="#334155" strokeWidth="1.5" />

                {/* Row Labels */}
                <text x="34" y="29" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">x</text>
                <text x="34" y="69" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">y'</text>
                <text x="34" y="152" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">y</text>

                {/* Double Bar at x = 2 */}
                <line x1="358" y1="44" x2="358" y2="209" stroke="#f59e0b" strokeWidth="1.6" />
                <line x1="362" y1="44" x2="362" y2="209" stroke="#f59e0b" strokeWidth="1.6" />

                {/* x values */}
                <text x="130" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">−∞</text>
                <text x="360" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">2</text>
                <text x="590" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">+∞</text>

                {/* y' signs */}
                <text x="245" y="70" fill="#f87171" fontSize="22" fontWeight="bold" textAnchor="middle">−</text>
                <text x="475" y="70" fill="#f87171" fontSize="22" fontWeight="bold" textAnchor="middle">−</text>

                {/* y values & arrows */}
                <text x="130" y="114" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="middle">1</text>
                <line x1="150" y1="118" x2="330" y2="170" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-down)" />
                <text x="345" y="178" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="end">−∞</text>

                <text x="375" y="112" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="start">+∞</text>
                <line x1="395" y1="118" x2="570" y2="170" stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-down)" />
                <text x="590" y="178" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle">−1</text>
              </svg>
            ) : (diagram.bbtPreset === 'set5_q7' || diagram.xValues.length === 3) ? (
              /* PRESET 4: SET 5 Q7 (1 TCN y = 2, 1 TCĐ x = 1) */
              <svg viewBox="0 0 640 210" className="w-full h-auto block select-text font-serif">
                <rect x="1" y="1" width="638" height="208" rx="8" fill="#030712" stroke="#334155" strokeWidth="1.5" />
                <line x1="1" y1="44" x2="639" y2="44" stroke="#334155" strokeWidth="1.5" />
                <line x1="1" y1="84" x2="639" y2="84" stroke="#334155" strokeWidth="1.5" />
                <line x1="68" y1="1" x2="68" y2="209" stroke="#334155" strokeWidth="1.5" />

                {/* Row Labels */}
                <text x="34" y="29" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">x</text>
                <text x="34" y="69" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">y'</text>
                <text x="34" y="152" fill="#93c5fd" fontSize="17" fontStyle="italic" textAnchor="middle" fontWeight="bold">y</text>

                {/* Double Bar at x = 1 */}
                <line x1="358" y1="44" x2="358" y2="209" stroke="#f59e0b" strokeWidth="1.6" />
                <line x1="362" y1="44" x2="362" y2="209" stroke="#f59e0b" strokeWidth="1.6" />

                {/* x values */}
                <text x="130" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">−∞</text>
                <text x="360" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">1</text>
                <text x="590" y="29" fill="#fef08a" fontSize="16" fontWeight="bold" textAnchor="middle">+∞</text>

                {/* y' signs */}
                <text x="245" y="70" fill="#34d399" fontSize="22" fontWeight="bold" textAnchor="middle">+</text>
                <text x="475" y="70" fill="#34d399" fontSize="22" fontWeight="bold" textAnchor="middle">+</text>

                {/* y values & arrows */}
                <text x="130" y="178" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="middle">2</text>
                <line x1="150" y1="172" x2="330" y2="118" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-up)" />
                <text x="345" y="112" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="end">+∞</text>

                <text x="375" y="178" fill="#38bdf8" fontSize="16" fontWeight="bold" textAnchor="start">−∞</text>
                <line x1="395" y1="172" x2="570" y2="118" stroke="#34d399" strokeWidth="2.2" strokeLinecap="round" markerEnd="url(#bbt-arrow-up)" />
                <text x="590" y="114" fill="#fde047" fontSize="16" fontWeight="bold" textAnchor="middle">2</text>
              </svg>
            ) : (
              /* DYNAMIC FALLBACK TABLE */
              <div className="p-3 text-center">
                <table className="w-full border-collapse text-xs md:text-sm text-center">
                  <thead>
                    <tr className="border-b border-slate-700 bg-blue-950/80 font-bold h-9">
                      <th className="w-14 border-r border-slate-700 text-blue-300 font-bold"><Latex>$x$</Latex></th>
                      {diagram.xValues.map((xVal, i) => (
                        <th key={i} className="text-yellow-200 px-2 py-1"><Latex>{`$${xVal}$`}</Latex></th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-700 bg-slate-900/60 font-bold h-8">
                      <td className="border-r border-slate-700 text-blue-300 font-bold"><Latex>$y'$</Latex></td>
                      {diagram.yPrimeSigns.map((sign, i) => (
                        <td key={i} className="px-2 font-bold">
                          {sign === '||' ? (
                            <div className="w-[7px] h-7 flex justify-between mx-auto items-stretch select-none">
                              <div className="w-[1.5px] bg-amber-400 h-full"></div>
                              <div className="w-[1.5px] bg-amber-400 h-full"></div>
                            </div>
                          ) : sign === '-' ? (
                            <span className="text-rose-400 font-bold text-lg leading-none font-serif">−</span>
                          ) : sign === '+' ? (
                            <span className="text-emerald-400 font-bold text-lg leading-none font-serif">+</span>
                          ) : (
                            <span className="text-slate-200 font-bold"><Latex>{`$${sign}$`}</Latex></span>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-slate-900/90 h-20">
                      <td className="border-r border-slate-700 font-bold text-blue-300 align-middle"><Latex>$y$</Latex></td>
                      {diagram.yValues.map((yVal, i) => (
                        <td key={i} className={`px-2 font-bold ${yVal.pos === 'top' ? 'align-top pt-2 text-yellow-300' : 'align-bottom pb-2 text-cyan-300'}`}>
                          {yVal.isDoubleBar ? (
                            <div className="w-[7px] h-full flex justify-between mx-auto items-stretch select-none">
                              <div className="w-[1.5px] bg-amber-400 h-full"></div>
                              <div className="w-[1.5px] bg-amber-400 h-full"></div>
                            </div>
                          ) : (
                            <Latex>{`$${yVal.val}$`}</Latex>
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {diagram.notes && (
          <div className="text-[11px] md:text-xs text-slate-300 mt-2.5 text-center bg-slate-950/60 p-2 rounded-lg border border-slate-800">
            <Latex>{diagram.notes}</Latex>
          </div>
        )}
      </div>
    );
  }

  // 2. SVG ASYMPTOTE GRAPH
  if (diagram && diagram.type === 'asymptote_graph') {
    return (
      <div className="my-2.5 p-3 md:p-4 bg-slate-900/95 rounded-2xl border border-blue-500/40 shadow-lg text-white max-w-full text-center select-text">
        <div className="flex items-center justify-between mb-2">
          {diagram.title ? (
            <div className="text-xs md:text-sm font-bold text-yellow-400 flex items-center gap-1.5">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
              {diagram.title}
            </div>
          ) : <div></div>}

          {tikz && (
            <button
              type="button"
              onClick={() => setShowTikzCode(!showTikzCode)}
              className="text-[10px] md:text-xs text-blue-300 hover:text-yellow-300 px-2.5 py-1 rounded-lg bg-blue-950 border border-blue-600/40 flex items-center gap-1 transition-colors cursor-pointer"
            >
              {showTikzCode ? <Eye size={12} /> : <Code size={12} />}
              <span>{showTikzCode ? 'Xem hình vẽ' : 'Mã TikZ'}</span>
            </button>
          )}
        </div>

        {showTikzCode && tikz ? (
          renderTikzBlock()
        ) : (
          <div className="relative mx-auto w-full max-w-[340px] aspect-[4/3] bg-slate-950/90 rounded-xl border border-slate-700 flex items-center justify-center overflow-hidden shadow-inner">
            <svg viewBox="-120 -90 240 180" className="w-full h-full">
              {/* Grid Background */}
              <defs>
                <pattern id="math-grid-v2" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(148, 163, 184, 0.12)" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect x="-120" y="-90" width="240" height="180" fill="url(#math-grid-v2)" />

              {/* Axes Ox, Oy */}
              <line x1="-115" y1="0" x2="115" y2="0" stroke="#94a3b8" strokeWidth="1.2" />
              <polygon points="115,0 107,-3.5 107,3.5" fill="#94a3b8" />
              <text x="108" y="12" fill="#cbd5e1" fontSize="9" textAnchor="middle" fontWeight="bold">x</text>

              <line x1="0" y1="85" x2="0" y2="-85" stroke="#94a3b8" strokeWidth="1.2" />
              <polygon points="0,-85 -3.5,-77 3.5,-77" fill="#94a3b8" />
              <text x="8" y="-76" fill="#cbd5e1" fontSize="9" fontWeight="bold">y</text>
              <text x="-8" y="11" fill="#94a3b8" fontSize="8">O</text>

              {/* 1. HÌNH 1.37 SGK TRANG 43: y = (2x+1)/(x+1) */}
              {diagram.graphId === 'hyperbola_1_37' && (
                <>
                  <line x1="-25" y1="-85" x2="-25" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="-28" y="-70" fill="#f59e0b" fontSize="8" textAnchor="end" fontWeight="bold">x = -1 (TCĐ)</text>

                  <line x1="-115" y1="-50" x2="115" y2="-50" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="75" y="-54" fill="#38bdf8" fontSize="8" fontWeight="bold">y = 2 (TCN)</text>

                  {/* Hyperbola Left Branch: x < -1 -> y > 2 */}
                  <path d="M -115,-55 C -60,-58 -40,-65 -32,-85" fill="none" stroke="#ec4899" strokeWidth="2.2" />
                  
                  {/* Hyperbola Right Branch: x > -1 -> y < 2 */}
                  <path d="M -18,85 C -12,20 20,-42 115,-46" fill="none" stroke="#ec4899" strokeWidth="2.2" />

                  {/* Intercept Point (0, 1) */}
                  <circle cx="0" cy="-25" r="2.5" fill="#facc15" />
                  <text x="5" y="-22" fill="#facc15" fontSize="8" fontWeight="bold">(0; 1)</text>

                  {/* Center of symmetry I(-1, 2) */}
                  <circle cx="-25" cy="-50" r="2.5" fill="#38bdf8" />
                  <text x="-32" y="-52" fill="#38bdf8" fontSize="8" fontWeight="bold">I</text>
                </>
              )}

              {/* 2. HÌNH 1.38 SGK TRANG 43: y = (x^2-x+1)/(x+1) */}
              {diagram.graphId === 'rational_1_38' && (
                <>
                  <line x1="-25" y1="-85" x2="-25" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="-28" y="-70" fill="#f59e0b" fontSize="8" textAnchor="end" fontWeight="bold">x = -1 (TCĐ)</text>

                  {/* TCX: y = x - 2 */}
                  <line x1="-80" y1="85" x2="80" y2="-75" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="55" y="-62" fill="#a855f7" fontSize="8" fontWeight="bold">y = x - 2 (TCX)</text>

                  {/* Left branch x < -1: goes down to -inf as x -> -1- */}
                  <path d="M -115,82 Q -60,65 -32,85" fill="none" stroke="#38bdf8" strokeWidth="2.2" />

                  {/* Right branch x > -1: comes down from +inf as x -> -1+ */}
                  <path d="M -18,-85 Q -5,-15 115,-95" fill="none" stroke="#38bdf8" strokeWidth="2.2" />

                  {/* Intercept: (0, 1) */}
                  <circle cx="0" cy="-25" r="2.5" fill="#facc15" />
                  <text x="5" y="-22" fill="#facc15" fontSize="8" fontWeight="bold">(0; 1)</text>
                </>
              )}

              {/* 3. HÌNH 1.26 SGK TRANG 25: y = 2x^2 / (x^2-1) */}
              {diagram.graphId === 'rational_1_26' && (
                <>
                  <line x1="-30" y1="-85" x2="-30" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <line x1="30" y1="-85" x2="30" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="-33" y="-70" fill="#f59e0b" fontSize="7" textAnchor="end">x = -1</text>
                  <text x="33" y="-70" fill="#f59e0b" fontSize="7">x = 1</text>

                  <line x1="-115" y1="-40" x2="115" y2="-40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="75" y="-44" fill="#38bdf8" fontSize="8" fontWeight="bold">y = 2</text>

                  {/* Middle bell branch: concave DOWN from (0,0) towards -inf (+85 in screen coords) */}
                  <path d="M -22,85 Q 0,0 22,85" fill="none" stroke="#ec4899" strokeWidth="2.2" />
                  
                  {/* Left outer branch: above y = 2 */}
                  <path d="M -115,-44 Q -60,-48 -38,-85" fill="none" stroke="#ec4899" strokeWidth="2.2" />

                  {/* Right outer branch: above y = 2 */}
                  <path d="M 38,-85 Q 60,-48 115,-44" fill="none" stroke="#ec4899" strokeWidth="2.2" />

                  <circle cx="0" cy="0" r="2.5" fill="#facc15" />
                </>
              )}

              {/* 4. HÌNH 1.21 SGK TRANG 21: y = sqrt(x^2+1)/x */}
              {diagram.graphId === 'sqrt_1_21' && (
                <>
                  <line x1="-115" y1="-25" x2="115" y2="-25" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <line x1="-115" y1="25" x2="115" y2="25" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="65" y="-29" fill="#38bdf8" fontSize="8" fontWeight="bold">y = 1 (x → +∞)</text>
                  <text x="-110" y="21" fill="#38bdf8" fontSize="8" fontWeight="bold">y = -1 (x → -∞)</text>

                  {/* Left branch x < 0 */}
                  <path d="M -115,27 Q -50,30 -10,85" fill="none" stroke="#ec4899" strokeWidth="2.2" />

                  {/* Right branch x > 0 */}
                  <path d="M 10,-85 Q 50,-30 115,-27" fill="none" stroke="#ec4899" strokeWidth="2.2" />
                </>
              )}

              {/* 5. BÀI 1.36 SGK: y = (x^2+2x-2)/(x+2) = x - 2/(x+2) */}
              {diagram.graphId === 'rational_1_36' && (
                <>
                  <line x1="-40" y1="-85" x2="-40" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="-43" y="-70" fill="#f59e0b" fontSize="8" textAnchor="end" fontWeight="bold">x = -2 (TCĐ)</text>

                  <line x1="-85" y1="85" x2="85" y2="-85" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="50" y="-60" fill="#a855f7" fontSize="8" fontWeight="bold">y = x (TCX)</text>

                  {/* Left branch x < -2: y > x */}
                  <path d="M -115,-70 Q -60,-45 -48,-85" fill="none" stroke="#06b6d4" strokeWidth="2.2" />

                  {/* Right branch x > -2: y < x */}
                  <path d="M -32,85 Q -10,-10 95,-75" fill="none" stroke="#06b6d4" strokeWidth="2.2" />

                  <circle cx="0" cy="20" r="2.5" fill="#facc15" />
                  <text x="5" y="24" fill="#facc15" fontSize="8">(0; -1)</text>
                </>
              )}

              {/* 6. VÍ DỤ 4 SGK: y = (x^2+2)/x = x + 2/x */}
              {diagram.graphId === 'rational_ex4' && (
                <>
                  <line x1="0" y1="-85" x2="0" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="-5" y="-70" fill="#f59e0b" fontSize="8" textAnchor="end" fontWeight="bold">x = 0 (TCĐ)</text>

                  <line x1="-85" y1="85" x2="85" y2="-85" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="50" y="-60" fill="#a855f7" fontSize="8" fontWeight="bold">y = x (TCX)</text>

                  {/* Branch x > 0: local min at (sqrt(2), 2*sqrt(2)) */}
                  <path d="M 12,-85 Q 22,-58 35,-68 Q 65,-78 115,-100" fill="none" stroke="#10b981" strokeWidth="2.2" />

                  {/* Branch x < 0: local max at (-sqrt(2), -2*sqrt(2)) */}
                  <path d="M -12,85 Q -22,58 -35,68 Q -65,78 -115,100" fill="none" stroke="#10b981" strokeWidth="2.2" />

                  {/* Local Minimum Point A(√2; 2√2) */}
                  <line x1="35" y1="0" x2="35" y2="-68" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
                  <line x1="0" y1="-68" x2="35" y2="-68" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
                  <circle cx="35" cy="-68" r="2.5" fill="#facc15" />
                  <text x="38" y="-71" fill="#fde047" fontSize="7" fontWeight="bold">A(√2; 2√2) [y_CT]</text>

                  {/* Local Maximum Point B(-√2; -2√2) */}
                  <line x1="-35" y1="0" x2="-35" y2="68" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
                  <line x1="0" y1="68" x2="-35" y2="68" stroke="#94a3b8" strokeWidth="0.8" strokeDasharray="2 2" />
                  <circle cx="-35" cy="68" r="2.5" fill="#facc15" />
                  <text x="-38" y="73" fill="#fde047" fontSize="7" textAnchor="end" fontWeight="bold">B(-√2; -2√2) [y_CĐ]</text>
                </>
              )}

              {/* 7. SET 3 Q5: y = (3x+1)/(x-2) */}
              {diagram.graphId === 'hyperbola_set3_q5' && (
                <>
                  <line x1="40" y1="-85" x2="40" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="44" y="-70" fill="#f59e0b" fontSize="8" fontWeight="bold">x = 2</text>

                  <line x1="-115" y1="-45" x2="115" y2="-45" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="75" y="-49" fill="#38bdf8" fontSize="8" fontWeight="bold">y = 3</text>

                  <circle cx="40" cy="-45" r="3" fill="#ef4444" />
                  <text x="46" y="-38" fill="#fca5a5" fontSize="8" fontWeight="bold">I(2; 3)</text>

                  {/* Left branch x < 2: y < 3 */}
                  <path d="M -115,-40 Q -20,-35 30,85" fill="none" stroke="#3b82f6" strokeWidth="2.2" />

                  {/* Right branch x > 2: y > 3 */}
                  <path d="M 50,-85 Q 65,-55 115,-50" fill="none" stroke="#3b82f6" strokeWidth="2.2" />
                </>
              )}

              {/* 8. SET 3 Q8: y = (x-1)/sqrt(x^2-1) */}
              {diagram.graphId === 'sqrt_set3_q8' && (
                <>
                  <line x1="-30" y1="-85" x2="-30" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="-33" y="-70" fill="#f59e0b" fontSize="8" textAnchor="end" fontWeight="bold">x = -1</text>

                  <line x1="-115" y1="-25" x2="115" y2="-25" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="70" y="-29" fill="#38bdf8" fontSize="8" fontWeight="bold">y = 1</text>

                  <line x1="-115" y1="25" x2="115" y2="25" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="-110" y="21" fill="#38bdf8" fontSize="8" fontWeight="bold">y = -1</text>

                  {/* Left branch x < -1: goes to -inf at x -> -1- */}
                  <path d="M -115,22 Q -60,20 -38,85" fill="none" stroke="#a855f7" strokeWidth="2.2" />

                  {/* Right branch x > 1: starts at (1, 0) and climbs toward y = 1 */}
                  <path d="M 30,0 Q 55,-20 115,-24" fill="none" stroke="#a855f7" strokeWidth="2.2" />
                  <circle cx="30" cy="0" r="2" fill="#facc15" />
                </>
              )}

              {/* 9. SET 4 Q7: y = (2x-3)/(x+1) */}
              {diagram.graphId === 'hyperbola_set4_q7' && (
                <>
                  <line x1="-25" y1="-85" x2="-25" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="-28" y="-70" fill="#f59e0b" fontSize="8" textAnchor="end" fontWeight="bold">x = -1</text>

                  <line x1="-115" y1="-40" x2="115" y2="-40" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="75" y="-44" fill="#38bdf8" fontSize="8" fontWeight="bold">y = 2</text>

                  <circle cx="-25" cy="-40" r="3" fill="#ef4444" />
                  <text x="-20" y="-44" fill="#fca5a5" fontSize="8" fontWeight="bold">I(-1; 2)</text>

                  <path d="M -115,-35 Q -60,-30 -33,85" fill="none" stroke="#3b82f6" strokeWidth="2.2" />
                  <path d="M -17,-85 Q 20,-50 115,-43" fill="none" stroke="#3b82f6" strokeWidth="2.2" />
                </>
              )}

              {/* 10. SET 4 Q12: perpendicular asymptotes y = x and y = -x */}
              {diagram.graphId === 'perpendicular_asymptotes' && (
                <>
                  <line x1="-80" y1="80" x2="80" y2="-80" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="65" y="-68" fill="#f87171" fontSize="8" fontWeight="bold">y = x</text>

                  <line x1="-80" y1="-80" x2="80" y2="80" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="4 3" />
                  <text x="65" y="75" fill="#7dd3fc" fontSize="8" fontWeight="bold">y = -x</text>

                  {/* Curve 1: y = x + 1/x */}
                  <path d="M 15,-85 Q 30,-30 85,-75" fill="none" stroke="#10b981" strokeWidth="2" />
                  <path d="M -85,75 Q -30,30 -15,85" fill="none" stroke="#10b981" strokeWidth="2" />

                  {/* Curve 2: y = -x + 1/x */}
                  <path d="M 15,85 Q 30,30 85,75" fill="none" stroke="#fbbf24" strokeWidth="2" />
                  <path d="M -85,-75 Q -30,-30 -15,-85" fill="none" stroke="#fbbf24" strokeWidth="2" />

                  {/* Right angle symbol at origin */}
                  <path d="M 0,-8 L 8,0 L 0,8 L -8,0 Z" fill="none" stroke="#ffffff" strokeWidth="0.8" opacity="0.5" />
                  <text x="12" y="12" fill="#fde047" fontSize="8" fontWeight="bold">90°</text>
                </>
              )}

              {/* Fallback general oblique */}
              {(diagram.graphId === 'rational_oblique' || diagram.graphId === 'hyperbola_standard') && (
                <>
                  <line x1="20" y1="-85" x2="20" y2="85" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4 3" />
                  <line x1="-75" y1="85" x2="95" y2="-85" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" />
                  <path d="M -115,80 Q -20,20 10,-85" fill="none" stroke="#38bdf8" strokeWidth="2.2" />
                  <path d="M 30,85 Q 70,-40 115,-95" fill="none" stroke="#38bdf8" strokeWidth="2.2" />
                </>
              )}
            </svg>
          </div>
        )}

        {diagram.description && (
          <div className="text-[11px] text-slate-300 mt-2 italic">
            <Latex>{diagram.description}</Latex>
          </div>
        )}
      </div>
    );
  }

  // Fallback for standalone Tikz code block
  if (tikz) {
    return (
      <div className="my-2.5 p-3 bg-slate-950/90 rounded-xl border border-yellow-500/40 text-center overflow-x-auto text-xs md:text-sm font-mono text-blue-200 select-text">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800">
          <div className="text-[11px] text-yellow-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
            <FileCode2 size={13} /> Hình vẽ TikZ chuẩn LaTeX
          </div>
          <button
            type="button"
            onClick={handleCopyTikz}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/50 text-[10px] font-bold transition-all cursor-pointer"
          >
            {isCopied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
            <span>{isCopied ? 'Đã chép' : 'Sao chép'}</span>
          </button>
        </div>
        <pre className="text-emerald-300 font-mono text-[11px] text-left whitespace-pre-wrap bg-slate-900/80 p-2.5 rounded-lg border border-slate-700">
          {tikz}
        </pre>
      </div>
    );
  }

  return null;
};
