import React, { useState, useEffect } from 'react';
import InputTextContainer from '@Custom/ContainerForInputText/InputTextContainer.jsx';
import { useConvertsHook, usePostsHook } from '@hooks';
import { deleteDraft, loadDraft, saveDraft } from '@helpers/indexedDB';


const Input = ({reciverPostId}) => {
    const [selectedPost, setSelectedPost] = useState();
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [deadlineDate, setDeadlineDate] = useState(new Date().toISOString().split('T')[0]);
    const [contentInput, setContentInput] = useState('');
    const [selectedPolicy, setSelectedPolicy] = useState(false);
    const [selectedPostOrganizationId, setSelectedPostOrganizationId] = useState();
    const [files, setFiles] = useState();
    const [unpinFiles, setUnpinFiles] = useState([]);
    const [convertTheme, setConvertTheme] = useState('');

    const idTextarea = 1851

    const {
        userPosts
    } = usePostsHook()

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


    const createPersonalLetter = async () => {

        if (!contentInput) return

        const Data = {}

        Data.convertTheme = contentInput
        Data.expirationTime = 999
        Data.convertType = "Переписка"
        Data.convertPath = 'Прямой'
        Data.dateFinish = deadlineDate
        Data.senderPostId = selectedPost
        Data.reciverPostId = reciverPostId
        Data.messageContent = 'затычка в попу'
       

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

    useEffect(() => {
        if (userPosts?.length > 0) {
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
                // reciverPostId={reciverPostId}
                // setReciverPostId={setReciverPostId}
                sendClick={createPersonalLetter}
                //shareClick={() => setOpenOrderModal(true)}
                idTextarea={idTextarea}
                offShareIcon={true}
                offAttachIcon={true}
                disableDateStart={true}
            />

        </>
    );
};

export default Input;