import React from 'react'
import style from './Header.module.css'

export default function Header({ name, children }) {
    return (
        <div className={style.header}>
            <div className={style.block1}></div>
            <div className={style.block2}>
                <div className={style.name}> {name}</div>
                <div className={style.children}> {children}</div>
            </div>
        </div>
    )
}
