import React from 'react'
import { isMobile } from 'react-device-detect'
import Headers from "@Custom/Headers/Headers";
import Header from "@Custom/CustomHeader/Header";
import classes from './AdaptiveLayoutContainer.module.css'
import { useNavigate } from 'react-router-dom';

export default function AdaptiveLayoutContainer({ children, userInfo }) {
    const navigate = useNavigate()
    return (
        <>
            {isMobile ? (
                <>
                    <div className={classes.wrapper}>
                        <Header
                            title={userInfo.userName}
                            avatar={userInfo.avatar}
                        >
                            {userInfo.postName}
                        </Header>
                        <>
                            {children}
                        </>
                    </div>
                </>
            ) : (
                <>
                    <div className={classes.dialog}>
                        <Headers
                            name={userInfo?.userName}
                            sectionName={userInfo.postName}
                            avatar={userInfo?.avatar}
                            back={() => navigate(-1)}
                            >
                        </Headers>

                        <div className={classes.main}>
                            <>
                                {children}
                            </>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
