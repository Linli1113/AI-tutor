import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Tutor.css'

const DEFAULT_DEEPSEEK_API_KEY =
  import.meta.env.VITE_DEEPSEEK_API_KEY || 'sk-f71c7058d3364af6a0166cc0c2737c4d'

function Tutor({ user }) {
  const navigate = useNavigate()
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [showConfig, setShowConfig] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState('')
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

  // 首次进入时静默补齐 API Key，避免移动端新用户看到配置弹窗
  useEffect(() => {
    const savedKey = localStorage.getItem('deepseekApiKey')
    if (!savedKey) {
      localStorage.setItem('deepseekApiKey', DEFAULT_DEEPSEEK_API_KEY)
      setApiKeyInput(DEFAULT_DEEPSEEK_API_KEY)
    } else {
      setApiKeyInput(savedKey)
    }
  }, [])

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('deepseekApiKey', apiKeyInput.trim())
      setShowConfig(false)
    }
  }

  const handleAsk = async () => {
    if (!question.trim()) return

    const userMessage = { role: 'user', content: question }
    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const apiKey = localStorage.getItem('deepseekApiKey') || DEFAULT_DEEPSEEK_API_KEY
      if (!apiKey) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '当前讲解服务暂时不可用，请稍后再试。'
        }])
        setLoading(false)
        return
      }

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一位专业的数学家教老师。请用清晰、易懂的方式解答数学问题，包括解题思路和步骤。\n\n重要要求：\n1. 所有数学公式必须使用高中数学课本的书面格式，使用中文的数学符号表示\n2. 禁止使用 LaTeX、Markdown、代码或任何其他计算机格式的公式\n3. 例如：分数用"分子/分母"或"几分之几"表示，平方根用"根号"表示，平方用"²"表示，下标用文字描述\n4. 举例：\n   - 正确：二分之一、根号3、x的平方、三角形ABC\n   - 错误：\\frac{1}{2}、$\\sqrt{3}$、x^2、$\\triangle ABC$'
            },
            ...messages,
            userMessage
          ]
        })
      })

      const data = await response.json()
      
      if (data.choices && data.choices[0]) {
        const assistantMessage = {
          role: 'assistant',
          content: data.choices[0].message.content
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '抱歉，API返回了错误响应：' + (data.error?.message || '未知错误')
        }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '抱歉，回答失败，请检查API配置或网络连接。'
      }])
    }

    setLoading(false)
    setQuestion('')
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
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
        <button onClick={() => setShowConfig(true)} className="btn btn-secondary">
          配置
        </button>
      </header>

      {/* API Key 配置弹窗 */}
      {showConfig && (
        <div className="modal-overlay" onClick={() => setShowConfig(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, #FFF3D6 0%, #FFE8A6 100%)', borderRadius: '24px', border: 'none' }}>
            <h2 className="mb-4" style={{ color: '#8B6B4D' }}>配置 Deepseek API Key</h2>
            <input
              type="text"
              className="input mb-4"
              placeholder="请输入API Key"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              autoFocus
              style={{ background: '#FFF', borderColor: '#F5A08C' }}
            />
            <div className="modal-buttons">
              <button onClick={() => setShowConfig(false)} className="btn btn-secondary">
                取消
              </button>
              <button onClick={handleSaveApiKey} className="btn btn-primary">
                保存
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="tutor-container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="chat-container" style={{ background: 'linear-gradient(135deg, #FFF3D6 0%, #FFE8A6 100%)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
          {messages.length === 0 ? (
            <div className="welcome-message">
              <h3 style={{ color: '#8B6B4D' }}>有什么问题尽管问熊家 🐻</h3>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`} style={{
                background: msg.role === 'user' 
                  ? 'linear-gradient(135deg, #FFD5E5 0%, #FFC5D5 100%)' 
                  : 'linear-gradient(135deg, #E8F5FF 0%, #D5EEFF 100%)',
                borderRadius: '20px',
                border: 'none'
              }}>
                <div className="message-content" style={{ color: '#3D2C1E' }}>{msg.content}</div>
              </div>
            ))
          )}
          
          {loading && (
            <div className="message assistant" style={{
              background: 'linear-gradient(135deg, #E8F5FF 0%, #D5EEFF 100%)',
              borderRadius: '20px'
            }}>
              <div className="message-content" style={{ color: '#3D2C1E' }}>正在思考中...</div>
            </div>
          )}
        </div>
        
        <div className="input-area">
          <textarea
            className="chat-input"
            placeholder="输入你的数学问题..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleAsk())}
            style={{ background: '#FFF', borderColor: '#F5A08C', borderRadius: '20px' }}
          />
          <button 
            onClick={handleAsk}
            className="btn btn-primary send-btn"
            disabled={loading}
          >
            发送
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tutor
