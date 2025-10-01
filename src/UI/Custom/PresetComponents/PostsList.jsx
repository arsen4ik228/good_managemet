import React, { useMemo, useState, useEffect } from 'react'
import CustomList from '../CustomList/CustomList'
import ListElem from '../CustomList/ListElem'
import ListAddButtom from '../ListAddButton/ListAddButtom';
import { useAllPosts, useModuleActions } from '@hooks'
import icon_post from '@image/icon _ post.svg'
import { notEmpty } from '@helpers/helpers'
import { useLocation, useNavigate } from 'react-router-dom'
import ModalCreatePost from '../../layout/Posts/ModalCreatePost';

export default function PostsList() {

    const navigate = useNavigate()
    const location = useLocation()
    const [seacrhPostsSectionsValue, setSeacrhPostssSectionsValue] = useState()

    const [openCreatePost, setOpenCreatePost] = useState(false);

    const {
        allPosts,
        refetch,
        isLoadingGetPosts,
        isFetchingGetPosts,
        isErrorGetPosts,
    } = useAllPosts();

    const { isCreate } = useModuleActions("post");

    const filtredPosts = useMemo(() => {
        if (!seacrhPostsSectionsValue?.trim()) {
            return allPosts; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhPostsSectionsValue?.toLowerCase();
        return allPosts?.filter(item =>
            item?.postName.toLowerCase().includes(searchLower)
        );
    }, [seacrhPostsSectionsValue, allPosts]);

    const openPost = (id) => {
        navigate(`helper/posts/${id}`)
    }

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
                searchValue={seacrhPostsSectionsValue}
                searchFunc={setSeacrhPostssSectionsValue}
            >

                {
                    isCreate &&
                    <ListAddButtom textButton={'Создать пост'} clickFunc={() => setOpenCreatePost(true)} />
                }

                {filtredPosts.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={icon_post}
                            upperText={item.postName}
                            linkSegment={item.id}
                            clickFunc={() => openPost(item.id)}
                        />
                    </React.Fragment>
                ))}

                <ModalCreatePost
                    open={openCreatePost}
                    setOpen={setOpenCreatePost}
                ></ModalCreatePost>
            </CustomList>
        </>
    )
}
