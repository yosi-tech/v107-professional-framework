// חישובי ציונים ודגלים לדו"ח AVENTURA 107 - B6

// מיפוי שאלות לדומיינים - מעודכן לגרסת B6
export const DOMAIN_MAPPING = {
  background_training: {
    questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    critical: [4, 6, 7],
    nameHe: "רקע והכשרה",
    nameEn: "Background & Training"
  },
  professional_experience: {
    questions: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    critical: [16, 17, 18, 26, 27],
    nameHe: "ניסיון מקצועי וכישורים",
    nameEn: "Professional Experience & Skills"
  },
  interests_resources: {
    questions: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
    critical: [38, 39, 48, 49, 52, 53],
    nameHe: "תחומי עניין, משאבים ומוטיבציה",
    nameEn: "Interests, Resources & Motivation"
  },
  work_style_competencies: {
    questions: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90],
    critical: [64, 65, 66, 73, 74, 75, 83, 84, 87, 88],
    nameHe: "סגנון עבודה וכשירויות ליבה",
    nameEn: "Work Style & Core Competencies"
  },
  vision_success_metrics: {
    questions: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107],
    critical: [91, 92, 94, 95, 99, 104, 106],
    nameHe: "חזון, מוטיבציה ומדדי הצלחה",
    nameEn: "Vision, Motivation & Success Metrics"
  }
};

// חישוב ציון דומיין - פשוט בלי נרמול כי כל השאלות אחידות
export function calculateDomainScore(responses, domainConfig) {
  if (!responses || typeof responses !== 'object') {
    console.error('Invalid responses object:', responses);
    return { score: 0, stdDev: 0 };
  }

  const scores = domainConfig.questions
    .map(q => {
      const rawValue = responses[`q${q}`];
      if (rawValue === undefined || rawValue === null || isNaN(rawValue)) {
        return null;
      }
      // פשוט מחזירים את הערך - כל השאלות אחידות (1=גרוע, 7=טוב)
      return Number(rawValue);
    })
    .filter(score => score !== null);
  
  if (scores.length === 0) {
    console.warn(`No valid scores found for domain with questions: ${domainConfig.questions.join(', ')}`);
    return { score: 0, stdDev: 0 };
  }
  
  const sum = scores.reduce((acc, val) => acc + val, 0);
  const mean = sum / scores.length;
  
  // חישוב סטיית תקן
  const variance = scores.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  
  return { score: mean, stdDev };
}

// בדיקת דגלים
export function checkFlags(responses, domainConfig, domainScore) {
  let redFlag = false;
  let yellowFlag = false;
  
  if (!responses || typeof responses !== 'object') {
    return { redFlag: false, yellowFlag: false };
  }
  
  // בדיקת דגל אדום - שאלה קריטית < 4
  for (const criticalQ of domainConfig.critical) {
    const rawValue = responses[`q${criticalQ}`];
    if (rawValue === undefined || rawValue === null || isNaN(rawValue)) {
      continue;
    }
    const value = Number(rawValue);
    
    if (value < 4) {
      redFlag = true;
      break;
    }
  }
  
  // בדיקת דגל צהוב - ציון בינוני או סטיית תקן גבוהה
  if (!redFlag) {
    if ((domainScore.score >= 4.0 && domainScore.score <= 4.4) || domainScore.stdDev >= 1.5) {
      yellowFlag = true;
    }
  }
  
  return { redFlag, yellowFlag };
}

// קביעת Band (גבוה/בינוני/נמוך)
export function determineBand(score, redFlag) {
  if (redFlag) return 'low';
  if (score >= 5.5) return 'high';
  if (score >= 4.5) return 'mid';
  return 'low';
}

// חישוב כל הדומיינים
export function calculateAllDomains(responses) {
  if (!responses || typeof responses !== 'object') {
    console.error('Invalid responses object provided to calculateAllDomains:', responses);
    throw new Error('Invalid responses object - cannot calculate domain scores');
  }

  const results = {};
  
  for (const [domainKey, domainConfig] of Object.entries(DOMAIN_MAPPING)) {
    try {
      const scoreData = calculateDomainScore(responses, domainConfig);
      const flags = checkFlags(responses, domainConfig, scoreData);
      const band = determineBand(scoreData.score, flags.redFlag);
      
      // נרמול הציון ל-0-100
      const normalizedScore = scoreData.score > 0 ? ((scoreData.score - 1) / 6) * 100 : 0;
      
      results[domainKey] = {
        score: Math.round(normalizedScore * 10) / 10,
        band,
        red_flag: flags.redFlag,
        yellow_flag: flags.yellowFlag,
        stdDev: scoreData.stdDev,
        name: domainConfig.nameHe
      };
    } catch (error) {
      console.error(`Error calculating domain ${domainKey}:`, error);
      // במקרה של שגיאה, נחזיר ערכי ברירת מחדל
      results[domainKey] = {
        score: 0,
        band: 'low',
        red_flag: true,
        yellow_flag: false,
        stdDev: 0,
        name: domainConfig.nameHe
      };
    }
  }
  
  return results;
}

// זיהוי חוזקות וחולשות
export function identifyStrengthsAndWeaknesses(domainScores) {
  if (!domainScores || typeof domainScores !== 'object') {
    return { strengths: [], weaknesses: [] };
  }

  const domains = Object.entries(domainScores)
    .filter(([key, data]) => data && data.score !== undefined && data.score !== null)
    .map(([key, data]) => ({ key, ...data }))
    .sort((a, b) => b.score - a.score);
  
  const strengths = domains
    .filter(d => d.band === 'high' && !d.red_flag)
    .slice(0, 3)
    .map(d => d.name);
  
  const weaknesses = domains
    .filter(d => d.red_flag || d.band === 'low')
    .slice(0, 3)
    .map(d => d.name);
  
  return { strengths, weaknesses };
}