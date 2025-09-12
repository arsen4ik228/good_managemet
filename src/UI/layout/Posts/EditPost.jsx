import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Card, Avatar, Typography, Space, Divider, Select, Input, Form, Modal, Flex, message } from "antd";
import { PhoneOutlined, ExclamationCircleFilled } from "@ant-design/icons";

import isEqual from "lodash/isEqual";

import { useGetSinglePost, useUpdateSinglePost, useAllStatistics, useUpdateStatisticsToPostId } from '@hooks';
import EditContainer from "@Custom/EditContainer/EditContainer";

import HandlerQeury from "@Custom/HandlerQeury.jsx";

import { baseUrl } from "@helpers/constants.js";

import { formatPhone } from './function/functionForPost'

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function EditPost() {

    const { postId } = useParams();

    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState(null);

    const [dropdownOpen, setDropdownOpen] = useState(false); // 👈 добавили состояние

    const {
        currentPost,
        workers,
        posts,
        parentPost,

        policiesActive,
        selectedPolicyIDInPost,

        statisticsIncludedPost,

        isLoadingGetPostId,
        isErrorGetPostId,
        isFetchingGetPostId,
    } = useGetSinglePost({ postId });

    const responsibleUserId = Form.useWatch("responsibleUserId", form);
    const selectedWorker = workers?.find(w => w.id === responsibleUserId);

    const {
        statistics = [],
        isLoadingGetStatistics,
        isFetchingGetStatistics,
        isErrorGetStatistics
    } = useAllStatistics();

    const {
        updatePost
    } = useUpdateSinglePost();

    const {
        updateStatisticsToPostId,
    } = useUpdateStatisticsToPostId();

    useEffect(() => {
        if (currentPost?.id) {
            setInitialValues({
                parentId: parentPost.id ?? null,
                postName: currentPost.postName ?? null,
                divisionName: currentPost.divisionName ?? null,
                product: currentPost.product ?? null,
                purpose: currentPost.purpose ?? null,
                responsibleUserId: currentPost?.user?.id ?? null,
                policyId: selectedPolicyIDInPost ?? null,
                statisticsIncludedPost: statisticsIncludedPost?.map(stat => stat.id) ?? [],
            });
        }
    }, [currentPost, selectedPolicyIDInPost]);

    const handleSave = async () => {
        try {
            const { statisticsIncludedPost, ...rest } = await form.validateFields();

            console.log("rest = ", rest);

            await updatePost({
                _id: postId,
                ...rest,
            }).unwrap();

            await updateStatisticsToPostId({
                postId: postId,
                ids: statisticsIncludedPost,
            }).unwrap();

            message.success("Данные успешно обновлены!");
            // обновляем initialValues, чтобы сбросить "грязное" состояние
            setInitialValues({
                ...rest,
                statisticsIncludedPost,
            });

            // синхронизируем форму с новыми данными
            form.setFieldsValue({
                ...rest,
                statisticsIncludedPost,
            });

        } catch (err) {
            message.error("Ошибка при сохранении");
        }

    };

    const handleReset = () => {
        const values = {
            parentId: parentPost.id ?? null,
            postName: currentPost.postName ?? null,
            divisionName: currentPost.divisionName ?? null,
            product: currentPost.product ?? null,
            purpose: currentPost.purpose ?? null,
            responsibleUserId: currentPost?.user?.id ?? null,
            policyId: selectedPolicyIDInPost ?? null,
            statisticsIncludedPost: statisticsIncludedPost?.map(stat => stat.id) ?? [],
        };

        setInitialValues(values);
        form.setFieldsValue(values);
    };


    const exitClick = () => {
        const currentValues = form.getFieldsValue();
        const hasChanges = !isEqual(currentValues, initialValues);

        if (hasChanges) {
            Modal.confirm({
                title: "Есть несохранённые изменения",
                icon: <ExclamationCircleFilled />,
                content:
                    "Вы хотите сохранить изменения перед выходом из режима редактирования?",
                okText: "Сохранить",
                cancelText: "Не сохранять",
                onOk() {
                    handleSave().then(() => window.close());
                },
                onCancel() {
                    window.close();
                },
            });
        } else {
            window.close();
        }
    };

    return (
        <>
            <HandlerQeury
                Error={isErrorGetPostId}
                Loading={isLoadingGetPostId}
                Fetching={isFetchingGetPostId}
            ></HandlerQeury>

            {
                initialValues && <EditContainer saveClick={handleSave} canselClick={handleReset} exitClick={exitClick}>
                    <div style={{
                        position: "relative",

                        width: "1000px",

                        flex: "1 0 120px",

                        backgroundColor: "#fff",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",

                        border: "1px solid #CCCCCC",
                        borderRadius: "5px",

                        overflowY: "auto",
                    }}>
                        <Card style={{ borderRadius: 8, padding: 16, width: "800px" }} bodyStyle={{ padding: 0 }}>
                            <Form
                                form={form}
                                initialValues={initialValues}
                                layout="vertical">

                                {/* Руководящий пост */}
                                <Form.Item
                                    label="Руководящий пост"
                                    name="parentId"
                                >
                                    <Select
                                        placeholder="Выберите руководителя"
                                        allowClear
                                        showSearch
                                        optionFilterProp="label"
                                        options={posts.map((post) => ({
                                            label: post.postName,
                                            value: post.id,
                                        }))} />
                                </Form.Item>

                                <Divider />

                                <Flex vertical gap={24}>
                                    {/* Верхняя часть: сотрудник + блок с полями */}
                                    <Flex gap={24} align="start">

                                        <div style={{ position: "relative" }}>
                                            <Card
                                                style={{
                                                    width: 250,
                                                    textAlign: "center",
                                                    borderRadius: 8,
                                                    backgroundColor: "#fafafa",
                                                    cursor: "pointer",
                                                    position: "relative",
                                                }}
                                                onClick={() => setDropdownOpen(true)}
                                            >
                                                <Avatar
                                                    size={96}
                                                    src={
                                                        selectedWorker?.avatar_url
                                                            ? `${baseUrl}${selectedWorker?.avatar_url}`
                                                            : undefined
                                                    }
                                                    style={{ marginBottom: 12 }}
                                                />
                                                <Title level={5} style={{ marginBottom: 8 }}>
                                                    {selectedWorker?.lastName} {selectedWorker?.firstName}
                                                </Title>

                                                {/* 👇 Form.Item всегда в DOM, но скрыт, если dropdownOpen=false */}
                                                <Form.Item name="responsibleUserId" style={{ display: dropdownOpen ? "block" : "none" }}>
                                                    <Select
                                                        open={dropdownOpen}
                                                        suffixIcon={null}
                                                        style={{ width: 300 }}
                                                        bordered={false}
                                                        onDropdownVisibleChange={setDropdownOpen}
                                                        getPopupContainer={(trigger) => trigger.parentElement || document.body}
                                                        onSelect={() => setDropdownOpen(false)} // закрываем после выбора
                                                    >
                                                        {workers?.map((worker) => (
                                                            <Select.Option key={worker.id} value={worker.id}>
                                                                <Flex align="center" gap={8}>
                                                                    <Avatar
                                                                        size={32}
                                                                        src={
                                                                            worker.avatar_url
                                                                                ? `${baseUrl}${worker.avatar_url}`
                                                                                : undefined
                                                                        }
                                                                    />
                                                                    <span
                                                                        style={{
                                                                            display: "inline-block",
                                                                            maxWidth: 250,
                                                                            whiteSpace: "nowrap",
                                                                            overflow: "hidden",
                                                                            textOverflow: "ellipsis",
                                                                        }}
                                                                    >
                                                                        {worker.lastName} {worker.firstName}
                                                                    </span>
                                                                </Flex>
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                                <Divider />
                                                <Flex vertical gap={8} align="flex-start">
                                                    <Space>
                                                        <PhoneOutlined />
                                                        <Text>{formatPhone(selectedWorker?.telephoneNumber)}</Text>
                                                    </Space>
                                                </Flex>
                                            </Card>
                                        </div>


                                        {/* Правая колонка с полями */}
                                        <Flex vertical gap={12} style={{ flex: 1 }}>
                                            <Form.Item
                                                label="Название подразделения"
                                                name="divisionName"
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
                                            label="Политика поста"
                                            name="policyId"
                                        >
                                            <Select
                                                placeholder="Выберите политику"
                                                allowClear
                                                showSearch
                                                optionFilterProp="label"
                                                options={policiesActive.map((p) => ({
                                                    label: p.policyName,
                                                    value: p.id,
                                                }))}
                                            />
                                        </Form.Item>

                                        <Form.Item
                                            label="Статистика поста"
                                            name="statisticsIncludedPost"
                                        >
                                            <Select
                                                mode="multiple"
                                                showSearch
                                                placeholder="Выберите статистики"
                                                optionFilterProp="label"
                                                options={statistics?.map((p) => ({
                                                    label: p.name,
                                                    value: p.id,
                                                    disabled: initialValues?.statisticsIncludedPost?.includes(p.id),
                                                }))}
                                            />
                                        </Form.Item>

                                    </Flex>
                                </Flex>
                            </Form>
                        </Card>
                    </div>
                </EditContainer>
            }

        </>
    );
}
