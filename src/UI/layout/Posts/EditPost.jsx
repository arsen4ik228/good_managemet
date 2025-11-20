import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Card, Avatar, Typography, Space, Tag, Divider, Select, Input, Form, Modal, Flex, message, Checkbox, Button } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

import isEqual from "lodash/isEqual";

import { useGetSinglePost, useUpdateSinglePost, useAllStatistics, useUpdateStatisticsToPostId, useGetDataForCreatePost, useAllPosts } from '@hooks';
import {
    useUpdateSingleStatistic
} from "@hooks";

import EditContainer from "@Custom/EditContainer/EditContainer";

import { baseUrl } from "@helpers/constants.js";

import { formatPhone } from './function/functionForPost'

import default_avatar from '@image/default_avatar.svg'

import classes from './EditPost.module.css'
import phone from '@image/phone.svg'

const { Title, Text } = Typography;
const { TextArea } = Input;

export default function EditPost() {

    const channel = new BroadcastChannel("post_channel");
    const channelName = new BroadcastChannel("postName_channel");

    const { postId } = useParams();

    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState(null);

    const [dropdownOpen, setDropdownOpen] = useState(false); // 👈 добавили состояние

    const { roles } = useGetDataForCreatePost();


    const {
        allPosts: posts,
    } = useAllPosts();

    const {
        currentPost,
        workers,
        parentPost,

        policiesActive,
        selectedPolicyIDInPost,

        statisticsIncludedPost,
    } = useGetSinglePost({ postId });

    const responsibleUserId = Form.useWatch("responsibleUserId", form);
    const selectedWorker = workers?.find(w => w.id === responsibleUserId);

    const parentId = Form.useWatch("parentId", form);
    const selectedParent = posts?.find(p => p.id === parentId);

    const {
        statistics = [],
    } = useAllStatistics({ isActive: true });

    console.log("statistics =", statistics);

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
                postName: currentPost.postName?.trim() === "" ? "" : currentPost.postName ?? null,

                divisionName: currentPost.divisionName ?? null,

                isArchive: Boolean(currentPost.isArchive),

                roleId: currentPost.role.id ?? null,
                product: currentPost.product ?? null,
                purpose: currentPost.purpose ?? null,
                responsibleUserId: currentPost?.user?.id ?? null,
                policyId: selectedPolicyIDInPost ?? null,
                statisticsIncludedPost: statisticsIncludedPost?.filter(s => s.isActive === true).map(stat => stat.id) ?? [],
            });
        }
    }, [currentPost, selectedPolicyIDInPost]);

    const handleSave = async () => {
        try {
            const { statisticsIncludedPost, ...rest } = await form.validateFields();

            // 👇 если есть parentId — не отправляем divisionName на сервер
            if (rest.parentId) {
                delete rest.divisionName;
            }

            await updatePost({
                _id: postId,
                ...rest,
            }).unwrap();


            channel.postMessage("updated");

            if (rest.postName !== currentPost.postName) {
                channelName.postMessage("name");
            }

            await updateStatisticsToPostId({
                postId,
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

            isArchive: Boolean(currentPost.isArchive),

            roleId: currentPost.role.id ?? null,
            product: currentPost.product ?? null,
            purpose: currentPost.purpose ?? null,
            responsibleUserId: currentPost?.user?.id ?? null,
            policyId: selectedPolicyIDInPost ?? null,
            statisticsIncludedPost: statisticsIncludedPost?.filter(s => s.isActive === true).map(stat => stat.id) ?? [],
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

    useEffect(() => {
        if (parentId) {
            const parent = posts?.find(p => p.id === parentId);
            if (parent) {
                form.setFieldsValue({
                    divisionName: parent.divisionName || "",
                });
            }
        } else {
            // если родитель снят — вернуть divisionName текущего поста
            form.setFieldsValue({
                divisionName: currentPost?.divisionName || "",
            });
        }
    }, [parentId, posts, form, currentPost]);


    const [search, setSearch] = useState("");

    const filteredWorkers = workers?.filter((w) =>
        `${w.lastName} ${w.firstName}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );


    console.log("initialValues = ", initialValues);


    const handleChangeStatistics = (newValue) => {
        const initial = initialValues.statisticsIncludedPost || [];

        const removed = initial.filter(id => !newValue.includes(id));

        removed.forEach(id => handleArchiveStatistics(id));
    };


    const { updateStatistics } = useUpdateSingleStatistic();

    const handleArchiveStatistics = async (statisticId) => {
        console.log("handleArchiveStatistics");
        try {
            await updateStatistics({
                _id: statisticId,
                statisticId: statisticId,
                isActive: false
            }).unwrap();
            message.success("Данные успешно обновлены!");
        } catch (err) {
            message.error("Ошибка при сохранении");
        }
    };
    return (
        <>
            {
                initialValues && <EditContainer header={"Офис собственника"} saveClick={handleSave} canselClick={handleReset} exitClick={exitClick}
                    aditionalbtns={[{
                        name: "В архив", colorBtn: "#D07400", onClick: async () => {
                            try {
                                await updatePost({
                                    _id: postId,
                                    isArchive: true
                                }).unwrap();

                                message.success("Пост отправлен в архив");
                            } catch (err) {
                                message.error("Ошибка при обновлении");
                            }
                        }
                    }]}>
                    <div style={{
                        position: "relative",

                        width: "1000px",

                        flex: "1 0 120px",

                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",

                        padding: "10px",

                        backgroundColor: "#fff",
                        border: "1px solid #CCCCCC",
                        borderRadius: "5px",

                        overflowY: "auto",
                    }}>
                        <div style={{ borderRadius: 8, padding: 16, width: "800px" }} bodyStyle={{ padding: 0 }}>
                            <Form
                                form={form}
                                initialValues={initialValues}
                                layout="vertical"
                                disabled={currentPost.isArchive}
                            >

                                {/* Руководящий пост */}

                                <Flex vertical align="center" style={{ marginBottom: 24 }}>
                                    <div className={classes.fieldset} style={{
                                        border: "3px solid #d9d9d9",
                                        borderRadius: 12,
                                        padding: "24px 16px 16px",
                                        position: "relative",
                                        width: "100%",
                                        maxWidth: 450
                                    }}>
                                        <div style={{
                                            position: "absolute",
                                            top: -15,
                                            left: 16,
                                            background: "white",
                                            padding: "0 8px",
                                            fontSize: 14,
                                            color: "rgba(0, 0, 0, 0.45)"
                                        }}>
                                            руководящий пост
                                        </div>
                                        <Space size={0} align="start" >
                                            <Avatar
                                                size={48}
                                                src={selectedParent?.user?.avatar_url ? `${baseUrl}${selectedParent?.user?.avatar_url}` : default_avatar}
                                            />

                                            <Form.Item
                                                name="parentId"
                                                normalize={(value) => value ?? null}
                                                style={{ flex: 1, marginBottom: 0 }}
                                            >
                                                <Select
                                                    bordered={false}
                                                    style={{ width: 350 }}
                                                    placeholder="Выберите руководителя"
                                                    allowClear
                                                    showSearch
                                                    optionLabelProp="valueForSelected"
                                                    filterOption={(input, option) => {
                                                        const searchText = (option?.searchText || "").toLowerCase();
                                                        return searchText.includes(input.toLowerCase());
                                                    }}
                                                    options={posts.map((post) => {
                                                        const user = post?.user;
                                                        const fullName = [user?.lastName, user?.firstName].filter(Boolean).join(" "); // убираем null/undefined

                                                        return {
                                                            value: post.id,

                                                            // Для поиска:
                                                            searchText: `${post.postName} ${fullName}`,

                                                            // *** То, что показывается В ВЫБРАННОМ значении ***
                                                            valueForSelected: (
                                                                <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                                                                    <span className={classes.text}>{fullName}</span>
                                                                    <span className={classes.title}>{post.postName}</span>
                                                                </div>
                                                            ),

                                                            // *** То, что показывается В СПИСКЕ ***
                                                            label: (
                                                                <Flex align="center" gap={8}>
                                                                    <Avatar
                                                                        size={24}
                                                                        src={user?.avatar_url ? `${baseUrl}${user.avatar_url}` : default_avatar}
                                                                    />
                                                                    <span style={{
                                                                        display: "inline-block",
                                                                        maxWidth: 280,
                                                                        whiteSpace: "nowrap",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                    }}>
                                                                        {post.postName}
                                                                        {fullName && (
                                                                            <span style={{ color: "#888", marginLeft: 4 }}>({fullName})</span>
                                                                        )}
                                                                    </span>
                                                                </Flex>
                                                            ),

                                                        };
                                                    })}
                                                />

                                            </Form.Item>
                                        </Space>
                                    </div>
                                </Flex>


                                <div style={
                                    {
                                        position: "relative"
                                    }
                                }>

                                    <div className={classes.fieldset2} style={{
                                        border: "3px solid #d9d9d9",
                                        borderRadius: 12,
                                        padding: "24px 16px 16px",
                                        position: "relative",
                                        width: "100%"
                                    }}>
                                        <div style={{
                                            position: "absolute",
                                            top: -15,
                                            left: 16,
                                            background: "white",
                                            padding: "0 8px",
                                            fontSize: 14,
                                            color: "rgba(0, 0, 0, 0.45)"
                                        }}>
                                            пост
                                        </div>
                                        <Flex vertical gap={24}>
                                            <Flex gap={24} align="stretch">
                                                {/* Карточка */}
                                                <div style={{ position: "relative", display: "flex" }}>
                                                    <Card
                                                        bodyStyle={{ padding: 0 }}
                                                        style={{
                                                            height: "100%",
                                                            width: 300,
                                                            textAlign: "center",
                                                            borderRadius: 8,
                                                            backgroundColor: "#fffff",
                                                            cursor: "pointer",
                                                            position: "relative",
                                                            borderColor: "#CCCCCC"
                                                        }}
                                                        onClick={() => setDropdownOpen(true)}
                                                    >

                                                        <div style={{ padding: 12, textAlign: "center" }}>
                                                            <Avatar
                                                                size={154}
                                                                src={
                                                                    selectedWorker?.avatar_url
                                                                        ? `${baseUrl}${selectedWorker?.avatar_url}`
                                                                        : default_avatar
                                                                }
                                                                style={{ margin: 0 }}
                                                            />
                                                        </div>

                                                        <Divider style={{ margin: 0, borderColor: "#CCCCCC" }} />

                                                        <div style={{ padding: 24, textAlign: "center" }}>
                                                            <Title style={{ fontSize: 20, margin: 0, lineHeight: 1.2 }}>
                                                                {selectedWorker?.firstName}
                                                            </Title>

                                                            <Title style={{ fontSize: 20, margin: 0, lineHeight: 1.2 }}>
                                                                {selectedWorker?.middleName}
                                                            </Title>

                                                            <Title style={{ fontSize: 20, margin: 0, lineHeight: 1.2, marginBottom: 12 }}>
                                                                {selectedWorker?.lastName}
                                                            </Title>

                                                            {/* 👇 Form.Item всегда в DOM, но скрыт, если dropdownOpen=false */}
                                                            <Form.Item
                                                                name="responsibleUserId"
                                                                normalize={(value) => value ?? null}
                                                                style={{ display: dropdownOpen ? "block" : "none" }}
                                                            >
                                                                <Select
                                                                    open={dropdownOpen}
                                                                    suffixIcon={null}
                                                                    style={{ width: 300 }}
                                                                    allowClear
                                                                    bordered={false}
                                                                    placeholder="Выберите сотрудника"
                                                                    onDropdownVisibleChange={setDropdownOpen}
                                                                    getPopupContainer={(trigger) => trigger.parentElement || document.body}
                                                                    onSelect={() => {
                                                                        setDropdownOpen(false);
                                                                        setSearch("");
                                                                    }}
                                                                    dropdownRender={(menu) => (
                                                                        <>

                                                                            <div style={{ padding: 8 }}>
                                                                                <Input
                                                                                    placeholder="Поиск по имени или фамилии"
                                                                                    value={search}
                                                                                    onChange={(e) => setSearch(e.target.value)}
                                                                                    allowClear
                                                                                />
                                                                            </div>
                                                                            <div style={{ maxHeight: 300, overflowY: "auto" }}>
                                                                                {menu}
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                >

                                                                    <Select.Option key="remove-user" value={null}>
                                                                        <Button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation(); // чтобы не ломать выбор других опций
                                                                                form.setFieldsValue({ responsibleUserId: null });
                                                                                setDropdownOpen(false);
                                                                                setSearch("");
                                                                            }}
                                                                           
                                                                        >
                                                                            убрать сотрудника
                                                                        </Button>
                                                                    </Select.Option>


                                                                    {filteredWorkers?.map((worker) => (
                                                                        <Select.Option key={worker.id} value={worker.id}>
                                                                            <Flex align="center" gap={8}>
                                                                                <Avatar
                                                                                    size={32}
                                                                                    src={
                                                                                        worker.avatar_url
                                                                                            ? `${baseUrl}${worker.avatar_url}`
                                                                                            : default_avatar
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

                                                            <Divider style={{ borderColor: '#005475', margin: 0, marginBottom: "15px" }} />
                                                            <Flex vertical gap={8} align="flex-start">
                                                                <Space>

                                                                    <img src={phone} alt="телефон" />
                                                                    <Text style={{ borderBottom: "1px solid black" }}>{formatPhone(selectedWorker?.telephoneNumber)}</Text>
                                                                </Space>
                                                            </Flex>
                                                        </div>
                                                    </Card>
                                                </div>

                                                {/* Правая колонка с полями */}
                                                <Flex vertical gap={24} style={{ flex: 1 }}>
                                                    <Form.Item
                                                        style={{
                                                            marginBottom: 0,
                                                            border: 'none',
                                                            borderBottom: '2px solid #CCCCCC',
                                                            borderRadius: 0,
                                                            paddingLeft: 0,
                                                            paddingRight: 0
                                                        }}
                                                        label="Название подразделения"
                                                        name="divisionName"
                                                    >
                                                        <Input bordered={false} placeholder="Название подразделения" disabled={!!parentId} />
                                                    </Form.Item>

                                                    <Form.Item
                                                        style={{
                                                            marginBottom: 0,
                                                            border: 'none',
                                                            borderBottom: '2px solid #CCCCCC',
                                                            borderRadius: 0,
                                                            paddingLeft: 0,
                                                            paddingRight: 0
                                                        }}
                                                        label="Название поста"
                                                        name="postName"
                                                        rules={[{ required: true, message: 'Введите название поста' }]}
                                                    >
                                                        <Input bordered={false} placeholder="Название поста" />
                                                    </Form.Item>


                                                    <div className={classes.frame}>
                                                        <div className={classes.frameName}>
                                                            <span style={{ color: 'red' }}>*</span> Роль поста
                                                        </div>
                                                        <Form.Item
                                                            style={{ marginBottom: 0 }}
                                                            name="roleId"
                                                            rules={[{ required: true, message: "Назначьте роль посте" }]}
                                                        >
                                                            <Select
                                                                bordered={false}
                                                                showSearch
                                                                optionFilterProp="label"
                                                                options={roles.filter((item) => item.id !== "894559e4-fd79-434b-9c00-f95dee0d10ab" && item.id !== "44514689-427c-46e5-9e60-2d7b90b73fae").map((r) => ({
                                                                    label: r.roleName,
                                                                    value: r.id,
                                                                }))}
                                                                filterOption={(input, option) =>
                                                                    option?.label?.toLowerCase().includes(input.toLowerCase())
                                                                }
                                                            />

                                                        </Form.Item>
                                                    </div>


                                                    <div className={classes.frame}>
                                                        <div className={classes.frameName}>
                                                            Продукт поста
                                                        </div>
                                                        <Form.Item
                                                            style={{ marginBottom: 0 }}
                                                            name="product"
                                                        >
                                                            <TextArea bordered={false} style={{ resize: 'none' }} rows={3} placeholder="Описание продукта поста" />
                                                        </Form.Item>
                                                    </div>

                                                    <div className={classes.frame}>
                                                        <div className={classes.frameName}>
                                                            Предназначение поста
                                                        </div>
                                                        <Form.Item
                                                            style={{ marginBottom: 0 }}
                                                            name="purpose"
                                                        >
                                                            <TextArea bordered={false} style={{ resize: 'none' }} rows={3} placeholder="Предназначение поста" />
                                                        </Form.Item>
                                                    </div>

                                                </Flex>

                                            </Flex>

                                            {/* Нижняя часть — на всю ширину */}
                                            <Flex vertical gap={24}>

                                                <div className={classes.frame}>
                                                    <div className={classes.frameName}>
                                                        Статистика поста
                                                    </div>
                                                    <Form.Item
                                                        style={{ marginBottom: 0 }}
                                                        name="statisticsIncludedPost"
                                                    >
                                                        <Select
                                                            onChange={handleChangeStatistics}
                                                            bordered={false}
                                                            mode="multiple"
                                                            showSearch
                                                            placeholder="Выберите статистики"
                                                            optionFilterProp="label"
                                                            options={statistics
                                                                ?.filter(p => p.isActive === true)
                                                                .map(p => ({
                                                                    label: p.name,
                                                                    value: p.id
                                                                }))
                                                            }
                                                        />
                                                    </Form.Item>
                                                </div>


                                                <div className={classes.frame}>
                                                    <div className={classes.frameName}>
                                                        Политика поста
                                                    </div>
                                                    <Form.Item
                                                        style={{ marginBottom: 0 }}
                                                        name="policyId"
                                                        normalize={(value) => value ?? null}
                                                    >
                                                        <Select
                                                            bordered={false}
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
                                                </div>

                                            </Flex>
                                        </Flex>
                                    </div>
                                </div>

                            </Form>
                        </div>
                    </div>
                </EditContainer >
            }

        </>
    );
}
