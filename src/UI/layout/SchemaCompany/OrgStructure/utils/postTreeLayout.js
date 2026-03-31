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
 * Вспомогательная функция для получения инициалов
 */
function getInitials(name) {
    if (!name) return '?';
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
        return nameParts[0].charAt(0) + nameParts[1].charAt(0);
    } else if (nameParts.length === 1) {
        return nameParts[0].charAt(0);
    }
    return '?';
}

/**
 * Раскладка дерева постов - теперь возвращает только данные и позиции
 */
export function layoutPostTree(tree) {
    const nodes = [];
    const edges = [];

    const levelHeight = 200;      // Высота между уровнями
    const nodeWidth = 280;        // Ширина узла
    const nodeHeight = 'auto';    // Высота узла
    const nodeSpacing = 150;      // Расстояние между узлами
    const horizontalMargin = 100; // Отступ от края

    function positionNode(node, depth = 0, left = 0, right = 0) {
        if (!node) return null;

        // Рассчитываем ширину поддерева
        const subtreeWidth = calculateSubtreeWidth(node, nodeWidth, nodeSpacing);

        // Вычисляем позицию X и Y
        let x = left + (subtreeWidth / 2);
        const y = depth * levelHeight;

        // Проверяем наличие дочерних элементов
        const hasChildren = node.children && node.children.length > 0;

        // Получаем данные пользователя
        const user = node.user;
        const fullName = user ?
            `${user.lastName || ''} ${user.firstName || ''} ${user.middleName || ''}`.trim()
            : null;

        // Формируем данные для узла (без HTML!)
        const currentNode = {
            id: String(node.id),
            position: { x, y },
            data: {
                label: node.postName || 'Без названия',
                original: node,
                // Все необходимые данные для компонента
                nodeData: {
                    id: node.id,
                    postName: node.postName,
                    divisionName: node.divisionName,
                    companyName: node.companyName,
                    divisionNumber: node.divisionNumber,
                    hasChildren,
                    user: {
                        fullName: fullName,
                        name: user?.name,
                        initials: getInitials(fullName || (user?.name || '')),
                        isFired: user?.isFired || false,
                        avatarUrl: user?.avatar_url,
                        telephoneNumber: user?.telephoneNumber
                    }
                }
            },
            // Стили для узла
            style: {
                padding: "0",
                border: `2px solid ${user?.isFired ? '#ff4444' : '#CCCCCC'}`,
                borderRadius: 10,
                background: "#FFFFFF",
                width: nodeWidth,
                minHeight: nodeHeight,
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                // Если есть дети, добавляем зеленую левую границу
                ...(hasChildren && {
                    borderLeft: `4px solid #4CAF50`,
                    borderTop: `2px solid #CCCCCC`,
                    borderRight: `2px solid #CCCCCC`,
                    borderBottom: `2px solid #CCCCCC`,
                })
            },
        };

        nodes.push(currentNode);

        // Рекурсивно обрабатываем детей
        let childLeft = left;

        if (node.children && node.children.length > 0) {
            node.children.forEach((child) => {
                if (!child) return;

                const childWidth = calculateSubtreeWidth(child, nodeWidth, nodeSpacing);

                positionNode(child, depth + 1, childLeft, childLeft + childWidth);

                childLeft += childWidth + nodeSpacing;

                // Добавляем связь (ребро) между родителем и ребенком
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

    // Раскладываем все корневые узлы
    if (tree && tree.length > 0) {
        let globalLeft = horizontalMargin;

        tree.forEach((root) => {
            if (!root) return;

            const rootWidth = calculateSubtreeWidth(root, nodeWidth, nodeSpacing);
            positionNode(root, 0, globalLeft, globalLeft + rootWidth);
            globalLeft += rootWidth + nodeSpacing * 2;
        });
    }

    return { nodes, edges };
}