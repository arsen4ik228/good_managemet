import React, { useMemo, useState } from 'react'
import CustomList from '../CustomList/CustomList'
import ListElem from '../CustomList/ListElem'
import ListAddButtom from '../ListAddButton/ListAddButtom';
import { useAllPosts } from '@hooks'
import icon_post from '@image/icon _ post.svg'
import { useNavigate } from 'react-router-dom'
import ModalCreatePost from '../../layout/Posts/ModalCreatePost';

export default function PostsList() {

    const navigate = useNavigate()
    const [seacrhPostsSectionsValue, setSeacrhPostssSectionsValue] = useState()

    const [openCreatePost, setOpenCreatePost] = useState(false);


    const {
        allPosts,
        isLoadingGetPosts,
        isFetchingGetPosts,
        isErrorGetPosts,
    } = useAllPosts();

    const filtredPosts = useMemo(() => {
        if (!seacrhPostsSectionsValue?.trim()) {
            return allPosts; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhPostsSectionsValue?.toLowerCase();
        return allPosts.filter(item =>
            item.postName.toLowerCase().includes(searchLower)
        );
    }, [seacrhPostsSectionsValue, allPosts]);

    const openPost = (id) => {
        localStorage.setItem("selectedPostId", id);
        navigate(`helper/posts/${id}`)
    }

    return (
        <>
            <CustomList
                title={'Посты'}
                searchValue={seacrhPostsSectionsValue}
                searchFunc={setSeacrhPostssSectionsValue}
            >
                <ListAddButtom textButton={'Создать пост'} clickFunc={() => setOpenCreatePost(true)} />

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
