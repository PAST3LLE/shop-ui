import SmartImg from 'components/SmartImg'
import { SINGLE_ITEM_LOGO_RATIO } from 'constants/config'
import { isMobile } from 'utils'
import { GenericImageSrcSet } from 'shopify/graphql/types'
import { ItemLogoCollectionView, ItemLogo, ItemLogoCssImport } from '../styleds'

type LogoParams = {
  parentNode: HTMLElement | null
  logos: { header?: GenericImageSrcSet; nav?: GenericImageSrcSet; main?: GenericImageSrcSet }
  isCollectionView: boolean
}
export default function Logo({ isCollectionView, logos, parentNode }: LogoParams) {
  const collectionLogo = logos.nav || logos.header

  if (isCollectionView && collectionLogo) {
    return <ItemLogoCollectionView collectionView logoUri={collectionLogo} $bgColor="ghostwhite" />
  } else if (parentNode?.clientWidth && logos.main) {
    return !isMobile ? (
      <ItemLogo>
        <SmartImg
          path={{ defaultPath: logos.main.defaultUrl }}
          pathSrcSet={logos.main}
          lazy={false}
          lqImageOptions={{
            width: parentNode?.clientWidth || 0,
            get height() {
              return (this.width * SINGLE_ITEM_LOGO_RATIO[0]) / SINGLE_ITEM_LOGO_RATIO[1]
            },
            showLoadingIndicator: false
          }}
        />
      </ItemLogo>
    ) : (
      <ItemLogoCssImport logoUri={logos.main} height={parentNode.clientWidth / 3.64} position="relative" />
    )
  } else {
    return null
  }
}