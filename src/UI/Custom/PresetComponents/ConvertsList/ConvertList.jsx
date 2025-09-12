import React, { useMemo, useState } from 'react'
import CustomList from '../../CustomList/CustomList';
import ListAddButtom from '../../ListAddButton/ListAddButtom';
import ListElem from '../../CustomList/ListElem';
import { useNavigate, useParams } from 'react-router-dom';
import { useConvertsHook } from '@hooks';

export default function ConvertList() {
    const [seacrhChatsSectionsValue, setSeacrhChatsSectionsValue] = useState()
    const navigate = useNavigate()
    const { contactId } = useParams()
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

    const filtredChats = useMemo(() => {
        if (!seacrhChatsSectionsValue?.trim()) {
            return seenConverts?.concat(unseenConverts); // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhChatsSectionsValue?.toLowerCase();
        return seenConverts?.concat(unseenConverts).filter(item =>
            item.name.toLowerCase().includes(searchLower)
        );
    }, [seacrhChatsSectionsValue, seenConverts, unseenConverts]);

    return (
        <>
            <CustomList
                title={'Темы'}
                searchValue={seacrhChatsSectionsValue}
                searchFunc={setSeacrhChatsSectionsValue}
            >

                <ListAddButtom textButton={'Новая тема'} />

                {filtredChats?.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            // icon={statGraph}
                            upperText={item.convertTheme}
                            bottomText={item.convertType}
                            linkSegment={item.id}
                            clickFunc={() => navigate(`chat/${contactId}/${item.id}`)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}
