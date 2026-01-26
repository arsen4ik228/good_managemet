
import s from './Table.module.css'
import TableName from '../tableName/TableName.jsx'
import { DndContext, closestCenter } from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useState } from 'react'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import SortableRow from '../row/sotrable/SortableRow.jsx'

export default function Table({ title, targets, posts }) {
  const [items, setItems] = useState(targets.map(t => t.id))

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = items.indexOf(active.id)
      const newIndex = items.indexOf(over.id)
      setItems(arrayMove(items, oldIndex, newIndex))
    }
  }

  // Сортируем targets по текущему items
  const sortedTargets = items.map(id => targets.find(t => t.id === id))

  return (
    <div className={s.table}>
      <TableName title={title} />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {sortedTargets.map(t => (
            <SortableRow
              key={t.id}
              id={t.id}
              orderNumber={t.orderNumber}
              content={t.content}
              holderPostId={t.holderPostId}
              posts={posts}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
