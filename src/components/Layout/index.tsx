import { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { useToast } from '@/hooks/useToast'
import { ToastContainer } from 'react-toastify'

import { useIsMobile } from '@past3lle/hooks'

const Header = dynamic(() => import(/* webpackPrefetch: true,  webpackChunkName: "HEADER" */ '@/components/Header'))
const Navigation = dynamic(() => import(/* webpackChunkName: "NAVIGATION" */ '@/components/Navigation'))
const Cookies = dynamic(() => import(/* webpackChunkName: "COOKIES" */ '@/components/Cookies/Banner'))

interface Props {
  children: ReactNode
}
export function Layout({ children }: Props) {
  const isMobile = useIsMobile()
  useToast()

  return (
    <>
      <Header />
      <Navigation mobileHide />
      {children}
      <Cookies />
      <ToastContainer
        theme="dark"
        toastClassName="pastelle-toast"
        position={isMobile ? 'bottom-center' : 'bottom-right'}
        pauseOnHover={false}
        closeOnClick
        newestOnTop
        limit={1}
        autoClose={5000}
      />
    </>
  )
}
