// CustomComponent.jsx
import React, { useEffect } from 'react';
import { Input, Select } from 'antd';
import classes from './CustomComponent.module.css';
import { useConvertForm } from '../../../../contexts/ConvertFormContext';
import { useParams } from 'react-router-dom';

const { Option } = Select;

export const CustomComponent = () => {

    const { contactId } = useParams()

    const {
        convertType,
        convertTheme,
        senderPost,
        reciverPostId,
        setConvertType,
        setConvertTheme,
        setSenderPost,
        setReciverPostId,
        TYPE_OPTIONS,
        userPosts,
        contactInfo,
        setContactId
    } = useConvertForm();

    useEffect(() => {
        setContactId(contactId)
    },[contactId])

    return (
        <div className={classes.customContainer}>
            <div className={classes.headerSection}>
                Сообщение
            </div>

            <div className={classes.inputSection}>
                <Input
                    placeholder="Введите тему сообщения"
                    className={classes.customInput}
                    bordered={false}
                    value={convertTheme}
                    onChange={(e) => setConvertTheme(e.target.value)}
                />
            </div>

            <div className={classes.selectSection} data-label="тип послания">
                <Select
                    className={classes.customSelect}
                    bordered={false}
                    options={TYPE_OPTIONS}
                    value={convertType}
                    onChange={(value) => setConvertType(value)}
                />
            </div>

            <div className={classes.selectSection} data-label="мой пост">
                <Select
                    className={classes.customSelect}
                    bordered={false}
                    value={senderPost}
                    onChange={(value) => setSenderPost(value)}
                >
                    {userPosts?.map((item, index) => (
                        <Option key={index} value={item.id}>
                            {item.postName}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className={classes.selectSection} data-label="пост получателя">
                <Select
                    className={classes.customSelect}
                    bordered={false}
                    value={reciverPostId}
                    onChange={(value) => setReciverPostId(value)}
                >
                    {contactInfo?.posts?.map((item, index) => (
                        <Option key={index} value={item?.id}>{item?.postName}</Option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

export default CustomComponent;