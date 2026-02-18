import React from 'react'
import MainContentContainer from '../../../Custom/MainContentContainer/MainContentContainer'
import ChatContainer from '../ChatContainer/ChatContainer'
import AddedWatchers from './AddedWatchers'

export default function CreateNewConvertPage() {


    return (
        <MainContentContainer
            component={<AddedWatchers></AddedWatchers>}
        >
            <ChatContainer onCalendar={true} onCreate={true} hiddenPopconfirm={true}></ChatContainer>
        </ MainContentContainer>
    )
}
