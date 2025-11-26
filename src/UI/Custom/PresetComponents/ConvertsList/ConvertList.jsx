import React, { useCallback, useEffect, useMemo, useState } from 'react'
import CustomList from '../../CustomList/CustomList';
import ListAddButtom from '../../ListAddButton/ListAddButtom';
import ListElem from '../../CustomList/ListElem';
import { useNavigate, useParams } from 'react-router-dom';
import { useConvertsHook } from '@hooks';
import convert_icon from '@image/convert_icon.svg'
import personal_chat_icon from '@image/personal_chat_icon.svg'
import order_chat_icon from '@image/order_chat_icon.svg'
import convert_agreement_icon from '@image/convert_agreement_icon.svg'
import request_chat_icon from '@image/request_chat_icon.svg'
import { homeUrl } from '@helpers/constants'
import { useSocket } from '../../../../hooks';
import default_avatar from '@image/default_avatar.svg'
import { notEmpty } from '../../../../helpers/helpers';
import FilterElement from '../../CustomList/FilterElement'



const arrayFilter = [
    {
        label: "Активные",
        value: true
    },
    {
        label: "Архивные",
        value: false
    }
]


export default function ConvertList() {
    const [seacrhChatsSectionsValue, setSeacrhChatsSectionsValue] = useState()
    const navigate = useNavigate()

    const { organizationId, contactId } = useParams()

    const [isActive, setIsActive] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);


    const {
        contactInfo,
        seenConverts,
        unseenConverts,
        archiveConvaerts,
        isErrorGetConverts,
        isLoadingGetConverts,
        isFetchingGetConvert,
        ErrorGetConverts,
        refetchGetConverts,
    } = useConvertsHook({ contactId: contactId })


    const eventNames = useMemo(
        () => ["convertCreationEvent", "messageCountEvent"],
        []
    ); // Мемоизация массива событий

    const handleEventData = useCallback((eventName, data) => {
        //(`Data from ${eventName}:`, data);
    }, []); // Мемоизация callbac

    const socketResponse = useSocket(eventNames, handleEventData);

    const filtredChats = useMemo(() => {
        if (!seacrhChatsSectionsValue?.trim()) {
            return !isActive ? archiveConvaerts : unseenConverts?.concat(seenConverts); // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhChatsSectionsValue?.toLowerCase();

        if (isActive) {
            return unseenConverts?.concat(seenConverts)?.filter(item =>
                item?.convertTheme.toLowerCase().includes(searchLower)
            );
        }
        else {
            return archiveConvaerts?.filter(item =>
                item?.convertTheme.toLowerCase().includes(searchLower)
            );
        }
    }, [seacrhChatsSectionsValue, seenConverts, unseenConverts, isActive]);

    const CONVERT_ICON = {
        'Приказ': order_chat_icon,
        'Переписка': personal_chat_icon,
        'Запрос': request_chat_icon,
        'Согласование': convert_agreement_icon,
    }

    const getIcon = (type, path) => {
        if (path === 'Прямой') {
            return CONVERT_ICON[type]
        }

        return CONVERT_ICON[path]
    }

    const openChat = (status, id) => {
        if (status)
            navigate(`chat/${contactId}/${id}`)
        else
            navigate(`chat/${contactId}/archive/${id}`)
    }

    useEffect(() => {
        if (!notEmpty(socketResponse?.messageCountEvent)) return

        const response = socketResponse.messageCountEvent
        const hostId = response?.host.id
        // const lastPostId = response?.lastPostInConvert.id

        if (contactInfo.posts?.some(post => post.id === hostId)) {
            refetchGetConverts()
        }

    }, [socketResponse?.messageCountEvent])

    useEffect(() => {
        if (!notEmpty(socketResponse?.convertCreationEvent)) return

        const response = socketResponse.convertCreationEvent

        const hostId = response?.host.id
        // const lastPostId = response?.receiver.id

        if (contactInfo.posts?.some(post => post.id === hostId)) {
            refetchGetConverts()
        }

    }, [socketResponse?.convertCreationEvent])

    console.log(filtredChats)
    return (
        <>
            <CustomList
                title={'Темы'}
                searchValue={seacrhChatsSectionsValue}
                searchFunc={setSeacrhChatsSectionsValue}
                isFilter={true}
                setOpenFilter={setOpenFilter}
            // addButtonText={'Новая тема'}
            // addButtonClick={() => navigate(`chat/${contactId}`)}
            >

                {/* <ListAddButtom textButton={'Новая тема'} /> */}

                {
                    openFilter && <FilterElement
                        array={arrayFilter}
                        state={isActive}
                        setState={setIsActive}
                        setOpenFilter={setOpenFilter}
                    />
                }


                {
                    !openFilter && <ListAddButtom textButton={'Новая тема'} clickFunc={() => navigate(`chat/${contactId}`)} />
                }

                {/* {archiveConvaerts?.map((item, index) => ( */}
                {filtredChats?.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={getIcon(item.convertType, item.convertPath)}
                            upperText={item.convertTheme}
                            bottomText={item.convertType}
                            linkSegment={item.id}
                            bage={item.unseenMessagesCount}
                            greyBage={item?.hasUnrepliedMessage}
                            clickFunc={() => openChat(item.convertStatus, item.id)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}
