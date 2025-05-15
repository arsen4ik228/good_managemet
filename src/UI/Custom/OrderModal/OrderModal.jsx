import React, { useState } from 'react'
import classes from './OrderModal.module.css'
import ModalContainer from '@Custom/ModalContainer/ModalContainer'
import { usePostsHook } from '@hooks'

export default function OrderModal({ setModalOpen, setTheme, selectedPost, setReciverPost, buttonFunc }) {

    const {
        postsForWorkingPlan,
    } = usePostsHook()

    const [selectedReceiverPost, setSelectedRecieverPost] = useState()

    const buttonClick = () => {
        buttonFunc()
        setModalOpen(false)
    }

    const selectPost = (value) => {
        setSelectedRecieverPost(value)
        setReciverPost(value)
    }
    console.log(selectedPost, postsForWorkingPlan)
    return (
        <ModalContainer
            buttonText={'Отправить'}
            setOpenModal={setModalOpen}
            clickFunction={buttonClick}
        >
            <div className={classes.content}>
                <input
                    type="text"
                    placeholder='Тема приказа'
                    onChange={(e) => setTheme(e.target.value)}
                />
                <div className={classes.selectPostContainer}>
                    <div className={classes.left}>
                        Пост:
                    </div>
                    <div className={classes.right}>
                        {postsForWorkingPlan?.map((item, index) => (
                            <div key={index} onClick={() => selectPost(item.id)}>
                                <input type="radio" checked={item.id === selectedReceiverPost} />
                                <span>{item.postName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ModalContainer>
    )
}
