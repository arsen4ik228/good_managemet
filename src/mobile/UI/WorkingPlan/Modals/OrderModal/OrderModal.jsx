import React, { useState } from 'react'
import classes from './OrderModal.module.css'
import ModalContainer from '../../../Custom/ModalContainer/ModalContainer'
import { usePostsHook } from '../../../../hooks/usePostsHook'

export default function OrderModal({ setModalOpen, setTheme, setReciverPost, buttonFunc }) {

    const {
        allPosts
    } = usePostsHook()

    const [selectedPost, setSelectedPost] = useState()

    const buttonClick = () => {
        buttonFunc()
        setModalOpen(false)
    }

    const selectPost = (value) => {
        setSelectedPost(value)
        setReciverPost(value)
    }

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
                        {allPosts.map((item, index) => (
                            <div key={index} onClick={() => selectPost(item.id)}>
                                <input type="radio" checked={item.id === selectedPost} />
                                <span>{item.postName}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </ModalContainer>
    )
}
