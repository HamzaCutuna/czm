const aliasMap: Record<string, { code: string; aliases: string[] }> = {
  BIH: { 
    code: 'BA', 
    aliases: [
      'bosna i hercegovina', 'bosna', 'bih', 'bosnia and herzegovina', 
      'bosnia', 'bosna i hercegovina', 'b-h', 'bih', 'bosna hercegovina'
    ] 
  },
  HRV: { 
    code: 'HR', 
    aliases: ['hrvatska', 'croatia', 'hrvatska republika', 'croatian republic'] 
  },
  SRB: { 
    code: 'RS', 
    aliases: ['srbija', 'serbia', 'republika srbija', 'republic of serbia'] 
  },
  MNE: { 
    code: 'ME', 
    aliases: ['crna gora', 'montenegro', 'crnogorska', 'montenegrin'] 
  },
  MKD: { 
    code: 'MK', 
    aliases: [
      'sjeverna makedonija', 'severna makedonija', 'north macedonia', 
      'makedonija', 'macedonia', 'makedonska', 'macedonian'
    ] 
  },
  SVN: { 
    code: 'SI', 
    aliases: ['slovenija', 'slovenia', 'slovenska', 'slovenian republic'] 
  },
  KOS: { 
    code: 'XK', 
    aliases: ['kosovo', 'kosova', 'kosovo i metohija', 'kosovo and metohija'] 
  },
  // World fallback list
  DEU: { code: 'DE', aliases: ['germany', 'deutschland', 'njemacka', 'njemačka'] },
  FRA: { code: 'FR', aliases: ['france', 'francuska', 'french republic'] },
  ITA: { code: 'IT', aliases: ['italy', 'italija', 'italian republic'] },
  USA: { code: 'US', aliases: ['usa', 'united states', 'america', 'sjedinjene američke države'] },
  GBR: { code: 'GB', aliases: ['england', 'uk', 'united kingdom', 'britain', 'engleska', 'velika britanija'] },
  ESP: { code: 'ES', aliases: ['spain', 'španija', 'spanija', 'spanish'] },
  RUS: { code: 'RU', aliases: ['russia', 'rusija', 'russian federation'] },
  TUR: { code: 'TR', aliases: ['turkey', 'turska', 'türkiye', 'turkish republic'] },
  GRE: { code: 'GR', aliases: ['greece', 'grčka', 'grcka', 'hellenic republic'] },
  AUT: { code: 'AT', aliases: ['austria', 'austrija', 'austrian republic'] },
  HUN: { code: 'HU', aliases: ['hungary', 'mađarska', 'madarska', 'hungarian republic'] },
  ROU: { code: 'RO', aliases: ['romania', 'rumunija', 'romanian'] },
  BGR: { code: 'BG', aliases: ['bulgaria', 'bugarska', 'bulgarian republic'] },
  ALB: { code: 'AL', aliases: ['albania', 'albanija', 'albanian republic'] },
  POL: { code: 'PL', aliases: ['poland', 'poljska', 'polish republic'] },
  CZE: { code: 'CZ', aliases: ['czech republic', 'češka', 'ceska', 'czechia'] },
  SVK: { code: 'SK', aliases: ['slovakia', 'slovačka', 'slovacka', 'slovak republic'] },
  CHN: { code: 'CN', aliases: ['china', 'kina', 'chinese republic'] },
  JPN: { code: 'JP', aliases: ['japan', 'japan', 'japanese'] },
  IND: { code: 'IN', aliases: ['india', 'indija', 'indian republic'] },
  BRA: { code: 'BR', aliases: ['brazil', 'brazil', 'brazilian republic'] },
  CAN: { code: 'CA', aliases: ['canada', 'kanada', 'canadian'] },
  AUS: { code: 'AU', aliases: ['australia', 'australija', 'australian'] },
};

function norm(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim();
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .split(/[^a-z0-9]+/g)
      .filter(Boolean)
      .filter(t => t.length > 1) // Filter out single characters
  );
}

function calculateJaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter(x => set2.has(x)));
  const union = new Set([...set1, ...set2]);
  return intersection.size / union.size;
}

export type DetectedCountry = { code: string; name: string } | null;

export function detectCountry(texts: Array<string | undefined | null>): DetectedCountry {
  const joined = norm(texts.filter(Boolean).join(' '));
  if (!joined) return null;

  let best: DetectedCountry = null;
  let bestScore = 0;

  // First pass: exact/contains matching
  for (const entry of Object.values(aliasMap)) {
    for (const alias of entry.aliases) {
      const normalizedAlias = norm(alias);
      
      // Exact match gets highest score
      if (joined === normalizedAlias) {
        return { code: entry.code, name: alias };
      }
      
      // Contains match gets good score
      if (joined.includes(normalizedAlias)) {
        const score = normalizedAlias.length / joined.length;
        if (score > bestScore) {
          bestScore = score;
          best = { code: entry.code, name: alias };
        }
      }
    }
  }

  // Second pass: fuzzy matching using Jaccard similarity
  if (!best || bestScore < 0.3) {
    const inputTokens = tokenize(joined);
    
    for (const entry of Object.values(aliasMap)) {
      for (const alias of entry.aliases) {
        const aliasTokens = tokenize(norm(alias));
        const similarity = calculateJaccardSimilarity(inputTokens, aliasTokens);
        
        if (similarity > bestScore && similarity >= 0.4) {
          bestScore = similarity;
          best = { code: entry.code, name: alias };
        }
      }
    }
  }

  return best;
}
