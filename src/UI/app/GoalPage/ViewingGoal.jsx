import React from 'react'
import TextArea from '../../Custom/TextArea/TextArea'

export const ViewingGoal = ({arrGoals}) => {

    const stringGoal = arrGoals?.join('\n\n')

    return (
        <>
            <TextArea
                value={stringGoal}
                readOnly={true}
            ></TextArea>
        </>
    )
}
