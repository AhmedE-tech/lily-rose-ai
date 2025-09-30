// Lily-Cloud/frontend/src/components/VoiceInterface.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Mic, Square, Bot, Volume2, ArrowLeft } from 'lucide-react'

const VoiceInterface = ({ sessionId, onBackToChat }) => {
  const [isListening, setIsListening] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [conversation, setConversation] = useState([])
  
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setIsListening(false)
        setIsThinking(true)
        setTranscript('Processing your voice...')
        
        // Simulate AI processing
        setTimeout(() => {
          setIsThinking(false)
          setIsSpeaking(true)
          setTranscript('')
          
          // Add simulated response to conversation
          const aiMessage = {
            id: Date.now(),
            type: 'ai',
            text: "I heard you! This is where real voice responses will appear once we connect Azure Speech Services.",
            timestamp: new Date().toISOString()
          }
          
          setConversation(prev => [...prev, aiMessage])
          
          // Simulate speaking completion
          setTimeout(() => {
            setIsSpeaking(false)
          }, 3000)
        }, 2000)
      }

      mediaRecorder.start(100)
      setIsListening(true)
      setTranscript('Listening... Speak now')
      
    } catch (error) {
      console.error('Error accessing microphone:', error)
      setTranscript('Microphone access denied. Please allow microphone permissions.')
    }
  }

  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBackToChat}
          className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Chat</span>
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Voice Conversation</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Talk naturally with Lily</p>
        </div>
        
        <div className="w-20"></div> {/* Spacer for balance */}
      </div>

      {/* Conversation Display */}
      <div className="flex-1 overflow-y-auto mb-6 p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-2xl">
        {conversation.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Volume2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-700 dark:text-gray-300">Let's have a voice conversation! 🎤</h3>
            <p className="text-sm mb-2">Tap the microphone below to start talking</p>
            <p className="text-xs text-gray-400">I'll listen and respond naturally</p>
          </div>
        )}
        
        {conversation.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-6 group`}
          >
            <div
              className={`flex items-end space-x-2 max-w-[85%] ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {/* Avatar */}
              {message.type === 'ai' && (
                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg mb-1">
                  <Bot className="w-5 h-5 text-white" />
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
                
                {/* Message Time */}
                <div className={`flex items-center space-x-1 mt-2 ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs opacity-70">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                
                {/* Tail */}
                <div className={`absolute bottom-0 w-3 h-3 ${
                  message.type === 'user' 
                    ? 'right-0 transform translate-x-1/2 bg-blue-500 rounded-br-full'
                    : 'left-0 transform -translate-x-1/2 bg-white dark:bg-gray-700 rounded-bl-full border-l border-b border-gray-200/50 dark:border-gray-600/50'
                }`}></div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Current Status */}
        {(isListening || isThinking || isSpeaking || transcript) && (
          <div className="text-center mb-6">
            <div className="inline-flex items-center space-x-3 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm px-4 py-3 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
              {(isListening || isSpeaking) && (
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="voice-bar w-1.5 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                      style={{ 
                        height: `${Math.random() * 20 + 8}px`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    ></div>
                  ))}
                </div>
              )}
              
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isListening && 'Listening...'}
                {isThinking && 'Thinking...'}
                {isSpeaking && 'Speaking...'}
                {transcript && !isListening && !isThinking && !isSpeaking && transcript}
              </span>
              
              {isThinking && (
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Voice Controls */}
      <div className="flex flex-col items-center space-y-6">
        {/* Voice visualization */}
        {(isListening || isSpeaking) && (
          <div className="flex items-center justify-center space-x-1 h-16">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="voice-bar w-2 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full"
                style={{ 
                  height: `${Math.random() * 40 + 10}px`,
                  animationDelay: `${i * 0.1}s`
                }}
              ></div>
            ))}
          </div>
        )}

        {/* Microphone Button */}
        <div className="relative">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={isThinking || isSpeaking}
            className={`
              relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-500 transform shadow-2xl
              ${
                isListening
                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 animate-pulse'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
              }
              ${(isThinking || isSpeaking) ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105'}
              group
            `}
          >
            {isListening ? (
              <Square className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            ) : (
              <Mic className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
            )}
            
            {/* Animated rings */}
            {(isListening || isSpeaking) && (
              <>
                <div className="absolute inset-0 rounded-3xl border-2 border-purple-400/50 animate-ping"></div>
                <div className="absolute inset-0 rounded-3xl border-2 border-pink-400/30 animate-ping" style={{animationDelay: '0.5s'}}></div>
              </>
            )}
          </button>
          
          {/* Glow effect */}
          <div className={`absolute inset-0 rounded-3xl blur-xl opacity-50 transition-all duration-500 ${
            isListening ? 'bg-red-400' : 'bg-purple-500'
          } ${(isThinking || isSpeaking) ? 'scale-95' : 'scale-110'}`}></div>
        </div>

        {/* Status text */}
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
            {isListening && 'Speak now... I\'m listening carefully'}
            {isThinking && 'Processing your message...'}
            {isSpeaking && 'Speaking my response...'}
            {!isListening && !isThinking && !isSpeaking && 'Tap to start voice chat'}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            {!isListening && !isThinking && !isSpeaking && 'I\'ll respond naturally to your voice'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default VoiceInterface