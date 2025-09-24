import React, { useState } from 'react'
import { Form, Input, Button, message } from "antd";
import InputMask from "react-input-mask";
import MainContentContainer from "@Custom/MainContentContainer/MainContentContainer";
import { useUserHook } from '@hooks';
import ModalCreatePost from './ModalCreatePost';

export default function CreateUser() {

    const [form] = Form.useForm();
    const [workerData, setWorkerData] = useState(null);
    const [openModal, setOpenModal] = useState(false);


    const {
        reduxSelectedOrganizationId,
        postUser,
    } = useUserHook();

    // Автоматически делаем первую букву заглавной
    const capitalizeFirstLetter = (value) => {
        if (!value) return "";
        return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    };

    const validateLetters = (_, value) => {
        if (!value || /^[A-Za-zА-Яа-яЁё]+$/.test(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error("Можно вводить только буквы"));
    };

    const onFinish = async (values) => {
        try {
            // Убираем все нецифровые символы из номера
            const cleanedValues = {
                ...values,
                telephoneNumber: "+" + values.telephoneNumber.replace(/\D/g, ""),
                organizationId: reduxSelectedOrganizationId,
            };

            const result = await postUser(cleanedValues).unwrap();

            setWorkerData({
                id: result?.id,
                firstName: cleanedValues.firstName,
                lastName: cleanedValues.lastName
            });

            form.resetFields();
            message.success("Данные успешно сохранены!");
        }
        catch (error) {
            message.error("Ошибка при создании пользователя");
        }
    };

    return (
        <MainContentContainer>
            <div
                style={{
                    minWidth: "300px",
                    height: "500px",
                    marginTop: "20px",
                    padding: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    backgroundColor: "#ffff",
                    borderRadius: "10px",
                    border: "1px solid #ddd",
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={() => {
                        message.error("Заполните все обязательные поля корректно");
                    }}
                >
                    <Form.Item
                        label="Имя"
                        name="firstName"
                        rules={[{ required: true, message: "Введите имя" }, { validator: validateLetters }]}
                        normalize={capitalizeFirstLetter}
                    >
                        <Input placeholder="Введите имя" />
                    </Form.Item>


                    <Form.Item
                        label="Фамилия"
                        name="lastName"
                        rules={[{ required: true, message: "Введите фамилию" }, { validator: validateLetters }]}
                        normalize={capitalizeFirstLetter}
                    >
                        <Input placeholder="Введите фамилию" />
                    </Form.Item>


                    <Form.Item
                        label="Отчество"
                        name="middleName"
                        rules={[{ required: true, validator: validateLetters }]}
                        normalize={capitalizeFirstLetter}
                    >
                        <Input placeholder="Введите отчество" />
                    </Form.Item>


                    <Form.Item
                        label="Телефон"
                        name="telephoneNumber"
                        rules={[{ required: true, message: "Введите телефон" }]}
                    >
                        <InputMask
                            mask="+9 (999) 999-99-99"
                            value={form.getFieldValue("telephoneNumber") || ""}
                            onChange={(e) => {
                                let digits = e.target.value.replace(/\D/g, "");
                                if (digits.length > 11) digits = digits.slice(0, 11);

                                let formatted = "";
                                if (digits.length > 0) formatted += "+" + digits[0];
                                if (digits.length > 1) formatted += " (" + digits.slice(1, 4);
                                if (digits.length >= 4) formatted += ") " + digits.slice(4, 7);
                                if (digits.length >= 7) formatted += "-" + digits.slice(7, 9);
                                if (digits.length >= 9) formatted += "-" + digits.slice(9, 11);

                                // обновляем только через setFieldsValue если реально отличается
                                if (formatted !== form.getFieldValue("telephoneNumber")) {
                                    form.setFieldsValue({ telephoneNumber: formatted });
                                }
                            }}
                        >
                            {(inputProps) => <Input {...inputProps} placeholder="+7 (999) 999-99-99" />}
                        </InputMask>
                    </Form.Item>



                    <Form.Item>
                        <Button type="primary" htmlType="submit" block>
                            Сохранить
                        </Button>
                    </Form.Item>


                    {
                        workerData &&
                        (
                            <Button block onClick={() => setOpenModal(true)}>
                                Создать пост для {workerData?.lastName} {workerData?.firstName}
                            </Button>
                        )

                    }

                    <ModalCreatePost
                        open={openModal}
                        setOpen={setOpenModal}
                        worker={workerData}
                        setWorker={setWorkerData}
                    />

                </Form>
            </div>
        </MainContentContainer>
    )
}
