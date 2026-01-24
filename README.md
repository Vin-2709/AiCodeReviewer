# 🔍 AI Code Reviewer

AI Code Reviewer is a professional-grade optimization platform that leverages **Google Gemini AI (Flash 2.0)** to provide automated, intelligent feedback on code quality. It is designed to help developers identify bugs, security vulnerabilities, and performance bottlenecks in real-time.

---

## 🚀 Key Features

* **AI-Powered Analysis**: Utilizes the latest Gemini 2.0 Flash model to perform deep-dive reviews across 10+ programming languages.
* **Direct GitHub Integration**: Built-in service to fetch file content directly from GitHub repository URLs using the GitHub Contents API.
* **Interactive Code Editor**: Integrated **Monaco Editor** interface for a seamless, VS Code-like editing experience in the browser.
* **Structured Feedback**: Provides categorized reviews focusing on:
    * 🐛 Logical Bugs & Errors
    * 🛡️ Security Vulnerabilities (XSS, SQL Injection, etc.)
    * 🚀 Performance Enhancements
    * 🧹 Clean Code & Best Practices
* **Live Markdown Rendering**: Instantly formats AI feedback into clean, readable Markdown with syntax highlighting.

---

## 🛠️ Tech Stack

**Frontend:**
- **React.js** (Vite)
- **Monaco Editor** (@monaco-editor/react)
- **Markdown Rendering**: react-markdown, rehype-highlight
- **State Management**: React Hooks
- **API Client**: Axios

**Backend:**
- **Node.js** & **Express.js**
- **AI SDK**: Google Generative AI (@google/generative-ai)
- **Authentication**: JWT (JSON Web Tokens)
- **Utilities**: GitHub API integration, dotenv, CORS

**DevOps & Tools:**
- **Containerization**: Docker & Docker Compose
- **Deployment**: Render / Vercel
- **Testing**: Postman

---

## 📂 Project Structure

```text
AiCodeReviewer/
├── BackEnd/
│   ├── src/
│   │   ├── controllers/   # ai.controller.js (Request handling)
│   │   ├── services/      # ai.service.js (Gemini API), github.service.js (GitHub API)
│   │   └── routes/        # ai.routes.js (API Endpoints)
│   ├── server.js          # Entry point
│   └── Dockerfile
├── Frontend/
│   ├── src/
│   │   ├── App.jsx        # Core UI & review logic
│   │   └── main.jsx       # React entry
│   └── Dockerfile
└── docker-compose.yml     # Multi-container orchestration
