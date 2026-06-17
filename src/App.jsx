import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import LearningProgress from './pages/LearningProgress'
import Tutor from './pages/Tutor'
import LearningReport from './pages/LearningReport'
import QuestionBank from './pages/QuestionBank'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const lastUpdateTimeRef = useRef(null)
  const sessionStartTimeRef = useRef(null)
  const isTimerRunningRef = useRef(false)

  // 检查是否需要重置学习时长（跨天检测）
  const checkAndResetStudyTime = (userData) => {
    const today = new Date().toDateString()
    const lastStudyDate = localStorage.getItem('lastStudyDate')
    
    if (lastStudyDate && lastStudyDate !== today) {
      // 跨天了，重置学习时长
      userData.studyTime = 0
    }
    
    localStorage.setItem('lastStudyDate', today)
    return userData
  }

  // 保存学习时长
  const saveStudyTime = (userId, studyTime) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex !== -1) {
      users[userIndex].studyTime = studyTime
      localStorage.setItem('users', JSON.stringify(users))
      
      // 更新当前用户
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (currentUser && currentUser.id === userId) {
        currentUser.studyTime = studyTime
        localStorage.setItem('currentUser', JSON.stringify(currentUser))
      }
    }
  }

  // 学习时长计时器
  const startStudyTimer = () => {
    if (isTimerRunningRef.current || !user) return
    
    isTimerRunningRef.current = true
    sessionStartTimeRef.current = Date.now()
    lastUpdateTimeRef.current = Date.now()

    const interval = setInterval(() => {
      if (!user) {
        clearInterval(interval)
        isTimerRunningRef.current = false
        return
      }

      const now = Date.now()
      const elapsedMs = now - lastUpdateTimeRef.current
      
      if (elapsedMs >= 60000) { // 1分钟
        const additionalMinutes = Math.floor(elapsedMs / 60000)
        const newStudyTime = (user.studyTime || 0) + additionalMinutes
        
        // 更新用户状态
        setUser(prev => prev ? { ...prev, studyTime: newStudyTime } : null)
        
        // 保存到 localStorage
        saveStudyTime(user.id, newStudyTime)
        
        lastUpdateTimeRef.current = now
      }
    }, 1000)

    return () => {
      clearInterval(interval)
      isTimerRunningRef.current = false
    }
  }

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      let userData = JSON.parse(savedUser)
      userData = checkAndResetStudyTime(userData)
      setUser(userData)
    }
  }, [])

  useEffect(() => {
    if (user) {
      const cleanup = startStudyTimer()
      return cleanup
    }
  }, [user?.id])

  const handleLogin = (userData) => {
    userData = checkAndResetStudyTime(userData)
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
    isTimerRunningRef.current = false
  }

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/question-bank" element={<QuestionBank user={user} updateUser={setUser} />} />
        <Route path="/progress" element={<LearningProgress user={user} />} />
        <Route path="/report" element={<LearningReport user={user} />} />
        <Route path="/tutor" element={<Tutor user={user} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
