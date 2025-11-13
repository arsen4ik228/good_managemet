import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

import classes from './Post.module.css'

import { Card, Avatar, Typography, Space, Divider, Flex, Tag } from "antd";


import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { useGetSinglePost } from '../../../hooks/Post/useGetSinglePost';
import { baseUrl } from "@helpers/constants.js";
import { formatPhone } from './function/functionForPost'
import { usePanelPreset } from '@hooks';
import { useRightPanel, useModuleActions } from '@hooks';
import default_avatar from '@image/default_avatar.svg'
import phone from '@image/phone.svg'



const { Title, Text } = Typography;


export default function Post() {

    const { postId } = useParams();

    const { PRESETS } = useRightPanel();

    usePanelPreset(PRESETS["POSTS"]);


    const { buutonsArr } = useModuleActions("post", postId);

    const {
        currentPost,
        parentPost,

        refetch,
    } = useGetSinglePost({ postId });



    useEffect(() => {
        const channel = new BroadcastChannel("post_channel");

        const handler = (event) => {
            if (event.data === "updated") {
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
        <MainContentContainer buttons={buutonsArr} >
            <div className={classes.main}>

                {/* Руководитель */}
                <Flex vertical align="center" style={{ marginBottom: 24, position: "relative" }}>
                    <fieldset className={classes.fieldset}>
                        <legend> руководящий пост</legend>
                        {parentPost && Object.keys(parentPost).length ? (
                            <Space size="small" align="start">
                                <Avatar
                                    size={48}
                                    src={parentPost.user?.avatar_url ? `${baseUrl}${parentPost.user.avatar_url}` : default_avatar}
                                />
                                <Flex vertical style={{ margin: 0, marginTop:"5px", gap: 0 }}>
                                    <Text
                                        strong
                                        className={classes.text}
                                        style={{ margin: 0, lineHeight: 1 }}
                                    >
                                        {parentPost.user?.lastName} {parentPost.user?.firstName}
                                    </Text>
                                    <Text
                                        className={classes.title}
                                        style={{ margin: 0, lineHeight: 1 }}
                                    >
                                        {parentPost.postName}
                                    </Text>
                                </Flex>

                            </Space>
                        ) : (
                            <Text type="secondary">—</Text> // показываем, что данных нет
                        )}
                    </fieldset>

                </Flex>

                <div style={
                    {
                        position: "relative"
                    }
                }>

                    <fieldset className={classes.fieldset2} style={{
                        borderRadius: "10px",
                    }}>
                        <legend>пост</legend>
                        <Flex gap={24}>
                            {/* Левая часть — сотрудник */}

                            <div style={{
                                minHeight: "460px",
                                width: "250px",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: "10px",
                                backgroundColor: "#fafafa",
                            }}>
                                <div style={{
                                    height: "174px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    borderTopLeftRadius: "10px",
                                    borderTopRightRadius: "10px",
                                    backgroundColor: "#CCCCCC"
                                }}>
                                    <Avatar
                                        size={154}
                                        src={currentPost?.user?.avatar_url ? `${baseUrl}${currentPost?.user?.avatar_url}` : default_avatar}
                                        style={{ margin: 0 }}
                                    />
                                </div>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    padding: "26px",
                                    backgroundColor: "#fafafa",
                                }}>
                                    <Title style={{ fontSize: 20, margin: 0, lineHeight: 1.2 }}>
                                        {currentPost?.user?.firstName}
                                    </Title>

                                    <Title style={{ fontSize: 20, margin: 0, lineHeight: 1.2, marginBottom: 12 }}>
                                        {currentPost?.user?.lastName}
                                    </Title>

                                    <Divider style={{ borderColor: '#005475', margin: 0, marginBottom: "30px" }} />


                                    <Flex direction="column" gap={8} align="flex-start" style={{ width: '100%' }}>
                                        <Space align="start" style={{ width: '100%' }}>
                                            <img src={phone} alt="телефон" />
                                            <Text style={{ color: "#999999" }}>{formatPhone(currentPost?.user?.telephoneNumber)}</Text>
                                        </Space>
                                    </Flex>
                                </div>
                            </div>

                            {/* Правая часть — информация о посте */}
                            <Flex vertical gap={12} style={{ flex: 1 }}>
                                <Flex vertical>
                                    <Text className={classes.title}>Название подразделения</Text>
                                    <Text className={classes.subtitle}>
                                        {parentPost?.id
                                            ? parentPost?.divisionName
                                            : currentPost?.divisionName}
                                    </Text>
                                </Flex>

                                <Flex vertical>
                                    <Text className={classes.title}>Название поста</Text>
                                    <Text className={classes.subtitle}>{currentPost?.postName}</Text>
                                </Flex>

                                <Flex vertical>
                                    <Text className={classes.title}>Роль поста</Text>
                                    <Text className={classes.subtitle}>
                                        {currentPost?.role?.roleName}
                                    </Text>
                                </Flex>

                                <Flex vertical>
                                    {currentPost?.isArchive && <Tag style={{ margin: 0 }}>Пост в архиве</Tag>}
                                </Flex>

                                <Flex vertical>
                                    <Text className={classes.title}>Продукт поста</Text>
                                    <Text className={classes.subtitle}>
                                        {currentPost?.product}
                                    </Text>
                                </Flex>

                                <Flex vertical>
                                    <Text className={classes.title}>Предназначение поста</Text>
                                    <Text className={classes.subtitle}>
                                        {currentPost?.purpose}
                                    </Text>
                                </Flex>

                                <Flex vertical>
                                    <Text className={classes.title}>Статистики поста</Text>
                                    <Text className={classes.subtitle}>
                                        {currentPost?.statistics?.length
                                            ? currentPost.statistics.map((item) => item.name).join(", ")
                                            : <Text className={classes.subtitle}>—</Text>}
                                    </Text>
                                </Flex>

                                <Flex vertical>
                                    <Text className={classes.title}>Политика поста</Text>
                                    <Text className={classes.subtitle}>
                                        {currentPost?.policy?.policyName || <Text className={classes.subtitle}>—</Text>}
                                    </Text>
                                </Flex>

                            </Flex>
                        </Flex>
                    </fieldset>
                </div>

            </div>
        </MainContentContainer>
    )
}
