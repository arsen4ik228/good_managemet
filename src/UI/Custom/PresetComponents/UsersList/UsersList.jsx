import React, { useEffect, useMemo, useState } from 'react'
import { useUserHook } from '@hooks'
import CustomList from '../../CustomList/CustomList'
import ListElem from '../../CustomList/ListElem'
import { useLocation, useNavigate } from 'react-router-dom'
import default_avatar from '@image/default_avatar.svg'
import { baseUrl } from "@helpers/constants.js";
import { notEmpty } from "@helpers/helpers.js"


export default function UsersList() {

    const navigate = useNavigate()
    const location = useLocation()
    const [seacrhUsersSectionsValue, setSeacrhUsersSectionsValue] = useState()


    const { activeUsers } = useUserHook()

    const openUser = (id) => {
        navigate(`helper/users/${id}`)
    }

    const filtredPosts = useMemo(() => {
        if (!seacrhUsersSectionsValue?.trim()) {
            return activeUsers; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhUsersSectionsValue?.toLowerCase();
        return activeUsers?.filter(item =>
            item?.lastName.toLowerCase().includes(searchLower) ||
            item?.firstName.toLowerCase().includes(searchLower)
        );
    }, [seacrhUsersSectionsValue, activeUsers]);

    useEffect(() => {

        if (!notEmpty(activeUsers)) return;

        const pathname = location.pathname;
        const parts = pathname.split('/').filter(part => part !== '');
        const removedParts = parts.slice(-1);

        if (removedParts[0] !== 'users') return;

        navigate(`helper/users/${activeUsers[0]?.id}`)
    }, [activeUsers])


    console.log(activeUsers)
    return (
        <>
            <CustomList
                title={'Сотрудники'}
                searchValue={seacrhUsersSectionsValue}
                searchFunc={setSeacrhUsersSectionsValue}
            >
                {filtredPosts.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={item?.avatar_url ? `${baseUrl}${item?.avatar_url}` : default_avatar}
                            upperText={item.lastName.trim() + ' ' + item.firstName.trim()}
                            linkSegment={item.id}
                            clickFunc={() => openUser(item.id)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}
