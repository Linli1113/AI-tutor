import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import './Home.css'
import DailyEncouragement from '../components/DailyEncouragement'

function Home({ user, onLogout }) {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
  const [showContextMenu, setShowContextMenu] = useState(false)
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

  const features = [
    {
      title: '知识题库',
      description: '高中数学常见习题练习',
      path: '/question-bank',
      color: 'linear-gradient(135deg, #FFE8A6 0%, #FFD5A6 100%)',
      number: 1
    },
    {
      title: '学习进度',
      description: '查看知识点掌握度和练习历史',
      path: '/progress',
      color: 'linear-gradient(135deg, #FFD5E5 0%, #FFC5D5 100%)',
      number: 2
    },
    {
      title: '学习情况',
      description: '学习报告和数据分析',
      path: '/report',
      color: 'linear-gradient(135deg, #E8F5FF 0%, #D5EEFF 100%)',
      number: 3
    },
    {
      title: '讲解引擎',
      description: 'AI智能答疑，解题思路讲解',
      path: '/tutor',
      color: 'linear-gradient(135deg, #E5FFE5 0%, #D5FFD5 100%)',
      number: 4
    }
  ]

  const BearNumber = ({ num, isBrown = true }) => {
    const bgColor = isBrown 
      ? 'linear-gradient(135deg, #8B6B4D 0%, #A8896D 100%)'
      : 'linear-gradient(135deg, #F5EEE6 0%, #E8E0D5 100%)'
    const textColor = isBrown ? '#FFF8F0' : '#8B6B4D'
    
    return (
      <div style={{
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: 'bold',
        color: textColor,
        boxShadow: '0 4px 16px rgba(139, 107, 77, 0.25)',
        position: 'relative'
      }}>
        <div style={{
          position: 'absolute',
          width: '22px',
          height: '22px',
          background: bgColor,
          borderRadius: '50%',
          top: '-10px',
          left: '3px'
        }}></div>
        <div style={{
          position: 'absolute',
          width: '22px',
          height: '22px',
          background: bgColor,
          borderRadius: '50%',
          top: '-10px',
          right: '3px'
        }}></div>
        {num}
      </div>
    )
  }

  const handleAvatarRightClick = (e) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  const handleAvatarClick = () => {
    setShowContextMenu(false)
    navigate('/profile')
  }

  const handleUploadAvatar = () => {
    setShowContextMenu(false)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const avatarUrl = event.target?.result
        const updatedUser = { ...user, avatar: avatarUrl, avatarUrl: avatarUrl }
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        
        const users = JSON.parse(localStorage.getItem('users') || '[]')
        const index = users.findIndex(u => u.id === user.id)
        if (index !== -1) {
          users[index] = updatedUser
          localStorage.setItem('users', JSON.stringify(users))
        }
        
        window.location.reload()
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClickOutside = () => {
    setShowContextMenu(false)
  }

  return (
    <div onClick={handleClickOutside} style={{ position: 'relative', minHeight: '100vh' }}>
      {/* 装饰性小熊 */}
      <div style={{
        position: 'fixed',
        top: '80px',
        left: '20px',
        fontSize: '80px',
        opacity: '0.3',
        pointerEvents: 'none',
        zIndex: 1,
        animation: 'float 6s ease-in-out infinite'
      }}>🐻</div>
      <div style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        fontSize: '70px',
        opacity: '0.25',
        pointerEvents: 'none',
        zIndex: 1,
        animation: 'float 8s ease-in-out infinite reverse'
      }}>🧸</div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>

      <header className="app-header" style={{ 
        background: 'rgba(255, 248, 240, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(245, 160, 140, 0.15)',
        gap: '20px'
      }}>
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
        <div className="header-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {showContextMenu && (
            <div
              className="context-menu"
              style={{
                position: 'fixed',
                left: contextMenuPosition.x,
                top: contextMenuPosition.y,
                zIndex: 1000
              }}
            >
              <div className="context-menu-item" onClick={handleUploadAvatar}>
                上传头像
              </div>
            </div>
          )}
          <div 
            className="user-avatar"
            onClick={handleAvatarClick}
            onContextMenu={handleAvatarRightClick}
            style={{ cursor: 'pointer', border: '4px solid #F5A08C' }}
          >
            {user.avatar || user.avatarUrl ? (
              <img src={user.avatar || user.avatarUrl} alt="头像" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.username.charAt(0).toUpperCase()
            )}
          </div>
          <button onClick={onLogout} className="btn btn-secondary">
            退出
          </button>
        </div>
      </header>
      
      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="cookie-card welcome-card" style={{ 
          background: 'linear-gradient(135deg, #FFE8D6 0%, #FFD5C7 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', right: '20px', top: '20px', fontSize: '60px' }}>🧸</div>
          <h2 className="mb-4" style={{ color: '#3D2C1E' }}>叮！{user.username} 登录成功✨</h2>
          <p style={{ color: '#8B7A6B' }}>今天的数学，比昨天简单一丢丢哦（骗你的，但熊陪你）</p>
        </div>
        
        <div className="grid grid-2">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="feature-card cookie-card"
              onClick={() => navigate(feature.path)}
              style={{
                background: feature.color,
                display: 'flex',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <BearNumber num={feature.number} isBrown={index % 2 === 0} />
              <div>
                <h3 style={{ color: '#3D2C1E', fontSize: '18px', marginBottom: '4px' }}>{feature.title}</h3>
                <p style={{ color: '#8B7A6B', fontSize: '14px' }}>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <DailyEncouragement />
      </div>
    </div>
  )
}

export default Home
