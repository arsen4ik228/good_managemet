
import TextArea from 'antd/es/input/TextArea';
import classes from "./EditStrategy.module.css"

export function EditStrategy({
    currentStrategy,
    setEditorState,
    handleEditorChange,
    editorState,
    contentEditors,
    situationEditors,
    rootCauseEditors,
    editMode }) {

    return (
        <div className={classes.main}>
            <fieldset className={classes.frame}>
                <legend className={classes.title}>Ситуация</legend>
                {situationEditors.map((item, index) => (
                    <TextArea
                        style={{
                            resize: "none",
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                        }}
                        value={item}
                        onChange={(e) =>
                            handleEditorChange(index, e.target.value, "situation")
                        }
                        readOnly={!editMode}
                        autoSize={true}
                    ></TextArea>
                ))}
            </fieldset>


            <fieldset className={classes.frame}>
                <legend className={classes.title}>Причина</legend>
                {rootCauseEditors.map((item, index) => (
                    <TextArea
                         style={{
                            resize: "none",
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                        }}
                        value={item}
                        onChange={(e) =>
                            handleEditorChange(index, e.target.value, "rootCause")
                        }
                        readOnly={!editMode}
                        autoSize={true}
                    ></TextArea>
                ))}
            </fieldset>


            <fieldset className={classes.frame} style={{
                padding: "25px",

                display: "flex",
                flexDirection: "column",
                alignItems: "center",

                gap: "25px",
            }}>
                <legend className={classes.title}>Краткосрочная цель</legend>

                <fieldset className={classes.childFrame}>
                    <legend className={classes.title} style={{
                        textTransform: "lowercase"
                    }}>из ситуации</legend>

                    <TextArea
                        style={{
                            resize: "none",
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                        }}
                        value={contentEditors[0]}
                        onChange={(e) =>
                            handleEditorChange(0, e.target.value, "content")
                        }
                        readOnly={!editMode}
                        autoSize={true}
                    ></TextArea>
                </fieldset>

                <fieldset className={classes.childFrame} >
                    <legend className={classes.title} style={{
                        textTransform: "lowercase"
                    }}>из цели</legend>
                    <TextArea
                         style={{
                            resize: "none",
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                        }}
                        value={contentEditors[1]}
                        onChange={(e) =>
                            handleEditorChange(1, e.target.value, "content")
                        }
                        readOnly={!editMode}
                        autoSize={true}
                    ></TextArea>
                </fieldset>

            </fieldset>

            <fieldset className={classes.frame}>
                <legend className={classes.title}>Стратегия</legend>
                <TextArea
                    style={{
                            resize: "none",
                            border: "none",
                            outline: "none",
                            boxShadow: "none",
                        }}
                    key={currentStrategy.id}
                    value={editorState}
                    onChange={(e) => setEditorState(e.target.value)}
                    readOnly={!editMode}
                    autoSize={true}
                ></TextArea>
            </fieldset>
        </div>
    )
}
