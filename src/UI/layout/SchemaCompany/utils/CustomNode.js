// components/CustomNode.jsx
import React from 'react';
import { Handle } from 'reactflow';

export default function CustomNode({ data }) {
    return (
        <div style={{
            padding: "12px 16px",
            border: "2px solid #CCCCCC",
            borderRadius: 8,
            background: "#CCCCCC",
            minWidth: 200,
            textAlign: "center",
            fontSize: 13,
            fontWeight: 500,
            color: "#000000",
            boxShadow: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            wordBreak: "break-word",
            lineHeight: 1.4,
            letterSpacing: "0.2px",
        }}>
            {data.label}
            {/* Убираем Handle полностью или делаем невидимыми */}
        </div>
    );
}