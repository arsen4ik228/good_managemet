import React, { useMemo, useCallback } from "react";
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap,
    useNodesState,
    useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom"; // добавляем для навигации
import { buildTree, layoutTree } from "../utils/treeLayout";
import styles from "./OrgChart.module.css";

export default function OrgChart({ data, isLoading, isError }) {
    const navigate = useNavigate(); // хук для навигации
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Обработчик клика по узлу
    const onNodeClick = useCallback((event, node) => {
        const organizationId = node.id; // или node.data.original.id, если id хранится там
        const organizationName = node.data.label;
        
        console.log(`Переход к организации: ${organizationName} (ID: ${organizationId})`);
        
        // Переход на страницу организации
        navigate(`/structure/${organizationId}`);
        
        // Альтернатива: если используете строку запроса
        // navigate(`/organization?id=${organizationId}`);
    }, [navigate]);

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
                onNodeClick={onNodeClick} // обработчик клика
                fitView
                minZoom={0.1}
                maxZoom={1.5}
                attributionPosition="bottom-right"
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                draggable={false}
                selectNodesOnDrag={false}
                nodesFocusable={false}
                edgesFocusable={false}
                defaultEdgeOptions={{
                    type: 'step',
                    style: { stroke: '#CCCCCC', strokeWidth: 5 },
                }}
                nodeOrigin={[0.5, 0.5]}
            >
                <Controls 
                    showZoom={true}
                    showFitView={true}
                    showInteractive={false}
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