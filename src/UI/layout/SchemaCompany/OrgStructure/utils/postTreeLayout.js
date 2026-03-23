// utils/postTreeLayout.js

/**
 * Преобразование массива постов в дерево
 */
export function buildPostTree(posts) {
    if (!posts || !Array.isArray(posts)) {
        console.error('buildPostTree: posts is not an array', posts);
        return [];
    }

    const map = {};
    const roots = [];

    // Создаем мапу всех постов
    posts.forEach((post) => {
        map[post.id] = { 
            ...post, 
            children: []
        };
    });

    // Связываем детей с родителями
    posts.forEach((post) => {
        const currentNode = map[post.id];
        
        if (post.parentId && map[post.parentId]) {
            map[post.parentId].children.push(currentNode);
        } else if (!post.parentId) {
            roots.push(currentNode);
        }
    });

    return roots;
}

/**
 * Расчет ширины поддерева для постов
 */
function calculateSubtreeWidth(node, nodeWidth, nodeSpacing) {
    if (!node.children || node.children.length === 0) {
        return nodeWidth;
    }
    
    let totalWidth = 0;
    node.children.forEach(child => {
        totalWidth += calculateSubtreeWidth(child, nodeWidth, nodeSpacing);
    });
    
    totalWidth += (node.children.length - 1) * nodeSpacing;
    
    return totalWidth;
}

/**
 * Раскладка дерева постов
 */
export function layoutPostTree(tree) {
    const nodes = [];
    const edges = [];

    const levelHeight = 200;
    const nodeWidth = 280;
    const nodeHeight = 'auto';
    const nodeSpacing = 150;
    const horizontalMargin = 100;

    function positionNode(node, depth = 0, left = 0, right = 0) {
        if (!node) return null;

        const subtreeWidth = calculateSubtreeWidth(node, nodeWidth, nodeSpacing);
        
        let x = left + (subtreeWidth / 2);
        const y = depth * levelHeight;

        // Определяем, есть ли дочерние элементы
        const hasChildren = node.children && node.children.length > 0;
        
        // Формируем содержимое узла
        const user = node.user;
        const fullName = user ? 
            `${user.lastName || ''} ${user.firstName || ''} ${user.middleName || ''}`.trim() 
            : null;
        
        // Создаем HTML-контент для узла
        const nodeContent = `
            <div style="
                display: flex;
                flex-direction: column;
                gap: 8px;
                width: 100%;
            ">
                <!-- Название должности -->
                <div style="
                    font-weight: 600;
                    font-size: 14px;
                    border-bottom: 1px solid #CCCCCC;
                    padding-bottom: 6px;
                ">
                    ${node.postName || 'Без названия'}
                </div>
                
                <!-- Информация о сотруднике -->
                ${user ? `
                    <div style="
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin-top: 4px;
                    ">
                        <div style="
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            overflow: hidden;
                            background: #CCCCCC;
                            flex-shrink: 0;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            ${user.avatar_url 
                                ? `<img src="${user.avatar_url}" style="width:100%;height:100%;object-fit:cover;" />` 
                                : `<span style="font-weight:bold;color:#666;">${fullName ? fullName.charAt(0) : '?'}</span>`
                            }
                        </div>
                        <div style="
                            flex:1;
                            min-width:0;
                        ">
                            <div style="
                                font-weight: 500;
                                font-size: 13px;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            ">
                                ${fullName || 'Нет сотрудника'}
                            </div>
                            ${user.telephoneNumber ? `
                                <div style="
                                    font-size: 11px;
                                    color: #666;
                                ">
                                    ${user.telephoneNumber}
                                </div>
                            ` : ''}
                            ${user.isFired ? `
                                <div style="
                                    display: inline-block;
                                    font-size: 10px;
                                    padding: 2px 6px;
                                    background: #ff4444;
                                    color: white;
                                    border-radius: 4px;
                                    margin-top: 4px;
                                ">
                                    Уволен
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : `
                    <div style="
                        padding: 8px;
                        background: #f5f5f5;
                        border-radius: 4px;
                        font-size: 12px;
                        color: #999;
                        text-align: center;
                    ">
                        Нет сотрудника
                    </div>
                `}
                
                <!-- Информация о подразделении (для узлов с детьми) -->
                ${hasChildren && node.divisionName ? `
                    <div style="
                        margin-top: 8px;
                        padding-top: 8px;
                        border-top: 1px dashed #CCCCCC;
                        font-size: 12px;
                        color: #333;
                    ">
                        <div style="font-weight: 500; margin-bottom: 4px;">Подразделение:</div>
                        <div>${node.divisionName} ${node.divisionNumber ? `№${node.divisionNumber}` : ''}</div>
                    </div>
                ` : ''}
                
                <!-- Информация о подразделении (для листовых узлов, если есть) -->
                ${!hasChildren && node.divisionName ? `
                    <div style="
                        font-size: 11px;
                        color: #666;
                        margin-top: 4px;
                    ">
                        ${node.divisionName} ${node.divisionNumber ? `№${node.divisionNumber}` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        const currentNode = {
            id: String(node.id),
            position: { x, y },
            data: { 
                label: node.postName || 'Без названия',
                original: node,
                content: nodeContent,
                hasChildren // добавляем флаг для возможного использования в стилях
            },
            style: {
                padding: "12px",
                border: `2px solid ${user?.isFired ? '#ff4444' : '#CCCCCC'}`,
                borderRadius: 10,
                background: "#FFFFFF",
                width: nodeWidth,
                minHeight: nodeHeight,
                fontSize: 13,
                color: "#000000",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                // Добавляем левую границу для узлов с детьми
                ...(hasChildren && {
                    borderLeft: `4px solid #4CAF50`,
                    borderTop: `2px solid #CCCCCC`,
                    borderRight: `2px solid #CCCCCC`,
                    borderBottom: `2px solid #CCCCCC`,
                })
            },
        };
        
        nodes.push(currentNode);

        let childLeft = left;
        
        if (node.children && node.children.length > 0) {
            node.children.forEach((child, index) => {
                if (!child) return;
                
                const childWidth = calculateSubtreeWidth(child, nodeWidth, nodeSpacing);
                
                positionNode(child, depth + 1, childLeft, childLeft + childWidth);
                
                childLeft += childWidth + nodeSpacing;
                
                edges.push({
                    id: `${node.id}-${child.id}`,
                    source: String(node.id),
                    target: String(child.id),
                    type: "step",
                    animated: false,
                    style: { 
                        stroke: "#CCCCCC", 
                        strokeWidth: 3,
                    },
                });
            });
        }

        return currentNode;
    }

    if (tree && tree.length > 0) {
        let globalLeft = horizontalMargin;
        
        tree.forEach((root, index) => {
            if (!root) return;
            
            const rootWidth = calculateSubtreeWidth(root, nodeWidth, nodeSpacing);
            positionNode(root, 0, globalLeft, globalLeft + rootWidth);
            globalLeft += rootWidth + nodeSpacing * 2;
        });
    }

    return { nodes, edges };
}