import React, { useMemo, useState } from 'react'
import CustomList from '../CustomList/CustomList'
import ListElem from '../CustomList/ListElem'
import { usePostsHook } from '@hooks'
import icon_post from '@image/icon _ post.svg'
import { useNavigate } from 'react-router-dom'

export default function PostsList() {

    const navigate = useNavigate()
    const [seacrhPostsSectionsValue, setSeacrhPostssSectionsValue] = useState()

    const {
        allPosts,
        isLoadingGetPosts,
        isErrorGetPosts,

    } = usePostsHook();

    const handlerClickPost = (link) => {
        navigate(`helper/posts/${link}`);
    };

    const filtredPosts = useMemo(() => {
        if (!seacrhPostsSectionsValue?.trim()) {
            return allPosts; // Возвращаем все элементы если поиск пустой
        }

        const searchLower = seacrhPostsSectionsValue?.toLowerCase();
        return allPosts.filter(item =>
            item.postName.toLowerCase().includes(searchLower)
        );
    }, [seacrhPostsSectionsValue, allPosts]);

    return (
        <>
            <CustomList
                title={'Посты'}
                searchValue={seacrhPostsSectionsValue}
                searchFunc={setSeacrhPostssSectionsValue}
            >
                {filtredPosts.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListElem
                            icon={icon_post}
                            upperText={item.postName}
                            linkSegment={item.id}
                            clickFunc={() => handlerClickPost(item.id)}
                        />
                    </React.Fragment>
                ))}
            </CustomList>
        </>
    )
}
