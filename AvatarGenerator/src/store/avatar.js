import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { DefaultParams, GenerationStatus, UploadStatus } from '@/types'
import { loadFromLocalStorage, saveToLocalStorage, LocalStorageKeys, generateId } from '@/utils'
import { aiService } from '@/services/mockAIService'

export const useAvatarStore = defineStore('avatar', () => {
  const uploadStatus = ref(UploadStatus.IDLE)
  const uploadError = ref(null)
  const originalImage = ref(null)
  const generationStatus = ref(GenerationStatus.IDLE)
  const generatedImage = ref(null)
  const generatedSVG = ref(null)
  const params = ref({ ...DefaultParams })
  const history = ref(loadFromLocalStorage(LocalStorageKeys.HISTORY) || [])

  const hasOriginalImage = computed(() => !!originalImage.value)
  const hasGeneratedImage = computed(() => !!generatedImage.value)
  const isGenerating = computed(() => generationStatus.value === GenerationStatus.GENERATING)

  function resetParams() {
    params.value = { ...DefaultParams }
  }

  function updateParams(newParams) {
    params.value = { ...params.value, ...newParams }
  }

  function setUploadError(error) {
    uploadError.value = error
    uploadStatus.value = UploadStatus.ERROR
  }

  function setOriginalImage(imageData) {
    originalImage.value = imageData
    uploadStatus.value = UploadStatus.SUCCESS
    uploadError.value = null
  }

  function resetUpload() {
    uploadStatus.value = UploadStatus.IDLE
    uploadError.value = null
    originalImage.value = null
  }

  async function generateAvatar() {
    if (!originalImage.value) return

    generationStatus.value = GenerationStatus.GENERATING
    generatedImage.value = null
    generatedSVG.value = null

    try {
      const result = await aiService.generateVectorAvatar(originalImage.value, params.value)
      if (result.success) {
        generatedImage.value = result.data
        generatedSVG.value = result.svg
        generationStatus.value = GenerationStatus.SUCCESS

        const historyItem = {
          id: generateId(),
          originalImage: originalImage.value,
          generatedImage: result.data,
          params: { ...params.value },
          timestamp: Date.now()
        }
        addToHistory(historyItem)
      } else {
        throw new Error('Generation failed')
      }
    } catch (error) {
      generationStatus.value = GenerationStatus.ERROR
      console.error('Generation error:', error)
    }
  }

  function addToHistory(item) {
    history.value.unshift(item)
    if (history.value.length > 20) {
      history.value = history.value.slice(0, 20)
    }
    saveToLocalStorage(LocalStorageKeys.HISTORY, history.value)
  }

  function deleteFromHistory(id) {
    history.value = history.value.filter(item => item.id !== id)
    saveToLocalStorage(LocalStorageKeys.HISTORY, history.value)
  }

  function clearHistory() {
    history.value = []
    saveToLocalStorage(LocalStorageKeys.HISTORY, [])
  }

  function loadHistoryItem(item) {
    originalImage.value = item.originalImage
    params.value = { ...item.params }
    generatedImage.value = item.generatedImage
    uploadStatus.value = UploadStatus.SUCCESS
    generationStatus.value = GenerationStatus.SUCCESS
  }

  return {
    uploadStatus,
    uploadError,
    originalImage,
    generationStatus,
    generatedImage,
    generatedSVG,
    params,
    history,
    hasOriginalImage,
    hasGeneratedImage,
    isGenerating,
    resetParams,
    updateParams,
    setUploadError,
    setOriginalImage,
    resetUpload,
    generateAvatar,
    addToHistory,
    deleteFromHistory,
    clearHistory,
    loadHistoryItem
  }
})
