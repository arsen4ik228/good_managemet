// contexts/ConvertFormContext.js
import React, { createContext, useContext, useState, useEffect, use } from 'react';
import { useParams } from 'react-router-dom';
import { usePostsHook, useConvertsHook, useGetReduxOrganization } from '@hooks';
import dayjs from 'dayjs';

const WorkingPlanContext = createContext();

export const WorkingPlanProvider = ({ children }) => {

    const [senderPost, setSenderPost] = useState();
    const [dateStart, setDateStart] = useState(dayjs())
    const [deadline, setDeadline] = useState()
    const [contentInput, setContentInput] = useState("");
    const [isEdit, setIsEdit] = useState(false)
    const [taskId, setTaskId] = useState()

    const { userPostsInAccount } = usePostsHook();
    const { reduxSelectedOrganizationId } = useGetReduxOrganization()

    useEffect(() => {
        if (!userPostsInAccount?.length > 0) return;

        if (userPostsInAccount?.length > 0 && !senderPost) {
            setSenderPost(userPostsInAccount[0]?.id);
        }
    }, [userPostsInAccount, senderPost]);


    const value = {
        dateStart,
        setDateStart,
        deadline,
        setDeadline,
        senderPost,
        setSenderPost,
        userPostsInAccount,
        contentInput,
        setContentInput,
        isEdit,
        setIsEdit,
        taskId,
        setTaskId

    };

    return (
        <WorkingPlanContext.Provider value={value}>
            {children}
        </WorkingPlanContext.Provider>
    );
};


export const useWorkingPlanForm = () => {
    const context = useContext(WorkingPlanContext);
    if (!context) {
        throw new Error('useWorkingPlanForm must be used within ConvertFormProvider');
    }
    return context;
};