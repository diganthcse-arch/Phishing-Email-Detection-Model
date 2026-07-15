export interface Email {
  id: string;
  subject: string;
  sender: string;
  body: string;
  label: 'Phishing' | 'Safe';
  isCustom?: boolean;
}

export interface FeatureDefinition {
  id: string;
  name: string;
  description: string;
  type: 'keyword' | 'heuristic';
  extractor: (email: Email) => number; // Returns 0 or 1 (binary), or a normalized frequency/count
}

export interface ModelWeights {
  bias: number;
  weights: { [featureId: string]: number };
}

export interface TrainingConfig {
  learningRate: number;
  epochs: number;
  regularization: number; // L2 lambda
  trainSplit: number; // e.g. 0.8 for 80%
}

export interface EpochLog {
  epoch: number;
  loss: number;
  trainAccuracy: number;
  valAccuracy: number;
}

export interface ConfusionMatrix {
  tp: number; // True Positive (Actual Phishing, Predicted Phishing)
  fp: number; // False Positive (Actual Safe, Predicted Phishing)
  tn: number; // True Negative (Actual Safe, Predicted Safe)
  fn: number; // False Negative (Actual Phishing, Predicted Safe)
}

export interface EvaluationMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix: ConfusionMatrix;
}

export interface PredictionResult {
  probability: number; // 0 to 1 (probability of being Phishing)
  prediction: 'Phishing' | 'Safe';
  activatedFeatures: {
    featureId: string;
    value: number;
    weight: number;
    contribution: number; // value * weight
  }[];
}
