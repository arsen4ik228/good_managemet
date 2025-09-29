import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Form, Input, Select, Avatar, message, Space } from "antd";
import { useCreatePost, useGetDataForCreatePost } from "@hooks";

import { baseUrl } from "@helpers/constants.js";

const { TextArea } = Input;

export default function ModalCreatePost({ open, setOpen }) {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { createPost, reduxSelectedOrganizationId } = useCreatePost();
    const {
        maxDivisionNumber,
        workers,
        roles
    } = useGetDataForCreatePost();

    useEffect(() => {
        const defaultRole = roles.find((r) => r.roleName === "Сотрудник");
        if (defaultRole) {
            form.setFieldsValue({ roleId: defaultRole.id });
        }
    }, [roles, form]);


    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await createPost({
                ...values,
                divisionName:`Подразделение №${maxDivisionNumber}`,
                organizationId: reduxSelectedOrganizationId
            })
                .unwrap()
                .then((result) => {
                    message.success("Пост успешно создан ✅");
                    form.resetFields();
                    setOpen(false);
                    navigate(`helper/posts/${result?.id}`);
                })
        } catch (error) {
            if (error.errorFields) {
                message.error("Заполните обязательные поля!");
            } else {
                message.error("Не удалось создать пост. Попробуйте снова.");
                console.error("Ошибка при создании поста:", error);
            }
        }
    };

    return (
        <Modal
            title="Создание поста"
            open={open}
            onOk={handleOk}
            onCancel={() => setOpen(false)}
            okText="Создать"
            cancelText="Отмена"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="postName"
                    label="Название поста"
                    rules={[{ required: true, message: "Введите название поста" }]}
                >
                    <Input placeholder="Введите название" />
                </Form.Item>

                <Form.Item
                    name="responsibleUserId"
                    label="Сотрудник"
                    rules={[{ required: true, message: "Выберите сотрудника" }]}
                >
                    <Select
                        showSearch
                        placeholder="Выберите сотрудника"
                        optionFilterProp="searchValue"
                        options={workers.map((w) => ({
                            label: (
                                <Space align="center" size="small">
                                    <Avatar
                                        src={w?.avatar_url ? `${baseUrl}${w.avatar_url}` : undefined}
                                        size={24}
                                    />
                                    <span>{w?.lastName} {w?.firstName}</span>
                                </Space>
                            ),
                            value: w.id,
                            searchValue: `${w?.lastName} ${w?.firstName}`, // 👈 поле для поиска
                        }))}
                        filterOption={(input, option) =>
                            option?.searchValue?.toLowerCase().includes(input.toLowerCase())
                        }
                    />

                </Form.Item>



                <Form.Item
                    name="roleId"
                    label="Роль поста"
                    rules={[{ required: true, message: "Назначьте роль посту" }]}
                    initialValues={{
                        roleId: roles.find((r) => r.roleName === "Сотрудник")?.id,
                    }}
                >
                    <Select
                        showSearch
                        optionFilterProp="label"
                        options={roles.map((r) => ({
                            label: r.roleName,
                            value: r.id,
                        }))}
                        filterOption={(input, option) =>
                            option?.label?.toLowerCase().includes(input.toLowerCase())
                        }
                    />

                </Form.Item>

                <Form.Item
                    name="product"
                    label="Продукт поста"
                    rules={[{ required: true, message: "Опишите продукт поста" }]}
                >
                    <TextArea rows={4} placeholder="Опишите продукт поста" />
                </Form.Item>

                <Form.Item
                    name="purpose"
                    label="Предназначение"
                    rules={[{ required: true, message: "Опишите предназначение поста" }]}
                >
                    <TextArea rows={4} placeholder="Опишите назначение поста" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
