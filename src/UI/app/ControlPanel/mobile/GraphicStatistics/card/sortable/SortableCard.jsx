import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardStatistic from "../CardStatistic";

export default function SortableCard({
    id,
    item,
    type,
    typeGraphic,
    reportDay,
    setOpenModalStatistic,
    setModalStatisticName,
    setModalStatisticDatas,
  }) {
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
        data={[...item.statisticDatas]}
        type={type}
        typeGraphic={typeGraphic}
        reportDay={reportDay}
        setOpenModalStatistic={setOpenModalStatistic}
        setModalStatisticName={setModalStatisticName}
        setModalStatisticDatas={setModalStatisticDatas}
      />
    </div>
  );
}
