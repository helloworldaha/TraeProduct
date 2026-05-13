<template>
  <div class="history-page">
    <div class="container">
      <div class="page-header">
        <div class="header-content">
          <div>
            <h1 class="page-title">历史记录</h1>
            <p class="page-desc">您生成的所有头像都保存在这里</p>
          </div>
          <button
            v-if="history.length > 0"
            class="clear-btn"
            @click="showClearConfirm = true"
          >
            <span class="btn-icon">🗑️</span>
            清空历史
          </button>
        </div>
      </div>

      <div v-if="history.length === 0" class="empty-state">
        <span class="empty-icon">📁</span>
        <h2>暂无历史记录</h2>
        <p>开始生成您的第一个矢量头像吧！</p>
        <router-link to="/generator" class="btn-primary">
          去生成
        </router-link>
      </div>

      <div v-else class="history-grid">
        <div
          v-for="item in history"
          :key="item.id"
          class="history-card"
        >
          <div class="card-images">
            <div class="image-wrapper">
              <img :src="item.originalImage" alt="Original" class="card-image" />
              <span class="image-label">原图</span>
            </div>
            <div class="arrow">
              <span class="arrow-icon">→</span>
            </div>
            <div class="image-wrapper">
              <img :src="item.generatedImage" alt="Generated" class="card-image vector" />
              <span class="image-label">矢量</span>
            </div>
          </div>

          <div class="card-info">
            <span class="card-date">{{ formatDate(item.timestamp) }}</span>
            <div class="card-params">
              <span class="param-tag">饱和度: {{ item.params.saturation }}%</span>
              <span class="param-tag">圆角: {{ item.params.borderRadius }}%</span>
            </div>
          </div>

          <div class="card-actions">
            <button class="action-btn" @click="loadItem(item)" title="重新编辑">
              <span class="btn-icon">✏️</span>
              编辑
            </button>
            <button class="action-btn delete" @click="deleteItem(item.id)" title="删除">
              <span class="btn-icon">🗑️</span>
              删除
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showClearConfirm" class="modal-overlay" @click="showClearConfirm = false">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">确认清空？</h3>
        <p class="modal-desc">此操作将删除所有历史记录，且无法恢复。</p>
        <div class="modal-actions">
          <button class="btn-cancel" @click="showClearConfirm = false">取消</button>
          <button class="btn-confirm" @click="clearAll">确认清空</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAvatarStore } from '@/store/avatar'

const router = useRouter()
const store = useAvatarStore()

const history = computed(() => store.history)
const showClearConfirm = ref(false)

function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function loadItem(item) {
  store.loadHistoryItem(item)
  router.push('/generator')
}

function deleteItem(id) {
  store.deleteFromHistory(id)
}

function clearAll() {
  store.clearHistory()
  showClearConfirm.value = false
}
</script>

<style scoped>
.history-page {
  padding-top: 120px;
  padding-bottom: 80px;
  background: #f9fafb;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  margin-bottom: 40px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 8px;
  color: #1f2937;
}

.page-desc {
  font-size: 1.1rem;
  color: #6b7280;
}

.clear-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  color: #ef4444;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.05);
  border-color: #ef4444;
}

.btn-icon {
  font-size: 1rem;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 24px;
  opacity: 0.5;
  display: inline-block;
}

.empty-state h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2937;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 24px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.history-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.history-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.card-images {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.image-wrapper {
  flex: 1;
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f9fafb;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-label {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 500;
}

.arrow {
  color: #6366f1;
  flex-shrink: 0;
}

.arrow-icon {
  font-size: 1.5rem;
}

.card-info {
  margin-bottom: 16px;
}

.card-date {
  display: block;
  font-size: 0.85rem;
  color: #6b7280;
  margin-bottom: 8px;
}

.card-params {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.param-tag {
  padding: 4px 10px;
  background: #f9fafb;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #6b7280;
}

.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #d1d5db;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  background: #f9fafb;
  color: #1f2937;
}

.action-btn:hover {
  background: #d1d5db;
}

.action-btn.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
}

.modal-desc {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-cancel {
  flex: 1;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  font-weight: 600;
  color: #1f2937;
  transition: background 0.2s ease;
}

.btn-cancel:hover {
  background: #d1d5db;
}

.btn-confirm {
  flex: 1;
  padding: 12px;
  background: #ef4444;
  border-radius: 10px;
  font-weight: 600;
  color: white;
  transition: background 0.2s ease;
}

.btn-confirm:hover {
  background: #dc2626;
}

@media (max-width: 768px) {
  .history-page {
    padding-top: 100px;
    padding-bottom: 60px;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .history-grid {
    grid-template-columns: 1fr;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
