import { useIsMobile } from '@past3lle/hooks'

import { useEffect } from 'react'
import { toast } from 'react-toastify'

import { usePathname } from 'next/navigation'

import { PastelleToast } from '@/components/Toast'

export function useToast() {
  const isMobile = useIsMobile()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== '/collection' || !process.env.NEXT_PUBLIC_TOAST_DESCRIPTION) return
    toast(<PastelleToast header={process.env.NEXT_PUBLIC_TOAST_HEADER} body={process.env.NEXT_PUBLIC_TOAST_DESCRIPTION} isMobile={isMobile} />)
    return toast.dismiss
  }, [isMobile, pathname])
}
