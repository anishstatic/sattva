import { Search, Sparkles } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AiDictionary = () => {

  const changeColor = () =>{
    let inputBox = document.querySelector('.inputBox');
    inputBox.style.borderColor = '#3F2B96';
  };
  const resetColor = () =>{
    let inputBox = document.querySelector('.inputBox');
    inputBox.style.borderColor = '#6B7280';
  }

   const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
      
    const {getToken} = useAuth();

        const onSubmitHandler = async (e)=>{
      e.preventDefault();
      try {
        setLoading(true)
        const prompt = `Search any word for the keyword ${input}`

        const {data} = await axios.post('/api/ai/ai-dictionary', {prompt}, {
          headers:{
            Authorization: `Bearer ${await getToken()}`
          }
        })

        if(data.success){
          setContent(data.content)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }
      setLoading(false)
    }


  return (
    <div className='h-full overflow-y-scroll p-6  text-slate-700'>
      <form onSubmit={onSubmitHandler}>
       <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#3F2B96]' />
          <h1 className='text-xl font-semibold'>AI Dictionary</h1>
        </div>
        <div className='searchContainer mt-[20px] w-full  p-4 bg-white rounded-lg border  border-gray-200'>
          <div className='inputBox  border-2  border-gray-600 rounded-lg px-4 py-2 flex items-center gap-3'>
            <Search color='#6B7280' />
            <input type="text" onFocus={changeColor} onBlur={resetColor}  placeholder='Search a Word....' onChange={(e)=> setInput(e.target.value)} value={input}  className='w-full border-none outline-none  '/>
          </div>
        </div>

        {
          !content ? (
             <div className='resultContainer w-full'>
          <div className='bg-white min-h-[50vh] rounded-xl shadow-xl p-8 border-t-4 mt-[40px]' style={{borderTop: "2px solid #3F2B96", borderBottom: "2px solid #3F2B96"}}>

          </div>

         </div>
          ) : (
            <div>
              <div className='mt-3 h-full overflow-y-scroll text-sm text-slate-600'>
                                      <div className='reset-tw'>
                                        <Markdown>{content}</Markdown>
                                        </div>
                                    </div>
            </div>
          )
        }

       
      </form>
        
    </div>
        
  )
}

export default AiDictionary
