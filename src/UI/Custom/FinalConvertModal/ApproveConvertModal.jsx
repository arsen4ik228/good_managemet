import React, { useEffect } from 'react'
import { Modal, notification } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useConvertsHook } from '@hooks'
import classes from './FinalConvertModal.module.css'

export default function ApproveConvertModal({ setOpenModal, convertId}) {
    const navigate = useNavigate()
    const { contactId, organizationId } = useParams()

    const {
        approveConvert,
        userIsHost
    } = useConvertsHook({ convertId })

    useEffect(() => {
        // Показываем модальное окно при монтировании компонента
        showConfirmationModal()
    }, [])


    const finalConvert = async () => {
        try {
            await approveConvert(convertId).unwrap();
            navigate(`/${organizationId}/chat/${contactId}`);
        } catch (error) {
            // Проверяем, если это ошибка парсинга, но статус 200
            if (error.status === 'PARSING_ERROR' && error.originalStatus === 200) {
                // Значит запрос фактически успешен
                navigate(`/${organizationId}/chat/${contactId}`);
            } else {
                notification.error({
                    message: 'Ошибка',
                    description: 'Не удалось согласовать конверт',
                    placement: 'topRight',
                });
            }
        } finally {
            setOpenModal(false);
        }
    }

    const showConfirmationModal = () => {

        if (userIsHost) {
            notification.error({
                message: 'Ошибка',
                description: 'Приказ на этапе согласования у другого Поста',
                placement: 'topRight',
            })
            setOpenModal(false)
        }
        else {
            Modal.confirm({
                title: 'Согласование конверта',
                icon: <ExclamationCircleFilled />,
                content: (
                    <div className={classes.modalContent}>
                        <p>Данное действие нельзя отменить.</p>
                        <p className={classes.warningText}>Согласовать конверт?</p>
                    </div>
                ),
                okText: 'Согласовать',
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