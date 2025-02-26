import React, { useState } from 'react'
import classes from './DialogPage.module.css'
import Header from "@Custom/CustomHeader/Header";
import { useConvertsHook } from '@hooks/useConvertsHook';
import { useParams } from 'react-router-dom';
import { Message } from '@Custom/Message/Message';
import Input from './Input';

export const DialogPage = () => {

    const { convertId } = useParams()


    const { currentConvert, messages, senderPostId, senderPostName, sendMessage, refetchGetConvertId, isLoadingGetConvertId } = useConvertsHook(convertId)

    console.log(currentConvert, messages, senderPostId, refetchGetConvertId)



    return (
        <>
            <div className={classes.wrapper}>

                <Header>Chat</Header>
                <div className={classes.body}>

                    {messages.map((item, index) => (
                        <React.Fragment key={index}>
                            <Message
                                userMessage={item?.userMessage}
                            >
                                {item.content}
                            </Message>
                        </React.Fragment>
                    ))}

                </div>
                <footer className={classes.footer}>
                    <Input
                        convertId={currentConvert?.id}
                        sendMessage={sendMessage}
                        senderPostId={senderPostId}
                        senderPostName={senderPostName}
                        refetchMessages={refetchGetConvertId}
                        isLoadingGetConvertId={isLoadingGetConvertId}
                    />
                </footer>
            </div>
        </>
    )
}
