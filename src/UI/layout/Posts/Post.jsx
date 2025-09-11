import React from 'react'
import classes from './Post.module.css'

import { Card, Avatar, Typography, Space, Divider, Flex } from "antd";
import {
    PhoneOutlined,
    MailOutlined,
    UserOutlined,
} from "@ant-design/icons";

import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'

const { Title, Text } = Typography;


export default function Post() {
    return (
        <MainContentContainer>
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
                        <Text type="secondary">руководящий пост</Text>
                        <Space size="small" align="center">
                            <Avatar src="https://i.pravatar.cc/100" />
                            <Flex vertical>
                                <Text strong>Андрей Макаров</Text>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                    Начальник склада
                                </Text>
                            </Flex>
                        </Space>
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
                                src="https://i.pravatar.cc/150?img=11"
                                style={{ marginBottom: 12 }}
                            />
                            <Title level={5}>Алексей Любимов</Title>

                            <Divider />

                            <Flex vertical gap={8} align="flex-start">
                                <Space>
                                    <PhoneOutlined />
                                    <Text>+7 (925) 512 46 64</Text>
                                </Space>
                            </Flex>
                        </Card>

                        {/* Правая часть — информация о посте */}
                        <Flex vertical gap={12} style={{ flex: 1 }}>
                            <Flex vertical>
                                <Text type="secondary">Название подразделения</Text>
                                <Text strong>Грузчики</Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Название поста</Text>
                                <Text strong>Старший грузчик</Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Продукт поста</Text>
                                <Text>
                                    Товары доставленные на склад или со склада в целости и сохранности
                                </Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Предназначение поста</Text>
                                <Text>
                                    Обеспечивать быструю приёмку и выдачу товаров на складе
                                </Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Статистики поста</Text>
                                <Text>Количество доставленных грузов</Text>
                                <Text>Время простоя</Text>
                            </Flex>

                            <Flex vertical>
                                <Text type="secondary">Политика поста</Text>
                                <Text>ОПД грузчика склада</Text>
                            </Flex>
                        </Flex>
                    </Flex>
                </Card>
            </div>
        </MainContentContainer>
    )
}
