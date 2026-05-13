<template>
  <header class="header" :class="{ 'header-scrolled': scrolled }">
    <div class="container header-content">
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <div class="logo-face">
            <div class="logo-head"></div>
            <div class="logo-body"></div>
          </div>
        </div>
        <span class="logo-text">VectorAvatar</span>
      </router-link>

      <nav class="nav" :class="{ 'nav-open': isNavOpen }">
        <router-link to="/" class="nav-link" @click="closeNav">首页</router-link>
        <router-link to="/generator" class="nav-link" @click="closeNav">生成头像</router-link>
        <router-link to="/history" class="nav-link" @click="closeNav">历史记录</router-link>
      </nav>

      <button class="nav-toggle" @click="toggleNav" aria-label="Toggle menu">
        <span class="nav-toggle-bar" :class="{ 'active': isNavOpen }"></span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const scrolled = ref(false)
const isNavOpen = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 20
}

function toggleNav() {
  isNavOpen.value = !isNavOpen.value
}

function closeNav() {
  isNavOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  border-bottom: 1px solid transparent;
}

.header-scrolled {
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
  border-bottom-color: #e5e7eb;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 1.25rem;
  color: #1f2937;
  transition: color 0.2s ease;
}

.logo:hover {
  color: #6366f1;
}

.logo-icon {
  width: 36px;
  height: 36px;
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
  background: linear-gradient(135deg, #6366f1, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 32px;
}

.nav-link {
  color: #6b7280;
  font-weight: 500;
  position: relative;
  padding: 8px 0;
  transition: color 0.2s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(135deg, #6366f1, #ec4899);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: #1f2937;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-toggle {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  gap: 5px;
  padding: 0;
}

.nav-toggle-bar {
  width: 24px;
  height: 2px;
  background: #1f2937;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.nav-toggle-bar.active {
  transform: rotate(45deg);
}

@media (max-width: 768px) {
  .nav {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: 20px;
    gap: 16px;
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    border-bottom: 1px solid #e5e7eb;
  }

  .nav-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-link {
    font-size: 1.1rem;
    padding: 12px 0;
  }

  .nav-toggle {
    display: flex;
  }

  .container {
    padding: 0 16px;
  }
}
</style>
