import { useIsSmallMediaWidth } from '@past3lle/hooks'
import { WHITE } from '@past3lle/theme'
import LoadingRows from '@/components/Loader/LoadingRows'
import { PLACEHOLDER_HIGHLIGHT_COLOUR } from '@/constants/config'
import { ProductSubHeader } from '@/components/PagesComponents/styleds'
import { BaseProductPageProps } from '@/components/PagesComponents/types'
import { memo, useCallback, useState } from 'react'
import {
  // useCurrentCollection,
  useDeriveCurrentCollection,
  useGetCurrentOnScreenCollectionProduct,
  useGroupCollectionByType,
} from '@/state/collection/hooks'
import { URLFlowType } from '@/state/collection/types'
import { getFlowParams } from '@/state/collection/utils'
import { BLACK_TRANSPARENT_MOST } from '@/theme'
import { buildItemUrl } from '@/utils/navigation'

import packageJSON from '@/../package.json'
import { CollectionSelector } from './CollectionSelector'
import {
  CollectionLabel,
  ExternalLink,
  InnerNavWrapper,
  NavRowItem,
  NavigationStepsWrapper,
  PolicyColumnWrapper,
  SideEffectNavLink,
  StyledNav,
} from './styled'
import { useRouter } from 'next/router'
import { usePathname, useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const ThemeToggleBar = dynamic(
  () => import(/* webpackPrefetch: true,  webpackChunkName: "THEME_TOGGLE_BAR" */ '@/components/ThemeToggler'),
  { ssr: false },
)

interface InnerNavProps {
  isNavOpen: boolean
  toggleNav: () => void
}
export default function InnerNavigation({ isNavOpen, toggleNav }: InnerNavProps) {
  // check search params to show different nav menu
  const searchParams = useSearchParams()
  const isDirectReferralView = getFlowParams(searchParams ?? new URLSearchParams(''))
  // Policies open/close nav
  const [{ policies }, setPoliciesOpenState] = useState({
    policies: false,
  })

  const smallMedia = useIsSmallMediaWidth()

  // state collection data
  const collection = useDeriveCurrentCollection()

  // get page meta assets, check pathname
  const pathname = usePathname()
  const product = useGetCurrentOnScreenCollectionProduct(pathname)

  const { push: navigate } = useRouter()
  const handleNavMove = useCallback(
    (
      e: React.MouseEvent<HTMLElement, MouseEvent>,
      path: { product?: Pick<BaseProductPageProps, 'handle'>; other?: string },
    ) => {
      e.preventDefault()

      if (isNavOpen) toggleNav()

      navigate(path?.product?.handle ? buildItemUrl(path.product.handle) : (path?.other as string))
    },
    [navigate, isNavOpen, toggleNav],
  )

  // groups products by their product type
  // e.g { LONGSLEEVE: [VOODOO, VIRGIL] ... }
  const productTypeMap = useGroupCollectionByType(collection?.products)

  // check if on home page ("/"")
  // if so, dont render inner nav
  const onHomePage = pathname === '/'

  return (
    <NavigationStepsWrapper
      isOpen={isNavOpen}
      minWidth="9vw"
      width="16.5rem"
      currentMedia={{
        navLogoSet: product?.navLogo,
        color: product?.color,
        fallbackColor: 'linear-gradient(1deg, rgb(0 0 0 / 92%) 90%, rgb(0 0 0 / 83%) 20%)',
      }}
    >
      {!onHomePage && (
        <InnerNavWrapper $width={isNavOpen ? '90%' : '100%'}>
          <CollectionSelector />
          <StyledNav>
            <ul>
              {collection ? (
                Object.entries(productTypeMap)
                  .reverse()
                  .map(([type, collProductList], i) => (
                    <li key={i}>
                      <ProductSubHeader
                        color={WHITE}
                        padding="0"
                        margin="0.5rem 0 0.2rem 0"
                        fontSize={isNavOpen ? '4rem' : '1.6rem'}
                        fontWeight={800}
                      >
                        {type.toLocaleUpperCase()}S
                      </ProductSubHeader>
                      {collProductList.map((collProd) => (
                        <NavItemMemoed
                          key={collProd.id}
                          product={collProd}
                          currentProduct={product ?? undefined}
                          handleNavMove={handleNavMove}
                          isNavOpen={isNavOpen}
                        />
                      ))}
                    </li>
                  ))
              ) : (
                <LoadingRows rows={6} />
              )}
            </ul>
            {isDirectReferralView?.type === URLFlowType.SKILL && (
              <ProductSubHeader
                color={WHITE}
                padding="0"
                margin="1.2rem 0 0.2rem 0"
                fontSize={isNavOpen ? '4rem' : '1.6rem'}
                fontWeight={200}
                style={{ cursor: 'pointer' }}
                onClick={(e) => handleNavMove(e, { other: 'collection' })}
              >
                FULL COLLECTION
              </ProductSubHeader>
            )}
          </StyledNav>
        </InnerNavWrapper>
      )}

      <InnerNavWrapper
        className="theme-toggler"
        margin="auto auto 1rem auto"
        padding="1.5rem 1rem"
        alignItems={'center'}
        bgColor="transparent"
        $width={isNavOpen ? '90%' : '100%'}
        flexDirection={isNavOpen ? 'row' : 'column'}
      >
        {smallMedia && (
          <span style={{ fontSize: '2rem' }} className="nav-policy-title">
            Theme
          </span>
        )}
        <div>
          <ThemeToggleBar themeToggleProps={{ width: '90%', maxWidth: '120px' }} />
        </div>
      </InnerNavWrapper>
      <NavRowItem
        minHeight={smallMedia ? 60 : 0}
        onClick={() => setPoliciesOpenState((state) => ({ ...state, policies: !state.policies }))}
        flexWrap={'wrap'}
      >
        <span className="nav-policy-title">Learn more</span>
        <span className="nav-policy-title">[{policies ? ' - ' : ' + '}]</span>
        {policies && (
          <PolicyColumnWrapper>
            <ExternalLink id="instagram-link" href="https://instagram.com/pastelle.apparel" style={{ fontWeight: 100 }}>
              @pastelle.apparel
            </ExternalLink>
            <ExternalLink id="instagram-link" href="mailto:pastelle.portugal@gmail.com" style={{ fontWeight: 100 }}>
              Email us!
            </ExternalLink>
            <small>Policies:</small>
            <span onClick={(e) => handleNavMove(e, { other: '/' })}>About</span>
            <span onClick={(e) => handleNavMove(e, { other: '/policies/shipping' })}>Shipping</span>
            <span onClick={(e) => handleNavMove(e, { other: '/policies/privacy' })}>Privacy</span>
            <span onClick={(e) => handleNavMove(e, { other: '/policies/refund' })}>Refunds</span>
          </PolicyColumnWrapper>
        )}
      </NavRowItem>
      <NavRowItem
        fontSize="0.75rem"
        justifyContent={smallMedia ? 'end' : 'start'}
        backgroundColor={BLACK_TRANSPARENT_MOST}
      >
        Version: {packageJSON.version}
      </NavRowItem>
    </NavigationStepsWrapper>
  )
}

const NavProductLine = ({
  product,
  currentProduct,
  handleNavMove,
  isNavOpen,
}: {
  isNavOpen: boolean
  handleNavMove: (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    product: { product: Pick<BaseProductPageProps, 'id' | 'title' | 'handle'> },
  ) => void
  currentProduct: BaseProductPageProps | undefined
  product: Pick<BaseProductPageProps, 'id' | 'title' | 'handle'>
}) => (
  <SideEffectNavLink key={product.id} onClick={(e) => handleNavMove(e, { product })}>
    <ProductSubHeader
      width="100%"
      padding="2px 0"
      margin="0"
      color={WHITE}
      fontWeight={100}
      fontSize={isNavOpen ? '3.5rem' : '1.6rem'}
    >
      <CollectionLabel
        isNavOpen={isNavOpen}
        active={product.id === currentProduct?.id}
        bgColor={currentProduct?.bgColor || PLACEHOLDER_HIGHLIGHT_COLOUR}
        justifyContent={isNavOpen ? 'end' : 'start'}
      >
        {product.title}
      </CollectionLabel>
    </ProductSubHeader>
  </SideEffectNavLink>
)

const NavItemMemoed = memo(NavProductLine, (prevProps, nextProps) => {
  return prevProps.currentProduct?.id === nextProps.currentProduct?.id && prevProps.isNavOpen === nextProps.isNavOpen
})
