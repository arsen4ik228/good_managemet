import React from 'react'
import MainContentContainer from '../../../Custom/MainContentContainer/MainContentContainer'
import ChatContainer from '../ChatContainer/ChatContainer'

export default function CreateNewConvertPage() {
    return (
        <MainContentContainer>
            <ChatContainer onCalendar={true} onCreate={true}></ChatContainer>
        </MainContentContainer>
    )
}
