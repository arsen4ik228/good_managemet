import s from './Table.module.css';
import TableName from '../tableName/TableName.jsx';
import {DndContext, closestCenter, PointerSensor, KeyboardSensor, useSensor, useSensors} from '@dnd-kit/core';
import {arrayMove, SortableContext, verticalListSortingStrategy, sortableKeyboardCoordinates} from '@dnd-kit/sortable';
import {restrictToVerticalAxis} from '@dnd-kit/modifiers';
import SortableRowProgram from "../row/sotrable/SortableRowProgram";

export default function TableProgram({title, projects, posts, updateTarget, addTarget, updateOrder, focusTargetId, setProjectIdsInProgram}) {

    // Фильтруем проекты, у которых есть targets[0]
    const validProjects = projects.filter(p => p?.targets?.[0]);

    // Создаем массив ID для SortableContext
    const items = validProjects.map(p => p.targets[0].id);


    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {coordinateGetter: sortableKeyboardCoordinates})
    );

    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (!over || active.id === over.id) return;

        // Находим индексы в отфильтрованном массиве
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        // Переставляем элементы в массиве validProjects
        const newProjects = arrayMove(validProjects, oldIndex, newIndex);

        // Передаем весь массив проектов, а не только ID
        updateOrder(newProjects);

        // Создаем массив ID targets в новом порядке
        const newTargetIds = newProjects.map(p => p.targets[0].id);
        setProjectIdsInProgram(newTargetIds);
    };

    return (
        <div className={s.table}>
            <TableName title={title}/>
            <DndContext
                modifiers={[restrictToVerticalAxis]}
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    {validProjects.map((project, index) => (
                        <SortableRowProgram
                            hrefProject={project?.id}
                            key={project.targets[0].id}
                            id={project.targets[0].id}
                            target={project.targets[0]}
                            posts={posts}
                            updateTarget={updateTarget}
                            addTarget={addTarget}
                            focusTargetId={focusTargetId}
                            fieldDisabled={true}
                            orderNumber={index + 1}
                        />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}