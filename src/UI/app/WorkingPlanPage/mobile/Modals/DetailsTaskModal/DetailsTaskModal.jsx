import React, { useEffect, useState, useRef } from 'react'
import classes from './DetailsTaskModal.module.css'
import ModalContainer from '@Custom/ModalContainer/ModalContainer'
import { notEmpty, resizeTextarea } from '@helpers/helpers';
import { useTargetsHook } from '@hooks'
import { usePolicyHook } from '@hooks'
import AttachmentModal from '../AttachmentsModal/AttachmentModal'
import { isMobile } from 'react-device-detect';

export default function DetailsTaskModal({ setOpenModal, taskData, userPosts }) {

    const [startDate, setStartDate] = useState()
    const [deadlineDate, setDeadlineDate] = useState()
    const [contentInput, setContentInput] = useState()
    const [taskStatus, setTaskStatus] = useState()
    const [holderPost, setHolderPost] = useState()
    const [selectedPolicy, setSelectedPolicy] = useState()
    const [isArchive, setIsArchive] = useState(false)
    const [selectedPostOrganizationId, setSelectedPostOrganizationId] = useState()
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null);
    const [selectedFiles, setSelectedFiles] = useState([])
    const [openAttachmentsModal, setOpenAttachmentsModal] = useState(false)



    const isOrder = taskData.type === 'Приказ'
    console.log(taskData)

    const {
        updateTargets,
        isLoadingUpdateTargetsMutation,
        isSuccessUpdateTargetsMutation,
        isErrorUpdateTargetsMutation,
        ErrorUpdateTargetsMutation,

        deleteTarget,

    } = useTargetsHook()

    const {
        activeDirectives,
        activeInstructions,
    } = usePolicyHook({ organizationId: selectedPostOrganizationId })

    const transformAttachmentsForRequest = (array) => {

        if (!notEmpty(array)) return null

        const result = []
        array.forEach(item =>
            result.push(item.attachment.id)
        )
        return result
    }

    const updateTask = async () => {

        if (taskStatus === 'Удалена') {
            await deleteTarget({
                targetId: taskData.id,
            })
                .unwrap()
                .then(() => {
                })
                .catch((error) => {
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });
        }
        else {


            const Data = {}

            if (contentInput !== taskData.content) Data.content = contentInput
            if (holderPost !== taskData.holderPostId) Data.holderPostId = holderPost
            if (taskStatus !== taskData.targetState) Data.targetState = taskStatus
            if (startDate !== taskData.dateStart.split('T')[0]) Data.dateStart = startDate
            if (deadlineDate !== taskData.deadline.split('T')[0]) Data.deadline = deadlineDate
            if (selectedPolicy === 'null')
                Data.policyId = null
            else if (selectedPolicy && selectedPolicy !== taskData.policy?.id)
                Data.policyId = selectedPolicy

            // if (!notEmpty(Data)) return

            Data.attachmentIds = transformAttachmentsForRequest(attachments)


            await updateTargets({
                _id: taskData.id,
                type: taskData.type,
                ...Data
            })
                .unwrap()
                .then(() => {
                })
                .catch((error) => {
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });
        }
    }

    const setHolderPostId = (value) => {
        setHolderPost(value)
        setSelectedPostOrganizationId(prevState => {

            const _selectedPostOrganizationId = userPosts?.find(item => item.id === value)?.organization

            if (prevState !== _selectedPostOrganizationId)
                setSelectedPolicy('null')

            return _selectedPostOrganizationId
        })
    }

    const handleCustomButtonClick = () => {
        fileInputRef.current.click(); // Программно вызываем клик по input
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files); // Преобразуем FileList в массив
        if (files) {
            setSelectedFiles(files); // Сохраняем выбранные файлы в состоянии
        }
    }

    useEffect(() => {

        if (!notEmpty(taskData)) return;
        console.warn('bam')
        setIsArchive(taskData?.targetState === 'Завершена' ? true : false);
        setStartDate(taskData?.dateStart.split('T')[0]);
        setDeadlineDate(taskData?.deadline.split('T')[0]);
        setContentInput(taskData.content);
        setTaskStatus(taskData?.targetState);
        setHolderPost(taskData?.holderPostId);
        setSelectedPolicy(taskData?.policy?.id || false);
        setSelectedPostOrganizationId(userPosts?.find(item => item.id === taskData.holderPostId)?.organization);

        // Загрузка информации о прикрепленных файлах
        const loadedAttachments = taskData?.attachmentToTargets || [];
        console.warn('loadedAttachments', loadedAttachments)
        setAttachments(loadedAttachments);
    }, [taskData]);

    console.log(attachments)
    useEffect(() => {
        resizeTextarea(taskData?.id)
    }, [contentInput])

    const clickFunction = () => {
        updateTask()
        setOpenModal(false)
    }

    const handleClickOpenFilesModal = () => {
        if (isOrder) return

        setOpenAttachmentsModal(true)
    }

    return (
        <>
            <ModalContainer
                setOpenModal={setOpenModal}
                clickFunction={clickFunction}
                disabledButton={isArchive}
                buttonText={isOrder && 'К диалогу'}
                style={isMobile ? { 'width': '95%' } : {}}                 
            >
                <div className={classes.content}>
                    {/* {taskData.type === 'Приказ' && (
                    <div className={classes.titleContainer}>
                        <input type="text" placeholder='Название приказа' />
                    </div>
                )} */}
                    <div className={classes.postContainer}>
                        <select
                            name="stateSelect"
                            disabled={isArchive || isOrder}
                            value={holderPost}
                            onChange={(e) => setHolderPostId(e.target.value)}
                        >
                            {userPosts?.map((item, index) => (
                                <option key={index} value={item.id}>{item.postName}</option>
                            ))}

                        </select>
                    </div>
                    <div className={classes.dateContainer}>
                        <input type="date" disabled={isArchive || isOrder} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        <input type="date" disabled={isArchive || isOrder} value={isArchive ? taskData.dateComplete.split('T')[0] : deadlineDate} onChange={(e) => setDeadlineDate(e.target.value)} />
                    </div>
                    <div className={classes.descriptionContainer}>
                        <textarea
                            name="description"
                            disabled={isArchive || isOrder}
                            id={taskData.id}
                            value={contentInput}
                            onChange={(e) => setContentInput(e.target.value)}
                        ></textarea>
                    </div>
                    <div className={classes.stateContainer}>
                        <select
                            name="stateSelect"
                            disabled={isArchive || isOrder}
                            value={taskStatus}
                            onChange={(e) => setTaskStatus(e.target.value)}
                        >
                            <option value="Активная">Активная</option>
                            <option value="Завершена">Завершена</option>
                            <option value="Удалена">Удалена</option>
                        </select>
                    </div>
                    <div className={classes.attachContainer}>
                        <select name="policy" disabled={isArchive || isOrder} value={selectedPolicy} onChange={(e) => setSelectedPolicy(e.target.value)}>
                            <option value={'null'}>Выберите политику</option>
                            {activeDirectives.map((item, index) => (
                                <option key={index} value={item.id}>{item.policyName}</option>
                            ))}
                            {activeInstructions.map((item, index) => (
                                <option key={index} value={item.id}>{item.policyName}</option>
                            ))}
                        </select>

                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            style={{ display: 'none' }} // Скрываем input
                            onChange={handleFileChange}
                        />
                    </div>


                    <button onClick={() => handleClickOpenFilesModal()} className={classes.customFileButton}>
                        {attachments?.length > 0 ? `Вложений: ${attachments?.length}` : isOrder ? 'Файлы отсутствуют' : 'Выберите файлы'}
                    </button>
                </div>
            </ModalContainer>

            {openAttachmentsModal && (
                <AttachmentModal
                    setOpenModal={setOpenAttachmentsModal}
                    attachments={attachments}
                    setAttachments={setAttachments}
                    isOrder={isOrder} 
                ></AttachmentModal>
            )}
        </>
    )
}
