import React from 'react'
import { SocketProvider } from './context/socketContext'
import { MapView } from './views/MapView'

export const Mapp = () => {
    return (
        <div>
            <SocketProvider>
                <MapView />
            </SocketProvider>
        </div>
    )
}
