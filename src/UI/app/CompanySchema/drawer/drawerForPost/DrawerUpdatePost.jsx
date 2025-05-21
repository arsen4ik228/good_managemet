import React, { useState, useEffect } from "react";
import ButtonImage from "@Custom/buttonImage/ButtonImage";
import edit from "@image/edit.svg";
import {
  Space,
  Button,
  Input,
  Select,
  Form,
  Flex,
  Drawer as DrawerAnt,
} from "antd";
import { message } from "antd";
import { useStatisticsHook } from "@hooks/useStatisticsHook";
import { useGetSinglePost, useUpdateSinglePost } from "@hooks";
import { isMobile } from "react-device-detect";

const { TextArea } = Input;

export default function DrawerUpdatePost({ postId }) {
  const [open, setOpen] = useState(false);
  const [shouldFetchData, setShouldFetchData] = useState(false); // Состояние для вызова хука
  const [formPost] = Form.useForm();
  const [formStatistics] = Form.useForm();
  const [isSaving, setIsSaving] = useState(false); // Состояние для блокировки кнопки

  const {
    // Получить пост по  id
    currentPost,
    workers,
    posts,
    parentPost,
    policiesActive,
    statisticsIncludedPost,
    isLoadingGetPostId,
    isErrorGetPostId,
    isFetchingGetPostId,
    selectedPolicyIDInPost,
    selectedPolicyNameInPost,
    refetchPostIdQuery,
  } = useGetSinglePost({ postId, enabled: shouldFetchData });

  const {
    // Обновление поста
    updatePost,
    isLoadingUpdatePostMutation,
    isSuccessUpdatePostMutation,
    isErrorUpdatePostMutation,
    ErrorUpdatePostMutation,
    localIsResponseUpdatePostMutation,
  } = useUpdateSinglePost();

  const {
    statistics = [],
    isLoadingGetStatistics,
    isFetchingGetStatistics,
    isErrorGetStatistics,

    updateStatisticsToPostId,
    isLoadingStatisticsToPostIdMutation,
    isSuccessUpdateStatisticsToPostIdMutation,
    isErrorUpdateStatisticsToPostIdMutation,
    ErrorUpdateStatisticsToPostIdMutation,
    localIsResponseUpdateStatisticsToPostIdMutation,
  } = useStatisticsHook();

  const showLoading = () => {
    setOpen(true);
    setShouldFetchData(true); // Устанавливаем флаг для вызова хука
  };

  const handlePostValuesChange = (changedValues, allValues) => {
    const cleanedValues = Object.fromEntries(
      Object.entries(allValues).map(([key, value]) => [
        key,
        value === undefined ? null : value,
      ])
    );
    formPost.setFieldsValue(cleanedValues);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const [valuesPost, valuesStatistics] = await Promise.all([
        formPost.validateFields(),
        formStatistics.validateFields(),
      ]);

      console.log("valuesPost");
      console.log(valuesPost);

      const [responsePost, responseStatistics] = await Promise.all([
        updatePost({
          _id: currentPost?.id,
          ...valuesPost,
        }).unwrap(),
        ...(valuesStatistics.statisticsIncludedPost.length > 0
          ? [
              updateStatisticsToPostId({
                postId: currentPost.id,
                ids: valuesStatistics.statisticsIncludedPost,
              }).unwrap(),
            ]
          : []),
      ]);

      message.success("Данные успешно обновлены!");
      setOpen(false);
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
      postName: currentPost?.postName ?? null,
      divisionName: currentPost?.divisionName ?? null,
      parentId: parentPost?.id ?? null,
      responsibleUserId: currentPost?.user?.id ?? null,
      product: currentPost?.product ?? null,
      purpose: currentPost?.purpose ?? null,
      policyId: selectedPolicyIDInPost ?? null,
    });
    formStatistics.setFieldsValue({
      statisticsIncludedPost:
        statisticsIncludedPost.map((stat) => stat.id) ?? null,
    });
  };

  useEffect(() => {
    if (!currentPost || isLoadingGetStatistics || isFetchingGetPostId) return;

    const initialValues = {
      postName: currentPost?.postName ?? null,
      divisionName: currentPost?.divisionName ?? null,
      parentId: parentPost?.id ?? null,
      responsibleUserId: currentPost?.user?.id ?? null,
      product: currentPost?.product ?? null,
      purpose: currentPost?.purpose ?? null,
      policyId: selectedPolicyIDInPost ?? null,
    };

    formPost.setFieldsValue(initialValues); // Устанавливаем начальные значения
  }, [currentPost, isLoadingGetPostId, isFetchingGetPostId]);

  useEffect(() => {
    if (!statistics || isLoadingGetPostId || isFetchingGetStatistics) return;

    const initialValues = {
      statisticsIncludedPost:
        statisticsIncludedPost.map((stat) => stat.id) ?? null,
    };

    formStatistics.setFieldsValue(initialValues); // Устанавливаем начальные значения
  }, [statistics, isLoadingGetPostId, isFetchingGetStatistics]);

  return (
    <div style={{ with: "100%", marginLeft: "auto" }}>
      <ButtonImage
        dataTour="setting-button"
        name={"редактировать"}
        icon={edit}
        onClick={showLoading}
      ></ButtonImage>

      <DrawerAnt
        closable
        destroyOnClose2
        title={<p>Обновление поста</p>}
        placement="right"
        open={open}
        loading={isLoadingGetPostId || isFetchingGetPostId}
        onClose={() => setOpen(false)}
        width={isMobile ? 300 : 350}
      >
        <Form
          form={formPost}
          onValuesChange={handlePostValuesChange}
          layout="vertical"
        >
          {/* Название поста */}
          <Form.Item
            label="Название поста"
            name="postName"
            rules={[
              { required: true, message: "Пожалуйста, введите название!" },
            ]}
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
              options={posts.map((post) => ({
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
              options={workers.map((worker) => ({
                label: `${worker?.firstName} ${worker?.lastName}`,
                value: worker.id,
              }))}
            />
          </Form.Item>

          {/* Продукт поста */}
          <Form.Item
            label="Продукт поста"
            name="product"
            rules={[
              { required: true, message: "Пожалуйста, введите продукт!" },
            ]}
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
              options={policiesActive.map((policy) => ({
                label: policy.policyName,
                value: policy.id,
              }))}
            />
          </Form.Item>
        </Form>

        <Form form={formStatistics} layout="vertical">
          {/* Статистика */}
          <Form.Item label="Статистика" name="statisticsIncludedPost">
            <Select
              mode="multiple"
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                option?.label.toLowerCase().includes(input.toLowerCase())
              }
              options={statistics.map((stat) => ({
                label: stat.name,
                value: stat.id,
                disabled: statisticsIncludedPost.some((s) => s.id === stat.id),
              }))}
            />
          </Form.Item>
        </Form>

        <Space style={{ marginTop: "auto" }}>
          <Button type="primary" onClick={handleSave} loading={isSaving}>
            Сохранить
          </Button>
          <Button onClick={handleReset}>Сбросить</Button>
        </Space>
      </DrawerAnt>
    </div>
  );
}
