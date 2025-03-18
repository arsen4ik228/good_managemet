import React, { useEffect, useState } from 'react'
import classes from './ConvertsPage.module.css'
import { useConvertsHook } from '@hooks/useConvertsHook';
import { useParams } from 'react-router-dom';
import { notEmpty } from '@helpers/helpers'
import Task from './TaskContainer/Task'
import Header from "@Custom/CustomHeader/Header";
import Input from './Input';

export const ConvertsPage = () => {

  const { userIds } = useParams()
  const [converts, setConverts] = useState()
  const [userInfo, setUserInfo] = useState()

  const { allConverts, refetchGetConverts } = useConvertsHook()
  console.log(allConverts)

  useEffect(() => {
    if (!notEmpty(allConverts)) return

    const user = allConverts.find(item => item.userIds === userIds)
    if (!user) return

    setConverts(user.converts)
    setUserInfo(user)
  }, [userIds, allConverts])


  console.log(converts, userInfo)
  return (
    <>
      <div className={classes.wrapper}>
        <Header
          title={userInfo?.employee}
          avatar={userInfo?.avatar_url}
        >
          {userInfo?.postName}
        </Header>
        <div className={classes.body}>
          {converts?.map((item, index) => (
            <React.Fragment key={index}>
              <Task taskData={item}></Task>
            </React.Fragment>
          ))}
        </div>

          <Input reciverPostId={userInfo?.postId}></Input>
      </div>

    </>

  )
}
