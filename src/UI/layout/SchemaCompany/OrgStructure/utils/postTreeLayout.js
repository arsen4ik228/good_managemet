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
    width: 100%;
    height: 100%;
    gap: 16px;
    align-items: stretch;
    background: #ffffff;
    border-radius: 24px;
    padding: 16px;
    box-sizing: border-box;
">
    <!-- Левая часть: круглая фотография на всю высоту -->
    <div style="
        width: 96px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    ">
        ${(() => {
            // Имя и фамилия для инициалов (если есть fullName)
            let initials = '';
            const fullNameForAvatar = fullName || (user ? (user.name || '') : '');
            if (fullNameForAvatar) {
                const nameParts = fullNameForAvatar.trim().split(' ');
                if (nameParts.length >= 2) {
                    initials = nameParts[0].charAt(0) + nameParts[1].charAt(0);
                } else if (nameParts.length === 1) {
                    initials = nameParts[0].charAt(0);
                } else {
                    initials = '?';
                }
            } else {
                initials = '?';
            }
            
            // Проверяем, есть ли пользователь и не уволен ли
            const hasValidUser = user && !user.isFired;
            
            if (hasValidUser && user.avatar_url) {
                // Если есть аватарка — показываем её в круге
                return `
                    <div style="
                        width: 100%;
                        aspect-ratio: 1 / 1;
                        border-radius: 50%;
                        overflow: hidden;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    ">
                        <img src="${user.avatar_url}" style="width:100%;height:100%;object-fit:cover;" alt="avatar" />
                    </div>
                `;
            } else if (hasValidUser) {
                // Нет аватарки, но есть пользователь — показываем инициалы в круге
                return `
                    <div style="
                        width: 100%;
                        aspect-ratio: 1 / 1;
                        border-radius: 50%;
                        background: linear-gradient(135deg, #2C5F8A 0%, #1A3B50 100%);
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                    ">
                        <span style="font-weight: 600; font-size: 28px; color: white; text-transform: uppercase;">${initials}</span>
                    </div>
                `;
            } else {
                // Нет пользователя или уволен — показываем заглушку
                const icon = (user && user.isFired) ? '⚠️' : '🏢';
                const bgColor = (user && user.isFired) ? '#ffebee' : '#f5f5f5';
                const iconColor = (user && user.isFired) ? '#ff4444' : '#aaa';
                return `
                    <div style="
                        width: 100%;
                        aspect-ratio: 1 / 1;
                        border-radius: 50%;
                        background: ${bgColor};
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    ">
                        <span style="font-size: 32px; color: ${iconColor};">${icon}</span>
                    </div>
                `;
            }
        })()}
    </div>
    
    <!-- Правая часть: текстовый блок -->
    <div style="
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        min-width: 0;
        gap: 8px;
    ">
        <!-- Название компании / подразделения -->
        ${(node.divisionName || node.companyName) ? `
            <div style="
                font-weight: 800;
                font-size: 20px;
                color: #1A2C3E;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                letter-spacing: -0.3px;
            ">
                ${node.companyName || node.divisionName} ${node.divisionNumber ? `№${node.divisionNumber}` : ''}
            </div>
        ` : ''}
        
        <!-- Должность -->
        ${node.postName ? `
            <div style="
                font-weight: 500;
                font-size: 13px;
                color: #5C7A92;
                text-transform: uppercase;
                letter-spacing: 1.5px;
            ">
                ${node.postName}
            </div>
        ` : ''}
        
        <!-- Имя сотрудника (директор) -->
        ${user ? `
            <div style="
                font-weight: 700;
                font-size: 22px;
                color: #1F3B4C;
                line-height: 1.2;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                ${user.isFired ? 'text-decoration: line-through; opacity: 0.6;' : ''}
            ">
                ${fullName || (user.name) || 'Алексей Начёсов'}
            </div>
        ` : `
            <div style="
                font-weight: 700;
                font-size: 22px;
                color: #1F3B4C;
            ">
                Алексей Начёсов
            </div>
        `}
        
        <!-- Декоративная линия -->
        <div style="
            width: 50px;
            height: 3px;
            background: #C0CFDE;
            border-radius: 2px;
            margin: 6px 0 4px 0;
        "></div>
        
        <!-- Дополнительный текст (телефон, статус, описание) -->
        ${user && user.telephoneNumber ? `
            <div style="
                font-size: 12px;
                color: #6F8FAA;
                margin-top: 4px;
                display: flex;
                align-items: center;
                gap: 6px;
            ">
                <span>📞</span> ${user.telephoneNumber}
            </div>
        ` : ''}
        
        ${user && user.isFired ? `
            <div style="
                display: inline-block;
                font-size: 10px;
                padding: 4px 10px;
                background: #ff4444;
                color: white;
                border-radius: 20px;
                margin-top: 6px;
                width: fit-content;
                font-weight: 500;
            ">
                Уволен
            </div>
        ` : ''}
        
        <!-- Если нет user и нет подразделения, показываем заглушку -->
        ${!user && !node.divisionName ? `
            <div style="
                font-size: 12px;
                color: #999;
                margin-top: 4px;
            ">
                Данные отсутствуют
            </div>
        ` : ''}
    </div>
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