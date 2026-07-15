/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Email, TrainingConfig, EpochLog, EvaluationMetrics, ModelWeights } from './types';
import { presetEmails } from './data/emails';
import { featuresList, initializeWeights, sigmoid, evaluateModel, extractFeatures } from './utils/model';
import DatasetPanel from './components/DatasetPanel';
import TrainingPanel from './components/TrainingPanel';
import SandboxPanel from './components/SandboxPanel';
import { ShieldAlert, Cpu, Sparkles, BookOpen, AlertCircle, Info, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [emails, setEmails] = useState<Email[]>(presetEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  
  // Training configurations
  const [config, setConfig] = useState<TrainingConfig>({
    learningRate: 0.15,
    epochs: 100,
    regularization: 0.05,
    trainSplit: 0.75
  });

  // ML State
  const [model, setModel] = useState<ModelWeights | null>(null);
  const [history, setHistory] = useState<EpochLog[]>([]);
  const [metrics, setMetrics] = useState<EvaluationMetrics | null>(null);
  const [isTraining, setIsTraining] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Initialize with the first email selected
  useEffect(() => {
    if (emails.length > 0 && !selectedEmail) {
      setSelectedEmail(emails[0]);
    }
  }, [emails, selectedEmail]);

  // Handle Select Email
  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
  };

  // Sync edited email from sandbox back to dataset
  const handleEmailUpdate = (updatedEmail: Email) => {
    setEmails(prev => prev.map(e => e.id === updatedEmail.id ? updatedEmail : e));
    setSelectedEmail(updatedEmail);
  };

  // Add custom email to dataset
  const handleAddCustomEmail = (newEmail: Omit<Email, 'id' | 'isCustom'>) => {
    const customEmail: Email = {
      ...newEmail,
      id: `custom-${Date.now()}`,
      isCustom: true
    };
    setEmails(prev => [customEmail, ...prev]);
    setSelectedEmail(customEmail); // Auto-select the newly added custom email
  };

  // Delete custom email
  const handleDeleteCustomEmail = (id: string) => {
    setEmails(prev => prev.filter(e => e.id !== id));
    if (selectedEmail?.id === id) {
      setSelectedEmail(emails.find(e => e.id !== id) || null);
    }
  };

  // Reset Model weights and training history
  const handleReset = () => {
    setModel(null);
    setHistory([]);
    setMetrics(null);
    setIsTraining(false);
  };

  // Main Asynchronous Training loop
  const handleTrain = async () => {
    if (isTraining) return;
    
    setIsTraining(true);
    setHistory([]);
    setMetrics(null);

    // 1. Train / Test Split
    // Shuffle dataset to ensure independent distributions
    const shuffled = [...emails].sort(() => Math.random() - 0.5);
    const splitIdx = Math.round(shuffled.length * config.trainSplit);
    
    const trainSet = shuffled.slice(0, splitIdx);
    const valSet = shuffled.slice(splitIdx);

    const N = trainSet.length;
    if (N === 0) {
      setIsTraining(false);
      return;
    }

    // Pre-extract vectors for performance
    const trainVectors = trainSet.map(email => ({
      vector: extractFeatures(email),
      label: email.label === 'Phishing' ? 1 : 0
    }));

    const valVectors = valSet.map(email => ({
      vector: extractFeatures(email),
      label: email.label === 'Phishing' ? 1 : 0
    }));

    // Initialize clean weight coefficients
    let currentModel = initializeWeights();
    const alpha = config.learningRate;
    const lambda = config.regularization;
    
    const localHistory: EpochLog[] = [];

    // Step-by-step Gradient Descent loop
    for (let epoch = 1; epoch <= config.epochs; epoch++) {
      let lossSum = 0;
      
      // Initialize gradients
      let g_bias = 0;
      const g_w: { [featureId: string]: number } = {};
      featuresList.forEach(feat => {
        g_w[feat.id] = 0;
      });

      // Accumulate gradients across the training batch
      trainVectors.forEach(sample => {
        let z = currentModel.bias;
        featuresList.forEach(feat => {
          z += (currentModel.weights[feat.id] || 0) * (sample.vector[feat.id] || 0);
        });
        
        const prob = sigmoid(z);
        const error = prob - sample.label;
        
        // Loss calculation (Binary Cross Entropy with epsilon guard)
        const eps = 1e-15;
        lossSum += -(sample.label * Math.log(prob + eps) + (1 - sample.label) * Math.log(1 - prob + eps));
        
        g_bias += error;
        featuresList.forEach(feat => {
          g_w[feat.id] += error * (sample.vector[feat.id] || 0);
        });
      });

      // Regularization penalty for weights (L2)
      let l2Penalty = 0;
      featuresList.forEach(feat => {
        const wVal = currentModel.weights[feat.id] || 0;
        l2Penalty += wVal * wVal;
      });

      const avgLoss = (lossSum / N) + (lambda / (2 * N)) * l2Penalty;

      // Update Weights (Gradient Descent step)
      currentModel.bias = currentModel.bias - alpha * (g_bias / N);
      featuresList.forEach(feat => {
        const wVal = currentModel.weights[feat.id] || 0;
        const grad = (g_w[feat.id] / N) + (lambda / N) * wVal;
        currentModel.weights[feat.id] = wVal - alpha * grad;
      });

      // Compute Train Accuracy
      let trainCorrect = 0;
      trainVectors.forEach(sample => {
        let z = currentModel.bias;
        featuresList.forEach(feat => {
          z += (currentModel.weights[feat.id] || 0) * (sample.vector[feat.id] || 0);
        });
        const prob = sigmoid(z);
        const pred = prob >= 0.5 ? 1 : 0;
        if (pred === sample.label) {
          trainCorrect++;
        }
      });
      const trainAccuracy = trainCorrect / N;

      // Compute Validation Accuracy
      let valCorrect = 0;
      valVectors.forEach(sample => {
        let z = currentModel.bias;
        featuresList.forEach(feat => {
          z += (currentModel.weights[feat.id] || 0) * (sample.vector[feat.id] || 0);
        });
        const prob = sigmoid(z);
        const pred = prob >= 0.5 ? 1 : 0;
        if (pred === sample.label) {
          valCorrect++;
        }
      });
      const valAccuracy = valVectors.length > 0 ? valCorrect / valVectors.length : trainAccuracy;

      const epochLog: EpochLog = {
        epoch,
        loss: avgLoss,
        trainAccuracy,
        valAccuracy
      };
      
      localHistory.push(epochLog);

      // Decouple updates to give the UI breathing room to animate smoothly
      // Update UI every 2 epochs, or on the final epoch
      const shouldUpdateUI = epoch % Math.max(1, Math.round(config.epochs / 50)) === 0 || epoch === config.epochs;
      
      if (shouldUpdateUI) {
        setHistory([...localHistory]);
        setModel({ ...currentModel });
        // Tiny artificial timeout lets browser cycle repaint layouts
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    // Evaluate final performance metrics on validation set (or training set if validation is empty)
    const evalSet = valSet.length > 0 ? valSet : trainSet;
    const finalMetrics = evaluateModel(evalSet, currentModel);
    
    setMetrics(finalMetrics);
    setIsTraining(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex flex-col selection:bg-indigo-500/10 selection:text-indigo-950">
      
      {/* Top Header */}
      <header className="bg-white border-b border-slate-100 py-4 px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                Phishing Email Detection Model
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                An interactive machine learning sandbox implementing Logistic Regression in TypeScript
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:border-slate-300 text-slate-600 font-semibold text-xs rounded-lg transition-all cursor-pointer bg-white"
            >
              <BookOpen className="w-3.5 h-3.5" />
              {showExplanation ? 'Hide Core Concepts' : 'How It Works'}
            </button>
            
            <span className="text-xs font-mono bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg border border-indigo-100/50 font-bold">
              LR Classifier 1.0.0
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        
        {/* Concepts Explanation Drawer */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm text-xs space-y-4 text-slate-600">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  Understanding the Mathematical Pipeline
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Step 1 */}
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-mono text-[10px]">1</span>
                      Feature Extraction
                    </div>
                    <p className="leading-relaxed">
                      Every email is parsed into a numerical feature vector. Features represent safety flags or scam patterns (e.g. presence of dollar figures, raw IP addresses, generic greetings) scaled between 0 and 1.
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-mono text-[10px]">2</span>
                      Logistic Regression Weighting
                    </div>
                    <p className="leading-relaxed">
                      We compute a linear sum of features multiplied by their trained weights, plus a bias. <strong>Positive weights</strong> push predictions toward Phishing, while <strong>negative weights</strong> indicate Safe.
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-1.5">
                    <div className="font-bold text-slate-800 flex items-center gap-1">
                      <span className="w-5 h-5 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 font-mono text-[10px]">3</span>
                      Sigmoid Probability Activation
                    </div>
                    <p className="leading-relaxed">
                      The sum is activated by the Sigmoid function to output a probability from 0% to 100%. If probability is 50% or higher, we classify as <strong>Phishing</strong>, otherwise <strong>Safe</strong>.
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-start gap-2 text-[11px] leading-relaxed">
                  <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                  <div>
                    <strong>Pro Tip:</strong> Try adding a custom email with urgent phrases, then train the model to see the coefficient bar increase! You can also tweak <strong>L2 Regularization</strong> to penalize large weights and prevent overfitting.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Dataset & Parameters */}
          <div className="lg:col-span-1 h-full min-h-[500px]">
            <DatasetPanel
              emails={emails}
              selectedEmail={selectedEmail}
              onSelectEmail={handleSelectEmail}
              onAddCustomEmail={handleAddCustomEmail}
              onDeleteCustomEmail={handleDeleteCustomEmail}
              config={config}
              onConfigChange={setConfig}
              isTraining={isTraining}
            />
          </div>

          {/* Column 2: Training Engine & Metrics */}
          <div className="lg:col-span-1 h-full min-h-[500px]">
            <TrainingPanel
              metrics={metrics}
              history={history}
              isTraining={isTraining}
              onTrain={handleTrain}
              onReset={handleReset}
              epochsRun={history.length}
              totalEpochs={config.epochs}
            />
          </div>

          {/* Column 3: Feature Weights & Interactive Sandbox */}
          <div className="lg:col-span-1 h-full min-h-[500px]">
            <SandboxPanel
              model={model}
              selectedEmail={selectedEmail}
              onEmailUpdate={handleEmailUpdate}
            />
          </div>
        </div>
      </main>

      {/* Decorative Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-400" />
            <span>Built with React 19, TypeScript, and Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Machine Learning Sandbox</span>
            <span className="text-slate-200">|</span>
            <span>No external server required</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

