import styled from 'styled-components/macro'
import { setBackgroundWithDPI } from 'theme/utils'
import { setFadeInAnimation } from 'theme/styles/animations'
import { ThemeModes } from 'theme/styled'
import { GenericImageSrcSet } from 'utils/types'
import { BoxProps } from 'rebass'

export const portugalBg = `https://ik.imagekit.io/portugal-bg_Rqj8jTKhFmds.jpg`

const LOGO_SET = [
  { defaultUrl: portugalBg } as GenericImageSrcSet,
  { defaultUrl: portugalBg } as GenericImageSrcSet,
  { defaultUrl: portugalBg } as GenericImageSrcSet
]

export const ArticleFadeInContainer = styled.article<{ display?: BoxProps['display'] }>`
  ${({ display }) => display && `display: ${display};`}
  position: relative;
  overflow: hidden;

  ${({ theme }) =>
    setBackgroundWithDPI(theme, LOGO_SET, {
      dpiLevel: '1x',
      lqIkUrlOptions: {
        transforms: [
          (width?: number) => `pr-true,q-30${width && `,w-${width}`}`,
          (width?: number) => `pr-true,q-30${width && `,w-${width}`}`,
          'pr-true,q-10,w-10,h-10'
        ]
      },
      backgroundAttributes: ['center/contain no-repeat', '-1px -1px/contain repeat', 'center/cover no-repeat'],
      backgroundBlendMode: theme.mode === ThemeModes.DARK ? 'difference' : 'unset'
    })}

  // required for fade in animation
  filter: contrast(1) blur(0px);
  ${setFadeInAnimation()}
`
/* 
setCssBackground(theme, {
      imageUrls: [
        { defaultUrl: portugalBg + 'q-40' } as GenericImageSrcSet,
        { defaultUrl: portugalBg + 'q-40' } as GenericImageSrcSet,
        { defaultUrl: portugalBg + 'q-20,w-10,h-10' } as GenericImageSrcSet
      ],
      backgroundAttributes: ['center/contain no-repeat', '-1px -1px/contain repeat', 'center/cover no-repeat'],
      backgroundBlendMode: theme.mode === ThemeModes.DARK ? 'difference' : 'unset',
      skipIk: true
    })}}
*/
