// utils/TreeNode.jsx
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import classes from './TreeNode.module.css';
import default_avatar from '@image/default_avatar.svg';
import {baseUrl} from '@helpers/constants.js'

export default function TreeNode({ data }) {
    // Получаем данные узла
    const nodeData = data?.nodeData;
    const [imgError, setImgError] = useState(false);
    
    if (!nodeData) {
        return <div>Ошибка: нет данных</div>;
    }
    
    const {
        postName,
        divisionName,
        companyName,
        divisionNumber,
        user,
        hasChildren
    } = nodeData;
    
    // Функция для форматирования имени (без отчества)
    const formatName = (fullName) => {
        if (!fullName) return null;
        
        // Разделяем имя на части
        const nameParts = fullName.trim().split(/\s+/);
        
        if (nameParts.length >= 2) {
            // Возвращаем только фамилию и имя (без отчества)
            return `${nameParts[0]} ${nameParts[1]}`;
        }
        
        return fullName;
    };
    
    // Форматируем название подразделения
    const formatDivision = () => {
        const division = companyName || divisionName;
        if (!division) return null;
        
        const number = divisionNumber ? ` №${divisionNumber}` : '';
        return `${division}${number}`;
    };
    
    const divisionText = formatDivision();
    const userName = user?.fullName || user?.name;
    const formattedName = userName ? formatName(userName) : null;
    
    // Функция для отображения аватарки
    const renderAvatar = () => {
        // Если сотрудник уволен
        if (user?.isFired) {
            return (
                <div className={classes.photoSection} style={{ background: '#ffebee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '32px', color: '#ff4444' }}>⚠️</span>
                </div>
            );
        }
        
        // Если есть аватарка и нет ошибки загрузки
        if (user?.avatarUrl && !imgError) {
            return (
                <div className={classes.photoSection}>
                    <img 
                        src={baseUrl + user.avatarUrl} 
                        alt="avatar" 
                        onError={() => setImgError(true)}
                    />
                </div>
            );
        }
        
        // Если есть имя - показываем инициалы
        if (formattedName) {
            // Создаем инициалы из имени и фамилии
            const nameParts = formattedName.split(' ');
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
                        {divisionText && (
                            <div className={classes.upperText} title={divisionText}>
                                {divisionText}
                            </div>
                        )}
                        
                        <div className={classes.bottomText}>
                            {formattedName && (
                                <div 
                                    className={classes.userName}
                                    style={{ 
                                        textDecoration: user?.isFired ? 'line-through' : 'none',
                                        opacity: user?.isFired ? 0.6 : 1
                                    }}
                                    title={formattedName}
                                >
                                    {formattedName}
                                </div>
                            )}
                            {postName && (
                                <div className={classes.postName} title={postName}>
                                    {postName}
                                </div>
                            )}
                        </div>
                       
                        {user?.isFired && (
                            <div className={classes.firedBadge}>
                                Уволен
                            </div>
                        )}
                        
                        {!formattedName && !divisionText && (
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