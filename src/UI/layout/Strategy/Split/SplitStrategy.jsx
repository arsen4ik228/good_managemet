import { useState } from "react";
import TextArea from "antd/es/input/TextArea";
import classes from "./SplitStrategy.module.css";

import { useCreateProject } from "@hooks/Project/useCreateProject";
import BtnIconRdx from "../../../radixUI/buttonIcon/BtnIconRdx";

import copy from "../img/copy.svg";
import plusCircle from "../img/plusCircle.svg";

import { useRightPanel, usePanelPreset } from "@hooks";

export default function SplitStrategy({ currentStrategy }) {
    const [selectionUI, setSelectionUI] = useState(null);

    const { PRESETS } = useRightPanel();
    usePanelPreset(PRESETS["PROJECT"]);

    const {
        reduxSelectedOrganizationId,
        createProject,
    } = useCreateProject();

    const handleMouseUp = (e) => {
        const textarea = e.target;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (start === end) {
            setSelectionUI(null);
            return;
        }

        const selectedText = textarea.value.slice(start, end);

        const style = window.getComputedStyle(textarea);
        const lineHeight = parseInt(style.lineHeight, 10) || 20;
        const paddingTop = parseInt(style.paddingTop, 10) || 0;
        const paddingRight = parseInt(style.paddingRight, 10) || 0;

        const isBottomToTop = textarea.selectionDirection === "backward";
        const anchorIndex = isBottomToTop ? end : start;
        const lineIndex = textarea.value.slice(0, anchorIndex).split("\n").length - 1;

        // top/left относительно контейнера .main
        const containerRect = textarea.closest(`.${classes.main}`).getBoundingClientRect();
        const textareaRect = textarea.getBoundingClientRect();

        let top = textareaRect.top - containerRect.top + paddingTop + lineIndex * lineHeight;
        if (isBottomToTop) top += lineHeight;

        const left = textareaRect.right - containerRect.left - paddingRight + 8;

        setSelectionUI({
            top,
            left,
            text: selectedText,
        });
    };

    const createNewProject = async () => {
        try {
            await createProject({
                organizationId: reduxSelectedOrganizationId,
                projectName: "Новый проект",
                type: "Проект",
                strategyId: currentStrategy.id,
                content: selectionUI?.text || " ",
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

    const copySelectedText = () => {
        if (!selectionUI?.text) return;
        navigator.clipboard.writeText(selectionUI.text);
    };

    return (
        <div className={classes.main}>
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
                        top: selectionUI.top,
                        left: selectionUI.left,
                    }}
                >
                    <BtnIconRdx
                        icon={plusCircle}
                        onClick={createNewProject}
                        tooltipText="создать проект"
                    />
                    <BtnIconRdx
                        icon={copy}
                        onClick={copySelectedText}
                        tooltipText="скопировать"
                    />
                </div>
            )}
        </div>
    );
}
