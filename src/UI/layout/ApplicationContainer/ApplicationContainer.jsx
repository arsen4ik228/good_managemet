import React, { memo } from 'react';
import { Layout } from 'antd';
import classes from './ApplicationContainer.module.css';
import { Outlet } from 'react-router-dom';
import LeftSIder from './LeftSider/LeftSIder';
import RightSider from './RightSider/RightSider';
import { useSelector } from 'react-redux';
import { selectRightPanel } from '../../../store/slices/panels.slice';
import { useSetPresets } from '@hooks'

const { Sider, Content } = Layout;

const MemoizedLeftSider = memo(LeftSIder)
const MemoizedRightSider = memo(RightSider)

export default function ApplicationContainer() {

    useSetPresets()

    const rightPanelConfig = useSelector(selectRightPanel);

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
                <MemoizedRightSider config={rightPanelConfig} />
            </Sider>
        </Layout>
    );
}