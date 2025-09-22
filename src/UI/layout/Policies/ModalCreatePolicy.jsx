import { useNavigate } from "react-router-dom";
import { Modal, Form, Input, message } from "antd";
import { useCreatePolicy } from "@hooks";

export default function ModalCreatePolicy({ open, setOpen }) {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const { createPolicy, reduxSelectedOrganizationId } = useCreatePolicy();

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            await createPolicy({
                ...values,
                content: " ",
                organizationId: reduxSelectedOrganizationId
            })
                .unwrap()
                .then((result) => {
                    message.success("Политика успешно создана ✅");
                    form.resetFields();
                    setOpen(false);
                    navigate(`helper/policy/${result?.id}`);
                })
        } catch (error) {
            if (error.errorFields) {
                message.error("Заполните обязательные поля!");
            } else {
                message.error("Не удалось создать политику. Попробуйте снова.");
                console.error("Ошибка при создании политику:", error);
            }
        }
    };

    return (
        <Modal
            title="Создание политики"
            open={open}
            onOk={handleOk}
            onCancel={() => setOpen(false)}
            okText="Создать"
            cancelText="Отмена"
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="policyName"
                    label="Название политики"
                    rules={[{ required: true, message: "Введите название политики" }]}
                >
                    <Input placeholder="Введите название" />
                </Form.Item>
            </Form>
        </Modal>
    );
}
