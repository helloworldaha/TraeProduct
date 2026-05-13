<template>
  <section class="styles">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">多种风格</span>
        <h2 class="section-title">选择您喜欢的风格</h2>
        <p class="section-description">多种预设风格，满足不同场景需求</p>
      </div>

      <div class="styles-grid">
        <div v-for="(style, index) in styles" :key="index" class="style-card">
          <div class="style-preview" :style="{ background: style.gradient }">
            <div class="style-avatar" :style="{ '--line-width': style.lineWidth + 'px' }">
              <div class="avatar-face" :class="style.faceType">
              </div>
            </div>
          </div>
          <h3 class="style-name">{{ style.name }}</h3>
          <p class="style-desc">{{ style.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const styles = ref([
  {
    name: '极简风格',
    description: '简洁的线条和色块，现代感十足',
    gradient: 'linear-gradient(135deg, #6366f1, #818cf8)',
    lineWidth: 2,
    faceType: 'minimal'
  },
  {
    name: '卡通风格',
    description: '圆润可爱的造型，活泼有趣',
    gradient: 'linear-gradient(135deg, #ec4899, #f472b6)',
    lineWidth: 3,
    faceType: 'cartoon'
  },
  {
    name: '商务风格',
    description: '正式稳重，适合职场使用',
    gradient: 'linear-gradient(135deg, #1e293b, #334155)',
    lineWidth: 2,
    faceType: 'business'
  },
  {
    name: '艺术风格',
    description: '创意十足的几何化造型',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
    lineWidth: 4,
    faceType: 'artistic'
  }
])
</script>

<style scoped>
.styles {
  padding: 100px 0;
  background: #f9fafb;
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

.styles-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.style-card {
  background: white;
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.style-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.style-preview {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transition: transform 0.3s ease;
}

.style-card:hover .style-preview {
  transform: scale(1.1);
}

.style-avatar {
  width: 80px;
  height: 80px;
  position: relative;
}

.avatar-face {
  width: 100%;
  height: 100%;
  position: relative;
}

.avatar-face::before {
  content: '';
  width: 50px;
  height: 50px;
  background: white;
  border: var(--line-width, 2px) solid #1f2937;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.avatar-face::after {
  content: '';
  width: 70px;
  height: 40px;
  background: white;
  border: var(--line-width, 2px) solid #1f2937;
  border-radius: 50% 50% 0 0;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.style-name {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 8px;
  color: #1f2937;
}

.style-desc {
  font-size: 0.95rem;
  color: #6b7280;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .styles-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .styles {
    padding: 60px 0;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .styles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .style-card {
    padding: 24px 16px;
  }

  .style-preview {
    width: 100px;
    height: 100px;
  }

  .style-name {
    font-size: 1.1rem;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
