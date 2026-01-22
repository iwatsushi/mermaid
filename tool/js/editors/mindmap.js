/**
 * マインドマップエディター
 */
class MindmapEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.root = {
            text: 'Central Topic',
            shape: 'default',
            icon: '',
            children: []
        };

        // Theme オプション（mindmapはlook/layoutサポートなし）
        this.themeOptions = [
            { id: 'default', name: 'Default（標準）' },
            { id: 'forest', name: 'Forest（緑）' },
            { id: 'dark', name: 'Dark（ダークモード）' },
            { id: 'neutral', name: 'Neutral（モノクロ印刷向け）' },
            { id: 'base', name: 'Base（カスタマイズ用）' }
        ];

        // ノード形状オプション
        this.nodeShapes = [
            { id: 'default', name: 'デフォルト', prefix: '', suffix: '', description: 'インデントで自動決定' },
            { id: 'square', name: '四角形', prefix: '[', suffix: ']', description: '角張った四角' },
            { id: 'rounded', name: '角丸', prefix: '(', suffix: ')', description: '角が丸い四角' },
            { id: 'circle', name: '円形', prefix: '((', suffix: '))', description: '丸いノード' },
            { id: 'bang', name: '爆発形', prefix: '))', suffix: '((', description: '強調に最適' },
            { id: 'cloud', name: '雲形', prefix: ')', suffix: '(', description: 'アイデア向け' },
            { id: 'hexagon', name: '六角形', prefix: '{{', suffix: '}}', description: '目立つ形状' }
        ];

        // アイコンオプション (Font Awesome)
        this.iconOptions = [
            { id: '', name: 'なし' },
            { id: 'fa-book', name: '📖 本' },
            { id: 'fa-lightbulb', name: '💡 アイデア' },
            { id: 'fa-cog', name: '⚙️ 設定' },
            { id: 'fa-user', name: '👤 ユーザー' },
            { id: 'fa-users', name: '👥 チーム' },
            { id: 'fa-check', name: '✓ 完了' },
            { id: 'fa-star', name: '⭐ 重要' },
            { id: 'fa-warning', name: '⚠️ 注意' },
            { id: 'fa-code', name: '💻 コード' },
            { id: 'fa-database', name: '🗄️ DB' },
            { id: 'fa-cloud', name: '☁️ クラウド' },
            { id: 'fa-lock', name: '🔒 セキュリティ' },
            { id: 'fa-rocket', name: '🚀 リリース' },
            { id: 'fa-calendar', name: '📅 予定' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプル' },
            { id: 'project', name: 'プロジェクト計画' },
            { id: 'brainstorm', name: 'ブレインストーミング' },
            { id: 'shapes', name: '形状サンプル' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.theme = 'default';
        this.root = {
            text: 'メインテーマ',
            shape: 'default',
            icon: '',
            children: [
                {
                    text: 'トピック1',
                    shape: 'default',
                    icon: '',
                    children: [
                        { text: 'サブ1-1', shape: 'default', icon: '', children: [] },
                        { text: 'サブ1-2', shape: 'default', icon: '', children: [] }
                    ]
                },
                {
                    text: 'トピック2',
                    shape: 'default',
                    icon: '',
                    children: [
                        { text: 'サブ2-1', shape: 'default', icon: '', children: [] }
                    ]
                },
                {
                    text: 'トピック3',
                    shape: 'default',
                    icon: '',
                    children: []
                }
            ]
        };
    }

    renderAppearanceSettings() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="row g-3">
                <div class="col-6">
                    <label class="form-label">Theme（配色）</label>
                    <select class="form-select form-select-sm" id="mindmapTheme">
                        ${this.themeOptions.map(opt =>
                            `<option value="${opt.id}" ${this.theme === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelector('#mindmapTheme')?.addEventListener('change', (e) => {
                this.theme = e.target.value;
                this.onInputChange();
            });
        }, 0);

        return wrapper;
    }

    render() {
        const container = document.createElement('div');

        // 注意メッセージ
        const warning = document.createElement('div');
        warning.className = 'alert alert-info alert-sm mb-3';
        warning.innerHTML = '<i class="bi bi-info-circle"></i> Mindmapは Mermaid v9.4.0 以降で利用可能です';
        container.appendChild(warning);

        // 外観設定
        container.appendChild(this.createSection('外観設定', 'bi-palette', this.renderAppearanceSettings()));

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
            const shape = this.nodeShapes.find(s => s.id === (node.shape || 'default'));
            const icon = this.iconOptions.find(i => i.id === (node.icon || ''));

            nodeEl.innerHTML = `
                <span class="text-muted me-2" style="width:20px">${depth === 0 ? '<i class="bi bi-star-fill text-warning"></i>' : '<i class="bi bi-dash"></i>'}</span>
                <input type="text" class="form-control form-control-sm tree-node-input" value="${node.text}" data-path="${pathStr}" style="flex:1">
                ${shape && shape.id !== 'default' ? `<span class="badge bg-secondary ms-1" title="形状: ${shape.name}">${shape.name}</span>` : ''}
                ${icon && icon.id ? `<span class="badge bg-info ms-1" title="アイコン">${icon.name}</span>` : ''}
                <div class="tree-node-actions ms-2">
                    <button class="btn btn-sm btn-outline-secondary edit-node" data-path="${pathStr}" title="形状・アイコン編集">
                        <i class="bi bi-sliders"></i>
                    </button>
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

            wrapper.querySelectorAll('.edit-node').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const path = e.currentTarget.dataset.path;
                    this.showNodeEditModal(path);
                });
            });

            wrapper.querySelectorAll('.add-child').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const path = e.currentTarget.dataset.path;
                    const node = this.getNodeByPath(path);
                    if (node) {
                        node.children.push({ text: '新しいノード', shape: 'default', icon: '', children: [] });
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

    showNodeEditModal(pathStr) {
        const node = this.getNodeByPath(pathStr);
        if (!node) return;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-sliders"></i> ノード編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">テキスト</label>
                            <input type="text" class="form-control" id="nodeText" value="${node.text}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">形状</label>
                            <select class="form-select" id="nodeShape">
                                ${this.nodeShapes.map(s => `
                                    <option value="${s.id}" ${(node.shape || 'default') === s.id ? 'selected' : ''}>
                                        ${s.name} - ${s.description}
                                    </option>
                                `).join('')}
                            </select>
                            <div class="form-text">形状を指定するとMermaidコードに反映されます</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">アイコン（Font Awesome）</label>
                            <select class="form-select" id="nodeIcon">
                                ${this.iconOptions.map(i => `
                                    <option value="${i.id}" ${(node.icon || '') === i.id ? 'selected' : ''}>${i.name}</option>
                                `).join('')}
                            </select>
                            <div class="form-text">アイコンはFont Awesomeが読み込まれている環境で表示されます</div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="saveNodeBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#saveNodeBtn').addEventListener('click', () => {
            node.text = modal.querySelector('#nodeText').value.trim() || node.text;
            node.shape = modal.querySelector('#nodeShape').value;
            node.icon = modal.querySelector('#nodeIcon').value;

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
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
        let code = '';

        // Theme設定がデフォルトでない場合はYAML frontmatterで出力
        if (this.theme !== 'default') {
            code += '---\n';
            code += 'config:\n';
            code += `  theme: ${this.theme}\n`;
            code += '---\n';
        }

        code += 'mindmap\n';

        const renderNode = (node, indent = 1) => {
            const spaces = '  '.repeat(indent);
            const shape = this.nodeShapes.find(s => s.id === (node.shape || 'default'));

            // ノードテキストを形状で囲む
            let nodeText = node.text;
            if (shape && shape.id !== 'default') {
                nodeText = `${shape.prefix}${node.text}${shape.suffix}`;
            }

            code += `${spaces}${nodeText}\n`;

            // アイコンがあれば追加
            if (node.icon) {
                code += `${spaces}  ::icon(fa ${node.icon})\n`;
            }

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
                    shape: 'default',
                    icon: '',
                    children: [
                        { text: 'Branch A', shape: 'default', icon: '', children: [] },
                        { text: 'Branch B', shape: 'default', icon: '', children: [] },
                        { text: 'Branch C', shape: 'default', icon: '', children: [] }
                    ]
                };
                break;

            case 'project':
                this.root = {
                    text: 'Project Plan',
                    shape: 'hexagon',
                    icon: 'fa-rocket',
                    children: [
                        {
                            text: 'Goals',
                            shape: 'rounded',
                            icon: 'fa-star',
                            children: [
                                { text: 'Short-term', shape: 'default', icon: '', children: [] },
                                { text: 'Long-term', shape: 'default', icon: '', children: [] }
                            ]
                        },
                        {
                            text: 'Resources',
                            shape: 'rounded',
                            icon: 'fa-users',
                            children: [
                                { text: 'Team', shape: 'default', icon: '', children: [] },
                                { text: 'Budget', shape: 'default', icon: '', children: [] },
                                { text: 'Tools', shape: 'default', icon: '', children: [] }
                            ]
                        },
                        {
                            text: 'Timeline',
                            shape: 'rounded',
                            icon: 'fa-calendar',
                            children: [
                                { text: 'Phase 1', shape: 'default', icon: '', children: [] },
                                { text: 'Phase 2', shape: 'default', icon: '', children: [] },
                                { text: 'Phase 3', shape: 'default', icon: '', children: [] }
                            ]
                        },
                        {
                            text: 'Risks',
                            shape: 'rounded',
                            icon: 'fa-warning',
                            children: [
                                { text: 'Technical', shape: 'default', icon: '', children: [] },
                                { text: 'Schedule', shape: 'default', icon: '', children: [] }
                            ]
                        }
                    ]
                };
                break;

            case 'brainstorm':
                this.root = {
                    text: 'New Feature Ideas',
                    shape: 'cloud',
                    icon: 'fa-lightbulb',
                    children: [
                        {
                            text: 'User Experience',
                            shape: 'rounded',
                            icon: 'fa-user',
                            children: [
                                { text: 'Dashboard redesign', shape: 'default', icon: '', children: [] },
                                { text: 'Mobile optimization', shape: 'default', icon: '', children: [] },
                                { text: 'Accessibility', shape: 'default', icon: '', children: [] }
                            ]
                        },
                        {
                            text: 'Performance',
                            shape: 'rounded',
                            icon: 'fa-cog',
                            children: [
                                { text: 'Caching', shape: 'default', icon: '', children: [] },
                                { text: 'Database optimization', shape: 'default', icon: '', children: [] }
                            ]
                        },
                        {
                            text: 'New Features',
                            shape: 'rounded',
                            icon: 'fa-code',
                            children: [
                                { text: 'API v2', shape: 'default', icon: '', children: [] },
                                { text: 'Integrations', shape: 'default', icon: '', children: [] },
                                { text: 'Analytics', shape: 'default', icon: '', children: [] }
                            ]
                        }
                    ]
                };
                break;

            case 'shapes':
                this.root = {
                    text: '形状サンプル',
                    shape: 'hexagon',
                    icon: '',
                    children: [
                        { text: 'デフォルト', shape: 'default', icon: '', children: [] },
                        { text: '四角形', shape: 'square', icon: '', children: [] },
                        { text: '角丸', shape: 'rounded', icon: '', children: [] },
                        { text: '円形', shape: 'circle', icon: '', children: [] },
                        { text: '爆発形', shape: 'bang', icon: 'fa-star', children: [] },
                        { text: '雲形', shape: 'cloud', icon: 'fa-cloud', children: [] }
                    ]
                };
                break;
        }

        this.refreshEditor();
    }
}

window.MindmapEditor = MindmapEditor;
