class MockAIService {
  async generateVectorAvatar(imageData, params) {
    await this.delay(1500 + Math.random() * 1000)

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    return new Promise((resolve, reject) => {
      img.onload = () => {
        const targetSize = 512
        canvas.width = targetSize
        canvas.height = targetSize

        ctx.fillStyle = params.backgroundColor
        ctx.fillRect(0, 0, targetSize, targetSize)

        const scale = Math.min(targetSize / img.width, targetSize / img.height)
        const scaledWidth = img.width * scale
        const scaledHeight = img.height * scale
        const offsetX = (targetSize - scaledWidth) / 2
        const offsetY = (targetSize - scaledHeight) / 2

        ctx.filter = 'saturate(' + params.saturation + '%) contrast(' + params.contrast + '%) brightness(115%)'
        ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight)
        ctx.filter = 'none'

        this.applyVectorEffect(ctx, canvas, params)

        const radius = (params.borderRadius / 100) * (targetSize / 2)
        const resultCanvas = this.applyBorderRadius(canvas, radius)

        resolve({
          success: true,
          data: resultCanvas.toDataURL('image/png'),
          svg: this.generateSVG(resultCanvas, params)
        })
      }
      img.onerror = reject
      img.src = imageData
    })
  }

  applyVectorEffect(ctx, canvas, params) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data

    this.enhanceDarkRegions(data, canvas.width, canvas.height)

    this.applySmoothing(data, canvas.width, canvas.height)

    const edgeData = this.detectEdges(data, canvas.width, canvas.height, params.lineWidth)

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const idx = (y * canvas.width + x) * 4

        if (edgeData[y][x] && data[idx + 3] > 50) {
          data[idx] = 35
          data[idx + 1] = 35
          data[idx + 2] = 40
          data[idx + 3] = 255
        } else {
          const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
          let factor = 28

          if (brightness > 180) {
            factor = 40
          } else if (brightness < 80) {
            factor = 24
          }

          data[idx] = Math.floor((data[idx] / factor) + 0.4) * factor
          data[idx + 1] = Math.floor((data[idx + 1] / factor) + 0.4) * factor
          data[idx + 2] = Math.floor((data[idx + 2] / factor) + 0.4) * factor

          if (brightness < 60) {
            const boost = Math.min(45, 60 - brightness)
            data[idx] = Math.min(255, data[idx] + boost)
            data[idx + 1] = Math.min(255, data[idx + 1] + boost)
            data[idx + 2] = Math.min(255, data[idx + 2] + boost)
          }
        }
      }
    }

    this.boostColors(data, canvas.width, canvas.height)

    ctx.putImageData(imageData, 0, 0)
  }

  enhanceDarkRegions(data, width, height) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3

        if (brightness < 100) {
          const boost = (100 - brightness) * 0.35
          data[idx] = Math.min(255, data[idx] + boost)
          data[idx + 1] = Math.min(255, data[idx + 1] + boost)
          data[idx + 2] = Math.min(255, data[idx + 2] + boost)
        }
      }
    }
  }

  applySmoothing(data, width, height) {
    const tempData = new Uint8ClampedArray(data)
    const kernelSize = 1

    for (let y = kernelSize; y < height - kernelSize; y++) {
      for (let x = kernelSize; x < width - kernelSize; x++) {
        const idx = (y * width + x) * 4
        let r = 0, g = 0, b = 0, count = 0

        for (let ky = -kernelSize; ky <= kernelSize; ky++) {
          for (let kx = -kernelSize; kx <= kernelSize; kx++) {
            const kidx = ((y + ky) * width + (x + kx)) * 4
            r += tempData[kidx]
            g += tempData[kidx + 1]
            b += tempData[kidx + 2]
            count++
          }
        }

        data[idx] = Math.round(r / count)
        data[idx + 1] = Math.round(g / count)
        data[idx + 2] = Math.round(b / count)
      }
    }
  }

  boostColors(data, width, height) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4
        const r = data[idx]
        const g = data[idx + 1]
        const b = data[idx + 2]
        const brightness = (r + g + b) / 3

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const sat = max > 0 ? (max - min) / max : 0

        if (sat < 0.12 && brightness > 40 && brightness < 230) {
          if (r > g && r > b) {
            data[idx] = Math.min(255, r + 18)
            data[idx + 1] = Math.min(255, g + 5)
            data[idx + 2] = Math.min(255, b + 5)
          } else if (g > r && g > b) {
            data[idx] = Math.min(255, r + 5)
            data[idx + 1] = Math.min(255, g + 18)
            data[idx + 2] = Math.min(255, b + 5)
          } else if (b > r && b > g) {
            data[idx] = Math.min(255, r + 5)
            data[idx + 1] = Math.min(255, g + 5)
            data[idx + 2] = Math.min(255, b + 18)
          } else {
            const warm = 10
            data[idx] = Math.min(255, r + warm)
            data[idx + 1] = Math.min(255, g + warm * 0.6)
            data[idx + 2] = Math.min(255, b + warm * 0.3)
          }
        }
      }
    }
  }

  detectEdges(data, width, height, lineWidth) {
    const edgeData = Array(height).fill().map(function() { return Array(width).fill(false) })
    const threshold = 18 + lineWidth * 5

    const sobelX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]]
    const sobelY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]]

    for (let y = 2; y < height - 2; y++) {
      for (let x = 2; x < width - 2; x++) {
        let gx = 0, gy = 0

        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4
            const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3
            gx += brightness * sobelX[ky + 1][kx + 1]
            gy += brightness * sobelY[ky + 1][kx + 1]
          }
        }

        const magnitude = Math.sqrt(gx * gx + gy * gy)
        if (magnitude > threshold && data[(y * width + x) * 4 + 3] > 50) {
          edgeData[y][x] = true
        }
      }
    }

    if (lineWidth > 1) {
      const dilated = Array(height).fill().map(function() { return Array(width).fill(false) })
      const dilateSize = Math.max(1, Math.floor(lineWidth / 2))

      for (let y = dilateSize + 2; y < height - dilateSize - 2; y++) {
        for (let x = dilateSize + 2; x < width - dilateSize - 2; x++) {
          if (edgeData[y][x]) {
            for (let dy = -dilateSize; dy <= dilateSize; dy++) {
              for (let dx = -dilateSize; dx <= dilateSize; dx++) {
                if (Math.abs(dx) + Math.abs(dy) <= dilateSize + 1) {
                  dilated[y + dy][x + dx] = true
                }
              }
            }
          }
        }
      }
      return dilated
    }

    return edgeData
  }

  applyBorderRadius(sourceCanvas, radius) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    canvas.width = sourceCanvas.width
    canvas.height = sourceCanvas.height

    ctx.beginPath()
    ctx.moveTo(radius, 0)
    ctx.lineTo(canvas.width - radius, 0)
    ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius)
    ctx.lineTo(canvas.width, canvas.height - radius)
    ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height)
    ctx.lineTo(radius, canvas.height)
    ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius)
    ctx.lineTo(0, radius)
    ctx.quadraticCurveTo(0, 0, radius, 0)
    ctx.closePath()
    ctx.clip()

    ctx.drawImage(sourceCanvas, 0, 0)
    return canvas
  }

  generateSVG(canvas, params) {
    const size = canvas.width
    return '<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '">\n  <rect width="100%" height="100%" fill="' + params.backgroundColor + '" rx="' + ((params.borderRadius / 100) * (size / 2)) + '"/>\n  <image href="' + canvas.toDataURL('image/png') + '" width="' + size + '" height="' + size + '"/>\n</svg>'
  }

  delay(ms) {
    return new Promise(function(resolve) { setTimeout(resolve, ms) })
  }
}

export const aiService = new MockAIService()
