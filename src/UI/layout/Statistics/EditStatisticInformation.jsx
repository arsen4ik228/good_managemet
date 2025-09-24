import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ExclamationCircleFilled } from "@ant-design/icons";
import {
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  Modal,
  notification,
} from "antd";

import isEqual from "lodash/isEqual";
import EditContainer from "@Custom/EditContainer/EditContainer";
import {
  useAllPosts,
  useUpdateSingleStatistic,
  useGetSingleStatisticWithoutStatisticData,
} from "@hooks";

const { TextArea } = Input;

export const EditStatisticInformation = () => {
  const channel = new BroadcastChannel("statistic_channel");
  const channelName = new BroadcastChannel("statisticName_channel");

  const { id: statisticId } = useParams();
  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(null);

  // данные
  const { currentStatistic } = useGetSingleStatisticWithoutStatisticData({ statisticId });
  const { allPosts } = useAllPosts();

  const { updateStatistics } = useUpdateSingleStatistic();

  // заполняем initialValues, когда загрузилась статистика
  useEffect(() => {
    if (currentStatistic?.id) {
      setInitialValues({
        name: currentStatistic.name ?? null,
        description: currentStatistic.description ?? null,
        postId: currentStatistic.post?.id ?? null,
        type: currentStatistic.type ?? null,
        isActive: currentStatistic.isActive ?? false,
      });
    }
  }, [currentStatistic]);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await updateStatistics({
        statisticId: currentStatistic?.id,
        _id: currentStatistic?.id,
        ...values,
      }).unwrap();


      if (values.name !== currentStatistic.name) {
        channelName.postMessage("name");
      }

      channel.postMessage("updated");
      message.success("Данные успешно обновлены!");
      // обновляем initialValues, чтобы сбросить "грязное" состояние
      setInitialValues(values);
    } catch (err) {
      message.error("Ошибка при сохранении");
    }
  };

  const handleReset = () => {
    const values = {
      name: currentStatistic.name ?? null,
      description: currentStatistic.description ?? null,
      postId: currentStatistic.post?.id ?? null,
      type: currentStatistic.type ?? null,
      isActive: currentStatistic.isActive ?? false,
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
          notification.info({
            message: "Изменения не сохранены",
            description:
              "Редактирование отменено, изменения не были сохранены.",
            placement: "topRight",
          });
        },
      });
    } else {
      window.close();
    }
  };

  return (
    <>
      {
        initialValues && <EditContainer header={"редактирование"} saveClick={handleSave} canselClick={handleReset} exitClick={exitClick}>

          <div style={{
            position: "relative",

            width: "500px",

            flex: "1 0 120px",

            backgroundColor: "#fff",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",

            border: "1px solid #CCCCCC",
            borderRadius: "5px",

            overflowY: "auto",
          }}>
            <Form
              form={form}
              initialValues={initialValues}
              layout="vertical"
              style={{ maxWidth: 600 }}
              disabled={!currentStatistic?.isActive}
            >
              <Row>
                <Col span={24}>
                  <Form.Item
                    name="name"
                    label="Название статистики"
                    rules={[{ required: true, message: "Введите название" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item
                    name="postId"
                    label="Пост статистики"
                    rules={[{ required: true, message: "Выберите пост" }]}
                  >
                    <Select
                      placeholder="Выберите пост"
                      options={allPosts?.map((p) => ({
                        label: p.postName,
                        value: p.id,
                      }))}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row>
                <Col span={24}>
                  <Form.Item name="type" label="Отображение статистики">
                    <Select
                      options={[
                        { value: "Прямая", label: "Прямая" },
                        { value: "Обратная", label: "Обратная" },
                      ]}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="isActive" label="Состояние статистики">
                    <Select
                      disabled={false}
                      options={[
                        { value: true, label: "Активная" },
                        { value: false, label: "Архивная" },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Описание статистики"
                rules={[{ required: true, message: "Введите описание" }]}
              >
                <TextArea rows={4} />
              </Form.Item>
            </Form>
          </div>

        </EditContainer>
      }
    </>
  );
};
