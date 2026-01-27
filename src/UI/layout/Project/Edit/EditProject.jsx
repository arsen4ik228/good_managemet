import { useState, useEffect } from 'react';
import s from './EditProject.module.css';
import Table from '../components/table/Table';
import { v4 as uuidv4 } from 'uuid';
import { useAllPosts } from '../../../../hooks/Post/useAllPosts';

const project = {
  projectName: 'projectName',
  targets: [
    { id: uuidv4(), type: 'Продукт', orderNumber: 1, content: 'Продукт', holderPostId: null, date: null },
    { id: uuidv4(), type: 'Задачи', orderNumber: 1, content: 'Задача 1', holderPostId: null, date: null },
    { id: uuidv4(), type: 'Задачи', orderNumber: 2, content: 'Задача 2', holderPostId: null, date: null },
    { id: uuidv4(), type: 'Показатели', orderNumber: 1, content: 'Показатели 1', holderPostId: null, date: null },
    { id: uuidv4(), type: 'Показатели', orderNumber: 2, content: 'Показатели 2', holderPostId: null, date: null },
    { id: uuidv4(), type: 'Правила и ограничения', orderNumber: 1, content: 'Правила и ограничения 1', holderPostId: null, date: null },
    { id: uuidv4(), type: 'Организационные мероприятия', orderNumber: 1, content: 'Организационные мероприятия 1', holderPostId: null, date: null },
  ],
};

export default function EditProject({ sections }) {
  const { allPosts } = useAllPosts();

  const [targetsByType, setTargetsByType] = useState({});

  useEffect(() => {
    const grouped = project.targets.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push({ ...item, isCreated: false });
      return acc;
    }, {});

    // Добавляем пустой target для создания (кроме Продукта)
    Object.entries(grouped).forEach(([type, items]) => {
      if (type !== 'Продукт') {
        items.push({
          id: uuidv4(),
          type,
          orderNumber: items.length + 1,
          content: '',
          holderPostId: null,
          date: null,
          isCreated: true,
        });
      }
    });

    setTargetsByType(grouped);
  }, []);

  const handleUpdateTarget = (type, id, field, value) => {
    setTargetsByType(prev => ({
      ...prev,
      [type]: prev[type].map(t => t.id === id ? { ...t, [field]: value } : t),
    }));
  };

  const handleAddTarget = (type) => {
    const newTarget = {
      id: uuidv4(),
      type,
      orderNumber: (targetsByType[type]?.length ?? 0) + 1,
      content: '',
      holderPostId: null,
      date: null,
      isCreated: true,
    };
    setTargetsByType(prev => ({
      ...prev,
      [type]: [...prev[type], newTarget],
    }));
  };

  const handleUpdateOrder = (type, newOrderIds) => {
    setTargetsByType(prev => ({
      ...prev,
      [type]: newOrderIds.map(id => prev[type].find(t => t.id === id)),
    }));
  };

  return (
    <div className={s.main}>
      {Object.entries(targetsByType)
        .filter(([title]) => sections.find(s => s.name === title && s.isView))
        .map(([title, targets]) => (
          <Table
            key={title}
            title={title}
            targets={targets}
            posts={allPosts}
            updateTarget={(id, field, value) => handleUpdateTarget(title, id, field, value)}
            addTarget={() => handleAddTarget(title)}
            updateOrder={(newOrderIds) => handleUpdateOrder(title, newOrderIds)}
          />
        ))}
    </div>
  );
}
