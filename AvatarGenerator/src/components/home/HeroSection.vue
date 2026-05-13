<template>
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
            <span class="btn-icon">→</span>
          </router-link>
          <a href="#examples" class="btn btn-outline">
            查看示例
          </a>
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
              <div class="avatar-face">
                <div class="avatar-head"></div>
                <div class="avatar-body"></div>
              </div>
            </div>
            <span class="avatar-label">原始照片</span>
          </div>
          <div class="arrow">
            <span class="arrow-icon">→</span>
          </div>
          <div class="avatar-vector">
            <div class="avatar-placeholder vector">
              <div class="avatar-face vectorized">
                <div class="avatar-head"></div>
                <div class="avatar-body"></div>
              </div>
            </div>
            <span class="avatar-label">矢量头像</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite;
}

.hero::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
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

.btn-icon {
  transition: transform 0.3s ease;
}

.btn-primary:hover .btn-icon {
  transform: translateX(4px);
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
  color: #6366f1;
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-placeholder:hover {
  transform: scale(1.05);
}

.avatar-placeholder.original {
  background: #f3f4f6;
}

.avatar-placeholder.vector {
  background: linear-gradient(135deg, #6366f1, #ec4899);
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 20px 60px rgba(99, 102, 241, 0.2); }
  50% { box-shadow: 0 20px 60px rgba(99, 102, 241, 0.4); }
}

.avatar-face {
  width: 100px;
  height: 120px;
  position: relative;
}

.avatar-head {
  width: 60px;
  height: 60px;
  background: #d1d5db;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.avatar-body {
  width: 80px;
  height: 40px;
  background: #d1d5db;
  border-radius: 50% 50% 0 0;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
}

.avatar-face.vectorized .avatar-head {
  background: white;
  border: 3px solid #1f2937;
}

.avatar-face.vectorized .avatar-body {
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
  animation: bounce 2s ease-in-out infinite;
  font-size: 2rem;
  color: #6366f1;
}

@keyframes bounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(10px); }
}

@media (max-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
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

  .container {
    padding: 0 16px;
  }
}
</style>
