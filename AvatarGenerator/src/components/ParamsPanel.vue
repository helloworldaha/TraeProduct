<template>
  <div class="params-panel">
    <h3 class="params-title">调整参数</h3>

    <div class="params-list">
      <div class="param-item">
        <div class="param-header">
          <label class="param-label">饱和度</label>
          <span class="param-value">{{ localParams.saturation }}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          v-model.number="localParams.saturation"
          class="param-slider"
          @input="updateParam('saturation', localParams.saturation)"
        />
      </div>

      <div class="param-item">
        <div class="param-header">
          <label class="param-label">对比度</label>
          <span class="param-value">{{ localParams.contrast }}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          v-model.number="localParams.contrast"
          class="param-slider"
          @input="updateParam('contrast', localParams.contrast)"
        />
      </div>

      <div class="param-item">
        <div class="param-header">
          <label class="param-label">线条粗细</label>
          <span class="param-value">{{ localParams.lineWidth }}</span>
        </div>
        <input
          type="range"
          min="1"
          max="8"
          v-model.number="localParams.lineWidth"
          class="param-slider"
          @input="updateParam('lineWidth', localParams.lineWidth)"
        />
      </div>

      <div class="param-item">
        <div class="param-header">
          <label class="param-label">背景颜色</label>
          <div class="color-picker-wrapper">
            <input
              type="color"
              v-model="localParams.backgroundColor"
              class="color-picker"
              @input="updateParam('backgroundColor', localParams.backgroundColor)"
            />
            <span class="color-value">{{ localParams.backgroundColor }}</span>
          </div>
        </div>
        <div class="color-presets">
          <button
            v-for="color in colorPresets"
            :key="color"
            class="color-preset"
            :style="{ background: color }"
            :class="{ active: localParams.backgroundColor === color }"
            @click="selectColor(color)"
          ></button>
        </div>
      </div>

      <div class="param-item">
        <div class="param-header">
          <label class="param-label">圆角程度</label>
          <span class="param-value">{{ localParams.borderRadius }}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          v-model.number="localParams.borderRadius"
          class="param-slider"
          @input="updateParam('borderRadius', localParams.borderRadius)"
        />
        <div class="border-preview">
          <div
            class="border-preview-item"
            :style="{ borderRadius: '0%' }"
            :class="{ active: localParams.borderRadius === 0 }"
            @click="selectBorderRadius(0)"
          ></div>
          <div
            class="border-preview-item"
            :style="{ borderRadius: '25%' }"
            :class="{ active: localParams.borderRadius >= 20 && localParams.borderRadius <= 40 }"
            @click="selectBorderRadius(25)"
          ></div>
          <div
            class="border-preview-item"
            :style="{ borderRadius: '50%' }"
            :class="{ active: localParams.borderRadius >= 45 }"
            @click="selectBorderRadius(100)"
          ></div>
        </div>
      </div>
    </div>

    <div class="params-actions">
      <button class="btn-reset" @click="reset">
        <span class="reset-icon">🔄</span>
        重置
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAvatarStore } from '@/store/avatar'
import { DefaultParams } from '@/types'

const store = useAvatarStore()

const localParams = reactive({ ...store.params })

const colorPresets = [
  '#ffffff',
  '#f8fafc',
  '#f1f5f9',
  '#fef3c7',
  '#d1fae5',
  '#dbeafe',
  '#ede9fe',
  '#fce7f3'
]

function updateParam(key, value) {
  store.updateParams({ [key]: value })
}

function selectColor(color) {
  localParams.backgroundColor = color
  updateParam('backgroundColor', color)
}

function selectBorderRadius(value) {
  localParams.borderRadius = value
  updateParam('borderRadius', value)
}

function reset() {
  Object.assign(localParams, DefaultParams)
  store.resetParams()
}

watch(() => store.params, (newParams) => {
  Object.assign(localParams, newParams)
}, { deep: true })
</script>

<style scoped>
.params-panel {
  background: white;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.params-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1f2937;
}

.params-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.param-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.param-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.param-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #1f2937;
}

.param-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #6366f1;
  background: rgba(99, 102, 241, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
}

.param-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #f9fafb;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.param-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
  transition: transform 0.2s ease;
}

.param-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.param-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.color-picker-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-picker {
  width: 36px;
  height: 36px;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  background: none;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 2px;
}

.color-picker::-webkit-color-swatch {
  border-radius: 5px;
  border: none;
}

.color-value {
  font-size: 0.85rem;
  font-family: monospace;
  color: #6b7280;
  text-transform: uppercase;
}

.color-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.color-preset {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #d1d5db;
  cursor: pointer;
  transition: all 0.2s ease;
}

.color-preset:hover {
  transform: scale(1.1);
  border-color: #6366f1;
}

.color-preset.active {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.3);
}

.border-preview {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.border-preview-item {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.border-preview-item:hover {
  transform: scale(1.1);
}

.border-preview-item.active {
  border-color: #1f2937;
}

.params-actions {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #d1d5db;
}

.btn-reset {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #f9fafb;
  color: #6b7280;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  width: 100%;
  justify-content: center;
}

.btn-reset:hover {
  background: #d1d5db;
  color: #1f2937;
}

.reset-icon {
  font-size: 1rem;
}

@media (max-width: 768px) {
  .params-panel {
    padding: 20px;
  }
}
</style>
