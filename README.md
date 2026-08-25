# ScamShield — AI-Powered Scam & Phishing Analyzer

**"Think before you click."**

ScamShield is a professional, secure, and easy-to-understand full-stack web application designed to help users identify potential scam threats in suspicious URLs, SMS texts, emails, and social media messages.

---

## 1. Problem
Phishing attacks, smishing (SMS phishing), and social engineering scams are growing exponentially. Attackers impersonate trusted brands, create artificial urgency, and leverage deceptive link structures to steal user credentials, OTPs, and financial assets. Everyday users need a fast, passive utility to check suspicious content safely without triggering security vulnerabilities.

---

## 2. Solution
ScamShield provides a safe gateway to verify suspicious content before interacting with it. Users paste links or text messages to get a calculated risk score (from 0 to 100), descriptive risk indicators, and clear protective recommendations. It uses a hybrid methodology combining deterministic rule-based matches and secure AI semantic evaluation.

---

## 3. Architecture
The application runs on Next.js 15+ using the App Router. The backend layer consists of secure Server Actions communicating directly with PostgreSQL and OpenAI.

```text
User Submits URL/Message (Client)
             ↓
    Next.js Server Action
             ├── 1. Rule-Based Detector (60% weight)
             ├── 2. OpenAI Semantic Analysis (40% weight)
             └── 3. PostgreSQL Database
             ↓
     Calculated Risk Score & Result Saved
```

---

## 4. Key Features
* **Custom Session Authentication**: Secure sign-up/login using bcryptjs for password hashing and encrypted HTTP-only session cookies.
* **Deterministic Rule-Based Detection**: Runs client-safe regex and keyword audits on URL strings and message text.
* **Semantic AI Analysis**: Safely routes requests through the OpenAI API (`gpt-4o-mini`) using isolated, untrusted-data instructions.
* **Hybrid Scoring**: Merges rule-based (60%) and AI-based (40%) values to categorize threats (Low: 0-30, Medium: 31-60, High: 61-100).
* **Full CRUD Operations**: Users can run new evaluations (Create), read statistics and complete history (Read), update personal notes on history (Update), and remove history runs (Delete).

---

## 5. Security Measures
* **Password Security**: Never stores plaintext passwords; hashes them securely using `bcryptjs`.
* **SQL Injection Prevention**: Uses parameterized SQL queries exclusively via the `pg` driver.
* **SSRF Mitigation**: Analyzes URLs strictly as text strings on the server. The application *never* fetches or crawls user-provided links.
* **Secure Session Cookies**: Uses encrypted cookies flagged with `httpOnly`, `secure` (in production), and `sameSite: "lax"`.
* **Strict Server-Side Authorization**: Checks database record ownership on every update/delete request, preventing IDOR (Insecure Direct Object Reference) vulnerabilities.

---

## 6. Tech Stack
* **Frontend**: Next.js 15, React, Tailwind CSS, Lucide React
* **Backend**: Next.js Server Actions
* **Database**: PostgreSQL (`pg` client)
* **AI Integration**: OpenAI API (`gpt-4o-mini`)
* **Testing**: Vitest for unit tests

---

## 7. Testing
Unit tests check the behavior of:
1. URL rule matches (detecting HTTP, raw IPs, phishing keywords).
2. Message rule matches (detecting urgency, credential requests, financial scams).
3. Risk level classification limits (LOW, MEDIUM, HIGH).

Run the tests using:
```bash
npm run test
```

---

## 8. Deployment to Vercel
1. Create a PostgreSQL Database (e.g. Neon, Vercel Postgres).
2. Push the code to a GitHub repository.
3. Import the repository to Vercel.
4. Set the following environment variables in Vercel:
   - `DATABASE_URL`
   - `OPENAI_API_KEY`
   - `SESSION_SECRET`
   - `NEXT_PUBLIC_APP_URL`
5. Run the DB seed script if you want to prepopulate demo analyses:
   ```bash
   npm run db:seed
   ```

---

## 9. Future Improvements
* **Screenshot Analysis**: Using vision models to analyze the visual layout of suspicious pages.
* **Browser Extension**: Real-time passive checks while browsing.
* **Threat Intelligence Integration**: Referencing third-party databases (like VirusTotal or Google Safe Browsing).
* **Email Integration**: Forwarding scam emails to an inbox for automatic parsing and response.
