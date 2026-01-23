import { useState, useEffect } from 'react'

import s from './EditProject.module.css'
import Table from '../components/table/Table'

const project = {
  projectName: "projectName",
  targets: [
    {
      id: "08576ed9-45c8-4556-a946-bd7e89c7de51",
      type: "Продукт",
      orderNumber: 1,
      content: " ",
      holderPostId: null,
    },

    {
      id: "1",
      type: "Задачи",
      orderNumber: 1,
      content: "Задача 1",
      holderPostId: null,
    },
    {
      id: "2",
      type: "Задачи",
      orderNumber: 2,
      content: "Задача 2",
      holderPostId: null,
    },

    {
      id: "1",
      type: "Показатели",
      orderNumber: 1,
      content: " Показатели 1",
      holderPostId: null,
    },
    {
      id: "2",
      type: "Показатели",
      orderNumber: 1,
      content: " Показатели 2",
      holderPostId: null,
    },
    {
      id: "1",
      type: "Правила и огранияения",
      orderNumber: 1,
      content: " ",
      holderPostId: null,
    },
    {
      id: "1",
      type: "Организационные мероприятия",
      orderNumber: 1,
      content: " ",
      holderPostId: null,
    }
  ]
}

export default function EditProject() {

  const [target, setTarget] = useState();

  useEffect(() => {
    if (!project) return;

    const targets = project?.targets?.reduce((acc, current) => {
      if (!acc[current.type]) {
        acc[current.type] = [];
      }
      acc[current.type].push(current);
      return acc;
    }, {});

    setTarget(targets);
  }, []);

  return (
    <div className={s.main}>
      {target &&
        Object.entries(target).map(([title, targets]) => (
          <Table
            key={title}
            title={title}
            targets={targets}
          />
        ))}
    </div>
  )
}
