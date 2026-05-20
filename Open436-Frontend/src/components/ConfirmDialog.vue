<template>
  <div v-if="visible" class="modal-overlay" @click.self="cancel">
    <div class="modal">
      <div class="modal-header">
        <span class="modal-title">确认操作</span>
      </div>
      <div class="modal-body">
        <p>{{ message }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-text" @click="cancel">取消</button>
        <button class="btn btn-primary" @click="confirm">确定</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const visible = ref(false)
const message = ref('')
let onConfirm = null

function show(msg, callback) {
  message.value = msg
  onConfirm = callback
  visible.value = true
  document.body.style.overflow = 'hidden'
}
function confirm() { visible.value = false; document.body.style.overflow = ''; onConfirm?.() }
function cancel() { visible.value = false; document.body.style.overflow = '' }

defineExpose({ show })
</script>
