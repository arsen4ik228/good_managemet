import React, { useMemo, useCallback, useState, useRef } from "react";
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    useReactFlow,
    ReactFlowProvider
} from "reactflow";
import "reactflow/dist/style.css";
import { useNavigate } from "react-router-dom";
import { buildTree, layoutTree } from "../utils/treeLayout";
import styles from "./OrgChart.module.css";
import {nodeTypes} from '../utils/CustomNode.js'

// Добавьте в начало файла после импортов
// const nodeTypes = {
//     custom: ({ data }) => (
//         <div style={{
//             backgroundColor: '#CCCCCC',
//             border: '2px solid #b3b3b3',
//             borderRadius: '8px',
//             padding: '10px 15px',
//             cursor: 'pointer',
//             fontSize: '14px',
//             fontWeight: '500',
//             color: '#000000',
//             boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
//             transition: 'all 0.2s ease'
//         }}>
//             {data.label}
//         </div>
//     )
// };


// Внутренний компонент, который будет использовать хуки React Flow
function OrgChartContent({ data, isLoading, isError }) {
    const navigate = useNavigate();
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const { fitView, getZoom, setViewport, getViewport } = useReactFlow();

    const [currentZoom, setCurrentZoom] = useState(1);
    const containerRef = useRef(null);
    const reactFlowWrapper = useRef(null);

    // Обработчик клика по узлу
    const onNodeClick = useCallback((event, node) => {
        const organizationId = node.id;
        const organizationName = node.data.label;

        console.log(`Переход к организации: ${organizationName} (ID: ${organizationId})`);
        navigate(`/structure/${organizationId}`);
    }, [navigate]);

    // Обработчики для кастомных кнопок с фиксированными значениями масштаба
    const handleZoomIn = useCallback(() => {
        setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 300 });
        setCurrentZoom(1);
    }, [setViewport]);

    const handleZoomOut = useCallback(() => {
        setViewport({ x: 0, y: 0, zoom: 0.11 }, { duration: 300 });
        setCurrentZoom(0.11);
    }, [setViewport]);

    const handleFitView = useCallback(() => {
        fitView({ duration: 300, padding: 0.2 });
    }, [fitView]);

    // Функция для масштабирования относительно курсора
    const zoomToPoint = useCallback((targetZoom, clientX, clientY) => {
        if (!reactFlowWrapper.current) return;

        const currentZoom = getZoom();
        if (Math.abs(currentZoom - targetZoom) < 0.01) return;

        // Получаем bounding rectangle контейнера React Flow
        const bounds = reactFlowWrapper.current.getBoundingClientRect();
        
        // Вычисляем позицию курсора относительно контейнера (в px)
        const x = clientX - bounds.left;
        const y = clientY - bounds.top;
        
        // Получаем текущий viewport
        const viewport = getViewport();
        
        // Вычисляем новую позицию viewport для масштабирования относительно курсора
        const newZoom = targetZoom;
        const zoomRatio = newZoom / currentZoom;
        
        const newX = viewport.x - (x - viewport.x) * (zoomRatio - 1);
        const newY = viewport.y - (y - viewport.y) * (zoomRatio - 1);
        
        // Применяем новый viewport
        setViewport({
            x: newX,
            y: newY,
            zoom: newZoom
        }, { duration: 200 });
        
        setCurrentZoom(newZoom);
    }, [getZoom, getViewport, setViewport]);

    // Обработчик колесика мыши
    const handleWheel = useCallback((event) => {
        event.preventDefault();

        const currentZoomValue = getZoom();
        const delta = event.deltaY > 0 ? -1 : 1;

        if (delta > 0) {
            // Увеличиваем до 100%
            if (currentZoomValue < 0.99) {
                zoomToPoint(1, event.clientX, event.clientY);
            }
        } else {
            // Уменьшаем до 11%
            if (currentZoomValue > 0.12) {
                zoomToPoint(0.11, event.clientX, event.clientY);
            }
        }
    }, [getZoom, zoomToPoint]);

    // Отслеживаем изменение масштаба для отображения текущего значения
    const onMove = useCallback(() => {
        const currentZoomValue = getZoom();
        setCurrentZoom(currentZoomValue);
    }, [getZoom]);

    useMemo(() => {
        if (data && data.length > 0) {
            try {
                const tree = buildTree(data);
                const { nodes: layoutNodes, edges: layoutEdges } = layoutTree(tree);

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
        <div
            className={styles.container}
            ref={containerRef}
            onWheel={handleWheel}
        >
            <div 
                ref={reactFlowWrapper} 
                style={{ width: '100%', height: '100%' }}
            >
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onNodeClick={onNodeClick}
                    onMove={onMove}
                    fitView
                    minZoom={0.11}
                    maxZoom={1}
                    attributionPosition="bottom-right"
                    nodesDraggable={false}
                    nodesConnectable={false}
                    elementsSelectable={false}
                    draggable={false}
                    selectNodesOnDrag={false}
                    nodesFocusable={false}
                    edgesFocusable={false}
                    zoomOnScroll={false}
                    zoomOnPinch={false}
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

            {/* Кастомные кнопки управления масштабом */}
            <div className={styles.customControls}>
                <button
                    onClick={handleZoomIn}
                    className={styles.controlButton}
                    title="Увеличить до 100%"
                >
                    +
                </button>
                <div className={styles.zoomLevel}>
                    {Math.round(currentZoom * 100)}%
                </div>
                <button
                    onClick={handleZoomOut}
                    className={styles.controlButton}
                    title="Уменьшить до 11%"
                >
                    -
                </button>
                <button
                    onClick={handleFitView}
                    className={styles.controlButton}
                    title="Центрировать"
                >
                    ⊡
                </button>
            </div>
        </div>
    );
}

// Основной компонент-обертка с ReactFlowProvider
export default function OrgChart(props) {
    return (
        <ReactFlowProvider>
            <OrgChartContent {...props} />
        </ReactFlowProvider>
    );
}