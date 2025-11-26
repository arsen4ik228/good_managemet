import React, { useRef, useState } from 'react'
import classes from './Task.module.css'
import delegate_icon from '@image/delegate_icon.svg'
import round_check_icon from '@image/round_check_icon.svg'
import round_check_complete_icon from '@image/round_check_complete_icon.svg'
import { Spin, Tooltip } from 'antd'
import { formatDateWithDay } from '@helpers/helpers.js'
import { useTargetsHook, useConvertsHook } from '@hooks';
import DelegateModal from './DelegateModal'
import { usePostsHook } from '../../../../hooks'
import SimpleCommunicationModal from './SimpleCommunicationModal'
import { useNavigate, useParams } from 'react-router-dom'
import { useWorkingPlanForm } from '../../../../contexts/WorkingPlanContext'
import dayjs from 'dayjs';


export default function Task({ id, content, deadline, type, state, completeDate, dateStart, holderPostId, contactId, convertId }) {

    const [isHovered, setIsHovered] = useState(false);
    const [openModal, setOpenModal] = useState(false)
    const [modalDeadline, setModalDeadline] = useState()
    const [convertTheme, setConvertTheme] = useState()
    const [reciverPostId, setReciverPostId] = useState()
    const [openCommunicationModal, setOpenCommunicationModal] = useState()
    const buttonRef = useRef();
    const navigate = useNavigate()
    const { organizationId } = useParams()

    const {
        postConvert,
        isLoadingPostConvertMutation,
        isSuccessPostConvertMutation,
        isErrorPostConvertMutation,
        ErrorPostConvertMutation,
    } = useConvertsHook();

    const {
        // dateStart,
        setDateStart,
        // deadline,
        setDeadline,
        senderPost,
        setSenderPost,
        setContentInput,
        userPostsInAccount,
        setIsEdit,
        taskId,
        setTaskId
    } = useWorkingPlanForm();

    const {

        updateTargets,
        isLoadingUpdateTargetsMutation,
        isSuccessUpdateTargetsMutation,
        isErrorUpdateTargetsMutation,
        ErrorUpdateTargetsMutation,

        deleteTarget,
    } = useTargetsHook();

    const {
        underPosts,
        isLoadingGetUnderPosts,
        isErrorGetUnderPosts,
        isFetchingGetUnderPosts,
    } = usePostsHook({ postId: holderPostId })


    const navigateToCommunication = (contactId, convertId) => {
        navigate(`/${organizationId}/chat/${contactId}/${convertId}`)
    }

    const setDataForUpdate = () => {

        if (type === 'Приказ') return setOpenCommunicationModal(true)
        if (state === 'Завершена') return;

        setDateStart(dayjs(dateStart))
        setDeadline(deadline ? dayjs(deadline) : null)
        setSenderPost(holderPostId)
        setContentInput(content)
        setIsEdit(true)
        setTaskId(id)
    }

    const handleDelegateClick = (e) => {
        e.stopPropagation(); // останавливаем всплытие
        e.preventDefault(); // на всякий случай
        setOpenModal(true)
    };

    const finishTarget = async (id) => {

        if (state === 'Завершена') return;
        if (state !== 'Завершена' && type === 'Приказ') return setOpenCommunicationModal(true);

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


    const handleDeletionTarget = async () => {
        await deleteTarget({
            targetId: id,
        })
            .unwrap()
            .then(() => {
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    }

    const createOrder = async () => {

        let attachmentIds = [];
        // if (taskData?.attachmentToTargets?.length > 0) {
        //     attachmentIds = taskData.attachmentToTargets
        //         .map(element => element.attachment.id);
        // }

        const Data = {}

        Data.convertTheme = convertTheme
        Data.convertType = "Приказ"
        Data.deadline = deadline ? deadline : modalDeadline
        Data.senderPostId = holderPostId
        Data.reciverPostId = reciverPostId
        Data.messageContent = content
        Data.targetCreateDto = {
            type: "Приказ",
            orderNumber: 1,
            content: content,
            holderPostId: reciverPostId,
            dateStart: dateStart,
            deadline: deadline ? deadline : modalDeadline,
            //     ...(attachmentIds.length > 0 && {
            //         attachmentIds: attachmentIds
            //     })
        }
        try {
            const result = await postConvert({
                ...Data
            }).unwrap()

            if (result)
                handleDeletionTarget()
        }
        catch (err) {
            //("Ошибка: ", err)
        }

        //     .then(() => {
        // })
        // .catch((error) => {
        //     console.error("Ошибка:", JSON.stringify(error, null, 2));
        // });

    }

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.leftContainer}>
                    {isLoadingUpdateTargetsMutation ? (
                        <Spin size='small'></Spin>
                    ) : (
                        <img src={state === 'Завершена' ? round_check_complete_icon : round_check_icon} alt="round_check_icon" onClick={() => finishTarget(id)} />
                    )}
                </div>
                <div
                    className={classes.rightContainer}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => setDataForUpdate()}
                >
                    <div className={classes.infoContainer}>
                        <div className={classes.taskType}>{type === 'Личная' ? "" : type}</div>
                        <div className={classes.date}> {state === 'Завершена' ? `Завершено: ${formatDateWithDay(completeDate)}` : (deadline ? `Завершить: ${formatDateWithDay(deadline)}` : '')}</div>
                    </div>
                    <div
                        className={classes.contentContainer}
                        style={{
                            backgroundColor: state === 'Завершена' ? '#F0F0F0' : '',
                            border: id === taskId ? '2px solid #005475' : 'none'
                        }}
                    >
                        <Tooltip
                            title={content}
                            mouseEnterDelay={0.6} // 1 секунда задержки
                            placement="right"
                            autoAdjustOverflow={true}
                            destroyTooltipOnHide={true}
                            overlayStyle={{ maxWidth: 400 }}
                        >
                            <div
                                className={classes.textContainer}
                                style={{ color: state === 'Завершена' ? '#999999' : '' }}
                            >
                                {content}
                            </div>
                        </Tooltip>
                        <div
                            className={classes.delegateContainer}
                            onClick={handleDelegateClick}
                            ref={buttonRef}
                        >
                            {state !== 'Завершена' && type !== 'Приказ' && isHovered && (<img src={delegate_icon} alt="delegate_icon" />)}
                        </div>
                    </div>
                </div>

            </div>

            {openModal && (
                <DelegateModal
                    onClose={() => setOpenModal(false)}
                    triggerRef={buttonRef}
                    convertTheme={convertTheme}
                    setConvertTheme={setConvertTheme}
                    modalDeadline={modalDeadline}
                    setModalDeadline={setModalDeadline}
                    deadline={deadline}
                    underPosts={underPosts}
                    reciverPostId={reciverPostId}
                    setReciverPostId={setReciverPostId}
                    clickFunc={createOrder}
                ></DelegateModal>
            )}

            {openCommunicationModal && (
                <SimpleCommunicationModal
                    isOpen={openCommunicationModal}
                    onClose={() => setOpenCommunicationModal(false)}
                    onConfirm={() => navigateToCommunication(contactId, convertId)}
                ></SimpleCommunicationModal>
            )}
        </>
    )
}
