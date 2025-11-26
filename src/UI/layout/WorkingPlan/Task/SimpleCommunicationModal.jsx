import React from 'react';
import { Modal,  } from 'antd';

const SimpleCommunicationModal = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal
      title="Подтверждение перехода"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onClose}
      okText="Перейти"
      cancelText="Отмена"
      centered 
    >
      <p>Хотите перейти к коммуникации по данному приказу?</p>
    </Modal>
  );
};

export default SimpleCommunicationModal;