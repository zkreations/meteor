const SKELETON_CONFIG = {
  selectors: {
    renderZone: '.render-zone',
    sourceSlotSvg: '.source-slot',
  },
  random: {
    candidates: [
      'astro',
      'github',
      'shrimp',
      'meteor',
      'app-store',
      'discord',
      'figma',
      'dribbble',
      'github-copilot',
      'openai',
      'tiktok',
      'visual-studio-code',
      'vk',
      'twitch',
      'newspaper',
      'brush',
      'eye',
      'gear',
      'sticker',
      'gamepad-modern',
      'carrot',
      'broom',
      'microchip',
      'laravel',
      'language',
      'bullhorn',
      'gumroad',
    ],
  },
  output: {
    width: '100%',
    height: '100%',
    preserveAspectRatio: 'xMidYMid meet',
  },
  classes: {
    parent: 'opacity-0 transition-opacity duration-1000',
    parentVisible: 'opacity-100',
    path: 'stroke-slate-900/40',
    nonPath: 'stroke-teal-500/90',
    handle: 'stroke-slate-900/40',
    node: 'fill-slate-900',
    control: 'fill-slate-100 stroke-slate-900/65'
  },
  scale: {
    anchorRadius: 0.018,
    controlRadius: 0.016,
    pathStroke: 0.01,
    handleWidth: 0.01,
    controlStrokeFactor: 0.7,
  },
  source: {
    ignoredAttributes: ['fill', 'stroke', 'stroke-width', 'style', 'class'],
    shapeTags: ['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon'],
    nonPathTags: ['rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon'],
  },
} as const

const PATH_CMD_RE = /^[MmZzLlHhVvCcSsQqTtAa]$/
const PATH_TOKEN_RE = /([MmZzLlHhVvCcSsQqTtAa])|([-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?)/g
const SOURCE_IGNORED_ATTRS = new Set<string>(SKELETON_CONFIG.source.ignoredAttributes)

type NumberLike = string | number
type SvgTagName = keyof SVGElementTagNameMap
type SkeletonShapeTag = (typeof SKELETON_CONFIG.source.shapeTags)[number]

type ScaleMetrics = {
  pathStrokeWidth: number
  anchorRadius: number
  controlRadius: number
  handleWidth: number
  controlStrokeWidth: number
}

type PathPointHandlers = {
  addAnchor: (x: number, y: number) => void
  addControl: (x: number, y: number) => void
  addHandle: (x1: number, y1: number, x2: number, y2: number) => void
}

const createSvgEl = <K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs?: Record<string, NumberLike>,
): SVGElementTagNameMap[K] => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, String(value))
    }
  }
  return el
}

const isFinitePoint = (...values: number[]): boolean => values.every(Number.isFinite)

const tokenizePathData = (d: string): string[] => {
  const tokens: string[] = []
  let match: RegExpExecArray | null
  while ((match = PATH_TOKEN_RE.exec(d)) !== null) {
    tokens.push(match[1] ?? match[2])
  }
  return tokens
}

const parseViewBox = (svg: SVGElement): [number, number, number, number] => {
  const raw = svg
    .getAttribute('viewBox')
    ?.trim()
    .split(/[\s,]+/)
    .map(Number) ?? [0, 0, 24, 24]

  return [raw[0] ?? 0, raw[1] ?? 0, raw[2] ?? 24, raw[3] ?? 24]
}

const ensureViewBox = (svg: SVGElement): void => {
  if (svg.getAttribute('viewBox')) return
  const width = parseFloat(svg.getAttribute('width') || '24')
  const height = parseFloat(svg.getAttribute('height') || '24')
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
}

const getScaleMetrics = (scale: number): ScaleMetrics => ({
  pathStrokeWidth: scale * SKELETON_CONFIG.scale.pathStroke,
  anchorRadius: scale * SKELETON_CONFIG.scale.anchorRadius,
  controlRadius: scale * SKELETON_CONFIG.scale.controlRadius,
  handleWidth: scale * SKELETON_CONFIG.scale.handleWidth,
  controlStrokeWidth: scale * SKELETON_CONFIG.scale.handleWidth * SKELETON_CONFIG.scale.controlStrokeFactor,
})

const copyShape = (
  source: Element,
  tag: SvgTagName,
  targetLayer: SVGGElement,
  className?: string,
): void => {
  const copy = createSvgEl(tag)

  for (const { name, value } of Array.from(source.attributes)) {
    if (!SOURCE_IGNORED_ATTRS.has(name)) copy.setAttribute(name, value)
  }

  if (className) {
    copy.setAttribute('class', className)
  }

  targetLayer.appendChild(copy)
}

const copySourceShapes = (sourceSvg: SVGElement, layer: SVGGElement): void => {
  SKELETON_CONFIG.source.shapeTags.forEach((tag: SkeletonShapeTag) => {
    const className = tag === 'path' ? undefined : SKELETON_CONFIG.classes.nonPath
    sourceSvg
      .querySelectorAll(tag)
      .forEach((el) => copyShape(el, tag, layer, className))
  })
}

const parsePathData = (d: string, handlers: PathPointHandlers): void => {
  const tokens = tokenizePathData(d)
  const isCmd = (token: string | undefined): boolean => PATH_CMD_RE.test(String(token))

  let i = 0
  let cx = 0
  let cy = 0
  let sx = 0
  let sy = 0
  let prevCPX: number | null = null
  let prevCPY: number | null = null
  let prevCPType: 'C' | 'Q' | null = null

  const resetControlPoint = (): void => {
    prevCPX = null
    prevCPY = null
    prevCPType = null
  }

  const readNumber = (): number => parseFloat(tokens[i++])

  const readArcFlag = (): number => {
    const token = tokens[i]
    if (token == null || isCmd(token)) return Number.NaN

    if (token === '0' || token === '1') {
      i += 1
      return Number(token)
    }

    if (/^[01].+/.test(token)) {
      const first = token[0]
      const rest = token.slice(1)
      if (rest.length > 0) {
        tokens[i] = rest
      } else {
        i += 1
      }
      return Number(first)
    }

    i += 1
    return parseFloat(token)
  }

  const hasMore = (): boolean => i < tokens.length && !isCmd(tokens[i])

  while (i < tokens.length) {
    if (!isCmd(tokens[i])) {
      i += 1
      continue
    }

    const cmd = tokens[i++]
    const relative = cmd !== cmd.toUpperCase() && cmd.toLowerCase() !== 'z'
    const op = cmd.toUpperCase()

    const absX = (value: number): number => (relative ? cx + value : value)
    const absY = (value: number): number => (relative ? cy + value : value)

    if (op === 'M') {
      cx = absX(readNumber())
      cy = absY(readNumber())
      sx = cx
      sy = cy
      handlers.addAnchor(cx, cy)
      resetControlPoint()

      while (hasMore()) {
        cx = absX(readNumber())
        cy = absY(readNumber())
        handlers.addAnchor(cx, cy)
        resetControlPoint()
      }
      continue
    }

    if (op === 'Z') {
      cx = sx
      cy = sy
      resetControlPoint()
      continue
    }

    if (op === 'L') {
      while (hasMore()) {
        cx = absX(readNumber())
        cy = absY(readNumber())
        handlers.addAnchor(cx, cy)
        resetControlPoint()
      }
      continue
    }

    if (op === 'H') {
      while (hasMore()) {
        cx = relative ? cx + readNumber() : readNumber()
        handlers.addAnchor(cx, cy)
        resetControlPoint()
      }
      continue
    }

    if (op === 'V') {
      while (hasMore()) {
        cy = relative ? cy + readNumber() : readNumber()
        handlers.addAnchor(cx, cy)
        resetControlPoint()
      }
      continue
    }

    if (op === 'C') {
      while (hasMore()) {
        const ox = cx
        const oy = cy
        const c1x = relative ? ox + readNumber() : readNumber()
        const c1y = relative ? oy + readNumber() : readNumber()
        const c2x = relative ? ox + readNumber() : readNumber()
        const c2y = relative ? oy + readNumber() : readNumber()
        const ex = relative ? ox + readNumber() : readNumber()
        const ey = relative ? oy + readNumber() : readNumber()

        handlers.addHandle(cx, cy, c1x, c1y)
        handlers.addHandle(ex, ey, c2x, c2y)
        handlers.addControl(c1x, c1y)
        handlers.addControl(c2x, c2y)
        handlers.addAnchor(ex, ey)

        cx = ex
        cy = ey
        prevCPX = c2x
        prevCPY = c2y
        prevCPType = 'C'
      }
      continue
    }

    if (op === 'S') {
      while (hasMore()) {
        const ox = cx
        const oy = cy
        const c2x = relative ? ox + readNumber() : readNumber()
        const c2y = relative ? oy + readNumber() : readNumber()
        const ex = relative ? ox + readNumber() : readNumber()
        const ey = relative ? oy + readNumber() : readNumber()

        const c1x = prevCPType === 'C' && prevCPX != null ? 2 * cx - prevCPX : cx
        const c1y = prevCPType === 'C' && prevCPY != null ? 2 * cy - prevCPY : cy

        handlers.addHandle(cx, cy, c1x, c1y)
        handlers.addHandle(ex, ey, c2x, c2y)
        handlers.addControl(c2x, c2y)
        handlers.addAnchor(ex, ey)

        cx = ex
        cy = ey
        prevCPX = c2x
        prevCPY = c2y
        prevCPType = 'C'
      }
      continue
    }

    if (op === 'Q') {
      while (hasMore()) {
        const ox = cx
        const oy = cy
        const qx = relative ? ox + readNumber() : readNumber()
        const qy = relative ? oy + readNumber() : readNumber()
        const ex = relative ? ox + readNumber() : readNumber()
        const ey = relative ? oy + readNumber() : readNumber()

        handlers.addHandle(cx, cy, qx, qy)
        handlers.addHandle(ex, ey, qx, qy)
        handlers.addControl(qx, qy)
        handlers.addAnchor(ex, ey)

        cx = ex
        cy = ey
        prevCPX = qx
        prevCPY = qy
        prevCPType = 'Q'
      }
      continue
    }

    if (op === 'T') {
      while (hasMore()) {
        const ox = cx
        const oy = cy
        const ex = relative ? ox + readNumber() : readNumber()
        const ey = relative ? oy + readNumber() : readNumber()

        const qx = prevCPType === 'Q' && prevCPX != null ? 2 * cx - prevCPX : cx
        const qy = prevCPType === 'Q' && prevCPY != null ? 2 * cy - prevCPY : cy

        handlers.addHandle(cx, cy, qx, qy)
        handlers.addHandle(ex, ey, qx, qy)
        handlers.addControl(qx, qy)
        handlers.addAnchor(ex, ey)

        cx = ex
        cy = ey
        prevCPX = qx
        prevCPY = qy
        prevCPType = 'Q'
      }
      continue
    }

    if (op === 'A') {
      while (hasMore()) {
        const ox = cx
        const oy = cy
        const rx = readNumber()
        const ry = readNumber()
        const rotation = readNumber()
        const largeArc = readArcFlag()
        const sweep = readArcFlag()
        const ex = relative ? ox + readNumber() : readNumber()
        const ey = relative ? oy + readNumber() : readNumber()

        if (!isFinitePoint(rx, ry, rotation, largeArc, sweep, ex, ey)) {
          resetControlPoint()
          break
        }

        cx = ex
        cy = ey
        handlers.addAnchor(cx, cy)
        resetControlPoint()
      }
      continue
    }
  }
}

class SvgSkeleton extends HTMLElement {
  connectedCallback(): void {
    this.render()
  }

  private render(): void {
    const zone = this.querySelector<HTMLDivElement>(SKELETON_CONFIG.selectors.renderZone)
    if (!zone) return
    zone.replaceChildren()

    const sourceSlot = this.querySelector<HTMLElement>(SKELETON_CONFIG.selectors.sourceSlotSvg)

    const randomCandidates = SKELETON_CONFIG.random.candidates
    if (sourceSlot && randomCandidates.length > 0) {
      const name = randomCandidates[Math.floor(Math.random() * randomCandidates.length)]
      const randomSvg = document.querySelector<SVGElement>(`[data-name="${name}"] .icon-preview svg`)

      if (randomSvg) {
        const skeletonSource = randomSvg.cloneNode(true) as SVGElement
        skeletonSource.removeAttribute('class')
        skeletonSource.removeAttribute('style')
        sourceSlot.replaceChildren(skeletonSource)
      }
    }

    const rawSvg = sourceSlot?.innerHTML.trim() || ''
    if (!rawSvg) return

    const parsed = new DOMParser().parseFromString(rawSvg, 'image/svg+xml')
    const sourceSvg = parsed.querySelector('svg')
    if (!sourceSvg) return

    ensureViewBox(sourceSvg)
    const [vbMinX, vbMinY, vbW, vbH] = parseViewBox(sourceSvg)
    const scale = Math.max(vbW, vbH)
    const metrics = getScaleMetrics(scale)

    const svg = createSvgEl('svg', {
      class: SKELETON_CONFIG.classes.parent,
      viewBox: `${vbMinX} ${vbMinY} ${vbW} ${vbH}`,
      width: SKELETON_CONFIG.output.width,
      height: SKELETON_CONFIG.output.height,
      preserveAspectRatio: SKELETON_CONFIG.output.preserveAspectRatio,
      overflow: 'visible',
    })

    const strokeLayer = createSvgEl('g', {
      fill: 'none',
      class: SKELETON_CONFIG.classes.path,
      'stroke-width': metrics.pathStrokeWidth,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    })

    copySourceShapes(sourceSvg, strokeLayer)
    svg.appendChild(strokeLayer)

    const handleLayer = createSvgEl('g')
    const nodeLayer = createSvgEl('g')

    const handlers: PathPointHandlers = {
      addAnchor: (x, y) => {
        if (!isFinitePoint(x, y)) return
        nodeLayer.appendChild(
          createSvgEl('circle', {
            cx: x,
            cy: y,
            r: metrics.anchorRadius,
            class: SKELETON_CONFIG.classes.node,
          }),
        )
      },
      addControl: (x, y) => {
        if (!isFinitePoint(x, y)) return
        nodeLayer.appendChild(
          createSvgEl('circle', {
            cx: x,
            cy: y,
            r: metrics.controlRadius,
            class: SKELETON_CONFIG.classes.control,
            'stroke-width': metrics.controlStrokeWidth,
          }),
        )
      },
      addHandle: (x1, y1, x2, y2) => {
        if (!isFinitePoint(x1, y1, x2, y2)) return
        handleLayer.appendChild(
          createSvgEl('line', {
            x1,
            y1,
            x2,
            y2,
            class: SKELETON_CONFIG.classes.handle,
            'stroke-width': metrics.handleWidth,
          }),
        )
      },
    }

    sourceSvg.querySelectorAll('path').forEach((pathEl) => {
      parsePathData(pathEl.getAttribute('d') || '', handlers)
    })

    svg.appendChild(handleLayer)
    svg.appendChild(nodeLayer)
    zone.appendChild(svg)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        svg.classList.add(SKELETON_CONFIG.classes.parentVisible)
      })
    })
  }
}

if (!customElements.get('svg-skeleton')) {
  customElements.define('svg-skeleton', SvgSkeleton)
}
