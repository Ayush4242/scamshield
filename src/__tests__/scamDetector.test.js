import { describe, it, expect } from "vitest";
import { analyzeUrlRules, analyzeMessageRules } from "@/services/scamDetector";
import { getRiskLevel } from "@/services/analysis";

describe("Rule-based Scam Detector - URL", () => {
  it("should mark a safe HTTPS standard URL with a score of 0 and clear indicators", () => {
    const res = analyzeUrlRules("https://www.wikipedia.org/wiki/Main_Page");
    expect(res.score).toBe(0);
    expect(res.signals[0]).toContain("No obvious suspicious rule-based signals");
  });

  it("should flag URLs that do not use HTTPS", () => {
    const res = analyzeUrlRules("http://example.com");
    expect(res.score).toBeGreaterThan(0);
    expect(res.signals).toContain("Does not use secure HTTPS protocol");
  });

  it("should flag raw IP addresses used as hosts", () => {
    const res = analyzeUrlRules("http://192.168.1.1/login");
    expect(res.score).toBeGreaterThan(30);
    expect(res.signals).toContain("Uses a raw IP address instead of a domain name");
  });

  it("should flag suspicious keywords in the URL", () => {
    const res = analyzeUrlRules("https://paypal-verify-secure-login.com");
    expect(res.score).toBeGreaterThan(20);
    expect(res.signals.some(s => s.includes("suspicious branding/phishing keywords"))).toBe(true);
  });
});

describe("Rule-based Scam Detector - Messages", () => {
  it("should evaluate a normal message with a score of 0", () => {
    const res = analyzeMessageRules("Hey, are we still meeting for lunch today at 1 PM?");
    expect(res.score).toBe(0);
    expect(res.signals[0]).toContain("No obvious suspicious rule-based signals");
  });

  it("should flag urgency triggers", () => {
    const res = analyzeMessageRules("IMMEDIATE ACTION REQUIRED: Resolve this now!");
    expect(res.score).toBeGreaterThan(0);
    expect(res.signals.some(s => s.includes("urgency"))).toBe(true);
  });

  it("should flag credential requests", () => {
    const res = analyzeMessageRules("Please send me your account password and OTP verification code immediately.");
    expect(res.score).toBeGreaterThan(30);
    expect(res.signals.some(s => s.includes("credentials or OTPs"))).toBe(true);
  });
});

describe("Risk Level Classification", () => {
  it("should classify 20 as LOW risk", () => {
    expect(getRiskLevel(20)).toBe("LOW");
  });

  it("should classify 50 as MEDIUM risk", () => {
    expect(getRiskLevel(50)).toBe("MEDIUM");
  });

  it("should classify 80 as HIGH risk", () => {
    expect(getRiskLevel(80)).toBe("HIGH");
  });
});
