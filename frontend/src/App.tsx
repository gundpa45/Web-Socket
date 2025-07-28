import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState(["hei there ", "hello"])
  const [input, setInput] = useState("")
  const wsRef = useRef()
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080/")
    ws.onmessage = (event) => {
      setMessage(m => [...m, event.data])
    }
    wsRef.current = ws
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }

    return () => ws.close()
  }, [])

  useEffect(() => {
    // Auto scroll to latest message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [message])

  const handleSend = () => {
    if (!input.trim()) return

    wsRef.current.send(JSON.stringify({
      type: "chat",
      payload: {
        message: input
      }
    }))
    setInput("")
  }

  return (
    <div className='bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white h-screen flex flex-col'>
      <header className='text-center text-2xl font-bold py-4 border-b border-gray-700 shadow-sm'>
        Real-Time Chat Room 🚀
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {message.map((msg, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <span className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm font-medium 
              ${i % 2 === 0 ? 'bg-gray-200 text-black' : 'bg-purple-600 text-white'}`}>
              {msg}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='w-full bg-gray-900 border-t border-gray-700 p-3 flex gap-2'>
        <input
          type="text"
          placeholder='Type your message...'
          className='flex-1 p-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-600'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className='bg-purple-600 hover:bg-purple-700 active:scale-95 transition px-6 rounded-lg font-semibold text-white'>
          Send
        </button>
      </div>
    </div>
  )
}

export default App
