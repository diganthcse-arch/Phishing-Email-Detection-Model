import React, { useState } from 'react';
import { EpochLog, EvaluationMetrics } from '../types';
import { Play, RotateCcw, AlertCircle, Sparkles, TrendingDown, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface TrainingPanelProps {
  metrics: EvaluationMetrics | null;
  history: EpochLog[];
  isTraining: boolean;
  onTrain: () => void;
  onReset: () => void;
  epochsRun: number;
  totalEpochs: number;
}

export default function TrainingPanel({
  metrics,
  history,
  isTraining,
  onTrain,
  onReset,
  epochsRun,
  totalEpochs
}: TrainingPanelProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // SVG Gauge helper
  const renderRingGauge = (value: number, label: string, colorClass: string, strokeColor: string) => {
    const percentage = Math.round(value * 100);
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value * circumference);

    return (
      <div className="flex flex-col items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100/50">
        <div className="relative w-18 h-18">
          <svg className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="36"
              cy="36"
              r={radius}
              className="stroke-slate-100 fill-none"
              strokeWidth="6"
            />
            {/* Progress ring */}
            <motion.circle
              cx="36"
              cy="36"
              r={radius}
              className={`fill-none ${strokeColor}`}
              strokeWidth="6"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-sm font-bold text-slate-800">
            {percentage}%
          </div>
        </div>
        <span className="text-[11px] font-medium text-slate-500 mt-2 text-center">{label}</span>
      </div>
    );
  };

  // SVG Loss Curve Generator
  const renderLossCurve = () => {
    if (history.length < 2) {
      return (
        <div className="h-28 flex flex-col items-center justify-center border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
          <TrendingDown className="w-5 h-5 text-slate-300 mb-1" />
          <span className="text-[11px] text-slate-400">Train the model to visualize the loss curve</span>
        </div>
      );
    }

    const width = 340;
    const height = 110;
    const padding = 15;

    const maxLoss = Math.max(...history.map(h => h.loss), 0.1);
    const minLoss = Math.min(...history.map(h => h.loss));
    const lossRange = maxLoss - minLoss || 0.1;

    const points = history.map((item, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - 2 * padding);
      // invert Y as SVG (0,0) is top left
      const y = height - padding - ((item.loss - minLoss) / lossRange) * (height - 2 * padding);
      return `${x},${y}`;
    }).join(' ');

    const valPoints = history.map((item, idx) => {
      const x = padding + (idx / (history.length - 1)) * (width - 2 * padding);
      const valAcc = item.valAccuracy;
      const y = height - padding - (valAcc * (height - 2 * padding));
      return `${x},${y}`;
    }).join(' ');

    return (
      <div className="bg-slate-900 text-slate-100 p-4 rounded-xl shadow-xs border border-slate-800">
        <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mb-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-rose-400 inline-block"></span>
              Loss: {history[history.length - 1].loss.toFixed(4)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-0.5 bg-indigo-400 inline-block"></span>
              Val Accuracy: {(history[history.length - 1].valAccuracy * 100).toFixed(0)}%
            </span>
          </div>
          <span>Epoch {history[history.length - 1].epoch}/{totalEpochs}</span>
        </div>
        
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-24">
          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#334155" strokeWidth="1" />
          
          {/* Loss path (Rose line) */}
          <motion.polyline
            fill="none"
            stroke="#f43f5e"
            strokeWidth="2.5"
            points={points}
            strokeDasharray="400"
            strokeDashoffset="0"
          />

          {/* Validation Accuracy path (Indigo line) */}
          <motion.polyline
            fill="none"
            stroke="#6366f1"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            points={valPoints}
          />
        </svg>
      </div>
    );
  };

  const matrix = metrics?.confusionMatrix || { tp: 0, fp: 0, tn: 0, fn: 0 };
  const totalPreds = matrix.tp + matrix.fp + matrix.tn + matrix.fn;

  // Percentage helper
  const cellPct = (val: number) => {
    if (totalPreds === 0) return '0%';
    return `${Math.round((val / totalPreds) * 100)}%`;
  };

  return (
    <div id="training-panel" className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-900">Training & Evaluation</h2>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
            isTraining
              ? 'bg-amber-100 text-amber-700 animate-pulse'
              : metrics
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-slate-100 text-slate-500'
          }`}>
            {isTraining ? 'Training...' : metrics ? 'Model Trained' : 'Untrained'}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onTrain}
            disabled={isTraining}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm transition-all shadow-xs cursor-pointer ${
              isTraining
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md'
            }`}
          >
            <Play className={`w-4 h-4 ${isTraining ? 'animate-spin' : ''}`} />
            {isTraining ? 'Training Engine...' : metrics ? 'Retrain Model' : 'Train Model'}
          </button>
          
          <button
            onClick={onReset}
            disabled={isTraining || history.length === 0}
            className="flex items-center justify-center p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 disabled:text-slate-300 disabled:hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title="Reset weights and history"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Loss Sparkline Chart */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Convergence Curve
          </h3>
          {renderLossCurve()}
        </div>

        {/* Performance Metrics */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Evaluation Metrics (Validation Set)
          </h3>
          {metrics ? (
            <div className="grid grid-cols-4 gap-2">
              {renderRingGauge(metrics.accuracy, 'Accuracy', 'text-indigo-600', 'stroke-indigo-600')}
              {renderRingGauge(metrics.precision, 'Precision', 'text-emerald-600', 'stroke-emerald-600')}
              {renderRingGauge(metrics.recall, 'Recall', 'text-amber-500', 'stroke-amber-500')}
              {renderRingGauge(metrics.f1Score, 'F1 Score', 'text-pink-600', 'stroke-pink-600')}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/30 text-xs text-slate-400">
              Train model to view performance metrics.
            </div>
          )}
        </div>

        {/* Confusion Matrix */}
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Confusion Matrix
            </h3>
            <div className="group relative">
              <HelpCircle className="w-3.5 h-3.5 text-slate-400 hover:text-indigo-600 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-2 bg-slate-900 text-slate-100 text-[10px] rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-lg leading-normal">
                Shows the classifier accuracy on safe/phishing emails.
                <ul className="list-disc pl-3 mt-1 space-y-0.5">
                  <li><strong>TP</strong>: Phishing caught correctly.</li>
                  <li><strong>FP</strong>: Safe flagged as Phishing.</li>
                  <li><strong>TN</strong>: Safe identified correctly.</li>
                  <li><strong>FN</strong>: Phishing missed (Dangerous!).</li>
                </ul>
              </div>
            </div>
          </div>

          {metrics ? (
            <div className="relative">
              {/* Matrix Layout */}
              <div className="grid grid-cols-5 gap-1 text-[11px]">
                {/* Blank top left corner */}
                <div className="col-span-1"></div>
                {/* Predicted Header */}
                <div className="col-span-4 text-center font-semibold text-slate-500 uppercase tracking-wider text-[9px] mb-1">
                  Predicted Class
                </div>

                {/* Sub headers */}
                <div className="col-span-1"></div>
                <div className="text-center font-medium text-slate-400">Phishing</div>
                <div className="text-center font-medium text-slate-400">Safe</div>
                <div className="col-span-2 text-center text-slate-400 font-medium">Total</div>

                {/* Row 1: Actual Phishing */}
                <div className="font-semibold text-slate-500 flex items-center justify-end pr-2 text-[9px] uppercase leading-tight text-right shrink-0">
                  Actual<br/>Phish
                </div>
                {/* TP cell */}
                <div
                  onMouseEnter={() => setHoveredCell('tp')}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 text-center transition-all hover:bg-emerald-100/70 cursor-pointer"
                >
                  <div className="text-lg font-mono font-bold text-emerald-700">{matrix.tp}</div>
                  <div className="text-[9px] text-emerald-600 font-medium">TP ({cellPct(matrix.tp)})</div>
                </div>
                {/* FN cell (missed!) */}
                <div
                  onMouseEnter={() => setHoveredCell('fn')}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="bg-rose-50/70 border border-rose-100 rounded-lg p-3 text-center transition-all hover:bg-rose-100/70 cursor-pointer"
                >
                  <div className="text-lg font-mono font-bold text-rose-700">{matrix.fn}</div>
                  <div className="text-[9px] text-rose-600 font-medium">FN ({cellPct(matrix.fn)})</div>
                </div>
                {/* Actual Phishing total */}
                <div className="col-span-2 flex items-center justify-center font-mono text-slate-400 font-medium border-l border-slate-100 pl-2">
                  {matrix.tp + matrix.fn}
                </div>

                {/* Row 2: Actual Safe */}
                <div className="font-semibold text-slate-500 flex items-center justify-end pr-2 text-[9px] uppercase leading-tight text-right shrink-0">
                  Actual<br/>Safe
                </div>
                {/* FP cell */}
                <div
                  onMouseEnter={() => setHoveredCell('fp')}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="bg-amber-50/70 border border-amber-100 rounded-lg p-3 text-center transition-all hover:bg-amber-100/70 cursor-pointer"
                >
                  <div className="text-lg font-mono font-bold text-amber-700">{matrix.fp}</div>
                  <div className="text-[9px] text-amber-600 font-medium">FP ({cellPct(matrix.fp)})</div>
                </div>
                {/* TN cell */}
                <div
                  onMouseEnter={() => setHoveredCell('tn')}
                  onMouseLeave={() => setHoveredCell(null)}
                  className="bg-indigo-50/70 border border-indigo-100 rounded-lg p-3 text-center transition-all hover:bg-indigo-100/70 cursor-pointer"
                >
                  <div className="text-lg font-mono font-bold text-indigo-700">{matrix.tn}</div>
                  <div className="text-[9px] text-indigo-600 font-medium">TN ({cellPct(matrix.tn)})</div>
                </div>
                {/* Actual Safe total */}
                <div className="col-span-2 flex items-center justify-center font-mono text-slate-400 font-medium border-l border-slate-100 pl-2">
                  {matrix.fp + matrix.tn}
                </div>
              </div>

              {/* Explanatory subtitle on hover */}
              <div className="mt-3 h-10 text-center text-xs text-slate-500 leading-relaxed bg-slate-50 rounded-lg p-1.5 border border-slate-100/60 font-medium">
                {hoveredCell === 'tp' && (
                  <span className="text-emerald-700">🟢 <strong>True Positive</strong>: Correctly caught phishing emails. Goal is to maximize this.</span>
                )}
                {hoveredCell === 'fn' && (
                  <span className="text-rose-700">🔴 <strong>False Negative</strong>: Phishing emails missed (dangerous)! They landed in inbox.</span>
                )}
                {hoveredCell === 'fp' && (
                  <span className="text-amber-700">🟡 <strong>False Positive</strong>: Safe emails flagged as phishing. (Spam folder false alarm).</span>
                )}
                {hoveredCell === 'tn' && (
                  <span className="text-indigo-700">🔵 <strong>True Negative</strong>: Correctly identified legitimate emails. Safe delivery.</span>
                )}
                {!hoveredCell && (
                  <span className="text-slate-400">Hover over any matrix quadrant to analyze classification types.</span>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/30 text-xs text-slate-400">
              Train model to compile confusion matrix.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
