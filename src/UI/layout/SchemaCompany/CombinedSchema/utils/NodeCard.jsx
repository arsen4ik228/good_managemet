import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import classes from './NodeCard.module.css';
import default_avatar from '@image/default_avatar.svg';
import { baseUrl } from '@helpers/constants.js';

export default function NodeCard({ data }) {
    const { label, userName, postName, avatarUrl } = data || {};
    const [imgError, setImgError] = useState(false);

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
                            <div className={classes.upperText} title={label}>{label}</div>
                        )}
                        <div className={classes.bottomText}>
                            {userName && (
                                <div className={classes.userName} title={userName}>{userName}</div>
                            )}
                            {postName && (
                                <div className={classes.postName} title={postName}>{postName}</div>
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
        </>
    );
}
