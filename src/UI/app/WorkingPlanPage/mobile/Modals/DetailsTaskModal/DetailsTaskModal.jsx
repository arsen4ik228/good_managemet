import React, { useEffect, useState, useRef } from 'react';
import {
    Modal,
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Upload,
    message,
    Divider,
    Tag,
    Spin,
    Card
} from 'antd';
import {
    UploadOutlined,
    PaperClipOutlined,
    CheckOutlined,
    CloseOutlined
} from '@ant-design/icons';
import { useTargetsHook, usePolicyHook } from '@hooks';
import classes from './DetailsTaskModal.module.css'
import AttachmentModal from '../AttachmentsModal/AttachmentModal';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import { isMobile } from 'react-device-detect';



const { TextArea } = Input;
const { Option } = Select;

export default function DetailsTaskModal({ setOpenModal, taskData, userPosts }) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [taskStatus, setTaskStatus] = useState('Активная');
    const [isArchive, setIsArchive] = useState(false);
    const [selectedPostOrganizationId, setSelectedPostOrganizationId] = useState();
    const [attachments, setAttachments] = useState([]);
    const [openAttachmentsModal, setOpenAttachmentsModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState();

    const isOrder = taskData.type === 'Приказ';

    const {
        updateTargets,
        isLoadingUpdateTargetsMutation,
        deleteTarget,
    } = useTargetsHook();

    const {
        activeDirectives,
        activeInstructions,
    } = usePolicyHook({ organizationId: selectedPostOrganizationId });

    useEffect(() => {
        if (!taskData) return;

        setIsArchive(taskData?.targetState === 'Завершена');
        setTaskStatus(taskData?.targetState);
        setSelectedPolicy(taskData?.policy?.id || null);

        const orgId = userPosts?.find(item => item.id === taskData.holderPostId)?.organization;
        setSelectedPostOrganizationId(orgId);

        setAttachments(taskData?.attachmentToTargets || []);

        form.setFieldsValue({
            holderPost: taskData?.holderPostId,
            startDate: dayjs(taskData?.dateStart),
            deadlineDate: dayjs(taskData?.deadline),
            content: taskData.content,
            status: taskData?.targetState,
            policy: taskData?.policy?.id || null
        });
    }, [taskData, form, userPosts]);

    const handleUpdateTask = async () => {
        try {
            setLoading(true);
            const values = await form.validateFields();

            const updateData = {
                _id: taskData.id,
                type: taskData.type,
                content: values.content,
                holderPostId: values.holderPost,
                targetState: values.status,
                dateStart: values.startDate.format('YYYY-MM-DD'),
                deadline: values.deadlineDate.format('YYYY-MM-DD'),
                policyId: values.policy === 'null' ? null : values.policy,
                attachmentIds: attachments.map(att => att.attachment.id)
            };

            await updateTargets(updateData).unwrap();
            message.success('Задача успешно обновлена');
            setOpenModal(false);
        } catch (error) {
            console.error("Ошибка:", error);
            message.error('Произошла ошибка при обновлении задачи');
        } finally {
            setLoading(false);
        }
    };

    const handleHolderPostChange = (value) => {
        const orgId = userPosts.find(item => item.id === value)?.organization;
        setSelectedPostOrganizationId(orgId);
        setSelectedPolicy(null);
        form.setFieldValue('policy', null);
    };

    const statusTag = (
        <Tag
            color={taskStatus === 'Завершена' ? 'green' : taskStatus === 'Активная' ? 'blue' : 'gray'}
            icon={taskStatus === 'Завершена' ? <CheckOutlined /> : null}
            className={classes.statusTag}
        >
            {taskStatus}
        </Tag>
    );

    return (
        <>
            <Modal
                title={
                    <div className={classes.titleContainer}>
                        <span>{isOrder ? 'Детали приказа' : 'Редактирование задачи'}</span>
                        {statusTag}
                    </div>
                }
                open={true}
                onCancel={() => setOpenModal(false)}
                footer={[
                    <Button
                        key="back"
                        className={classes.cancelButton}
                        onClick={() => setOpenModal(false)}

                    >
                        Отмена
                    </Button>,
                    <Button
                        className={classes.saveButton}
                        key="submit"
                        type="primary"
                        loading={loading}
                        onClick={handleUpdateTask}
                        disabled={isArchive || isOrder}
                    >
                        Сохранить
                    </Button>,
                ]}
                width={isMobile ? '90%' : 700}
                bodyStyle={{ padding: '24px' }}
            >
                <Spin spinning={isLoadingUpdateTargetsMutation}>
                    <Form
                        form={form}
                        layout="vertical"
                        disabled={isArchive || isOrder}
                    >
                        <Form.Item
                            name="holderPost"
                            className={classes.requiredBlock}
                            label="Ответственный пост"
                            rules={[{ required: true, message: 'Выберите ответственный пост' }]}
                        >
                            <Select
                                placeholder="Выберите пост"
                                onChange={handleHolderPostChange}
                                optionLabelProp="label"
                            >
                                {userPosts?.map((item) => (
                                    <Option key={item.id} value={item.id} label={item.postName}>
                                        {item.postName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <Form.Item
                                name="startDate"
                                className={classes.requiredBlock}
                                label="Дата начала"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: 'Укажите дату начала' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD.MM.YYYY"
                                />
                            </Form.Item>

                            <Form.Item
                                name="deadlineDate"
                                className={classes.requiredBlock}
                                label={isArchive ? 'Дата завершения' : 'Срок выполнения'}
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: 'Укажите срок выполнения' }]}
                            >
                                <DatePicker
                                    style={{ width: '100%' }}
                                    format="DD.MM.YYYY"
                                    disabled={isArchive}
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="content"
                            className={classes.requiredBlock}
                            label="Описание задачи"
                            rules={[{ required: true, message: 'Введите описание задачи' }]}
                        >
                            <TextArea
                                rows={4}
                                placeholder="Опишите задачу..."
                                maxLength={1000}
                                showCount
                            />
                        </Form.Item>

                        <Form.Item
                            name="status"
                            label="Статус задачи"
                        >
                            <Select>
                                <Option value="Активная">Активная</Option>
                                <Option value="Завершена">Завершена</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="policy"
                            label="Связанная политика"
                        >
                            <Select placeholder="Выберите политику">
                                <Option value="null">Не выбрано</Option>
                                <Select.OptGroup label="Директивы">
                                    {activeDirectives.map((item) => (
                                        <Option key={item.id} value={item.id}>{item.policyName}</Option>
                                    ))}
                                </Select.OptGroup>
                                <Select.OptGroup label="Инструкции">
                                    {activeInstructions.map((item) => (
                                        <Option key={item.id} value={item.id}>{item.policyName}</Option>
                                    ))}
                                </Select.OptGroup>
                            </Select>
                        </Form.Item>

                        <Card
                            size="small"
                            title={
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <PaperClipOutlined style={{ marginRight: 8 }} />
                                    <span>Вложения</span>
                                </div>
                            }
                            extra={
                                !isOrder && (
                                    <Button
                                        type="text"
                                        icon={<UploadOutlined />}
                                        onClick={() => setOpenAttachmentsModal(true)}
                                    >
                                        Добавить
                                    </Button>
                                )
                            }
                            style={{ marginBottom: 16 }}
                        >
                            {attachments.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {attachments.map((att) => (
                                        <Tag key={att.attachment.id} icon={<PaperClipOutlined />}>
                                            {att.attachment.originalName}
                                        </Tag>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ color: 'rgba(0, 0, 0, 0.25)' }}>
                                    {isOrder ? 'Файлы отсутствуют' : 'Нет прикрепленных файлов'}
                                </div>
                            )}
                        </Card>
                    </Form>
                </Spin>
            </Modal>

            <AttachmentModal
                open={openAttachmentsModal}
                setOpen={setOpenAttachmentsModal}
                attachments={attachments}
                setAttachments={setAttachments}
                isOrder={isOrder}
            />
        </>
    );
}