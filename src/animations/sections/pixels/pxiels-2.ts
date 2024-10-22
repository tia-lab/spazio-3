import { gsap } from 'gsap' // Import GSAP for animations

// Define the structure for a pixel object
interface Pixel {
  x: number
  y: number
  width: number
  height: number
  color: string
  opacity: number
}

// Function to shuffle an array (Fisher-Yates shuffle algorithm)
function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

// Function to generate a pixel grid and return pixels, canvas, and context for each container
export function generatePixelGrid(containers: HTMLDivElement[], cols: number) {
  return containers.map((container) => {
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
        const width =
          i === cols - 1 ? canvas.width - i * pixelWidth : pixelWidth // Last column width adjustment
        const height =
          j === rows - 1 ? canvas.height - j * pixelHeight : pixelHeight // Last row height adjustment

        pixels.push({
          x: i * pixelWidth,
          y: j * pixelHeight,
          width, // Adjust width for the last column
          height, // Adjust height for the last row
          color: 'rgb(0, 0, 0)', // Start as black
          opacity: 1 // Start with full opacity
        })
      }
    }

    return { pixels, canvas, context, container }
  })
}

// Function to draw pixels on the canvas
export function drawPixels(
  pixels: Pixel[],
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
): void {
  context.clearRect(0, 0, canvas.width, canvas.height) // Clear the canvas
  pixels.forEach((pixel) => {
    context.fillStyle = `rgba(0, 0, 0, ${pixel.opacity})` // Always black, with varying opacity
    context.fillRect(pixel.x, pixel.y, pixel.width, pixel.height) // Draw each pixel precisely
  })
}

// Function to animate the pixel grid
export function animatePixelGrid(
  pixelsData: {
    pixels: Pixel[]
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    container: HTMLDivElement
  }[]
) {
  pixelsData.forEach(({ pixels, canvas, context, container }) => {
    const shuffledPixels = shuffleArray(pixels) // Shuffle the pixels for random fade-out

    // Animate the pixels using GSAP
    gsap.to(shuffledPixels, {
      stagger: { amount: 1, from: 'random' },
      scrollTrigger: { trigger: container, scrub: 1 },
      opacity: 0, // Fade out pixel opacity
      duration: 1, // Example duration (can be replaced with a custom variable)
      onUpdate: () => drawPixels(shuffledPixels, context, canvas), // Redraw pixels every time opacity changes
      ease: 'power1.out' // Use custom easing
    })
  })
}

// Usage Example
export function initializePixelAnimation(): void {
  const pixelContainers = Array.from(
    document.querySelectorAll<HTMLDivElement>('[data-anim="pixels"]')
  )
  const pixelsData = generatePixelGrid(pixelContainers, 10) // Generate pixel grids for all containers with 10 columns
  animatePixelGrid(pixelsData as any) // Animate the pixel grids
}
