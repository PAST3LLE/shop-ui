import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Product } from 'shopify/graphql/types'
import { Theme, ThemeModes } from 'theme/styled'

const currentTimestamp = () => new Date().getTime()
export interface CatalogCurrentProduct {
  handle: Product['handle']
  id: Product['id']
}

export type WindowSize = { width?: number; height?: number } | null
export interface UserState {
  theme: Theme
  // timestamp: number
  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number
  // key string of current on screen item
  catalogCurrentProduct: CatalogCurrentProduct | null
  windowSize: WindowSize
}

export const initialState: UserState = {
  theme: {
    mode: ThemeModes.CHAMELEON,
    autoDetect: false
  },
  // timestamp: currentTimestamp(),
  catalogCurrentProduct: null,
  windowSize: null
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateVersion(state) {
      state.lastUpdateVersionTimestamp = currentTimestamp()
    },
    updateThemeMode(state, action: PayloadAction<ThemeModes>) {
      state.theme.mode = action.payload
    },
    updateThemeAutoDetect(state, action: PayloadAction<boolean>) {
      state.theme.autoDetect = action.payload
    },
    setOnScreenProductHandle(state, action: PayloadAction<CatalogCurrentProduct | null>) {
      state.catalogCurrentProduct = action.payload
    },
    updateWindowSize(state, action: PayloadAction<WindowSize>) {
      state.windowSize = action.payload
    }
  }
})
export const { updateThemeAutoDetect, updateThemeMode, setOnScreenProductHandle, updateWindowSize } = userSlice.actions
export const user = userSlice.reducer
