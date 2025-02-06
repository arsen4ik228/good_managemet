import React from 'react'
import classes from './NavigationBar.module.css'
import accountIcon from '../icon/icon _ avatar.svg'
import messagiesIcon from '../icon/bar _ mail.svg'
import helperIcon from '../icon/icon _ GM.svg'
import { useNavigate } from 'react-router-dom'

export default function NavigationBar() {

    const navigate = useNavigate()
    return (
        <>
            <footer className={classes.footer}>
                <div className={classes.navigationContainer}>
                    <div className={classes.imgContainer}>
                        <img src={messagiesIcon} alt="messagiesIcon" onClick={() => navigate('/Main')}/>
                    </div>
                    <div className={classes.imgContainer}>
                        <img src={helperIcon} alt="helperIcon" onClick={() => navigate('/pomoshnik')} />
                    </div>
                    <div className={classes.imgContainer}>
                        <img src={accountIcon} alt="accountIcon" />
                    </div>
                </div>
            </footer>
        </>
    )
}
