<template>
  <section class="faq">
    <div class="container">
      <div class="section-header">
        <span class="section-tag">常见问题</span>
        <h2 class="section-title">FAQ</h2>
        <p class="section-description">有疑问？看看这些常见问题</p>
      </div>

      <div class="faq-list">
        <div
          v-for="(item, index) in faqs"
          :key="index"
          class="faq-item"
          :class="{ 'faq-item-open': openIndex === index }"
        >
          <button class="faq-question" @click="toggleFAQ(index)">
            <span>{{ item.question }}</span>
            <span class="faq-icon"></span>
          </button>
          <div class="faq-answer">
            <p>{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

const faqs = ref([
  {
    question: '支持哪些图片格式？',
    answer: '我们支持 JPG、PNG 和 WebP 格式的图片上传。建议使用高清正面照片，效果会更好。'
  },
  {
    question: '上传的照片大小有限制吗？',
    answer: '是的，单张照片大小不能超过 10MB。如果您的照片过大，建议先压缩后再上传。'
  },
  {
    question: '生成的头像可以用于商业用途吗？',
    answer: '可以！您生成的所有头像都可以自由使用，包括个人和商业用途，没有任何限制。'
  },
  {
    question: '我的照片会被保存吗？',
    answer: '不会。我们采用纯前端处理方式，您的照片不会上传到任何服务器，完全在浏览器本地处理，保护您的隐私安全。'
  },
  {
    question: '可以下载什么格式的头像？',
    answer: '我们支持 PNG 和 SVG 两种格式下载。PNG 适合直接使用，SVG 是矢量格式，可以无限缩放而不失真。'
  },
  {
    question: '为什么要使用矢量格式？',
    answer: '矢量格式的头像可以无限放大而不会模糊，非常适合用作各种尺寸的头像，从社交媒体到名片印刷都能保持清晰。'
  }
])

function toggleFAQ(index) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.faq {
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

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
}

.faq-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  text-align: left;
  transition: background 0.2s ease;
}

.faq-question:hover {
  background: #f9fafb;
}

.faq-icon {
  width: 24px;
  height: 24px;
  position: relative;
  flex-shrink: 0;
  margin-left: 16px;
  transition: transform 0.3s ease;
}

.faq-icon::before,
.faq-icon::after {
  content: '';
  position: absolute;
  background: #6b7280;
  transition: all 0.3s ease;
}

.faq-icon::before {
  width: 12px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(45deg);
}

.faq-icon::after {
  width: 12px;
  height: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-45deg);
}

.faq-item-open .faq-icon {
  transform: rotate(90deg);
}

.faq-item-open .faq-icon::before,
.faq-item-open .faq-icon::after {
  background: #6366f1;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-item-open .faq-answer {
  max-height: 200px;
}

.faq-answer p {
  padding: 0 24px 24px;
  color: #6b7280;
  line-height: 1.7;
}

@media (max-width: 768px) {
  .faq {
    padding: 60px 0;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .faq-question {
    padding: 20px 16px;
    font-size: 0.95rem;
  }

  .faq-answer p {
    padding: 0 16px 20px;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
