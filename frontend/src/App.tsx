
import { useEffect, useRef, useState } from 'react'
import './App.css'

 

function App() {

  const [message,setMessage]=useState(["hei there ", "hello" ])


    const wsRef = useRef();
  useEffect(()=>{
     const ws = new WebSocket("http://localhost:8080/")
     ws.onmessage=(event)=>{
     setMessage(m=>[...m, event.data])
     }
     wsRef.current=ws;
     ws.onopen=()=>{
      ws.send(JSON.stringify({
        type:"join",
        payload:{
          roomId:"red"
        }
      }))
     }
  },[])

  return (
    <div className='bg-black text-white h-screen '>
      <br /><br /><br /> 
      <div className="h-[85vh] ">
        {message.map(message=>
         <div className='m-8 '>
          <span className='bg-white text-black rounded p-4  '>
          {message}
          </span>
         </div>
      )}</div>
      <div className='w-full bg-white text-black flex '>
        <input type="text" placeholder='type here' className='flex-1 p-4 ' />
        <button
        onClick={()=>{
          wsRef.current.send(JSON.stringify({
            type:"chat",
            payload:{
              message:message
            }
          }))
        }}
        className='bg-purple-600  p-4 '>
          Send message
          </button>
      </div>
    </div>
  )
}

export default App
