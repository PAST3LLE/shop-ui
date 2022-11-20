import { Fragment, MouseEvent, useCallback, useEffect } from 'react'
import { FixedAnimatedLoader } from 'components/Loader'
import { ScrollingContentIndicator, ScrollingIndicatorParams } from 'components/ScrollingIndicator'
import { ScrollerContainer, AnimatedDivContainer, Scroller } from './styleds'

import PastelleIvoryOutlined from 'assets/svg/pastelle-ivory-outlined.svg'
import useScrollingPageAnimation from 'hooks/useScrollingPageAnimation'
import { LoadInView } from 'hooks/useDetectScrollIntoView'
import { COLLECTION_MAX_WIDTH } from 'constants/config'
import { isMobile } from 'utils'
import { Product } from 'shopify/graphql/types'

// TODO: bullshit
const HEADER_HEIGHT = 80
interface ScrollingContentPageParams<D> {
  data: D[]
  dataItem: D | undefined
  fixedItemHeight?: number
  hideHeight?: number
  showIndicator?: boolean
  useBoxShadow?: boolean
  onContentClick?: (handle?: string) => void // React.MouseEventHandler<HTMLDivElement>
  IterableComponent: (props: D & ScrollableContentComponentBaseProps) => JSX.Element
}

export interface ScrollableContentComponentBaseProps {
  itemIndex: number
  isActive: boolean
  firstPaintOver: boolean
  loadInView?: LoadInView
}

type Params<P> = ScrollingContentPageParams<P> & Omit<ScrollingIndicatorParams, 'isLastIndex'>

export function ScrollingContentPage<D>({
  data,
  dataItem,
  fixedItemHeight,
  showIndicator = true,
  useBoxShadow = false,
  onContentClick,
  IterableComponent,
  ...indicatorProps
}: Params<D>) {
  const {
    api,
    springs,
    target,
    itemHeight,
    currentIndex,
    firstPaintOver,
    setHeightRef,
    setScrollingZoneRef
  } = useScrollingPageAnimation(data, {
    visible: 2,
    fixedItemHeight,
    snapOnScroll: false,
    // defaults to 0.8 scale on scroll and 1 scale default
    scaleOptions: {
      initialScale: 0.92
      // scaleOnScroll: 0.55
    }
  })

  /**
   * Reference ELEM for which we:
   *
   * Set the target HEIGHT ref (sets the heights of scrolling article divs accordingly)
   * Set as the "loadInView" boundary - that is when elems scroll into it's view they are loaded
   */
  const HEIGHT_AND_VIEW_TARGET = document.getElementById('COLLECTION-ARTICLE')

  // set target ref node as collection article
  useEffect(() => {
    setHeightRef(HEIGHT_AND_VIEW_TARGET)
    !isMobile && setScrollingZoneRef(HEIGHT_AND_VIEW_TARGET)
  }, [HEIGHT_AND_VIEW_TARGET, setHeightRef, setScrollingZoneRef])

  const handleItemSelect = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!onContentClick) return
      const products = data as Product[]
      const halfHeight = itemHeight / 2
      const clickY = e.clientY - HEADER_HEIGHT - halfHeight
      const nextIdx = currentIndex < data.length - 1 ? currentIndex + 1 : 0
      const prevIdx = currentIndex === 0 ? data.length - 1 : currentIndex - 1
      const positions = {
        currItem: api.current[currentIndex].springs.y.get(),
        nextItem: api.current[nextIdx].springs.y.get(),
        prevItem: api.current[prevIdx].springs.y.get()
      }

      const clickedNext = positions.nextItem - halfHeight < clickY
      const clickedPrev =
        positions.prevItem + halfHeight - (target?.clientHeight ? target.clientHeight - itemHeight : itemHeight) / 2 >
        clickY

      return onContentClick(products[clickedNext ? nextIdx : clickedPrev ? prevIdx : currentIndex].handle)
    },
    [api, currentIndex, data, itemHeight, onContentClick, target]
  )

  if (!dataItem) return null

  return (
    <>
      <FixedAnimatedLoader
        showBg={false}
        loadingComponent={<img src={PastelleIvoryOutlined} />}
        left="50%"
        width="40vw"
      />
      {/* mobile only scrolling ref, using collection-article doesn't work on mobile */}
      {isMobile && <Scroller ref={setScrollingZoneRef} onClick={handleItemSelect} />}
      <ScrollerContainer>
        {springs.map(({ y, scale }, i) => {
          return (
            <AnimatedDivContainer
              key={y.id}
              style={{ scale, height: itemHeight, y }}
              $maxWidth={COLLECTION_MAX_WIDTH + 'px'}
              $useBoxShadow={useBoxShadow}
              onClick={isMobile ? undefined : () => onContentClick?.((data[i] as any).handle)}
            >
              {showIndicator && <ScrollingContentIndicator {...indicatorProps} />}
              <IterableComponent
                loadInView={{
                  container: HEIGHT_AND_VIEW_TARGET || document,
                  conditionalCheck: firstPaintOver
                }}
                firstPaintOver={firstPaintOver}
                isActive={currentIndex === i}
                itemIndex={currentIndex}
                key={i}
                {...data[i]}
              />
            </AnimatedDivContainer>
          )
        })}
      </ScrollerContainer>
    </>
  )
}
