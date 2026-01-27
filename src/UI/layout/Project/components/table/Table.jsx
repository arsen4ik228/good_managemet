import s from './Table.module.css';
import TableName from '../tableName/TableName.jsx';
import { DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import SortableRow from '../row/sotrable/SortableRow.jsx';

export default function Table({ title, targets, posts, updateTarget, addTarget, updateOrder }) {
  const items = targets.map(t => t.id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.indexOf(active.id);
    const newIndex = items.indexOf(over.id);
    const newOrderIds = arrayMove(items, oldIndex, newIndex);

    // Обновляем orderNumber
    newOrderIds.forEach((id, index) => {
      const item = targets.find(t => t.id === id);
      if (item.orderNumber !== index + 1) {
        updateTarget(id, 'orderNumber', index + 1);
      }
    });

    updateOrder(newOrderIds);
  };

  return (
    <div className={s.table}>
      <TableName title={title} />
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {targets.map(t => (
            <SortableRow
              key={t.id}
              id={t.id}
              target={t}
              posts={posts}
              updateTarget={updateTarget}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
