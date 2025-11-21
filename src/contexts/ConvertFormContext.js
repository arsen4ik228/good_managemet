// contexts/ConvertFormContext.js
import React, { createContext, useContext, useState, useEffect, use } from 'react';
import { useParams } from 'react-router-dom';
import { usePostsHook, useConvertsHook, useGetReduxOrganization } from '@hooks';

const ConvertFormContext = createContext();

const TYPE_OPTIONS = [
    { value: 'Личная', label: 'Личная' },
    { value: 'Приказ', label: 'Приказ' },
];

export const ConvertFormProvider = ({ children }) => {

    const [convertType, setConvertType] = useState(TYPE_OPTIONS[0].value);
    const [convertTheme, setConvertTheme] = useState('');
    const [senderPost, setSenderPost] = useState();
    const [reciverPostId, setReciverPostId] = useState();
    const [contactId, setContactId] = useState()
    const [isDisabledType, setIsDisabledType] = useState(false)

    const { userPostsInAccount } = usePostsHook();
    const { contactInfo } = useConvertsHook({ contactId });
    const { reduxSelectedOrganizationId } = useGetReduxOrganization()

    useEffect(() => {
        if (!contactInfo) return;
        setReciverPostId(contactInfo.postId);
    }, [contactInfo]);

    useEffect(() => {
        if (!userPostsInAccount?.length > 0) return;

        if (userPostsInAccount?.length > 0 && !senderPost) {
            setSenderPost(userPostsInAccount[0]?.id);
        }
    }, [userPostsInAccount, senderPost]);

    useEffect(() => {
        if (!contactInfo) return;
        if (!userPostsInAccount?.length > 0) return;

        const postObj = userPostsInAccount?.find(item => item.id === senderPost)

        if (postObj?.organization.id !== reduxSelectedOrganizationId) {
            setConvertType('Личная')
            setIsDisabledType(true)

        }
        else
            setIsDisabledType(false)
    }, [contactId, userPostsInAccount, senderPost]);

    const value = {
        convertType,
        convertTheme,
        senderPost,
        reciverPostId,
        setConvertType,
        setConvertTheme,
        setSenderPost,
        setReciverPostId,
        TYPE_OPTIONS,
        userPostsInAccount,
        contactInfo,
        contactId,
        setContactId,
        isDisabledType
    };

    return (
        <ConvertFormContext.Provider value={value}>
            {children}
        </ConvertFormContext.Provider>
    );
};


export const useConvertForm = () => {
    const context = useContext(ConvertFormContext);
    if (!context) {
        throw new Error('useConvertForm must be used within ConvertFormProvider');
    }
    return context;
};