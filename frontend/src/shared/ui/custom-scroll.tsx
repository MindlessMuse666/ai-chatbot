'use client'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { ReactNode } from 'react'

interface CustomScrollProps {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
  scrollableNodeProps?: React.HTMLAttributes<HTMLDivElement>
  forwardedRef?: React.RefObject<HTMLDivElement>
  onScroll?: () => void
}

const CustomScroll = ({ 
  children, 
  className, 
  style, 
  scrollableNodeProps,
  forwardedRef,
  onScroll
}: CustomScrollProps) => {
  return (
    <SimpleBar
      className={className}
      style={style}
      scrollableNodeProps={{
        ...scrollableNodeProps,
        ref: forwardedRef,
        onScroll: onScroll
      }}
    >
      {children}
    </SimpleBar>
  )
}


export default CustomScroll 