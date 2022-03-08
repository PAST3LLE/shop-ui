import { CatalogSeasonsMap } from './types'
// APPAREL DATA
import LEER from 'mock/apparel/leer'
import ESTRELA from 'mock/apparel/estrela'

const catalogItems: Map<number | string, Partial<CatalogSeasonsMap>> = new Map()

catalogItems.set('2022', {
  FALL: {
    LEER,
    ESTRELA
  }
})

export default catalogItems
