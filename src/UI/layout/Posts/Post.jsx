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
import TextArea from 'antd/es/input/TextArea';



const { Title, Text } = Typography;


export default function Post() {

    const { postId } = useParams();

    const { PRESETS } = useRightPanel();

    usePanelPreset(PRESETS["POSTS"]);


    const { buttonsArr } = useModuleActions("post", postId);

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
        <MainContentContainer buttons={buttonsArr} >
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
                                <Flex vertical style={{ margin: 0, marginTop: "5px", gap: 0 }}>
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
                        position: "relative",
                    }
                }>

                    <fieldset className={classes.fieldset2} style={{
                        borderRadius: "10px",
                        display: "flex",
                        flexDirection: "column",
                        rowGap: "20px",
                        padding: "24px 24px 30px 24px",
                    }}>
                        <legend>пост</legend>
                        <Flex gap={24}>
                            {/* Левая часть — сотрудник */}

                            <div style={{
                                width: "275px",
                                display: "flex",
                                flexDirection: "column",
                                borderRadius: "10px",
                                backgroundColor: "#f0f0f0",
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
                                    backgroundColor: "#f0f0f0",
                                }}>
                                    <Title style={{ fontSize: 20, margin: 0, lineHeight: 1.2 }}>
                                        {currentPost?.user?.firstName}
                                    </Title>

                                    <Title style={{ fontSize: 20, margin: 0, lineHeight: 1.2 }}>
                                        {currentPost?.user?.middleName}
                                    </Title>

                                    <Title style={{ fontSize: 20, margin: 0, lineHeight: 1.2, marginBottom: 12 }}>
                                        {currentPost?.user?.lastName}
                                    </Title>

                                    <Divider style={{ borderColor: '#005475', margin: 0, marginBottom: "15px" }} />


                                    <Flex direction="column" gap={8} align="flex-start" style={{ width: '100%' }}>
                                        <Space align="start" style={{ width: '100%' }}>
                                            <img src={phone} alt="телефон" />
                                            <Text style={{ color: "#999999" }}>{formatPhone(currentPost?.user?.telephoneNumber)}</Text>
                                        </Space>
                                    </Flex>
                                </div>
                            </div>

                            {/* Правая часть — информация о посте */}
                            <Flex vertical gap={16} style={{ flex: 1 }}>
                                <Flex vertical style={{ marginLeft: "27px" }}>
                                    <Text className={classes.title}>Название подразделения</Text>
                                    <Text className={classes.subtitle}>
                                        {parentPost?.id
                                            ? parentPost?.divisionName
                                            : currentPost?.divisionName}
                                    </Text>
                                </Flex>

                                <Flex vertical style={{ marginLeft: "27px" }}>
                                    <Text className={classes.title}>Название поста</Text>
                                    <Text className={classes.subtitle}>{currentPost?.postName}</Text>
                                </Flex>


                                <fieldset style={{ border: "1px solid #d9d9d9" }}>
                                    <legend className={classes.title}>Роль поста</legend>
                                    <Text className={classes.subtitle} style={{paddingLeft:"5px"}}>
                                        {currentPost?.role?.roleName}
                                    </Text>
                                </fieldset>


                                <fieldset style={{ minHeight: "90px", maxHeight: "90px", border: " 1px solid #d9d9d9" }}>
                                    <legend className={classes.title} >Продукт поста</legend>
                                     <TextArea value=  {currentPost?.product} bordered={false} style={{ resize: 'none' }} rows={2} />
                                </fieldset>


                                <fieldset style={{ minHeight: "90px", maxHeight: "90px", border: " 1px solid #d9d9d9" }}>
                                    <legend className={classes.title} >Предназначение поста</legend>
                                      <TextArea value={currentPost?.purpose} bordered={false} style={{ resize: 'none' }} rows={2} placeholder="Описание продукта поста" />
                                </fieldset>

                            </Flex>

                        </Flex>

                        <Flex vertical gap={16}>
                            <fieldset style={{ minHeight: "90px", maxHeight: "90px", border: "1px solid #d9d9d9" }}>
                                <legend className={classes.title}>Статистики поста</legend>
                                <TextArea value= {currentPost?.statistics?.length > 0
                                        ? currentPost.statistics?.filter(s => s.isActive === true).map((item) => item.name).join(", ")
                                        : "—"} bordered={false} style={{ resize: 'none' }} rows={2} placeholder="Описание продукта поста" />
                            </fieldset>

                            <fieldset style={{ border: "1px solid #d9d9d9" }}>
                                <legend className={classes.title} >Политика поста</legend>
                                <Text className={classes.subtitle} style={{paddingLeft:"5px"}}>
                                    {currentPost?.policy?.policyName || <Text className={classes.subtitle}>—</Text>}
                                </Text>
                            </fieldset>
                        </Flex>
                    </fieldset>
                </div>

            </div>
        </MainContentContainer>
    )
}
