const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

export function validateImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: '仅支持 JPG、PNG、WebP 格式' }
  }
  if (file.size > MAX_SIZE) {
    return { valid: false, error: '文件大小不能超过 10MB' }
  }
  return { valid: true, error: null }
}

export function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const LocalStorageKeys = {
  HISTORY: 'avatar_generator_history'
}

export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
    return false
  }
}

export function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Failed to load from localStorage:', e)
    return null
  }
}

export function debounce(fn, delay) {
  let timer = null
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

export function downloadFile(dataURL, filename, type = 'png') {
  const link = document.createElement('a')
  link.download = `${filename}.${type}`
  link.href = dataURL
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
