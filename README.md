# BusinessBridge Vendor Scout

**BusinessBridge Vendor Scout** is an elite, full-stack B2B lead discovery and enrichment platform. It allows growth agencies, enterprise recruiters, sales teams, and procurement professionals to query Google Business indexes, scrape company websites, extract public contacts (emails, phone numbers, and social links), and leverage Gemini AI models to compile complete, highly enriched corporate profiles.

---

## 🎨 Design Concept: Elegant Cosmic Slate
* **Atmospheric Visuals**: Styled with deep obsidian background gradients and glowing cosmic borders (`indigo-600`, `purple-500`, and `emerald-500`).
* **Bento Grid Presentation**: Vendor cards and detail modals are organized into structural Bento-grid sections maximizing information density and typographic rhythm.
* **Responsive Fluidity**: Engineered with full support for desktop-first precision and mobile touch targets.

---

## 🚀 Key Features

### 🔍 1. AI-Powered B2B Scraper & Expander
* **Query Expander**: Analyzes a seed industry and location to automatically formulate 3-6 semantic directories sub-queries to maximize sourcing coverage.
* **Grounded Search**: Utilizes Google Search Grounding to harvest actual, real-world businesses operating today.
* **Adaptive Fallback Generator**: Seamlessly falls back to structural local directories heuristics if direct crawling or API rate limits occur.

### 🌐 2. Multi-Stage Crawling Engine
* **Homepage Parser**: Crawls raw HTML homepages to instantly parse official contact channels (such as emails, direct phone numbers, and social media handles like LinkedIn or Instagram).
* **Speed Optimizer**: Processes high-yield targets with deep crawling, then switches to high-speed predictive indexing for remaining queue profiles to respect API quotas.

### 🏆 3. Real-Time Lead Scoring Weight Configurator
* **Dynamic Calculations**: Computes relative Lead Quality Scores (0-100) instantly on the client side.
* **Custom Coefficients**: An advanced sliding panel allows users to re-tune scoring weights for:
  * *Website Existence*
  * *Google Rating Threshold (≥ 4.0)*
  * *Discovered Email Channels*
  * *Complete Contacts (Socials/Phones)*
  * *B2B Relevance & Industry Profile*
* **Instantly Reactive**: Dragging any slider immediately triggers real-time score updates, animated status badges, and catalog re-sorting.

### 📊 4. Interactive Analytics Dashboard
* **Bento Analytics**: Summary charts compiling average lead quality, email availability rate, and geographical distributions.
* **Bulk Export Tools**: Download the entire verified directory, or specific filter slices, directly to formatted Excel CSVs, standard CSVs, or JSON arrays.

---

## 🛠️ Technical Stack

* **Frontend**: React 19, Vite, Tailwind CSS (V4), Lucide React
* **Backend**: Node.js Express, TSX, esbuild
* **Database**: Firebase Cloud Firestore
* **AI & Language Processing**: `@google/genai` (utilizing Gemini Models with search grounding)

---

## ⚙️ Getting Started & Installation

### 1. Environment Configuration
Create a `.env` file in the root directory (refer to `.env.example`):
```env
# Google Gemini API Access Key
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Install Dependencies
Run the package manager installation:
```bash
npm install
```

### 3. Run Development Server
Boot the Express + Vite unified development environment:
```bash
npm run dev
```
The application runs locally at `http://localhost:3000`.

### 4. Production Build
Compile both static files and server bundle for serverless or container deployment:
```bash
npm run build
npm start
```

---

## 🛡️ GDPR & Legal Compliance
* This product respects website `robots.txt` compliance parameters.
* Direct crawl triggers standard browser user-agents on public information only.
* Always adhere to local telecommunication laws, CAN-SPAM Act, and GDPR protocols before executing direct outbound email or telephone campaigns.
