import React, { useEffect, useState } from 'react'
import classes from './InputTextContainer.module.css'
import sendIcon from '@Custom/icon/send.svg'
import shareIcon from '@Custom/icon/subbar _ share.svg'
import calenderIcon from '@Custom/icon/icon _ calendar.svg'
import attachIcon from '@Custom/icon/subbar _ attach.svg'
import { notEmpty, resizeTextarea } from '@helpers/helpers';
import CalendarModal from '../Modals/CalendarModal/CalendarModal'
import FilesModal from '../Modals/FilesModal/FilesModal'
import OrderModal from '../Modals/OrderModal/OrderModal'
import { useTargetsHook } from '@hooks'
import { useConvertsHook } from '@hooks'
import { deleteDraft, loadDraft, saveDraft } from '@helpers/indexedDB'

export default function InputTextContainer({ userPosts }) {

    const [openCalendarModal, setOpenCalendarModal] = useState(false)
    const [openFilesModal, setOpenFilesModal] = useState(false)
    const [openOrderModal, setOpenOrderModal] = useState(false)

    const [selectedPost, setSelectedPost] = useState()
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
    const [deadlineDate, setDeadlineDate] = useState(new Date().toISOString().split('T')[0])
    const [contentInput, setContentInput] = useState()
    const [selectedPolicy, setSelectedPolicy] = useState(false)
    const [selectedPostOrganizationId, setSelectedPostOrganizationId] = useState()
    const [files, setFiles] = useState()
    const [unpinFiles, setUnpinFiles] = useState([])

    const [convertTheme, setConvertTheme] = useState('')
    const [reciverPostId, setReciverPostId] = useState()
    console.log(reciverPostId)
    const idTextarea = 1001
    const dbName = 'DraftDB'
    const storeName = 'drafts'


    const {
        postTargets,
        isLoadingPostTargetsMutation,
        isSuccessPostTargetsMutation,
        isErrorPostTargetsMutation,
        ErrorPostTargetsMutation
    } = useTargetsHook()

    const {
        postConvert,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,

    } = useConvertsHook()


    const reset = () => {
        setStartDate(new Date().toISOString().split('T')[0])
        setDeadlineDate(new Date().toISOString().split('T')[0])
        setContentInput('')
        setSelectedPolicy(false)
        deleteDraft(dbName, storeName, idTextarea)
    }
    console.warn(unpinFiles)
    const createTargets = async () => {

        if (!contentInput) return

        const Data = {}

        Data.type = 'Личная'
        Data.orderNumber = 1
        Data.content = contentInput
        Data.holderPostId = selectedPost
        Data.dateStart = startDate
        Data.deadline = deadlineDate
        if (selectedPolicy)
            Data.policyId = selectedPolicy
        if (files) {
            Data.attachmentIds = files
                .filter(item => !unpinFiles.includes(item.id))
                .map(element => element.id)
        }


        console.log(Data)

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
    }

    const createOrder = async () => {

        if (!contentInput) return

        let attachmentIds = [];
        if (files) {
            attachmentIds = files
                .filter(item => !unpinFiles.includes(item.id)) // Фильтруем файлы
                .map(element => element.id); // Преобразуем в массив ID
        }

        const Data = {}

        Data.convertTheme = convertTheme
        Data.expirationTime = 999
        Data.convertType = "Приказ"
        Data.convertPath = 'Прямой'
        Data.dateFinish = deadlineDate
        Data.senderPostId = selectedPost
        Data.reciverPostId = reciverPostId
        Data.targetCreateDto = {
            type: "Приказ",
            orderNumber: 1,
            content: contentInput,
            holderPostId: reciverPostId,
            dateStart: startDate,
            deadline: deadlineDate,
            ...(attachmentIds.length > 0 && {
                attachmentIds: attachmentIds
            })
        }

        await postConvert({
            ...Data
        })
            .unwrap()
            .then(() => {
                reset()
            })
            .catch((error) => {
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });

    }

    const selectPost = (e) => {
        const value = e.target.value;
        if (value) {
            const [postId, organization] = value.split(' ');
            setSelectedPost(postId);
            setSelectedPostOrganizationId(organization);
        }
    };


    useEffect(() => {
        if (!notEmpty(userPosts)) return

        setSelectedPost(userPosts[0].id)
        setSelectedPostOrganizationId(userPosts[0].organization)
    }, [userPosts])

    useEffect(() => {
        loadDraft(dbName, storeName, idTextarea, setContentInput);
    }, []);

    // Сохраняем черновик при изменении текста
    useEffect(() => {
        setTimeout(resizeTextarea(idTextarea), 0)
        saveDraft(dbName, storeName, idTextarea, contentInput);
    }, [contentInput]);

    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.body}>
                    <div className={classes.choosePostContainer}>
                        <select
                            name="choosePost"
                            // value={selectedPost}
                            onChange={selectPost}
                        >
                            {userPosts.map((item, index) => (
                                <option key={index} value={`${item.id} ${item.organization}`}>{item.postName}</option>
                            ))}
                        </select>
                    </div>
                    <div className={classes.inputTextContainer}>
                        <div className={classes.buttonSection}>
                            <img src={attachIcon} alt="attachIcon" onClick={() => setOpenFilesModal(true)} />
                            <img src={calenderIcon} alt="calenderIcon" onClick={() => setOpenCalendarModal(true)} />
                        </div>
                        <div className={classes.inputText}>
                            {/* <TextAreaWithDrfatState
                                idTextarea={idTextarea}
                                contentInput={contentInput}
                                setContentInput={setContentInput}
                            ></TextAreaWithDrfatState> */}
                            <textarea
                                id={idTextarea}
                                value={contentInput}
                                onChange={(e) => setContentInput(e.target.value)}
                            />
                        </div>
                        <div className={classes.buttonSection}>
                            <img src={shareIcon} alt="shareIcon" onClick={() => setOpenOrderModal(true)} />
                            <img src={sendIcon} alt="sendIcon" onClick={() => createTargets()} />
                        </div>
                    </div>
                </div>
            </div>

            {openCalendarModal && (
                <CalendarModal
                    setOpenModal={setOpenCalendarModal}
                    dateStart={startDate}
                    setDateStart={setStartDate}
                    dateDeadline={deadlineDate}
                    setDateDeadline={setDeadlineDate}
                ></CalendarModal>
            )}

            {openFilesModal && (
                <FilesModal
                    setOpenModal={setOpenFilesModal}
                    policyId={selectedPolicy}
                    setPolicyId={setSelectedPolicy}
                    postOrganizationId={selectedPostOrganizationId}
                    files={files}
                    setFiles={setFiles}
                    unpinFiles={unpinFiles}
                    setUnpinFiles={setUnpinFiles}
                ></FilesModal>
            )}

            {openOrderModal && (
                <OrderModal
                    setModalOpen={setOpenOrderModal}
                    setReciverPost={setReciverPostId}
                    selectedPost={selectedPost}
                    setTheme={setConvertTheme}
                    buttonFunc={createOrder}
                ></OrderModal>
            )}

        </>
    )
}
