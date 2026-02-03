import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react'
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
    
    // Ref для контейнера списка
    const listContainerRef = useRef(null)
    
    // Для хранения ID выбранного элемента
    const [selectedUserId, setSelectedUserId] = useState(null)
    
    // Флаг для отслеживания необходимости прокрутки
    const [shouldScroll, setShouldScroll] = useState(false)

    const { activeUsers, firedUsers } = useUserHook();
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers(isActive ? activeUsers : firedUsers);
    }, [isActive, activeUsers, firedUsers]);

    const openUser = (id) => {
        setSelectedUserId(id)
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

    // Функция для прокрутки к выбранному элементу
    const scrollToSelectedElement = useCallback(() => {
        if (!selectedUserId || !listContainerRef.current) return;
        
        // Ждем немного, чтобы DOM успел обновиться
        setTimeout(() => {
            const container = listContainerRef.current;
            if (!container) return;
            
            // Находим выбранный элемент по data-id внутри контейнера
            const selectedElement = container.querySelector(`[data-id="${selectedUserId}"]`);
            
            if (selectedElement) {
                // Рассчитываем позицию для плавной прокрутки
                const elementRect = selectedElement.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const containerScrollTop = container.scrollTop;
                
                // Вычисляем относительную позицию элемента
                const relativeTop = elementRect.top - containerRect.top + containerScrollTop;
                const middleOffset = (containerRect.height / 2) - (elementRect.height / 2);
                
                // Прокручиваем к середине контейнера
                container.scrollTo({
                    top: relativeTop - middleOffset,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }, [selectedUserId]);

    // Эффект для определения выбранного элемента из URL
    useEffect(() => {
        const pathname = location.pathname;
        const parts = pathname.split('/');
        const userId = parts[parts.length - 1];
        
        if (userId && userId !== 'users' && userId !== 'helper') {
            setSelectedUserId(userId);
            setShouldScroll(true);
        }
    }, [location.pathname]);

    // Эффект для прокрутки
    useEffect(() => {
        if (shouldScroll && selectedUserId && listContainerRef.current && filtredPosts?.length > 0) {
            scrollToSelectedElement();
            setShouldScroll(false); // Сбрасываем флаг после прокрутки
        }
    }, [shouldScroll, selectedUserId, filtredPosts, isActive, scrollToSelectedElement]);

    // Обработчик получения ref контейнера от CustomList
    const handleListContainerRef = useCallback((ref) => {
        listContainerRef.current = ref;
    }, []);

    useEffect(() => {
        if (!notEmpty(users)) return;

        const pathname = location.pathname;
        const parts = pathname.split('/').filter(part => part !== '');
        const removedParts = parts.slice(-1);

        if (removedParts[0] !== 'users') return;

        navigate(`helper/users/${users[0]?.id}`)
    }, [users])

    return (
        <>
            <CustomList
                title={'Сотрудники'}
                isFilter={true}
                setOpenFilter={setOpenFilter}
                searchValue={seacrhUsersSectionsValue}
                searchFunc={setSeacrhUsersSectionsValue}
                // Передаем callback для получения ref контейнера
                onListContainerRef={handleListContainerRef}
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