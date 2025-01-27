import React from 'react'
import App from './App'
import { isMobile } from 'react-device-detect'

export default function MobileApp() {
    console.log('mobile                                                        ', isMobile)

    return (
        <>
            <App></App>
        </>
    )
}
