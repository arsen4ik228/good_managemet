import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardStatistic from "../CardStatistic";

const SortableCard = React.memo(({
  id,
  item,
  datePoint,
  setSelectedStatistic,
  setOpenModal,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <CardStatistic
        name={item.name}
        idStatistic={item.id}
        data={[...item.statisticDatas]}
        datePoint={datePoint}
        setOpenModal={setOpenModal}
        setSelectedStatistic={setSelectedStatistic}
      />
    </div>
  );
});

export default SortableCard;