import React, {useState} from "react";
import classes from "./CardStatistic.module.css";
import GraphicForCard from "./GraphicForCard";
import {Tooltip} from "antd";

import {
    HolderOutlined
} from '@ant-design/icons';

const CardStatistic = React.memo(
    ({
         name,
         chartDirection,
         idStatistic,
         data,
         datePoint,
         setOpenModal,
         setSelectedStatistic,
         dragHandleProps,
         norma
     }) => {
        const [isDragging, setIsDragging] = useState(false);

        const handlePointerDown = (event) => setIsDragging(false);
        const handlePointerMove = () => setIsDragging(true);
        const handlePointerUp = () => {
            if (!isDragging) {
                setSelectedStatistic({id: idStatistic, name, type: chartDirection});
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
                <div className={classes.drag} {...dragHandleProps}>
                    <HolderOutlined style={{color: "#999999"}}/>
                </div>

                <Tooltip title={name}>
                    <span className={classes.titleText}>{name}</span>
                </Tooltip>


                <GraphicForCard dataStatistics={data} datePoint={datePoint} type={chartDirection} norma={norma}/>
            </div>
        );
    }
);

export default CardStatistic;
