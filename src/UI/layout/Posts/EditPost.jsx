import React from 'react';
import classes from './Post.module.css';
import { Card, Avatar, Typography, Space, Divider, Select, Input, Form, Button, Flex } from "antd";
import { PhoneOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function EditPost() {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        console.log('Form values:', values);
    };

    return (
        <div className={classes.main}>
            <Card style={{ borderRadius: 8, padding: 16, width:"800px" }} bodyStyle={{ padding: 0 }}>
                <Form form={form} layout="vertical" onFinish={handleFinish}>
                    
                    {/* Руководящий пост */}
                    <Form.Item
                        label="Руководящий пост"
                        name="leader"
                        rules={[{ required: true, message: 'Выберите руководителя' }]}
                    >
                        <Select placeholder="Выберите руководителя">
                            <Option value="andrey">Андрей Макаров</Option>
                            <Option value="ivan">Иван Иванов</Option>
                        </Select>
                    </Form.Item>

                    <Divider />

                    <Flex vertical gap={24}>
                        {/* Верхняя часть: сотрудник + блок с полями */}
                        <Flex gap={24} align="start">
                            {/* Левая карточка сотрудника */}
                            <Card style={{
                                width: 250,
                                textAlign: "center",
                                borderRadius: 8,
                                backgroundColor: "#fafafa",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                            }}>
                                <Avatar size={96} src="https://i.pravatar.cc/150?img=11" style={{ marginBottom: 12 }} />
                                <Title level={5}>Алексей Любимов</Title>
                                <Divider />
                                <Flex vertical gap={8} align="flex-start">
                                    <Space>
                                        <PhoneOutlined />
                                        <Text>+7 (925) 512 46 64</Text>
                                    </Space>
                                </Flex>
                            </Card>

                            {/* Правая колонка с полями */}
                            <Flex vertical gap={12} style={{ flex: 1 }}>
                                <Form.Item
                                    label="Название подразделения"
                                    name="department"
                                    rules={[{ required: true, message: 'Введите название подразделения' }]}
                                >
                                    <Input placeholder="Название подразделения" />
                                </Form.Item>

                                <Form.Item
                                    label="Название поста"
                                    name="postName"
                                    rules={[{ required: true, message: 'Введите название поста' }]}
                                >
                                    <Input placeholder="Название поста" />
                                </Form.Item>

                                <Form.Item
                                    label="Продукт поста"
                                    name="product"
                                    rules={[{ required: true, message: 'Введите продукт поста' }]}
                                >
                                    <TextArea rows={3} placeholder="Описание продукта поста" />
                                </Form.Item>

                                <Form.Item
                                    label="Предназначение поста"
                                    name="purpose"
                                    rules={[{ required: true, message: 'Введите предназначение поста' }]}
                                >
                                    <TextArea rows={3} placeholder="Предназначение поста" />
                                </Form.Item>
                            </Flex>
                        </Flex>

                        {/* Нижняя часть — на всю ширину */}
                        <Flex vertical gap={12}>
                            <Form.Item
                                label="Статистика поста"
                                name="stats"
                                rules={[{ required: true, message: 'Выберите статистики поста' }]}
                            >
                                <Select
                                    mode="multiple"
                                    showSearch
                                    placeholder="Выберите статистики"
                                >
                                    <Option value="delivered">Количество доставленных грузов</Option>
                                    <Option value="idle">Время простоя</Option>
                                    <Option value="errors">Ошибки при приёме</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                label="Политика поста"
                                name="policy"
                                rules={[{ required: true, message: 'Выберите политику поста' }]}
                            >
                                <Select placeholder="Выберите политику">
                                    <Option value="opd">ОПД грузчика склада</Option>
                                    <Option value="safety">Политика безопасности</Option>
                                </Select>
                            </Form.Item>
                        </Flex>
                    </Flex>

                    <Form.Item style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit">Сохранить</Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}
