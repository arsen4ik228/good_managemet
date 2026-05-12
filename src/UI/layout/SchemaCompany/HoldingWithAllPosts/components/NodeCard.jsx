import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import classes from './NodeCard.module.css';
import { baseUrl, selectedOrganizationId, homeUrl } from '@helpers/constants.js';

function Avatar({ avatarUrl, userName, isOrg }) {
    const [imgError, setImgError] = useState(false);

    if (avatarUrl && !imgError) {
        return (
            <img
                className={classes.avatar}
                src={baseUrl + avatarUrl}
                alt="avatar"
                onError={() => setImgError(true)}
            />
        );
    }

    if (userName) {
        const initials = userName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map(p => p[0])
            .join('');
        return (
            <div className={classes.avatarPlaceholder}>
                {initials.toUpperCase()}
            </div>
        );
    }

    return <div className={classes.avatarPlaceholder} />;
}

export default function NodeCard({ data }) {
    const {
        label,
        userName,
        postName,
        avatarUrl,
        userId,
        postId,
        isOrganization,
    } = data || {};

    const cardClass = `${classes.card} ${isOrganization ? classes.cardOrg : classes.cardPost}`;

    const openUser = (e) => {
        if (!userId) return;
        e.stopPropagation();
        window.open(`${homeUrl}#/${selectedOrganizationId}/helper/users/${userId}`, '_blank');
    };

    const openPost = (e) => {
        if (!postId) return;
        e.stopPropagation();
        window.open(`${homeUrl}#/${selectedOrganizationId}/helper/posts/${postId}`, '_blank');
    };

    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{ background: '#94adb8', width: 10, height: 10, top: -5, border: '2px solid #fff' }}
            />

            <div className={cardClass}>
                <div className={classes.accent} />
                <div className={classes.body}>
                    <Avatar avatarUrl={avatarUrl} userName={userName} isOrg={isOrganization} />
                    <div className={classes.info}>
                        {isOrganization && label && (
                            <span className={classes.orgName} title={label}>{label}</span>
                        )}
                        {postName && (
                            <span
                                className={classes.postTitle}
                                title={postName}
                                onClick={openPost}
                                style={postId ? { cursor: 'pointer' } : undefined}
                            >
                                {postName}
                            </span>
                        )}
                        {userName ? (
                            <span className={classes.personName} title={userName} onClick={openUser}>
                                {userName}
                            </span>
                        ) : (
                            <span className={classes.emptySlot}>Вакантно</span>
                        )}
                    </div>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                style={{ background: '#94adb8', width: 10, height: 10, bottom: -5, border: '2px solid #fff' }}
            />
        </>
    );
}
