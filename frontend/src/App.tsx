
import { useEffect, useState } from 'react'
import './App.css'

 

function App() {

  const [message,setMessage]=useState(["hello welcome to my chat app " ])
  useEffect(()=>{
     const ws = new WebSocket("http://localhost:5173/")
     ws.onmessage=(event)=>{
     setMessage(m=>[...m, event.data])
     }
  },[])

  return (
    <div className='bg-black text-white h-screeb '>
      <div className="h-[90vh] bg-red-300">{message.map(message=>{
        <div>{message}</div>
      })}</div>
      <div className=' bg-white text-black flex '>
        <input type="text" placeholder='type here' className='flex-1  ' />
        <button className='bg-purple-600  p-4 '>Send message</button>
      </div>
    </div>
  )
}

export default App
