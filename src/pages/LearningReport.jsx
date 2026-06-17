import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Line, Radar, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
)

// 高中数学习题数据
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

function LearningReport({ user }) {
  const navigate = useNavigate()
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

  const knowledgePoints = user.knowledgePoints || {
    '函数与导数': 50,
    '几何与代数': 50,
    '概率与统计': 50,
    '数列': 50,
    '不等式': 50,
    '其他': 50
  }

  const practiceHistory = user.practiceHistory || []
  const wrongBookIds = user.wrongBookIds || []
  const answeredQuestions = user.answeredQuestions || {}
  
  // 从answeredQuestions中计算统计数据
  const allQuestionsList = Object.values(questionData).flat()
  
  // 统计已做题数量、正确题数和错题数
  let totalAnswered = 0
  let totalCorrect = 0
  let totalWrong = 0
  
  // 按题型统计
  const typeStats = {
    选择题: { total: 0, correct: 0 },
    填空题: { total: 0, correct: 0 },
    应用题: { total: 0, correct: 0 }
  }
  
  // 按日期统计（用于进步曲线）
  const dailyStats = {}
  
  allQuestionsList.forEach(q => {
    const ans = answeredQuestions[q.id]
    if (ans) {
      totalAnswered++
      if (ans.correct) {
        totalCorrect++
      } else {
        totalWrong++
      }
      
      // 按题型统计
      const qType = ans.questionType || '选择题'
      if (typeStats[qType]) {
        typeStats[qType].total++
        if (ans.correct) typeStats[qType].correct++
      }
      
      // 按日期统计
      const dateKey = ans.time ? new Date(ans.time).toLocaleDateString() : new Date().toLocaleDateString()
      if (!dailyStats[dateKey]) {
        dailyStats[dateKey] = { total: 0, correct: 0 }
      }
      dailyStats[dateKey].total++
      if (ans.correct) dailyStats[dateKey].correct++
    }
  })
  
  // 计算统计数据
  const totalQuestions = totalAnswered
  const correctQuestions = totalCorrect
  const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0
  const studyTime = user.studyTime || 0

  // 生成本周7天的日期（从周一开始）
  const getWeekDays = () => {
    const dates = []
    const now = new Date()
    const dayOfWeek = now.getDay() // 0 是周日，1 是周一，...，6 是周六
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek // 找到本周一
    const monday = new Date(now)
    monday.setDate(now.getDate() + daysToMonday)
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      const month = String(date.getMonth() + 1)
      const day = String(date.getDate())
      dates.push(`${month}/${day}`)
    }
    return dates
  }

  const weekDays = getWeekDays()

  const radarData = {
    labels: Object.keys(knowledgePoints),
    datasets: [
      {
        label: '掌握度',
        data: Object.values(knowledgePoints),
        backgroundColor: 'rgba(79, 172, 254, 0.2)',
        borderColor: 'rgba(79, 172, 254, 1)',
        borderWidth: 2,
      },
    ],
  }

  // 正确率环形图
  const doughnutData = {
    labels: ['正确', '错误'],
    datasets: [
      {
        data: [correctQuestions, totalAnswered - correctQuestions],
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(239, 68, 68, 0.8)'],
        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
        borderWidth: 1,
      },
    ],
  }

  // 获取本周一
  const getMonday = () => {
    const now = new Date()
    const dayOfWeek = now.getDay()
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(now)
    monday.setDate(now.getDate() + daysToMonday)
    return monday
  }

  // 学习趋势图（做题数）
  const lineData = {
    labels: weekDays,
    datasets: [
      {
        label: '每日做题数',
        data: (() => {
          const monday = getMonday()
          const data = []
          for (let i = 0; i < 7; i++) {
            const targetDate = new Date(monday)
            targetDate.setDate(monday.getDate() + i)
            const targetDateStr = targetDate.toDateString()
            data.push(practiceHistory.filter(q => new Date(q.time).toDateString() === targetDateStr).length)
          }
          return data
        })(),
        borderColor: 'rgba(102, 126, 234, 1)',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  // 进步曲线（正确率变化）
  const progressData = {
    labels: weekDays,
    datasets: [
      {
        label: '正确率变化',
        data: (() => {
          const monday = getMonday()
          const data = []
          for (let i = 0; i < 7; i++) {
            const targetDate = new Date(monday)
            targetDate.setDate(monday.getDate() + i)
            const dateKey = targetDate.toDateString()
            
            let dayStats = dailyStats[dateKey]
            if (dayStats) {
              data.push(dayStats.total > 0 ? Math.round((dayStats.correct / dayStats.total) * 100) : 0)
            } else {
              data.push(0)
            }
          }
          
          if (data.every(v => v === 0)) {
            return [50, 55, 60, 58, 65, 70, accuracy]
          }
          return data
        })(),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
      },
    },
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
  }

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: true,
  }

  const progressOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: '正确率 %'
        }
      },
    },
  }

  // 生成学习建议
  const generateSuggestions = () => {
    const suggestions = []
    
    // 找出掌握度最低的知识点
    const weakPoints = Object.entries(knowledgePoints)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 2)
    
    weakPoints.forEach(([point, score]) => {
      if (score < 60) {
        suggestions.push({
          type: 'warning',
          title: '重点加强',
          content: `您在"${point}"方面的掌握度较低(${score}%),建议多做相关题目`
        })
      } else if (score < 80) {
        suggestions.push({
          type: 'info',
          title: '继续努力',
          content: `您在"${point}"方面还有提升空间(${score}%),建议继续练习`
        })
      }
    })
    
    // 根据正确率给出建议
    if (accuracy < 60) {
      suggestions.push({
        type: 'warning',
        title: '基础需加强',
        content: `您的整体正确率偏低(${accuracy}%),建议从基础题开始,循序渐进`
      })
    } else if (accuracy < 80) {
      suggestions.push({
        type: 'info',
        title: '稳步提升',
        content: `您的表现不错(${accuracy}%),建议多做中等难度题目,巩固知识点`
      })
    } else {
      suggestions.push({
        type: 'success',
        title: '表现优秀',
        content: `您的表现非常好(${accuracy}%),建议尝试一些高难度题目挑战自己`
      })
    }
    
    // 根据错题本给出建议
    if (wrongBookIds.length > 0) {
      suggestions.push({
        type: 'info',
        title: '错题复习',
        content: `您的错题本中有${wrongBookIds.length}道题,建议定期复习巩固`
      })
    }
    
    return suggestions
  }

  const suggestions = generateSuggestions()

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
        {/* 两行两列布局 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div className="card chart-card" style={{ padding: '16px', background: 'linear-gradient(135deg, #FFF3D6 0%, #FFE8A6 100%)', borderRadius: '24px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '12px', color: '#8B6B4D' }}>知识点掌握情况 📊</h2>
            <div>
              <Radar data={radarData} options={chartOptions} />
            </div>
          </div>

          <div className="card chart-card" style={{ background: 'linear-gradient(135deg, #FFD5E5 0%, #FFC5D5 100%)', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
            <h2 style={{ color: '#8B6B4D' }}>正确率分布 ✅</h2>
            <div className="doughnut-chart">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>

          <div className="card chart-card" style={{ background: 'linear-gradient(135deg, #E8F5FF 0%, #D5EEFF 100%)', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
            <h2 style={{ color: '#8B6B4D' }}>学习趋势 📈</h2>
            <div className="line-chart">
              <Line data={lineData} options={lineOptions} />
            </div>
          </div>

          <div className="card chart-card" style={{ background: 'linear-gradient(135deg, #E5FFE5 0%, #D5FFD5 100%)', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
            <h2 style={{ color: '#8B6B4D' }}>进步曲线 🚀</h2>
            <div className="line-chart">
              <Line data={progressData} options={progressOptions} />
            </div>
          </div>
        </div>

        {/* 学习建议 */}
        <div className="card" style={{ background: 'linear-gradient(135deg, #FFF3D6 0%, #FFE8A6 100%)', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
          <h2 style={{ color: '#8B6B4D' }}>学习建议 💡</h2>
          <div style={{ display: 'grid', gap: '12px', marginTop: '16px' }}>
            {suggestions.map((suggestion, index) => (
              <div 
                key={index}
                style={{
                  padding: '16px',
                  borderRadius: '20px',
                  border: '1px solid',
                  backgroundColor: 
                    suggestion.type === 'success' ? 'rgba(16, 185, 129, 0.1)' :
                    suggestion.type === 'warning' ? 'rgba(251, 191, 36, 0.1)' :
                    'rgba(245, 160, 140, 0.1)',
                  borderColor:
                    suggestion.type === 'success' ? 'rgba(16, 185, 129, 0.3)' :
                    suggestion.type === 'warning' ? 'rgba(251, 191, 36, 0.3)' :
                    'rgba(245, 160, 140, 0.3)'
                }}
              >
                <div style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '8px',
                  color: 
                    suggestion.type === 'success' ? '#8B6B4D' :
                    suggestion.type === 'warning' ? '#D4A853' :
                    '#F5A08C'
                }}>
                  {suggestion.title}
                </div>
                <div style={{ color: '#8B7A6B' }}>{suggestion.content}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ background: 'linear-gradient(135deg, #FFD5E5 0%, #FFC5D5 100%)', borderRadius: '24px', padding: '28px', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)' }}>
          <h2 style={{ color: '#8B6B4D' }}>题型分析 📝</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '24px' }}>
            {Object.entries(typeStats).map(([type, stats]) => {
              const typeAccuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
              return (
                <div key={type} className="stat-card" style={{ textAlign: 'center', background: '#FFF', borderRadius: '20px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)' }}>
                  <div style={{ fontSize: '14px', color: '#8B7A6B', marginBottom: '8px' }}>{type}</div>
                  <div className="stat-value" style={{ color: '#F5A08C' }}>{stats.total}</div>
                  <div className="stat-label">已做</div>
                  <div style={{ marginTop: '12px', fontSize: '24px', fontWeight: 'bold', color: '#8B6B4D' }}>
                    {typeAccuracy}%
                  </div>
                  <div className="stat-label">正确率</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LearningReport
