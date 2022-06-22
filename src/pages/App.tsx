import { lazy, Suspense } from 'react'
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom'

import Web3ReactManager from 'components/blockchain/Web3ReactManager'

// const Footer = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "FOOTER" */ 'components/Footer'))
const Header = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ 'components/Header'))
const Popups = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "POPUPS" */ 'components/Popups'))
const Catalog = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "CATALOG" */ 'pages/Catalog'))
const AboutUs = lazy(() => import(/* webpackPrefetch: true,  webpackChunkName: "ABOUTUS" */ 'pages/AboutUs'))
const NotFound = lazy(() => import(/* webpackChunkName: "NOTFOUND" */ 'pages/Error/NotFound'))
const Navigation = lazy(() => import(/* webpackChunkName: "NAVIGATION" */ 'components/Navigation'))
const SingleItem = lazy(() => import(/* webpackChunkName: "SINGLEITEM" */ 'pages/SingleItem'))

import { useCatalogByYearAndSeason } from 'state/catalog/hooks'
import { FixedAnimatedLoader } from 'components/Loader'
import { isMobile } from 'utils'
import { gql, useQuery } from '@apollo/client'

// TODO: move
// Redirects to swap but only replace the pathname
const DEFAULT_CATALOG_YEAR = '2022'
const DEFAULT_CATALOG_SEASON = 'FALL'
export function RedirectPathToCatalogOnly({ location }: RouteComponentProps) {
  return (
    <Redirect
      to={{
        ...location,
        pathname: `/goods/${DEFAULT_CATALOG_YEAR}/${DEFAULT_CATALOG_SEASON}/`
      }}
    />
  )
}

const QUERY = gql`
  query getFiveProducts {
    products(first: 5) {
      nodes {
        id
        title
        description
        descriptionHtml
        sizes: options {
          values
        }
        updatedAt
        featuredImage {
          url
        }
        media(first: 6) {
          nodes {
            ... on MediaImage {
              mediaContentType
              image {
                id
                url
                altText
                width
                height
              }
            }
            ... on Video {
              mediaContentType
              id
              previewImage {
                url
              }
              sources {
                mimeType
                url
              }
            }
            ... on ExternalVideo {
              mediaContentType
              id
              embedUrl
              host
            }
          }
        }
        color: metafield(namespace: "custom", key: "color") {
          value
        }
        artistInfo: metafield(namespace: "custom", key: "artistInfo") {
          value
        }
      }
    }
  }
`

export default function App() {
  const response = useQuery(QUERY)
  console.debug('=== 🚀 APOLLO QUERY ===', response)
  // We need something to show. We'll go with catalog by year and season, why not.
  // if there isn't yet data, show something else
  const catalogBySeason = useCatalogByYearAndSeason({ year: '2022', season: 'FALL' })

  if (!catalogBySeason) return <FixedAnimatedLoader loadText="PSTL" />

  return (
    <Web3ReactManager>
      <Suspense fallback={<FixedAnimatedLoader loadText="PSTL" />}>
        <Popups />
        {/* HEADER */}
        <Header />
        {/* SIDE-NAV */}
        {!isMobile && <Navigation />}
        {/* ARTICLE CONTENT */}
        <Switch>
          <Route exact path="/goods/:year/:season" component={Catalog} />
          <Route exact path="/goods/:year/:season/:item" component={SingleItem} />
          <Route exact path="/aboutus" component={AboutUs} />
          <Route exact path="/404" component={NotFound} />
          <Route component={RedirectPathToCatalogOnly} />
          <Route component={NotFound} />
        </Switch>
        {/* FOOTER */}
        {/* <Footer /> */}
      </Suspense>
    </Web3ReactManager>
  )
}
