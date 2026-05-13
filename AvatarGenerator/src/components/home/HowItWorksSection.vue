<template>
  <section class="how-it-works">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">使用流程</span>
        <h2 class="section-title">三步创建您的头像</h2>
        <p class="section-description">简单易用，几秒钟即可完成</p>
      </div>

      <div class="steps">
        <div v-for="(step, index) in steps" :key="index" class="step">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-icon">
            <span class="emoji-icon">{{ step.emoji }}</span>
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.description }}</p>
        </div>
      </div>

      <div class="cta-wrapper">
        <router-link to="/generator" class="btn btn-primary">
          立即开始
          <span class="btn-arrow">→</span>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const steps = ref([
  {
    title: '上传照片',
    description: '点击或拖拽上传您的照片，支持 JPG、PNG、WebP 格式',
    emoji: '📤'
  },
  {
    title: '调整参数',
    description: '根据喜好调整饱和度、对比度、线条粗细等参数',
    emoji: '⚙️'
  },
  {
    title: '下载保存',
    description: 'AI 自动生成矢量头像，支持 PNG 和 SVG 格式下载',
    emoji: '💾'
  }
])
</script>

<style scoped>
.how-it-works {
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

.steps {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  margin-bottom: 60px;
}

.step {
  position: relative;
  text-align: center;
  padding: 40px 24px;
  background: #f9fafb;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.step:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.step-number {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  border-radius: 50%;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.step-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15);
}

.emoji-icon {
  font-size: 2.5rem;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: #1f2937;
}

.step-desc {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.7;
}

.cta-wrapper {
  text-align: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 36px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  color: white;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(99, 102, 241, 0.4);
}

.btn-arrow {
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-arrow {
  transform: translateX(4px);
}

@media (max-width: 1024px) {
  .steps {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

@media (max-width: 768px) {
  .how-it-works {
    padding: 60px 0;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .steps {
    gap: 40px;
  }

  .step {
    padding: 32px 20px;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
