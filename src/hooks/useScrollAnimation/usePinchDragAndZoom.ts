import { useGesture } from '@use-gesture/react'
import { STORE_IMAGE_SIZES } from 'constants/config'
import { useSprings } from 'react-spring'
import { SizeOptions } from './types'
import { SpringAnimationHookReturn } from './useLimitedSwipe'
import useScrollZoneRefs from './utils/useScrollZoneRef'
import utils from './utils/utils'
interface Options {
  sensitivity: number
  sizeOptions?: SizeOptions
}
export function usePinchZoomAndDrag(data: any[], options?: Options): SpringAnimationHookReturn {
  const {
    refs: { itemSize, scrollingZoneTarget: ref },
    refCallbacks
  } = useScrollZoneRefs('x', options?.sizeOptions || { minSize: STORE_IMAGE_SIZES.SMALL })

  const [springs, api] = useSprings(
    data.length,
    i => ({
      x: i * itemSize,
      y: 0,
      scale: 1,
      display: 'block'
    }),
    [data.length]
  )

  const bind = useGesture(
    {
      onDrag: ({ pinching, cancel, offset: [x, y] }) => {
        if (pinching) return cancel()
        api.start({ x, y })
      },
      onPinch: utils.pinch.zoom([springs, api], { ref })
    },
    {
      drag: { from: () => [springs[0].x.get(), springs[0].y.get()], bound: ref?.getBoundingClientRect() },
      pinch: { scaleBounds: { min: 0.8, max: 3 }, rubberband: true }
    }
  )

  return {
    bind,
    springs,
    state: { currentIndex: 0, itemSize },
    refCallbacks
  }
}