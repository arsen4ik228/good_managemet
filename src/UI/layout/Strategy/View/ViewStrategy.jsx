import classes from './ViewStrategy.module.css'
import org_icon from "@image/org_icon.svg"

import projects from "../img/projects.svg"
import useViewStrategy from './useViewStrategy';
import TextAreaRdx from '../../../radixUI/textArea/TextAreaRdx';
import { useRightPanel, usePanelPreset } from "@hooks";

function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

const StyleProject = ({ title }) => {
    return (
        <div className={classes.itemProject}>
            <img src={projects} alt={projects} />
            <button>{title}</button>
        </div>
    );
}

export function ViewStrategy({ contentRef }) {

    const { PRESETS } = useRightPanel();
    usePanelPreset(PRESETS["STRATEGY"]);

    const { currentStrategy, currentObjective, projects } = useViewStrategy();

    return (
        <div ref={contentRef} className={classes.main}>
            <div className={classes.title}>
                <img src={org_icon} alt="картинка" width={"100px"} height={"100px"} className={classes.image} />
                <h3 className={classes.h3}>{localStorage.getItem("name")}</h3>
            </div>

            <div className="">
                <h3 className={classes.h3}>Стратегия №{currentStrategy?.strategyNumber}</h3>
                <h3 className={classes.date}>
                    {currentStrategy.state === "Черновик"
                        ? null
                        : currentStrategy.state === "Активный"
                            ? `от ${formatDate(currentStrategy.updatedAt)}`
                            : `c ${formatDate(currentStrategy.createdAt)} по ${formatDate(currentStrategy.updatedAt)}`
                    }
                </h3>
            </div>


            <div>
                <h4 className={classes.h4}>Ситуация</h4>
                <p>{currentObjective?.situation}</p>
            </div>


            <div className="">
                <h4 className={classes.h4}>Причина</h4>
                <p>{currentObjective?.rootCause}</p>
            </div>


            <div className="">
                <h4 className={classes.h4}>Краткосрочная цель</h4>

                <p className={classes.marginLeft}>
                    1. <div>{currentObjective?.content?.[0]}</div>
                </p>

                <p className={classes.marginLeft}>
                    2.<div>{currentObjective?.content?.[1]}</div>
                </p>

            </div>


            <div className="">
                <h4 className={classes.h4}>Стратегия</h4>
                <TextAreaRdx
                    style={{
                        padding: 0
                    }}
                    value={currentStrategy?.content}
                    readOnly
                    autoSize
                />
            </div>

            <div className="">
                <h4 className={classes.h4}>Проекты:</h4>
                {
                    projects.map((p) => <StyleProject title={p.projectName} />)
                }
            </div>
        </div>
    )
}
