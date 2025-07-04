import React, { useState } from 'react'
import classes from './OrderModal.module.css'
import ModalContainer from '@Custom/ModalContainer/ModalContainer'
import { usePostsHook } from '@hooks'
import { Modal, Input, Radio, Space, Button, List } from 'antd';

export default function OrderModal({ setModalOpen, setTheme, convertTheme, setReciverPost, buttonFunc }) {

    const {
        postsForWorkingPlan,
    } = usePostsHook()

    const [selectedReceiverPost, setSelectedRecieverPost] = useState()

    const buttonClick = () => {
        buttonFunc()
        setModalOpen(false)
    }

    const selectPost = (value) => {
        setSelectedRecieverPost(value)
        setReciverPost(value)
    }
    return (
        <Modal
            title={
                <div className={classes.titleContainer}>
                    <span>Создание приказа</span>
                </div>}
            open={true}
            onCancel={() => setModalOpen(false)}
            style={{
                padding: '16px 24px'
            }}
            footer={[
                <Button
                    className={classes.cancelButton} key="back" onClick={() => setModalOpen(false)}>
                    Отмена
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    className={classes.saveButton}
                    onClick={buttonClick}
                    disabled={!convertTheme || !selectedReceiverPost}
                >
                    Отправить
                </Button>
            ]}
            width={700}
   bodyStyle={{height: 650}}
        >
            <div className={`${classes.validationMessage} ${!convertTheme ? classes.show : ''}`}>
                <span> Укажите тему приказа</span>
            </div>
            <Input
                placeholder="Тема приказа"
                onChange={(e) => setTheme(e.target.value)}
                size="large"
                style={{ marginBottom: 24 }}
                rules={[{ required: true, message: 'Введите описание задачи' }]}
            />

            <div className={classes.sectionTitle}>Выберите пост:</div>
            <List
                bordered
                className={classes.list}
                dataSource={postsForWorkingPlan}
                renderItem={(item) => (
                    <List.Item
                        style={{ marginBottom: '5px', marginTop: '5px' }}
                        className={`${classes.listItem} ${selectedReceiverPost === item.id ? classes.selectedItem : ''
                            }`}
                        onClick={() => {
                            console.log('Selected post:', item.id);
                            selectPost(item.id);
                        }}
                    >
                        <div className={classes.itemContent}>
                            <span>{item.postName}</span>
                        </div>
                    </List.Item>
                )}
            />
        </Modal>
    );
}
