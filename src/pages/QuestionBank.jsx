import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './QuestionBank.css'

// 高中数学习题数据（扩充版）
const questionData = {
  选择题: [
    { id: 1, question: '已知集合A={1,2,3,4}, B={x|x²-3x+2=0}, 则A∩B=', options: ['{1}', '{2}', '{1,2}', '{1,2,3}'], answer: 2, knowledge: '代数', difficulty: '简单' },
    { id: 2, question: '函数f(x)=x²-2x+3的单调递增区间是', options: ['(-∞,1]', '[1,+∞)', '(-∞,2]', '[2,+∞)'], answer: 1, knowledge: '代数', difficulty: '简单' },
    { id: 3, question: '已知sinα=3/5, α∈(π/2,π), 则tanα=', options: ['3/4', '-3/4', '4/3', '-4/3'], answer: 1, knowledge: '三角函数', difficulty: '简单' },
    { id: 4, question: '已知直线l经过点(1,2),且与直线y=2x+1平行,则l的方程是', options: ['y=2x', 'y=2x+1', 'y=2x-1', 'y=2x+2'], answer: 0, knowledge: '几何', difficulty: '简单' },
    { id: 5, question: '已知等差数列{aₙ}中,a₁=1,a₃=5,则公差d=', options: ['1', '2', '3', '4'], answer: 1, knowledge: '代数', difficulty: '简单' },
    { id: 6, question: '下列函数中,在区间(0,+∞)上为减函数的是', options: ['y=x²', 'y=2^x', 'y=log₂x', 'y=1/x'], answer: 3, knowledge: '代数', difficulty: '中等' },
    { id: 7, question: '在三角形ABC中,已知a=3,b=4,c=5,则角C=', options: ['30°', '60°', '90°', '120°'], answer: 2, knowledge: '几何', difficulty: '中等' },
    { id: 8, question: '方程x²-5x+6=0的解是', options: ['x=2', 'x=3', 'x=2或x=3', '无解'], answer: 2, knowledge: '代数', difficulty: '简单' },
    { id: 9, question: '已知向量a=(1,2),b=(x,-1),若a⊥b,则x=', options: ['-2', '2', '-1', '1'], answer: 1, knowledge: '代数', difficulty: '中等' },
    { id: 10, question: '从1,2,3,4,5中任取两个数,都是奇数的概率是', options: ['1/10', '3/10', '1/5', '2/5'], answer: 1, knowledge: '数据分析', difficulty: '中等' },
    { id: 11, question: '函数f(x)=e^x的导数是', options: ['e^x', 'xe^(x-1)', 'e^(x-1)', '1/e^x'], answer: 0, knowledge: '代数', difficulty: '中等' },
    { id: 12, question: '复数(1+i)²的值是', options: ['2', '2i', '1+i', '0'], answer: 1, knowledge: '代数', difficulty: '简单' },
    { id: 13, question: '已知cosθ=1/2,且θ为锐角,则θ=', options: ['30°', '45°', '60°', '90°'], answer: 2, knowledge: '三角函数', difficulty: '简单' },
    { id: 14, question: '圆(x-1)²+(y+2)²=4的圆心坐标是', options: ['(1,-2)', '(-1,2)', '(1,2)', '(-1,-2)'], answer: 0, knowledge: '几何', difficulty: '简单' },
    { id: 15, question: '在等比数列{aₙ}中,a₁=2,公比q=2,则a₄=', options: ['8', '16', '32', '64'], answer: 1, knowledge: '代数', difficulty: '简单' }
  ],
  填空题: [
    { id: 101, question: '函数f(x)=√(x-1)的定义域是__________。', answer: '[1,+∞)', knowledge: '代数', difficulty: '简单' },
    { id: 102, question: '已知数列{aₙ}的通项公式是aₙ=2n-1,则a₅=__________。', answer: '9', knowledge: '代数', difficulty: '简单' },
    { id: 103, question: 'cos45°的值是__________。', answer: '√2/2', knowledge: '三角函数', difficulty: '简单' },
    { id: 104, question: '已知圆的方程是x²+y²=4,则半径是__________。', answer: '2', knowledge: '几何', difficulty: '简单' },
    { id: 105, question: '从1,2,3,4这四个数中任取两个数,和为5的概率是__________。', answer: '1/3', knowledge: '数据分析', difficulty: '中等' },
    { id: 106, question: '函数f(x)=x³-3x的极小值是__________。', answer: '-2', knowledge: '代数', difficulty: '中等' },
    { id: 107, question: '在三角形ABC中,已知AB=AC,∠B=50°,则∠A=__________。', answer: '80°', knowledge: '几何', difficulty: '简单' },
    { id: 108, question: '已知log₂x=3,则x=__________。', answer: '8', knowledge: '代数', difficulty: '简单' },
    { id: 109, question: '已知向量a=(1,2),b=(3,4),则a·b=__________。', answer: '11', knowledge: '代数', difficulty: '简单' },
    { id: 110, question: '等比数列1,2,4,8,...的第5项是__________。', answer: '16', knowledge: '代数', difficulty: '简单' },
    { id: 111, question: '函数f(x)=sinx的最大值是__________。', answer: '1', knowledge: '三角函数', difficulty: '简单' },
    { id: 112, question: '抛物线y=x²的焦点坐标是__________。', answer: '(0,1/4)', knowledge: '几何', difficulty: '中等' },
    { id: 113, question: '已知a>0,则√a·√a=__________。', answer: 'a', knowledge: '代数', difficulty: '简单' },
    { id: 114, question: '∫x dx = __________。', answer: '(1/2)x²+C', knowledge: '代数', difficulty: '中等' },
    { id: 115, question: '直线y=3x-2的斜率是__________。', answer: '3', knowledge: '几何', difficulty: '简单' }
  ],
  应用题: [
    { id: 201, question: '某工厂生产某种产品,已知该产品的月产量x(吨)与每吨产品的价格P(元)之间的关系为P=24200-1/5 x²,且生产x吨的成本为R=50000+200x元.问该工厂每月生产多少吨产品才能使利润最大?最大利润是多少?', answer: '每月生产200吨,最大利润3150000元', knowledge: '代数', difficulty: '中等' },
    { id: 202, question: '在一个边长为2的正方形中,有一个半径为1的圆与正方形的四边都相切.现向正方形内随机投一点,求该点落在圆内的概率.', answer: 'π/4', knowledge: '几何', difficulty: '中等' },
    { id: 203, question: '已知一物体的运动方程是s(t)=3t+t²,求该物体在t=2时的瞬时速度.', answer: '7', knowledge: '代数', difficulty: '中等' },
    { id: 204, question: '从A地到B地,前一半路程的平均速度是v₁,后一半路程的平均速度是v₂,求全程的平均速度.', answer: '2v₁v₂/(v₁+v₂)', knowledge: '代数', difficulty: '中等' },
    { id: 205, question: '要做一个容积为256升的方底无盖水箱,问它的高为多少时用料最省?', answer: '4分米', knowledge: '代数', difficulty: '中等' },
    { id: 206, question: '一个直角三角形的两条直角边的和是10cm,求当斜边最短时,两条直角边的长各是多少?', answer: '5cm和5cm', knowledge: '几何', difficulty: '中等' },
    { id: 207, question: '某厂生产某种电子元件,生产一件正品可获利2元,生产一件次品损失1元.该厂每天生产的次品数y与日产量x的函数关系是y=1/(100-x),x≤99,x∈N.问日产量定为多少时,平均获利最大?', answer: '98件', knowledge: '数据分析', difficulty: '较难' },
    { id: 208, question: '从甲地到乙地,汽车第一天走了全程的1/2,第二天走了剩下路程的1/3,第三天走了再剩下路程的1/4,如此继续,到第10天时,还剩多少路程?', answer: '1/11', knowledge: '代数', difficulty: '较难' },
    { id: 209, question: '用一张长40cm、宽20cm的长方形铁皮做一只深5cm的无盖长方体盒子,要求盒子的体积最大,问应如何下料?', answer: '四角各截去边长5cm的正方形', knowledge: '几何', difficulty: '较难' },
    { id: 210, question: '某商店销售某种商品,年销售量为10000件,分批进货,每批进货量为x件,每批的进货手续费为1000元,每件商品的库存保管费为0.05元/年.若商品是均匀销售的,问每批进货量为多少时,全年的总费用(进货手续费与库存保管费之和)最小?', answer: '20000件', knowledge: '代数', difficulty: '较难' },
    { id: 211, question: '某城市人口总数为100万,如果年自然增长率为1.2%,试计算10年后该城市的人口总数(精确到0.1万).', answer: '112.7万', knowledge: '数据分析', difficulty: '中等' },
    { id: 212, question: '有一个圆柱形容器,底面半径为10cm,里面装了一些水,水深为8cm.将一个球放入容器中,球完全浸没在水中,水面上升了2cm,求这个球的半径.', answer: '5cm', knowledge: '几何', difficulty: '中等' },
    { id: 213, question: '某人向银行贷款10万元,年利率为5%,按复利计算,5年后一次性还清,问需要还多少钱?', answer: '127628元', knowledge: '数据分析', difficulty: '中等' },
    { id: 214, question: '已知一个扇形的周长为20cm,问半径和圆心角各为多少时,扇形的面积最大?', answer: '半径5cm,圆心角2弧度', knowledge: '几何', difficulty: '中等' },
    { id: 215, question: '从含有50件正品和10件次品的产品中任取2件,求恰好取到1件次品的概率.', answer: '100/177', knowledge: '数据分析', difficulty: '中等' }
  ]
}

function QuestionBank({ user, updateUser }) {
  const navigate = useNavigate()
  const [currentType, setCurrentType] = useState('选择题')
  const [viewMode, setViewMode] = useState('unanswered') // 'unanswered' or 'answered'
  const [userAnswers, setUserAnswers] = useState({})
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

  // 从localStorage加载用户答题记录
  const loadUserData = () => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const currentUser = users.find(u => u.id === user.id)
    if (currentUser) {
      return {
        practiceHistory: currentUser.practiceHistory || [],
        wrongBookIds: currentUser.wrongBookIds || [], // 存储错题本题目ID
        studyTime: currentUser.studyTime || 0,
        knowledgePoints: currentUser.knowledgePoints || {
          代数: 50,
          几何: 50,
          数据分析: 50,
          三角函数: 50
        },
        answeredQuestions: currentUser.answeredQuestions || {}
      }
    }
    return { practiceHistory: [], wrongBookIds: [], studyTime: 0, knowledgePoints: {}, answeredQuestions: {} }
  }

  // 保存用户答题记录
  const saveUserData = (practiceHistory, wrongBookIds, studyTime, knowledgePoints, answeredQuestions) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.id === user.id)
    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        practiceHistory,
        wrongBookIds,
        studyTime,
        knowledgePoints,
        answeredQuestions
      }
      localStorage.setItem('users', JSON.stringify(users))
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser'))
      if (currentUser && currentUser.id === user.id) {
        const updatedUser = users[userIndex]
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        if (updateUser) {
          updateUser(updatedUser)
        }
      }
    }
  }

  const userData = loadUserData()
  const allQuestionsList = Object.values(questionData).flat()
  const currentQuestions = questionData[currentType] || []

  // 分离已做和未做题目
  const answeredQuestions = currentQuestions.filter(q => userData.answeredQuestions[q.id])
  const unansweredQuestions = currentQuestions.filter(q => !userData.answeredQuestions[q.id])

  const answerQuestion = (questionId, userAnswer) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: userAnswer }))
  }

  const checkAnswer = (question, userAnswer) => {
    if (currentType === '选择题') {
      return userAnswer === question.options[question.answer]
    } else {
      return userAnswer && userAnswer.trim() === question.answer
    }
  }

  const submitQuestion = (question) => {
    const userAnswer = userAnswers[question.id]
    if (!userAnswer) {
      alert('请先输入答案！')
      return
    }

    const isCorrect = checkAnswer(question, userAnswer)
    
    const newPracticeHistory = [...userData.practiceHistory]
    const knowledgePoints = { ...userData.knowledgePoints }
    const newAnsweredQuestions = { ...userData.answeredQuestions }

    // 记录已做题目
    newAnsweredQuestions[question.id] = {
      userAnswer,
      correct: isCorrect,
      time: new Date().toLocaleString(),
      questionType: currentType
    }

    // 添加到练习历史
    newPracticeHistory.unshift({
      id: Date.now() + Math.random(),
      question: question.question,
      userAnswer,
      correctAnswer: question.answer,
      correct: isCorrect,
      knowledge: question.knowledge,
      type: currentType,
      time: new Date().toLocaleString(),
      duration: 30
    })

    // 更新知识点掌握度
    if (knowledgePoints[question.knowledge] !== undefined) {
      const currentLevel = knowledgePoints[question.knowledge]
      if (isCorrect) {
        knowledgePoints[question.knowledge] = Math.min(100, currentLevel + 5)
      } else {
        knowledgePoints[question.knowledge] = Math.max(0, currentLevel - 3)
      }
    }

    // 保存数据
    saveUserData(
      newPracticeHistory.slice(0, 100),
      userData.wrongBookIds,
      userData.studyTime + 1,
      knowledgePoints,
      newAnsweredQuestions
    )

    // 清除当前题目的答题记录，让它移动到已做题目
    setUserAnswers(prev => {
      const newAnswers = { ...prev }
      delete newAnswers[question.id]
      return newAnswers
    })
  }

  // 切换错题本收藏
  const toggleWrongBook = (questionId) => {
    const isInWrongBook = userData.wrongBookIds.includes(questionId)
    let newWrongBookIds
    if (isInWrongBook) {
      newWrongBookIds = userData.wrongBookIds.filter(id => id !== questionId)
    } else {
      newWrongBookIds = [...userData.wrongBookIds, questionId]
    }
    saveUserData(
      userData.practiceHistory,
      newWrongBookIds,
      userData.studyTime,
      userData.knowledgePoints,
      userData.answeredQuestions
    )
  }

  // 渲染未做题目
  const renderUnansweredQuestion = (question) => {
    const userAnswer = userAnswers[question.id]

    return (
      <div key={question.id} className="question-card">
        <div className="question-header">
          <span className="question-difficulty">{question.difficulty}</span>
          <span className="question-knowledge">{question.knowledge}</span>
        </div>
        
        <div className="question-text">{question.question}</div>

        {currentType === '选择题' ? (
          <div className="options-list">
            {question.options.map((opt, optIndex) => (
              <label key={optIndex} className="option-label">
                <input
                  type="radio"
                  name={`q${question.id}`}
                  value={opt}
                  checked={userAnswer === opt}
                  onChange={() => answerQuestion(question.id, opt)}
                />
                <span className="option-text">{opt}</span>
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            className="input mt-4"
            placeholder="请输入答案"
            value={userAnswer || ''}
            onChange={(e) => answerQuestion(question.id, e.target.value)}
          />
        )}

        <div style={{ marginTop: '16px' }}>
          <button onClick={() => submitQuestion(question)} className="btn btn-primary">
            提交答案
          </button>
        </div>
      </div>
    )
  }

  // 渲染已做题目
  const renderAnsweredQuestion = (question) => {
    const answerData = userData.answeredQuestions[question.id]
    const isCorrect = answerData?.correct
    const isInWrongBook = userData.wrongBookIds.includes(question.id)

    return (
      <div key={question.id} className="question-card answered">
        <div className="question-header">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isInWrongBook}
              onChange={() => toggleWrongBook(question.id)}
            />
            <span>加入错题本</span>
          </label>
          <span className="question-difficulty">{question.difficulty}</span>
          <span className="question-knowledge">{question.knowledge}</span>
          <span className={`status-badge ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? '✓ 正确' : '✗ 错误'}
          </span>
        </div>
        
        <div className="question-text">{question.question}</div>

        {question.options ? (
          <div className="options-list">
            {question.options.map((opt, optIndex) => {
              const isCorrectOption = question.answer === optIndex
              const isUserAnswer = answerData?.userAnswer === opt || 
                (typeof answerData?.userAnswer === 'number' && answerData?.userAnswer === optIndex)
              return (
                <label 
                  key={optIndex} 
                  className={`option-label ${isCorrectOption ? 'correct-option' : isUserAnswer ? 'wrong-option' : ''}`}
                >
                  <input
                    type="radio"
                    name={`q${question.id}`}
                    checked={isUserAnswer}
                    disabled
                  />
                  <span className="option-text">{opt}</span>
                  {isCorrectOption && <span className="tag correct-tag">正确答案</span>}
                  {isUserAnswer && !isCorrectOption && <span className="tag wrong-tag">你的答案</span>}
                </label>
              )
            })}
          </div>
        ) : (
          <div className="answered-answer-display">
            <div className="user-answer">
              <strong>你的答案：</strong>{answerData?.userAnswer || '未作答'}
            </div>
          </div>
        )}

        <div className="correct-answer">
          <strong>正确答案：</strong>{question.answer}
          {answerData?.userAnswer && (
            <span className={isCorrect ? 'answer-correct' : 'answer-wrong'}>
              {isCorrect ? ' ✓ 回答正确' : ' ✗ 回答错误'}
            </span>
          )}
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            <strong>答题时间：</strong>{answerData?.time}
          </div>
        </div>
      </div>
    )
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
        <div style={{ width: '80px' }}></div>
      </header>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="cookie-card" style={{ background: 'linear-gradient(135deg, #FFF3D6 0%, #FFE8A6 100%)', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)', position: 'relative', overflow: 'hidden' }}>
          {/* 装饰元素 */}
          <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '50px', zIndex: 1, animation: 'bounce 3s ease-in-out infinite' }}>
            🐻
          </div>
          {/* 一簇三个彩色气球 */}
          <div style={{ position: 'absolute', top: '15px', right: '20px', display: 'flex', gap: '8px', alignItems: 'flex-end', zIndex: 1 }}>
            <div style={{ 
              width: '30px', 
              height: '38px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #FFE8A6 0%, #FFD66B 100%)',
              position: 'relative',
              animation: 'float 4s ease-in-out infinite'
            }}>
              <div style={{ 
                position: 'absolute', 
                bottom: '-8px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '4px',
                height: '20px',
                background: '#8B6B4D'
              }}></div>
            </div>
            <div style={{ 
              width: '30px', 
              height: '38px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #D5EEFF 0%, #9DD6FF 100%)',
              position: 'relative',
              animation: 'float 4.5s ease-in-out infinite 0.5s',
              marginBottom: '5px'
            }}>
              <div style={{ 
                position: 'absolute', 
                bottom: '-8px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '4px',
                height: '20px',
                background: '#8B6B4D'
              }}></div>
            </div>
            <div style={{ 
              width: '30px', 
              height: '38px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, #FFD5E5 0%, #FF9DBE 100%)',
              position: 'relative',
              animation: 'float 5s ease-in-out infinite 1s',
              marginBottom: '10px'
            }}>
              <div style={{ 
                position: 'absolute', 
                bottom: '-8px', 
                left: '50%', 
                transform: 'translateX(-50%)',
                width: '4px',
                height: '20px',
                background: '#8B6B4D'
              }}></div>
            </div>
          </div>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(-5deg); }
              50% { transform: translateY(-15px) rotate(5deg); }
            }
          `}</style>
          
          <h2 className="mb-4" style={{ textAlign: 'center', color: '#8B6B4D', position: 'relative', zIndex: 2 }}>熊熊知识本 📚</h2>
          
          {/* 题目类型选择 */}
          <div className="question-type-tabs" style={{ justifyContent: 'center', display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {Object.keys(questionData).map(type => (
              <button
                key={type}
                className={`tab-btn ${currentType === type ? 'active' : ''}`}
                onClick={() => setCurrentType(type)}
                style={{
                  borderRadius: '20px',
                  padding: '12px 24px',
                  border: 'none',
                  background: currentType === type 
                    ? 'linear-gradient(135deg, #F5A08C 0%, #FFB09D 100%)' 
                    : 'linear-gradient(135deg, #FFE8D6 0%, #FFD5C7 100%)',
                  color: currentType === type ? '#FFF' : '#8B6B4D',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(139, 107, 77, 0.1)'
                }}
              >
                {type}
              </button>
            ))}
          </div>

          {/* 未做题/已做题切换 */}
          <div className="view-mode-tabs" style={{ justifyContent: 'center', display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <button
              className={`view-mode-btn ${viewMode === 'unanswered' ? 'active' : ''}`}
              onClick={() => setViewMode('unanswered')}
              style={{
                borderRadius: '20px',
                padding: '10px 32px',
                border: 'none',
                background: viewMode === 'unanswered' 
                  ? 'linear-gradient(135deg, #E8F5FF 0%, #D5EEFF 100%)' 
                  : 'linear-gradient(135deg, #FFF 0%, #FFF8F0 100%)',
                color: '#8B6B4D',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(139, 107, 77, 0.1)'
              }}
            >
              未做题 ({unansweredQuestions.length}) 📖
            </button>
            <button
              className={`view-mode-btn ${viewMode === 'answered' ? 'active' : ''}`}
              onClick={() => setViewMode('answered')}
              style={{
                borderRadius: '20px',
                padding: '10px 32px',
                border: 'none',
                background: viewMode === 'answered' 
                  ? 'linear-gradient(135deg, #E5FFE5 0%, #D5FFD5 100%)' 
                  : 'linear-gradient(135deg, #FFF 0%, #FFF8F0 100%)',
                color: '#8B6B4D',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(139, 107, 77, 0.1)'
              }}
            >
              已做题 ({answeredQuestions.length}) ✅
            </button>
          </div>

          {/* 未做题显示 */}
          {viewMode === 'unanswered' && (
            <div className="questions-section">
              {unansweredQuestions.length > 0 ? (
                <div className="questions-list">
                  {unansweredQuestions.map(q => renderUnansweredQuestion(q))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p style={{ color: '#666' }}>太棒了！所有题目都已完成！</p>
                  <button 
                    onClick={() => setViewMode('answered')} 
                    className="btn btn-secondary mt-4"
                  >
                    查看已做题目
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 已做题显示 */}
          {viewMode === 'answered' && (
            <div className="questions-section">
              {answeredQuestions.length > 0 ? (
                <div className="questions-list">
                  {answeredQuestions.map(q => renderAnsweredQuestion(q))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p style={{ color: '#666' }}>还没有做过题目，快去做题吧！</p>
                  <button 
                    onClick={() => setViewMode('unanswered')} 
                    className="btn btn-primary mt-4"
                  >
                    去做题
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionBank
