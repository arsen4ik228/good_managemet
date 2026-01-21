import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import classes from './WorkingPlanInput.module.css'
import TextArea from 'antd/es/input/TextArea'
import { Select, Input, Spin, message } from 'antd';
import sendIcon from '@Custom/icon/send.svg';
import FilesModal from '@app/WorkingPlanPage/mobile/Modals/FilesModal/FilesModal';
import { useTargetsHook, useConvertsHook } from '@hooks';
import { useWorkingPlanForm } from '../../../../contexts/WorkingPlanContext';
import icon_attach from '@image/icon_ attach.svg'
import { SimpleFileUploadModal } from '../../../Custom/SimpleFilesUploadModal/SimpleFilesUploadModal';
import FilesMessages from '../../../Custom/Message/FilesMessages';
import FilesInput from '../../../Custom/FilesInput/FilesInput';

export default function WorkingPlanInput() {

    const textAreaRef = useRef(null);
    const [openFilesModal, setOpenFilesModal] = useState(false);
    const [openCalendarModal, setOpenCalendarModal] = useState(false);
    const [contentInputPolicyId, setContentInputPolicyId] = useState("");
    const [selectedPolicy, setSelectedPolicy] = useState(false);
    const [files, setFiles] = useState();
    const [unpinFiles, setUnpinFiles] = useState([]);
    const [isRequestInProgress, setIsRequestInProgress] = useState(false);



    const {
        postTargets,
        isLoadingPostTargetsMutation,
        isSuccessPostTargetsMutation,
        isErrorPostTargetsMutation,
        ErrorPostTargetsMutation,

        updateTargets,
        isLoadingUpdateTargetsMutation,
        isSuccessUpdateTargetsMutation,
        isErrorUpdateTargetsMutation,
        ErrorUpdateTargetsMutation,
    } = useTargetsHook();

    const {
        dateStart,
        deadline,
        senderPost,
        contentInput,
        setContentInput,
        setDeadline,
        isEdit,
        taskId,
        setTaskId,
        setIsEdit
    } = useWorkingPlanForm()


    const sendClick = () => {
        if (isEdit)
            handleUpdateTask(true)
        else
            createTargets()
    }


    const handleUpdateTask = async () => {
        try {
            const updateData = {
                _id: taskId,
                type: 'Личная',
                content: contentInput,
                holderPostId: senderPost,
                dateStart: dateStart?.format('YYYY-MM-DD'),
                deadline: deadline?.format('YYYY-MM-DD'),
                // policyId: values.policy === 'null' ? null : values.policy,
                // attachmentIds: attachments.map(att => att.attachment.id)
            };
            console.log(updateData)
            await updateTargets(updateData).unwrap();
            message.success('Задача успешно обновлена');

        } catch (error) {
            console.error("Ошибка:", error);
            message.error('Произошла ошибка при обновлении задачи');
        } finally {
            reset()
        }
    };

    const handleUpdateDate = async () => {
        try {
            const updateData = {
                _id: taskId,
                type: 'Личная',
                // content: contentInput,
                // holderPostId: senderPost,
                dateStart: dateStart?.format('YYYY-MM-DD'),
                deadline: deadline?.format('YYYY-MM-DD'),
                // policyId: values.policy === 'null' ? null : values.policy,
                // attachmentIds: attachments.map(att => att.attachment.id)
            };
            console.log(updateData)
            await updateTargets(updateData).unwrap();
            // message.success('Задача успешно обновлена');

        } catch (error) {
            console.error("Ошибка:", error);
            message.error('Произошла ошибка при обновлении задачи');
        } 
    };

    const createTargets = async () => {
        setIsRequestInProgress(true);


        try {
            if (!contentInput) return

            const Data = {}

            Data.type = 'Личная'
            Data.orderNumber = 1
            Data.content = contentInput
            Data.holderPostId = senderPost
            Data.dateStart = dateStart
            Data.deadline = deadline
            Data.targetState = 'Активная'
            if (selectedPolicy)
                Data.policyId = selectedPolicy
            if (files) {
                Data.attachmentIds = files
                    .filter(item => !unpinFiles.includes(item?.attachment.id))
                    .map(element => element?.attachment.id)
            }

            //(Data)

            await postTargets({
                ...Data
            })
                .unwrap()
                .then(() => {
                    reset()
                })
                .catch((error) => {
                    console.error("Ошибка:", JSON.stringify(error, null, 2));
                });

            setFiles();
            setUnpinFiles([]);
        } catch (error) {
            message.error(`Произошла ошибка при создании задачи: ${error?.data?.message || ""}`);
        } finally {
            setIsRequestInProgress(false);

        }
    }

    const reset = () => {
        setContentInput('')
        setDeadline(null)
        setIsEdit(false)
        setTaskId(null)
    }

    const handleGlobalKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (contentInput.trim() && !isRequestInProgress) {
                createTargets();
            }
        }
    }, [contentInput, isRequestInProgress]);

    // Регистрируем глобальный обработчик
    useLayoutEffect(() => {
        document.addEventListener('keydown', handleGlobalKeyDown);

        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [handleGlobalKeyDown]);

    console.log(files)

    useEffect(() => {
        if (isEdit)
            handleUpdateDate()

    }, [dateStart, deadline, isEdit])

    return (
        <div className={classes.wrapper}>
            <div>
                {files && (
                    <FilesInput files={files} setFiles={setFiles}></FilesInput>
                )}
            </div>
            <div className={classes.bottomContainer}>
                <div className={classes.iconSection}>

                    {/* <FilesModal
                        openModal={openFilesModal}
                        setOpenModal={setOpenFilesModal}
                        policyId={selectedPolicy}
                        setPolicyId={setSelectedPolicy}
                        files={files}
                        setFiles={setFiles}
                        unpinFiles={unpinFiles}
                        setUnpinFiles={setUnpinFiles}
                        // organizationId={organizationId}
                        setContentInput={setContentInput}
                        setContentInputPolicyId={setContentInputPolicyId}
                    /> */}
                    {/* <img src={icon_attach} alt="icon_attach" /> */}
                    <SimpleFileUploadModal setParentFiles={setFiles}></SimpleFileUploadModal>
                </div>
                <div className={classes.textInputSection}>
                    <TextArea
                        ref={textAreaRef}
                        autoFocus
                        disabled={isLoadingPostTargetsMutation}
                        style={{ height: "48px" }}
                        autoSize={{
                            minRows: 1,
                            maxRows: 6
                        }}
                        value={contentInput} onChange={(e) => setContentInput(e.target.value)}
                        placeholder='Напишите задачу'
                    />
                    {(isLoadingPostTargetsMutation) && (
                        <div className={classes.spin}>
                            <Spin size="big" />
                        </div>
                    )}
                </div>
                <div className={classes.sendSection}>
                    {(isLoadingPostTargetsMutation) ? (
                        <Spin size="small" />
                    ) : (
                        <img src={sendIcon} alt="calenderIcon" onClick={() => sendClick()} />
                    )}
                </div>
            </div>
        </div>
    )
}
