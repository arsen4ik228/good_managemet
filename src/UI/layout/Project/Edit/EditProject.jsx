import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import s from './EditProject.module.css';
import Table from '../components/table/Table';
import { v4 as uuidv4 } from 'uuid';
import { useRightPanel, usePanelPreset } from "@hooks";
import { useAllPosts } from '../../../../hooks/Post/useAllPosts';
import { useGetSingleProject } from "../../../../hooks/Project/useGetSingleProject";

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

const initialSections = [
  { name: 'Информация' },
  { name: 'Продукт' },
  { name: 'Метрика' },
  { name: 'Организационные мероприятия' },
  { name: 'Правила' },
  { name: 'Задача' },
];

// "07a243c4-94bc-4b8c-b9fb-fad012e636bf"
export default function EditProject({ sections }) {
  const { PRESETS } = useRightPanel()
  usePanelPreset(PRESETS["PROJECTSANDPROGRAMS"]);

  const { projectId } = useParams();

  const { allPosts } = useAllPosts();
  const { currentProject, targets } = useGetSingleProject({ selectedProjectId: projectId });

  const [targetsByType, setTargetsByType] = useState({});

  useEffect(() => {
    if (!targets) return;

    // 1. Группируем то, что пришло с бэка
    const grouped = targets.reduce((acc, group) => {
      acc[group.title] = group.tasks.map(task => ({
        id: task.id,
        type: group.title,
        orderNumber: task.orderNumber || 1,
        content: task.task || '',
        holderPostId: task.holderPostId || null,
        date: task.date ? new Date(task.date) : null,
        isCreated: false,
        ...task,
      }));
      return acc;
    }, {});

    // 2. Гарантируем наличие всех разделов
    initialSections.forEach(({ name }) => {
      if (!grouped[name]) {
        grouped[name] = [
          {
            id: uuidv4(),
            type: name,
            orderNumber: 1,
            content: '',
            holderPostId: null,
            date: null,
            isCreated: true,
          },
        ];
      }
    });

    // 3. Добавляем пустой элемент для создания (кроме "Продукт")
    Object.entries(grouped).forEach(([type, items]) => {
      if (type !== 'Продукт' && !items.some(i => i.isCreated)) {
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
  }, [targets]);

  console.log("targetsByType = ", targetsByType)

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
      <div className={s.wrapper}>
        {sections
          .filter(section => section.isView) // только видимые
          .map(section => {
            const targets = targetsByType[section.name] || [];
            return (
              <Table
                key={section.name}
                title={section.name}
                targets={targets}
                posts={allPosts}
                updateTarget={(id, field, value) =>
                  handleUpdateTarget(section.name, id, field, value)
                }
                addTarget={() => handleAddTarget(section.name)}
                updateOrder={(newOrderIds) =>
                  handleUpdateOrder(section.name, newOrderIds)
                }
              />
            );
          })}
      </div>
    </div>
  );
}
