import { Z_INDEXES } from '@/constants/config'
import { createGlobalStyle } from 'styled-components/macro'

export const CustomStaticGlobalCSSProvider = createGlobalStyle`
  :root {
    --toastify-z-index: ${Z_INDEXES.HEADER - 10};
    }
    
    html, body {
      font-family: 'Roboto Flex', system-ui;
      font-variation-settings: 'wght' 300;
      }
      
      body {
        overflow: hidden;
        
      .pastelle-toast {
        background: black;
        font-size: 2.2rem;
        color: ghostwhite;
        svg {
          color: ghostwhite;
        }
      }
    
    > div#__next {
      // height: calc(18rem + 100vh);
      height: 100vh;
      display: grid;
      grid-template:
          "header header"
          "nav main" 1fr
          "footer footer" / minmax(auto, max-content) 5fr;
      overflow: hidden;

      a {
        color: ${(props) => props.theme.purple};
      }

      header {
        display: grid;
        grid-template-columns: 1fr;
        -webkit-box-pack: justify;
        justify-content: space-between;
        -webkit-box-align: center;
        align-items: center;
        flex-direction: row;
        width: 100%;
        position: relative;
        padding: 1rem;
        z-index: 2;
      }
    }
  }
`

export const CustomThemedGlobalCSSProvider = createGlobalStyle`
  body {
    color: ${({ theme }) => theme.white};
  }
`
