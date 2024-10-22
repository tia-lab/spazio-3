// Define the structure for a pixel object
interface Pixel {
  x: number
  y: number
  width: number
  height: number
  color: string
  opacity: number
}

interface GeneratePixel {
  container: HTMLDivElement
  cols: number
  color?: string
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
export function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Function to generate a pixel grid and return pixels, canvas, and context for each container
export function generatePixelGrid({
  container,
  cols,
  color = '0, 0, 0'
}: GeneratePixel) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    console.error('Canvas context not available')
    return { pixels: [], canvas: null, context: null, container }
  }

  // Disable image smoothing for sharp pixels
  context.imageSmoothingEnabled = false
  container.appendChild(canvas)

  // Adjust canvas size to fill container
  function resizeCanvas(): void {
    canvas.width = container.offsetWidth
    canvas.height = container.offsetHeight
  }

  window.addEventListener('resize', resizeCanvas)
  resizeCanvas() // Initial call to set up canvas

  const pixelWidth = Math.floor(canvas.width / cols)
  const pixelHeight = pixelWidth // Ensure square pixels
  const rows = Math.ceil(canvas.height / pixelHeight) // Ensure enough rows to fill the canvas

  const pixels: Pixel[] = []

  // Initialize pixel grid, all black at the start
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const width = i === cols - 1 ? canvas.width - i * pixelWidth : pixelWidth // Last column width adjustment
      const height =
        j === rows - 1 ? canvas.height - j * pixelHeight : pixelHeight // Last row height adjustment

      pixels.push({
        x: i * pixelWidth,
        y: j * pixelHeight,
        width, // Adjust width for the last column
        height, // Adjust height for the last row
        color: `rgb(${color})`, // Start as black
        opacity: 1 // Start with full opacity
      })
    }
  }

  const shuffledPixels = shuffleArray(pixels) // Shuffle the pixels for random fade-out

  return { pixels, shuffledPixels, canvas, context, container }
}

// Function to draw pixels on the canvas

interface DrawPixels {
  pixels: Pixel[]
  context: CanvasRenderingContext2D
  canvas: HTMLCanvasElement
  color?: string
}

export function drawPixels({
  pixels,
  context,
  canvas,
  color = '0, 0, 0'
}: DrawPixels): void {
  context.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
  pixels.forEach((pixel) => {
    context.fillStyle = `rgba(${color}, ${pixel.opacity})` // Always black, with varying opacity
    context.fillRect(pixel.x, pixel.y, pixel.width, pixel.height) // Draw each pixel precisely
  })
}
