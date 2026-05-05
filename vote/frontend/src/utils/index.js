const DEVICE_ID_KEY = 'vote_device_id'

export function generateDeviceId() {
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 10)
  return `dev_${timestamp}_${randomStr}`
}

export function getDeviceId() {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = generateDeviceId()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

export function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toString()
}

export function formatTime(date) {
  const d = new Date(date)
  const pad = n => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function getTrendIcon(trend) {
  const icons = {
    up: '↑',
    down: '↓',
    same: '-',
    new: 'new'
  }
  return icons[trend] || '-'
}

export function getTrendClass(trend) {
  const classes = {
    up: 'trend-up',
    down: 'trend-down',
    same: 'trend-same',
    new: 'trend-new'
  }
  return classes[trend] || 'trend-same'
}

export function generateShareLink(workId) {
  const baseUrl = window.location.origin
  return `${baseUrl}/assist/${workId}`
}

export function copyToClipboard(text) {
  return new Promise((resolve, reject) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(resolve).catch(reject)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-9999px'
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        resolve()
      } catch (err) {
        reject(err)
      } finally {
        document.body.removeChild(textarea)
      }
    }
  })
}
