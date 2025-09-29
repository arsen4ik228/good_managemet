import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


import { useGetSinglePolicy, useUpdatePolicy } from '@hooks';
import EditContainer from "@Custom/EditContainer/EditContainer";
import Mdxeditor from "@Custom/Mdxeditor/Mdxeditor.jsx";

import { Select, Input, Form, Modal, message } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import isEqual from "lodash/isEqual";


const arrayTypes = [
    { value: "Директива", label: "Директива" },
    { value: "Инструкция", label: "Инструкция" },
    { value: "Распоряжение", label: "Распоряжение" },
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
