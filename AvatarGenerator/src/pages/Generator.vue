<template>
  <div class="generator-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">生成您的矢量头像</h1>
        <p class="page-desc">上传照片，调整参数，一键生成精美的矢量风格头像</p>
      </div>

      <div class="generator-layout">
        <div class="upload-section">
          <ImageUploader @image-selected="handleImageSelected" />
          
          <div v-if="hasOriginalImage" class="generate-section">
            <button 
              class="generate-btn" 
              :class="{ loading: isGenerating }"
              :disabled="isGenerating"
              @click="generateAvatar"
            >
              <span v-if="isGenerating" class="loading-spinner"></span>
              <span>{{ isGenerating ? '生成中...' : '开始生成' }}</span>
            </button>
          </div>
        </div>

        <div class="result-section">
          <div class="params-wrapper">
            <ParamsPanel />
          </div>
          <div class="preview-wrapper">
            <ResultPreview @regenerate="generateAvatar" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAvatarStore } from '@/store/avatar'
import ImageUploader from '@/components/ImageUploader.vue'
import ParamsPanel from '@/components/ParamsPanel.vue'
import ResultPreview from '@/components/ResultPreview.vue'

const store = useAvatarStore()

const hasOriginalImage = computed(() => store.hasOriginalImage)
const isGenerating = computed(() => store.isGenerating)

function handleImageSelected(imageData) {
  store.setOriginalImage(imageData)
}

function generateAvatar() {
  store.generateAvatar()
}
</script>

<style scoped>
.generator-page {
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
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 12px;
  color: #1f2937;
}

.page-desc {
  font-size: 1.1rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.generator-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.upload-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.generate-section {
  width: 100%;
}

.generate-btn {
  width: 100%;
  padding: 16px 32px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.params-wrapper,
.preview-wrapper {
  width: 100%;
}

@media (max-width: 1024px) {
  .generator-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .generator-page {
    padding-top: 100px;
    padding-bottom: 60px;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
