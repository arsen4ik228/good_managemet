import React, {useEffect} from 'react'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import {Avatar, Card, Divider, Flex, Typography, Space, Tag, DatePicker} from 'antd'
import {useParams} from 'react-router-dom';
import {useUserHook} from '@hooks'
import default_avatar from '@image/default_avatar.svg'
import {formatPhone} from '../Posts/function/functionForPost';
import {baseUrl} from "@helpers/constants.js";
import {
    PhoneOutlined,
} from "@ant-design/icons";
import {useModuleActions, usePanelPreset, useRightPanel} from '../../../hooks';
import {homeUrl} from "@helpers/constants";
import dayjs from 'dayjs';
import classes from "./Workers.module.css";
import icon_post from '@image/icon _ post.svg'

export default function Worker() {
    const {userId} = useParams();

    const {Title, Text} = Typography;

    const {userInfo, refetchUserInfo} = useUserHook({userId})
    console.log("userInfo = ", userInfo)

    const {PRESETS} = useRightPanel();

    usePanelPreset(PRESETS["USERS"]);

    // const { buttonsArr } = useModuleActions("users", userId);

    const buttonsArr = [{
        text: "Редактировать",
        click: () => window.open(`${homeUrl}#/editUsers/${userId}`, "_blank"),
    }]


    useEffect(() => {
        const channel = new BroadcastChannel("worker_channel");

        const handler = (event) => {
            if (event.data === "updated") {
                refetchUserInfo();
            }
        };

        channel.addEventListener("message", handler);

        return () => {
            channel.removeEventListener("message", handler);
            channel.close();
        };
    }, [refetchUserInfo]);

    return (
        <>
            <MainContentContainer buttons={buttonsArr}>
                <Card
                    style={{
                        width: 640,
                        height: "auto",
                        marginTop: 20,
                        textAlign: "center",
                        borderRadius: 8,
                        backgroundColor: "#fafafa",
                    }}
                >
                    <Avatar
                        size={168}
                        src={userInfo?.avatar_url ? `${baseUrl}${userInfo?.avatar_url}` : default_avatar}
                        style={{marginBottom: 12}}
                    />
                    <Title level={5}>{userInfo?.lastName} {userInfo?.firstName} {userInfo?.middleName}</Title>
                    <Divider/>

                    <Flex vertical gap={8} align="flex-start">
                        <Space>
                            <PhoneOutlined/>
                            <Text>{formatPhone(userInfo?.telephoneNumber)}</Text>
                        </Space>
                    </Flex>

                    {
                        userInfo?.posts?.length > 0 &&

                        <fieldset style={{border: "1px solid #d9d9d9"}}>
                            <legend className={classes.title}>Закрепленные посты</legend>

                            {
                                userInfo.posts.map((p) => (
                                    <div style={{
                                        display: "flex",
                                        gap:"10px",
                                        border: "1px solid #d9d9d9",
                                        marginTop: "16px",
                                        borderRadius: "10px",
                                        padding: "10px",
                                    }}
                                    >
                                        <img src={icon_post} alt="icon_post"/>
                                        <div style={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}>
                                            <Text className={classes.subtitle} style={{paddingLeft: "5px", fontWeight: "bold"}}>
                                                {p.postName}
                                            </Text>
                                            <Text className={classes.subtitle} style={{paddingLeft: "5px"}}>
                                                {p.divisionName}
                                            </Text>
                                        </div>
                                    </div>

                                ))
                            }


                        </fieldset>


                    }
                    {
                        userInfo?.isFired && (

                            <div style={{marginBottom: 16, marginTop: 16}}>
                                <div style={{
                                    maxWidth: "350px",
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

                                    <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
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
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                            <span style={{fontSize: '14px', color: '#666'}}>Дата увольнения:</span>
                                            <DatePicker
                                                value={userInfo?.updatedAt ? dayjs(userInfo.updatedAt) : null}
                                                format="DD.MM.YYYY"
                                                style={{width: '150px'}}
                                                disabled
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    }

                </Card>
            </MainContentContainer>
        </>
    )
}
