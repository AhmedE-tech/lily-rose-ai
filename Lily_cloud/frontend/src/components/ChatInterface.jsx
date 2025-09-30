// Lily-Cloud/frontend/src/components/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Send, User, Bot, Clock, CheckCheck } from 'lucide-react'
import axios from 'axios'

const ChatInterface = ({ sessionId }) => {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Simulate human typing delay
  const simulateTyping = async (duration = 1500) => {
    setIsTyping(true)
    await new Promise(resolve => setTimeout(resolve, duration))
    setIsTyping(false)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    const userMessage = {
      id: `user_${Date.now()}`,
      type: 'user',
      text: inputText,
      timestamp: new Date().toISOString(),
      status: 'delivered'
    }

    setMessages(prev => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    // Simulate typing before response
    await simulateTyping(1000 + Math.random() * 1000)

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/chat/${sessionId}`, {
        text: inputText
      })

      const aiMessage = {
        id: `ai_${Date.now()}`,
        type: 'ai',
        text: response.data.ai_response,
        timestamp: new Date().toISOString(),
        status: 'read'
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: `error_${Date.now()}`,
        type: 'ai',
        text: "Hmm, I'm having trouble connecting right now. Could you try again? 💫",
        timestamp: new Date().toISOString(),
        status: 'read'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-2xl">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">Hello there! 👋</h3>
            <p className="text-sm">I'm Lily, your AI companion. Let's start a wonderful conversation!</p>
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} group`}
          >
            <div
              className={`flex items-end space-x-2 max-w-[85%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              {message.type === 'ai' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg mb-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              {/* Message Bubble */}
              <div
                className={`relative px-4 py-3 rounded-3xl shadow-sm transition-all duration-300 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md border border-gray-200/50 dark:border-gray-600/50'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed font-medium">{message.text}</p>
                
                {/* Message Status */}
                <div className={`flex items-center space-x-1 mt-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.type === 'user' && message.status === 'delivered' && (
                    <CheckCheck className="w-3 h-3 text-blue-200" />
                  )}
                  {message.type === 'user' && message.status === 'read' && (
                    <CheckCheck className="w-3 h-3 text-blue-300" />
                  )}
                </div>
                
                {/* Tail */}
                <div className={`absolute bottom-0 w-3 h-3 ${
                  message.type === 'user' 
                    ? 'right-0 transform translate-x-1/2 bg-blue-500 rounded-br-full'
                    : 'left-0 transform -translate-x-1/2 bg-white dark:bg-gray-700 rounded-bl-full border-l border-b border-gray-200/50 dark:border-gray-600/50'
                }`}></div>
              </div>

              {/* User Avatar */}
              {message.type === 'user' && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl flex items-center justify-center shadow-lg mb-1">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-3 rounded-3xl rounded-bl-md border border-gray-200/50 dark:border-gray-600/50">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-b-3xl">
        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Message Lily..."
              className="w-full bg-white/80 dark:bg-gray-700/80 border border-gray-300/50 dark:border-gray-600/50 rounded-2xl px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900/30 transition-all duration-300 backdrop-blur-sm"
              rows="1"
              style={{ 
                minHeight: '50px', 
                maxHeight: '120px'
              }}
            />
          </div>
          
          <button
            onClick={sendMessage}
            disabled={!inputText.trim() || isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3.5 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-purple-500/25"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatInterface