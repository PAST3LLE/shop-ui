import { Footer as PSTLFooter } from '@past3lle/components'
import { fromExtraSmall, upToSmall } from '@past3lle/theme'
import { ShoppingCartHeader } from '@/components/ShoppingCart/ShoppingCart'
import { ShoppingCartFullWrapper } from '@/components/ShoppingCart/styled'
import ThemeToggleBar from '@/components/ThemeToggler'
import { Z_INDEXES } from '@/constants/config'
import { LAYOUT_REM_HEIGHT_MAP } from '@/constants/sizes'
import styled from 'styled-components/macro'

const FooterWrapper = styled(PSTLFooter)`
  display: none;

  ${upToSmall`
    display: flex;
    position: fixed;
    height: ${LAYOUT_REM_HEIGHT_MAP.FOOTER}rem;
    bottom: 0;
    padding: 1rem;
    background-color: rgb(34 12 61 / 86%);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    z-index: ${Z_INDEXES.HEADER + 10};
    > ${ShoppingCartFullWrapper} {
      margin-left: auto;
    }
  `}

  ${fromExtraSmall`
    z-index: 1;
    > ${ShoppingCartFullWrapper} {
      display: none;
    }
  `}
`

function Footer() {
  return (
    <FooterWrapper as="footer">
      {/* <NavLogo parentNode={node} logoSrcSet={headerLogoSet} /> */}
      <ThemeToggleBar
        themeToggleProps={{
          margin: '0 auto 0 0',
          width: '10rem',
        }}
      />
      <ShoppingCartHeader />
    </FooterWrapper>
  )
}

export default Footer
