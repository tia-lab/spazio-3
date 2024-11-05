import { ScrollTrigger, gsap } from '@gsap'

gsap.registerPlugin(ScrollTrigger)

// Define the structure for a pixel object
interface Pixel {
  x: number
  y: number
  width: number
  height: number
  colorString: string // Color as a string for GSAP compatibility
  opacity: number
  isStatic: boolean // Flag to indicate if pixel is static and should not animate
}

interface GeneratePixel {
  container: HTMLDivElement
  cols: number
  colorStart: string // Starting color
  colorEnd: string // Ending color
}

// Function to generate a pixel grid with exactly 3 sparse rows at the top and bottom
export function generatePixelGrid({
  container,
  cols,
  colorStart = '0, 0, 0',
  colorEnd = '255, 255, 255'
}: GeneratePixel) {
  let canvas = container.querySelector('canvas')
  if (!canvas) {
    canvas = document.createElement('canvas')
    container.appendChild(canvas)
  }

  const context = canvas.getContext('2d')
  if (!context) {
    console.error('Canvas context not available')
    return { pixels: [], canvas: null, context: null, container }
  }

  context.imageSmoothingEnabled = false

  function resizeCanvas(): void {
    canvas!.width = container.offsetWidth
    canvas!.height = container.offsetHeight
    ScrollTrigger.refresh()
  }

  resizeCanvas()

  // Calculate pixel dimensions with overflow handling
  const pixelWidth = Math.ceil(canvas.width / cols)
  const pixelHeight = pixelWidth // Keep pixels square
  const rows = Math.ceil(canvas.height / pixelHeight)

  const pixels: Pixel[] = []

  // Define probabilities for each sparse row at the top and bottom
  const sparseProbabilities = [0.5, 0.7, 0.9] // Probabilities for top 3 and bottom 3 rows

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let colorString = `rgb(${colorStart})` // Default to starting color
      let isStatic = false

      // Sparse effect for the top 3 rows, using starting color for sparse pixels
      if (j < 3) {
        const probability = sparseProbabilities[j]
        if (Math.random() > probability) {
          colorString = `rgb(${colorStart})` // Sparse pixels have start color
          isStatic = true // These pixels should not animate
        }
      }
      // Sparse effect for the bottom 3 rows, using ending color for sparse pixels
      else if (j >= rows - 3) {
        const probability = sparseProbabilities[rows - j - 1]
        if (Math.random() > probability) {
          colorString = `rgb(${colorEnd})` // Sparse pixels have end color
          isStatic = true // These pixels should not animate
        } else {
          colorString = `rgb(${colorStart})` // Default to start color for non-sparse bottom pixels
        }
      }

      // Middle pixels will animate from start to end color
      if (j >= 3 && j < rows - 3) {
        colorString = `rgb(${colorStart})` // Middle pixels start with start color
        isStatic = false // Middle pixels will animate
      }

      pixels.push({
        x: i * pixelWidth,
        y: j * pixelHeight,
        width: pixelWidth,
        height: pixelHeight,
        colorString, // Set color based on position
        opacity: 1, // Fully opaque
        isStatic // Set if pixel should be static
      })
    }
  }

  const shuffledPixels = shuffleArray(pixels)

  return { pixels, shuffledPixels, canvas, context, container }
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Draw pixels on the canvas
interface DrawPixels {
  pixels: Pixel[]
  context: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
}

export function drawPixels({ pixels, context, canvas }: DrawPixels): void {
  context.clearRect(0, 0, canvas.width, canvas.height)
  pixels.forEach((pixel) => {
    context.fillStyle = pixel.colorString
    context.globalAlpha = pixel.opacity
    context.fillRect(pixel.x, pixel.y, pixel.width, pixel.height)
  })
}
