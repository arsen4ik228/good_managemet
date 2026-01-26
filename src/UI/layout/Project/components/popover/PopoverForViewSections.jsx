import { useState, useEffect } from 'react';
import { Popover, Button } from 'antd';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import s from './PopoverForViewSections.module.css';

export default function PopoverForViewSections({
  sections,
  onToggle,
  children,
  isOpen,
  onClose
}) {
  const [open, setOpen] = useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
    if (!newOpen) {
      onClose();
    }
  };

  return (
    <Popover
      title={<span className={s.nameBlock}>разделы</span>}
      content={
        <div className={s.list}>
          {sections.map(section => (
            <Button
              key={section.name}
              type="text"
              className={s.item}
              onClick={() => onToggle(section.name)}
            >
              {section.isView ? <EyeOutlined /> : <EyeInvisibleOutlined />}
              <span>{section.name}</span>
            </Button>
          ))}
        </div>
      }
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      placement="bottom"
    >
      {children}
    </Popover>
  );
}