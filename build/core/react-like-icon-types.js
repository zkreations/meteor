export function buildReactCreateIconTypesSource() {
  return `import type * as React from 'react'

export type IconAttrs = Record<string, string | number | boolean>

export interface IconNode {
  tag: string
  attrs: IconAttrs
  children?: IconNode[]
}

export interface MeteorIconProps extends Omit<React.SVGProps<SVGSVGElement>, 'color'> {
  size?: string | number
  strokeWidth?: string | number
  color?: string
}

export type MeteorIconComponent = React.ForwardRefExoticComponent<
  MeteorIconProps & React.RefAttributes<SVGSVGElement>
>

export declare function createIcon(iconName: string, iconNode: IconNode[]): MeteorIconComponent
`
}

export function buildPreactCreateIconTypesSource() {
  return `import type { JSX } from 'preact'
import type { Ref } from 'preact'

export type IconAttrs = Record<string, string | number | boolean>

export interface IconNode {
  tag: string
  attrs: IconAttrs
  children?: IconNode[]
}

export interface MeteorIconProps extends Omit<JSX.SVGAttributes<SVGSVGElement>, 'color'> {
  size?: string | number
  strokeWidth?: string | number
  color?: string
}

export type MeteorIconComponent = (props: MeteorIconProps & { ref?: Ref<SVGSVGElement> }) => JSX.Element

export declare function createIcon(iconName: string, iconNode: IconNode[]): MeteorIconComponent
`
}
