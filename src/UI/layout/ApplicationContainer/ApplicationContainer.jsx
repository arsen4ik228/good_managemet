import React, { memo } from 'react';
import { Layout } from 'antd';
import classes from './ApplicationContainer.module.css';
import { Outlet } from 'react-router-dom';
import LeftSIder from './LeftSider/LeftSIder';
import RightSider from './RightSider/RightSider';

const { Sider, Content } = Layout;

export default function ApplicationContainer() {

    const MemoizedLeftSider = memo(LeftSIder)
    const MemoizedRightSider = memo(RightSider)

    return (
        <Layout className={classes.wrapper}>
            <Sider
                className={classes.left_panel}
                width={'20%'}
                theme="light"
            >
                <MemoizedLeftSider />
            </Sider>

            <Content className={classes.main_content}>
                <Outlet />
            </Content>

            <Sider
                className={classes.right_panel}
                theme="light"
                width={'20%'}
                reverseArrow
            >
                <MemoizedRightSider />
            </Sider>
        </Layout>
    );
}