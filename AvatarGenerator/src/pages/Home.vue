<template>
  <div class="home">
    <section class="hero">
      <div class="container hero-content">
        <div class="hero-text">
          <div class="hero-badge">
            <span>✨ AI 驱动</span>
          </div>
          <h1 class="hero-title">
            一张照片，
            <span class="gradient-text">无限创意</span>
          </h1>
          <p class="hero-subtitle">
            使用先进的 AI 技术，将您的普通照片转换为精美的矢量风格头像。
            支持多种风格，实时预览，一键下载。
          </p>
          <div class="hero-actions">
            <router-link to="/generator" class="btn btn-primary">
              开始生成
            </router-link>
            <router-link to="/generator" class="btn btn-outline">
              查看示例
            </router-link>
          </div>
          <div class="hero-features">
            <div class="feature">
              <span class="feature-icon">⚡</span>
              <span>快速生成</span>
            </div>
            <div class="feature">
              <span class="feature-icon">🔒</span>
              <span>隐私保护</span>
            </div>
            <div class="feature">
              <span class="feature-icon">❤️</span>
              <span>免费使用</span>
            </div>
          </div>
        </div>
        <div class="hero-visual">
          <div class="avatar-showcase">
            <div class="avatar-original">
              <div class="avatar-placeholder original">
                <div class="avatar-circle"></div>
                <div class="avatar-body"></div>
              </div>
              <span class="avatar-label">原始照片</span>
            </div>
            <div class="arrow">→</div>
            <div class="avatar-vector">
              <div class="avatar-placeholder vector">
                <div class="avatar-circle"></div>
                <div class="avatar-body"></div>
              </div>
              <span class="avatar-label">矢量头像</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="examples">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">效果展示</span>
          <h2 class="section-title">看看我们的示例</h2>
          <p class="section-description">只需上传一张照片，就能获得精美的矢量风格头像</p>
        </div>
        <div class="examples-grid">
          <div class="example-card">
            <div class="example-pair">
              <div class="example-image original"></div>
              <div class="arrow-sm">→</div>
              <div class="example-image vector v1"></div>
            </div>
            <p class="example-label">单人头像</p>
          </div>
          <div class="example-card">
            <div class="example-pair">
              <div class="example-image original"></div>
              <div class="arrow-sm">→</div>
              <div class="example-image vector v2"></div>
            </div>
            <p class="example-label">双人合影</p>
          </div>
          <div class="example-card">
            <div class="example-pair">
              <div class="example-image original"></div>
              <div class="arrow-sm">→</div>
              <div class="example-image vector v3"></div>
            </div>
            <p class="example-label">艺术创作</p>
          </div>
        </div>
      </div>
    </section>

    <section class="styles">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">多种风格</span>
          <h2 class="section-title">选择您喜欢的风格</h2>
          <p class="section-description">多种预设风格，满足不同场景需求</p>
        </div>
        <div class="styles-grid">
          <div class="style-card">
            <div class="style-preview" style="background: linear-gradient(135deg, #6366f1, #818cf8);">
              <span class="style-emoji">🎨</span>
            </div>
            <h3 class="style-name">极简风格</h3>
            <p class="style-desc">简洁的线条和色块，现代感十足</p>
          </div>
          <div class="style-card">
            <div class="style-preview" style="background: linear-gradient(135deg, #ec4899, #f472b6);">
              <span class="style-emoji">😊</span>
            </div>
            <h3 class="style-name">卡通风格</h3>
            <p class="style-desc">圆润可爱的造型，活泼有趣</p>
          </div>
          <div class="style-card">
            <div class="style-preview" style="background: linear-gradient(135deg, #1e293b, #334155);">
              <span class="style-emoji">💼</span>
            </div>
            <h3 class="style-name">商务风格</h3>
            <p class="style-desc">正式稳重，适合职场使用</p>
          </div>
          <div class="style-card">
            <div class="style-preview" style="background: linear-gradient(135deg, #f59e0b, #ef4444);">
              <span class="style-emoji">🎭</span>
            </div>
            <h3 class="style-name">艺术风格</h3>
            <p class="style-desc">创意十足的几何化造型</p>
          </div>
        </div>
      </div>
    </section>

    <section class="how-it-works">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">使用流程</span>
          <h2 class="section-title">三步创建您的头像</h2>
          <p class="section-description">简单易用，几秒钟即可完成</p>
        </div>
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-icon">📷</div>
            <h3 class="step-title">上传照片</h3>
            <p class="step-desc">点击或拖拽上传您的照片，支持 JPG、PNG、WebP 格式</p>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-icon">⚙️</div>
            <h3 class="step-title">调整参数</h3>
            <p class="step-desc">根据喜好调整饱和度、对比度、线条粗细等参数</p>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-icon">💾</div>
            <h3 class="step-title">下载保存</h3>
            <p class="step-desc">AI 自动生成矢量头像，支持 PNG 和 SVG 格式下载</p>
          </div>
        </div>
        <div class="cta-wrapper">
          <router-link to="/generator" class="btn btn-primary">
            立即开始
          </router-link>
        </div>
      </div>
    </section>

    <section class="faq">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">常见问题</span>
          <h2 class="section-title">FAQ</h2>
          <p class="section-description">有疑问？看看这些常见问题</p>
        </div>
        <div class="faq-list">
          <div class="faq-item" :class="{ 'faq-item-open': openIndex === 0 }">
            <button class="faq-question" @click="toggleFAQ(0)">
              <span>支持哪些图片格式？</span>
              <span class="faq-icon">{{ openIndex === 0 ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>我们支持 JPG、PNG 和 WebP 格式的图片上传。建议使用高清正面照片，效果会更好。</p>
            </div>
          </div>
          <div class="faq-item" :class="{ 'faq-item-open': openIndex === 1 }">
            <button class="faq-question" @click="toggleFAQ(1)">
              <span>上传的照片大小有限制吗？</span>
              <span class="faq-icon">{{ openIndex === 1 ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>是的，单张照片大小不能超过 10MB。如果您的照片过大，建议先压缩后再上传。</p>
            </div>
          </div>
          <div class="faq-item" :class="{ 'faq-item-open': openIndex === 2 }">
            <button class="faq-question" @click="toggleFAQ(2)">
              <span>生成的头像可以用于商业用途吗？</span>
              <span class="faq-icon">{{ openIndex === 2 ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>可以！您生成的所有头像都可以自由使用，包括个人和商业用途，没有任何限制。</p>
            </div>
          </div>
          <div class="faq-item" :class="{ 'faq-item-open': openIndex === 3 }">
            <button class="faq-question" @click="toggleFAQ(3)">
              <span>我的照片会被保存吗？</span>
              <span class="faq-icon">{{ openIndex === 3 ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>不会。我们采用纯前端处理方式，您的照片不会上传到任何服务器，完全在浏览器本地处理，保护您的隐私安全。</p>
            </div>
          </div>
          <div class="faq-item" :class="{ 'faq-item-open': openIndex === 4 }">
            <button class="faq-question" @click="toggleFAQ(4)">
              <span>可以下载什么格式的头像？</span>
              <span class="faq-icon">{{ openIndex === 4 ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>我们支持 PNG 和 SVG 两种格式下载。PNG 适合直接使用，SVG 是矢量格式，可以无限缩放而不失真。</p>
            </div>
          </div>
          <div class="faq-item" :class="{ 'faq-item-open': openIndex === 5 }">
            <button class="faq-question" @click="toggleFAQ(5)">
              <span>为什么要使用矢量格式？</span>
              <span class="faq-icon">{{ openIndex === 5 ? '−' : '+' }}</span>
            </button>
            <div class="faq-answer">
              <p>矢量格式的头像可以无限放大而不会模糊，非常适合用作各种尺寸的头像，从社交媒体到名片印刷都能保持清晰。</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const openIndex = ref(null)

function toggleFAQ(index) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.home {
  padding-top: 70px;
}

.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(236, 72, 153, 0.1));
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #6366f1;
  margin-bottom: 24px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  color: #1f2937;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.125rem;
  line-height: 1.7;
  color: #6b7280;
  margin-bottom: 32px;
  max-width: 500px;
}

.hero-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 48px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
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

.btn-outline {
  background: transparent;
  border: 2px solid #e5e7eb;
  color: #1f2937;
}

.btn-outline:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.hero-features {
  display: flex;
  gap: 32px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.95rem;
}

.feature-icon {
  font-size: 1.2rem;
}

.avatar-showcase {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
}

.avatar-placeholder {
  width: 180px;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  position: relative;
  background: #f3f4f6;
}

.avatar-placeholder:hover {
  transform: scale(1.05);
}

.avatar-placeholder.vector {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4); }
}

.avatar-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #d1d5db;
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
}

.avatar-placeholder.vector .avatar-circle {
  background: white;
  border: 3px solid #1f2937;
}

.avatar-body {
  width: 120px;
  height: 60px;
  border-radius: 60px 60px 0 0;
  background: #d1d5db;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
}

.avatar-placeholder.vector .avatar-body {
  background: white;
  border: 3px solid #1f2937;
}

.avatar-label {
  display: block;
  text-align: center;
  margin-top: 16px;
  font-weight: 500;
  color: #6b7280;
}

.arrow {
  font-size: 2rem;
  color: #6366f1;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

.examples {
  padding: 100px 0;
  background: white;
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
  gap: 12px;
  margin-bottom: 20px;
}

.example-image {
  flex: 1;
  aspect-ratio: 1;
  border-radius: 12px;
  background: #f3f4f6;
  position: relative;
}

.example-image::before {
  content: '';
  position: absolute;
  width: 60%;
  height: 60%;
  top: 20%;
  left: 20%;
  background: #9ca3af;
  border-radius: 50%;
}

.example-image.vector {
  background: linear-gradient(135deg, #6366f1, #ec4899);
}

.example-image.vector.v2 {
  background: linear-gradient(135deg, #10b981, #06b6d4);
}

.example-image.vector.v3 {
  background: linear-gradient(135deg, #f59e0b, #ef4444);
}

.example-image.vector::before {
  background: white;
  border: 3px solid #1f2937;
}

.arrow-sm {
  color: #6366f1;
  font-size: 1.5rem;
}

.example-label {
  text-align: center;
  font-weight: 600;
  color: #1f2937;
  font-size: 1rem;
}

.styles {
  padding: 100px 0;
  background: #f9fafb;
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
  width: 100px;
  height: 100px;
  margin: 0 auto 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.style-card:hover .style-preview {
  transform: scale(1.1);
}

.style-emoji {
  font-size: 2.5rem;
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

.how-it-works {
  padding: 100px 0;
  background: white;
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
  font-size: 2.5rem;
  margin-bottom: 20px;
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

.faq {
  padding: 100px 0;
  background: #f9fafb;
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
  font-size: 1.5rem;
  color: #6366f1;
  font-weight: 300;
  margin-left: 16px;
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

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .examples-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .styles-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .steps {
    grid-template-columns: 1fr;
    gap: 48px;
  }
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
    padding: 60px 0 80px;
  }

  .hero-content {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    margin: 0 auto 32px;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-features {
    justify-content: center;
    flex-wrap: wrap;
  }

  .avatar-showcase {
    flex-direction: column;
  }

  .arrow {
    transform: rotate(90deg);
  }

  .examples {
    padding: 60px 0;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .examples-grid {
    grid-template-columns: 1fr;
  }

  .styles {
    padding: 60px 0;
  }

  .styles-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .style-card {
    padding: 24px 16px;
  }

  .style-preview {
    width: 80px;
    height: 80px;
  }

  .style-name {
    font-size: 1.1rem;
  }

  .how-it-works {
    padding: 60px 0;
  }

  .steps {
    gap: 40px;
  }

  .step {
    padding: 32px 20px;
  }

  .faq {
    padding: 60px 0;
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
