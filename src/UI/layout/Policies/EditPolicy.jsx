import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


import { useGetSinglePolicy, useUpdatePolicy } from '@hooks';
import EditContainer from "@Custom/EditContainer/EditContainer";
import Mdxeditor from "@Custom/Mdxeditor/Mdxeditor.jsx";

import { Select, Input, Form, Modal, message, Tooltip } from "antd";
import { ExclamationCircleFilled, InfoCircleOutlined } from "@ant-design/icons";
import isEqual from "lodash/isEqual";


const arrayTypes = [
    {
        value: "Директива",
        label: "Директива",
        description: "Директива - это документ, устанавливающий организационные моменты. Это может быть описание поста, включая результат поста, метрику, правила, структурное положение, кому пост подчиняется и кто у него в подчинении. Это могут быть общие правила, установленные в компании, правила работы с клиентами, ведения отчётности и тому подобное. Регламент, постоянно действующий приказ и другие подобные документы оформляются как директива."
    },
    {
        value: "Инструкция",
        label: "Инструкция",
        description: "Инструкция - это документ, содержащий описание технологии получения результата. Это описание может включать инструменты, последовательность, процедуры и прочее. Технический регламент, стандарт, технологическая карта и другие подобные документы являются инструкциями."
    },
    {
        value: "Распоряжение",
        label: "Распоряжение",
        description: "Распоряжение - это документ с ограниченным сроком действия. Любые документы с ограниченным сроком действия оформляются как распоряжение."
    },
];



const arrayState = [
    { value: "Черновик", label: "Черновик" },
    { value: "Активный", label: "Активный" },
    { value: "Отменён", label: "Отменён" },
];

export default function EditPolicy() {
    const channel = new BroadcastChannel("policy_channel");
    const channelName = new BroadcastChannel("policyName_channel");

    const [resetKey, setResetKey] = useState(0);

    const { policyId } = useParams();

    const [form] = Form.useForm();
    const [initialValues, setInitialValues] = useState(null);
    const [editorState, setEditorState] = useState(null);

    const {
        currentPolicy,
    } = useGetSinglePolicy({
        policyId
    });

    const { updatePolicy } = useUpdatePolicy();

    useEffect(() => {
        if (currentPolicy?.id) {
            setInitialValues({
                policyName: currentPolicy.policyName ?? null,
                state: currentPolicy.state ?? null,
                type: currentPolicy.type ?? null,
            });
            setEditorState(currentPolicy?.content);
        }
    }, [currentPolicy]);

    const handleSave = async () => {
        try {
            const values = await form.validateFields();

            const hasContentChanges = !isEqual(editorState, currentPolicy.content);

            await updatePolicy({
                _id: policyId,
                ...values,
                ...(hasContentChanges ? { content: editorState } : {})
            }).unwrap();


            channel.postMessage("updated");

            if (values.policyName !== currentPolicy.policyName) {
                channelName.postMessage("name");
            }

            message.success("Данные успешно обновлены!");
            // обновляем initialValues, чтобы сбросить "грязное" состояние
            setInitialValues({
                ...values,
            });

            // синхронизируем форму с новыми данными
            form.setFieldsValue({
                ...values,
            });

        } catch (err) {
            message.error("Ошибка при сохранении");
        }

    };

    const handleReset = () => {
        const values = {
            policyName: currentPolicy.policyName ?? null,
            state: currentPolicy.state ?? null,
            type: currentPolicy.type ?? null,
        };

        setEditorState(currentPolicy?.content);
        setInitialValues(values);
        form.setFieldsValue(values);

        setResetKey(prev => prev + 1);
    };

    const exitClick = () => {
        const currentValues = form.getFieldsValue();
        const hasChanges = !isEqual(currentValues, initialValues);
        const hasContentChanges = !isEqual(editorState, currentPolicy.content);

        if (hasChanges || hasContentChanges) {
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
            {
                initialValues &&

                <EditContainer header={"Редактирование политики"} saveClick={handleSave} canselClick={handleReset} exitClick={exitClick}>

                    <div
                        style={{
                            overflow: "hidden",

                            flex: 1,

                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            columnGap: "20px"
                        }}>

                        <div style={{
                            width: "auto",
                            minHeight: "100%",
                            backgroundColor: "#fff",
                            border: "1px solid #CCCCCC",
                            borderRadius: "5px",
                            padding: "20px"
                        }}>
                            <Form
                                form={form}
                                initialValues={initialValues}
                                layout="vertical"
                                disabled={currentPolicy?.state === "Отменён"}>

                                <Form.Item
                                    label="Название политики"
                                    name="policyName"
                                    rules={[{ required: true, message: 'Введите название поста' }]}
                                >
                                    <Input placeholder="Название поста" />
                                </Form.Item>


                                <Form.Item
                                    label="Состояние"
                                    name="state"
                                >
                                    <Select
                                        options={arrayState}
                                    />
                                </Form.Item>

                                <Form.Item
                                    label="Тип"
                                    name="type"
                                >
                                    <Select
                                        options={arrayTypes}
                                        optionRender={(option) => (
                                            <Tooltip
                                                title={option.data.description}
                                                placement="right"
                                                color="white" // Белый фон
                                                overlayStyle={{
                                                    color: '#000000', // Черный текст
                                                    fontSize: '14px',
                                                    lineHeight: '1.5',
                                                    boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
                                                    maxWidth: '300px'
                                                }}
                                                overlayInnerStyle={{
                                                    color: '#000000', // Черный текст для внутреннего содержимого
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        width: '100%'
                                                    }}
                                                >
                                                    <span>{option.data.label}</span>
                                                </div>
                                            </Tooltip>
                                        )}
                                    />
                                </Form.Item>

                            </Form>
                        </div>


                        <div style={{
                            width: "auto",
                            minHeight: "100%",
                            backgroundColor: "#fff",
                            border: "1px solid #CCCCCC",
                            borderRadius: "5px",
                            overflowY: "auto",
                        }}>

                            <Mdxeditor
                                key={`${currentPolicy.id}-${resetKey}`}
                                editorState={editorState}
                                setEditorState={setEditorState}
                                readOnly={currentPolicy?.state === "Отменён"}
                                policyName={currentPolicy.policyName}
                                policyNumber={currentPolicy.policyNumber}
                                policyDate={currentPolicy.createdAt}
                                policyType={(currentPolicy.type).toUpperCase()}
                            ></Mdxeditor>

                        </div>
                    </div>
                </EditContainer >
            }

        </>
    );
}
