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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-green-950 text-white">
      {/* Header */}
      <header className="border-b border-green-900/30 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2.5 rounded-xl shadow-lg shadow-green-500/20">
                <Code2 className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                  AI Code Reviewer
                </h1>
                <p className="text-xs text-gray-400">Powered by Advanced AI</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-300">Language:</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-900/80 border border-green-800/50 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 transition-all cursor-pointer hover:border-green-700"
              >
                {languages.map(lang => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[98%] mx-auto px-6 py-6 h-[calc(100vh-180px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Code Editor Panel */}
          <div className="flex flex-col h-full">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl rounded-2xl border border-green-900/30 shadow-2xl shadow-black/50 overflow-hidden h-full flex flex-col">
              <div className="bg-gray-900/60 border-b border-green-900/30 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="ml-3 text-sm font-medium text-gray-300">Code Editor</span>
                </div>
                <Code2 className="w-4 h-4 text-green-500" />
              </div>
              
              <div className="flex-1 overflow-hidden">
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
                  }}
                />
              </div>
              
              <div className="p-5 border-t border-green-900/30 bg-gray-900/40">
                <button
                  onClick={reviewCode}
                  disabled={loading || !code.trim()}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-green-900/30 hover:shadow-green-900/50 disabled:cursor-not-allowed disabled:shadow-none group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing Code...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      <span>Review Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Review Results Panel */}
          <div className="flex flex-col h-full">
            <div className="bg-gradient-to-br from-gray-900/80 to-gray-950/80 backdrop-blur-xl rounded-2xl border border-green-900/30 shadow-2xl shadow-black/50 overflow-hidden h-full flex flex-col">
              <div className="bg-gray-900/60 border-b border-green-900/30 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-300">Review Results</span>
                </div>
                {review && !loading && (
                  <div className="flex items-center gap-2 text-xs text-green-400">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span>Analysis Complete</span>
                  </div>
                )}
              </div>
              
              <div className="flex-1 overflow-auto p-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-4 border-green-900/30 border-t-green-500 rounded-full animate-spin"></div>
                      <Sparkles className="w-6 h-6 text-green-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-medium text-gray-300 mb-1">Analyzing Your Code</p>
                      <p className="text-sm text-gray-500">This may take a few moments...</p>
                    </div>
                  </div>
                ) : review ? (
                  <div className="prose prose-invert prose-green max-w-none">
                    <Markdown rehypePlugins={[rehypeHighlight]}>
                      {review}
                    </Markdown>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                    <div className="bg-green-950/30 p-6 rounded-2xl border border-green-900/30">
                      <AlertCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-300 mb-2">No Review Yet</p>
                      <p className="text-sm text-gray-500 max-w-xs">
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

export default App;// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import Editor from "@monaco-editor/react";
// import axios from 'axios'
// import Markdown from 'react-markdown'
// import rehypeHighlight from 'rehype-highlight'
// import "highlight.js/styles/github-dark.css";

// function App() {
//  const[code, setCode]=useState("");
//  const[review,setReview]=useState('');
//  const [language,setLanguage]=useState('javascript');
//  const [loading, setLoading]=useState(false);
//  const languages = [
//   "javascript", "typescript", "python", "java", "html", "css", "php", "csharp", "ruby"
// ];

//  async function reviewCode(){
//   try {
//     setLoading(true);
//     const response= await axios.post("https://aicodereviewer-mw3y.onrender.com/ai/get-review",{code,language})
//     setReview(response.data);
//   } catch (error) {
//     console.log(error);
//   }
//   finally{
//     setLoading(false);
//   }
    
//  }

//   return (
//     <>
//     <div className='head'>
//     <div className="heading">
//     Ai Code Reviewer</div>
//     </div>
//     <div className="language-controller">
//       <h1 >Language:</h1>
//       <select className='language-dropdown'
//        value={language}
//        onChange={(e)=>{
//          setLanguage(e.target.value);
//        }}
//       >
//        {languages.map(lang=>(
//         <option key={lang} value={lang}>{lang}</option>
//        )
//        )}
//       </select>
//     </div>
//      <main>
//       <div className="left">
//       <Editor className='editor'
//       value={code}
//       onChange={setCode}
//           height="95%"
//           defaultLanguage="javascript"
//           defaultValue="// Write your code here or ask anything."
//           theme="vs-dark"
//           options={{
//             fontSize:20,
            
//           }}
//         />
//        <button onClick={reviewCode}className='btn'>Review</button>
//       </div>
//       <div className="right">
//         {
//           loading?<div className="loader">
//             <h1>Analyzing, Please wait!.....</h1>
//           </div>
//           :
//           <Markdown
//           rehypePlugins={[rehypeHighlight]}
          
//           >{review}</Markdown>
//         }
     
//       </div>
//      </main>
//     </>
//   )
// }

// export default App
