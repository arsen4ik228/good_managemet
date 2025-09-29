import React, { useCallback, useEffect, useMemo, useState } from 'react'
import classes from './LeftSider.module.css'
import logo from '@image/big_logo.svg'
import helper_icon from "@image/helper_icon.svg"
import org_icon from '@image/org_icon.svg'
import CustomList from '../../../Custom/CustomList/CustomList'
import { useOrganizationHook, useGetReduxOrganization, usePostsHook, useRightPanel } from '@hooks'
import { useDispatch } from 'react-redux'
import {
    setSelectedOrganizationId,
    setSelectedOrganizationReportDay,
} from "@slices";
import ListElem from '../../../Custom/CustomList/ListElem'
import { useNavigate } from 'react-router-dom'
import { notEmpty, getPostIdRecipientSocketMessage } from '@helpers/helpers'
import { useSocket } from '../../../../hooks'
import { baseUrl } from '@helpers/constants'
import default_avatar from '@image/default_avatar.svg'

export default function LeftSIder() {

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { updatePanelProps } = useRightPanel()

    const [copyChats, setCopyChats] = useState()
    const [socketMessagesCount, setSocketMessagesCount] = useState(new Map());
    const [seacrhOrganizationsSectionsValue, setSearchOrganizationsSectionsValue] = useState()
    const [searchContactsSectionsValue, setContactSectionsValue] = useState()
    const [selectedOrgSectionValue, setSelectedOrgSectionValue] = useState()
    const [selectedContactsSectionValue, setSelectedContactsSectionsValue] = useState()

    const eventNames = useMemo(
        () => ["convertCreationEvent", "messageCountEvent"],
        []
    ); // Мемоизация массива событий

    const handleEventData = useCallback((eventName, data) => {
        console.log(`Data from ${eventName}:`, data);
    }, []); // Мемоизация callbac

    const socketResponse = useSocket(eventNames, handleEventData);

    const {
        organizations,
        isLoadingOrganization,
        isErrorOrganization
    } = useOrganizationHook();

    const { allChats, loadingAllChats, refetchAllChats } = usePostsHook()


    const { reduxSelectedOrganizationId } = useGetReduxOrganization();

    const handleOrganizationNameButtonClick = (id, name, reportDay) => {
        localStorage.setItem("selectedOrganizationId", id);
        localStorage.setItem("name", name);
        localStorage.setItem("reportDay", reportDay);
        dispatch(setSelectedOrganizationId(id));
        dispatch(setSelectedOrganizationReportDay(reportDay));
        navigate(`/${id}`)
    };

    const handlerHelper = () => {
        navigate('helper')
    }

    const handlerCreateUser = () => {
        navigate('createUser')
    }

    const handlerContact = (item) => {

        // updatePanelProps(
        //     {
        //         name: `${item.userFirstName} ${item.userLastName}`,
        //         postsNames : item.postsNames.join(', '),
        //         avatar: item.userAvatar ? `${baseUrl + item.userAvatar}` : default_avatar
        //     }
        // )

        navigate(`chat/${item.userId}`)
    }

    const filtredOrganizations = useMemo(() => {
        if (!seacrhOrganizationsSectionsValue?.trim()) {
            return organizations; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhOrganizationsSectionsValue?.toLowerCase();
        return organizations?.filter(item =>
            item?.organizationName.toLowerCase().includes(searchLower)
        );
    }, [seacrhOrganizationsSectionsValue, organizations]);

    const filtredContacts = useMemo(() => {
        if (!searchContactsSectionsValue?.trim()) {
            return copyChats; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = searchContactsSectionsValue?.toLowerCase();
        return copyChats?.filter(item =>
            item?.userFirstName.toLowerCase().includes(searchLower) ||
            item?.userLastName.toLowerCase().includes(searchLower) ||
            item?.postName.toLowerCase().includes(searchLower)
        );
    }, [searchContactsSectionsValue, copyChats]);

    useEffect(() => {
        if (!notEmpty(socketResponse?.convertCreationEvent)) return

        refetchAllChats()
    }, [socketResponse?.convertCreationEvent])

    useEffect(() => {
        if (!notEmpty(socketResponse?.messageCountEvent)) return

        const response = socketResponse.messageCountEvent
        const recepientId = getPostIdRecipientSocketMessage(response.host, response.lastPostInConvert);
        const newMap = new Map(socketMessagesCount);

        if (newMap.has(recepientId.toString())) {
            newMap.set(recepientId.toString(), newMap.get(recepientId.toString()) + 1);
        }
        else {
            newMap.set(recepientId.toString(), 1);
        }

        setCopyChats(getChatsWithTimeOfSocketMessage(copyChats, recepientId))
        setSocketMessagesCount(newMap);
    }, [socketResponse?.messageCountEvent])

    useEffect(() => {
        if (
            !isLoadingOrganization &&
            !isErrorOrganization &&
            organizations?.length > 0
        ) {
            const defaultOrg = organizations[0];
            if (!localStorage.getItem("selectedOrganizationId")) {
                localStorage.setItem("selectedOrganizationId", defaultOrg.id);
                localStorage.setItem("name", defaultOrg.organizationName);
                localStorage.setItem("reportDay", defaultOrg.reportDay);

                // Также обновляем Redux store
                dispatch(setSelectedOrganizationId(defaultOrg.id));
                dispatch(setSelectedOrganizationReportDay(defaultOrg.reportDay));

                // navigate(`/${defaultOrg.id}`)
            }

            navigate(`/${defaultOrg.id}`)

        }
    }, [organizations, isLoadingOrganization, isErrorOrganization]);

    useEffect(() => {
        if (!notEmpty(allChats)) return

        setCopyChats([...allChats])
    }, [allChats])

    console.log('filtredContacts   ', filtredContacts)
    return (
        <>
            <div className={classes.wrapper}>
                <div className={classes.header}>
                    <img src={logo} alt="GOODMANAGEMENT" onClick={() => navigate('accountSettings')} />
                    <div>GOODMANAGEMENT</div>
                </div>
                <div className={classes.content}>

                    <CustomList
                        title={'организации'}
                        addButtonText={'Новая организация'}
                        searchValue={seacrhOrganizationsSectionsValue}
                        searchFunc={setSearchOrganizationsSectionsValue}
                        selectedItem={selectedOrgSectionValue}
                        expanded={false}
                    >
                        {filtredOrganizations.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListElem
                                    icon={org_icon}
                                    upperText={item.organizationName}
                                    linkSegment={item.id}
                                    setSelectedItemData={setSelectedOrgSectionValue}
                                    clickFunc={() =>
                                        handleOrganizationNameButtonClick(
                                            item.id,
                                            item.organizationName,
                                            item.reportDay
                                        )}
                                />
                            </React.Fragment>
                        ))}
                    </CustomList>

                    <CustomList
                        title={'контакты'}
                        addButtonText={'Новый контакт'}
                        addButtonClick={handlerCreateUser}
                        searchValue={searchContactsSectionsValue}
                        searchFunc={setContactSectionsValue}
                        selectedItem={selectedContactsSectionValue}
                    >
                        <ListElem
                            icon={helper_icon}
                            linkSegment={'helper'}
                            upperText={'Гудменеджер'}
                            bottomText={'ИИ Помощник'}
                            clickFunc={handlerHelper}
                        />

                        {filtredContacts?.map((item) => (
                            <React.Fragment key={item.id}>
                                <ListElem
                                    icon={item.userAvatar ? `${baseUrl + item.userAvatar}` : default_avatar}
                                    upperText={item.userFirstName + ' ' + item.userLastName}
                                    bottomText={item.postsNames.join(', ')}
                                    linkSegment={`${item.userId}`}
                                    clickFunc={() => handlerContact(item)}
                                    setSelectedItemData={setSelectedContactsSectionsValue}
                                    bage={calculateUnseenMessages(item, socketMessagesCount)}
                                />
                            </React.Fragment>
                        ))}
                    </CustomList>


                </div>
            </div>
        </>
    )
}


const calculateUnseenMessages = (item, socketMessagesCount) => {

    if (!socketMessagesCount) {
        return (
            (+item.unseenMessagesCount || 0) +
            (+item.watcherUnseenCount || 0)
            // (+(socketMessagesCount.get(item.id)) || 0)
        );
    }

    if (!item?.unseenMessagesCount) return null;

    return (
        (+item.unseenMessagesCount || 0) +
        (+item.watcherUnseenCount || 0) +
        (+(socketMessagesCount.get(item.id)) || 0)
    );
};

const getChatsWithTimeOfSocketMessage = (chatsArray, id) => {
    if (!chatsArray) return [];

    // 1. Приводим ВСЕ даты к типу Date (чтобы сравнивать одинаковые типы)
    const normalizedChats = chatsArray.map(chat => ({
        ...chat,
        latestMessageCreatedAt: new Date(chat.latestMessageCreatedAt)
    }));

    // 2. Обновляем дату в нужном чате
    const updatedChats = normalizedChats.map(chat =>
        chat.id === id
            ? { ...chat, latestMessageCreatedAt: new Date() }
            : chat
    );

    // 3. Сортируем (теперь все latestMessageCreatedAt — объекты Date)
    const sortedChats = [...updatedChats].sort((a, b) =>
        b.latestMessageCreatedAt - a.latestMessageCreatedAt
    );
    console.warn(sortedChats)
    return sortedChats;
};