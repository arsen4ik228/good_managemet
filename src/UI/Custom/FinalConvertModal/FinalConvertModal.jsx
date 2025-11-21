import React, { useEffect } from 'react'
import { Modal, notification } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useConvertsHook } from '@hooks'
import classes from './FinalConvertModal.module.css'

export default function FinalConvertModal({ setOpenModal, convertId, pathOfUsers }) {
    const navigate = useNavigate()
    const { contactId, organizationId } = useParams()

    const {
        finishConvert,
        ErrorFinishConvertMutation,
        userIsHost
    } = useConvertsHook({ convertId })

    useEffect(() => {
        // Показываем модальное окно при монтировании компонента
        showConfirmationModal()
    }, [])

    const finalConvert = async () => {
        //(userIsHost)
        const Data = {
            pathOfUsers: pathOfUsers,
            convertId: convertId
        }

        await finishConvert({ ...Data })
            .unwrap()
            .then(() => {
                navigate(`/${organizationId}/chat/${contactId}`)
            })
            .catch((error) => {
                console.error('Ошибка при завершении конверта:', error)
                notification.error({
                    message: 'Ошибка',
                    description: 'Не удалось завершить конверт',
                    placement: 'topRight',
                })
            })
            .finally(() => {
                setOpenModal(false)
            })
    }
    const showConfirmationModal = () => {

        if (!userIsHost) {
            notification.error({
                message: 'Ошибка',
                description: 'Завершить конверт может только Создатель',
                placement: 'topRight',
            })
            setOpenModal(false)
        }
        else {
            Modal.confirm({
                title: 'Завершение конверта',
                icon: <ExclamationCircleFilled />,
                content: (
                    <div className={classes.modalContent}>
                        <p>Данное действие нельзя отменить.</p>
                        <p className={classes.warningText}>Завершить конверт?</p>
                    </div>
                ),
                okText: 'Завершить',
                cancelText: 'Отмена',
                okButtonProps: { danger: true },
                onOk: finalConvert,
                onCancel: () => {
                    setOpenModal(false)
                    window.close()
                },
                // Закрытие при клике на маску
                maskClosable: true,
                // Закрытие при нажатии ESC
                keyboard: true
            })
        }
    }

    // Компонент не возвращает JSX, так как модальное окно показывается через useEffect
    return null
}