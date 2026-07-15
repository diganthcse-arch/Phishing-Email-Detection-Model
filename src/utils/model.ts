import { Email, FeatureDefinition, ModelWeights, TrainingConfig, EpochLog, EvaluationMetrics, PredictionResult, ConfusionMatrix } from '../types';

// Define the core features we will extract from each email
export const featuresList: FeatureDefinition[] = [
  {
    id: 'has_links',
    name: 'Contains Web Links',
    description: 'Detects the presence of clickable web links (http/https) in the email body.',
    type: 'heuristic',
    extractor: (email) => {
      const urlRegex = /https?:\/\/[^\s]+/gi;
      return urlRegex.test(email.body) ? 1 : 0;
    }
  },
  {
    id: 'suspicious_domain',
    name: 'Suspicious Sender Domain',
    description: 'Checks if the sender email has suspicious keywords like "verify", "alert", "support", "rewards", or generic non-brand subdomains.',
    type: 'heuristic',
    extractor: (email) => {
      const lowerSender = email.sender.toLowerCase();
      const suspiciousWords = [
        '-support', '-alert', '-verify', 'verification', '-secure', 
        '-login', 'rewards', 'winner', 'tax-refund', 'secure-login',
        'paypal-verification', 'netflix-updates', 'chase-online'
      ];
      const match = suspiciousWords.some(word => lowerSender.includes(word));
      return match ? 1 : 0;
    }
  },
  {
    id: 'urgent_subject',
    name: 'Urgent/Alert Subject Line',
    description: 'Detects high-pressure phrasing in the subject (e.g., "Urgent", "Action Required", "Suspended", "Security Alert").',
    type: 'heuristic',
    extractor: (email) => {
      const lowerSubject = email.subject.toLowerCase();
      const urgentWords = [
        'urgent', 'action required', 'suspended', 'restricted', 'verify', 
        'update', 'expiration', 'warning', 'congratulations', 'won', 'security alert', 'unauthorized'
      ];
      const match = urgentWords.some(word => lowerSubject.includes(word));
      return match ? 1 : 0;
    }
  },
  {
    id: 'ip_link',
    name: 'Raw IP Address Link',
    description: 'Checks if the email body contains links pointing directly to raw IP addresses instead of secure domain names.',
    type: 'heuristic',
    extractor: (email) => {
      const ipUrlRegex = /https?:\/\/([0-9]{1,3}\.){3}[0-9]{1,3}/gi;
      return ipUrlRegex.test(email.body) ? 1 : 0;
    }
  },
  {
    id: 'shortened_url',
    name: 'Shortened URL Link',
    description: 'Detects URL shortening services like bit.ly, tinyurl.com, or t.co used to hide destination addresses.',
    type: 'heuristic',
    extractor: (email) => {
      const shorteners = [
        /bit\.ly/gi,
        /tinyurl\.com/gi,
        /t\.co/gi,
        /is\.gd/gi,
        /buff\.ly/gi
      ];
      const match = shorteners.some(regex => regex.test(email.body));
      return match ? 1 : 0;
    }
  },
  {
    id: 'spam_keywords',
    name: 'Spam/Phishing Buzzwords',
    description: 'Measures the density of words frequently found in phishing emails (e.g., "credentials", "billing info", "claim prize").',
    type: 'keyword',
    extractor: (email) => {
      const lowerBody = email.body.toLowerCase();
      const lowerSubject = email.subject.toLowerCase();
      const fullText = lowerSubject + ' ' + lowerBody;
      
      const keywords = [
        'unauthorized', 'suspend', 'forfeited', 'unusual activity', 'locked', 
        'restricted', 'identity', 'billing info', 'verify', 'claim', 'winner', 
        'appeal', 'copyright', 'wire transfer', 'confidential', 'compensation', 
        'refund', 'password reset', 'security key', 'demographic info'
      ];
      
      let count = 0;
      keywords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        const matches = fullText.match(regex);
        if (matches) {
          count += matches.length;
        }
      });
      
      // Normalize count: 0 for none, scale up to 1 if 4 or more keywords are found
      return Math.min(count / 3, 1);
    }
  },
  {
    id: 'coercion_urgency',
    name: 'Coercive Deadline Language',
    description: 'Checks if the email creates a false sense of urgency with specific deadlines (e.g., "1 hour", "24 hours", "12 hours").',
    type: 'keyword',
    extractor: (email) => {
      const lowerBody = email.body.toLowerCase();
      const timeframes = [
        '24 hours', '48 hours', '12 hours', '1 hour', 'by eod', 'immediately', 
        'as soon as possible', 'act fast', 'limited time', '4 hours'
      ];
      const match = timeframes.some(tf => lowerBody.includes(tf));
      return match ? 1 : 0;
    }
  },
  {
    id: 'financial_pressure',
    name: 'Financial/Monetary Terms',
    description: 'Detects the combination of dollar signs or wire instructions with pressure words.',
    type: 'keyword',
    extractor: (email) => {
      const lowerBody = email.body.toLowerCase();
      const hasDollar = /\$[0-9,]+/g.test(lowerBody);
      const moneyWords = ['wire transfer', 'acquisition', 'refund', 'bonus', 'salary', 'fee', 'funds', 'payment', 'sum'];
      const hasMoneyWord = moneyWords.some(word => lowerBody.includes(word));
      return (hasDollar && hasMoneyWord) ? 1 : 0;
    }
  },
  {
    id: 'generic_greeting',
    name: 'Generic/Impersonal Greeting',
    description: 'Detects impersonal, mass-mail openings like "Dear customer" or "Dear user" instead of a personal name.',
    type: 'heuristic',
    extractor: (email) => {
      const lowerBody = email.body.toLowerCase();
      const genericGreetings = [
        'dear customer', 'dear user', 'dear client', 'shopper survey winner', 
        'dear wells fargo customer', 'hello team', 'dear student'
      ];
      const match = genericGreetings.some(greet => lowerBody.startsWith(greet) || lowerBody.substring(0, 100).includes(greet));
      return match ? 1 : 0;
    }
  },
  {
    id: 'safe_indicators',
    name: 'Safe Professional Indicators',
    description: 'Looks for typical indicators of healthy workplace or personal communications (e.g. "roadmap review", "figma", "recipes").',
    type: 'keyword',
    extractor: (email) => {
      const lowerBody = email.body.toLowerCase();
      const safeWords = [
        'roadmap review', 'figma', 'pull request', 'meeting notes', 'weekly sync', 
        'peach cobbler', 'grandma helen', 'love, grandma', 'recipes', 'slide deck',
        'key takeaways', 'unsubscribe', 'delta air lines', 'delta flight'
      ];
      
      let count = 0;
      safeWords.forEach(word => {
        if (lowerBody.includes(word)) count++;
      });
      
      return Math.min(count / 2, 1); // Learn negative weights for safe indicators!
    }
  }
];

// Helper: Sigmoid Activation Function
export function sigmoid(z: number): number {
  return 1 / (1 + Math.exp(-Math.max(-20, Math.min(20, z)))); // clamp z to avoid overflow
}

// Convert an Email to a numerical Feature Vector
export function extractFeatures(email: Email): { [featureId: string]: number } {
  const vector: { [featureId: string]: number } = {};
  featuresList.forEach(feat => {
    vector[feat.id] = feat.extractor(email);
  });
  return vector;
}

// Initialize weights to small random values or zeros
export function initializeWeights(): ModelWeights {
  const weights: { [featureId: string]: number } = {};
  featuresList.forEach(feat => {
    // Initialize standard features to small random values
    // Safe indicators should start slightly negative to guide direction, others slightly positive
    if (feat.id === 'safe_indicators') {
      weights[feat.id] = -0.1 - Math.random() * 0.1;
    } else {
      weights[feat.id] = 0.1 + Math.random() * 0.1;
    }
  });
  return {
    bias: 0.0,
    weights
  };
}

// Predict probability of Phishing for an email
export function predict(email: Email, model: ModelWeights): PredictionResult {
  const vector = extractFeatures(email);
  let z = model.bias;
  
  const activatedFeatures: PredictionResult['activatedFeatures'] = [];
  
  featuresList.forEach(feat => {
    const value = vector[feat.id];
    const weight = model.weights[feat.id] || 0;
    const contribution = value * weight;
    z += contribution;
    
    if (value > 0) {
      activatedFeatures.push({
        featureId: feat.id,
        value,
        weight,
        contribution
      });
    }
  });
  
  const probability = sigmoid(z);
  const prediction = probability >= 0.5 ? 'Phishing' : 'Safe';
  
  // Sort activated features by absolute contribution to highlight the most important ones
  activatedFeatures.sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));
  
  return {
    probability,
    prediction,
    activatedFeatures
  };
}

// Train Logistic Regression Model using Batch Gradient Descent
export function trainModel(
  trainSet: Email[],
  valSet: Email[],
  config: TrainingConfig,
  onEpoch: (log: EpochLog) => void
): ModelWeights {
  let model = initializeWeights();
  const N = trainSet.length;
  
  if (N === 0) return model;

  // Extract all feature vectors in advance for efficiency
  const trainVectors = trainSet.map(email => ({
    vector: extractFeatures(email),
    label: email.label === 'Phishing' ? 1 : 0
  }));
  
  const valVectors = valSet.map(email => ({
    vector: extractFeatures(email),
    label: email.label === 'Phishing' ? 1 : 0
  }));

  const alpha = config.learningRate;
  const lambda = config.regularization;

  for (let epoch = 1; epoch <= config.epochs; epoch++) {
    let lossSum = 0;
    
    // Initialize gradients
    let g_bias = 0;
    const g_w: { [featureId: string]: number } = {};
    featuresList.forEach(feat => {
      g_w[feat.id] = 0;
    });

    // 1. Accumulate gradients over the training set
    trainVectors.forEach(sample => {
      // Predict z and prob
      let z = model.bias;
      featuresList.forEach(feat => {
        z += (model.weights[feat.id] || 0) * (sample.vector[feat.id] || 0);
      });
      
      const prob = sigmoid(z);
      const error = prob - sample.label;
      
      // Binary Cross-Entropy Loss
      const epsilon = 1e-15; // prevent log(0)
      const loss = -(sample.label * Math.log(prob + epsilon) + (1 - sample.label) * Math.log(1 - prob + epsilon));
      lossSum += loss;
      
      // Gradient accumulate
      g_bias += error;
      featuresList.forEach(feat => {
        g_w[feat.id] += error * (sample.vector[feat.id] || 0);
      });
    });

    // Average loss + L2 regularization penalty
    let l2Penalty = 0;
    featuresList.forEach(feat => {
      const wVal = model.weights[feat.id] || 0;
      l2Penalty += wVal * wVal;
    });
    
    const avgLoss = (lossSum / N) + (lambda / (2 * N)) * l2Penalty;

    // 2. Update Weights
    model.bias = model.bias - alpha * (g_bias / N);
    featuresList.forEach(feat => {
      const wVal = model.weights[feat.id] || 0;
      const grad = (g_w[feat.id] / N) + (lambda / N) * wVal;
      model.weights[feat.id] = wVal - alpha * grad;
    });

    // 3. Compute Train Accuracy
    let trainCorrect = 0;
    trainVectors.forEach(sample => {
      let z = model.bias;
      featuresList.forEach(feat => {
        z += (model.weights[feat.id] || 0) * (sample.vector[feat.id] || 0);
      });
      const prob = sigmoid(z);
      const pred = prob >= 0.5 ? 1 : 0;
      if (pred === sample.label) {
        trainCorrect++;
      }
    });
    const trainAccuracy = trainCorrect / N;

    // 4. Compute Validation Accuracy
    let valCorrect = 0;
    valVectors.forEach(sample => {
      let z = model.bias;
      featuresList.forEach(feat => {
        z += (model.weights[feat.id] || 0) * (sample.vector[feat.id] || 0);
      });
      const prob = sigmoid(z);
      const pred = prob >= 0.5 ? 1 : 0;
      if (pred === sample.label) {
        valCorrect++;
      }
    });
    const valAccuracy = valVectors.length > 0 ? valCorrect / valVectors.length : trainAccuracy;

    // Report epoch log
    onEpoch({
      epoch,
      loss: avgLoss,
      trainAccuracy,
      valAccuracy
    });
  }

  return model;
}

// Calculate fully loaded metrics on a test set
export function evaluateModel(testSet: Email[], model: ModelWeights): EvaluationMetrics {
  let tp = 0; // Actual Phish, Predicted Phish
  let fp = 0; // Actual Safe, Predicted Phish
  let tn = 0; // Actual Safe, Predicted Safe
  let fn = 0; // Actual Phish, Predicted Safe
  
  testSet.forEach(email => {
    const result = predict(email, model);
    const actual = email.label;
    const predicted = result.prediction;
    
    if (actual === 'Phishing' && predicted === 'Phishing') tp++;
    else if (actual === 'Safe' && predicted === 'Phishing') fp++;
    else if (actual === 'Safe' && predicted === 'Safe') tn++;
    else if (actual === 'Phishing' && predicted === 'Safe') fn++;
  });
  
  const total = testSet.length;
  const accuracy = total > 0 ? (tp + tn) / total : 0;
  
  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 0;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 0;
  const f1Score = (precision + recall) > 0 ? 2 * (precision * recall) / (precision + recall) : 0;
  
  return {
    accuracy,
    precision,
    recall,
    f1Score,
    confusionMatrix: { tp, fp, tn, fn }
  };
}
