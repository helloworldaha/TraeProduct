<template>
  <section id="examples" class="examples">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">效果展示</span>
        <h2 class="section-title">看看我们的示例</h2>
        <p class="section-description">只需上传一张照片，就能获得精美的矢量风格头像</p>
      </div>

      <div class="examples-grid">
        <div v-for="(example, index) in examples" :key="index" class="example-card">
          <div class="example-pair">
            <div class="example-image original">
              <div class="example-content" :class="example.type">
                <div v-if="example.type === 'portrait'" class="portrait-placeholder">
                  <div class="placeholder-head"></div>
                  <div class="placeholder-body"></div>
                </div>
                <div v-else-if="example.type === 'landscape'" class="landscape-placeholder">
                  <div class="placeholder-head small left"></div>
                  <div class="placeholder-head small right"></div>
                  <div class="placeholder-body wide"></div>
                </div>
                <div v-else class="artistic-placeholder">
                  <div class="placeholder-triangle"></div>
                  <div class="placeholder-square"></div>
                </div>
              </div>
            </div>
            <div class="example-arrow">→</div>
            <div class="example-image vector" :style="{ background: example.gradientStyle }">
              <div class="example-content vectorized" :class="example.type">
                <div v-if="example.type === 'portrait'" class="portrait-placeholder">
                  <div class="placeholder-head vectorized"></div>
                  <div class="placeholder-body vectorized"></div>
                </div>
                <div v-else-if="example.type === 'landscape'" class="landscape-placeholder">
                  <div class="placeholder-head small left vectorized"></div>
                  <div class="placeholder-head small right vectorized"></div>
                  <div class="placeholder-body wide vectorized"></div>
                </div>
                <div v-else class="artistic-placeholder">
                  <div class="placeholder-triangle vectorized"></div>
                  <div class="placeholder-square vectorized"></div>
                </div>
              </div>
            </div>
          </div>
          <p class="example-label">{{ example.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const examples = ref([
  {
    type: 'portrait',
    label: '单人头像',
    gradientStyle: 'linear-gradient(135deg, #6366f1, #ec4899)'
  },
  {
    type: 'landscape',
    label: '双人合影',
    gradientStyle: 'linear-gradient(135deg, #10b981, #06b6d4)'
  },
  {
    type: 'artistic',
    label: '艺术创作',
    gradientStyle: 'linear-gradient(135deg, #f59e0b, #ef4444)'
  }
])
</script>

<style scoped>
.examples {
  padding: 100px 0;
  background: white;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-tag {
  display: inline-block;
  padding: 6px 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 16px;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 16px;
  color: #1f2937;
}

.section-description {
  font-size: 1.125rem;
  color: #6b7280;
  max-width: 600px;
  margin: 0 auto;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.example-card {
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.example-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.example-pair {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.example-image {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.example-image.original {
  background: #f3f4f6;
}

.example-image.vector {
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.2);
}

.example-image:hover {
  transform: scale(1.05);
}

.example-arrow {
  color: #6366f1;
  flex-shrink: 0;
  font-size: 1.5rem;
}

.example-label {
  text-align: center;
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.example-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.portrait-placeholder {
  width: 60%;
  height: 80%;
  position: relative;
}

.landscape-placeholder {
  width: 80%;
  height: 80%;
  position: relative;
}

.artistic-placeholder {
  width: 60%;
  height: 70%;
  position: relative;
}

.placeholder-head {
  width: 60%;
  height: 40%;
  background: #9ca3af;
  border-radius: 50%;
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.placeholder-head.small {
  width: 35%;
  height: 35%;
}

.placeholder-head.small.left {
  left: 25%;
}

.placeholder-head.small.right {
  left: 75%;
}

.placeholder-head.vectorized {
  background: white;
  border: 3px solid #1f2937;
}

.placeholder-body {
  width: 90%;
  height: 40%;
  background: #9ca3af;
  border-radius: 50% 50% 0 0;
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
}

.placeholder-body.wide {
  width: 100%;
}

.placeholder-body.vectorized {
  background: white;
  border: 3px solid #1f2937;
}

.placeholder-triangle {
  width: 0;
  height: 0;
  border-left: 40px solid transparent;
  border-right: 40px solid transparent;
  border-bottom: 60px solid #9ca3af;
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
}

.placeholder-triangle.vectorized {
  border-bottom-color: white;
}

.placeholder-square {
  width: 70%;
  height: 50%;
  background: #9ca3af;
  position: absolute;
  bottom: 15%;
  left: 50%;
  transform: translateX(-50%);
}

.placeholder-square.vectorized {
  background: white;
  border: 3px solid #1f2937;
}

@media (max-width: 1024px) {
  .examples-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .examples {
    padding: 60px 0;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .example-pair {
    gap: 12px;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
