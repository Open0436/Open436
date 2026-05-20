import { defineStore } from 'pinia'
import { ref } from 'vue'

export const SECTIONS = [
  { key: 'all', name: '全部', icon: 'mdi:apps', color: '#757575', count: 0 },
  { key: 'tech', name: '技术交流', icon: 'mdi:code-tags', color: '#1976D2', count: 128 },
  { key: 'design', name: '设计分享', icon: 'mdi:palette', color: '#FF6F00', count: 86 },
  { key: 'discuss', name: '综合讨论', icon: 'mdi:forum', color: '#4CAF50', count: 234 },
  { key: 'question', name: '问答求助', icon: 'mdi:help-circle', color: '#9C27B0', count: 67 },
  { key: 'share', name: '资源分享', icon: 'mdi:share-variant', color: '#FF9800', count: 45 },
  { key: 'announce', name: '公告通知', icon: 'mdi:bullhorn', color: '#F44336', count: 12 }
]

export const useSectionStore = defineStore('section', () => {
  const sections = ref(SECTIONS)
  const activeSection = ref('all')

  function setActive(key) { activeSection.value = key }
  function getSection(key) { return sections.value.find(s => s.key === key) }

  return { sections, activeSection, setActive, getSection }
})
