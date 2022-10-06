import styled from 'styled-components/macro'
import { setCssBackground, upToExtraSmall } from 'theme/utils'
import { setFadeInAnimation } from 'theme/styles/animations'

const portugalBg = `${process.env.REACT_APP_IMAGEKIT_URL_ENDPOINT}/portugal-bg_Rqj8jTKhFmds.jpg`

export const ArticleFadeInContainer = styled.article`
  position: relative;
  overflow: hidden;

  ${upToExtraSmall`
    padding-bottom: 4rem;
  `}

  ${({ theme }) =>
    setCssBackground(theme, {
      isLogo: false,
      imageUrls: [portugalBg, portugalBg],
      backgroundAttributes: ['center/contain', 'center/contain'],
      backgroundBlendMode: 'none'
    })}}
  
  filter: contrast(1) blur(0px);
  ${setFadeInAnimation()}
`
