import React, { useState, useEffect } from 'react';
import { Email, ModelWeights, PredictionResult } from '../types';
import { featuresList, predict, extractFeatures } from '../utils/model';
import { HelpCircle, AlertTriangle, ShieldCheck, Cpu, ChevronRight, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SandboxPanelProps {
  model: ModelWeights | null;
  selectedEmail: Email | null;
  onEmailUpdate: (email: Email) => void;
}

export default function SandboxPanel({
  model,
  selectedEmail,
  onEmailUpdate
}: SandboxPanelProps) {
  const [draft, setDraft] = useState<Email>({
    id: 'sandbox-draft',
    sender: '',
    subject: '',
    body: '',
    label: 'Phishing'
  });

  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  // Sync draft with selected email
  useEffect(() => {
    if (selectedEmail) {
      setDraft({ ...selectedEmail });
    }
  }, [selectedEmail]);

  const handleFieldChange = (field: keyof Email, value: string) => {
    const updatedDraft = { ...draft, [field]: value };
    setDraft(updatedDraft);
    // Propagate changes if selecting a real email
    if (selectedEmail && selectedEmail.id !== 'sandbox-draft') {
      onEmailUpdate(updatedDraft);
    }
  };

  const getPrediction = (): PredictionResult | null => {
    if (!model) return null;
    return predict(draft, model);
  };

  const prediction = getPrediction();

  // Helper to color codes
  const getDangerColor = (prob: number) => {
    if (prob < 0.2) return 'bg-emerald-500';
    if (prob < 0.5) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getDangerText = (prob: number) => {
    if (prob < 0.2) return 'Safe (Legitimate)';
    if (prob < 0.5) return 'Suspicious (Warning)';
    return 'Phishing Detected';
  };

  const getBgColorClass = (prob: number) => {
    if (prob < 0.2) return 'bg-emerald-50 border-emerald-100 text-emerald-800';
    if (prob < 0.5) return 'bg-amber-50 border-amber-100 text-amber-800';
    return 'bg-rose-50 border-rose-100 text-rose-800';
  };

  // Extract raw values of features currently in draft to display in the chart list
  const currentFeatures = extractFeatures(draft);

  return (
    <div id="sandbox-panel" className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h2 className="text-base font-semibold text-slate-900">Interactive Predictor & Features</h2>
        </div>
        <button
          onClick={() => {
            setDraft({
              id: 'sandbox-draft',
              sender: 'support@legitcompany.com',
              subject: 'Urgent notice regarding security verification',
              body: 'Please verify your password immediately by clicking here: http://suspicious-link.net/login',
              label: 'Phishing'
            });
          }}
          className="text-[11px] px-2.5 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold rounded-md transition-all cursor-pointer"
        >
          Load Blank Template
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Real-time Predictor Result */}
        <div>
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Model Inference (Real-time)
          </h3>

          {!model ? (
            <div className="p-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 text-center text-xs text-slate-500 leading-normal">
              ⚠️ <strong>Classifier Untrained</strong>: Please train the model in the center panel first to enable live predictions and feature contribution graphs.
            </div>
          ) : (
            prediction && (
              <div className={`p-4 rounded-xl border transition-all duration-300 ${getBgColorClass(prediction.probability)}`}>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
                      Prediction Result
                    </span>
                    <div className="text-base font-bold flex items-center gap-1.5">
                      {prediction.probability >= 0.5 ? (
                        <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                      )}
                      {getDangerText(prediction.probability)}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-80 block">
                      Phishing Prob
                    </span>
                    <span className="text-xl font-mono font-black">
                      {(prediction.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar representing risk probability */}
                <div className="w-full bg-black/10 h-2.5 rounded-full overflow-hidden mt-3.5 mb-1 relative">
                  <motion.div
                    className={`h-full ${getDangerColor(prediction.probability)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.probability * 100}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                  <div className="absolute right-1/2 translate-x-1/2 top-0 h-full w-[2px] bg-slate-400/50" title="Decision Boundary (50%)"></div>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 font-mono mt-1">
                  <span>0% (Perfectly Safe)</span>
                  <span className="font-semibold text-slate-500">Decision Threshold (50%)</span>
                  <span>100% (Certain Phishing)</span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Email Editor Sandbox */}
        <div className="space-y-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Email Content Editor
          </div>
          
          <div className="space-y-2.5 text-xs">
            {/* Sender */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-semibold text-slate-600">Sender Email</span>
                {selectedEmail && selectedEmail.id !== 'sandbox-draft' && (
                  <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 rounded-sm">Editing selected mail</span>
                )}
              </div>
              <input
                type="text"
                value={draft.sender}
                onChange={(e) => handleFieldChange('sender', e.target.value)}
                placeholder="sender@domain.com"
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>

            {/* Subject */}
            <div>
              <span className="font-semibold text-slate-600 block mb-1">Subject</span>
              <input
                type="text"
                value={draft.subject}
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                placeholder="Subject Line"
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15"
              />
            </div>

            {/* Body */}
            <div>
              <span className="font-semibold text-slate-600 block mb-1">Body Text</span>
              <textarea
                value={draft.body}
                rows={5}
                onChange={(e) => handleFieldChange('body', e.target.value)}
                placeholder="Email body content..."
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-sans focus:outline-hidden focus:ring-2 focus:ring-indigo-500/15 text-[11px] leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Feature Weights & Contributions */}
        {model && (
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Trained Feature Importance</span>
              <span className="text-[9px] text-slate-400 font-mono font-normal">Weights Range: [-∞, +∞]</span>
            </h3>

            <div className="space-y-2">
              {featuresList.map(feat => {
                const weight = model.weights[feat.id] || 0;
                const valueInDraft = currentFeatures[feat.id] || 0;
                const isActivated = valueInDraft > 0;
                
                // Scale bar calculations for UI: max weight approx +/- 4.0
                const maxDisplayWeight = 4.0;
                const percentage = Math.min(Math.abs(weight) / maxDisplayWeight * 100, 100);
                const isPositive = weight >= 0;

                return (
                  <div
                    key={feat.id}
                    onMouseEnter={() => setHoveredFeature(feat.id)}
                    onMouseLeave={() => setHoveredFeature(null)}
                    className={`p-2 rounded-lg border transition-all ${
                      isActivated
                        ? isPositive
                          ? 'bg-rose-50/40 border-rose-100/50'
                          : 'bg-emerald-50/40 border-emerald-100/50'
                        : 'bg-white border-slate-50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-2 h-2 rounded-full shrink-0 ${
                          isActivated
                            ? isPositive ? 'bg-rose-500' : 'bg-emerald-500'
                            : 'bg-slate-200'
                        }`} />
                        <span className="font-semibold text-slate-700 truncate">{feat.name}</span>
                        {isActivated && (
                          <span className={`text-[9px] px-1 py-0.2 rounded-sm shrink-0 ${
                            isPositive ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            Val: {valueInDraft.toFixed(1)}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-semibold">
                        Weight: <span className={weight >= 0 ? 'text-rose-600' : 'text-emerald-600'}>
                          {weight >= 0 ? '+' : ''}{weight.toFixed(2)}
                        </span>
                      </span>
                    </div>

                    {/* Horizontal slider bar showing coefficient */}
                    <div className="w-full h-1.5 bg-slate-100 rounded-full relative overflow-hidden flex">
                      {/* Zero line */}
                      <div className="absolute left-1/2 top-0 h-full w-[1.5px] bg-slate-300 z-10" />
                      
                      {/* Negative weights (left side) */}
                      {!isPositive && (
                        <div className="w-1/2 flex justify-end">
                          <motion.div
                            className="bg-emerald-500 rounded-l-full"
                            style={{ width: `${percentage}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                      
                      {/* Spacer for empty half */}
                      {!isPositive && <div className="w-1/2" />}
                      
                      {/* Spacer for empty half */}
                      {isPositive && <div className="w-1/2" />}
                      
                      {/* Positive weights (right side) */}
                      {isPositive && (
                        <div className="w-1/2">
                          <motion.div
                            className="bg-rose-500 rounded-r-full h-full"
                            style={{ width: `${percentage}%` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Explanation box on hover */}
            <AnimatePresence>
              {hoveredFeature && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="mt-3 p-3 bg-slate-900 text-slate-100 rounded-xl text-xs flex items-start gap-2.5 shadow-md leading-relaxed border border-slate-800"
                >
                  <Info className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-bold text-slate-200">
                      {featuresList.find(f => f.id === hoveredFeature)?.name}
                    </div>
                    <p className="text-slate-300 text-[11px] mt-0.5">
                      {featuresList.find(f => f.id === hoveredFeature)?.description}
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono mt-1.5 bg-black/40 p-1.5 rounded-md border border-slate-800">
                      Coefficient: <span className="font-bold">
                        {(model.weights[hoveredFeature] || 0).toFixed(4)}
                      </span>
                      {' '}({
                        (model.weights[hoveredFeature] || 0) >= 0 
                          ? 'Increases risk of classifying as Phishing' 
                          : 'Decreases risk / protects as Safe email'
                      })
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
