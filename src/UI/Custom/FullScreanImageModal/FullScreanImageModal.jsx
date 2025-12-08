import { Modal } from 'antd';
import { useEffect } from 'react';
import './style.module.css';

export const FullScreenImageModal = ({ imageUrl, onClose }) => {
    

    // Блокируем скролл страницы
    useEffect(() => {
        if (imageUrl) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [imageUrl]);

    if (!imageUrl) return null;

    return (
        <Modal
            open={!!imageUrl}
            onCancel={onClose}
            footer={null}
            closable={true}
            maskClosable={true}
            keyboard={true} // Закрытие по Esc
            width="100%"
            style={{
                top: 0,
                padding: 0,
                margin: 0,
                maxWidth: '100vw',
                height: '100vh',
            }}
            styles={{
                body: {
                    padding: 0,
                    margin: 0,
                    height: '100vh',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    overflow: 'hidden',
                },
                content: {
                    padding: 0,
                    margin: 0,
                    borderRadius: 0,
                    boxShadow: 'none',
                    backgroundColor: 'transparent',
                    maxWidth: '100vw',
                    maxHeight: '100vh',
                },
                mask: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                }
            }}
            closeIcon={
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    color: 'white',
                    fontSize: '32px',
                    zIndex: 10001,
                    background: 'rgba(0, 0, 0, 0.7)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.2s ease',
                }}>
                    ×
                </div>
            }
        >
            <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '20px',
                boxSizing: 'border-box',
                overflow: 'hidden',
            }}>
                <img 
                    src={imageUrl} 
                    alt="Full screen" 
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain',
                        display: 'block',
                    }} 
                    onError={(e) => {
                        console.error('Failed to load image:', imageUrl);
                        e.target.style.display = 'none';
                    }}
                />
            </div>
        </Modal>
    );
};