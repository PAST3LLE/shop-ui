import { AnimatedDivContainer } from 'components/ScrollingContentPage/styleds'
import { CarouselIndicators, CarouselStep } from '../common'
import { useCarouselSetup } from '../hooks'
import { CarouselContainer } from './styleds'
import { BaseAnimatedCarouselProps } from '../types'

export default function AnimatedCarousel({
  data,
  animationProps,
  fixedSizes,
  accentColor,
  touchAction,
  children
}: BaseAnimatedCarouselProps) {
  const { parentWidth, imageTransformations, setCarouselContainerRef } = useCarouselSetup({
    fixedSizes
  })

  const {
    bind,
    springs,
    state: { currentIndex, itemSize: width },
    refCallbacks: { setItemSizeRef, setScrollingZoneRef }
  } = animationProps

  return (
    <CarouselContainer
      id="#carousel-container"
      ref={node => {
        setCarouselContainerRef(node)
        setItemSizeRef(node)
      }}
      $fixedHeight={(fixedSizes?.fixedHeight || parentWidth) + 'px'}
      $touchAction={touchAction}
    >
      <CarouselIndicators size={data.length} currentIndex={currentIndex} color={accentColor} />
      {/* CAROUSEL CONTENT */}
      {springs.map((props, index, { length }) => {
        if (!parentWidth) return null

        return (
          <AnimatedDivContainer
            {...bind(index)}
            key={index}
            ref={setScrollingZoneRef}
            style={{ width, ...props }}
            $borderRadius="0px"
            $withBoxShadow={false}
            $isVerticalScroll={false}
            $touchAction={touchAction}
          >
            <CarouselStep
              index={index}
              accentColor={accentColor}
              parentWidth={parentWidth}
              transformAmount={0}
              showButtons={false}
            >
              {children({ index, imageTransformations, isLast: index === length - 1 })}
            </CarouselStep>
          </AnimatedDivContainer>
        )
      })}
    </CarouselContainer>
  )
}
