// PostOrgChart.jsx (исправленная версия)

import React, { useMemo, useCallback, useEffect } from "react";
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap,
    useNodesState,
    useEdgesState
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
import styles from "./PostOrgChart.module.css";
import { buildPostTree, layoutPostTree } from "./utils/postTreeLayout";

export default function PostOrgChart({ data, isLoading, isError, orgId }) {
    const navigate = useNavigate();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // Отладка входных данных
    useEffect(() => {
        console.log('PostOrgChart: получены данные', {
            data,
            isLoading,
            isError,
            orgId,
            dataLength: data?.length
        });
    }, [data, isLoading, isError, orgId]);

    const onNodeClick = useCallback((event, node) => {
        const postId = node.id;
        const postName = node.data.original?.postName;
        
        console.log(`Переход к посту: ${postName} (ID: ${postId})`);
        navigate(`/post/${postId}`);
    }, [navigate]);

    useMemo(() => {
        if (data && Array.isArray(data) && data.length > 0) {
            try {
                console.log('PostOrgChart: начинаем построение дерева');
                
                const tree = buildPostTree(data);
                console.log('PostOrgChart: построено дерево', tree);
                
                if (tree.length === 0) {
                    console.warn('PostOrgChart: дерево пустое');
                    setNodes([]);
                    setEdges([]);
                    return;
                }

                const { nodes: layoutNodes, edges: layoutEdges } = layoutPostTree(tree);
                console.log('PostOrgChart: получена раскладка', {
                    nodesCount: layoutNodes.length,
                    edgesCount: layoutEdges.length
                });
                
                // Кастомизируем отображение узлов с HTML-контентом
                const customNodes = layoutNodes.map(node => ({
                    ...node,
                    data: {
                        ...node.data,
                        label: <div dangerouslySetInnerHTML={{ __html: node.data.content }} />
                    }
                }));
                
                setNodes(customNodes);
                setEdges(layoutEdges);
                
                console.log('PostOrgChart: узлы установлены', customNodes.length);
            } catch (error) {
                console.error("Error building post tree:", error);
                setNodes([]);
                setEdges([]);
            }
        } else {
            console.log('PostOrgChart: нет данных для отображения', data);
            setNodes([]);
            setEdges([]);
        }
    }, [data, setNodes, setEdges]);

    if (isLoading) {
        return (
            <div className={styles.messageContainer}>
                <div className={styles.loader}>Загрузка структуры организации...</div>
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
                    Нет данных для отображения структуры
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
                elementsSelectable={false}
                draggable={false}
                selectNodesOnDrag={false}
                nodesFocusable={false}
                edgesFocusable={false}
                defaultEdgeOptions={{
                    type: 'step',
                    style: { stroke: '#CCCCCC', strokeWidth: 3 },
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