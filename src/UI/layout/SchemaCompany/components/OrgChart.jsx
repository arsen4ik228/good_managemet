import React, { useMemo } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import {buildTree, layoutTree} from "../function/helper";

export default function OrgChart({ data }) {
    const { nodes, edges } = useMemo(() => {
        const tree = buildTree(data);
        return layoutTree(tree);
    }, [data]);

    return (
        <div style={{ width: "100vw", height: "100vh" }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                fitView
                minZoom={0.05}
                maxZoom={2}
            >
                <Controls />
                <Background />
            </ReactFlow>
        </div>
    );
}