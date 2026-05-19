export function buildTree(data) {
    const orgMap = {};
    const roots = [];

    data.forEach((item) => {
        orgMap[item.id] = { ...item, type: 'organization', children: [] };
    });

    data.forEach((item) => {
        if (item.parentOrganizationId && orgMap[item.parentOrganizationId]) {
            orgMap[item.parentOrganizationId]._childOrganizations =
                orgMap[item.parentOrganizationId]._childOrganizations || [];
            orgMap[item.parentOrganizationId]._childOrganizations.push(orgMap[item.id]);
        } else if (!item.parentOrganizationId) {
            roots.push(orgMap[item.id]);
        }
    });

    Object.values(orgMap).forEach(org => {
        org.children = buildPostsTree(org.posts || [], org.id);
    });

    return roots;
}

function buildPostsTree(posts, organizationId) {
    if (!posts || posts.length === 0) return [];

    const postsMap = {};
    const postRoots = [];

    posts.forEach(post => {
        postsMap[post.id] = { ...post, type: 'post', organizationId, children: [] };
    });

    posts.forEach(post => {
        if (post.parentId && postsMap[post.parentId]) {
            postsMap[post.parentId].children.push(postsMap[post.id]);
        } else if (!post.parentId) {
            postRoots.push(postsMap[post.id]);
        }
    });

    return postRoots;
}

function calculateTotalWidth(node, nodeWidth, nodeSpacing) {
    if (node.type === 'post') {
        if (!node.children || node.children.length === 0) return nodeWidth;

        let totalWidth = 0;
        node.children.forEach(child => {
            totalWidth += calculateTotalWidth(child, nodeWidth, nodeSpacing);
        });
        totalWidth += (node.children.length - 1) * nodeSpacing;
        return Math.max(totalWidth, nodeWidth);
    }

    let postsWidth = nodeWidth;
    if (node.children && node.children.length > 0) {
        postsWidth = 0;
        node.children.forEach(child => {
            postsWidth += calculateTotalWidth(child, nodeWidth, nodeSpacing);
        });
        postsWidth += (node.children.length - 1) * nodeSpacing;
        postsWidth = Math.max(postsWidth, nodeWidth);
    }

    let orgsWidth = 0;
    if (node._childOrganizations && node._childOrganizations.length > 0) {
        node._childOrganizations.forEach(org => {
            orgsWidth += calculateTotalWidth(org, nodeWidth, nodeSpacing);
        });
        orgsWidth += (node._childOrganizations.length - 1) * nodeSpacing * 2;
    }

    return Math.max(postsWidth, orgsWidth, nodeWidth);
}

export function layoutTree(tree) {
    const nodes = [];
    const edges = [];

    const levelHeight = 180;
    const nodeWidth = 300;
    const nodeHeight = 90;
    const nodeSpacing = 100;
    const horizontalMargin = 50;

    function positionNode(node, depth, left) {
        const totalWidth = calculateTotalWidth(node, nodeWidth, nodeSpacing);
        const x = left + totalWidth / 2;
        const y = depth * levelHeight;
        const isPost = node.type === 'post';

        const nodeData = {
            id: String(node.id),
            type: 'card',
            position: { x, y },
            data: isPost ? getPostNodeData(node) : getOrgNodeData(node),
            style: { width: nodeWidth, minHeight: nodeHeight },
        };

        nodes.push(nodeData);

        let maxDepthReached = depth;

        if (node.children && node.children.length > 0) {
            let childrenWidth = 0;
            node.children.forEach(child => {
                childrenWidth += calculateTotalWidth(child, nodeWidth, nodeSpacing);
            });
            childrenWidth += (node.children.length - 1) * nodeSpacing;

            let childLeft = x - childrenWidth / 2;

            node.children.forEach((child) => {
                const childWidth = calculateTotalWidth(child, nodeWidth, nodeSpacing);
                const childResult = positionNode(child, depth + 1, childLeft);
                maxDepthReached = Math.max(maxDepthReached, childResult.depth);
                childLeft += childWidth + nodeSpacing;

                edges.push({
                    id: `cb-${node.id}-${child.id}`,
                    source: String(node.id),
                    target: String(child.id),
                    type: 'step',
                    animated: false,
                    style: { stroke: '#CCCCCC', strokeWidth: 5 },
                });
            });
        }

        if (node.type === 'organization' && node._childOrganizations?.length > 0) {
            const orgsDepth = maxDepthReached + 1;

            let totalOrgsWidth = 0;
            node._childOrganizations.forEach(org => {
                totalOrgsWidth += calculateTotalWidth(org, nodeWidth, nodeSpacing);
            });
            totalOrgsWidth += (node._childOrganizations.length - 1) * nodeSpacing * 2;

            let orgsLeft = x - totalOrgsWidth / 2;

            node._childOrganizations.forEach((org) => {
                const orgWidth = calculateTotalWidth(org, nodeWidth, nodeSpacing);
                positionNode(org, orgsDepth, orgsLeft);
                orgsLeft += orgWidth + nodeSpacing * 2;

                edges.push({
                    id: `cb-${node.id}-${org.id}`,
                    source: String(node.id),
                    target: String(org.id),
                    type: 'step',
                    animated: false,
                    style: { stroke: '#CCCCCC', strokeWidth: 5 },
                });
            });
        }

        return { ...nodeData, depth: maxDepthReached };
    }

    let globalLeft = horizontalMargin;
    tree.forEach((root) => {
        const rootWidth = calculateTotalWidth(root, nodeWidth, nodeSpacing);
        positionNode(root, 0, globalLeft);
        globalLeft += rootWidth + nodeSpacing * 3;
    });

    return { nodes, edges };
}

function getOrgNodeData(org) {
    const topPost = org.posts?.find(p => !p.parentId) || org.posts?.[0];
    return {
        label: org.organizationName || 'Без названия',
        userName: topPost?.user
            ? `${topPost.user.firstName || ''} ${topPost.user.secondName || ''}`.trim()
            : null,
        postName: topPost?.postName || null,
        avatarUrl: topPost?.user?.avatar_url || null,
        postId: topPost?.id || null,
        isOrganization: true,
        original: org,
    };
}

function getPostNodeData(post) {
    return {
        label: post.postName || 'Без названия',
        userName: post.user
            ? `${post.user.firstName || ''} ${post.user.secondName || ''}`.trim()
            : null,
        postName: post.postName || null,
        avatarUrl: post.user?.avatar_url || null,
        postId: post.id || null,
        isOrganization: false,
        original: post,
    };
}

export function filterTreeByDepth(tree, maxDepth) {
    if (!tree || tree.length === 0) return [];

    function filterPosts(postNode, currentDepth) {
        const filtered = { ...postNode };
        if (currentDepth > maxDepth - 1) {
            filtered.children = [];
            return filtered;
        }
        if (postNode.children && postNode.children.length > 0) {
            filtered.children = postNode.children.map(child => filterPosts(child, currentDepth + 1));
        } else {
            filtered.children = [];
        }
        return filtered;
    }

    function filterNode(node) {
        const filtered = { ...node };

        if (maxDepth === 1) {
            filtered.children = [];
        } else {
            if (node.children && node.children.length > 0) {
                filtered.children = node.children.map(post => filterPosts(post, 1));
            } else {
                filtered.children = [];
            }
        }

        if (node._childOrganizations?.length > 0) {
            filtered._childOrganizations = node._childOrganizations.map(org => filterNode(org));
        }

        return filtered;
    }

    return tree.map(root => filterNode(root));
}

export function getMaxAvailableDepth(tree) {
    let maxDepth = 0;

    function traversePosts(post, depth) {
        maxDepth = Math.max(maxDepth, depth);
        if (post.children?.length > 0) {
            post.children.forEach(child => traversePosts(child, depth + 1));
        }
    }

    function traverseOrgs(org) {
        if (org.children?.length > 0) {
            org.children.forEach(post => traversePosts(post, 1));
        }
        if (org._childOrganizations?.length > 0) {
            org._childOrganizations.forEach(childOrg => traverseOrgs(childOrg));
        }
    }

    tree.forEach(root => traverseOrgs(root));

    return maxDepth + 1;
}
