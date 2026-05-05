<template>
  <div class="home-page">
    <header class="header">
      <div class="header-content container">
        <h1 class="logo">🎨 作品投票打榜</h1>
        <nav class="nav">
          <router-link to="/" class="nav-item active">首页</router-link>
          <router-link to="/rank" class="nav-item">排行榜</router-link>
        </nav>
      </div>
    </header>

    <section class="banner-section">
      <div class="banner container">
        <div class="banner-content">
          <h2 class="banner-title">{{ activityInfo.title || '2024年度最佳作品评选大赛' }}</h2>
          <p class="banner-subtitle">{{ activityInfo.subtitle || '为您喜爱的作品投上宝贵的一票' }}</p>
          
          <div class="countdown">
            <span class="countdown-label">距离结束：</span>
            <div class="countdown-items">
              <div class="countdown-item">
                <span class="countdown-number">{{ daysLeft }}</span>
                <span class="countdown-unit">天</span>
              </div>
              <div class="countdown-item">
                <span class="countdown-number">{{ hoursLeft }}</span>
                <span class="countdown-unit">时</span>
              </div>
              <div class="countdown-item">
                <span class="countdown-number">{{ minutesLeft }}</span>
                <span class="countdown-unit">分</span>
              </div>
            </div>
          </div>

          <div class="rewards">
            <h3 class="rewards-title">🏆 丰厚奖励</h3>
            <ul class="rewards-list">
              <li v-for="(reward, index) in (activityInfo.rewards || ['一等奖: 奖金10000元 + 荣誉证书', '二等奖: 奖金5000元 + 荣誉证书', '三等奖: 奖金2000元 + 荣誉证书'])" :key="index" class="rewards-item">
                {{ reward }}
              </li>
            </ul>
          </div>
        </div>

        <div class="banner-visual">
          <div class="trophy">🏆</div>
        </div>
      </div>
    </section>

    <section class="filter-section container">
      <div class="search-box">
        <input 
          type="text" 
          v-model="searchKeyword" 
          placeholder="搜索作品名称..."
          @keyup.enter="handleSearch"
          class="search-input"
        />
        <button @click="handleSearch" class="search-btn">🔍 搜索</button>
      </div>

      <div class="filter-tags">
        <button 
          @click="toggleFilter('all')" 
          :class="['filter-tag', { active: currentFilter === 'all' }]"
        >
          全部
        </button>
        <button 
          @click="toggleFilter('hot')" 
          :class="['filter-tag', { active: currentFilter === 'hot' }]"
        >
          🔥 热门
        </button>
        <button 
          @click="toggleFilter('recommend')" 
          :class="['filter-tag', { active: currentFilter === 'recommend' }]"
        >
          ⭐ 推荐
        </button>
      </div>
    </section>

    <section class="works-section container">
      <div class="section-header">
        <h2 class="section-title">📋 作品列表</h2>
        <span class="total-count">共 {{ total }} 个作品</span>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="works.length === 0" class="empty-state">
        <div class="empty-state-icon">📭</div>
        <p class="empty-state-text">暂无作品</p>
      </div>

      <div v-else class="works-grid">
        <router-link 
          v-for="work in works" 
          :key="work.id" 
          :to="`/detail/${work.id}`"
          class="work-card card"
        >
          <div class="work-image">
            <img 
              :src="work.image_url || getDefaultImage(work.id)" 
              :alt="work.title"
              @error="handleImageError($event, work.id)"
            />
            <div class="work-badges">
              <span v-if="work.is_hot" class="hot-badge">🔥 热门</span>
              <span v-if="work.is_recommend" class="recommend-badge">⭐ 推荐</span>
            </div>
            <div class="work-rank-badge" v-if="work.rank && work.rank <= 3">
              <span :class="['rank-number', getRankClass(work.rank)]">
                {{ work.rank }}
              </span>
            </div>
          </div>

          <div class="work-info">
            <h3 class="work-title">{{ work.title }}</h3>
            <p class="work-desc" v-if="work.description">
              {{ truncateText(work.description, 50) }}
            </p>

            <div class="work-stats">
              <div class="stat-item">
                <span class="stat-icon">👍</span>
                <span class="stat-value">{{ formatNumber(work.vote_count) }}</span>
                <span class="stat-label">票</span>
              </div>
              <div class="stat-item" v-if="work.rank">
                <span class="stat-icon">🏆</span>
                <span class="stat-value">第{{ work.rank }}名</span>
              </div>
            </div>

            <button class="vote-btn" @click.stop="handleQuickVote(work)">
              🗳️ 投票
            </button>
          </div>
        </router-link>
      </div>

      <div v-if="works.length > 0 && hasMore" class="load-more">
        <button @click="loadMore" class="btn-secondary" :disabled="loadingMore">
          {{ loadingMore ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p class="footer-text">© 2024 作品投票打榜系统 | 公平公正，欢迎参与</p>
      </div>
    </footer>

    <div v-if="showVoteModal" class="modal-overlay" @click.self="closeVoteModal">
      <div class="modal-content">
        <h3 class="modal-title">为「{{ currentWork?.title }}」投票</h3>
        
        <div class="modal-form">
          <label class="form-label">您的昵称（选填）</label>
          <input 
            type="text" 
            v-model="nickname" 
            placeholder="请输入您的昵称"
            class="form-input"
          />
        </div>

        <div class="modal-actions">
          <button @click="closeVoteModal" class="btn-secondary">取消</button>
          <button @click="submitVote" class="btn-primary" :disabled="submitting">
            {{ submitting ? '投票中...' : '确认投票' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getActivityInfo, getWorks, submitVote as submitVoteApi } from '@/api'
import { formatNumber, getDeviceId } from '@/utils'

const router = useRouter()

const loading = ref(false)
const loadingMore = ref(false)
const submitting = ref(false)
const works = ref([])
const activityInfo = ref({})
const searchKeyword = ref('')
const currentFilter = ref('all')
const page = ref(1)
const total = ref(0)
const hasMore = ref(false)

const showVoteModal = ref(false)
const currentWork = ref(null)
const nickname = ref('')
const toastMessage = ref('')

const daysLeft = ref(30)
const hoursLeft = ref(0)
const minutesLeft = ref(0)

const fetchActivityInfo = async () => {
  try {
    const res = await getActivityInfo()
    if (res.code === 0) {
      activityInfo.value = res.data
      if (res.data.days_left !== undefined) {
        daysLeft.value = res.data.days_left
        hoursLeft.value = res.data.hours_left || 0
      }
    }
  } catch (err) {
    console.error('Failed to fetch activity info:', err)
  }
}

const fetchWorks = async (reset = true) => {
  if (reset) {
    loading.value = true
    page.value = 1
    works.value = []
  } else {
    loadingMore.value = true
  }

  try {
    const params = {
      page: page.value,
      page_size: 12
    }

    if (searchKeyword.value) {
      params.search = searchKeyword.value
    }
    if (currentFilter.value === 'hot') {
      params.is_hot = 'true'
    }
    if (currentFilter.value === 'recommend') {
      params.is_recommend = 'true'
    }

    const res = await getWorks(params)
    if (res.code === 0) {
      const newWorks = res.data.list || []
      if (reset) {
        works.value = newWorks
      } else {
        works.value = [...works.value, ...newWorks]
      }
      total.value = res.data.total
      hasMore.value = works.value.length < total.value
      if (!reset) {
        page.value++
      }
    }
  } catch (err) {
    console.error('Failed to fetch works:', err)
  } finally {
    loading.value = false
    loadingMore.value = false
  }
}

const handleSearch = () => {
  fetchWorks(true)
}

const toggleFilter = (filter) => {
  currentFilter.value = filter
  fetchWorks(true)
}

const loadMore = () => {
  if (!loadingMore.value && hasMore.value) {
    page.value++
    fetchWorks(false)
  }
}

const handleQuickVote = (work) => {
  currentWork.value = work
  nickname.value = ''
  showVoteModal.value = true
}

const closeVoteModal = () => {
  showVoteModal.value = false
  currentWork.value = null
  nickname.value = ''
}

const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

const submitVote = async () => {
  if (!currentWork.value || submitting.value) return

  submitting.value = true
  try {
    const res = await submitVoteApi({
      work_id: currentWork.value.id,
      device_id: getDeviceId(),
      nickname: nickname.value || '匿名用户'
    })

    if (res.code === 0) {
      showToast('🎉 投票成功！')
      currentWork.value.vote_count = res.data.vote_count
      fetchWorks(true)
      closeVoteModal()
    } else {
      showToast(res.message || '投票失败')
    }
  } catch (err) {
    const errMsg = err.response?.data?.message || '投票失败，请稍后再试'
    showToast(errMsg)
  } finally {
    submitting.value = false
  }
}

const getDefaultImage = (id) => {
  const images = [
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20artwork%20painting%20creative%20design&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20landscape%20photography%20nature%20scene&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20architecture%20building%20design%20urban&image_size=square',
    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=abstract%20art%20geometric%20shapes%20colorful&image_size=square'
  ]
  return images[id % images.length]
}

const handleImageError = (event, id) => {
  event.target.src = getDefaultImage(id + 1)
}

const getRankClass = (rank) => {
  if (rank === 1) return 'rank-gold'
  if (rank === 2) return 'rank-silver'
  if (rank === 3) return 'rank-bronze'
  return ''
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

onMounted(() => {
  fetchActivityInfo()
  fetchWorks(true)
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
}

.logo {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav-item {
  font-size: 15px;
  font-weight: 500;
  color: #666;
  transition: color 0.3s ease;
  position: relative;
}

.nav-item:hover,
.nav-item.active {
  color: #667eea;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 1px;
}

.banner-section {
  padding: 40px 0;
}

.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.banner-content {
  flex: 1;
  color: #fff;
}

.banner-title {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.banner-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 24px;
}

.countdown {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.countdown-label {
  font-size: 14px;
  opacity: 0.9;
}

.countdown-items {
  display: flex;
  gap: 8px;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 50px;
}

.countdown-number {
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
}

.countdown-unit {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
}

.rewards-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.rewards-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rewards-item {
  font-size: 14px;
  opacity: 0.9;
  padding-left: 8px;
  border-left: 2px solid rgba(255, 255, 255, 0.5);
}

.banner-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.trophy {
  font-size: 120px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

.filter-section {
  padding: 20px 0;
}

.search-box {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input {
  flex: 1;
  max-width: 400px;
  padding: 12px 20px;
  border-radius: 25px;
  background: #fff;
  font-size: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.search-input::placeholder {
  color: #999;
}

.search-btn {
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.filter-tags {
  display: flex;
  gap: 12px;
}

.filter-tag {
  padding: 8px 20px;
  background: #fff;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-tag:hover {
  color: #667eea;
}

.filter-tag.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.works-section {
  padding: 20px 0 60px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
}

.total-count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.work-card {
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  cursor: pointer;
}

.work-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.work-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.work-card:hover .work-image img {
  transform: scale(1.05);
}

.work-badges {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 8px;
}

.work-rank-badge {
  position: absolute;
  top: 12px;
  right: 12px;
}

.work-info {
  padding: 20px;
}

.work-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
}

.work-desc {
  font-size: 13px;
  color: #999;
  margin-bottom: 16px;
  line-height: 1.5;
}

.work-stats {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.stat-icon {
  font-size: 16px;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.stat-label {
  color: #999;
}

.vote-btn {
  width: 100%;
  padding: 10px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.vote-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.footer {
  background: rgba(0, 0, 0, 0.1);
  padding: 24px 0;
  text-align: center;
}

.footer-text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  width: 90%;
  max-width: 400px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 24px;
  color: #333;
}

.form-label {
  display: block;
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  border-color: #667eea;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions .btn-primary,
.modal-actions .btn-secondary {
  flex: 1;
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 0;
  }

  .logo {
    font-size: 16px;
  }

  .nav {
    gap: 16px;
  }

  .banner {
    flex-direction: column;
    padding: 24px;
    text-align: center;
  }

  .banner-title {
    font-size: 24px;
  }

  .countdown {
    flex-direction: column;
  }

  .trophy {
    font-size: 80px;
  }

  .search-box {
    flex-direction: column;
  }

  .search-input {
    max-width: none;
  }

  .works-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .work-image {
    height: 140px;
  }

  .work-info {
    padding: 12px;
  }

  .work-title {
    font-size: 14px;
  }
}
</style>
