<template>
  <AppNavbar />
  <AppSidebar @select="onSectionSelect" />
  <div class="forum-layout with-sidebar">
    <div class="forum-main">
      <div class="card">
        <PostCard v-for="post in visiblePosts" :key="post.id" :post="post" @click="goPost" />
        <div v-if="loading" class="loading-more"><span class="spinner"></span></div>
        <div v-if="!loading && visiblePosts.length === 0" class="empty-state">
          <p>暂无帖子，快来发布第一篇吧</p>
        </div>
      </div>
      <div ref="sentinel" class="scroll-sentinel"></div>
    </div>
  </div>
  <router-link to="/post/new" class="fab" title="发帖">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  </router-link>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppNavbar from '@/components/AppNavbar.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import PostCard from '@/components/PostCard.vue'
import { useSectionStore } from '@/stores/section'
import { formatDate } from '@/utils/format'

const router = useRouter()
const sectionStore = useSectionStore()
const PAGE_SIZE = 10
const loading = ref(false)
const displayCount = ref(PAGE_SIZE)
const sentinel = ref(null)
let observer = null

const allPosts = ref([
  { id: 1, title: 'Vue 3 Composition API 最佳实践总结', content: '本文总结了在实际项目中使用 Vue 3 Composition API 的经验，包括响应式数据管理、自定义 Hooks 设计、性能优化技巧等核心内容...', author: '前端小王', section: 'tech', votes: 128, replyCount: 32, shareCount: 15, pinned: true, createdAt: '2026-05-19T10:30:00' },
  { id: 2, title: '2026年前端开发趋势预测', content: '随着 AI 辅助编程的普及，前端开发模式正在发生深刻变化。本文从框架演进、构建工具、AI集成三个维度进行分析...', author: '技术观察者', section: 'tech', votes: 96, replyCount: 48, shareCount: 22, pinned: true, createdAt: '2026-05-18T14:00:00' },
  { id: 3, title: '分享一组深色模式UI设计稿', content: '最近完成了一套 SaaS 后台管理系统的深色模式设计，包含仪表盘、数据表格、表单等常见场景，欢迎大家点评...', author: '设计师小李', section: 'design', votes: 67, replyCount: 19, shareCount: 8, createdAt: '2026-05-18T09:15:00' },
  { id: 4, title: '如何看待 TypeScript 5.x 的类型系统增强？', content: 'TypeScript 5.x 引入了更强的类型推断和新的工具类型，大家在实际项目中感受到变化了吗？来聊聊你的看法...', author: 'TS爱好者', section: 'discuss', votes: 85, replyCount: 56, shareCount: 12, createdAt: '2026-05-17T16:20:00' },
  { id: 5, title: 'Vite 构建速度突然变慢怎么排查？', content: '项目用了半年一直很快，最近突然冷启动要30秒以上，已排除 node_modules 和缓存问题，求大佬指点排查方向...', author: '困惑的开发者', section: 'question', votes: 34, replyCount: 21, shareCount: 2, createdAt: '2026-05-17T11:45:00' },
  { id: 6, title: '推荐10个高质量开发者播客频道', content: '整理了我过去一年持续收听的10个技术播客，涵盖前端、后端、架构设计等方向，每个都值得长期关注...', author: '播客达人', section: 'share', votes: 73, replyCount: 15, shareCount: 31, createdAt: '2026-05-16T20:00:00' },
  { id: 7, title: '论坛升级公告：新增 Markdown 实时预览', content: '本次更新为发帖编辑器增加了 Markdown 实时预览功能，支持代码高亮、表格、数学公式等语法。如遇问题请在下方反馈...', author: '管理员', section: 'announce', votes: 45, replyCount: 8, shareCount: 5, createdAt: '2026-05-16T10:00:00' },
  { id: 8, title: 'Rust + WebAssembly 在前端的实际应用案例', content: '分享我们将图像处理核心逻辑用 Rust 重写并编译为 WASM 的完整过程，性能提升超过 10 倍，附带 Benchmark 对比数据...', author: '性能狂魔', section: 'tech', votes: 112, replyCount: 38, shareCount: 19, createdAt: '2026-05-15T15:30:00' },
  { id: 9, title: 'SVG 动画入门到进阶指南', content: '从基础的 SVG path 动画到复杂的 SMIL 和 CSS 动画组合，通过12个实战案例带你掌握 SVG 动画开发技巧...', author: '动画匠人', section: 'design', votes: 58, replyCount: 12, shareCount: 14, createdAt: '2026-05-15T09:00:00' },
  { id: 10, title: '大家都在用什么代码编辑器主题？', content: '最近想换个编辑器主题换个心情，目前用 One Dark Pro，想看看大家都在用什么主题，求推荐好看护眼的配色方案...', author: '主题收集控', section: 'discuss', votes: 42, replyCount: 67, shareCount: 3, createdAt: '2026-05-14T21:30:00' },
  { id: 11, title: 'Pinia 和 Vuex 5 该选哪个？', content: '新项目启动在即，状态管理库的选择让我纠结。Pinia 已经成为 Vue 官方推荐，但 Vuex 5 似乎也有不少改进，请过来人给些建议...', author: '选择困难症', section: 'question', votes: 56, replyCount: 43, shareCount: 7, createdAt: '2026-05-14T14:00:00' },
  { id: 12, title: '免费开源的设计系统资源合集', content: '整理了 20+ 个高质量开源设计系统，包含 Figma 组件库、Design Token 方案、可访问性指南等，UI设计师必备收藏...', author: '资源收集者', section: 'share', votes: 89, replyCount: 22, shareCount: 35, createdAt: '2026-05-13T18:00:00' },
  { id: 13, title: 'Node.js 22 新特性全面解读', content: 'Node.js 22 带来了原生 TypeScript 支持、增强的测试运行器、性能优化等重要更新，本文逐一分析每项新特性的实际影响...', author: '后端先锋', section: 'tech', votes: 94, replyCount: 27, shareCount: 18, createdAt: '2026-05-13T10:30:00' },
  { id: 14, title: '响应式设计中的排版技巧', content: '在现代响应式布局中，字体大小的自适应往往被忽视。本文介绍 clamp()、容器查询等方案来实现完美排版效果...', author: '排版控', section: 'design', votes: 41, replyCount: 9, shareCount: 6, createdAt: '2026-05-12T16:00:00' },
  { id: 15, title: '远程办公两年经验分享', content: '从2024年开始全职远程办公，总结了一些提高效率、保持社交、管理工作边界的方法，希望对即将或正在远程的朋友有帮助...', author: '远程老司机', section: 'discuss', votes: 76, replyCount: 54, shareCount: 20, createdAt: '2026-05-12T08:00:00' },
  { id: 16, title: 'Docker 容器网络模式详解', content: '深入解析 Docker 的 bridge、host、overlay、macvlan 等网络模式的工作原理和适用场景，配合实验演示更直观...', author: '运维小哥', section: 'tech', votes: 63, replyCount: 18, shareCount: 11, createdAt: '2026-05-11T14:00:00' },
  { id: 17, title: 'CSS Container Queries 实战体验', content: '容器查询终于得到了所有主流浏览器的支持！本文通过实际项目案例展示如何用容器查询替代媒体查询实现真正的组件级响应式...', author: 'CSS布道者', section: 'tech', votes: 87, replyCount: 24, shareCount: 16, createdAt: '2026-05-11T09:30:00' },
  { id: 18, title: 'Figma 插件开发入门教程', content: '从环境搭建到发布上架，手把手教你开发第一个 Figma 插件。包含 API 介绍、UI框架选择、调试技巧等完整流程...', author: '插件开发者', section: 'design', votes: 52, replyCount: 14, shareCount: 9, createdAt: '2026-05-10T11:00:00' },
  { id: 19, title: 'Git 高级技巧：交互式 Rebase 实战', content: '很多开发者只会基本的 git rebase -i，但它的强大远不止于此。本文演示如何用交互式 Rebase 美化提交历史、拆分提交等高级操作...', author: 'Git大师', section: 'share', votes: 68, replyCount: 16, shareCount: 22, createdAt: '2026-05-09T15:00:00' },
  { id: 20, title: '如何优雅地处理前端错误边界？', content: '错误边界是提升用户体验的关键。本文对比 Vue 3 的 onErrorCaptured 与 React Error Boundary 的设计差异，并给出最佳实践方案...', author: '架构思考者', section: 'tech', votes: 71, replyCount: 29, shareCount: 13, createdAt: '2026-05-09T10:00:00' },
  { id: 21, title: '三月社区之星评选结果公布', content: '恭喜本月社区之星 @前端小王、@播客达人、@性能狂魔 获得精选徽章！感谢大家为社区贡献的优质内容，四月评选即将开始...', author: '管理员', section: 'announce', votes: 38, replyCount: 11, shareCount: 4, createdAt: '2026-05-08T12:00:00' },
  { id: 22, title: 'Web Components 在微前端架构中的应用', content: '探索使用 Web Components 作为微前端基座的技术方案，对比 iframe、Module Federation 等方案的优劣，附完整示例代码...', author: '微前端探索', section: 'tech', votes: 59, replyCount: 21, shareCount: 10, createdAt: '2026-05-07T16:30:00' }
])

const filteredPosts = computed(() => {
  if (sectionStore.activeSection === 'all') return allPosts.value
  return allPosts.value.filter(p => p.section === sectionStore.activeSection)
})

const visiblePosts = computed(() => filteredPosts.value.slice(0, displayCount.value))
const hasMore = computed(() => displayCount.value < filteredPosts.value.length)

function onSectionSelect() { displayCount.value = PAGE_SIZE }

function loadMore() {
  if (loading.value || !hasMore.value) return
  loading.value = true
  setTimeout(() => {
    displayCount.value += PAGE_SIZE
    loading.value = false
  }, 400)
}

function goPost(post) { router.push(`/post/${post.id}`) }

onMounted(() => {
  observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore() }, { rootMargin: '200px' })
  if (sentinel.value) observer.observe(sentinel.value)
})
onUnmounted(() => { observer?.disconnect() })
</script>

<style scoped>
.scroll-sentinel { height: 1px; }
.loading-more { display: flex; justify-content: center; padding: var(--s-lg); }
.empty-state { text-align: center; padding: var(--s-3xl); color: var(--text-secondary); }
.fab {
  position: fixed; bottom: var(--s-xl); right: var(--s-xl);
  width: 56px; height: 56px; border-radius: 50%; background: var(--primary);
  color: #fff; display: flex; align-items: center; justify-content: center;
  box-shadow: var(--sh-lg); transition: all var(--t-fast); z-index: 40;
}
.fab:hover { transform: scale(1.1); background: var(--primary-dark); }
@media (max-width: 959px) { .fab { bottom: var(--s-lg); right: var(--s-lg); } }
</style>
