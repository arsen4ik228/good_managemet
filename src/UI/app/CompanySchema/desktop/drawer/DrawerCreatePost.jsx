import React, { useState, useEffect } from "react";
import { Space, Button, Input, Select, Form, Drawer as DrawerAnt } from "antd";
import { message } from "antd";
import { useGetDataCreatePost } from "@hooks";
import { useCreatePost } from "../../../../../hooks/Post/useCreatePost";

const { TextArea } = Input;

export default function DrawerCreatePost({ open, setOpen }) {
  const [formPost] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false);

  const {
    maxDivisionNumber,
    parentPosts,
    staff,
    policies,
    isLoadingGetNew,
    isFetchingGetNew,
    isErrorGetNew,
  } = useGetDataCreatePost({ enabled: open });

  const {
    reduxSelectedOrganizationId,

    createPost,
    isLoadingPostMutation,
    isSuccessPostMutation,
    isErrorPostMutation,
    ErrorPostMutation,
    localIsResponsePostPostMutation,
  } = useCreatePost();

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const responsePost = await formPost.validateFields();
      await createPost({ ...responsePost, organizationId: reduxSelectedOrganizationId,}).unwrap();
      message.success("Пост создан!");
    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error("Ошибка при обновлении поста.");
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    formPost.setFieldsValue({
      postName: null,
      divisionName: null,
      parentId: null,
      responsibleUserId: null,
      product: null,
      purpose: null,
      policyId: null,
    });
  };

  useEffect(() => {
    if (isLoadingGetNew || isFetchingGetNew) return;

    const initialValues = {
      postName: null,
      divisionName: null,
      parentId: null,
      responsibleUserId: null,
      product: null,
      purpose: null,
      policyId: null,
    };

    formPost.setFieldsValue(initialValues);
  }, [isLoadingGetNew, isFetchingGetNew]);

  return (
    <DrawerAnt
      closable
      destroyOnClose2
      title={<p>Создание поста</p>}
      placement="right"
      open={open}
      loading={isLoadingGetNew || isFetchingGetNew}
      onClose={() => setOpen(false)}
    >
      <Form form={formPost} layout="vertical">
        {/* Название поста */}
        <Form.Item
          label="Название поста"
          name="postName"
          rules={[{ required: true, message: "Пожалуйста, введите название!" }]}
        >
          <Input />
        </Form.Item>

        {/* Название подразделения */}
        <Form.Item
          label="Название подразделения"
          name="divisionName"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите название подразделения!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        {/* Руководитель */}
        <Form.Item label="Руководитель" name="parentId">
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            }
            options={parentPosts.map((post) => ({
              label: post.postName,
              value: post.id,
            }))}
          />
        </Form.Item>

        {/* Сотрудник */}
        <Form.Item label="Сотрудник" name="responsibleUserId">
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            }
            options={staff.map((worker) => ({
              label: `${worker?.firstName} ${worker?.lastName}`,
              value: worker.id,
            }))}
          />
        </Form.Item>

        {/* Продукт поста */}
        <Form.Item
          label="Продукт поста"
          name="product"
          rules={[{ required: true, message: "Пожалуйста, введите продукт!" }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        {/* Предназначение поста */}
        <Form.Item
          label="Предназначение поста"
          name="purpose"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите предназначение!",
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>

        {/* Политика */}
        <Form.Item label="Политика" name="policyId">
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            filterOption={(input, option) =>
              option?.label.toLowerCase().includes(input.toLowerCase())
            }
            options={policies.map((policy) => ({
              label: policy.policyName,
              value: policy.id,
            }))}
          />
        </Form.Item>
      </Form>

      <Space>
        <Button type="primary" onClick={handleSave} loading={isSaving}>
          Сохранить
        </Button>
        <Button onClick={handleReset}>Сбросить</Button>
      </Space>
    </DrawerAnt>
  );
}
