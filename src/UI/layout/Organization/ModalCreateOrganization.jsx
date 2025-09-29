import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Input,
  Select,
  Form,
  Flex,
  Modal
} from "antd";
import { message } from "antd";
import { useCreateOrganization } from "@hooks";
import { CloseOutlined } from "@ant-design/icons";

export const days = [
  { id: 1, name: "Понедельник" },
  { id: 2, name: "Вторник" },
  { id: 3, name: "Среда" },
  { id: 4, name: "Четверг" },
  { id: 5, name: "Пятница" },
  { id: 6, name: "Суббота" },
  { id: 0, name: "Воскресенье" },
];

export function ModalCreateOrganization({
  open,
  setOpen,
  allOrganizations,
  handleOrganizationNameButtonClick
}) {
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const { createOrganization } = useCreateOrganization();

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
      const response = await form.validateFields();

      const result = await createOrganization({
        ...response,
        organizationColor: "#BFCFE7",
      }).unwrap();

      message.success("Организация создана!");

      setOpen(false);

      handleOrganizationNameButtonClick(result?.id, response.organizationName, response.reportDay)

    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error("Ошибка при содании организации.");
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    }
  };

  // Инициализация формы при открытии Drawer
  useEffect(() => {
    form.setFieldsValue({
      organizationName: null,
      reportDay: null,
      parentOrganizationId: null,
    });
  }, []);

  return (
    <Modal
      title={<p>Создание организации</p>}
      footer={
        <Button type="primary" onClick={handleSave}>
          Создать
        </Button>
      }
      open={open}
      onCancel={() => setOpen(false)}
      width={700}
      closeIcon={<CloseOutlined />}
    >
      <Flex vertical={true} style={{ height: "100%" }}>
        <Form
          form={form}
          onValuesChange={handlePostValuesChange}
          layout="vertical"
          style={{ flexGrow: 1 }}
        >
          {/* Название организации */}
          <Form.Item
            label="Название организации"
            name="organizationName"
            rules={[
              { required: true, message: "Пожалуйста, введите название!" },
            ]}
          >
            <Input />
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
              options={allOrganizations.map((org) => ({
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
