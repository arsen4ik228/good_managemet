import React, { useState } from 'react';
import { Input, Select } from 'antd';
import classes from './CustomComponent.module.css';
import { usePostsHook, useConvertsHook } from '@hooks'
import { useParams } from 'react-router-dom';


const { Option } = Select;

const TYPE_OPTIONS = [
    { value: 'Личная', label: 'Личная' },
    { value: 'Приказ', label: 'Приказ' },
]

export const CustomComponent = () => {

    const { contactId, convertId } = useParams()

    const [convertType, setConvertType] = useState(TYPE_OPTIONS[0].value);
    const [convertTheme, setConvertTheme] = useState()
    const [senderPost, setSenderPost] = useState()
    const [reciverPostId, setReciverPostId] = useState()



    const {
        userPosts
    } = usePostsHook()

    const {
        currentConvert,
        contactInfo,
        senderPostId,
        userInfo,
        senderPostName,
        senderPostForSocket,
        sendMessage,
        isLoadingSendMessages,
        refetchGetConvertId,
        isLoadingGetConvertId,
        isFetchingGetConvartId,
        isErrorGetConvertId,
        organizationId,

        postConvert,
        isLoadingPostPoliciesMutation,
        isSuccessPostPoliciesMutation,
        isErrorPostPoliciesMutation,
        ErrorPostPoliciesMutation,
    } = useConvertsHook({ convertId: convertId, contactId: contactId });


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
                    placeholder="Выберите опцию 1"
                    className={classes.customSelect}
                    bordered={false}
                    options={TYPE_OPTIONS}
                    value={convertType}
                    onChange={(value) => setConvertType(value)}
                >
                    <Option value="option1">Опция 1</Option>
                    <Option value="option2">Опция 2</Option>
                    <Option value="option3">Опция 3</Option>
                </Select>
            </div>

            <div className={classes.selectSection} data-label="мой пост">
                <Select
                    placeholder="Выберите опцию 2"
                    className={classes.customSelect}
                    bordered={false}
                    onChange={(e) => setSenderPost(e)}
                    defaultValue={userPosts?.[0]?.id}
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
                    placeholder="Выберите опцию 3"
                    className={classes.customSelect}
                    bordered={false}
                    value={contactInfo?.postId} // используем value вместо defaultValue
                    onChange={(value) => setReciverPostId(value)}
                >
                    <Option value={contactInfo?.postId}>{contactInfo?.postName}</Option>
                </Select>
            </div>
        </div>
    );
};

export default CustomComponent;