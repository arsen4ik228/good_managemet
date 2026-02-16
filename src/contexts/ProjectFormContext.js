// contexts/ConvertFormContext.js
import React, { createContext, useContext, useState, useEffect, use } from 'react';
import { usePostsHook, useConvertsHook, useGetReduxOrganization } from '@hooks';
import dayjs from 'dayjs';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {

    const [senderPost, setSenderPost] = useState();
    const [dateStart, setDateStart] = useState(dayjs())
    const [deadline, setDeadline] = useState()
    const [contentInput, setContentInput] = useState("");
    const [isEdit, setIsEdit] = useState(false)
    const [taskId, setTaskId] = useState()
    const [strategyId, setStrategyId] = useState()

    const [projectName, setProjectName] = useState()

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
        setTaskId,


        projectName,
        setProjectName,

        strategyId,
        setStrategyId

    };

    return (
        <ProjectContext.Provider value={value}>
            {children}
        </ProjectContext.Provider>
    );
};


export const useProjectForm = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjectForm must be used within ConvertFormProvider');
    }
    return context;
};