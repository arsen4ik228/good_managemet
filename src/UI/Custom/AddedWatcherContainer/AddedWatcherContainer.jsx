import React, { useEffect, useState } from 'react'
import classes from './AddeWatcherContainer.module.css'
import addedWatcher from '@image/icon _ addWatcher.svg'
import AllPostModal from './AllPostModal'
import { useConvertsHook } from '@hooks'
import { baseUrl } from '@helpers/constants'
import { notEmpty } from '@helpers/helpers'
import defaultAvatar from '../icon/messendger _ avatar.svg'
import { Tooltip } from 'antd'

const getAvatar = (link) => {
    if (!link) return defaultAvatar

    return baseUrl + link
}

export default function AddedWatcherContainer({ convertId, watchersToConvert, disabled = false }) {
    const [openModal, setOpenModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState([])


    const { updateConvert } = useConvertsHook()

    const updateWatchersToConvert = async () => {


        await updateConvert({
            _id: convertId,
            watcherIds: selectedPost
        })
    }



    useEffect(() => {
        if (!notEmpty(watchersToConvert)) return

        setSelectedPost(watchersToConvert?.map(item => item.post.id))
    }, [watchersToConvert])

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.content}>
                    <div className={classes.text}>наблюдатели:</div>
                    <div className={classes.imgContainer}>
                        {watchersToConvert?.map((item, index) => (
                            <Tooltip title={item?.post?.user?.firstName + ' ' + item?.post?.user?.lastName} placement="top">
                                <div className={classes.userAvatarContainer}>

                                    <img src={getAvatar(item?.post?.user?.avatar_url)} alt="avatar" />
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
                <AllPostModal
                    setOpenModal={setOpenModal}
                    watchers={watchersToConvert}
                    buttonClick={updateWatchersToConvert}
                    selectedPost={selectedPost}
                    setSelectedPost={setSelectedPost}
                ></AllPostModal>
            }
        </>
    )
}


