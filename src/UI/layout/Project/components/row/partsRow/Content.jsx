import { useEffect, useRef } from 'react';
import TextAreaRdx from '../../../../../radixUI/textArea/TextAreaRdx';
import s from './Content.module.css';

export default function Content({ content, onChange, addTarget, autoFocus }) {
    const textareaRef = useRef(null);

    useEffect(() => {
        if (autoFocus && textareaRef.current?.resizableTextArea?.textArea) {
            textareaRef.current.resizableTextArea.textArea.focus();
        }
    }, [autoFocus]);



    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            if (e.shiftKey) return;
            e.preventDefault();
            addTarget();
        }
    };

    return (
        <TextAreaRdx
            ref={textareaRef}
            className={s.content}
            style={{
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
            }}
            value={content}
            onChange={onChange}
            autoSize
            onKeyDown={handleKeyDown}
        />
    );
}
