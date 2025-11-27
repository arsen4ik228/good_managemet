import React, { useEffect } from 'react'
import { Modal, notification } from 'antd'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { useConvertsHook, useTargetsHook } from '@hooks'
import classes from './FinalConvertModal.module.css'

export default function FinalConvertModal({ setOpenModal, convertId, pathOfUsers, targetId }) {
    const navigate = useNavigate()
    const { contactId, organizationId } = useParams()

    const {
        finishConvert,
        ErrorFinishConvertMutation,
        userIsHost
    } = useConvertsHook({ convertId })

        const {
    
            updateTargets,
            isLoadingUpdateTargetsMutation,
            isSuccessUpdateTargetsMutation,
            isErrorUpdateTargetsMutation,
            ErrorUpdateTargetsMutation,
    
            deleteTarget,
        } = useTargetsHook();

    useEffect(() => {
        // Показываем модальное окно при монтировании компонента
        showConfirmationModal()
    }, [])

    const finishTarget = async (id) => {

        await updateTargets({
            _id: id,
            targetState: 'Завершена',
            type: 'Личная',
        })
            .unwrap()
            .then(() => {
                // reset()
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    }

    // const finalConvert = async () => {
    //     //(userIsHost)
    //     const Data = {
    //         pathOfUsers: pathOfUsers,
    //         convertId: convertId
    //     }

    //     await finishConvert({ ...Data })
    //         .unwrap()
    //         .then(() => {
    //             navigate(`/${organizationId}/chat/${contactId}`)
    //         })
    //         .catch((error) => {
    //             console.error('Ошибка при завершении конверта:', error)
    //             notification.error({
    //                 message: 'Ошибка',
    //                 description: 'Не удалось завершить конверт',
    //                 placement: 'topRight',
    //             })
    //         })
    //         .finally(() => {
    //             setOpenModal(false)
    //         })
    // }

    const finalConvert = async () => {
        try {
            const Data = {
                pathOfUsers: pathOfUsers,
                convertId: convertId
            }
    
            // Сначала выполняем updateTargets
            await updateTargets({
                _id: targetId, 
                targetState: 'Завершена',
                type: 'Приказ',
            }).unwrap();
    
            // Только после успешного выполнения updateTargets выполняем finishConvert
            await finishConvert({ ...Data }).unwrap();
            
            navigate(`/${organizationId}/chat/${contactId}`);
            
        } catch (error) {
            console.error('Ошибка:', error);
            notification.error({
                message: 'Ошибка',
                description: 'Не удалось завершить операцию',
                placement: 'topRight',
            });
        } finally {
            setOpenModal(false);
        }
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