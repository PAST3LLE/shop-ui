import styled from 'styled-components/macro'
import Button from 'components/Button'
import { MobileNavProps } from '.'
import { Z_INDEXES } from 'constants/config'

export const NavigationStepsWrapper = styled.nav<{ isOpen?: boolean; width?: string; minWidth?: string }>`
  width: ${({ width = 'auto' }) => width};
  ${({ minWidth }) => minWidth && `min-width: ${minWidth};`}
  display: flex;
  flex-flow: column nowrap;
  justify-content: start;
  align-items: start;

  text-align: left;

  padding: 10px;
  gap: 0px;

  // all links in nav
  > a {
    font-size: 1.6rem;
  }

  z-index: ${Z_INDEXES.NAV_MENU};

  ${({ theme, isOpen }) => theme.mediaWidth.upToMedium`
    display: ${isOpen ? 'flex' : 'none'};
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    width: ${isOpen ? '100%' : 0};
    opacity: ${isOpen ? 1 : 0};
  `}
`

export const MobileNavOrb = styled(Button)<MobileNavProps & { mobileHide?: boolean }>`
  display: none;
  background: ${({ theme, bgColor = theme.red2 }) => bgColor};
  color: ${({ theme }) => theme.white};
  cursor: pointer;
  z-index: ${Z_INDEXES.NAV_MENU + 1};
  gap: 5px;

  > div {
    display: flex;
    padding: 10px;
    background: #000;

    border-radius: 10px;

    > svg {
      &:hover {
        transform: rotateZ(180deg);
      }
      transition: transform 0.5s ease-in-out;
    }
  }

  ${({ theme, mobileHide }) => theme.mediaWidth.upToMedium`
    display: ${mobileHide ? 'none' : 'flex'};
    position: relative;
    bottom: 0; right: 0; margin: 10px;  
    justify-content: center;
    align-items: center;

    margin-left: auto;
  `};
`

export const CatalogLabel = styled.span<{ active: boolean }>`
  font-weight: ${({ active }) => (active ? 700 : 400)};
  ${({ active }) =>
    active &&
    `
      text-decoration: line-through;
      text-decoration-thickness: from-font;
      font-size: larger;
      // filter: blur(1.2px);
    `}
`

export const SideEffectNavLink = styled.span`
  cursor: pointer;
`

export const NavLinkWrapper = styled.div`
  width: 100%;
  background: #1d1d1d;
  padding: 10px;
`