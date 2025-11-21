import React, { useState } from 'react'
import classes from './AllPostModal.module.css'
import ModalContainer from '../ModalContainer/ModalContainer'
import { useAllPosts } from '@hooks'
import { selectedOrganizationId } from '@helpers/constants'

export default function AllPostModal({ setOpenModal, watchers, buttonClick, selectedPost, setSelectedPost }) {

    const { allPosts } = useAllPosts({ organization: selectedOrganizationId })

    const handlePostClick = (postId) => {
        setSelectedPost(prevState => {
            if (prevState.includes(postId)) {
                return prevState.filter(id => id !== postId); // Удаляем postId
            } else {
                return [...prevState, postId]; // Добавляем postId
            }
        });
    };

    //(watchers)

    return (
        <>
            <ModalContainer
                buttonText={'Сохранить'}
                setOpenModal={setOpenModal}
                clickFunction={buttonClick}
            >
                <div className={classes.contentContainer}>
                    {allPosts?.map((item, index) => (
                        <div key={index} className={classes.postContainer} onClick={() => handlePostClick(item.id)}>
                            <div className={classes.postName}>
                                {item.postName}
                            </div>
                            <div className={classes.checkboxContainer}>
                                <input type="checkbox" readOnly checked={selectedPost.includes(item.id)} />
                            </div>
                        </div>
                    ))}
                </div>

            </ModalContainer>
        </>
    )
}
