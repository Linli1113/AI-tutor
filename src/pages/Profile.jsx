import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import './Profile.css'

function Profile({ user, setUser }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [currentDate, setCurrentDate] = useState('')
  
  useEffect(() => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    const weekDay = weekDays[now.getDay()]
    setCurrentDate(`${year}年${month}月${day}日 ${weekDay}`)
  }, [])

  const [formData, setFormData] = useState({
    grade: user.grade || '',
    targetScore: user.targetScore || '',
    rank: user.rank || ''
  })

  const handleSave = () => {
    const updatedUser = { ...user, ...formData }
    setUser(updatedUser)
    
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const index = users.findIndex(u => u.id === user.id)
    if (index !== -1) {
      users[index] = updatedUser
      localStorage.setItem('users', JSON.stringify(users))
    }
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))
    
    alert('保存成功！')
  }

  const handleUploadAvatar = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const avatarUrl = event.target?.result
        const updatedUser = { ...user, avatar: avatarUrl }
        setUser(updatedUser)
        
        // 更新当前用户
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        
        // 更新用户列表
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const index = users.findIndex(u => u.id === user.id)
        if (index !== -1) {
          users[index] = updatedUser
          localStorage.setItem('users', JSON.stringify(users))
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div>
      <header className="app-header" style={{ 
        background: 'rgba(255, 248, 240, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(245, 160, 140, 0.15)',
        gap: '20px'
      }}>
        <button onClick={() => navigate('/')} className="btn btn-secondary">
          ← 返回
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <h1 style={{ 
            background: 'linear-gradient(135deg, #F5A08C 0%, #FFB09D 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>数代熊</h1>
          <div style={{
            background: 'linear-gradient(135deg, #FFE8D6 0%, #FFD5C7 100%)',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '14px',
            color: '#8B6B4D',
            fontWeight: '500',
            boxShadow: '0 2px 8px rgba(139, 107, 77, 0.1)'
          }}>
            📅 {currentDate}
          </div>
        </div>
        <div style={{ width: '80px' }}></div>
      </header>
      
      <div className="container">
        <div className="card">
          <div 
            className="profile-avatar"
            onClick={handleUploadAvatar}
            style={{ cursor: 'pointer' }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {user.avatar ? (
              <img src={user.avatar} alt="头像" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          <p style={{ textAlign: 'center', color: '#9ca3af', marginTop: '8px', fontSize: '14px' }}>点击头像更换</p>
          <h2 className="text-center mb-8">{user.username}</h2>
        </div>
        
        <div className="grid grid-2">
          <div className="stat-card card">
            <div className="stat-label">年级</div>
            <input
              type="text"
              className="input mt-4"
              value={formData.grade}
              onChange={(e) => setFormData({...formData, grade: e.target.value})}
              placeholder="输入年级"
            />
          </div>
          
          <div className="stat-card card">
            <div className="stat-label">排名</div>
            <input
              type="text"
              className="input mt-4"
              value={formData.rank}
              onChange={(e) => setFormData({...formData, rank: e.target.value})}
              placeholder="输入年级排名"
            />
          </div>
          
          <div className="stat-card card">
            <div className="stat-label">目标分数</div>
            <input
              type="number"
              className="input mt-4"
              value={formData.targetScore}
              onChange={(e) => setFormData({...formData, targetScore: e.target.value})}
              placeholder="输入目标分数"
            />
          </div>
          
          <div className="stat-card card">
            <div className="stat-label">今日学习时长</div>
            <div className="stat-value">{user.studyTime || 0} 分钟</div>
          </div>
        </div>
        
        <div className="text-center mt-4">
          <button onClick={handleSave} className="btn btn-primary">
            保存修改
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
