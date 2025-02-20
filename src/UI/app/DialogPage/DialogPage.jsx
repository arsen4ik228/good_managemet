import React from 'react'
import Header from "@Custom/CustomHeader/Header";
import { useConvertsHook } from '@hooks/useConvertsHook';
import { useParams } from 'react-router-dom';

export const DialogPage = () => {

    const { convertId } = useParams()

    const { currentConvert } = useConvertsHook(convertId)
    console.log(currentConvert)
    return (
        <>
            <Header>Chat</Header>
        </>
    )
}
