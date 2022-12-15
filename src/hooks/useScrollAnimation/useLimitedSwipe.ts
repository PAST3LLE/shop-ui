import { useDrag } from '@use-gesture/react'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { DOMAttributes, useRef, useState } from 'react'
import { useSprings } from 'react-spring'
import useScrollZoneRefs from './utils/useScrollZoneRef'
import { AxisDirection, SizeOptions } from './types'
import utils from './utils/utils'
interface Options {
  sensitivity: number
  sizeOptions?: SizeOptions
}

export interface SpringAnimationHookReturn {
  bind: (...args: any[]) => DOMAttributes<any>
  springs: ReturnType<typeof useSprings>[0]
  state: {
    currentIndex: number
    itemSize: number
  }
  refCallbacks: {
    setScrollingZoneRef: (newNode: any) => void
    setItemSizeRef: (newNode: any) => void
  }
}

export function useLimitedSwipe(axis: AxisDirection, data: any[], options?: Options): SpringAnimationHookReturn {
  const {
    refs: { itemSize },
    refCallbacks
  } = useScrollZoneRefs(axis, options?.sizeOptions || { minSize: STORE_IMAGE_SIZES.SMALL })

  const indexRef = useRef(0)
  const [indexState, setIndexState] = useState(indexRef.current)

  const [springs, api] = useSprings(
    data.length,
    i => ({
      [axis]: i * itemSize,
      display: 'block'
    }),
    [itemSize]
  )

  const bind = useDrag(
    utils.drag.limited([, api], {
      axis,
      indexOptions: { current: indexRef, setIndex: setIndexState, last: data.length - 1 },
      itemSize
    }),
    { axis }
  )

  return {
    bind,
    springs,
    state: { currentIndex: indexState, itemSize },
    refCallbacks
  }
}

export function useLimitedHorizontalSwipe(data: any[], options?: Options): SpringAnimationHookReturn {
  return useLimitedSwipe('x', data, options)
}

export function useLimitedVerticalSwipe(data: any[], options?: Options): SpringAnimationHookReturn {
  return useLimitedSwipe('y', data, options)
}