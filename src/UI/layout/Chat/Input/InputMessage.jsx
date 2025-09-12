import React, { useState } from 'react'
import classes from './Input.module.css'
import sendIcon from '@Custom/icon/send.svg';
import calenderIcon from '@Custom/icon/icon _ calendar.svg';
import attachIcon from '@Custom/icon/subbar _ attach.svg';
import icon_attachPpolicy from '@image/icon_attach policy.svg'
import TextArea from 'antd/es/input/TextArea';
import { Select, Input } from 'antd';
import { usePostsHook, useConvertsHook } from '@hooks'
import { Option } from 'antd/es/mentions';
import { useParams } from 'react-router-dom';

export default function InputMessage({ convertStatusChange, approveConvert, finishConvert }) {

    const { convertId } = useParams()

    const [contentInputPolicyId, setContentInputPolicyId] = useState("");
    const [contentInput, setContentInput] = useState("");
    const [selectedPolicy, setSelectedPolicy] = useState(false);
    const [files, setFiles] = useState();
    const [unpinFiles, setUnpinFiles] = useState([]);

    const TYPE_OPTIONS = [
        { value: 'Личная', label: 'Личная' },
        { value: 'Приказ', label: 'Приказ' },
    ]

    const {
        userPosts
    } = usePostsHook()

    const {
        currentConvert,
        senderPostId,
        userInfo,
        senderPostName,
        senderPostForSocket,
        sendMessage,
        refetchGetConvertId,
        isLoadingGetConvertId,
        isFetchingGetConvartId,
        isErrorGetConvertId,
        organizationId
    } = useConvertsHook({ convertId });

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
        //    return convertStatusMessage + text?.slice(0, contentInputPolicyId?.startChar) + contentInputPolicyId?.str + text.slice(contentInputPolicyId?.endChar);
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
            // reset();

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
console.log(contentInput)
    return (

        <div className={classes.wrapper}>
            <div className={classes.upperContainer}>
                <Select className={classes.selectItem} options={TYPE_OPTIONS} />
                <Input placeholder='Новая тема'/>
                <Select className={classes.selectItem} dropdownMatchSelectWidth={false}>
                    {userPosts?.map((item, index) => (
                        <Option key={index} value={item.id}>
                            {item.postName}
                        </Option>
                    ))}
                </Select>
                <Select className={classes.selectItem} />
            </div>
            <div className={classes.bottomContainer}>
                <div className={classes.iconSection}>
                    <img src={icon_attachPpolicy} alt="icon_attachPpolicy" />
                    <img src={attachIcon} alt="attachIcon" />
                    <img src={calenderIcon} alt="calenderIcon" />
                </div>
                <div className={classes.textInputSection}>
                    <TextArea
                        autoSize={{
                            minRows: 1,
                            maxRows: 6
                        }}
                        value={contentInput} onChange={(e) => setContentInput(e.target.value)}
                        placeholder='Напишите сообщение'
                    />
                </div>
                <div className={classes.sendSection}>
                    <img src={sendIcon} alt="calenderIcon" onClick={() => send()} />

                </div>
            </div>
        </div>

    )
}
