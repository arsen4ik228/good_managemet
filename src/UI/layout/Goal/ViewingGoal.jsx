import React from 'react'
import TextArea from '../../Custom/TextArea/TextArea'

export const ViewingGoal = ({ arrGoals }) => {

    const stringGoal = arrGoals?.join('\n\n')
    const orgName = localStorage.getItem('name')
    

    return (
        <>
            <div style={{ marginTop: '15px' }}>

                <TextArea
                    title={`${orgName}. Цели`} 
                    value={stringGoal}
                    readOnly={true}
                ></TextArea>
            </div>
        </>
    )
}
