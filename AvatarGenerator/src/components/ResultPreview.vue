<template>
  <div class="result-preview">
    <div class="preview-header">
      <h3 class="preview-title">生成结果</h3>
      <div v-if="isGenerating" class="generating-status">
        <div class="spinner"></div>
        <span>AI 正在生成中...</span>
      </div>
    </div>

    <div class="preview-content">
      <div v-if="isGenerating" class="preview-placeholder generating">
        <div class="generating-animation">
          <div class="generating-circle"></div>
          <div class="generating-text">
            <span>正在将您的照片转换为矢量风格</span>
            <small>请稍候，这可能需要几秒钟</small>
          </div>
        </div>
      </div>

      <div v-else-if="hasResult" class="preview-result">
        <div class="result-image-wrapper">
          <img
            :src="generatedImage"
            alt="Generated avatar"
            class="result-image"
            :style="{ borderRadius: `${params.borderRadius}%` }"
          />
        </div>

        <div class="result-actions">
          <button class="action-btn btn-png" @click="downloadPNG">
            <span class="btn-icon">💾</span>
            下载 PNG
          </button>
          <button class="action-btn btn-svg" @click="downloadSVG">
            <span class="btn-icon">📄</span>
            下载 SVG
          </button>
        </div>

        <button class="regenerate-btn" @click="$emit('regenerate')">
          <span class="btn-icon">🔄</span>
          重新生成
        </button>
      </div>

      <div v-else class="preview-placeholder empty">
        <span class="placeholder-icon">🖼️</span>
        <p>上传照片并生成后<br/>结果将显示在这里</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAvatarStore } from '@/store/avatar'
import { downloadFile } from '@/utils'

defineEmits(['regenerate'])

const store = useAvatarStore()

const isGenerating = computed(() => store.isGenerating)
const hasResult = computed(() => store.hasGeneratedImage)
const generatedImage = computed(() => store.generatedImage)
const generatedSVG = computed(() => store.generatedSVG)
const params = computed(() => store.params)

function downloadPNG() {
  if (generatedImage.value) {
    downloadFile(generatedImage.value, `avatar-${Date.now()}`, 'png')
  }
}

function downloadSVG() {
  if (generatedSVG.value) {
    const blob = new Blob([generatedSVG.value], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    downloadFile(url, `avatar-${Date.now()}`, 'svg')
    URL.revokeObjectURL(url)
  }
}
</script>

<style scoped>
.result-preview {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.preview-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.generating-status {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6366f1;
  font-size: 0.9rem;
  font-weight: 500;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.preview-content {
  min-height: 300px;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  border-radius: 16px;
}

.preview-placeholder.empty {
  background: #f9fafb;
  color: #6b7280;
}

.placeholder-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  opacity: 0.5;
}

.preview-placeholder.empty p {
  font-size: 0.95rem;
  line-height: 1.6;
}

.preview-placeholder.generating {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(236, 72, 153, 0.05));
}

.generating-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.generating-circle {
  width: 80px;
  height: 80px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #6366f1;
  border-right-color: #ec4899;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

.generating-text {
  text-align: center;
}

.generating-text span {
  display: block;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.generating-text small {
  color: #6b7280;
  font-size: 0.85rem;
}

.preview-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.result-image-wrapper {
  width: 250px;
  height: 250px;
  background: #f9fafb;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: all 0.3s ease;
}

.result-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.btn-icon {
  font-size: 1rem;
}

.btn-png {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
}

.btn-png:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.btn-svg {
  background: #f9fafb;
  color: #1f2937;
  border: 2px solid #d1d5db;
}

.btn-svg:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.regenerate-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.regenerate-btn:hover {
  color: #6366f1;
}

@media (max-width: 768px) {
  .result-preview {
    padding: 20px;
  }

  .result-image-wrapper {
    width: 200px;
    height: 200px;
  }

  .result-actions {
    flex-direction: column;
    width: 100%;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
