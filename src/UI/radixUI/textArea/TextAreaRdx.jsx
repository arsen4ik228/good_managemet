import React, { forwardRef } from "react";
import TextArea from "antd/es/input/TextArea";

const TextAreaRdx = forwardRef(({ style, value, onChange, ...props }, ref) => {
    return (
        <TextArea
            style={{
                resize: "none",
                border: "none",
                outline: "none",
                boxShadow: "none",
                ...style,
            }}
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            {...props}
        />
    );
});

export default TextAreaRdx;
