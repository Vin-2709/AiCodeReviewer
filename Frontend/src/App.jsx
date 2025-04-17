import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Editor from "@monaco-editor/react";
import axios from 'axios'
import Markdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import "highlight.js/styles/github-dark.css";

function App() {
 const[code, setCode]=useState("");
 const[review,setReview]=useState('');
 const [language,setLanguage]=useState('javascript');
 const [loading, setLoading]=useState(false);
 const languages = [
  "javascript", "typescript", "python", "java", "html", "css", "php", "csharp", "ruby"
];

 async function reviewCode(){
  try {
    setLoading(true);
    const response= await axios.post("http://localhost:3000/ai/get-review",{code,language})
    setReview(response.data);
  } catch (error) {
    console.log(error);
  }
  finally{
    setLoading(false);
  }
    
 }

  return (
    <>
    <div className='head'>
    <div className="heading">
    Ai Code Reviewer</div>
    </div>
    <div className="language-controller">
      <h1 >Language:</h1>
      <select className='language-dropdown'
       value={language}
       onChange={(e)=>{
         setLanguage(e.target.value);
       }}
      >
       {languages.map(lang=>(
        <option key={lang} value={lang}>{lang}</option>
       )
       )}
      </select>
    </div>
     <main>
      <div className="left">
      <Editor className='editor'
      value={code}
      onChange={setCode}
          height="95%"
          defaultLanguage="javascript"
          defaultValue="// Write your code here or ask anything."
          theme="vs-dark"
          options={{
            fontSize:20,
            
          }}
        />
       <button onClick={reviewCode}className='btn'>Review</button>
      </div>
      <div className="right">
        {
          loading?<div className="loader">
            <h1>Analyzing, Please wait!.....</h1>
          </div>
          :
          <Markdown
          rehypePlugins={[rehypeHighlight]}
          
          >{review}</Markdown>
        }
     
      </div>
     </main>
    </>
  )
}

export default App
