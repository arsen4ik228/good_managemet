import React from 'react'
import classes from './AllPostModal.module.css'
import ModalContainer from '../ModalContainer/ModalContainer'
import { useAllPosts } from '@hooks'

export default function AllPostModal({setOpenModal}) {

    const { allPosts } = useAllPosts()
    return (
        <>
            <ModalContainer
                buttonText={'Добавить'}
                setOpenModal={setOpenModal}
            >

            </ModalContainer>
        </>
    )
}
