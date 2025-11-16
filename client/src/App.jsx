
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticle from './pages/WriteArticle'
import BlogTitles from './pages/BlogTitles'
import GenerateImages from './pages/GenerateImages'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import Community from './pages/Community'
import AiDictionary from './pages/AiDictionary'
//import { useEffect } from 'react'
import '@n8n/chat/style.css'
//import { createChat } from '@n8n/chat'
//import { useAuth } from '@clerk/clerk-react'
import { Toaster } from 'react-hot-toast'



function App() {

  // useEffect(() => {
	// 	createChat({
	// 		webhookUrl: 'https://rr47.app.n8n.cloud/webhook/03b5f42f-8e9d-4131-a467-565477ba5a18/chat'
	// 	});
	// }, []);


  return (
    <div>
      <Toaster />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/ai' element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path='write-article' element={<WriteArticle />} />
        <Route path='blog-titles' element={<BlogTitles />} />
        <Route path='generate-images' element={<GenerateImages />} />
        <Route path='remove-background' element={<RemoveBackground />} />
        <Route path='remove-object' element={<RemoveObject />} />
        <Route path='review-resume' element={<ReviewResume />} />
        <Route path='ai-dictionary' element={<AiDictionary />} />
        <Route path='community' element={<Community />} />
        </Route>
      </Routes>
    </div>
    
  )
}

export default App
