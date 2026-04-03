import React, {useState} from 'react';
import classes from './Test.module.css';
import default_avatar from '@image/default_avatar.svg'
import phone from '@image/phone.svg'
import {Flex, Skeleton, Space, Text, Typography} from 'antd';
import {UpOutlined, DownOutlined} from '@ant-design/icons';
import {useGetSinglePostForView} from "../../../hooks/Post/useGetSinglePostForView";
import {formatPhone} from "../Posts/function/functionForPost";


export default function Test() {
    const [postId, setPostId] = useState(null);
    const [click, setClick] = useState(false);

    const {
        currentPost,

        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetSinglePostForView({postId: postId});

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
                                            ? <DownOutlined/>
                                            : <UpOutlined/>
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
                            statistics={currentPost?.statistics}
                            policy={currentPost?.policy?.policyName}
                            telephoneNumber={currentPost?.user?.telephoneNumber}
                            isLoadingGetPostId={isLoadingGetPostId}
                        />)
                    : null
            }

        </div>
    )
}

function Information({role, product, purpose, statistics, policy, isLoadingGetPostId, telephoneNumber}) {
    return (
        <>
            <Item label={"роль поста"} text={role} isLoadingGetPostId={isLoadingGetPostId}></Item>
            <Item label={"продукт поста"} text={product} isLoadingGetPostId={isLoadingGetPostId}></Item>
            <Item label={"предназначение поста"} text={purpose} isLoadingGetPostId={isLoadingGetPostId}></Item>
            <ViewStatistics statistics={statistics} isLoadingGetPostId={isLoadingGetPostId}></ViewStatistics>
            <Item label={"политика поста"} text={policy} isLoadingGetPostId={isLoadingGetPostId} isUnderline></Item>
            <Phone telephoneNumber={telephoneNumber}></Phone>
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
                                    lineHeight: "1.4",
                                }}>{s.name}</span>
                            </div>
                        ))}
                    </>
            }
        </div>
    )
}

function Phone({telephoneNumber}) {
    return (
        <div className={classes.phone}>
            <Space align="start" size={17} style={{width: '100%'}}>
                <img src={phone} alt="телефон"/>
                <Typography.Text style={{color: "#333333"}}>{formatPhone(telephoneNumber)}</Typography.Text>
            </Space>
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
                isLoadingGetPostId
                    ? <Skeleton.Input active/>
                    : <span style={{lineHeight: "1.4"}}>{text}</span>
            }
        </div>
    )
}