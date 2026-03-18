import React, { useMemo, useCallback } from "react";
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap,
    useNodesState,
    useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import { buildTree, layoutTree } from "../utils/treeLayout";
import styles from "./OrgChart.module.css";
import schema_background from '@image/schema_background.svg'

export default function OrgChart({ data, isLoading, isError }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const onNodeClick = useCallback((event, node) => {
        console.log("Clicked node:", node.data.original);
    }, []);

    useMemo(() => {
        if (data && data.length > 0) {
            try {
                const tree = buildTree(data);
                const { nodes: layoutNodes, edges: layoutEdges } = layoutTree(tree);
                
                // Убираем стрелочки, оставляем только линии
                const edgesWithoutMarkers = layoutEdges.map(edge => ({
                    ...edge,
                    markerEnd: undefined,
                }));
                
                setNodes(layoutNodes);
                setEdges(edgesWithoutMarkers);
            } catch (error) {
                console.error("Error building tree:", error);
            }
        } else {
            setNodes([]);
            setEdges([]);
        }
    }, [data, setNodes, setEdges]);

    if (isLoading) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.loader}>Загрузка структуры компании...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.error}>
                    Ошибка при загрузке данных. Пожалуйста, обновите страницу.
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.empty}>
                    Нет данных для отображения структуры компании
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                fitView
                minZoom={0.1}
                maxZoom={1.5}
                attributionPosition="bottom-right"
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}        // Изменено: элементы нельзя выделять
                draggable={false}
                selectNodesOnDrag={false}
                nodesFocusable={false}             // Изменено: узлы нельзя фокусировать
                edgesFocusable={false}
                defaultEdgeOptions={{
                    type: 'step',
                    style: { stroke: '#CCCCCC', strokeWidth: 5 },
                }}
                // Отключаем порты (черные точки)
                nodeOrigin={[0.5, 0.5]}
            >
                <Controls 
                    showZoom={true}
                    showFitView={true}
                    showInteractive={false}        // Скрываем кнопку интерактивного режима
                />
                <MiniMap 
                    nodeColor="#CCCCCC"
                    maskColor="rgba(0, 0, 0, 0.05)"
                    style={{ backgroundColor: "#f5f5f5" }}
                />
                <Background 
                    color="#CCCCCC"
                    gap={16}
                    size={1}
                    variant="dots"
                />
            </ReactFlow>
        </div>
    );
}