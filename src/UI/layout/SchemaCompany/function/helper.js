/**
 * Преобразование массива в дерево
 */
export function buildTree(data) {
    const map = {};
    const roots = [];

    data.forEach((item) => {
        map[item.id] = { ...item, children: [] };
    });

    data.forEach((item) => {
        if (item.parentOrganizationId) {
            map[item.parentOrganizationId]?.children.push(map[item.id]);
        } else {
            roots.push(map[item.id]);
        }
    });

    return roots;
}

/**
 * Раскладка дерева (очень простая, но работает)
 */

/**
 * Раскладка дерева с центром корня и прямыми линиями
 */

export function layoutTree(tree) {
    const nodes = [];
    const edges = [];

    const levelHeight = 150; // вертикальный отступ между уровнями
    const nodeWidth = 150;
    const nodeSpacing = 50; // горизонтальный отступ между соседними узлами

    function traverse(node, depth = 0, xStart = 0) {
        // сначала раскладываем детей и получаем ширину поддерева
        let subtreeWidth = 0;
        const childrenWidths = [];

        node.children.forEach((child) => {
            const childWidth = traverse(child, depth + 1, xStart + subtreeWidth);
            childrenWidths.push(childWidth);
            subtreeWidth += childWidth + nodeSpacing;
        });

        // если нет детей, ширина поддерева = ширина узла
        if (subtreeWidth === 0) {
            subtreeWidth = nodeWidth;
        } else {
            subtreeWidth -= nodeSpacing; // убираем лишний отступ после последнего ребенка
        }

        // позиционирование узла: по центру над детьми
        let x;
        if (node.children.length > 0) {
            const firstChildX = nodes.find(n => n.id === node.children[0].id).position.x;
            const lastChildX = nodes.find(n => n.id === node.children[node.children.length - 1].id).position.x;
            x = (firstChildX + lastChildX) / 2;
        } else {
            x = xStart;
        }
        const y = depth * levelHeight;

        nodes.push({
            id: node.id,
            position: { x, y },
            data: { label: node.organizationName },
            style: {
                padding: 10,
                border: "1px solid #999",
                borderRadius: 8,
                background: "#fff",
                width: nodeWidth,
                textAlign: "center",
                fontSize: 12,
            },
        });

        // создаем ребра
        node.children.forEach((child) => {
            edges.push({
                id: `${node.id}-${child.id}`,
                source: node.id,
                target: child.id,
                type: "straight", // прямые линии
            });
        });

        return subtreeWidth;
    }

    tree.forEach((root) => traverse(root));

    return { nodes, edges };
}

// export function layoutTree(tree) {
//     const nodes = [];
//     const edges = [];
//
//     let xOffset = 0;
//
//     function traverse(node, depth = 0) {
//         const x = xOffset * 200;
//         const y = depth * 150;
//
//         nodes.push({
//             id: node.id,
//             position: { x, y },
//             data: { label: node.organizationName },
//             style: {
//                 padding: 10,
//                 border: "1px solid #999",
//                 borderRadius: 8,
//                 background: "#fff",
//                 width: 150,
//                 textAlign: "center",
//                 fontSize: 12,
//             },
//         });
//
//         if (node.children.length === 0) {
//             xOffset++;
//         }
//
//         node.children.forEach((child) => {
//             edges.push({
//                 id: `${node.id}-${child.id}`,
//                 source: node.id,
//                 target: child.id,
//             });
//
//             traverse(child, depth + 1);
//         });
//     }
//
//     tree.forEach((root) => traverse(root));
//
//     return { nodes, edges };
// }