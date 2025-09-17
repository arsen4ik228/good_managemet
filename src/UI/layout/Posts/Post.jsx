import React from 'react'
import { useParams } from 'react-router-dom';

import classes from './Post.module.css'

import { Card, Avatar, Typography, Space, Divider, Flex } from "antd";
import {
    PhoneOutlined,
} from "@ant-design/icons";

import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { useGetSinglePost } from '../../../hooks/Post/useGetSinglePost';
import { baseUrl } from "@helpers/constants.js";
import { formatPhone } from './function/functionForPost'
import { usePanelPreset } from '@hooks';
import { useRightPanel } from '@hooks';

const { Title, Text } = Typography;


export default function Post() {

    const { postId } = useParams();

    const { PRESETS } = useRightPanel();

    usePanelPreset(PRESETS["POSTS"]);

    const buutonsArr = [
        { text: 'редактировать', click: () => window.open(window.location.origin + '/#/' + 'editPost/' + postId, '_blank') },
    ]

    const {
        currentPost,
        parentPost,

        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetSinglePost({ postId });

    return (
        <MainContentContainer buttons={buutonsArr} >
            <div className={classes.main}>
                <Card
                    style={{
                        borderRadius: 8,
                        padding: 16,
                    }}
                    bodyStyle={{ padding: 0 }}
                >
                    {/* Руководитель */}
                    <Flex vertical align="center" style={{ marginBottom: 24 }}>
                        <Text type="secondary">Руководящий пост</Text>
                        {parentPost && Object.keys(parentPost).length ? (
                            <Space size="small" align="center">
                                <Avatar
                                    size={48}
                                    src={parentPost.user?.avatar_url ? `${baseUrl}${parentPost.user.avatar_url}` : null}
                                />
                                <Flex vertical>
                                    <Text strong>
                                        {parentPost.user?.lastName} {parentPost.user?.firstName}
                                    </Text>
                                    <Text type="secondary" style={{ fontSize: 12 }}>
                                        {parentPost.postName}
                                    </Text>
                                </Flex>
                            </Space>
                        ) : (
                            <Text type="secondary">—</Text> // показываем, что данных нет
                        )}
                    </Flex>

                    <Divider />

                    <Flex gap={24}>
                        {/* Левая часть — сотрудник */}
                        <Card
                            style={{
                                width: 250,
                                textAlign: "center",
                                borderRadius: 8,
                                backgroundColor: "#fafafa",
                            }}
                        >
                            <Avatar
                                size={96}
                                src={currentPost?.user?.avatar_url ? `${baseUrl}${currentPost?.user?.avatar_url}` : null}
                                style={{ marginBottom: 12 }}
                            />
                            <Title level={5}>{currentPost?.user?.lastName} {currentPost?.user?.firstName}</Title>

                            <Divider />

                            <Flex vertical gap={8} align="flex-start">
                                <Space>
                                    <PhoneOutlined />
                                    <Text>{formatPhone(currentPost?.user?.telephoneNumber)}</Text>
                                </Space>
                            </Flex>
                        </Card>

                        {/* Правая часть — информация о посте */}
                        <Flex vertical gap={12} style={{ flex: 1 }}>
                            <Flex vertical>
                                <Text type="secondary">Название подразделения</Text>
                                <Text strong>{currentPost?.divisionName}</Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Название поста</Text>
                                <Text strong>{currentPost?.postName}</Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Роль поста</Text>
                                <Text strong>
                                    {currentPost?.role?.roleName}
                                </Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Продукт поста</Text>
                                <Text>
                                    {currentPost?.product}
                                </Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Предназначение поста</Text>
                                <Text>
                                    {currentPost?.purpose}
                                </Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Статистики поста</Text>
                                <Text>
                                    {currentPost?.statistics?.length
                                        ? currentPost.statistics.map((item) => item.name).join(", ")
                                        : <Text type="secondary">—</Text>}
                                </Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Политика поста</Text>
                                <Text>
                                    {currentPost?.policy?.policyName || <Text type="secondary">—</Text>}
                                </Text>
                            </Flex>

                        </Flex>
                    </Flex>
                </Card>
            </div>
        </MainContentContainer>
    )
}
