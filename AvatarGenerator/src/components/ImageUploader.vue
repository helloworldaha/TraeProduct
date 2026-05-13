<template>
  <div
    class="uploader"
    :class="{
      'uploader-dragging': isDragging,
      'uploader-error': hasError,
      'uploader-success': hasImage
    }"
    @dragover.prevent="handleDragOver"
    @dragleave.prevent="handleDragLeave"
    @drop.prevent="handleDrop"
    @paste="handlePaste"
    tabindex="0"
  >
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      class="uploader-input"
      @change="handleFileSelect"
    />

    <div v-if="!hasImage" class="uploader-content">
      <div class="uploader-icon">📤</div>
      <h3 class="uploader-title">上传您的照片</h3>
      <p class="uploader-desc">
        点击、拖拽图片到此处，或<span class="uploader-paste">粘贴 (Ctrl+V)</span>
      </p>
      <div class="uploader-formats">
        <span class="format-tag">JPG</span>
        <span class="format-tag">PNG</span>
        <span class="format-tag">WebP</span>
        <span class="format-tag">最大 10MB</span>
      </div>
      <button class="uploader-btn" @click="triggerFileInput">
        选择文件
      </button>
    </div>

    <div v-else class="uploader-preview">
      <img :src="previewImage" alt="Preview" class="preview-image" />
      <div class="preview-overlay">
        <button class="preview-btn" @click="triggerFileInput">
          <span class="preview-icon">🔄</span>
          重新上传
        </button>
      </div>
    </div>

    <div v-if="hasError" class="uploader-error-message">
      <span class="error-icon">⚠️</span>
      <span>{{ errorMessage }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { validateImage, fileToDataURL } from '@/utils'
import { useAvatarStore } from '@/store/avatar'

const emit = defineEmits(['image-selected'])

const store = useAvatarStore()

const fileInput = ref(null)
const isDragging = ref(false)
const previewImage = computed(() => store.originalImage)
const hasImage = computed(() => store.hasOriginalImage)
const hasError = computed(() => store.uploadStatus === 'error')
const errorMessage = computed(() => store.uploadError)

function triggerFileInput() {
  fileInput.value?.click()
}

function handleDragOver() {
  isDragging.value = true
}

function handleDragLeave() {
  isDragging.value = false
}

function handleDrop(e) {
  isDragging.value = false
  const files = e.dataTransfer?.files
  if (files?.length) {
    processFile(files[0])
  }
}

function handlePaste(e) {
  const items = e.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      if (file) {
        processFile(file)
        break
      }
    }
  }
}

function handleFileSelect(e) {
  const files = e.target?.files
  if (files?.length) {
    processFile(files[0])
  }
}

async function processFile(file) {
  const validation = validateImage(file)
  if (!validation.valid) {
    store.setUploadError(validation.error)
    return
  }

  try {
    const dataURL = await fileToDataURL(file)
    store.setOriginalImage(dataURL)
    emit('image-selected', dataURL)
  } catch (error) {
    store.setUploadError('图片读取失败，请重试')
  }
}

function handleGlobalPaste(e) {
  if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
    return
  }
  handlePaste(e)
}

onMounted(() => {
  document.addEventListener('paste', handleGlobalPaste)
})

onUnmounted(() => {
  document.removeEventListener('paste', handleGlobalPaste)
})
</script>

<style scoped>
.uploader {
  position: relative;
  width: 100%;
  min-height: 300px;
  border: 2px dashed #d1d5db;
  border-radius: 20px;
  background: #f9fafb;
  transition: all 0.3s ease;
  overflow: hidden;
  cursor: pointer;
}

.uploader:hover {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.03);
}

.uploader-dragging {
  border-color: #6366f1;
  background: rgba(99, 102, 241, 0.08);
  transform: scale(1.01);
}

.uploader-error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.uploader-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
  width: 100%;
  height: 100%;
}

.uploader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  min-height: 300px;
}

.uploader-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #6366f1;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.uploader-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
}

.uploader-desc {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 24px;
}

.uploader-paste {
  color: #6366f1;
  font-weight: 500;
}

.uploader-formats {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  justify-content: center;
}

.format-tag {
  padding: 6px 12px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6b7280;
}

.uploader-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.25);
}

.uploader-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(99, 102, 241, 0.35);
}

.uploader-preview {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.uploader-preview:hover .preview-overlay {
  opacity: 1;
}

.preview-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  color: #1f2937;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.preview-btn:hover {
  transform: scale(1.05);
}

.preview-icon {
  font-size: 1rem;
}

.uploader-error-message {
  position: absolute;
  bottom: 16px;
  left: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: white;
  border: 1px solid #ef4444;
  border-radius: 10px;
  color: #ef4444;
  font-size: 0.9rem;
}

.error-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .uploader {
    min-height: 250px;
  }

  .uploader-content {
    padding: 24px;
    min-height: 250px;
  }

  .uploader-icon {
    font-size: 3rem;
  }

  .uploader-title {
    font-size: 1.1rem;
  }

  .uploader-preview {
    height: 250px;
  }
}
</style>
