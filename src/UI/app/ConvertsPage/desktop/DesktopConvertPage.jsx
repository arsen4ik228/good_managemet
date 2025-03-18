import React, { useEffect, useState } from 'react'
import InputTextContainer from '@Custom/ContainerForInputText/InputTextContainer';
import Headers from "@Custom/Headers/Headers";
import classes from './desktopConvertPage.module.css'
import { useParams } from 'react-router-dom';
import { notEmpty } from '@helpers/helpers'
import Task from '../TaskContainer/Task'
import { useConvertsHook } from '@hooks/useConvertsHook';


export default function DesktopConvertPage () {
    const { userIds } = useParams()
    const [converts, setConverts] = useState()
    const [userInfo, setUserInfo] = useState()

    const { allConverts, refetchGetConverts } = useConvertsHook()
    console.log(allConverts)

    useEffect(() => {
        if (!notEmpty(allConverts)) return

        const user = allConverts.find(item => item.userIds === userIds)
        if (!user) return

        setConverts(user.converts)
        setUserInfo(user)
    }, [userIds, allConverts])

    return (
        <div className={classes.dialog}>
            <Headers name={"Писька"}>
                {/* <BottomHeaders></BottomHeaders> */}
            </Headers>

            <div className={classes.main}>
                <div className={classes.body}>
                    {converts?.map((item, index) => (
                        <React.Fragment key={index}>
                            <Task taskData={item}></Task>
                        </React.Fragment>
                    ))}

                </div>
            </div>

        </div>
    )
}
