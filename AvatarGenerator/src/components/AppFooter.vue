<template>
  <footer class="footer">
    <div class="container footer-content">
      <div class="footer-brand">
        <div class="logo">
          <div class="logo-icon">
            <div class="logo-face">
              <div class="logo-head"></div>
              <div class="logo-body"></div>
            </div>
          </div>
          <span class="logo-text">VectorAvatar</span>
        </div>
        <p class="footer-description">使用 AI 技术将您的照片转换为精美的矢量风格头像</p>
      </div>

      <div class="footer-links">
        <div class="footer-column">
          <h4>快速链接</h4>
          <router-link to="/">首页</router-link>
          <router-link to="/generator">生成头像</router-link>
          <router-link to="/history">历史记录</router-link>
        </div>

        <div class="footer-column">
          <h4>支持格式</h4>
          <span>JPG</span>
          <span>PNG</span>
          <span>WebP</span>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container">
        <p>&copy; {{ currentYear }} VectorAvatar. 保留所有权利。</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  padding: 60px 0 0;
  margin-top: auto;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 40px;
}

.footer-brand .logo {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.logo-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #6366f1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo-face {
  width: 24px;
  height: 28px;
  position: relative;
}

.logo-head {
  width: 12px;
  height: 12px;
  background: #6366f1;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.logo-body {
  width: 20px;
  height: 10px;
  background: transparent;
  border: 3px solid #6366f1;
  border-top: none;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
}

.logo-text {
  font-weight: 700;
  font-size: 1.25rem;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  color: #6b7280;
  line-height: 1.7;
  max-width: 300px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-column h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.footer-column a,
.footer-column span {
  color: #6b7280;
  transition: color 0.2s ease;
  font-size: 0.95rem;
}

.footer-column a:hover {
  color: #6366f1;
}

.footer-bottom {
  border-top: 1px solid #e5e7eb;
  padding: 24px 0;
}

.footer-bottom p {
  color: #6b7280;
  font-size: 0.9rem;
  text-align: center;
}

@media (max-width: 768px) {
  .footer {
    padding: 40px 0 0;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }

  .footer-description {
    max-width: none;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
