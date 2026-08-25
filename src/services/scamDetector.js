/**
 * Rule-based scam detection service.
 * Performs deterministic analysis of URLs and text messages.
 */

/**
 * Checks a URL for suspicious deterministic signals
 * @param {string} urlStr
 * @returns {{ score: number, signals: string[] }}
 */
export function analyzeUrlRules(urlStr) {
  const signals = [];
  let scorePoints = 0;

  const trimmed = urlStr.trim();
  if (!trimmed) {
    return { score: 0, signals: [] };
  }

  // 1. Check HTTPS
  if (!trimmed.toLowerCase().startsWith("https://")) {
    signals.push("Does not use secure HTTPS protocol");
    scorePoints += 25;
  }

  // Parse URL safely to extract components
  let parsedUrl = null;
  try {
    const urlToParse = /^[a-zA-Z]+:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsedUrl = new URL(urlToParse);
  } catch (e) {
    signals.push("Invalid URL format");
    scorePoints += 30;
  }

  if (parsedUrl) {
    const hostname = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname.toLowerCase();

    // 2. IP Address check (avoids SSRF by not fetching, just checking string)
    const ipPattern = /^(?:\d{1,3}\.){3}\d{1,3}$|^\[[a-fA-F0-9:]+\]$/;
    if (ipPattern.test(hostname)) {
      signals.push("Uses a raw IP address instead of a domain name");
      scorePoints += 40;
    }

    // 3. Excessive subdomains
    const subdomainCount = hostname.split(".").length - 2;
    if (subdomainCount > 3) {
      signals.push("Excessive subdomains (potential subdomain hijacking or phishing structure)");
      scorePoints += 15;
    }

    // 4. Suspicious TLDs
    const suspiciousTlds = [".xyz", ".top", ".tk", ".ml", ".ga", ".cf", ".gq", ".work", ".click", ".link", ".zip", ".country", ".stream", ".download"];
    const matchedTld = suspiciousTlds.find(tld => hostname.endsWith(tld));
    if (matchedTld) {
      signals.push(`Uses a suspicious top-level domain (${matchedTld})`);
      scorePoints += 20;
    }

    // 5. Suspicious keywords in hostname or pathname
    const phishingKeywords = ["login", "signin", "verify", "account", "update", "banking", "secure", "wallet", "claim", "prize", "gift", "free", "support", "admin", "billing", "invoice", "ebay", "paypal", "netflix", "amazon", "apple", "google", "microsoft"];
    const foundKeywords = [];
    phishingKeywords.forEach(kw => {
      if (hostname.includes(kw) || pathname.includes(kw)) {
        foundKeywords.push(kw);
      }
    });

    if (foundKeywords.length > 0) {
      signals.push(`Contains suspicious branding/phishing keywords: ${foundKeywords.slice(0, 3).join(", ")}`);
      scorePoints += foundKeywords.length * 15;
    }

    // 6. Suspicious characters or hyphens
    if ((hostname.match(/-/g) || []).length > 2) {
      signals.push("Multiple hyphens in domain name (common in typo-squatting)");
      scorePoints += 10;
    }
    if (hostname.includes("@")) {
      signals.push("Contains '@' symbol in hostname (used to mask malicious links)");
      scorePoints += 25;
    }
  }

  // Clamp score between 0 and 100
  const finalScore = Math.min(Math.max(scorePoints, 0), 100);

  return {
    score: finalScore,
    signals: signals.length > 0 ? signals : ["No obvious suspicious rule-based signals detected in URL"],
  };
}

/**
 * Checks a text message for suspicious deterministic signals
 * @param {string} message
 * @returns {{ score: number, signals: string[] }}
 */
export function analyzeMessageRules(message) {
  const signals = [];
  let scorePoints = 0;

  const content = message.toLowerCase();
  if (!content.trim()) {
    return { score: 0, signals: [] };
  }

  // 1. Urgency cues
  const urgencyKeywords = ["immediate", "urgent", "now", "suspended", "blocked", "restricted", "action required", "within 24 hours", "compromised", "unauthorized", "expire"];
  const foundUrgency = urgencyKeywords.filter(kw => content.includes(kw));
  if (foundUrgency.length > 0) {
    signals.push(`Creates high urgency/fear: ${foundUrgency.slice(0, 3).join(", ")}`);
    scorePoints += foundUrgency.length * 10;
  }

  // 2. Account status threats
  const threatKeywords = ["suspend", "block", "deactivate", "terminate", "freeze", "closed", "cancel"];
  const foundThreats = threatKeywords.filter(kw => content.includes(kw));
  if (foundThreats.length > 0) {
    signals.push(`Threatens account suspension or actions: ${foundThreats.slice(0, 3).join(", ")}`);
    scorePoints += 25;
  }

  // 3. Credentials, PIN, OTP requests
  const credentialKeywords = ["password", "passcode", "pin", "otp", "verification code", "social security", "ssn", "routing number", "credit card", "cvv", "login details"];
  const foundCredentials = credentialKeywords.filter(kw => content.includes(kw));
  if (foundCredentials.length > 0) {
    signals.push(`Requests sensitive credentials or OTPs: ${foundCredentials.slice(0, 3).join(", ")}`);
    scorePoints += 30;
  }

  // 4. Financial & payment requests
  const financialKeywords = ["wire transfer", "gift card", "bitcoin", "crypto", "payment required", "unpaid invoice", "fee", "refund", "lottery", "cash prize", "claims reward"];
  const foundFinancial = financialKeywords.filter(kw => content.includes(kw));
  if (foundFinancial.length > 0) {
    signals.push(`Requests payments, bank actions, or claims prizes: ${foundFinancial.slice(0, 3).join(", ")}`);
    scorePoints += 25;
  }

  // 5. Contains links (phishing trigger)
  if (content.includes("http://") || content.includes("https://") || /href|www\./.test(content) || /\.[a-z]{2,4}\//.test(content)) {
    signals.push("Contains embedded URLs (often used in SMS phishing / Smishing)");
    scorePoints += 20;
  }

  // 6. Impersonation of common brands
  const brandKeywords = ["paypal", "netflix", "amazon", "dhl", "ups", "fedex", "apple", "microsoft", "google", "irs", "chase", "wells fargo", "citi", "bank of america"];
  const foundBrands = brandKeywords.filter(kw => content.includes(kw));
  if (foundBrands.length > 0) {
    signals.push(`Attempts to impersonate known brands: ${foundBrands.slice(0, 3).join(", ")}`);
    scorePoints += 15;
  }

  // Clamp score
  const finalScore = Math.min(Math.max(scorePoints, 0), 100);

  return {
    score: finalScore,
    signals: signals.length > 0 ? signals : ["No obvious suspicious rule-based signals detected in message content"],
  };
}
