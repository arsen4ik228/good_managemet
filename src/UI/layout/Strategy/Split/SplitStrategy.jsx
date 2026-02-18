import {useState, useRef} from "react";
import {MDXEditor} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import classes from "./SplitStrategy.module.css";

import {useCreateProject} from "@hooks/Project/useCreateProject";
import {useRightPanel, usePanelPreset} from "@hooks";
import {useAllProject} from "../../../../hooks/Project/useAllProject";

import BtnIconRdx from "../../../radixUI/buttonIcon/BtnIconRdx";

import copy from "../img/copy.svg";
import plusCircle from "../img/plusCircle.svg";


export default function SplitStrategy({currentStrategy}) {
    const channel = new BroadcastChannel("project-events");
    const [selectionUI, setSelectionUI] = useState(null);
    const editorWrapperRef = useRef(null);

    const {PRESETS} = useRightPanel();
    usePanelPreset(PRESETS["PROJECT"]);

    const {
        projects,
        projectsWithProgram,
        maxProjectNumber
    } = useAllProject();

    const {
        reduxSelectedOrganizationId,
        createProject,
    } = useCreateProject();

    const handleMouseUp = () => {
        const selection = window.getSelection();

        if (!selection || selection.rangeCount === 0) {
            setSelectionUI(null);
            return;
        }

        const range = selection.getRangeAt(0);

        if (range.collapsed) {
            setSelectionUI(null);
            return;
        }

        // Проверяем, что выделение внутри редактора
        const editorElement = editorWrapperRef.current;
        if (!editorElement.contains(range.commonAncestorContainer)) {
            setSelectionUI(null);
            return;
        }

        const selectedText = selection.toString();
        const rect = range.getBoundingClientRect();
        const wrapperRect = editorElement.getBoundingClientRect();

        const top =
            rect.top -
            wrapperRect.top +
            editorElement.scrollTop + 55;

        const left =
            rect.right -
            wrapperRect.left +
            70;

        setSelectionUI({
            top,
            left,
            text: selectedText,
        });
    };

    const createNewProject = async () => {
        try {
            const response = await createProject({
                organizationId: reduxSelectedOrganizationId,
                projectName: `Новый проект №${maxProjectNumber}`,
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
            channel.postMessage({
                type: "projectCreated",
                projectId: response?.id
            });
            setSelectionUI(null);
        } catch (error) {
            console.error("Ошибка при создании проекта:", error);
        }
    };

    const copySelectedText = async () => {
        if (!selectionUI?.text) return;

        await navigator.clipboard.writeText(selectionUI.text);
        setSelectionUI(null);
    };

    return (
        <div className={classes.main}>
            <fieldset className={classes.frame}>
                <legend className={classes.title}>Стратегия</legend>

                <div
                    ref={editorWrapperRef}
                    className={classes.editorWrapper}
                    onMouseUp={handleMouseUp}
                >
                    <MDXEditor
                        markdown={currentStrategy.content}
                    />
                </div>
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
