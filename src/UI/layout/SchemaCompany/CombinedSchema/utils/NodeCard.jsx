import React, { useContext, useState } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';
import classes from './NodeCard.module.css';
import default_avatar from '@image/default_avatar.svg';
import phone from '@image/phone.svg';
import { baseUrl } from '@helpers/constants.js';
import { Skeleton, Space, Typography } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import { useGetSinglePostForView } from '@hooks/Post/useGetSinglePostForView';
import { formatPhone } from '../../../Posts/function/functionForPost';
import { NodeExpansionContext } from './NodeExpansionContext';

export default function NodeCard({ id, data }) {
    const { label, userName, postName, avatarUrl, isOrganization, original } = data || {};
    const [imgError, setImgError] = useState(false);
    const [postId, setPostId] = useState(null);

    const { openNodeId, setOpenNodeId } = useContext(NodeExpansionContext);
    const { setNodes } = useReactFlow();

    const isOpen = openNodeId === id;

    const { currentPost, isLoadingGetPostId } = useGetSinglePostForView({ postId });

    const handleToggle = () => {
        const nextOpen = !isOpen;
        if (nextOpen && original?.id) {
            setPostId(original.id);
        }
        setOpenNodeId(nextOpen ? id : null);
        setNodes(nds => nds.map(n => ({
            ...n,
            zIndex: nextOpen && n.id === id ? 1000 : 0,
        })));
    };

    const canExpand = !isOrganization && postName;

    const renderAvatar = () => {
        if (avatarUrl && !imgError) {
            return (
                <div className={classes.photoSection}>
                    <img
                        src={baseUrl + avatarUrl}
                        alt="avatar"
                        onError={() => setImgError(true)}
                    />
                </div>
            );
        }

        if (userName) {
            const initials = userName.split(' ').filter(Boolean).map(p => p[0]).join('');
            return (
                <div className={classes.photoSection} style={{
                    background: 'linear-gradient(135deg, #2C5F8A 0%, #1A3B50 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span className={classes.initials}>{initials}</span>
                </div>
            );
        }

        return (
            <div className={classes.photoSection}>
                <img src={default_avatar} alt="avatar" />
            </div>
        );
    };

    return (
        <>
            <div className={classes.nodeContainer}>
                <Handle
                    type="target"
                    position={Position.Top}
                    id="top"
                    style={{ background: '#CCCCCC', width: 12, height: 12, top: -6 }}
                />

                <div className={classes.wrapper}>
                    <div className={classes.greySection} />
                    <div className={classes.whiteSection} />
                    <div className={classes.contentContainer}>
                        {renderAvatar()}
                        <div className={classes.textSection}>
                            {label && (
                                <div className={classes.upperText} title={label}>
                                    <span>{label}</span>
                                </div>
                            )}
                            <div className={classes.bottomText}>
                                {userName && (
                                    <div className={classes.userName} title={userName}>{userName}</div>
                                )}
                                {postName && (
                                    <div className={classes.postNameRow}>
                                        <span className={classes.postName} title={postName}>{postName}</span>
                                        {canExpand && (
                                            <button className={classes.expandButton} onClick={handleToggle}>
                                                {isOpen ? <DownOutlined /> : <UpOutlined />}
                                            </button>
                                        )}
                                    </div>
                                )}
                                {!userName && !postName && !label && (
                                    <div className={classes.noData}>Данные отсутствуют</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Handle
                    type="source"
                    position={Position.Bottom}
                    id="bottom"
                    style={{ background: '#CCCCCC', width: 12, height: 12, bottom: -6 }}
                />
            </div>

            {isOpen && (
                <Information
                    role={currentPost?.role?.roleName}
                    product={currentPost?.product}
                    purpose={currentPost?.purpose}
                    statistics={currentPost?.statistics}
                    policy={currentPost?.policy?.policyName}
                    telephoneNumber={currentPost?.user?.telephoneNumber}
                    isLoadingGetPostId={isLoadingGetPostId}
                />
            )}
        </>
    );
}

function Information({ role, product, purpose, statistics, policy, isLoadingGetPostId, telephoneNumber }) {
    return (
        <div className={classes.infoPanel}>
            <Item label="роль поста" text={role} isLoadingGetPostId={isLoadingGetPostId} />
            <Item label="продукт поста" text={product} isLoadingGetPostId={isLoadingGetPostId} />
            <Item label="предназначение поста" text={purpose} isLoadingGetPostId={isLoadingGetPostId} />
            <ViewStatistics statistics={statistics} isLoadingGetPostId={isLoadingGetPostId} />
            <Item label="политика поста" text={policy} isLoadingGetPostId={isLoadingGetPostId} isUnderline />
            <Phone telephoneNumber={telephoneNumber} />
        </div>
    );
}

function ViewStatistics({ statistics, isLoadingGetPostId }) {
    return (
        <div className={classes.block}>
            <div className={classes.nameBlock}>статистики поста</div>
            {isLoadingGetPostId
                ? <Skeleton.Input active />
                : (
                    <>
                        {statistics?.map((s, index) => (
                            <div key={s.id || index} style={{ paddingTop: '5px' }}>
                                {index + 1}.{' '}
                                <span style={{ textDecoration: 'underline', lineHeight: '1.4' }}>{s.name}</span>
                            </div>
                        ))}
                    </>
                )
            }
        </div>
    );
}

function Phone({ telephoneNumber }) {
    return (
        <div className={classes.phone}>
            <Space align="start" size={17} style={{ width: '100%' }}>
                <img src={phone} alt="телефон" />
                <Typography.Text style={{ color: '#333333' }}>{formatPhone(telephoneNumber)}</Typography.Text>
            </Space>
        </div>
    );
}

function Item({ label, text, isUnderline, isLoadingGetPostId }) {
    return (
        <div className={classes.block} style={{ textDecoration: isUnderline ? 'underline' : 'none' }}>
            <div className={classes.nameBlock}>{label}</div>
            {isLoadingGetPostId
                ? <Skeleton.Input active />
                : <span style={{ lineHeight: '1.4' }}>{text}</span>
            }
        </div>
    );
}
