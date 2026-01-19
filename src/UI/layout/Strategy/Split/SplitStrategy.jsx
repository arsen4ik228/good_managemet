import { useState, useRef } from "react";
import TextArea from "antd/es/input/TextArea";
import classes from "./SplitStrategy.module.css";
import { AccordionRdx } from "../../../radixUI/accordion/AccordionRdx";
import { TriggerContent } from "./components/TriggerContent";
import { AccordionContent } from "./components/AccordionContent";


import { useCreateProject } from "@hooks/Project/useCreateProject";
import { useUpdateSingleProject } from "@hooks/Project/useUpdateSingleProject";
import { useAllProject } from "@hooks/Project/useAllProject";
import BtnIconRdx from "../../../radixUI/buttonIcon/BtnIconRdx";

import copy from "../img/copy.svg";
import plusCircle from "../img/plusCircle.svg";



export default function SplitStrategy({ currentStrategy }) {
    const containerRef = useRef(null);
    const [selectionUI, setSelectionUI] = useState(null);

    const handleMouseUp = (e) => {
        const textarea = e.target;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) {
            setSelectionUI(null);
            return;
        }

        const selectedText = textarea.value.slice(start, end);

        const textareaRect = textarea.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        // Получаем стили textarea
        const style = window.getComputedStyle(textarea);
        const lineHeight = parseInt(style.lineHeight, 10) || 20;
        const paddingTop = parseInt(style.paddingTop, 10) || 0;
        const paddingRight = parseInt(style.paddingRight, 10) || 0;

        // Номер строки начала выделения
        const startLine = textarea.value.substr(0, start).split("\n").length - 1;

        // Координата top — на уровне первой строки выделения
        const top = textareaRect.top - containerRect.top + paddingTop + startLine * lineHeight - textarea.scrollTop;

        // Координата left — справа внутри textarea с небольшим отступом
        const left = textareaRect.right - containerRect.left - paddingRight + 8; // 8px от края текста

        setSelectionUI({
            top,
            left,
            text: selectedText,
        });
    };

    const {
        projects,
        projectsWithProgram,
    } = useAllProject();

    const {
        reduxSelectedOrganizationId,
        createProject,
    } = useCreateProject();


    const createNewProject = async () => {
        try {
            await createProject({
                organizationId: reduxSelectedOrganizationId,
                projectName: `Новый проект 123`,
                type: "Проект",
                strategyId: currentStrategy.id,
                content: selectionUI?.text || " ", // если текст есть — используем, иначе " "
                targetCreateDtos: [
                    {
                        type: "Продукт",
                        orderNumber: 1,
                        content: " ",
                    },
                ],
            }).unwrap();
        } catch (error) {
            console.error("Ошибка при создании проекта:", error);
        }
    };

    const {
        updateProject,
    } = useUpdateSingleProject();


    return (
        <div className={classes.main} ref={containerRef}>

            {/* <button onClick={createNewProject}>создать проект</button>

            {
                [...projectsWithProgram, ...projects].map((p) => (
                    <AccordionRdx
                        accordionId={p.id}
                        triggerContent={<TriggerContent title={p.projectName} />}
                    >
                        <AccordionContent project={p} updateProject={updateProject} info={p.content} name={p.projectName} product={p?.targets?.find((item) => item.type === "Продукт")?.content} />
                    </AccordionRdx>
                ))
            } */}


            <fieldset className={classes.frame}>
                <legend className={classes.title}>Стратегия</legend>

                <TextArea
                    style={{
                        resize: "none",
                        border: "none",
                        outline: "none",
                        boxShadow: "none",
                    }}
                    value={currentStrategy.content}
                    readOnly
                    autoSize
                    onMouseUp={handleMouseUp}
                />
            </fieldset>

            {selectionUI && (
                <div
                    className={classes.selectionActions}
                    style={{
                        position: "absolute",
                        top: selectionUI.top,
                        left: selectionUI.left,
                    }}
                >
                    <BtnIconRdx icon={plusCircle} onClick={createNewProject} tooltipText={"создать проект"} />
                    <BtnIconRdx icon={copy} tooltipText={"скопировать"} />
                </div>
            )}

        </div>
    );
}
