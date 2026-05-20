const APPLICATIONS = [
  { id: 1, name: '陈明远', studentId: '2023010101', major: '计算机科学与技术', phone: '13800001001', email: 'chen@example.com', selfIntro: '热爱编程，熟悉 Java 和 Python，有项目经验。', skills: 'Java, Python, Spring Boot, MySQL', status: 'pending', submittedAt: '2025-04-20 10:00', reviewedAt: null, reviewedBy: null, reviewReason: null },
  { id: 2, name: '李晓峰', studentId: '2023010102', major: '软件工程', phone: '13800001002', email: 'lixf@example.com', selfIntro: '对前端开发有浓厚兴趣，熟悉 React 和 Vue。', skills: 'JavaScript, React, Vue, TypeScript', status: 'approved', submittedAt: '2025-04-19 14:00', reviewedAt: '2025-04-20 09:00', reviewedBy: 'admin', reviewReason: null },
  { id: 3, name: '王思涵', studentId: '2023010203', major: '信息安全', phone: '13800001003', email: 'wangsh@example.com', selfIntro: '对网络安全和渗透测试感兴趣，参加过 CTF 比赛。', skills: 'Linux, Python, 网络安全, CTF', status: 'approved', submittedAt: '2025-04-18 16:00', reviewedAt: '2025-04-19 10:00', reviewedBy: 'admin', reviewReason: null },
  { id: 4, name: '张文博', studentId: '2023020104', major: '人工智能', phone: '13800001004', email: 'zhangwb@example.com', selfIntro: '研究方向为自然语言处理，熟悉深度学习框架。', skills: 'Python, PyTorch, TensorFlow, NLP', status: 'pending', submittedAt: '2025-04-21 09:00', reviewedAt: null, reviewedBy: null, reviewReason: null },
  { id: 5, name: '刘雨萱', studentId: '2023020105', major: '数据科学', phone: '13800001005', email: 'liuyx@example.com', selfIntro: '擅长数据分析和可视化，有大数据处理经验。', skills: 'Python, R, SQL, Spark, Tableau', status: 'pending', submittedAt: '2025-04-21 11:00', reviewedAt: null, reviewedBy: null, reviewReason: null },
  { id: 6, name: '赵天宇', studentId: '2023030106', major: '物联网工程', phone: '13800001006', email: 'zhaoty@example.com', selfIntro: '对嵌入式开发和 IoT 有研究。', skills: 'C, C++, Arduino, Raspberry Pi', status: 'rejected', submittedAt: '2025-04-17 13:00', reviewedAt: '2025-04-18 15:00', reviewedBy: 'admin', reviewReason: '技能方向与社团目前需求不太匹配' },
  { id: 7, name: '孙雅琪', studentId: '2023010207', major: '计算机科学与技术', phone: '13800001007', email: 'sunyq@example.com', selfIntro: '全栈开发爱好者，有多个个人项目。', skills: 'Java, Vue, Node.js, MongoDB', status: 'approved', submittedAt: '2025-04-16 10:00', reviewedAt: '2025-04-17 09:00', reviewedBy: 'admin', reviewReason: null },
  { id: 8, name: '周瑞祥', studentId: '2023020108', major: '网络工程', phone: '13800001008', email: 'zhourx@example.com', selfIntro: '熟悉网络运维和服务器管理。', skills: 'Linux, Docker, Nginx, 网络运维', status: 'pending', submittedAt: '2025-04-22 08:00', reviewedAt: null, reviewedBy: null, reviewReason: null },
  { id: 9, name: '吴诗涵', studentId: '2023010309', major: '数字媒体技术', phone: '13800001009', email: 'wush@example.com', selfIntro: '擅长 UI/UX 设计，熟悉设计工具和前端开发。', skills: 'Figma, Sketch, HTML/CSS, JavaScript', status: 'pending', submittedAt: '2025-04-22 10:30', reviewedAt: null, reviewedBy: null, reviewReason: null },
  { id: 10, name: '郑浩然', studentId: '2023040110', major: '电子信息工程', phone: '13800001010', email: 'zhenghr@example.com', selfIntro: '对硬件和底层开发感兴趣。', skills: 'C, Verilog, FPGA, 单片机', status: 'rejected', submittedAt: '2025-04-15 14:00', reviewedAt: '2025-04-16 11:00', reviewedBy: 'admin', reviewReason: '本学期招新名额已满' },
  { id: 11, name: '黄子轩', studentId: '2023010111', major: '软件工程', phone: '13800001011', email: 'huangzx@example.com', selfIntro: '移动端开发经验丰富，有多个已上架 App。', skills: 'Swift, Kotlin, Flutter, React Native', status: 'approved', submittedAt: '2025-04-14 09:00', reviewedAt: '2025-04-15 10:00', reviewedBy: 'admin', reviewReason: null },
  { id: 12, name: '林美琳', studentId: '2023020112', major: '计算机科学与技术', phone: '13800001012', email: 'linml@example.com', selfIntro: '擅长算法竞赛，有 ACM 区域赛获奖经历。', skills: 'C++, Python, 算法, 数据结构', status: 'pending', submittedAt: '2025-04-22 14:00', reviewedAt: null, reviewedBy: null, reviewReason: null }
]

let nextId = 13

function delay(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getApplicationList(params = {}) {
  await delay()
  let list = [...APPLICATIONS]
  if (params.status) list = list.filter(a => a.status === params.status)
  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    list = list.filter(a => a.name.toLowerCase().includes(kw) || a.studentId.includes(kw) || a.major.toLowerCase().includes(kw))
  }
  const page = params.page || 1
  const size = params.size || 10
  const start = (page - 1) * size
  return { code: 200, data: { list: list.slice(start, start + size), total: list.length }, message: 'ok' }
}

export async function reviewApplication(id, data) {
  await delay()
  const item = APPLICATIONS.find(a => a.id === id)
  if (!item) return { code: 404, message: '申请不存在' }
  item.status = data.status
  item.reviewReason = data.reason || null
  item.reviewedAt = new Date().toLocaleString('zh-CN')
  item.reviewedBy = 'admin'
  return { code: 200, data: item, message: '审核完成' }
}

export async function batchReview(data) {
  await delay()
  for (const id of data.ids) {
    const item = APPLICATIONS.find(a => a.id === id)
    if (item) {
      item.status = data.status
      item.reviewReason = data.reason || null
      item.reviewedAt = new Date().toLocaleString('zh-CN')
      item.reviewedBy = 'admin'
    }
  }
  return { code: 200, message: `批量审核完成，共 ${data.ids.length} 条` }
}

export async function getEnrollmentStatistics() {
  await delay()
  const total = APPLICATIONS.length
  const approved = APPLICATIONS.filter(a => a.status === 'approved').length
  const rejected = APPLICATIONS.filter(a => a.status === 'rejected').length
  const pending = APPLICATIONS.filter(a => a.status === 'pending').length
  return {
    code: 200,
    data: { total, approved, rejected, pending, approvalRate: total > 0 ? Math.round(approved / (approved + rejected) * 100) : 0 },
    message: 'ok'
  }
}
