import React from 'react';
import classes from './Test.module.css';

const NodeCard = () => {
  // Статичные данные
  const user = {
    name: 'Алексей Начёсов',
    avatar_url: null, // если есть фото, подставьте URL
    telephoneNumber: '+7 (999) 123-45-67',
    isFired: false
  };

  const fullName = 'Алексей Начёсов';
  
  const node = {
    companyName: 'Жилстрой',
    postName: 'Директор',
    divisionNumber: '1'
  };

  // Функция для получения инициалов
  const getInitials = () => {
    if (!fullName && !user?.name) return '?';
    const nameForInitials = fullName || user?.name || '';
    const nameParts = nameForInitials.trim().split(' ');
    if (nameParts.length >= 2) {
      return nameParts[0].charAt(0) + nameParts[1].charAt(0);
    } else if (nameParts.length === 1) {
      return nameParts[0].charAt(0);
    }
    return '?';
  };

  const initials = getInitials();
  const hasValidUser = user && !user.isFired;

  return (
    <div style={styles.container}>
      {/* Левая часть: круглая фотография на всю высоту */}
      <div style={styles.photoSide}>
        {hasValidUser && user.avatar_url ? (
          <div style={styles.circleImage}>
            <img 
              src={user.avatar_url} 
              alt="avatar" 
              style={styles.avatarImage} 
            />
          </div>
        ) : hasValidUser ? (
          <div style={styles.circleInitials}>
            <span style={styles.initialsText}>{initials}</span>
          </div>
        ) : (
          <div style={{
            ...styles.circlePlaceholder,
            background: user?.isFired ? '#ffebee' : '#f5f5f5'
          }}>
            <span style={{
              fontSize: '32px',
              color: user?.isFired ? '#ff4444' : '#aaa'
            }}>
              {user?.isFired ? '⚠️' : '🏢'}
            </span>
          </div>
        )}
      </div>

      {/* Правая часть: текстовый блок */}
      <div style={styles.contentSide}>
        {/* Название компании / подразделения */}
        {(node?.divisionName || node?.companyName) && (
          <div style={styles.companyName}>
            {node?.companyName || node?.divisionName} 
            {node?.divisionNumber && ` №${node.divisionNumber}`}
          </div>
        )}

        {/* Должность */}
        {node?.postName && (
          <div style={styles.postTitle}>
            {node.postName}
          </div>
        )}

        {/* Имя сотрудника */}
        {user ? (
          <div style={{
            ...styles.userName,
            ...(user.isFired && styles.firedUser)
          }}>
            {fullName || user?.name || 'Алексей Начёсов'}
          </div>
        ) : (
          <div style={styles.userName}>
            Алексей Начёсов
          </div>
        )}

        {/* Декоративная линия */}
        <div style={styles.divider} />

        {/* Телефон */}
        {user?.telephoneNumber && (
          <div style={styles.phone}>
            <span>📞</span> {user.telephoneNumber}
          </div>
        )}

        {/* Статус уволен */}
        {user?.isFired && (
          <div style={styles.firedBadge}>
            Уволен
          </div>
        )}

        {/* Заглушка при отсутствии данных */}
        {!user && !node?.divisionName && (
          <div style={styles.noData}>
            Данные отсутствуют
          </div>
        )}
      </div>
    </div>
  );
};

// Стили компонента
const styles = {
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    gap: '16px',
    alignItems: 'stretch',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '16px',
    boxSizing: 'border-box'
  },

  // Левая часть с фото
  photoSide: {
    width: '96px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  circleImage: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    overflow: 'hidden',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },

  avatarImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },

  circleInitials: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #2C5F8A 0%, #1A3B50 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },

  initialsText: {
    fontWeight: 600,
    fontSize: '28px',
    color: 'white',
    textTransform: 'uppercase'
  },

  circlePlaceholder: {
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },

  // Правая часть с текстом
  contentSide: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
    gap: '8px'
  },

  companyName: {
    fontWeight: 800,
    fontSize: '20px',
    color: '#1A2C3E',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    letterSpacing: '-0.3px'
  },

  postTitle: {
    fontWeight: 700,
    fontSize: '16px',
    color: '#333333',
 
  },

  userName: {
    fontWeight: 700,
    fontSize: '22px',
    color: '#1F3B4C',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },

  firedUser: {
    textDecoration: 'line-through',
    opacity: 0.6
  },

  divider: {
    width: '50px',
    height: '3px',
    background: '#C0CFDE',
    borderRadius: '2px',
    margin: '6px 0 4px 0'
  },

  phone: {
    fontSize: '12px',
    color: '#6F8FAA',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },

  firedBadge: {
    display: 'inline-block',
    fontSize: '10px',
    padding: '4px 10px',
    background: '#ff4444',
    color: 'white',
    borderRadius: '20px',
    marginTop: '6px',
    width: 'fit-content',
    fontWeight: 500
  },

  noData: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px'
  }
};


export default function Test() {
  return (
    <>
        <div className={classes.wrapper}>
            <div className={classes.greySection}>хуй</div>
            <div className={classes.whiteSection}>жопа</div>
        </div>
    </>
  )
}
