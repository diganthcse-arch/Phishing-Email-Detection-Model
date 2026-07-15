import React, { useState } from 'react';
import { Email, TrainingConfig } from '../types';
import { Plus, Search, ShieldAlert, ShieldCheck, Sliders, Mail, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DatasetPanelProps {
  emails: Email[];
  selectedEmail: Email | null;
  onSelectEmail: (email: Email) => void;
  onAddCustomEmail: (email: Omit<Email, 'id' | 'isCustom'>) => void;
  onDeleteCustomEmail: (id: string) => void;
  config: TrainingConfig;
  onConfigChange: (config: TrainingConfig) => void;
  isTraining: boolean;
}

export default function DatasetPanel({
  emails,
  selectedEmail,
  onSelectEmail,
  onAddCustomEmail,
  onDeleteCustomEmail,
  config,
  onConfigChange,
  isTraining
}: DatasetPanelProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'phish' | 'safe' | 'custom'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Custom Email form state
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [label, setLabel] = useState<'Phishing' | 'Safe'>('Phishing');
  const [formError, setFormError] = useState('');

  const filteredEmails = emails.filter(email => {
    // Filter by tab
    if (activeTab === 'phish' && email.label !== 'Phishing') return false;
    if (activeTab === 'safe' && email.label !== 'Safe') return false;
    if (activeTab === 'custom' && !email.isCustom) return false;
    
    // Filter by search
    const query = searchTerm.toLowerCase();
    return (
      email.subject.toLowerCase().includes(query) ||
      email.sender.toLowerCase().includes(query) ||
      email.body.toLowerCase().includes(query)
    );
  });

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sender.trim() || !subject.trim() || !body.trim()) {
      setFormError('All fields are required.');
      return;
    }
    if (!sender.includes('@')) {
      setFormError('Please enter a valid sender email address.');
      return;
    }
    
    onAddCustomEmail({
      sender: sender.trim(),
      subject: subject.trim(),
      body: body.trim(),
      label
    });

    // Reset form
    setSender('');
    setSubject('');
    setBody('');
    setLabel('Phishing');
    setFormError('');
    setShowAddForm(false);
  };

  return (
    <div id="dataset-panel" className="flex flex-col h-full bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-50 bg-slate-50/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-semibold text-slate-900">Hyperparameters & Dataset</h2>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-200/60 text-slate-700 font-medium">
            Dataset Size: {emails.length}
          </span>
        </div>

        {/* Hyperparameter controls */}
        <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-xs mb-4">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Model Parameters</div>
          
          {/* Learning Rate */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Learning Rate (α)</span>
              <span className="font-mono font-bold text-indigo-600">{config.learningRate}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.5"
              step="0.01"
              disabled={isTraining}
              value={config.learningRate}
              onChange={(e) => onConfigChange({ ...config, learningRate: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
            />
          </div>

          {/* L2 Regularization */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>L2 Regularization (λ)</span>
              <span className="font-mono font-bold text-indigo-600">{config.regularization}</span>
            </div>
            <input
              type="range"
              min="0.00"
              max="0.2"
              step="0.01"
              disabled={isTraining}
              value={config.regularization}
              onChange={(e) => onConfigChange({ ...config, regularization: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
            />
          </div>

          {/* Training Epochs */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Training Epochs</span>
              <span className="font-mono font-bold text-indigo-600">{config.epochs}</span>
            </div>
            <input
              type="range"
              min="10"
              max="200"
              step="10"
              disabled={isTraining}
              value={config.epochs}
              onChange={(e) => onConfigChange({ ...config, epochs: parseInt(e.target.value) })}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
            />
          </div>

          {/* Train Split */}
          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Train/Val Split Ratio</span>
              <span className="font-mono font-bold text-indigo-600">{Math.round(config.trainSplit * 100)}% / {Math.round((1 - config.trainSplit) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.9"
              step="0.05"
              disabled={isTraining}
              value={config.trainSplit}
              onChange={(e) => onConfigChange({ ...config, trainSplit: parseFloat(e.target.value) })}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search emails..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          <div className="flex bg-slate-200/40 p-0.5 rounded-lg text-xs font-medium">
            {(['all', 'phish', 'safe', 'custom'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-1.5 rounded-md text-center capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab === 'phish' ? 'Phishing' : tab === 'safe' ? 'Safe' : tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email List container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[380px]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Emails ({filteredEmails.length})
          </span>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Custom
          </button>
        </div>

        {/* Add custom email form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmitCustom}
              className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 mb-3 space-y-2 overflow-hidden text-xs"
            >
              <div className="font-semibold text-indigo-950 mb-1">Create Custom Training Email</div>
              {formError && <div className="text-rose-500 font-medium mb-1">{formError}</div>}
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Sender Email</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. alert@security-verify.com"
                    value={sender}
                    onChange={(e) => setSender(e.target.value)}
                    className="w-full p-1.5 border border-slate-200 rounded-md bg-white text-xs focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Label</label>
                  <select
                    value={label}
                    onChange={(e) => setLabel(e.target.value as 'Phishing' | 'Safe')}
                    className="w-full p-1.5 border border-slate-200 rounded-md bg-white text-xs focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Phishing">Phishing</option>
                    <option value="Safe">Safe / Legitimate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Your account security verification"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-1.5 border border-slate-200 rounded-md bg-white text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-500 font-medium mb-0.5">Body</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Paste the full email contents here..."
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="w-full p-1.5 border border-slate-200 rounded-md bg-white text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2.5 py-1 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 cursor-pointer shadow-xs"
                >
                  Add to Dataset
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {filteredEmails.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No emails found matching filters.
          </div>
        ) : (
          filteredEmails.map(email => {
            const isSelected = selectedEmail?.id === email.id;
            return (
              <div
                key={email.id}
                onClick={() => onSelectEmail(email)}
                className={`group flex items-start justify-between p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-50/70 border-indigo-200 shadow-xs'
                    : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex gap-2.5 items-start min-w-0 flex-1">
                  <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                    email.label === 'Phishing'
                      ? 'bg-rose-50 text-rose-500'
                      : 'bg-emerald-50 text-emerald-500'
                  }`}>
                    <Mail className="w-4 h-4" />
                  </div>
                  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                        email.label === 'Phishing'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {email.label}
                      </span>
                      {email.isCustom && (
                        <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded-full shrink-0">
                          Custom
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 truncate font-mono">{email.sender}</span>
                    </div>
                    <div className={`text-xs font-semibold truncate ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                      {email.subject}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {email.body}
                    </div>
                  </div>
                </div>

                {email.isCustom && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCustomEmail(email.id);
                    }}
                    className="p-1 text-slate-300 hover:text-rose-500 rounded-md hover:bg-rose-50/50 opacity-0 group-hover:opacity-100 transition-all shrink-0 cursor-pointer"
                    title="Delete custom email"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
