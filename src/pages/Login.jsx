import { useState } from 'react'
import './Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [grade, setGrade] = useState('')
  const [targetScore, setTargetScore] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (isRegister) {
      const newUser = {
        id: Date.now(),
        username,
        grade,
        targetScore: parseInt(targetScore) || 0,
        studyTime: 0,
        knowledgePoints: {
          '函数与导数': 50,
          '几何与代数': 50,
          '概率与统计': 50,
          '数列': 50,
          '不等式': 50,
          '其他': 50
        },
        practiceHistory: [],
        wrongBookIds: [],
        answeredQuestions: {},
        rank: ''
      }
      
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      users.push(newUser)
      localStorage.setItem('users', JSON.stringify(users))
      onLogin(newUser)
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      const user = users.find(u => u.username === username)
      
      if (user) {
        onLogin(user)
      } else {
        alert('用户不存在，请先注册')
      }
    }
  }

  return (
    <div className="login-container" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* 装饰性小熊 */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: '30px',
        fontSize: '80px',
        opacity: '0.4',
        zIndex: 1,
        animation: 'float 6s ease-in-out infinite'
      }}>🐻</div>
      <div style={{
        position: 'absolute',
        bottom: '80px',
        right: '30px',
        fontSize: '70px',
        opacity: '0.35',
        zIndex: 1,
        animation: 'float 8s ease-in-out infinite reverse'
      }}>🧸</div>
      
      {/* 装饰气球 */}
      <div style={{ position: 'absolute', top: '120px', right: '50px', display: 'flex', gap: '8px', alignItems: 'flex-end', zIndex: 1 }}>
        <div style={{ 
          width: '30px', height: '38px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, #FFE8A6 0%, #FFD66B 100%)',
          position: 'relative', animation: 'float 4s ease-in-out infinite'
        }}>
          <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '15px', background: '#8B6B4D' }}></div>
        </div>
        <div style={{ 
          width: '30px', height: '38px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, #D5EEFF 0%, #9DD6FF 100%)',
          position: 'relative', animation: 'float 4.5s ease-in-out infinite 0.5s',
          marginBottom: '5px'
        }}>
          <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '15px', background: '#8B6B4D' }}></div>
        </div>
        <div style={{ 
          width: '30px', height: '38px', borderRadius: '50%', 
          background: 'linear-gradient(135deg, #FFD5E5 0%, #FF9DBE 100%)',
          position: 'relative', animation: 'float 5s ease-in-out infinite 1s',
          marginBottom: '10px'
        }}>
          <div style={{ position: 'absolute', bottom: '-8px', left: '50%', transform: 'translateX(-50%)', width: '3px', height: '15px', background: '#8B6B4D' }}></div>
        </div>
      </div>
      
      <div className="login-card" style={{ position: 'relative', zIndex: 10 }}>
        <div className="login-header">
          {/* 头像 */}
          <div 
            className="avatar-placeholder"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #FFD5E5 0%, #FFC5D5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              color: '#8B6B4D',
              boxShadow: '0 4px 15px rgba(139, 107, 77, 0.2)',
              border: '3px solid #F5A08C',
              position: 'relative'
            }}
          >
            🐻
          </div>
        </div>
        
        <h2 className="login-title" style={{ color: '#8B6B4D', fontSize: '28px' }}>
          {isRegister ? '🎈 注册账号' : '✨ 欢迎回来'}
        </h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="用户名"
            className="input mb-4"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              borderRadius: '20px',
              border: '2px solid #F5A08C',
              background: '#FFF',
              color: '#3D2C1E',
              padding: '14px 20px',
              fontSize: '16px'
            }}
          />
          
          <input
            type="password"
            placeholder="密码"
            className="input mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              borderRadius: '20px',
              border: '2px solid #F5A08C',
              background: '#FFF',
              color: '#3D2C1E',
              padding: '14px 20px',
              fontSize: '16px'
            }}
          />
          
          {isRegister && (
            <>
              <input
                type="text"
                placeholder="年级 (如: 高一)"
                className="input mb-4"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                required
                style={{
                  borderRadius: '20px',
                  border: '2px solid #F5A08C',
                  background: '#FFF',
                  color: '#3D2C1E',
                  padding: '14px 20px',
                  fontSize: '16px'
                }}
              />
              <input
                type="number"
                placeholder="目标分数"
                className="input mb-4"
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
                required
                style={{
                  borderRadius: '20px',
                  border: '2px solid #F5A08C',
                  background: '#FFF',
                  color: '#3D2C1E',
                  padding: '14px 20px',
                  fontSize: '16px'
                }}
              />
            </>
          )}
          
          <button 
            type="submit" 
            className="btn btn-primary w-full mb-4"
            style={{
              borderRadius: '24px',
              background: 'linear-gradient(135deg, #F5A08C 0%, #FFB09D 100%)',
              border: 'none',
              padding: '14px',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(245, 160, 140, 0.3)'
            }}
          >
            {isRegister ? '🎉 立即注册' : '🐻 登录'}
          </button>
        </form>
        
        <p className="switch-mode" style={{ color: '#8B7A6B' }}>
          {isRegister ? '已有账号？' : '还没有账号？'}
          <button 
            onClick={() => setIsRegister(!isRegister)}
            className="link-btn"
            style={{
              color: '#F5A08C',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            {isRegister ? '去登录 →' : '去注册 ✨'}
          </button>
        </p>
      </div>
      
      {/* 动画样式 */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  )
}

export default Login
