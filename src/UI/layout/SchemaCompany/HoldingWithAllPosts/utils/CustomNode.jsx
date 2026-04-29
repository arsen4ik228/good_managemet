// utils/TreeNode.jsx
import React, { useState, useParams } from 'react';
import { Handle, Position } from 'reactflow';
import classes from './CustomNode.module.css';
import default_avatar from '@image/default_avatar.svg';
import { baseUrl } from '@helpers/constants.js'
import { selectedOrganizationId, homeUrl } from '@helpers/constants.js'

export default function CustomNode({ data }) {
    // Получаем данные узла
    const nodeData = data;
    const [imgError, setImgError] = useState(false);

    // const { organizationId } = useParams();

    if (!nodeData) {
        return <div>Ошибка: нет данных</div>;
    }
    console.log(data)
    const {
        postName,
        userName,
        label,
        avatarUrl,
        userId,
        postId

    } = nodeData;

    const postClick = () => {
        window.open(`${homeUrl}#/${selectedOrganizationId}/helper/posts/${postId}`, '_blank')
    }

    const userClick = () => {
        window.open(`${homeUrl}#/${selectedOrganizationId}/helper/users/${userId}`, '_blank')

    }

    // Функция для отображения аватарки
    const renderAvatar = () => {
        // Если сотрудник уволен


        // Если есть аватарка и нет ошибки загрузки
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

        // Если есть имя - показываем инициалы
        if (userName) {
            // Создаем инициалы из имени и фамилии
            const nameParts = userName.split(' ');
            const initials = nameParts.map(part => part[0]).join('');

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

        // Заглушка - default_avatar
        return (
            <div className={classes.photoSection}>
                <img
                    src={default_avatar}
                    alt="default avatar"
                />
            </div>
        );
    };

    return (
        <>
            {/* Handle для входящих рёбер (сверху) */}
            <Handle
                type="target"
                position={Position.Top}
                id="top"
                style={{ background: '#CCCCCC', width: '12px', height: '12px', top: '-6px' }}
            />

            <div className={classes.wrapper}>
                <div className={classes.greySection}></div>
                <div className={classes.whiteSection}></div>

                <div className={classes.contentContainer}>
                    {renderAvatar()}
                    <div className={classes.textSection}>
                        {label && (
                            <div className={classes.upperText} title={label}>
                                {label}
                            </div>
                        )}

                        <div className={classes.bottomText}>
                            {userName && (
                                <div
                                    className={classes.userName}
                                    // style={{ 
                                    //     textDecoration: user?.isFired ? 'line-through' : 'none',
                                    //     opacity: user?.isFired ? 0.6 : 1
                                    // }}
                                    title={userName}
                                    onClick={() => userClick()}
                                >
                                    {userName}
                                </div>
                            )}
                            {postName && (
                                <div className={classes.postName} title={postName}
                                    onClick={() => postClick()}
                                >
                                    {postName}
                                </div>
                            )}
                        </div>

                        {/* {user?.isFired && (
                            <div className={classes.firedBadge}>
                                Уволен
                            </div>
                        )} */}

                        {!userName && !label && (
                            <div className={classes.noData}>
                                Данные отсутствуют
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Handle для исходящих рёбер (снизу) */}
            <Handle
                type="source"
                position={Position.Bottom}
                id="bottom"
                style={{ background: '#CCCCCC', width: '12px', height: '12px', bottom: '-6px' }}
            />
        </>
    );
}