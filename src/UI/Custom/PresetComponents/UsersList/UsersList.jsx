import React, { useEffect, useMemo, useState } from 'react'
import { useUserHook } from '@hooks'
import CustomList from '../../CustomList/CustomList'
import ListElem from '../../CustomList/ListElem'
import { useLocation, useNavigate } from 'react-router-dom'
import default_avatar from '@image/default_avatar.svg'
import { baseUrl } from "@helpers/constants.js";
import { notEmpty } from "@helpers/helpers.js"
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

export default function UsersList() {

    const navigate = useNavigate()
    const location = useLocation()
    const [seacrhUsersSectionsValue, setSeacrhUsersSectionsValue] = useState()

    const [isActive, setIsActive] = useState(true);
    const [openFilter, setOpenFilter] = useState(false);

    const { activeUsers, firedUsers } = useUserHook();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(isActive ? activeUsers : firedUsers);
    }, [isActive, activeUsers, firedUsers]);

    const openUser = (id) => {
        navigate(`helper/users/${id}`)
    }

    const filtredPosts = useMemo(() => {
        if (!seacrhUsersSectionsValue?.trim()) {
            return users; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhUsersSectionsValue?.toLowerCase();
        return users?.filter(item =>
            item?.lastName.toLowerCase().includes(searchLower) ||
            item?.firstName.toLowerCase().includes(searchLower)
        );
    }, [seacrhUsersSectionsValue, users]);

    useEffect(() => {

        if (!notEmpty(users)) return;

        const pathname = location.pathname;
        const parts = pathname.split('/').filter(part => part !== '');
        const removedParts = parts.slice(-1);

        if (removedParts[0] !== 'users') return;

        navigate(`helper/users/${users[0]?.id}`)
    }, [users])


    console.log(users)
    return (
        <>
            <CustomList
                title={'Сотрудники'}
                isFilter={true}
                setOpenFilter={setOpenFilter}
                searchValue={seacrhUsersSectionsValue}
                searchFunc={setSeacrhUsersSectionsValue}
            >

                {
                    openFilter && <FilterElement
                        array={arrayFilter}
                        state={isActive}
                        setState={setIsActive}
                        setOpenFilter={setOpenFilter}
                    />
                }

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
