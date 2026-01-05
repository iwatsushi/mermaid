/**
 * マインドマップエディター
 */
class MindmapEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.root = {
            text: 'Central Topic',
            children: []
        };

        this.templates = [
            { id: 'simple', name: 'シンプル' },
            { id: 'project', name: 'プロジェクト計画' },
            { id: 'brainstorm', name: 'ブレインストーミング' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.root = {
            text: 'メインテーマ',
            children: [
                {
                    text: 'トピック1',
                    children: [
                        { text: 'サブ1-1', children: [] },
                        { text: 'サブ1-2', children: [] }
                    ]
                },
                {
                    text: 'トピック2',
                    children: [
                        { text: 'サブ2-1', children: [] }
                    ]
                },
                {
                    text: 'トピック3',
                    children: []
                }
            ]
        };
    }

    render() {
        const container = document.createElement('div');

        // 注意メッセージ
        const warning = document.createElement('div');
        warning.className = 'alert alert-info alert-sm mb-3';
        warning.innerHTML = '<i class="bi bi-info-circle"></i> Mindmapは Mermaid v9.4.0 以降で利用可能です';
        container.appendChild(warning);

        // ルートノード
        container.appendChild(this.createSection('マインドマップ', 'bi-diagram-3', this.renderTree()));

        return container;
    }

    renderTree() {
        const wrapper = document.createElement('div');
        wrapper.className = 'tree-editor';

        const renderNode = (node, depth = 0, path = []) => {
            const nodeEl = document.createElement('div');
            nodeEl.style.paddingLeft = (depth * 20) + 'px';
            nodeEl.className = 'tree-node-item mb-1';

            const pathStr = path.join('-');

            nodeEl.innerHTML = `
                <span class="text-muted me-2" style="width:20px">${depth === 0 ? '<i class="bi bi-star-fill text-warning"></i>' : '<i class="bi bi-dash"></i>'}</span>
                <input type="text" class="form-control form-control-sm tree-node-input" value="${node.text}" data-path="${pathStr}" style="flex:1">
                <div class="tree-node-actions ms-2">
                    <button class="btn btn-sm btn-outline-primary add-child" data-path="${pathStr}" title="子を追加">
                        <i class="bi bi-plus"></i>
                    </button>
                    ${depth > 0 ? `
                        <button class="btn btn-sm btn-outline-danger delete-node" data-path="${pathStr}" title="削除">
                            <i class="bi bi-trash"></i>
                        </button>
                    ` : ''}
                </div>
            `;

            wrapper.appendChild(nodeEl);

            // 子ノードを再帰的にレンダリング
            node.children.forEach((child, index) => {
                renderNode(child, depth + 1, [...path, index]);
            });
        };

        renderNode(this.root, 0, []);

        // イベントリスナー
        setTimeout(() => {
            wrapper.querySelectorAll('.tree-node-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const path = e.target.dataset.path;
                    const node = this.getNodeByPath(path);
                    if (node) {
                        node.text = e.target.value;
                        this.onInputChange();
                    }
                });
            });

            wrapper.querySelectorAll('.add-child').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const path = e.currentTarget.dataset.path;
                    const node = this.getNodeByPath(path);
                    if (node) {
                        node.children.push({ text: '新しいノード', children: [] });
                        this.refreshEditor();
                        this.onInputChange();
                    }
                });
            });

            wrapper.querySelectorAll('.delete-node').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const path = e.currentTarget.dataset.path;
                    this.deleteNodeByPath(path);
                    this.refreshEditor();
                    this.onInputChange();
                });
            });
        }, 0);

        return wrapper;
    }

    getNodeByPath(pathStr) {
        if (!pathStr) return this.root;

        const path = pathStr.split('-').map(Number);
        let node = this.root;

        for (const index of path) {
            if (node.children && node.children[index]) {
                node = node.children[index];
            } else {
                return null;
            }
        }

        return node;
    }

    deleteNodeByPath(pathStr) {
        if (!pathStr) return; // ルートは削除不可

        const path = pathStr.split('-').map(Number);
        const indexToDelete = path.pop();
        const parentPath = path.join('-');
        const parent = this.getNodeByPath(parentPath);

        if (parent && parent.children) {
            parent.children.splice(indexToDelete, 1);
        }
    }

    refreshEditor() {
        const container = document.getElementById('editorContainer');
        container.innerHTML = '';
        container.appendChild(this.render());
    }

    generateCode() {
        let code = 'mindmap\n';

        const renderNode = (node, indent = 1) => {
            const spaces = '  '.repeat(indent);
            code += `${spaces}${node.text}\n`;

            node.children.forEach(child => {
                renderNode(child, indent + 1);
            });
        };

        renderNode(this.root);

        return code;
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'simple':
                this.root = {
                    text: 'Central Topic',
                    children: [
                        { text: 'Branch A', children: [] },
                        { text: 'Branch B', children: [] },
                        { text: 'Branch C', children: [] }
                    ]
                };
                break;

            case 'project':
                this.root = {
                    text: 'Project Plan',
                    children: [
                        {
                            text: 'Goals',
                            children: [
                                { text: 'Short-term', children: [] },
                                { text: 'Long-term', children: [] }
                            ]
                        },
                        {
                            text: 'Resources',
                            children: [
                                { text: 'Team', children: [] },
                                { text: 'Budget', children: [] },
                                { text: 'Tools', children: [] }
                            ]
                        },
                        {
                            text: 'Timeline',
                            children: [
                                { text: 'Phase 1', children: [] },
                                { text: 'Phase 2', children: [] },
                                { text: 'Phase 3', children: [] }
                            ]
                        },
                        {
                            text: 'Risks',
                            children: [
                                { text: 'Technical', children: [] },
                                { text: 'Schedule', children: [] }
                            ]
                        }
                    ]
                };
                break;

            case 'brainstorm':
                this.root = {
                    text: 'New Feature Ideas',
                    children: [
                        {
                            text: 'User Experience',
                            children: [
                                { text: 'Dashboard redesign', children: [] },
                                { text: 'Mobile optimization', children: [] },
                                { text: 'Accessibility', children: [] }
                            ]
                        },
                        {
                            text: 'Performance',
                            children: [
                                { text: 'Caching', children: [] },
                                { text: 'Database optimization', children: [] }
                            ]
                        },
                        {
                            text: 'New Features',
                            children: [
                                { text: 'API v2', children: [] },
                                { text: 'Integrations', children: [] },
                                { text: 'Analytics', children: [] }
                            ]
                        }
                    ]
                };
                break;
        }

        this.refreshEditor();
    }
}

window.MindmapEditor = MindmapEditor;
