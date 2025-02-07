import React from 'react';
import classes from './MainPost.module.css'
import { useNavigate } from "react-router-dom";
import Header from "../Custom/CustomHeader/Header";
import { usePostsHook } from '@hooks';
import HandlerQeury from '../../../../mobile/UI/Custom/HandlerQeury';


const MainPost = () => {

    const navigate = useNavigate()

    const {
        allPosts,
        isLoadingGetPosts,
        isErrorGetPosts,
    } = usePostsHook()

    return (
        <>
            <div className={classes.wrapper}>
                <>
                    <Header onRightIcon={true} title={'Посты'}>Личный помощник</Header>

                </>

                <div className={classes.body}>
                    <>
                        <div className={classes.bodyContainer}>
                            <div className={classes.left}> Выберите Пост:</div>
                            <div className={classes.right}>
                                <>
                                    <ul className={classes.selectList}>
                                        {allPosts?.map((item, index) => (
                                            <li
                                                key={index}
                                                onClick={() => navigate(item.id)}
                                            >
                                                {item?.postName}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            </div>
                        </div>
                    </>
                </div>
            </div>

            <HandlerQeury
                Loading={isLoadingGetPosts}
                Error={isErrorGetPosts}
            />
        </>
    );
};

export default MainPost;