import React, { useEffect, useState } from 'react'
import InputTextContainer from '@Custom/ContainerForInputText/InputTextContainer';
import Headers from "@Custom/Headers/Headers";
import classes from './desktopConvertPage.module.css'
import { useParams } from 'react-router-dom';
import { notEmpty } from '@helpers/helpers'
import Task from '../TaskContainer/Task'
import { useConvertsHook } from '@hooks/useConvertsHook';
import Input from '../Input';



export default function DesktopConvertPage() {
    const { contactId } = useParams()
  const [isViewArchive, setIsViewArchive] = useState(false)


    const { contactInfo, seenConverts, unseenConverts, archiveConvaerts } = useConvertsHook({ contactId: contactId })


    return (
        <div className={classes.dialog}>
            <Headers name={contactInfo?.userName} sectionName={contactInfo?.postName} avatar={contactInfo?.avatar}>
            </Headers>

            <div className={classes.main}>
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
