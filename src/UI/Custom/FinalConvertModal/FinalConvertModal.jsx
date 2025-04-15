import React from 'react'
import classes from './FinalConvertModal.module.css'
import ModalContainer from '../ModalContainer/ModalContainer'
import { useConvertsHook } from '@hooks'
import { useNavigate } from 'react-router-dom'

export default function FinalConvertModal({ setOpenModal, convertId, pathOfUsers }) {
    const navigate = useNavigate()

    const {
        finishConvert,
    } = useConvertsHook();

    const finalConvert = async () => {
        const Data = {
            pathOfUsers: pathOfUsers,
            convertId: convertId
        }
        await finishConvert(Data)
        .then(() => {
            const currentPath = window.location.hash.substring(1); // "/Chat/uuid1/uuid2"
    
            // Вставляем "archive" перед последней частью пути
            const newPath = currentPath.replace(/\/([^/]+)$/, '/archive/$1');
            
            navigate(newPath);
        })
    }

    return (
        <ModalContainer
            setOpenModal={setOpenModal}
            buttonText={'Завершить'}
            clickFunction={finalConvert}
        >
            <div className={classes.content}>
                Данное действие нельзя отменить.
                <span>Завершить конверт?</span>
            </div>
        </ModalContainer>
    )
}
