import React, {useState} from 'react';
import classes from './Test.module.css';
import default_avatar from '@image/default_avatar.svg'
import {useGetSinglePost} from "../../../hooks";
import {Skeleton} from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

// "d76bab40-fadb-404c-b806-c3e6151505a5"

export default function Test() {
    const [postId, setPostId] = useState(null);
    const [click, setClick] = useState(false);
    const {
        currentPost,
        statisticsIncludedPost,

        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetSinglePost({postId: postId});

    const handleOnClick = () => {
        setClick(!click);
        setPostId("d76bab40-fadb-404c-b806-c3e6151505a5");
    }
    return (
        <div className={classes.background}>
            <div className={classes.wrapper}>
                <div className={classes.greySection}></div>
                <div className={classes.whiteSection}></div>

                <div className={classes.contentContainer}>
                    <div className={classes.photoSection}>
                        <img src={default_avatar} alt="avatar"/>
                    </div>
                    <div className={classes.textSection}>
                        <div className={classes.upperText}> Подразделение №44</div>
                        <div className={classes.bottomText}>
                            <div>Лысенко Валерий</div>
                            <div>
                                программист
                                <button onClick={handleOnClick}>
                                    {
                                        click
                                            ? <DownOutlined />
                                            : <UpOutlined />
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {
                click
                    ? (
                        <Information
                        role={currentPost?.role?.roleName}
                        product={currentPost?.product}
                        purpose={currentPost?.purpose}
                        statistics={statisticsIncludedPost}
                        policy={currentPost?.policy?.policyName}
                        isLoadingGetPostId={isLoadingGetPostId}
                    />)
                    : null
            }

        </div>
    )
}

function Information({role, product, purpose, statistics, policy, isLoadingGetPostId}) {
    return (
        <>
            <Item label={"роль поста"} text={role} isLoadingGetPostId={isLoadingGetPostId}></Item>
            <Item label={"продукт поста"} text={product} isLoadingGetPostId={isLoadingGetPostId}></Item>
            <Item label={"предназначение поста"} text={purpose} isLoadingGetPostId={isLoadingGetPostId}></Item>
            <ViewStatistics statistics={statistics} isLoadingGetPostId={isLoadingGetPostId}></ViewStatistics>
            <Item label={"политика поста"} text={policy} isLoadingGetPostId={isLoadingGetPostId} isUnderline></Item>
        </>
    )
}

function ViewStatistics({statistics, isLoadingGetPostId}) {
    return (
        <div className={classes.block}>
            <div className={classes.nameBlock}>статистики поста</div>

            {
                isLoadingGetPostId
                    ? <Skeleton.Input active/>
                    : <>
                        {statistics?.map((s, index) => (
                            <div style={{
                                paddingTop: "5px",
                            }}>
                                {index + 1}. {"  "}
                                <span style={{
                                    textDecoration: "underline",
                                }}>{s.name}</span>
                            </div>
                        ))}
                    </>
            }
        </div>
    )
}

function Item({label, text, isUnderline, isLoadingGetPostId}) {
    return (
        <div className={classes.block} style={{
            textDecoration: isUnderline ? "underline" : "none",
        }}>
            <div className={classes.nameBlock}> {label}</div>
            {
                isLoadingGetPostId ? <Skeleton.Input active/> : text
            }
        </div>
    )
}