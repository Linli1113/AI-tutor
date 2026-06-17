import { useState, useEffect } from 'react'

const encouragementList = [
  '每一次努力，都是在为梦想铺路！',
  '学习的道路上，你不是孤军奋战！',
  '今天的坚持，明天的收获！',
  '知识改变命运，学习成就未来！',
  '不积跬步，无以至千里！',
  '成功不是偶然，而是必然的积累！',
  '越努力，越幸运！',
  '保持热爱，奔赴山海！',
  '你的潜力，无限可能！',
  '每道题都是一次成长的机会！',
  '数学的世界，充满无限奥秘！',
  '相信自己，你能行！',
  '每天进步一点点，成功就在眼前！',
  '学习是一场马拉松，不是短跑！',
  '勤奋是最好的老师！'
]

function DailyEncouragement() {
  const [text, setText] = useState('')

  useEffect(() => {
    const today = new Date().toDateString()
    const savedDate = localStorage.getItem('encouragementDate')
    const savedText = localStorage.getItem('encouragementText')

    if (savedDate === today && savedText) {
      setText(savedText)
    } else {
      const index = Math.floor(Math.random() * encouragementList.length)
      const newText = encouragementList[index]
      setText(newText)
      localStorage.setItem('encouragementDate', today)
      localStorage.setItem('encouragementText', newText)
    }
  }, [])

  return (
    <div style={{
      background: 'linear-gradient(135deg, #FFF3D6 0%, #FFE8A6 100%)',
      borderRadius: '24px',
      padding: '32px 28px',
      textAlign: 'center',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', left: '15px', top: '10px', fontSize: '35px', transform: 'rotate(-15deg)' }}>🐻</div>
      <div style={{ position: 'absolute', right: '15px', bottom: '10px', fontSize: '35px', transform: 'rotate(15deg)' }}>🧸</div>
      <div style={{ fontSize: '28px', marginBottom: '12px', color: '#F5A08C' }}>💪</div>
      <h3 style={{ marginBottom: '16px', color: '#8B6B4D', fontSize: '18px', fontWeight: '600' }}>每日一句</h3>
      <p style={{ fontSize: '17px', color: '#3D2C1E', lineHeight: '1.7', fontStyle: 'italic' }}>
        "{text}"
      </p>
    </div>
  )
}

export default DailyEncouragement
