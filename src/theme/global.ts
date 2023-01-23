import { createGlobalStyle } from 'styled-components/macro'

export const CustomStaticGlobalCSSProvider = createGlobalStyle`
  body {
    > div#root {
      height: 100vh;
    }
  }
`

export const CustomThemedGlobalCSSProvider = createGlobalStyle`
  body {
    color: ${({ theme }) => theme.white};
  }
`
