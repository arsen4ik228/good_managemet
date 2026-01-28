import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import CustomList from '../CustomList/CustomList'
import ListElem from '../CustomList/ListElem'
import ListAddButtom from '../ListAddButton/ListAddButtom';
import { useAllPosts, useModuleActions } from '@hooks'
import icon_post from '@image/icon _ post.svg'
import { notEmpty } from '@helpers/helpers'
import { useLocation, useNavigate } from 'react-router-dom'
import {useCreatePostAction} from '../../layout/Posts/useCreatePostAction';
import FilterElement from '../CustomList/FilterElement'

const arrayFilter = [
    {
        label: "Активные",
        value: false
    },
    {
        label: "Архивные",
        value: true
    }
]

export default function PostsList() {
    const navigate = useNavigate()
    const location = useLocation()
    const [seacrhPostsSectionsValue, setSeacrhPostssSectionsValue] = useState()
    const [isActive, setIsActive] = useState(false);
    const [openFilter, setOpenFilter] = useState(false);
    
    // Ref для контейнера списка
    const listContainerRef = useRef(null)
    
    // Для хранения ID выбранного элемента
    const [selectedPostId, setSelectedPostId] = useState(null)
    
    // Флаг для отслеживания необходимости прокрутки
    const [shouldScroll, setShouldScroll] = useState(false)

    const createPostHandler = useCreatePostAction();

    const {
        allPosts,
        refetch,
    } = useAllPosts({isArchive: isActive });

    const { isCreate } = useModuleActions("post");

    const filtredPosts = useMemo(() => {
        if (!seacrhPostsSectionsValue?.trim()) {
            return allPosts;
        }

        const searchLower = seacrhPostsSectionsValue?.toLowerCase();
        return allPosts?.filter(item =>
            item?.postName.toLowerCase().includes(searchLower)
        );
    }, [seacrhPostsSectionsValue, allPosts]);

    const openPost = (id) => {
        setSelectedPostId(id)
        navigate(`helper/posts/${id}`)
    }

    // Функция для прокрутки к выбранному элементу
    const scrollToSelectedElement = useCallback(() => {
        if (!selectedPostId || !listContainerRef.current) return;
        
        // Ждем немного, чтобы DOM успел обновиться
        setTimeout(() => {
            const container = listContainerRef.current;
            if (!container) return;
            
            // Находим выбранный элемент по data-id внутри контейнера
            const selectedElement = container.querySelector(`[data-id="${selectedPostId}"]`);
            
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
    }, [selectedPostId]);

    // Эффект для определения выбранного элемента из URL
    useEffect(() => {
        const pathname = location.pathname;
        const parts = pathname.split('/');
        const postId = parts[parts.length - 1];
        
        if (postId && postId !== 'posts' && postId !== 'helper') {
            setSelectedPostId(postId);
            setShouldScroll(true);
        }
    }, [location.pathname]);

    // Эффект для прокрутки
    useEffect(() => {
        if (shouldScroll && selectedPostId && listContainerRef.current && filtredPosts?.length > 0) {
            scrollToSelectedElement();
            setShouldScroll(false); // Сбрасываем флаг после прокрутки
        }
    }, [shouldScroll, selectedPostId, filtredPosts, isActive, scrollToSelectedElement]);

    // Обработчик получения ref контейнера от CustomList
    const handleListContainerRef = useCallback((ref) => {
        listContainerRef.current = ref;
    }, []);

    // Остальные useEffect без изменений
    useEffect(() => {
        if (!notEmpty(allPosts)) return;

        const pathname = location.pathname;
        const parts = pathname.split('/').filter(part => part !== '');
        const removedParts = parts.slice(-1);

        if (removedParts[0] !== 'posts') return;

        navigate(`helper/posts/${allPosts[0]?.id}`)
    }, [allPosts])

    useEffect(() => {
        const channel = new BroadcastChannel("postName_channel");

        const handler = (event) => {
            if (event.data === "name") {
                refetch();
            }
        };

        channel.addEventListener("message", handler);

        return () => {
            channel.removeEventListener("message", handler);
            channel.close();
        };
    }, [refetch]);

    return (
        <>
            <CustomList
                title={'Посты'}
                isFilter={true}
                setOpenFilter={setOpenFilter}
                searchValue={seacrhPostsSectionsValue}
                searchFunc={setSeacrhPostssSectionsValue}
                // Передаем callback для получения ref контейнера
                onListContainerRef={handleListContainerRef}
            >
                {openFilter && <FilterElement
                    array={arrayFilter}
                    state={isActive}
                    setState={setIsActive}
                    setOpenFilter={setOpenFilter}
                />}

                {!openFilter && isCreate &&
                    <ListAddButtom textButton={'Создать пост'} clickFunc={createPostHandler} />
                }

                {filtredPosts?.filter(item => item?.isArchive === isActive)?.map((item, index) => (
                    <React.Fragment key={item.id || index}>
                        <ListElem
                            icon={icon_post}
                            upperText={item.postName}
                            linkSegment={item.id}
                            clickFunc={() => openPost(item.id)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}