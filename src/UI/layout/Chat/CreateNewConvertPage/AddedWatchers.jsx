import React, { useEffect, useState } from 'react'
import classes from './AddedWatchers.module.css'
import addedWatcher from '@image/icon _ addWatcher.svg'
import { useConvertsHook } from '@hooks'
import { baseUrl } from '@helpers/constants'
import { notEmpty } from '@helpers/helpers'
// import defaultAvatar from '../icon/messendger _ avatar.svg'
import default_avatar from '@image/default_avatar.svg'
import { Tooltip } from 'antd'
import AllPostModal from '../../../Custom/AddedWatcherContainer/AllPostModal'
import PostModal from './PostModal'
import { useObservers } from '../../../../contexts/ObserverContext'

const getAvatar = (link) => {
    if (!link) return default_avatar

    return baseUrl + link
}

export default function AddedWatchers({ convertId, watchersToConvert, disabled = false }) {
    const [openModal, setOpenModal] = useState(false)
    // const [selectedPost, setSelectedPost] = useState([])


    const { updateConvert } = useConvertsHook()

    const { setObserversList, setObservers, observers } = useObservers()


    useEffect(() => {
        if (!notEmpty(watchersToConvert)) return

        setObservers(watchersToConvert?.map(item => item.post.id))
    }, [watchersToConvert])

    // console.log(setObservers)

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.content}>
                    <div className={classes.text}>наблюдатели:</div>
                    <div className={classes.imgContainer}>
                        {observers?.map((item, index) => (
                            <Tooltip title={item?.user?.firstName + ' ' + item?.user?.lastName} placement="top">
                                <div className={classes.userAvatarContainer}>

                                    <img src={getAvatar(item?.user?.avatar_url)} alt="avatar" />
                                </div>
                            </Tooltip>
                        ))}
                        <div className={classes.addedButton}>
                            {!disabled && <img src={addedWatcher} alt="addedButton" onClick={() => setOpenModal(true)} />}
                        </div>
                    </div>
                </div>
            </div>

            {openModal &&
                <PostModal
                    setOpenModal={setOpenModal}
                    watchers={observers}
                    buttonClick={() => setOpenModal(false)}
                    selectedPost={observers}
                    setSelectedPost={setObservers}
                ></PostModal>
            }
        </>
    )
}


