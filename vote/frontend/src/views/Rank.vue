<template>
  <div class="rank-page">
    <header class="header">
      <div class="header-content container">
        <h1 class="logo">🎨 作品投票打榜</h1>
        <nav class="nav">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/rank" class="nav-item active">排行榜</router-link>
        </nav>
      </div>
    </header>

    <section class="rank-section container">
      <div class="section-header">
        <h2 class="section-title">🏆 排行榜</h2>
        <div class="rank-tabs">
          <button 
            @click="switchRankType('total')" 
            :class="['rank-tab', { active: rankType === 'total' }]"
          >
            📊 总榜
          </button>
          <button 
            @click="switchRankType('daily')" 
            :class="['rank-tab', { active: rankType === 'daily' }]"
          >
            🔥 日榜
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
      </div>

      <div v-else-if="rankData.top3.length === 0 && rankData.list.length === 0" class="empty-state">
        <div class="empty-state-icon">🏆</div>
        <p class="empty-state-text">暂无排行数据</p>
      </div>

      <div v-else>
        <div v-if="rankData.top3.length > 0" class="top3-section">
          <h3 class="top3-title">🎉 冠亚季军</h3>
          <div class="top3-grid">
            <div 
              v-for="item in sortedTop3" 
              :key="item.work_id"
              :class="['top3-card', `rank-${item.rank}`]"
            >
              <div class="top3-badge">
                <span :class="['rank-number', getRankClass(item.rank)]">
                  {{ item.rank }}
                </span>
              </div>
              
              <div class="top3-image">
                <img 
                  :src="item.image_url || getDefaultImage(item.work_id)" 
                  :alt="item.title"
                  @error="handleImageError($event, item.work_id)"
                />
              </div>

              <div class="top3-info">
                <h4 class="top3-title-name">{{ item.title }}</h4>
                <div class="top3-votes">
                  <span class="votes-icon">👍</span>
                  <span class="votes-number">{{ formatNumber(item.vote_count) }}</span>
                  <span class="votes-label">票</span>
                </div>
                <div class="top3-badges">
                  <span v-if="item.is_hot" class="hot-badge">🔥 热门</span>
                  <span v-if="item.is_recommend" class="recommend-badge">⭐ 推荐</span>
                </div>
              </div>

              <button class="top3-vote-btn" @click="handleVote(item)">
                🗳️ 投票
              </button>
            </div>
          </div>
        </div>

        <div v-if="rankData.list.length > 0" class="rank-list-section">
          <h3 class="rank-list-title">📋 完整榜单</h3>
          <div class="rank-list">
            <div 
              v-for="item in rankData.list" 
              :key="item.work_id"
              class="rank-item card"
            >
              <div class="rank-item-left">
                <div class="rank-number-wrapper">
                  <span 
                    v-if="item.rank <= 3" 
                    :class="['rank-number', getRankClass(item.rank)]"
                  >
                    {{ item.rank }}
                  </span>
                  <span v-else class="rank-number-normal">{{ item.rank }}</span>
                </div>

                <div class="rank-item-image">
                  <img 
                    :src="item.image_url || getDefaultImage(item.work_id)" 
                    :alt="item.title"
                    @error="handleImageError($event, item.work_id)"
                  />
                </div>

                <div class="rank-item-info">
                  <h4 class="rank-item-title">{{ item.title }}</h4>
                  <div class="rank-item-badges">
                    <span v-if="item.is_hot" class="hot-badge">🔥 热门</span>
                    <span v-if="item.is_recommend" class="recommend-badge">⭐ 推荐</span>
                  </div>
                </div>
              </div>

              <div class="rank-item-right">
                <div class="rank-item-stats">
                  <div class="stat-item">
                    <span class="stat-icon">👍</span>
                    <span class="stat-value">{{ formatNumber(item.vote_count) }}</span>
                    <span class="stat-label">票</span>
                  </div>
                  <div class="stat-item" :class="getTrendClass(item.trend)">
                    <span class="stat-icon">{{ getTrendIcon(item.trend) }}</span>
                    <span class="stat-label" v-if="item.trend === 'up'">上升</span>
                    <span class="stat-label" v-else-if="item.trend === 'down'">下降</span>
                    <span class="stat-label" v-else-if="item.trend === 'new'">新晋</span>
                    <span class="stat-label" v-else>持平</span>
                  </div>
                </div>
                <button class="rank-item-vote-btn" @click="handleVote(item)">
                  投票
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <footer class="footer">
      <div class="container">
        <p class="footer-text">© 2024 作品投票打榜系统 | 公平公正，欢迎参与</p>
      </div>
    </footer>

    <div v-if="showVoteModal" class="modal-overlay" @click.self="closeVoteModal">
      <div class="modal-content">
        <h3 class="modal-title">为「{{ currentItem?.title }}」投票</h3>
        
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
import { getRank, submitVote as submitVoteApi } from '@/api'
import { formatNumber, getDeviceId, getTrendIcon, getTrendClass } from '@/utils'

const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const rankType = ref('total')
const rankData = ref({
  top3: [],
  list: [],
  total: 0
})

const showVoteModal = ref(false)
const currentItem = ref(null)
const nickname = ref('')
const toastMessage = ref('')

const sortedTop3 = computed(() => {
  const order = [2, 1, 3]
  return order
    .map(rank => rankData.value.top3.find(item => item.rank === rank))
    .filter(item => item)
})

const fetchRankData = async () => {
  loading.value = true
  try {
    const res = await getRank({ type: rankType.value })
    if (res.code === 0) {
      rankData.value = {
        top3: res.data.top3 || [],
        list: res.data.list || [],
        total: res.data.total || 0
      }
    }
  } catch (err) {
    console.error('Failed to fetch rank data:', err)
  } finally {
    loading.value = false
  }
}

const switchRankType = (type) => {
  rankType.value = type
  fetchRankData()
}

const handleVote = (item) => {
  currentItem.value = item
  nickname.value = ''
  showVoteModal.value = true
}

const closeVoteModal = () => {
  showVoteModal.value = false
  currentItem.value = null
  nickname.value = ''
}

const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

const submitVote = async () => {
  if (!currentItem.value || submitting.value) return

  submitting.value = true
  try {
    const res = await submitVoteApi({
      work_id: currentItem.value.work_id,
      device_id: getDeviceId(),
      nickname: nickname.value || '匿名用户'
    })

    if (res.code === 0) {
      showToast('🎉 投票成功！')
      fetchRankData()
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

onMounted(() => {
  fetchRankData()
})
</script>

<style scoped>
.rank-page {
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

.rank-section {
  padding: 40px 0 60px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.section-title {
  font-size: 28px;
  font-weight: 700;
  color: #fff;
}

.rank-tabs {
  display: flex;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px;
  border-radius: 25px;
}

.rank-tab {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.rank-tab:hover {
  color: #fff;
}

.rank-tab.active {
  background: #fff;
  color: #667eea;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.top3-section {
  margin-bottom: 40px;
}

.top3-title {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 24px;
  text-align: center;
}

.top3-grid {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 24px;
  padding: 40px 0;
}

.top3-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  width: 220px;
  position: relative;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.top3-card:hover {
  transform: translateY(-8px);
}

.top3-card.rank-1 {
  order: 2;
  width: 260px;
  padding: 32px 24px;
  background: linear-gradient(135deg, #fff 0%, #fffde7 100%);
}

.top3-card.rank-1::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #ffd700, #ffb700);
  border-radius: 20px 20px 0 0;
}

.top3-card.rank-2 {
  order: 1;
}

.top3-card.rank-2::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #c0c0c0, #a8a8a8);
  border-radius: 20px 20px 0 0;
}

.top3-card.rank-3 {
  order: 3;
}

.top3-card.rank-3::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: linear-gradient(90deg, #cd7f32, #b87333);
  border-radius: 20px 20px 0 0;
}

.top3-badge {
  position: absolute;
  top: -16px;
}

.top3-image {
  width: 120px;
  height: 120px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.top3-card.rank-1 .top3-image {
  width: 140px;
  height: 140px;
}

.top3-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.top3-info {
  text-align: center;
  margin-bottom: 16px;
}

.top3-title-name {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.top3-votes {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.votes-icon {
  font-size: 18px;
}

.votes-number {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.top3-card.rank-1 .votes-number {
  font-size: 28px;
}

.votes-label {
  font-size: 14px;
  color: #999;
}

.top3-badges {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.top3-vote-btn {
  width: 100%;
  padding: 12px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 25px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.top3-vote-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.rank-list-section {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.rank-list-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rank-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  transition: all 0.3s ease;
}

.rank-item:hover {
  background: #f8f9ff;
  transform: translateX(4px);
}

.rank-item-left {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.rank-number-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.rank-number-normal {
  font-size: 16px;
  font-weight: 600;
  color: #999;
}

.rank-item-image {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.rank-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.rank-item-info {
  flex: 1;
  min-width: 0;
}

.rank-item-title {
  font-size: 15px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rank-item-badges {
  display: flex;
  gap: 8px;
}

.rank-item-right {
  display: flex;
  align-items: center;
  gap: 24px;
}

.rank-item-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.stat-icon {
  font-size: 14px;
}

.stat-value {
  font-weight: 600;
  color: #333;
}

.stat-label {
  color: #999;
}

.rank-item-vote-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.rank-item-vote-btn:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
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

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .section-title {
    font-size: 24px;
  }

  .top3-grid {
    flex-direction: column;
    align-items: center;
  }

  .top3-card {
    width: 100%;
    max-width: 280px;
  }

  .top3-card.rank-1 {
    order: 1;
    width: 100%;
    max-width: 300px;
  }

  .top3-card.rank-2 {
    order: 2;
  }

  .top3-card.rank-3 {
    order: 3;
  }

  .rank-list-section {
    padding: 16px;
  }

  .rank-item {
    padding: 12px;
    flex-wrap: wrap;
  }

  .rank-item-left {
    gap: 12px;
  }

  .rank-item-image {
    width: 56px;
    height: 56px;
  }

  .rank-item-right {
    width: 100%;
    justify-content: space-between;
    margin-top: 12px;
  }

  .rank-item-stats {
    flex-direction: row;
    gap: 16px;
  }
}
</style>
