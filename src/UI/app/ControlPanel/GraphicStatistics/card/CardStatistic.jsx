import React, { useState } from "react";
import classes from "./CardStatistic.module.css";
import GraphicForCard from "./GraphicForCard";
import { Tooltip } from "antd";

const CardStatistic = React.memo(({
  name,
  idStatistic,
  data,
  datePoint,
  setOpenModal,
  setSelectedStatistic,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (event) => setIsDragging(false);
  const handlePointerMove = () => setIsDragging(true);
  const handlePointerUp = () => {
    if (!isDragging) {
      setSelectedStatistic({ id: idStatistic, name });
      setOpenModal(true);
    }
  };

  return (
    <div
      data-tour="cardStatistics"
      className={classes.graphic}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <Tooltip title={name}>
        <span>{name}</span>
      </Tooltip>
      <GraphicForCard dataStatistics={data} datePoint={datePoint} />
    </div>
  );
});

export default CardStatistic;