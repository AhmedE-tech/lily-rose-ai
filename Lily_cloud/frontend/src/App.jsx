// Lily-Cloud/frontend/src/App.jsx
import React, { useState, useEffect } from 'react'
import { MessageCircle, Mic, Settings, User } from 'lucide-react'
import ChatInterface from './components/ChatInterface'
import VoiceInterface from './components/VoiceInterface'

function App() {
  const [currentView, setCurrentView] = useState('chat')
  const [sessionId] = useState(() => {
    return localStorage.getItem('sessionId') || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  })

  useEffect(() => {
    localStorage.setItem('sessionId', sessionId)
  }, [sessionId])

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Enhanced Header */}
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Avatar and Name */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full absolute -top-0.5 -right-0.5 border-2 border-white dark:border-gray-900 shadow-lg"></div>
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Lily Rose</h1>
                <p className="text-sm text-green-500 font-medium flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  Online • Always here for you
                </p>
              </div>
            </div>
            
            {/* Right: Navigation */}
            <div className="flex items-center space-x-2">
              {currentView === 'chat' && (
                <button
                  onClick={() => setCurrentView('voice')}
                  className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 group"
                >
                  <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Voice Chat</span>
                </button>
              )}
              
              {currentView === 'voice' && (
                <button
                  onClick={() => setCurrentView('chat')}
                  className="flex items-center space-x-2 bg-white/90 dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-300/50 dark:border-gray-600/50 px-4 py-2.5 rounded-xl transition-all duration-300 backdrop-blur-sm transform hover:scale-105 group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium">Text Chat</span>
                </button>
              )}
              
              <button className="p-2.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-300">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 h-[calc(100vh-80px)]">
        {currentView === 'chat' && (
          <ChatInterface sessionId={sessionId} />
        )}
        
        {currentView === 'voice' && (
          <VoiceInterface sessionId={sessionId} onBackToChat={() => setCurrentView('chat')} />
        )}
      </main>

      {/* Floating Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
      </div>
    </div>
  )
}

export default App