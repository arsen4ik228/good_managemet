import React, { useEffect, useState } from 'react'
import InputTextContainer from '@Custom/ContainerForInputText/InputTextContainer';
import Headers from "@Custom/Headers/Headers";
import classes from './desktopConvertPage.module.css'
import { useParams } from 'react-router-dom';
import { notEmpty } from '@helpers/helpers'
import Task from '../TaskContainer/Task'
import { useConvertsHook } from '@hooks/useConvertsHook';
import { ConfigProvider, Tour } from "antd";
import ruRU from "antd/locale/ru_RU";
import Input from '../Input';



export default function DesktopConvertPage() {
    const { contactId } = useParams()
    const [isViewArchive, setIsViewArchive] = useState(false)
    const [open, setOpen] = useState(false)


    const { contactInfo, seenConverts, unseenConverts, archiveConvaerts } = useConvertsHook({ contactId: contactId })

    const steps = [
        {
            title: "Выбор поста",
            description: "Выберите Пост отправителя",
            target: () => document.querySelector('[data-tour="current-post"]'),
        },
        {
            title: "Выбор даты",
            description: "Выберите дату начала и завершения переписки",
            target: () => document.querySelector('[data-tour="date-for-task"]'),
        },
        {
            title: "Создать личную переписку",
            description: "Нажмите для создания личной переписки",
            target: () => document.querySelector('[data-tour="send-message"]'),
        },
    ].filter((step) => !step.disabled);

    return (
        <div className={classes.dialog}>
            <Headers name={contactInfo?.userName} sectionName={contactInfo?.postName} avatar={contactInfo?.avatar} funcActiveHint={() => setOpen(true)}>
            </Headers>

            <div className={classes.main}>
                <ConfigProvider locale={ruRU}>
                    <Tour open={open} onClose={() => setOpen(false)} steps={steps} />
                </ConfigProvider>
                <div className={classes.body}>
                    <div className={classes.archiveButton} onClick={() => setIsViewArchive(!isViewArchive)}>
                        {isViewArchive ? 'Скрыть ' : 'Показать'} завершенные задачи
                    </div>
                    {isViewArchive ? (
                        <>
                            {archiveConvaerts?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Task taskData={item} isArchive={true}></Task>
                                </React.Fragment>
                            ))}
                        </>
                    ) : (
                        <>
                            {unseenConverts?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Task taskData={item}></Task>
                                </React.Fragment>
                            ))}
                            {unseenConverts?.length > 0 && (
                                <div className={classes.unSeenMessagesInfo}> Новые сообщения </div>
                            )}
                            {seenConverts?.map((item, index) => (
                                <React.Fragment key={index}>
                                    <Task taskData={item}></Task>
                                </React.Fragment>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <Input reciverPostId={contactInfo?.postId}></Input>

        </div>
    )
}
