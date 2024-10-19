import { gsap } from 'gsap'
import * as THREE from 'three'

const name = "[data-section='pixels']"

const anim_sectionPixels = (_ctx: any) => {
  const sections = gsap.utils.toArray(name) as HTMLElement[]
  if (!sections.length) return

  sections.forEach((section) => {
    if (!section) {
      console.error('Section not found!')
      return
    }

    const pixelNumber = section.dataset.pixelSize || 35
    const coloStart = Number(section.dataset.colorStart) || 0x000000
    const coloEnd = Number(section.dataset.colorEnd) || 0xffffff

    // Create a canvas element for each section
    const canvas = document.createElement('canvas')
    section.appendChild(canvas)

    // Create the scene, camera, and renderer for each section
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      section.clientWidth / section.clientHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    })

    // Set renderer size to match the section
    renderer.setSize(section.clientWidth, section.clientHeight)
    renderer.setClearColor(0x000000, 0) // Transparent background

    // Calculate the number of pixels
    const numPixelsX = Math.floor(section.clientWidth / 20)
    const numPixelsY = Math.floor(section.clientHeight / 20)

    // Create a pixelation shader material
    const pixelationShader = {
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new THREE.Vector2(section.clientWidth, section.clientHeight)
        },
        uPixelSize: { value: pixelNumber }, // Adjust this for pixel size
        uColorStart: { value: new THREE.Color(coloStart) }, // Start color (black)
        uColorEnd: { value: new THREE.Color(coloEnd) } // End color (white),
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uPixelSize;
        uniform vec3 uColorStart;
        uniform vec3 uColorEnd;
        uniform float uTime;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float random(vec2 st) {
          return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }

        void main() {
          vec2 pixelSize = uPixelSize / uResolution;
          vec2 pixelatedUv = floor(vUv / pixelSize) * pixelSize;

          float timeOffset = random(pixelatedUv) * 2.0;
          float t = mod(uTime * 0.001 + timeOffset, 1.0);

          vec3 color = mix(uColorStart, uColorEnd, t);

          gl_FragColor = vec4(color, 1.0);
        }
      `
    }

    const shaderMaterial = new THREE.ShaderMaterial(pixelationShader)

    // Create a plane geometry for each section
    const geometry = new THREE.PlaneGeometry(numPixelsX, numPixelsY)
    const plane = new THREE.Mesh(geometry, shaderMaterial)
    scene.add(plane)

    camera.position.z = 5

    // Handle window resizing and section resize
    window.addEventListener('resize', () => {
      const width = section.clientWidth
      const height = section.clientHeight

      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()

      // Update the shader's resolution uniform
      shaderMaterial.uniforms.uResolution.value.set(width, height)
    })

    // Animation loop
    function animate(time: number) {
      shaderMaterial.uniforms.uTime.value = time
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    animate(0)
  })
}

export default anim_sectionPixels
