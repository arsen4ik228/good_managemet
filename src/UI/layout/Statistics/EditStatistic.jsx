import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { ExclamationCircleFilled } from '@ant-design/icons';

import {
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  Modal, notification
} from "antd";

import EditContainer from '@Custom/EditContainer/EditContainer'

import { useAllPosts, useUpdateSingleStatistic, useGetSingleStatistic } from "@hooks";

const { TextArea } = Input;

const viewStatistic = [
  { value: "Прямая", label: "Прямая" },
  { value: "Обратная", label: "Обратная" },
];

const typeStatistic = [
  { value: true, label: "Активная" },
  { value: false, label: "Архивная" },
];

export const EditStatistic = () => {
  const { id: statisticId } = useParams(); // Достаём id из URL

  const [form] = Form.useForm();
  const [initialValues, setInitialValues] = useState(null);
  const [isSaving, setIsSaving] = useState(false);


  // Получение статистики по id
  const {
    currentStatistic,
    isLoadingGetStatisticId,
    isErrorGetStatisticId,
    isFetchingGetStatisticId,
  } = useGetSingleStatistic({
    statisticId: statisticId,
    datePoint: "2025-09-09",
  });

  const { allPosts, isLoadingGetPosts, isFetchingGetPosts, isErrorGetPosts } =
    useAllPosts();

  // Обновление статистики
  const {
    updateStatistics,
    isLoadingUpdateStatisticMutation,
    isSuccessUpdateStatisticMutation,
    isErrorUpdateStatisticMutation,
    ErrorUpdateStatisticMutation,
    localIsResponseUpdateStatisticsMutation,
  } = useUpdateSingleStatistic();

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
      await updateStatistics({
        statisticId: currentStatistic?.id,
        _id: currentStatistic?.id,
        ...response,
      }).unwrap();

      message.success("Данные успешно обновлены!");
    } catch (error) {
      if (error.errorFields) {
        message.error("Пожалуйста, заполните все поля корректно.");
      } else {
        message.error(
          error?.data?.errors?.[0]?.errors?.[0]
            ? error.data.errors[0].errors[0]
            : error?.data?.message
        );
        console.error("Детали ошибки:", JSON.stringify(error, null, 2));
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    form.setFieldsValue({
      name: currentStatistic?.name ?? null,
      description: currentStatistic?.description ?? null,
      postId: currentStatistic?.post?.id ?? null,
      type: currentStatistic?.type ?? null,
      isActive: currentStatistic?.isActive ?? false,
    });
  };


  const exitClick = () => {
    const hasChanges = form.isFieldsTouched(true); // true = проверка по всем полям

    if (hasChanges) {
      Modal.confirm({
        title: 'Есть несохранённые изменения',
        icon: <ExclamationCircleFilled />,
        content: 'Вы хотите сохранить изменения перед выходом из режима редактирования?',
        okText: 'Сохранить',
        cancelText: 'Не сохранять',
        onOk() {
          handleSave().then(() => {
            window.close(); // закрываем вкладку после сохранения
          });
        },
        onCancel() {
          window.close();
          notification.info({
            message: 'Изменения не сохранены',
            description: 'Редактирование отменено, изменения не были сохранены.',
            placement: 'topRight',
          });
        },
      });
    } else {
      // изменений не было — просто закрываем вкладку
      window.close();
    }
  };


  useEffect(() => {
    if (
      !statisticId ||
      !currentStatistic?.id ||
      isLoadingGetStatisticId ||
      isFetchingGetStatisticId
    ) {
      return;
    }

    setInitialValues({
      name: currentStatistic.name ?? null,
      description: currentStatistic.description ?? null,
      postId: currentStatistic.post?.id ?? null,
      type: currentStatistic.type ?? null,
      isActive: currentStatistic.isActive ?? false,
    });
  }, [
    statisticId,
    currentStatistic,
    isLoadingGetStatisticId,
    isFetchingGetStatisticId,
  ]);

  return (

    <EditContainer
      saveClick={handleSave}
      canselClick={handleReset}
      exitClick={exitClick}>


      <div style={{
        position: "relative",

        maxWidth: "600px",
        width: "100%",

        flex: "1 0 120px",

        backgroundColor: "#fff",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",

        border: "1px solid #CCCCCC",
        borderRadius: "5px",

        overflowY: "auto",
      }}>
        <div style={{ padding: "16px", flex: 1, overflow: "auto" }}>
          <div style={{ overflowX: "hidden" }}>
            <Form
              form={form}
              onValuesChange={handlePostValuesChange}
              layout="vertical"
              disabled={!currentStatistic?.isActive}
              initialValues={initialValues}
            >
              <Row>
                <Col span={24}>
                  {/* Название статистики */}
                  <Form.Item
                    name="name"
                    label="Название статистики"
                    rules={[
                      {
                        required: true,
                        message: "Пожалуйста, введите название",
                      },
                    ]}
                  >
                    <Input placeholder="Введите название" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  {/* Пост статистики*/}
                  <Form.Item
                    name="postId"
                    label="Пост статистики"
                    rules={[
                      {
                        required: true,
                        message: "Пожалуйста, выберите пост",
                      },
                    ]}
                  >
                    <Select
                      placeholder="Выберите пост"
                      allowClear
                      showSearch
                      optionFilterProp="label"
                      filterOption={(input, option) =>
                        option?.label.toLowerCase().includes(input.toLowerCase())
                      }
                      options={allPosts?.map((item) => ({
                        label: item.postName,
                        value: item.id,
                      }))}
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  {/* Тип статистики*/}
                  <Form.Item name="type" label="Отображение статистики">
                    <Select
                      placeholder="Выберите тип отображения"
                      options={viewStatistic}
                    />
                  </Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item name="isActive" label="Состояние статистики">
                    <Select
                      disabled={false}
                      placeholder="Выберите тип"
                      options={typeStatistic}
                    />
                  </Form.Item>
                </Col>
              </Row>

              {/* Описание статистики*/}
              <Form.Item
                name="description"
                label="Описание статистики"
                rules={[
                  {
                    required: true,
                    message: "Пожалуйста, введите описание статистики",
                  },
                ]}
              >
                <TextArea rows={4} placeholder="Введите описание" />
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>


    </EditContainer>
  );
};


// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { ExclamationCircleFilled } from "@ant-design/icons";
// import {
//   Form,
//   Input,
//   Select,
//   Row,
//   Col,
//   message,
//   Modal,
//   notification,
// } from "antd";

// import EditContainer from "@Custom/EditContainer/EditContainer";
// import {
//   useAllPosts,
//   useUpdateSingleStatistic,
//   useGetSingleStatistic,
// } from "@hooks";

// const { TextArea } = Input;

// export const EditStatistic = () => {
//   const [form] = Form.useForm();
//   const navigate = useNavigate();
//   const { id: statisticId } = useParams();

//   const [initialValues, setInitialValues] = useState(null);

//   // данные
//   const { currentStatistic } = useGetSingleStatistic({
//     statisticId,
//     datePoint: "2025-09-09",
//   });
//   const { allPosts } = useAllPosts();

//   const { updateStatistics } = useUpdateSingleStatistic();

//   // заполняем initialValues, когда загрузилась статистика
//   useEffect(() => {
//     if (currentStatistic?.id) {
//       setInitialValues({
//         name: currentStatistic.name ?? null,
//         description: currentStatistic.description ?? null,
//         postId: currentStatistic.post?.id ?? null,
//         type: currentStatistic.type ?? null,
//         isActive: currentStatistic.isActive ?? false,
//       });
//     }
//   }, [currentStatistic]);

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       await updateStatistics({
//         statisticId: currentStatistic?.id,
//         _id: currentStatistic?.id,
//         ...values,
//       }).unwrap();
//       message.success("Данные успешно обновлены!");
//       // обновляем initialValues, чтобы сбросить "грязное" состояние
//       setInitialValues(values);
//     } catch (err) {
//       message.error("Ошибка при сохранении");
//     }
//   };

//   const exitClick = () => {
//     const currentValues = form.getFieldsValue();
//     const hasChanges =
//       JSON.stringify(currentValues) !== JSON.stringify(initialValues);

//     if (hasChanges) {
//       Modal.confirm({
//         title: "Есть несохранённые изменения",
//         icon: <ExclamationCircleFilled />,
//         content:
//           "Вы хотите сохранить изменения перед выходом из режима редактирования?",
//         okText: "Сохранить",
//         cancelText: "Не сохранять",
//         onOk() {
//           handleSave().then(() => window.close());
//         },
//         onCancel() {
//           window.close();
//           notification.info({
//             message: "Изменения не сохранены",
//             description:
//               "Редактирование отменено, изменения не были сохранены.",
//             placement: "topRight",
//           });
//         },
//       });
//     } else {
//       window.close();
//     }
//   };

//   if (!initialValues) {
//     return <div>Загрузка...</div>;
//   }

//   return (
//     <EditContainer saveClick={handleSave}  canselClick={handleReset} exitClick={exitClick}>

//       <div style={{
//         position: "relative",

//         width: "500px",

//         flex: "1 0 120px",

//         backgroundColor: "#fff",

//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",

//         border: "1px solid #CCCCCC",
//         borderRadius: "5px",

//         overflowY: "auto",
//       }}>
//         <Form
//           form={form}
//           initialValues={initialValues}
//           layout="vertical"
//           style={{ maxWidth: 600 }}
//         >
//           <Row>
//             <Col span={24}>
//               <Form.Item
//                 name="name"
//                 label="Название статистики"
//                 rules={[{ required: true, message: "Введите название" }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row>
//             <Col span={24}>
//               <Form.Item
//                 name="postId"
//                 label="Пост статистики"
//                 rules={[{ required: true, message: "Выберите пост" }]}
//               >
//                 <Select
//                   placeholder="Выберите пост"
//                   options={allPosts?.map((p) => ({
//                     label: p.postName,
//                     value: p.id,
//                   }))}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Row>
//             <Col span={24}>
//               <Form.Item name="type" label="Отображение статистики">
//                 <Select
//                   options={[
//                     { value: "Прямая", label: "Прямая" },
//                     { value: "Обратная", label: "Обратная" },
//                   ]}
//                 />
//               </Form.Item>
//             </Col>

//             <Col span={24}>
//               <Form.Item name="isActive" label="Состояние статистики">
//                 <Select
//                   options={[
//                     { value: true, label: "Активная" },
//                     { value: false, label: "Архивная" },
//                   ]}
//                 />
//               </Form.Item>
//             </Col>
//           </Row>

//           <Form.Item
//             name="description"
//             label="Описание статистики"
//             rules={[{ required: true, message: "Введите описание" }]}
//           >
//             <TextArea rows={4} />
//           </Form.Item>
//         </Form>
//       </div>

//     </EditContainer>
//   );
// };
