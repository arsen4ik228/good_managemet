import { useState, useEffect } from 'react';
import s from './EditProject.module.css';
import Table from '../components/table/Table';
import { useAllPosts } from '../../../../hooks/Post/useAllPosts';

const project = {
  projectName: 'projectName',
  targets: [
    { id: 'p1', type: 'Продукт', orderNumber: 1, content: ' xvbvbvcbvcbvcb' },
    { id: 'z1', type: 'Задачи', orderNumber: 1, content: 'Задача 1' },
    { id: 'z2', type: 'Задачи', orderNumber: 2, content: 'Задача 2' },
    { id: 'k1', type: 'Показатели', orderNumber: 1, content: 'Показатели 1' },
    { id: 'k2', type: 'Показатели', orderNumber: 2, content: 'Показатели 2' },
    { id: 'r1', type: 'Правила и ограничения', orderNumber: 1, content: ' ' },
    { id: 'o1', type: 'Организационные мероприятия', orderNumber: 1, content: ' ' },
  ],
};

export default function EditProject({
  sections,
}) {
  const [targetsByType, setTargetsByType] = useState({});

  const { allPosts } = useAllPosts();

  useEffect(() => {
    const grouped = project.targets.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});
    setTargetsByType(grouped);
  }, []);

  return (
    <div className={s.main}>
      {Object.entries(targetsByType)
        .filter(([title]) =>
          sections.find(s => s.name === title && s.isView)
        )
        .map(([title, targets]) => (
          <Table key={title} title={title} targets={targets} posts={allPosts}/>
        ))}

    </div>
  );
}