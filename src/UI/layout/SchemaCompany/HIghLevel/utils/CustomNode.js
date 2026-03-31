import React from 'react';
import { Handle, Position } from 'reactflow';

export default function CustomNode({ data }) {
    return (
        <div style={{
            padding: "12px 16px",
            border: "2px solid #CCCCCC",
            borderRadius: 8,
            background: "#CCCCCC",
            minWidth: 200,
            textAlign: "center",
            position: 'relative'
        }}>
            {/* Входящая линия */}
            <Handle
                type="target"
                position={Position.Top}
            />

            {data.label}

            {/* Исходящая линия */}
            <Handle
                type="source"
                position={Position.Bottom}
            />
        </div>
    );
}