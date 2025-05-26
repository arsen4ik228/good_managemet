import React, { useEffect, useState } from 'react'
import classes from './ConvertsPage.module.css'
import { useConvertsHook } from '@hooks';
import { useParams } from 'react-router-dom';
import { notEmpty } from '@helpers/helpers'
import Task from './TaskContainer/Task'
import Header from "@Custom/CustomHeader/Header";
import Input from './Input';

export const ConvertsPage = () => {

  const { contactId } = useParams()

  const [isViewArchive, setIsViewArchive] = useState(false)

  const { contactInfo, seenConverts, unseenConverts, archiveConvaerts } = useConvertsHook({ contactId: contactId })



  return (
    <>
      <div className={classes.wrapper}>
        <Header
          title={contactInfo?.userName}
          avatar={contactInfo?.avatar}
        >
          {contactInfo?.postName}
        </Header>
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

        <Input reciverPostId={contactInfo?.postId}></Input>
      </div>

    </>

  )
}
