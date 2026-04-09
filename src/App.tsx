/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Mic, Settings, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [showSettings, setShowSettings] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState({
    voiceType: 'female',
    speed: 1,
    pitch: 1,
  });
  const [languages, setLanguages] = useState({
    source: 'en',
    target: 'te',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-4">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Live Voice Translator AI</h1>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 bg-white/10 rounded-full hover:bg-white/20"
        >
          <Settings size={20} />
        </button>
      </header>

      <main className="flex flex-col gap-4">
        <div className="flex-1 bg-white/5 rounded-2xl p-4 h-64 overflow-y-auto">
          <p className="text-center text-white/50">Conversation history will appear here</p>
        </div>

        <div className="flex justify-center items-center py-8">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsRecording(!isRecording)}
            className={`p-8 rounded-full ${isRecording ? 'bg-red-500' : 'bg-indigo-500'} shadow-lg`}
          >
            <Mic size={48} />
          </motion.button>
        </div>
      </main>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-indigo-950 p-6 rounded-2xl w-full max-w-sm border border-white/10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Settings</h2>
                <button onClick={() => setShowSettings(false)}><X size={20} /></button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Languages</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      value={languages.source}
                      onChange={(e) => setLanguages({...languages, source: e.target.value})}
                      className="bg-indigo-900 p-2 rounded-lg text-sm"
                    >
                      <option value="en">English</option>
                      <option value="te">Telugu</option>
                    </select>
                    <select 
                      value={languages.target}
                      onChange={(e) => setLanguages({...languages, target: e.target.value})}
                      className="bg-indigo-900 p-2 rounded-lg text-sm"
                    >
                      <option value="en">English</option>
                      <option value="te">Telugu</option>
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Voice</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Voice Type</label>
                      <select 
                        value={voiceSettings.voiceType}
                        onChange={(e) => setVoiceSettings({...voiceSettings, voiceType: e.target.value})}
                        className="w-full bg-indigo-900 p-2 rounded-lg"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Speed: {voiceSettings.speed}x</label>
                      <input 
                        type="range" min="0.5" max="2" step="0.1"
                        value={voiceSettings.speed}
                        onChange={(e) => setVoiceSettings({...voiceSettings, speed: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Pitch: {voiceSettings.pitch}</label>
                      <input 
                        type="range" min="0.5" max="2" step="0.1"
                        value={voiceSettings.pitch}
                        onChange={(e) => setVoiceSettings({...voiceSettings, pitch: parseFloat(e.target.value)})}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
