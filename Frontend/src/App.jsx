import { useState } from 'react'
import './App.css'
import Editor from "@monaco-editor/react";
import axios from 'axios'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css";
import { Code2, Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  
  const languages = [
    "javascript", "typescript", "python", "java", "html", "css", "php", "csharp", "ruby"
  ];

  async function reviewCode() {
    try {
      setLoading(true);
      const response = await axios.post("https://aicodereviewer-mw3y.onrender.com/ai/get-review", {code, language});
      setReview(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-icon">
              <Code2 />
            </div>
            <div className="header-title">
              <h1>AI Code Reviewer</h1>
              <p className="header-subtitle">Powered by Advanced AI</p>
            </div>
          </div>
          
          <div className="language-selector">
            <label>Language:</label>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="language-dropdown"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="panels-container">
          {/* Code Editor Panel */}
          <div className="panel">
            <div className="panel-inner">
              <div className="panel-header">
                <div className="panel-header-left">
                  <div className="window-dots">
                    <div className="dot dot-red"></div>
                    <div className="dot dot-yellow"></div>
                    <div className="dot dot-green"></div>
                  </div>
                  <span className="panel-title">Code Editor</span>
                </div>
                <Code2 className="panel-icon" />
              </div>
              
              <div className="editor-container">
                <Editor
                  value={code}
                  onChange={setCode}
                  height="100%"
                  language={language}
                  defaultValue="// Write your code here or ask anything."
                  theme="vs-dark"
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                  }}
                />
              </div>
              
              <div className="button-container">
                <button
                  onClick={reviewCode}
                  disabled={loading || !code.trim()}
                  className="review-button"
                >
                  {loading ? (
                    <>
                      <Loader2 style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Analyzing Code...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles />
                      <span>Review Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Review Results Panel */}
          <div className="panel">
            <div className="panel-inner">
              <div className="panel-header">
                <div className="panel-header-left">
                  <CheckCircle className="panel-icon" />
                  <span className="panel-title">Review Results</span>
                </div>
                {review && !loading && (
                  <div className="status-badge">
                    <div className="status-dot"></div>
                    <span>Analysis Complete</span>
                  </div>
                )}
              </div>
              
              <div className="results-container">
                {loading ? (
                  <div className="loading-state">
                    <div className="spinner-container">
                      <div className="spinner"></div>
                      <Sparkles className="spinner-icon" />
                    </div>
                    <div className="loading-text">
                      <h3>Analyzing Your Code</h3>
                      <p>This may take a few moments...</p>
                    </div>
                  </div>
                ) : review ? (
                  <div className="markdown-content">
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                      {review}
                    </Markdown>
                  </div>
                ) : (
                  <div className="empty-state">
                    <div className="empty-icon-container">
                      <AlertCircle className="empty-icon" />
                    </div>
                    <div className="empty-text">
                      <h3>No Review Yet</h3>
                      <p>
                        Paste your code in the editor and click "Review Code" to get started
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;