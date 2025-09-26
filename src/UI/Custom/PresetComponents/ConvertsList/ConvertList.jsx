import React, { useCallback, useMemo, useState } from 'react'
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


export default function ConvertList() {
    const [seacrhChatsSectionsValue, setSeacrhChatsSectionsValue] = useState()
    const navigate = useNavigate()
    const { organizationId, contactId } = useParams()
    // Получение всех статистик

    const {
        contactInfo,
        seenConverts,
        unseenConverts,
        archiveConvaerts,
        isErrorGetConverts,
        isLoadingGetConverts,
        isFetchingGetConvert,
        ErrorGetConverts,
    } = useConvertsHook({ contactId: contactId })


    const eventNames = useMemo(
        () => ["convertCreationEvent", "messageCountEvent"],
        []
    ); // Мемоизация массива событий

    const handleEventData = useCallback((eventName, data) => {
        console.log(`Data from ${eventName}:`, data);
    }, []); // Мемоизация callbac

    const socketResponse = useSocket(eventNames, handleEventData);

    const filtredChats = useMemo(() => {
        if (!seacrhChatsSectionsValue?.trim()) {
            return unseenConverts?.concat(seenConverts); // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhChatsSectionsValue?.toLowerCase();
        return unseenConverts?.concat(seenConverts)?.filter(item =>
            item?.name.toLowerCase().includes(searchLower)
        );
    }, [seacrhChatsSectionsValue, seenConverts, unseenConverts]);

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

    console.log(contactInfo)
    return (
        <>
            <CustomList
                title={'Темы'}
                searchValue={seacrhChatsSectionsValue}
                searchFunc={setSeacrhChatsSectionsValue}
                addButtonText={'Новая тема'}
                addButtonClick={() => navigate(`chat/${contactId}`)}
            >

                {/* <ListAddButtom textButton={'Новая тема'} /> */}

                {filtredChats?.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={getIcon(item.convertType, item.convertPath)}
                            upperText={item.convertTheme}
                            bottomText={item.convertType}
                            linkSegment={item.id}
                            bage={item.unseenMessagesCount}
                            clickFunc={() => navigate(`chat/${contactId}/${item.id}`)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}
