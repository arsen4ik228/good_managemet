import React, {useState, useEffect} from "react";
import {
    Space,
    Button,
    Input,
    Select,
    Form,
    Flex,
    Modal,
} from "antd";
import {CloseOutlined} from "@ant-design/icons";
import {message} from "antd";


import {useGetSingleOrganization, useUpdateSingleOrganization} from "@hooks";

export const days = [
    {id: 1, name: "Понедельник"},
    {id: 2, name: "Вторник"},
    {id: 3, name: "Среда"},
    {id: 4, name: "Четверг"},
    {id: 5, name: "Пятница"},
    {id: 6, name: "Суббота"},
    {id: 0, name: "Воскресенье"},
];

export default function ModalUpdateOrganization({
                                                    handleOrganizationNameButtonClick,
                                                    organizationId,
                                                    allOrganizations,
                                                    open,
                                                    setOpen,
                                                }) {
    const [form] = Form.useForm();
    const [isSaving, setIsSaving] = useState(false);

    const {
        currentOrganization,
        isLoadingOrganizationId,
        isFetchingOrganizationId,
    } = useGetSingleOrganization({organizationId, enabled: open});

    const {
        updateOrganization,
    } = useUpdateSingleOrganization();

    const handlePostValuesChange = (changedValues, allValues) => {
        const cleanedValues = Object.fromEntries(
            Object.entries(allValues).map(([key, value]) => [
                key,
                value === undefined ? null : value,
            ])
        );
        form.setFieldsValue(cleanedValues);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            const response = await form.validateFields();
            await updateOrganization({
                _id: currentOrganization.id,
                ...response,
            }).unwrap();
            // handleOrganizationNameButtonClick(currentOrganization.id, response.organizationName, response.reportDay)
            message.success("Данные успешно обновлены!");
            setOpen(false);
        } catch (error) {
            if (error.errorFields) {
                message.error("Пожалуйста, заполните все поля корректно.");
            } else {
                message.error("Ошибка при обновлении организации.");
                console.error("Детали ошибки:", JSON.stringify(error, null, 2));
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = () => {
        form.setFieldsValue({
            organizationName: currentOrganization.organizationName ?? null,
            reportDay: currentOrganization.reportDay ?? null,
            parentOrganizationId: currentOrganization.parentOrganizationId ?? null,
        });
    };

    useEffect(() => {
        if (
            !currentOrganization ||
            isLoadingOrganizationId ||
            isFetchingOrganizationId
        )
            return;

        const initialValues = {
            organizationName: currentOrganization.organizationName ?? null,
            reportDay: currentOrganization.reportDay ?? null,
            parentOrganizationId: currentOrganization.parentOrganizationId ?? null,
        };


        form.setFieldsValue(initialValues);
    }, [currentOrganization, isLoadingOrganizationId, isFetchingOrganizationId]);

    return (
        <Modal
            title={<p>Обновление организации</p>}
            open={open}
            onCancel={() => setOpen(false)}
            width={700}
            closeIcon={<CloseOutlined/>}
            footer={
                <Space style={{marginTop: "auto"}}>
                    <Button type="primary" onClick={handleSave} loading={isSaving}>
                        Сохранить
                    </Button>
                    <Button onClick={handleReset}>Сбросить</Button>
                </Space>
            }
        >
            <Flex vertical={true} style={{height: "100%"}}>
                <Form
                    form={form}
                    onValuesChange={handlePostValuesChange}
                    layout="vertical"
                    style={{flexGrow: 1}}
                >
                    {/* Название организации */}
                    <Form.Item
                        label="Название организации"
                        name="organizationName"
                        rules={[
                            {required: true, message: "Пожалуйста, введите название!"},
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    {/* Отчетный день*/}
                    <Form.Item
                        label="Отчетный день"
                        name="reportDay"
                        rules={[
                            {
                                required: true,
                                message: "Пожалуйста, выберите отчетный день!",
                            },
                        ]}
                    >
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option?.label.toLowerCase().includes(input.toLowerCase())
                            }
                            options={days.map((day) => ({
                                label: day.name,
                                value: day.id,
                            }))}
                        />
                    </Form.Item>

                    {/* Родительская организация */}
                    <Form.Item
                        label="Родительская организация"
                        name="parentOrganizationId"
                    >
                        <Select
                            allowClear
                            showSearch
                            optionFilterProp="label"
                            filterOption={(input, option) =>
                                option?.label.toLowerCase().includes(input.toLowerCase())
                            }
                            options={allOrganizations?.map((org) => ({
                                label: org.organizationName,
                                value: org.id,
                            }))}
                        />
                    </Form.Item>

                </Form>
            </Flex>
        </Modal>
    );
}
