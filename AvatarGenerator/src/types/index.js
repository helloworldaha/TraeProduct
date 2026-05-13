export const UploadStatus = {
  IDLE: 'idle',
  DRAGGING: 'dragging',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error'
}

export const GenerationStatus = {
  IDLE: 'idle',
  GENERATING: 'generating',
  SUCCESS: 'success',
  ERROR: 'error'
}

export const StylePresets = {
  MINIMAL: { name: '极简风格', description: '简洁线条，现代感' },
  CARTOON: { name: '卡通风格', description: '活泼可爱，色彩明亮' },
  PROFESSIONAL: { name: '商务风格', description: '正式稳重，专业感' },
  ARTISTIC: { name: '艺术风格', description: '创意十足，艺术感' }
}

export const DefaultParams = {
  saturation: 100,
  contrast: 100,
  lineWidth: 2,
  backgroundColor: '#ffffff',
  borderRadius: 0
}
