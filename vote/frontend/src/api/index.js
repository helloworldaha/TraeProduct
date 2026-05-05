import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('API Error:', error)
    return Promise.reject(error)
  }
)

export function getActivityInfo() {
  return api.get('/activity')
}

export function getWorks(params = {}) {
  return api.get('/works', { params })
}

export function getWorkById(id) {
  return api.get(`/works/${id}`)
}

export function submitVote(data) {
  return api.post('/vote', data)
}

export function getVoteRecords(params = {}) {
  return api.get('/vote-records', { params })
}

export function getRank(params = {}) {
  return api.get('/rank', { params })
}

export function getTrendData(workId) {
  return api.get('/trend', { params: { work_id: workId } })
}

export default api
