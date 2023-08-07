import { useIsMobile } from '@past3lle/hooks'
import { TinyHelperText } from 'components/Common'
import { Text as TYPE } from 'components/Text'
import { SHOWCASE_ENABLED, Z_INDEXES } from 'constants/config'
import { ProductSubDescription } from 'pages/common/styleds'
import { ReactNode, useCallback, useState } from 'react'

export default function useShowShowcase() {
  const isMobile = useIsMobile()
  const [showShowcase, setShowShowcase] = useState(false)
  const toggleShowcase = () => setShowShowcase((state) => !state)

  const ShowcaseSettings = useCallback(
    ({ children }: { children?: ReactNode }) => (
      <ProductSubDescription
        padding={`5rem 1.3rem ${SHOWCASE_ENABLED ? '0.3rem' : '2rem'}`}
        margin="-4rem auto 2rem"
        width="100%"
        fontWeight={300}
        fontSize="1.2rem"
        style={{
          flexFlow: 'column nowrap',
          alignItems: 'flex-start',
          zIndex: Z_INDEXES.ZERO,
        }}
      >
        {children}
        {SHOWCASE_ENABLED && (
          <TinyHelperText
            handleClick={toggleShowcase}
            label={showShowcase ? 'HIDE HOW-TO GUIDE' : 'SHOW HOW-TO GUIDE'}
            css={`
              padding: 0 1rem 1rem;
            `}
          />
        )}
        {showShowcase && (
          <TYPE.Black
            style={{
              backgroundColor: 'lightgoldenrodyellow',
              borderRadius: '1rem',
              padding: '1rem',
              margin: '-1rem 0 1rem',
              width: '100%',
            }}
          >
            Use the <strong>GENDER</strong> + <strong>HEIGHT</strong> filters above to view selected size worn on
            different sized/gender models.
            <br />
            <p>e.g</p>
            a. <strong>FEMALE</strong> model, <strong>175cm</strong> tall, wearing size <strong>L</strong>
            <br />
            b. <strong>MALE</strong> model, <strong>185cm</strong> tall, wearing size <strong>XL</strong>
            <p>Available filters below. Changes automatically update showcase videos.</p>
            <p>
              {isMobile ? 'Tap the video anywhere' : 'Click the gray button in the upper right hand corner'} to
              play/pause
            </p>
          </TYPE.Black>
        )}
      </ProductSubDescription>
    ),
    [isMobile, showShowcase]
  )

  return {
    ShowcaseSettings,
    toggleShowcase,
    showShowcase,
  }
}
