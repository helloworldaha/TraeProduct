<template>
  <div class="detail-page">
    <header class="header">
      <div class="header-content container">
        <div class="header-left">
          <button class="back-btn" @click="goBack">← 返回</button>
          <h1 class="logo">🎨 作品投票打榜</h1>
        </div>
        <nav class="nav">
          <router-link to="/" class="nav-item">首页</router-link>
          <router-link to="/rank" class="nav-item">排行榜</router-link>
        </nav>
      </div>
    </header>

    <div v-if="loading" class="loading-section">
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>

    <div v-else-if="!workData" class="error-section container">
      <div class="empty-state">
        <div class="empty-state-icon">😕</div>
        <p class="empty-state-text">作品不存在或已被删除</p>
        <router-link to="/" class="btn-primary" style="margin-top: 16px">返回首页</router-link>
      </div>
    </div>

    <div v-else class="detail-content">
      <div class="work-section container">
        <div class="work-card card">
          <div class="work-header">
            <div class="work-titles">
              <h2 class="work-title">{{ workData.title }}</h2>
              <div class="work-badges">
                <span v-if="workData.is_hot" class="hot-badge">🔥 热门</span>
                <span v-if="workData.is_recommend" class="recommend-badge">⭐ 推荐</span>
              </div>
            </div>
            <div class="work-rank-info">
              <div class="rank-badge" v-if="rankData.rank > 0">
                <span class="rank-text">第 {{ rankData.rank }} 名</span>
              </div>
              <div class="vote-count">
                <span class="vote-icon">👍</span>
                <span class="vote-number">{{ formatNumber(workData.vote_count) }}</span>
                <span class="vote-label">票</span>
              </div>
            </div>
          </div>

          <div class="work-media">
            <div class="work-image">
              <img 
                :src="workData.image_url || getDefaultImage(workData.id)" 
                :alt="workData.title"
                @error="handleImageError($event, workData.id)"
              />
            </div>
          </div>

          <div class="work-description" v-if="workData.description">
            <h3 class="section-title">📝 作品简介</h3>
            <p class="description-text">{{ workData.description }}</p>
          </div>
        </div>

        <div class="vote-section card">
          <div class="vote-header">
            <h3 class="section-title">🗳️ 为作品投票</h3>
            <p class="vote-hint">每人每日可投票 10 次，您的支持是创作者最大的动力！</p>
          </div>

          <div class="vote-stats">
            <div class="stat-card">
              <div class="stat-icon">📊</div>
              <div class="stat-info">
                <span class="stat-value">{{ formatNumber(workData.vote_count) }}</span>
                <span class="stat-label">当前票数</span>
              </div>
            </div>
            <div class="stat-card" v-if="rankData.rank > 0">
              <div class="stat-icon">🏆</div>
              <div class="stat-info">
                <span class="stat-value">第 {{ rankData.rank }} 名</span>
                <span class="stat-label">当前排名</span>
              </div>
            </div>
          </div>

          <div class="vote-form">
            <div class="form-group">
              <label class="form-label">您的昵称（选填，将显示在助力记录中）</label>
              <input 
                type="text" 
                v-model="nickname" 
                placeholder="请输入您的昵称（如：张三）"
                class="form-input"
              />
            </div>

            <button 
              class="vote-btn btn-primary" 
              @click="handleVote"
              :disabled="submitting || voteSuccess"
              :class="{ 'vote-success': voteSuccess }"
            >
              <span v-if="submitting">
                <span class="loading-spinner" style="width: 20px; height: 20px; margin-right: 8px; display: inline-block; border-width: 2px;"></span>
                投票中...
              </span>
              <span v-else-if="voteSuccess">
                ✨ 投票成功！
              </span>
              <span v-else>
                🗳️ 立即投票
              </span>
            </button>
          </div>
        </div>

        <div class="share-section card">
          <div class="share-header">
            <h3 class="section-title">📤 分享助力</h3>
            <p class="share-hint">分享给好友，邀请更多人来为这个作品投票助力！</p>
          </div>

          <div class="share-actions">
            <button class="share-btn copy-btn" @click="copyShareLink">
              <span class="share-icon">🔗</span>
              <span class="share-text">复制链接</span>
            </button>
            <router-link :to="`/assist/${workData.id}`" class="share-btn assist-btn">
              <span class="share-icon">💪</span>
              <span class="share-text">邀请助力</span>
            </router-link>
          </div>

          <div class="share-link" v-if="showShareLink">
            <span class="link-label">分享链接：</span>
            <div class="link-box">
              <span class="link-text">{{ shareLink }}</span>
              <button class="copy-small" @click="copyShareLink">复制</button>
            </div>
          </div>
        </div>

        <div class="similar-works-section card" v-if="similarWorks.length > 0">
          <div class="similar-header">
            <h3 class="section-title">🔥 热门推荐</h3>
          </div>

          <div class="similar-grid">
            <router-link 
              v-for="work in similarWorks" 
              :key="work.id" 
              :to="`/detail/${work.id}`"
              class="similar-item"
            >
              <div class="similar-image">
                <img 
                  :src="work.image_url || getDefaultImage(work.id)" 
                  :alt="work.title"
                  @error="handleImageError($event, work.id)"
                />
              </div>
              <div class="similar-info">
                <h4 class="similar-title">{{ work.title }}</h4>
                <div class="similar-stats">
                  <span class="similar-votes">👍 {{ formatNumber(work.vote_count) }}</span>
                  <span class="similar-rank" v-if="work.rank">#{{ work.rank }}</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <footer class="footer">
      <div class="container">
        <p class="footer-text">© 2024 作品投票打榜系统 | 公平公正，欢迎参与</p>
      </div>
    </footer>

    <div v-if="toastMessage" class="toast">{{ toastMessage }}</div>

    <div v-if="showVoteAnim" class="vote-animation">
      <div class="vote-particles">
        <span v-for="i in 12" :key="i" class="particle" :style="getParticleStyle(i)">
          ❤️
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getWorkById, submitVote, getWorks } from '@/api'
import { formatNumber, getDeviceId, generateShareLink, copyToClipboard } from '@/utils'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const voteSuccess = ref(false)
const showVoteAnim = ref(false)
const showShareLink = ref(false)
const toastMessage = ref('')

const workData = ref(null)
const rankData = ref({ rank: 0 })
const nickname = ref('')
const similarWorks = ref([])

const shareLink = computed(() => {
  if (workData.value) {
    return generateShareLink(workData.value.id)
  }
  return ''
})

const fetchWorkDetail = async () => {
  const workId = route.params.id
  if (!workId) return

  loading.value = true
  try {
    const res = await getWorkById(workId)
    if (res.code === 0) {
      workData.value = res.data.work
      rankData.value = { rank: res.data.rank || 0 }
    }
  } catch (err) {
    console.error('Failed to fetch work detail:', err)
  } finally {
    loading.value = false
  }
}

const fetchSimilarWorks = async () => {
  try {
    const res = await getWorks({ page: 1, page_size: 4 })
    if (res.code === 0) {
      similarWorks.value = (res.data.list || []).filter(
        w => w.id !== workData.value?.id
      ).slice(0, 4)
    }
  } catch (err) {
    console.error('Failed to fetch similar works:', err)
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const showToast = (message) => {
  toastMessage.value = message
  setTimeout(() => {
    toastMessage.value = ''
  }, 2000)
}

const playVoteAnimation = () => {
  showVoteAnim.value = true
  setTimeout(() => {
    showVoteAnim.value = false
  }, 1000)
}

const getParticleStyle = (index) => {
  const angle = (index * 30) * (Math.PI / 180)
  const distance = 80 + Math.random() * 40
  const x = Math.cos(angle) * distance
  const y = Math.sin(angle) * distance
  return {
    transform: `translate(${x}px, ${y}px)`,
    animationDelay: `${index * 0.05}s`
  }
}

const handleVote = async () => {
  if (!workData.value || submitting.value || voteSuccess.value) return

  submitting.value = true
  try {
    const res = await submitVote({
      work_id: workData.value.id,
      device_id: getDeviceId(),
      nickname: nickname.value || '匿名用户'
    })

    if (res.code === 0) {
      voteSuccess.value = true
      workData.value.vote_count = res.data.vote_count
      rankData.value = { rank: res.data.rank || 0 }
      
      playVoteAnimation()
      showToast('🎉 投票成功！感谢您的支持！')
      
      setTimeout(() => {
        voteSuccess.value = false
      }, 3000)
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

const copyShareLink = async () => {
  try {
    await copyToClipboard(shareLink.value)
    showShareLink.value = true
    showToast('✅ 链接已复制到剪贴板！')
  } catch (err) {
    showShareLink.value = true
    showToast('请手动复制链接')
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

watch(
  () => route.params.id,
  () => {
    fetchWorkDetail()
  },
  { immediate: true }
)

onMounted(() => {
  fetchSimilarWorks()
})
</script>

<style scoped>
.detail-page {
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

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #e0e0e0;
}

.logo {
  font-size: 18px;
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
}

.nav-item:hover {
  color: #667eea;
}

.loading-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.error-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.detail-content {
  padding: 40px 0 60px;
}

.work-section {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.work-card {
  overflow: visible;
}

.work-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.work-titles {
  flex: 1;
}

.work-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

.work-badges {
  display: flex;
  gap: 8px;
}

.work-rank-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.rank-badge {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
}

.rank-text {
  font-size: 14px;
  font-weight: 600;
  color: #fff;
}

.vote-count {
  display: flex;
  align-items: center;
  gap: 6px;
}

.vote-icon {
  font-size: 18px;
}

.vote-number {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.vote-label {
  font-size: 14px;
  color: #999;
}

.work-media {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.work-image {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

.work-image img {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: cover;
}

.work-description {
  padding: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

.description-text {
  font-size: 14px;
  line-height: 1.8;
  color: #666;
}

.vote-section {
  padding: 24px;
  height: fit-content;
}

.vote-header {
  margin-bottom: 24px;
}

.vote-hint {
  font-size: 13px;
  color: #999;
  margin-top: 8px;
}

.vote-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9ff;
  border-radius: 12px;
}

.stat-icon {
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #667eea;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.vote-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 13px;
  color: #666;
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

.vote-btn {
  width: 100%;
  padding: 16px 0;
  font-size: 16px;
  border-radius: 12px;
}

.vote-btn.vote-success {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.share-section {
  padding: 24px;
  margin-top: 24px;
}

.share-header {
  margin-bottom: 20px;
}

.share-hint {
  font-size: 13px;
  color: #999;
  margin-top: 8px;
}

.share-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 0;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.copy-btn {
  background: #f5f5f5;
  color: #666;
}

.copy-btn:hover {
  background: #e8e8e8;
}

.assist-btn {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: #fff;
}

.assist-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(238, 90, 36, 0.4);
}

.share-icon {
  font-size: 16px;
}

.share-link {
  margin-top: 16px;
}

.link-label {
  font-size: 13px;
  color: #999;
  display: block;
  margin-bottom: 8px;
}

.link-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.link-text {
  flex: 1;
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

.copy-small {
  padding: 4px 12px;
  background: #667eea;
  color: #fff;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
}

.similar-works-section {
  padding: 24px;
  margin-top: 24px;
}

.similar-header {
  margin-bottom: 20px;
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.similar-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: #f8f9ff;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.similar-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.similar-image {
  width: 100%;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
}

.similar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.similar-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.similar-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.similar-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}

.similar-votes {
  font-size: 12px;
  color: #667eea;
  font-weight: 500;
}

.similar-rank {
  font-size: 12px;
  color: #999;
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

.vote-animation {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 9999;
}

.vote-particles {
  position: relative;
  width: 200px;
  height: 200px;
}

.particle {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 24px;
  animation: particleFly 1s ease-out forwards;
  opacity: 0;
}

@keyframes particleFly {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0.5);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
}

@media (max-width: 1024px) {
  .work-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 12px 0;
  }

  .header-left {
    gap: 8px;
  }

  .logo {
    font-size: 14px;
  }

  .nav {
    gap: 16px;
  }

  .work-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .work-rank-info {
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .work-title {
    font-size: 20px;
  }

  .vote-number {
    font-size: 20px;
  }

  .vote-stats {
    grid-template-columns: 1fr 1fr;
  }

  .similar-grid {
    grid-template-columns: 1fr;
  }

  .similar-item {
    flex-direction: row;
  }

  .similar-image {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
  }
}
</style>
