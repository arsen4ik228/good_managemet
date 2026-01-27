import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TableRow from '../TableRow.jsx';
import s from './SortableRow.module.css';

export default function SortableRow({ id, target, posts, updateTarget }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    position: "relative",
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      className={s.drag}
      ref={setNodeRef}
      style={style}
    >
      <div
        className={s.dragHandle}
        {...listeners}
        {...attributes}
      >
        ☰
      </div>
      <TableRow target={target} posts={posts} updateTarget={updateTarget} />
    </div>
  );
}
