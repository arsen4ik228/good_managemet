import React from 'react'
import App from './App'
import { isMobile } from 'react-device-detect'

export default function AppDesktop() {
  console.log('mobile                                                        ', isMobile)

  return (
    <>
        <App></App>
    </>
  )
}
