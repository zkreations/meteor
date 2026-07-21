// Clone an SVG element, stripping presentation attributes and applying a fixed size.
// @param svg - The SVG element to clone
// @param size - Optional width/height to set on the clone (omit to keep original)
export function cloneSvg(svg: SVGElement, size?: number): SVGElement {
  const clone = svg.cloneNode(true) as SVGElement
  clone.removeAttribute('style')
  clone.classList.remove('!hidden')
  clone.querySelectorAll('*').forEach(el => el.removeAttribute('style'))
  if (size !== undefined) {
    clone.setAttribute('width', String(size))
    clone.setAttribute('height', String(size))
  }
  return clone
}

// Render an SVG element to a PNG blob at the given size via a canvas.
// @param svg - The SVG element to rasterize
// @param size - The output canvas dimension (square)
// @returns A Promise resolving to the PNG Blob, or null on failure
export function svgToPng(svg: SVGElement, size: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    const markup = new XMLSerializer().serializeToString(svg)
    const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml' }))
    const image = new Image()

    image.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        URL.revokeObjectURL(svgUrl)
        resolve(null)
        return
      }
      ctx.drawImage(image, 0, 0, size, size)
      URL.revokeObjectURL(svgUrl)
      canvas.toBlob(resolve, 'image/png')
    }

    image.onerror = () => {
      URL.revokeObjectURL(svgUrl)
      resolve(null)
    }

    image.src = svgUrl
  })
}

// Create an SVG path string for a grid pattern of the specified length.
// @param length - The number of grid lines in each direction
export function createGridPath(length: number): string {
  return Array.from({ length }, (_, i) => {
    const pos = (i + 1) * 10
    return `M0 ${pos}H240 M${pos} 0V240`
  }).join(' ')
}
