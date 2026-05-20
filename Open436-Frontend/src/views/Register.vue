<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
router.replace({ path: '/login', query: { mode: 'register' } })
</script>
