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

  const { contactInfo, allConverts } = useConvertsHook({ contactId: contactId })

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
          {allConverts?.map((item, index) => (
            <React.Fragment key={index}>
              <Task taskData={item}></Task>
            </React.Fragment>
          ))}
        </div>

        <Input></Input>
      </div>

    </>

  )
}
