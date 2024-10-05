"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO } from 'socket.io-client'

type SocketContextType = {
    socket : any | null
    isConnected : boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
})

export const useSocket = () =>{
    return useContext(SocketContext)
}

export const SocketProvider = ({children}: {children: React.ReactNode})=>{
    const [socket, setSocket] = useState(false)
    const [isConnected, setisConnected] = useState(false)

    useEffect(() => {
        const SocketInstance = new (ClientIO as any)
            (process.env.NEXT_PUBLIC_SITE_URL!,
            {
                path: '/api/socket/io',
                addTrailingSlash: false
            })

        SocketInstance.on('connect', () => {
            setisConnected(true)
        })

        SocketInstance.on('disconnect', () => {
            setisConnected(false)
        })

        setSocket(SocketInstance)

        return()=>{
            SocketInstance.disconnect()
        }
    
    }, [])

    return (
        <SocketContext.Provider value={{socket,isConnected}}>
            {children}
        </SocketContext.Provider>
    )
    
}