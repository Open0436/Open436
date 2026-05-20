const TYPES = ['choice', 'truefalse', 'fill']
const DIFFICULTIES = [1, 2, 3, 4, 5]
const STATUSES = ['draft', 'published']

function randItem(arr) { return arr[Math.floor(Math.random() * arr.length)] }
function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min }

const QUESTIONS = [
  { id: 1, title: 'Vue 3 中 ref 和 reactive 的区别', type: 'choice', difficulty: 2, content: '以下关于 Vue 3 中 ref 和 reactive 的描述，哪个是正确的？', options: ['ref 只能用于基本类型', 'reactive 可以用于基本类型', 'ref 需要通过 .value 访问', 'reactive 需要通过 .value 访问'], answer: 'C', tags: ['Vue', '前端'], status: 'published', createdAt: '2025-04-01 10:00', updatedAt: '2025-04-01 10:00' },
  { id: 2, title: 'HTTP 状态码 404 含义', type: 'choice', difficulty: 1, content: 'HTTP 状态码 404 表示什么？', options: ['服务器错误', '资源未找到', '权限不足', '请求超时'], answer: 'B', tags: ['HTTP', '网络'], status: 'published', createdAt: '2025-04-02 14:00', updatedAt: '2025-04-02 14:00' },
  { id: 3, title: 'JavaScript 中闭包的概念', type: 'truefalse', difficulty: 3, content: '闭包是指函数可以访问其外部作用域中变量的能力，即使外部函数已经返回。', answer: '对', tags: ['JavaScript', '前端'], status: 'published', createdAt: '2025-04-03 09:00', updatedAt: '2025-04-03 09:00' },
  { id: 4, title: 'CSS Flexbox 主轴方向', type: 'choice', difficulty: 2, content: 'flex-direction: column 的主轴方向是？', options: ['水平从左到右', '水平从右到左', '垂直从上到下', '垂直从下到上'], answer: 'C', tags: ['CSS', '前端'], status: 'published', createdAt: '2025-04-04 11:00', updatedAt: '2025-04-04 11:00' },
  { id: 5, title: 'TCP 三次握手', type: 'truefalse', difficulty: 3, content: 'TCP 三次握手中，第二次握手服务器发送的是 SYN+ACK 报文。', answer: '对', tags: ['网络', 'TCP'], status: 'published', createdAt: '2025-04-05 16:00', updatedAt: '2025-04-05 16:00' },
  { id: 6, title: 'Python 列表推导式输出', type: 'fill', difficulty: 2, content: '执行 [x**2 for x in range(5)] 的结果是？', answer: '[0, 1, 4, 9, 16]', tags: ['Python'], status: 'published', createdAt: '2025-04-06 10:00', updatedAt: '2025-04-06 10:00' },
  { id: 7, title: 'Java 中 final 关键字', type: 'choice', difficulty: 3, content: '以下关于 Java final 关键字的描述，哪个是错误的？', options: ['final 修饰的类不能被继承', 'final 修饰的方法不能被重写', 'final 修饰的变量值不能改变', 'final 修饰的构造方法不能被调用'], answer: 'D', tags: ['Java', '后端'], status: 'published', createdAt: '2025-04-07 14:00', updatedAt: '2025-04-07 14:00' },
  { id: 8, title: 'Git rebase 和 merge 区别', type: 'choice', difficulty: 4, content: '关于 git rebase 和 git merge，以下说法正确的是？', options: ['rebase 会保留完整的历史记录', 'merge 会产生一个新的合并提交', 'rebase 更安全适合共享分支', '两者效果完全相同'], answer: 'B', tags: ['Git', '工具'], status: 'published', createdAt: '2025-04-08 09:00', updatedAt: '2025-04-08 09:00' },
  { id: 9, title: 'SQL JOIN 类型', type: 'choice', difficulty: 3, content: 'LEFT JOIN 会返回哪些记录？', options: ['仅左表匹配的记录', '仅右表匹配的记录', '左表所有记录和右表匹配记录', '两表所有记录'], answer: 'C', tags: ['SQL', '数据库'], status: 'published', createdAt: '2025-04-09 11:00', updatedAt: '2025-04-09 11:00' },
  { id: 10, title: 'Docker 镜像与容器关系', type: 'truefalse', difficulty: 2, content: 'Docker 容器是镜像的一个运行实例，一个镜像可以创建多个容器。', answer: '对', tags: ['Docker', '运维'], status: 'published', createdAt: '2025-04-10 15:00', updatedAt: '2025-04-10 15:00' },
  { id: 11, title: 'Redis 数据类型', type: 'choice', difficulty: 2, content: '以下哪个不是 Redis 的基本数据类型？', options: ['String', 'Hash', 'Queue', 'Set'], answer: 'C', tags: ['Redis', '数据库'], status: 'draft', createdAt: '2025-04-11 10:00', updatedAt: '2025-04-11 10:00' },
  { id: 12, title: 'React Hooks 使用规则', type: 'truefalse', difficulty: 3, content: 'React Hooks 可以在条件语句中使用。', answer: '错', tags: ['React', '前端'], status: 'draft', createdAt: '2025-04-12 14:00', updatedAt: '2025-04-12 14:00' },
  { id: 13, title: 'Linux 文件权限', type: 'fill', difficulty: 3, content: 'chmod 755 file.txt 中，数字 5 代表的权限是？', answer: 'r-x（读和执行）', tags: ['Linux', '运维'], status: 'draft', createdAt: '2025-04-13 09:00', updatedAt: '2025-04-13 09:00' },
  { id: 14, title: 'Spring Boot 自动配置原理', type: 'choice', difficulty: 4, content: 'Spring Boot 自动配置主要依赖哪个注解？', options: ['@Component', '@Configuration', '@EnableAutoConfiguration', '@Bean'], answer: 'C', tags: ['Spring', 'Java'], status: 'draft', createdAt: '2025-04-14 16:00', updatedAt: '2025-04-14 16:00' },
  { id: 15, title: 'Go goroutine 与 channel', type: 'truefalse', difficulty: 4, content: 'Go 语言中，未缓冲的 channel 会阻塞发送方直到有接收方准备好。', answer: '对', tags: ['Go', '后端'], status: 'published', createdAt: '2025-04-15 10:00', updatedAt: '2025-04-15 10:00' }
]

let nextId = 16

function delay(ms = 200) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function getQuizList(params = {}) {
  await delay()
  let list = [...QUESTIONS]
  if (params.type) list = list.filter(q => q.type === params.type)
  if (params.difficulty) list = list.filter(q => q.difficulty === Number(params.difficulty))
  if (params.status) list = list.filter(q => q.status === params.status)
  if (params.keyword) {
    const kw = params.keyword.toLowerCase()
    list = list.filter(q => q.title.toLowerCase().includes(kw) || q.content.toLowerCase().includes(kw))
  }
  const page = params.page || 1
  const size = params.size || 10
  const start = (page - 1) * size
  return { code: 200, data: { list: list.slice(start, start + size), total: list.length }, message: 'ok' }
}

export async function getQuizDetail(id) {
  await delay()
  const item = QUESTIONS.find(q => q.id === id)
  return item ? { code: 200, data: item, message: 'ok' } : { code: 404, message: '习题不存在' }
}

export async function createQuiz(data) {
  await delay()
  const item = { id: nextId++, ...data, createdAt: new Date().toLocaleString('zh-CN'), updatedAt: new Date().toLocaleString('zh-CN'), status: data.status || 'draft' }
  QUESTIONS.unshift(item)
  return { code: 200, data: item, message: '创建成功' }
}

export async function updateQuiz(id, data) {
  await delay()
  const idx = QUESTIONS.findIndex(q => q.id === id)
  if (idx === -1) return { code: 404, message: '习题不存在' }
  Object.assign(QUESTIONS[idx], data, { updatedAt: new Date().toLocaleString('zh-CN') })
  return { code: 200, data: QUESTIONS[idx], message: '更新成功' }
}

export async function deleteQuiz(id) {
  await delay()
  const idx = QUESTIONS.findIndex(q => q.id === id)
  if (idx === -1) return { code: 404, message: '习题不存在' }
  QUESTIONS.splice(idx, 1)
  return { code: 200, message: '删除成功' }
}

export async function getQuizStatistics() {
  await delay()
  return {
    code: 200,
    data: {
      total: QUESTIONS.length,
      published: QUESTIONS.filter(q => q.status === 'published').length,
      draft: QUESTIONS.filter(q => q.status === 'draft').length,
      byType: { choice: QUESTIONS.filter(q => q.type === 'choice').length, truefalse: QUESTIONS.filter(q => q.type === 'truefalse').length, fill: QUESTIONS.filter(q => q.type === 'fill').length }
    },
    message: 'ok'
  }
}
