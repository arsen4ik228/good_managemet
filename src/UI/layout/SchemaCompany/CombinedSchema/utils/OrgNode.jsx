import React from 'react';
import { Handle, Position } from 'reactflow';
import classes from './OrgNode.module.css';

export default function OrgNode({ data }) {
    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#CCCCCC', width: 10, height: 10, top: -5 }}
            />
            <div className={classes.card}>
                <span className={classes.label}>{data.label}</span>
            </div>
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: '#CCCCCC', width: 10, height: 10, bottom: -5 }}
            />
        </>
    );
}
