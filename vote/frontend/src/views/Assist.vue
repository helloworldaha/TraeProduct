<template>
  <div class="assist-page">
    <div class="assist-header">
      <div class="assist-banner">
        <div class="banner-content">
          <div class="assist-icon">💪</div>
          <h1 class="assist-title">助力投票</h1>
          <p class="assist-subtitle">您正在帮助「{{ workData?.title || '该作品' }}」投票加油！</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-section">
      <div class="loading">
        <div class="loading-spinner"></div>
      </div>
    </div>

    <div v-else class="assist-content">
      <div class="work-card card">
        <div class="work-header">
          <div class="work-image">
            <img 
              :src="workData?.image_url || getDefaultImage(workData?.id || 0)" 
              :alt="workData?.title"
              @error="handleImageError($event, workData?.id || 0)"
            />
          </div>
          <div class="work-info">
            <h2 class="work-title">{{ workData?.title }}</h2>
            <div class="work-badges">
              <span v-if="workData?.is_hot" class="hot-badge">🔥 热门</span>
              <span v-if="workData?.is_recommend" class="recommend-badge">⭐ 推荐</span>
            </div>
          </div>
        </div>

        <div class="work-stats">
          <div class="stat-card">
            <div class="stat-icon">👍</div>
            <div class="stat-info">
              <span class="stat-value">{{ formatNumber(workData?.vote_count || 0) }}</span>
              <span class="stat-label">当前票数</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div class="stat-info">
              <span class="stat-value">第 {{ rankData?.rank || '---' }} 名</span>
              <span class="stat-label">当前排名</span>
            </div>
          </div>
        </div>

        <div class="rank-gap" v-if="nextRankVotes > 0">
          <div class="gap-icon">📊</div>
          <div class="gap-info">
            <span class="gap-text">距离上一名还差</span>
            <span class="gap-number">{{ rankGap }} 票</span>
          </div>
          <div class="gap-cta">
            <span class="gap-hint">快邀请好友来助力！</span>
          </div>
        </div>
      </div>

      <div class="vote-section card">
        <div class="vote-header">
          <h3 class="section-title">🎯 立即助力投票</h3>
          <p class="vote-hint">您的一票对作品非常重要！</p>
        </div>

        <div class="vote-form">
          <div class="form-group">
            <label class="form-label">您的昵称（将显示在助力记录中）</label>
            <input 
              type="text" 
              v-model="nickname" 
              placeholder="请输入您的昵称（如：张三）"
              class="form-input"
            />
          </div>

          <button 
            class="vote-btn btn-primary" 
            @click="handleAssistVote"
            :disabled="submitting || voteSuccess"
            :class="{ 'vote-success': voteSuccess }"
          >
            <span v-if="submitting">
              <span class="loading-spinner" style="width: 20px; height: 20px; margin-right: 8px; display: inline-block; border-width: 2px;"></span>
              助力中...
            </span>
            <span v-else-if="voteSuccess">
              ✨ 助力成功！
            </span>
            <span v-else>
              💪 立即助力投票
            </span>
          </button>
        </div>
      </div>

      <div class="share-section card">
        <div class="share-header">
          <h3 class="section-title">📢 邀请更多好友助力</h3>
          <p class="share-hint">分享给好友，让更多人来为这个作品投票！</p>
        </div>

        <div class="share-actions">
          <button class="share-btn copy-btn" @click="copyShareLink">
            <span class="share-icon">🔗</span>
            <span class="share-text">复制链接</span>
          </button>
          <button class="share-btn wechat-btn">
            <span class="share-icon">💬</span>
            <span class="share-text">微信分享</span>
          </button>
          <button class="share-btn qrcode-btn">
            <span class="share-icon">📱</span>
            <span class="share-text">生成二维码</span>
          </button>
        </div>

        <div class="share-tip">
          <span class="tip-icon">💡</span>
          <span class="tip-text">提示：将链接分享到微信群或朋友圈，邀请更多好友来投票助力！</span>
        </div>
      </div>

      <div class="records-section card">
        <div class="records-header">
          <h3 class="section-title">👥 助力记录</h3>
          <span class="records-count">共 {{ voteRecords.length }} 人助力</span>
        </div>

        <div v-if="voteRecords.length === 0" class="empty-records">
          <div class="empty-icon">📭</div>
          <p class="empty-text">暂无助力记录，快来成为第一个助力者吧！</p>
        </div>

        <div v-else class="records-list">
          <div 
            v-for="(record, index) in displayRecords" 
            :key="record.id"
            class="record-item"
            :class="{ 'record-highlight': index < 3 }"
          >
            <div class="record-avatar">
              <span class="avatar-text">{{ getAvatarText(record.nickname) }}</span>
            </div>
            <div class="record-info">
              <span class="record-name">{{ record.nickname || '匿名用户' }}</span>
              <span class="record-time">{{ formatTime(record.created_at) }}</span>
            </div>
            <div class="record-action">
              <span v-if="index < 3" class="record-badge hot-badge">🔥 最新</span>
              <span v-else class="record-text">已助力</span>
            </div>
          </div>
        </div>

        <div v-if="voteRecords.length > displayLimit" class="load-more-records">
          <button @click="loadMoreRecords" class="load-more-btn">
            查看更多助力记录 →
          </button>
        </div>
      </div>

      <div class="cta-section">
        <div class="cta-content">
          <h3 class="cta-title">🎨 查看更多精彩作品</h3>
          <p class="cta-hint">发现更多优秀作品，为您喜欢的作品投票</p>
        </div>
        <div class="cta-actions">
          <router-link to="/" class="cta-btn home-btn">
            <span class="cta-icon">🏠</span>
            <span class="cta-text">返回首页</span>
          </router-link>
          <router-link to="/rank" class="cta-btn rank-btn">
            <span class="cta-icon">🏆</span>
            <span class="cta-text">查看排行榜</span>
          </router-link>
        </div>
      </div>
    </div>

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
import { getWorkById, submitVote, getVoteRecords } from '@/api'
import { formatNumber, getDeviceId, formatTime, generateShareLink, copyToClipboard } from '@/utils'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const submitting = ref(false)
const voteSuccess = ref(false)
const showVoteAnim = ref(false)
const toastMessage = ref('')

const workData = ref(null)
const rankData = ref({ rank: 0 })
const voteRecords = ref([])
const nickname = ref('')
const displayLimit = ref(10)

const nextRankVotes = ref(0)
const rankGap = computed(() => {
  if (nextRankVotes.value > 0 && workData.value) {
    return nextRankVotes.value - workData.value.vote_count + 1
  }
  return 0
})

const displayRecords = computed(() => {
  return voteRecords.value.slice(0, displayLimit.value)
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

const fetchVoteRecords = async () => {
  const workId = route.params.id
  if (!workId) return

  try {
    const res = await getVoteRecords({ work_id: workId, limit: 50 })
    if (res.code === 0) {
      voteRecords.value = res.data || []
    }
  } catch (err) {
    console.error('Failed to fetch vote records:', err)
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

const handleAssistVote = async () => {
  if (!workData.value || submitting.value || voteSuccess.value) return

  submitting.value = true
  try {
    const res = await submitVote({
      work_id: workData.value.id,
      device_id: getDeviceId(),
      nickname: nickname.value || '匿名用户',
      is_assisted: true,
      share_link_id: route.params.id
    })

    if (res.code === 0) {
      voteSuccess.value = true
      workData.value.vote_count = res.data.vote_count
      rankData.value = { rank: res.data.rank || 0 }
      
      playVoteAnimation()
      showToast('🎉 助力成功！感谢您的支持！')
      fetchVoteRecords()
      
      setTimeout(() => {
        voteSuccess.value = false
      }, 3000)
    } else {
      showToast(res.message || '助力失败')
    }
  } catch (err) {
    const errMsg = err.response?.data?.message || '助力失败，请稍后再试'
    showToast(errMsg)
  } finally {
    submitting.value = false
  }
}

const copyShareLink = async () => {
  try {
    const shareUrl = generateShareLink(workData.value?.id || route.params.id)
    await copyToClipboard(shareUrl)
    showToast('✅ 链接已复制到剪贴板！快去分享给好友吧！')
  } catch (err) {
    showToast('请手动复制链接')
  }
}

const loadMoreRecords = () => {
  displayLimit.value += 10
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

const getAvatarText = (nickname) => {
  if (!nickname) return '匿'
  return nickname.charAt(0).toUpperCase()
}

watch(
  () => route.params.id,
  () => {
    fetchWorkDetail()
    fetchVoteRecords()
  },
  { immediate: true }
)
</script>

<style scoped>
.assist-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ffb347 100%);
  background-attachment: fixed;
}

.assist-header {
  padding: 40px 20px 20px;
}

.assist-banner {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  color: #fff;
}

.assist-icon {
  font-size: 48px;
  margin-bottom: 16px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.assist-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.assist-subtitle {
  font-size: 16px;
  opacity: 0.95;
  background: rgba(255, 255, 255, 0.2);
  padding: 12px 24px;
  border-radius: 25px;
  display: inline-block;
  backdrop-filter: blur(10px);
}

.loading-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.assist-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px 40px;
}

.work-card {
  margin-bottom: 20px;
}

.work-header {
  display: flex;
  gap: 16px;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.work-image {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.work-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.work-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.work-badges {
  display: flex;
  gap: 8px;
}

.work-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 20px;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #fff5f5 0%, #fffaf0 100%);
  border-radius: 12px;
}

.stat-icon {
  font-size: 28px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #ff6b6b;
}

.stat-label {
  font-size: 12px;
  color: #999;
}

.rank-gap {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  margin: 0 20px 20px;
  background: linear-gradient(135deg, #fff0f0 0%, #fff5e6 100%);
  border-radius: 12px;
  border: 1px solid #ffd4d4;
}

.gap-icon {
  font-size: 24px;
}

.gap-info {
  flex: 1;
}

.gap-text {
  font-size: 13px;
  color: #666;
  display: block;
}

.gap-number {
  font-size: 24px;
  font-weight: 700;
  color: #ff6b6b;
}

.gap-hint {
  font-size: 13px;
  color: #ff6b6b;
  font-weight: 500;
}

.vote-section {
  padding: 24px;
  margin-bottom: 20px;
}

.vote-header {
  margin-bottom: 24px;
  text-align: center;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.vote-hint {
  font-size: 13px;
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
  font-size: 14px;
  color: #666;
}

.form-input {
  width: 100%;
  padding: 14px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 15px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  border-color: #ff6b6b;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.vote-btn {
  width: 100%;
  padding: 16px 0;
  font-size: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
}

.vote-btn.vote-success {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.share-section {
  padding: 24px;
  margin-bottom: 20px;
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
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.share-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px 8px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.copy-btn {
  background: #f5f5f5;
}

.copy-btn:hover {
  background: #e8e8e8;
}

.wechat-btn {
  background: #07c160;
  color: #fff;
}

.wechat-btn:hover {
  background: #06ad56;
}

.qrcode-btn {
  background: #667eea;
  color: #fff;
}

.qrcode-btn:hover {
  background: #5a6fd6;
}

.share-icon {
  font-size: 24px;
}

.share-text {
  font-size: 13px;
  font-weight: 500;
}

.share-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
  padding: 12px;
  background: #fef3c7;
  border-radius: 8px;
}

.tip-icon {
  font-size: 16px;
}

.tip-text {
  font-size: 13px;
  color: #92400e;
  line-height: 1.5;
}

.records-section {
  padding: 24px;
  margin-bottom: 20px;
}

.records-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.records-count {
  font-size: 13px;
  color: #999;
}

.empty-records {
  text-align: center;
  padding: 40px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.record-item.record-highlight {
  background: linear-gradient(135deg, #fff5f5 0%, #fffaf0 100%);
  border: 1px solid #ffd4d4;
}

.record-item:hover {
  background: #f5f5f5;
}

.record-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-text {
  font-size: 16px;
  font-weight: 600;
  color: #fff;
}

.record-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.record-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.record-time {
  font-size: 12px;
  color: #999;
}

.record-action {
  flex-shrink: 0;
}

.record-text {
  font-size: 13px;
  color: #999;
}

.load-more-records {
  text-align: center;
  margin-top: 16px;
}

.load-more-btn {
  padding: 8px 20px;
  font-size: 13px;
  color: #667eea;
  background: transparent;
}

.load-more-btn:hover {
  color: #5a6fd6;
}

.cta-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 24px;
  margin-top: 20px;
}

.cta-content {
  text-align: center;
  margin-bottom: 20px;
}

.cta-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.cta-hint {
  font-size: 13px;
  color: #999;
}

.cta-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.cta-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.home-btn {
  background: #f5f5f5;
  color: #666;
}

.home-btn:hover {
  background: #e8e8e8;
}

.rank-btn {
  background: linear-gradient(135deg, #ffd700 0%, #ffb700 100%);
  color: #92400e;
}

.rank-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 183, 0, 0.4);
}

.cta-icon {
  font-size: 18px;
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

@media (max-width: 480px) {
  .assist-header {
    padding: 30px 16px 16px;
  }

  .assist-title {
    font-size: 24px;
  }

  .assist-subtitle {
    font-size: 14px;
    padding: 10px 16px;
  }

  .work-header {
    padding: 16px;
  }

  .work-image {
    width: 80px;
    height: 80px;
  }

  .work-title {
    font-size: 16px;
  }

  .work-stats {
    padding: 16px;
  }

  .stat-value {
    font-size: 18px;
  }

  .rank-gap {
    flex-wrap: wrap;
    padding: 12px 16px;
    margin: 0 16px 16px;
  }

  .gap-number {
    font-size: 20px;
  }

  .vote-section {
    padding: 20px;
  }

  .share-actions {
    gap: 8px;
  }

  .share-btn {
    padding: 12px 8px;
  }

  .share-icon {
    font-size: 20px;
  }

  .share-text {
    font-size: 12px;
  }

  .cta-actions {
    grid-template-columns: 1fr;
  }
}
</style>
