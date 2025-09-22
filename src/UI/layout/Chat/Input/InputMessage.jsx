import React, { use, useCallback, useEffect, useState } from 'react'
import classes from './Input.module.css'
import sendIcon from '@Custom/icon/send.svg';
import calenderIcon from '@Custom/icon/icon _ calendar.svg';
import attachIcon from '@Custom/icon/subbar _ attach.svg';
import icon_attachPpolicy from '@image/icon_attach policy.svg'
import TextArea from 'antd/es/input/TextArea';
import FilesModal from '@app/WorkingPlanPage/mobile/Modals/FilesModal/FilesModal';
import CalendarModal from '@app/WorkingPlanPage/mobile/Modals/CalendarModal/CalendarModal';
import { Select, Input, Spin, message } from 'antd';
import { usePostsHook, useConvertsHook } from '@hooks'
import { Option } from 'antd/es/mentions';
import { deleteDraft, loadDraft, saveDraft } from "@helpers/indexedDB";
import { useParams } from 'react-router-dom';
import { useRightPanel } from '../../../../hooks';

const TYPE_OPTIONS = [
    { value: 'Личная', label: 'Личная' },
    // { value: 'Приказ', label: 'Приказ' },
]

export default function InputMessage({ onCreate = false, onCalendar = false, convertStatusChange, approveConvert, finishConvert }) {

    const { contactId, convertId } = useParams()

    const idTextarea = 745264
    const [openFilesModal, setOpenFilesModal] = useState(false);
    const [openCalendarModal, setOpenCalendarModal] = useState(false);
    const [contentInputPolicyId, setContentInputPolicyId] = useState("");
    const [contentInput, setContentInput] = useState("");
    const [selectedPolicy, setSelectedPolicy] = useState(false);
    const [files, setFiles] = useState();
    const [unpinFiles, setUnpinFiles] = useState([]);

    const [convertTheme, setConvertTheme] = useState()
    const [startDate, setStartDate] = useState()
    const [deadlineDate, setDeadlineDate] = useState()
    const [senderPost, setSenderPost] = useState(null)
    const [reciverPostId, setReciverPostId] = useState()
    const [convertType, setConvertType] = useState(TYPE_OPTIONS[0].value);


    const {
        userPosts
    } = usePostsHook()

    const {
        updatePanelProps
    } = useRightPanel()

    const {
        currentConvert,
        contactInfo,
        senderPostId,
        userInfo,
        senderPostName,
        senderPostForSocket,
        sendMessage,
        isLoadingSendMessages,
        refetchGetConvertId,
        isLoadingGetConvertId,
        isFetchingGetConvartId,
        isErrorGetConvertId,
        organizationId,

        postConvert,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,
    } = useConvertsHook({ convertId: convertId, contactId: contactId });

    const reset = () => {
        // setStartDate(new Date().toISOString().split("T")[0]);
        // setDeadlineDate(new Date().toISOString().split("T")[0]);
        setContentInput("");
        setSelectedPolicy(false);
        deleteDraft("DraftDB", "drafts", idTextarea);
        setContentInputPolicyId("");
        setConvertTheme('')
    };

    const transformText = (text, convertStatus) => {
        const statusMessages = {
            approve: 'Приказ согласован: ',
            cancel: 'Приказ отменён: '
        };

        const convertStatusMessage = convertStatus
            ? statusMessages[convertStatus]
            : '';

        if (!contentInputPolicyId) return convertStatusMessage + text;

        const { startChar, str, endChar } = contentInputPolicyId;
        return convertStatusMessage + text?.slice(0, startChar) + str + text?.slice(endChar);
        // return convertStatusMessage + text?.slice(0, contentInputPolicyId?.startChar) + contentInputPolicyId?.str + text.slice(contentInputPolicyId?.endChar);
    };

    const send = async () => {
        if (contentInput.trim() === "" && files.length === 0) return;

        // Удаляем черновик
        // deleteDraft("DraftDB", "drafts", idTextArea);

        try {
            // Подготовка данных для отправки
            const Data = {};
            if (files && files?.length > 0) {
                Data.attachmentIds = files.map((item) => item.id);
            }

            // Отправка сообщения
            await sendMessage({
                convertId,
                content: transformText(contentInput, convertStatusChange),
                postId: senderPostId,
                ...Data,
            }).unwrap();

            // Если есть convertStatusChange, выполняем дополнительное действие
            if (convertStatusChange) {
                try {
                    if (convertStatusChange === 'approve') {
                        await approveConvert(convertId);
                    } else {
                        await finishConvert(convertId);
                    }

                } catch (error) {
                    console.error("Ошибка в approveConvert/finishConvert:", error);
                    throw error; // Пробрасываем ошибку дальше
                }
            }

            // Сброс состояния
            reset();

            // Если нужно вернуться назад после approve
            //   if (convertStatusChange === 'approve') {
            //     navigate(-1);
            //   }

        } catch (error) {
            console.error("Ошибка в sendMessage:", error);
            if (error.response) {
                console.error("Детали ошибки:", error.response.data);
            }
            // Можно добавить обработку ошибки (например, показать уведомление)
        }
    };

    const createPersonalLetter = async () => {

        if (!contentInput) return

        const Data = {}

        Data.convertTheme = convertTheme
        Data.convertType = "Переписка"
        Data.deadline = deadlineDate
        Data.senderPostId = userPosts?.[0]?.id
        Data.reciverPostId = contactInfo?.postId
        Data.messageContent = contentInput


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
        Data.senderPostId = userPosts?.[0]?.id
        Data.reciverPostId = contactInfo?.postId
        Data.messageContent = contentInput
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

    const handlerSendClick = () => {
        if (convertId)
            send()
        else if (convertType === 'Личная') {
            createPersonalLetter()
        }
        else {
            createOrder()
        }
    }

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (contentInput.trim()) {
                handlerSendClick();
            }
        }
    }, [contentInput]);

    useEffect(() => {
        loadDraft("DraftDB", "drafts", idTextarea, setContentInput);
    }, []);

    useEffect(() => {
        saveDraft("DraftDB", "drafts", idTextarea, contentInput);
    }, [contentInput]);

    useEffect(() => {
        if (!contactInfo) return
        updatePanelProps({ name: contactInfo.userName, postsNames: contactInfo.postName })
        setReciverPostId(contactInfo.postId)

    }, [contactInfo])

    useEffect(() => {
        if (userPosts && userPosts.length > 0 && senderPost === null) {
            setSenderPost(userPosts[0]?.id);
        }
    }, [userPosts, senderPost]);

    console.log(reciverPostId, senderPost)
    return (

        <div className={classes.wrapper}>
            {onCreate && (
                <div className={classes.upperContainer}>
                    <Select
                        className={classes.selectItem}
                        options={TYPE_OPTIONS}
                        value={convertType}
                        onChange={(value) => setConvertType(value)} // у Select onChange возвращает value напрямую
                    />
                    <Input
                        placeholder='Новая тема'
                        value={convertTheme}
                        onChange={(e) => setConvertTheme(e.target.value)}
                    />
                    <Select className={classes.selectItem}
                        dropdownMatchSelectWidth={false}
                        onChange={(e) => setSenderPost(e)}
                        defaultValue={userPosts?.[0]?.id}
                    >
                        {userPosts?.map((item, index) => (
                            <Option key={index} value={item.id}>
                                {item.postName}
                            </Option>
                        ))}
                    </Select>
                    <Select
                        className={classes.selectItem}
                        value={reciverPostId} // используем value вместо defaultValue
                        onChange={(value) => setReciverPostId(value)}
                    >
                        {contactInfo?.posts?.map((item, index) => (
                            <Option key={index} value={item?.id}>{item?.postName}</Option>
                        ))}
                    </Select>
                </div>
            )}
            <div className={classes.bottomContainer}>
                <div className={classes.iconSection}>
                    {/* <img src={icon_attachPpolicy} alt="icon_attachPpolicy" />
                    <img src={attachIcon} alt="attachIcon" />
                    <img src={calenderIcon} alt="calenderIcon" /> */}
                    {onCalendar && (
                        <CalendarModal
                            openModal={openCalendarModal}
                            setOpenModal={setOpenCalendarModal}
                            dateStart={startDate}
                            setDateStart={setStartDate}
                            dateDeadline={deadlineDate}
                            setDateDeadline={setDeadlineDate}
                        // disableDateStart={disableDateStart}
                        />
                    )}
                    <FilesModal
                        openModal={openFilesModal}
                        setOpenModal={setOpenFilesModal}
                        policyId={selectedPolicy}
                        setPolicyId={setSelectedPolicy}
                        // postOrganizationId={selectedPostOrganizationId}
                        files={files}
                        setFiles={setFiles}
                        unpinFiles={unpinFiles}
                        setUnpinFiles={setUnpinFiles}
                        organizationId={organizationId}
                        setContentInput={setContentInput}
                        setContentInputPolicyId={setContentInputPolicyId}
                    />

                </div>
                <div className={classes.textInputSection}>
                    <TextArea
                        disabled={isLoadingSendMessages}
                        autoSize={{
                            minRows: 1,
                            maxRows: 6
                        }}
                        value={contentInput} onChange={(e) => setContentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder='Напишите сообщение'
                    />
                    {isLoadingSendMessages && (
                        <div className={classes.spin}>
                            <Spin size="big" />
                        </div>
                    )}
                </div>
                <div className={classes.sendSection}>
                    {isLoadingSendMessages ? (
                        <Spin size="small" />
                    ) : (
                        <img src={sendIcon} alt="calenderIcon" onClick={() => handlerSendClick()} />
                    )}
                </div>
            </div>
        </div>

    )
}
