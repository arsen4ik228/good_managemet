import React, { useEffect, useState } from 'react'
import EditContainer from '../../Custom/EditContainer/EditContainer'
import { Avatar, Button, Card, Checkbox, DatePicker, Input, message, Tag } from 'antd'
import { useUserHook } from '../../../hooks'
import { useParams } from 'react-router-dom'
import { formatPhone } from '../Posts/function/functionForPost';
import { baseUrl } from "@helpers/constants.js";
import { notEmpty } from '@helpers/helpers.js'
import default_avatar from '@image/default_avatar.svg'
import InputMask from "react-input-mask";
import dayjs from 'dayjs';



export default function EditWorker() {
    const { userId } = useParams()
    const { userInfo, updateUser } = useUserHook({ userId })

    const [firstName, setFirstName] = useState()
    const [lastName, setLastName] = useState()
    const [middleName, setMiddleName] = useState()
    const [telephoneNumber, setTelephoneNumber] = useState()
    const [isDismissed, setIsDismissed] = useState()

    console.log(userInfo)

    const handleUpdateUserButtonClick = async () => {
        const Data = {};

        if (isDismissed) {
            Data.telephoneNumber = null
            Data.isFired = true
        }
        else {
            if (firstName !== userInfo?.firstName) Data.firstName = firstName;
            if (lastName !== userInfo?.lastName) Data.lastName = lastName;
            if (middleName !== userInfo?.middleName) Data.middleName = middleName;
            if (telephoneNumber !== userInfo?.telephoneNumber)
                Data.telephoneNumber = telephoneNumber.replace(/[^\d+]/g, '').slice(0, 12);
            if (isDismissed !== userInfo?.isFired) Data.isFired = isDismissed;

            // if (file) {
            //   const formData = new FormData();
            //   formData.append("file", file);
            //   try {
            //     const result = await postImage(formData).unwrap();
            //     Data.avatar_url = result.filePath;
            //   } catch (error) {
            //     console.error("Ошибка загрузки изображения:", JSON.stringify(error, null, 2));
            //     throw error;
            //   }
            // } else {
            //   Data.avatar_url = null;
            // }

        }
        if (!notEmpty(Data)) return;

        Data.id = userId

        await updateUser({
            ...Data,
        })
            .unwrap()
            .then(() => {
                message.success("Данные успешно обновлены!");
                setTimeout(() => {
                    window.close(); // убрать return
                }, 1000);
                // refetchUserInfo() 
            })
            .catch((error) => {
                message.error("Ошибка при сохранении:", JSON.stringify(error, null, 2));
                console.error("Ошибка:", JSON.stringify(error, null, 2));
            });
    };


    const handleReset = () => {
        setLastName(userInfo?.lastName)
        setFirstName(userInfo?.firstName)
        setMiddleName(userInfo?.middleName)
        setTelephoneNumber(userInfo?.telephoneNumber)
        setIsDismissed(userInfo?.isFired)
    };


    useEffect(() => {
        if (!notEmpty(userInfo)) return;

        setLastName(userInfo?.lastName)
        setFirstName(userInfo?.firstName)
        setMiddleName(userInfo?.middleName)
        setTelephoneNumber(userInfo?.telephoneNumber)
        setIsDismissed(userInfo?.isFired)
    }, [userInfo])

    return (
        <>
            <EditContainer
                header={"Редактирование сотрудника"}
                saveClick={handleUpdateUserButtonClick}
                canselClick={handleReset}
            // exitClick={exitClick}
            >
                <Card
                    style={{
                        width: 450,
                        // maxHeight: 500,
                        marginTop: 20,
                        textAlign: "center",
                        borderRadius: 8,
                        backgroundColor: "#fafafa",
                    }}
                >
                    {/* Аватар (только просмотр) */}
                    <div style={{ marginBottom: 20 }}>
                        <Avatar
                            size={168}
                            src={userInfo?.avatar_url ? `${baseUrl}${userInfo?.avatar_url}` : default_avatar}
                            style={{ marginBottom: 12 }}
                        />

                    </div>

                    {/* Поля для редактирования */}
                    <div style={{ width: '100%', textAlign: 'left' }}>
                        {/* Фамилия */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Фамилия</div>
                            <Input
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                placeholder="Введите фамилию"
                                style={{ width: '100%' }}
                                disabled={isDismissed}
                            />
                        </div>

                        {/* Имя */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Имя</div>
                            <Input
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                placeholder="Введите имя"
                                style={{ width: '100%' }}
                                disabled={isDismissed}
                            />
                        </div>

                        {/* Отчество */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Отчество</div>
                            <Input
                                value={middleName}
                                onChange={(e) => setMiddleName(e.target.value)}
                                placeholder="Введите отчество"
                                style={{ width: '100%' }}
                                disabled={isDismissed}
                            />
                        </div>

                        {/* Телефон (только просмотр) */}
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>Телефон</div>

                            <InputMask
                                value={formatPhone(telephoneNumber)}
                                onChange={(e) => setTelephoneNumber(e.target.value)}
                                mask="+9 (999) 999-99-99"
                                placeholder="+9 (999) 999-99-99"
                                disabled={isDismissed}
                                required
                            >
                                {(inputProps) => (
                                    <Input
                                        {...inputProps}
                                        type="tel"
                                        style={{ width: '100%' }}
                                        disabled={isDismissed} // дублируем здесь

                                    />
                                )}
                            </InputMask>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                // alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '12px 16px',
                                gap: '5px',
                                border: '1px solid #d9d9d9',
                                borderRadius: '6px',
                                backgroundColor: '#fafafa'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Checkbox
                                        checked={isDismissed}
                                        onChange={(e) => setIsDismissed(e.target.checked)}
                                    >
                                        Уволен
                                    </Checkbox>
                                    {userInfo?.isFired && (
                                        <Tag
                                            color="red"
                                            style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                padding: '4px 8px'
                                            }}
                                        >
                                            Сотрудник уволен
                                        </Tag>
                                    )}
                                </div>

                                {userInfo?.isFired && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '14px', color: '#666' }}>Дата увольнения:</span>
                                        <DatePicker
                                            value={userInfo?.updatedAt ? dayjs(userInfo.updatedAt) : null}
                                            // onChange={(date) => setDismissalDate(date)}
                                            format="DD.MM.YYYY"
                                            placeholder="Выберите дату"
                                            style={{ width: '150px' }}
                                            disabled
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </Card>
            </EditContainer>
        </>
    )
}
