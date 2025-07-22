import { useEffect } from 'react'

export function useOnWindowResize(callback) {
    useEffect(() => {
        if (typeof window === 'undefined') return

        const handleResize = () => {
            callback()
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [callback])
}
