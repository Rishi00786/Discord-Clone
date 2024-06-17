import React, { useEffect, useState } from 'react'

const useOrigin = () => {

    const [isMounted, setisMounted] = useState(false)

    useEffect(() => {
      setisMounted(true)
    }, [])

    const origin = typeof window!=='undefined' && window.location.origin? window.location.origin : ''
    
    if(!isMounted) {
        return "";
    }

  return origin
}

export default useOrigin
