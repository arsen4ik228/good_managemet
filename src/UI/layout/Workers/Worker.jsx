import React from 'react'
import MainContentContainer from '../../Custom/MainContentContainer/MainContentContainer'
import { Avatar, Card, Divider, Flex, Typography, Space } from 'antd'
import { useParams } from 'react-router-dom';
import { useUserHook } from '@hooks'
import default_avatar from '@image/default_avatar.svg'
import { formatPhone } from '../Posts/function/functionForPost';
import { baseUrl } from "@helpers/constants.js";
import {
    PhoneOutlined,
} from "@ant-design/icons";
import { useModuleActions, usePanelPreset, useRightPanel } from '../../../hooks';


export default function Worker() {
    const { userId } = useParams();

    const { Title, Text } = Typography;

    const { userInfo } = useUserHook({ userId })

    const { PRESETS } = useRightPanel();

    usePanelPreset(PRESETS["USERS"]);

    const { buutonsArr } = useModuleActions("users", userId);


    return (
        <>
            <MainContentContainer buttons={buutonsArr}>
                <Card
                    style={{
                        width: 450,
                        maxHeight: 500,
                        marginTop: 20,
                        textAlign: "center",
                        borderRadius: 8,
                        backgroundColor: "#fafafa",
                    }}
                >
                    <Avatar
                        size={168}
                        src={userInfo?.avatar_url ? `${baseUrl}${userInfo?.avatar_url}` : default_avatar}
                        style={{ marginBottom: 12 }}
                    />
                    <Title level={5}>{userInfo?.lastName} {userInfo?.firstName} {userInfo?.middleName}</Title>
                    {/* <Title level={5}>{userInfo?.middleName}</Title> */}

                    <Divider />

                    <Flex vertical gap={8} align="flex-start">
                        <Space>
                            <PhoneOutlined />
                            <Text>{formatPhone(userInfo?.telephoneNumber)}</Text>
                        </Space>
                    </Flex>
                </Card>
            </MainContentContainer>
        </>
    )
}
