
import { useState } from 'react'
import './App.css'
import Editor from "@monaco-editor/react";
import axios from 'axios'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css";
import { Code2, Sparkles, CheckCircle, AlertCircle, Loader2, Github } from 'lucide-react';

function App() {
  const [code, setCode] = useState("");
  const [review, setReview] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [loading, setLoading] = useState(false);
  const [githubUrl, setGithubUrl] = useState('');
  
  const languages = [
    "javascript", "typescript", "python", "java", "html", "css", "php", "csharp", "ruby"
  ];

  // Review code from editor
  async function reviewCodeFromEditor() {
    if (!code.trim()) {
      alert('Please enter some code to review');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        code,
        language
      });
      setReview(response.data);
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error + (error.response.data.message ? ': ' + error.response.data.message : ''));
      } else {
        alert('Error reviewing code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  // Review code directly from GitHub URL
  async function reviewFromGithub() {
    if (!githubUrl.trim()) {
      alert('Please enter a GitHub URL');
      return;
    }

    // Validate GitHub URL format
    const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\/(?:blob|tree)\/[^\/]+\/(.+))?/;
    if (!regex.test(githubUrl)) {
      alert('Invalid GitHub URL. Please use format: https://github.com/owner/repo or https://github.com/owner/repo/blob/branch/path');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:3000/ai/get-review", {
        githubUrl,
        language
      });
      setReview(response.data);
      // Clear the GitHub URL after successful review
      setGithubUrl('');
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.error) {
        alert(error.response.data.error + (error.response.data.message ? ': ' + error.response.data.message : ''));
      } else {
        alert('Error reviewing code from GitHub. Please try again.');
      }
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
              <Code2 className="icon" />
            </div>
            <div className="header-text">
              <h1 className="header-title">AI Code Reviewer</h1>
              <p className="header-subtitle">Powered by Advanced AI</p>
            </div>
          </div>
          
          <div className="language-selector">
            <label className="language-label">Language:</label>
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
            <div className="panel-card">
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
              
              <div className="editor-wrapper">
                {!code && (
                  <div className="editor-placeholder">
                    Write your code here
                  </div>
                )}
                <Editor
                  value={code}
                  onChange={setCode}
                  height="100%"
                  language={language}
                  defaultValue=""
                  theme="vs-dark"
                  options={{
                    fontSize: 16,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    lineNumbers: 'on',
                    renderLineHighlight: 'all',
                    scrollbar: {
                      vertical: 'visible',
                      horizontal: 'visible',
                    }
                  }}
                />
              </div>
              
              {/* GitHub URL Input Section */}
              <div className="github-section">
                <div className="github-header">
                  <Github className="github-icon" />
                  <span className="github-title">Review from GitHub</span>
                </div>
                <div className="github-input-group">
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && githubUrl.trim() && !loading) {
                        reviewFromGithub();
                      }
                    }}
                    placeholder="https://github.com/owner/repo/blob/main/file.js"
                    className="github-input"
                    disabled={loading}
                  />
                  <button
                    onClick={reviewFromGithub}
                    disabled={loading || !githubUrl.trim()}
                    className="github-review-btn"
                    title="Review code directly from GitHub"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="btn-icon spinning" />
                        <span>Reviewing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="btn-icon" />
                        <span>Review</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="github-hint">
                  Paste GitHub URL and click Review to analyze directly (Press Enter to submit)
                </p>
              </div>

              {/* Review Button for Editor Code */}
              <div className="button-container">
                <button
                  onClick={reviewCodeFromEditor}
                  disabled={loading || !code.trim()}
                  className="review-button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="btn-icon spinning" />
                      <span>Analyzing Code...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="btn-icon sparkle-icon" />
                      <span>Review Code from Editor</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Review Results Panel */}
          <div className="panel">
            <div className="panel-card">
              <div className="panel-header">
                <div className="panel-header-left">
                  <CheckCircle className="panel-icon check-icon" />
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
                    <div className="spinner-wrapper">
                      <div className="spinner"></div>
                      <Sparkles className="spinner-icon" />
                    </div>
                    <div className="loading-text">
                      <p className="loading-title">Analyzing Your Code</p>
                      <p className="loading-subtitle">This may take a few moments...</p>
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
                    <div className="empty-icon-wrapper">
                      <AlertCircle className="empty-icon" />
                    </div>
                    <div className="empty-text">
                      <p className="empty-title">No Review Yet</p>
                      <p className="empty-subtitle">
                        Write code in the editor or paste a GitHub URL to get AI-powered code review
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