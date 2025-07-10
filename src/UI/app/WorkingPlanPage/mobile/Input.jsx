import React, { useState, useEffect } from 'react';
import InputTextContainer from '@Custom/ContainerForInputText/InputTextContainer.jsx';
import { useTargetsHook, useConvertsHook } from '@hooks';
import { deleteDraft, loadDraft, saveDraft } from '@helpers/indexedDB';
import OrderModal from '@Custom/OrderModal/OrderModal';
import {
    message,
} from 'antd';


const Input = ({ userPosts }) => {
    const [openOrderModal, setOpenOrderModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState();
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [deadlineDate, setDeadlineDate] = useState(new Date().toISOString().split('T')[0]);
    const [contentInput, setContentInput] = useState('');
    const [selectedPolicy, setSelectedPolicy] = useState(false);
    const [selectedPostOrganizationId, setSelectedPostOrganizationId] = useState();
    const [files, setFiles] = useState();
    const [unpinFiles, setUnpinFiles] = useState([]);
    const [convertTheme, setConvertTheme] = useState('');
    const [reciverPostId, setReciverPostId] = useState();
    const [isUpdating, setIsUpdating] = useState(false);

    const idTextarea = 1001

    const {
        postTargets,
        isLoadingPostTargetsMutation,
        isSuccessPostTargetsMutation,
        isErrorPostTargetsMutation,
        ErrorPostTargetsMutation
    } = useTargetsHook();

    const {
        postConvert,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,
    } = useConvertsHook();

    const reset = () => {
        setStartDate(new Date().toISOString().split('T')[0]);
        setDeadlineDate(new Date().toISOString().split('T')[0]);
        setContentInput('');
        setSelectedPolicy(false);
        deleteDraft('DraftDB', 'drafts', 1001);
    };

    const createTargets = async () => {

        try {
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

            setFiles();
            setUnpinFiles([]);
        } catch (error) {
            message.error(`Произошла ошибка при создании задачи: ${error?.data?.message || ""}`);
        } finally {
            setIsUpdating(false);

        }
    }

    const createOrder = async () => {

        if (!contentInput) {
            message.error(`Вы не заполнили текст для задачи конверта!`);
        }

        let attachmentIds = [];
        if (files) {
            attachmentIds = files
                .filter(item => !unpinFiles.includes(item.id)) // Фильтруем файлы
                .map(element => element.id); // Преобразуем в массив ID
        }

        const Data = {}

        Data.convertTheme = convertTheme
        Data.convertType = "Приказ"
        Data.deadline = deadlineDate
        Data.senderPostId = selectedPost
        Data.reciverPostId = reciverPostId
        Data.messageContent = 'затычка в попу'
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

            message.success(`Конверт отправлен!`);
    }

    useEffect(() => {
        if (userPosts.length > 0) {
            setSelectedPost(userPosts[0].id);
            setSelectedPostOrganizationId(userPosts[0].organization);
        }
    }, [userPosts]);

    useEffect(() => {
        loadDraft('DraftDB', 'drafts', idTextarea, setContentInput);
    }, []);

    useEffect(() => {
        saveDraft('DraftDB', 'drafts', idTextarea, contentInput);
    }, [contentInput]);

    console.log(reciverPostId)

    return (
        <>
            <InputTextContainer
                userPosts={userPosts}
                selectedPost={selectedPost}
                setSelectedPost={setSelectedPost}
                startDate={startDate}
                setStartDate={setStartDate}
                deadlineDate={deadlineDate}
                setDeadlineDate={setDeadlineDate}
                contentInput={contentInput}
                setContentInput={setContentInput}
                selectedPolicy={selectedPolicy}
                setSelectedPolicy={setSelectedPolicy}
                selectedPostOrganizationId={selectedPostOrganizationId}
                setSelectedPostOrganizationId={setSelectedPostOrganizationId}
                files={files}
                setFiles={setFiles}
                unpinFiles={unpinFiles}
                setUnpinFiles={setUnpinFiles}
                convertTheme={convertTheme}
                setConvertTheme={setConvertTheme}
                reciverPostId={reciverPostId}
                setReciverPostId={setReciverPostId}
                sendClick={createTargets}
                shareClick={() => setOpenOrderModal(true)}
                idTextarea={idTextarea}
                loadingRequestStatus={isLoadingPostTargetsMutation || isLoadingPostPoliciesMutation}
            />

            {openOrderModal && (
                <OrderModal
                    setModalOpen={setOpenOrderModal}
                    setReciverPost={setReciverPostId}
                    selectedPost={selectedPost}
                    setTheme={setConvertTheme}
                    buttonFunc={createOrder}
                    convertTheme={convertTheme}
                />
            )}
        </>
    );
};

export default Input;