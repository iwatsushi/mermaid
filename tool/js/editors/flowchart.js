/**
 * フローチャートエディター
 */
class FlowchartEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.direction = 'TD';
        this.nodes = [];
        this.connections = [];
        this.subgraphs = [];

        this.shapes = [
            { id: 'rect', name: '四角形', syntax: ['[', ']'], display: '四角形 [ ]' },
            { id: 'round', name: '角丸', syntax: ['(', ')'], display: '角丸 ( )' },
            { id: 'stadium', name: 'スタジアム', syntax: ['([', '])'], display: 'スタジアム ([ ])' },
            { id: 'subroutine', name: 'サブルーチン', syntax: ['[[', ']]'], display: 'サブルーチン [[ ]]' },
            { id: 'database', name: 'DB', syntax: ['[(', ')]'], display: 'DB [( )]' },
            { id: 'circle', name: '円', syntax: ['((', '))'], display: '円 (( ))' },
            { id: 'diamond', name: 'ひし形', syntax: ['{', '}'], display: 'ひし形 { }' },
            { id: 'hexagon', name: '六角形', syntax: ['{{', '}}'], display: '六角形 {{ }}' },
            { id: 'parallelogram', name: '平行四辺形', syntax: ['[/', '/]'], display: '平行四辺形 [/ /]' },
            { id: 'trapezoid', name: '台形', syntax: ['[/', '\\]'], display: '台形 [/ \\]' }
        ];

        // 線のスタイル
        this.lineStyles = [
            { id: 'solid', name: '実線', baseChar: '-' },
            { id: 'dotted', name: '点線', baseChar: '.' },
            { id: 'thick', name: '太線', baseChar: '=' }
        ];

        // 矢印の長さ（1が最短、4が最長）
        this.arrowLengths = [
            { id: 1, name: '短い' },
            { id: 2, name: '標準' },
            { id: 3, name: '長い' },
            { id: 4, name: 'とても長い' }
        ];

        // 終端の形状
        this.endpointShapes = [
            { id: 'none', name: 'なし', startSyntax: '', endSyntax: '' },
            { id: 'arrow', name: '矢印 (>)', startSyntax: '<', endSyntax: '>' },
            { id: 'circle', name: '円 (o)', startSyntax: 'o', endSyntax: 'o' },
            { id: 'cross', name: 'バツ (x)', startSyntax: 'x', endSyntax: 'x' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプルなフロー' },
            { id: 'decision', name: '条件分岐' },
            { id: 'auth', name: 'ユーザー認証フロー' },
            { id: 'system', name: 'システム構成（サブグラフ）' }
        ];

        // 初期データ
        this.initDefaultData();
    }

    initDefaultData() {
        this.nodes = [
            { id: 'A', label: '開始', shape: 'stadium' },
            { id: 'B', label: '処理', shape: 'rect' },
            { id: 'C', label: '終了', shape: 'stadium' }
        ];
        this.connections = [
            { from: 'A', to: 'B', lineStyle: 'solid', length: 2, startShape: 'none', endShape: 'arrow', label: '' },
            { from: 'B', to: 'C', lineStyle: 'solid', length: 2, startShape: 'none', endShape: 'arrow', label: '' }
        ];
        this.subgraphs = [];
    }

    render() {
        const container = document.createElement('div');

        // 方向選択
        container.appendChild(this.createSection('方向', 'bi-arrows-move', this.renderDirectionSelector()));

        // サブグラフ一覧
        container.appendChild(this.createSection('サブグラフ', 'bi-diagram-3', this.renderSubgraphList()));

        // ノード一覧
        container.appendChild(this.createSection('ノード', 'bi-square', this.renderNodeList()));

        // 接続一覧
        container.appendChild(this.createSection('接続', 'bi-arrow-right', this.renderConnectionList()));

        return container;
    }

    renderDirectionSelector() {
        const wrapper = document.createElement('div');
        wrapper.className = 'direction-selector';

        const directions = [
            { id: 'TD', name: '上→下', icon: 'bi-arrow-down' },
            { id: 'TB', name: '上→下', icon: 'bi-arrow-down' },
            { id: 'BT', name: '下→上', icon: 'bi-arrow-up' },
            { id: 'LR', name: '左→右', icon: 'bi-arrow-right' },
            { id: 'RL', name: '右→左', icon: 'bi-arrow-left' }
        ];

        // TD と TB は同じなので TB を除外
        const uniqueDirections = directions.filter(d => d.id !== 'TB');

        uniqueDirections.forEach(dir => {
            const option = document.createElement('div');
            option.className = 'direction-option' + (this.direction === dir.id ? ' selected' : '');
            option.innerHTML = `
                <i class="bi ${dir.icon}"></i>
                <span>${dir.name}</span>
            `;
            option.addEventListener('click', () => {
                this.direction = dir.id;
                wrapper.querySelectorAll('.direction-option').forEach(el => el.classList.remove('selected'));
                option.classList.add('selected');
                this.onInputChange();
            });
            wrapper.appendChild(option);
        });

        return wrapper;
    }

    renderSubgraphList() {
        const wrapper = document.createElement('div');

        // サブグラフリスト
        const list = document.createElement('div');
        list.className = 'item-list subgraph-list';

        if (this.subgraphs.length === 0) {
            list.innerHTML = '<div class="item-list-empty">サブグラフがありません</div>';
        } else {
            // ツリー形式で表示するためにサブグラフを整理
            const renderSubgraphItem = (sg, depth = 0) => {
                const nodeCount = sg.nodeIds.length;
                const childSubgraphs = this.getChildSubgraphs(sg.id);
                const index = this.subgraphs.findIndex(s => s.id === sg.id);

                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item subgraph-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.dataset.id = sg.id;
                itemEl.dataset.parentId = sg.parentId || '';
                itemEl.style.paddingLeft = `${depth * 20 + 8}px`;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え（同じ親内のみ）">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        ${depth > 0 ? '<i class="bi bi-arrow-return-right text-muted me-1"></i>' : ''}
                        <span class="badge bg-info me-2">${sg.id}</span>
                        <span>${sg.label}</span>
                        <small class="text-muted ms-2">(${nodeCount}ノード)</small>
                        ${sg.direction ? `<small class="badge bg-secondary ms-1">${sg.direction}</small>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-success add-child-subgraph" data-parent="${sg.id}" title="子サブグラフを追加">
                            <i class="bi bi-plus-square"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-primary edit-subgraph" data-index="${index}" title="編集">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-subgraph" data-index="${index}" title="削除">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                list.appendChild(itemEl);

                // 子サブグラフを再帰的に表示
                childSubgraphs.forEach(child => {
                    renderSubgraphItem(child, depth + 1);
                });
            };

            // ルートレベルのサブグラフから表示
            this.getRootSubgraphs().forEach(sg => {
                renderSubgraphItem(sg, 0);
            });
        }
        wrapper.appendChild(list);

        // 追加ボタン
        const addBtn = document.createElement('button');
        addBtn.className = 'btn btn-primary btn-sm mt-2 btn-add';
        addBtn.innerHTML = '<i class="bi bi-plus"></i> サブグラフを追加';
        addBtn.id = 'addSubgraphBtn';
        wrapper.appendChild(addBtn);

        // イベントリスナー
        setTimeout(() => {
            wrapper.querySelector('#addSubgraphBtn')?.addEventListener('click', () => this.addSubgraph());
            wrapper.querySelectorAll('.add-child-subgraph').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.addSubgraph(e.currentTarget.dataset.parent);
                });
            });
            wrapper.querySelectorAll('.edit-subgraph').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.editSubgraph(parseInt(e.currentTarget.dataset.index));
                });
            });
            wrapper.querySelectorAll('.delete-subgraph').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.deleteSubgraph(parseInt(e.currentTarget.dataset.index));
                });
            });

            // ドラッグ＆ドロップ
            let draggedSubgraphId = null;
            let draggedParentId = null;
            wrapper.querySelectorAll('.subgraph-item[draggable="true"]').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedSubgraphId = item.dataset.id;
                    draggedParentId = item.dataset.parentId;
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    wrapper.querySelectorAll('.subgraph-item').forEach(el => {
                        el.classList.remove('drag-over', 'drag-invalid');
                    });
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    const targetParentId = item.dataset.parentId;
                    // 同じ親を持つサブグラフのみドロップ可能
                    if (draggedSubgraphId !== null && draggedSubgraphId !== item.dataset.id) {
                        if (draggedParentId === targetParentId) {
                            e.dataTransfer.dropEffect = 'move';
                            item.classList.add('drag-over');
                            item.classList.remove('drag-invalid');
                        } else {
                            e.dataTransfer.dropEffect = 'none';
                            item.classList.add('drag-invalid');
                            item.classList.remove('drag-over');
                        }
                    }
                });

                item.addEventListener('dragleave', () => {
                    item.classList.remove('drag-over', 'drag-invalid');
                });

                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const targetParentId = item.dataset.parentId;
                    // 同じ親を持つサブグラフのみ並び替え可能
                    if (draggedSubgraphId !== null && draggedSubgraphId !== item.dataset.id && draggedParentId === targetParentId) {
                        this.moveSubgraphBefore(draggedSubgraphId, item.dataset.id);
                    }
                    draggedSubgraphId = null;
                    draggedParentId = null;
                });
            });
        }, 0);

        return wrapper;
    }

    /**
     * サブグラフを指定したサブグラフの前に移動（同じ親内のみ）
     */
    moveSubgraphBefore(sourceId, targetId) {
        const sourceIndex = this.subgraphs.findIndex(sg => sg.id === sourceId);
        const targetIndex = this.subgraphs.findIndex(sg => sg.id === targetId);

        if (sourceIndex === -1 || targetIndex === -1) return;

        const source = this.subgraphs[sourceIndex];
        const target = this.subgraphs[targetIndex];

        // 親が異なる場合は何もしない
        if (source.parentId !== target.parentId) return;

        // 配列から削除して挿入
        this.subgraphs.splice(sourceIndex, 1);
        const newTargetIndex = this.subgraphs.findIndex(sg => sg.id === targetId);
        this.subgraphs.splice(newTargetIndex, 0, source);

        this.refreshEditor();
        this.onInputChange();
    }

    renderNodeList() {
        const wrapper = document.createElement('div');

        // ノードリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.nodes.length === 0) {
            list.innerHTML = '<div class="item-list-empty">ノードがありません</div>';
        } else {
            this.nodes.forEach((node, index) => {
                const displayLabel = node.label.replace(/<br\s*\/?>/gi, ' ↵ ');
                const truncatedLabel = displayLabel.length > 30 ? displayLabel.substring(0, 30) + '...' : displayLabel;
                const nodeSubgraph = this.getNodeSubgraph(node.id);

                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge bg-primary me-2">${node.id}</span>
                        <span title="${displayLabel}">${truncatedLabel}</span>
                        <small class="text-muted ms-2">(${this.shapes.find(s => s.id === node.shape)?.name || node.shape})</small>
                        ${nodeSubgraph ? `<span class="badge bg-info ms-2" title="${nodeSubgraph.label}">${nodeSubgraph.id}</span>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-node" data-index="${index}" title="編集">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-node" data-index="${index}" title="削除">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                list.appendChild(itemEl);
            });
        }
        wrapper.appendChild(list);

        // 追加フォーム
        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2 mb-2">
                <div class="col-3">
                    <label class="form-label">ID</label>
                    <input type="text" class="form-control form-control-sm" id="nodeId" placeholder="A">
                </div>
                <div class="col-5">
                    <label class="form-label">ラベル <small class="text-muted">(改行可)</small></label>
                    <textarea class="form-control form-control-sm" id="nodeLabel" placeholder="処理名" rows="1"></textarea>
                </div>
                <div class="col-4">
                    <label class="form-label">形状</label>
                    <select class="form-select form-select-sm" id="nodeShape">
                        ${this.shapes.map(s => `<option value="${s.id}">${s.display}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="row g-2">
                <div class="col-12">
                    <label class="form-label">形状プレビュー</label>
                    <div id="addNodePreview" class="border rounded p-2 bg-light text-center">
                        <span class="text-muted">読み込み中...</span>
                    </div>
                    <div class="text-center mt-1">
                        <code id="addNodeSyntaxPreview">${this.getNodeSyntax('A', '処理名', 'rect')}</code>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addNodeBtn">
                <i class="bi bi-plus"></i> ノードを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        // イベントリスナー
        setTimeout(() => {
            wrapper.querySelector('#addNodeBtn')?.addEventListener('click', () => this.addNode());
            wrapper.querySelectorAll('.edit-node').forEach(btn => {
                btn.addEventListener('click', (e) => this.editNode(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-node').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteNode(parseInt(e.currentTarget.dataset.index)));
            });

            // ドラッグ＆ドロップ
            let draggedIndex = null;
            wrapper.querySelectorAll('.item-list-item[draggable="true"]').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedIndex = parseInt(item.dataset.index);
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    wrapper.querySelectorAll('.item-list-item').forEach(el => el.classList.remove('drag-over'));
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        item.classList.add('drag-over');
                    }
                });

                item.addEventListener('dragleave', () => {
                    item.classList.remove('drag-over');
                });

                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        this.moveNodeToIndex(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });

            // 追加フォームのプレビュー更新
            const nodePreviewDiv = wrapper.querySelector('#addNodePreview');
            const nodeSyntaxPreview = wrapper.querySelector('#addNodeSyntaxPreview');
            const updateNodeAddPreview = () => {
                const id = document.getElementById('nodeId')?.value || 'A';
                const rawLabel = document.getElementById('nodeLabel')?.value || '処理名';
                const label = this.textToLabel(rawLabel);
                const shape = document.getElementById('nodeShape')?.value || 'rect';
                if (nodePreviewDiv) {
                    this.renderShapePreview(nodePreviewDiv, shape, label);
                }
                if (nodeSyntaxPreview) {
                    nodeSyntaxPreview.textContent = this.getNodeSyntax(id, label, shape);
                }
            };

            // 初期プレビューを描画
            updateNodeAddPreview();

            ['nodeId', 'nodeLabel', 'nodeShape'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', updateNodeAddPreview);
                }
            });
        }, 0);

        return wrapper;
    }

    renderConnectionList() {
        const wrapper = document.createElement('div');

        // マトリックス編集ボタン
        const matrixBtn = document.createElement('div');
        matrixBtn.className = 'mb-2';
        matrixBtn.innerHTML = `
            <button class="btn btn-outline-secondary btn-sm w-100" id="openMatrixBtn">
                <i class="bi bi-grid-3x3"></i> マトリックスで編集
            </button>
        `;
        wrapper.appendChild(matrixBtn);

        // 接続リスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.connections.length === 0) {
            list.innerHTML = '<div class="item-list-empty">接続がありません</div>';
        } else {
            this.connections.forEach((conn, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content connection-item">
                        <span class="node-badge">${conn.from}</span>
                        <span class="arrow-badge">${this.getConnectionSyntax(conn)}</span>
                        <span class="node-badge">${conn.to}</span>
                        ${conn.label ? `<small class="text-muted">"${conn.label}"</small>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-conn" data-index="${index}" title="編集">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-conn" data-index="${index}" title="削除">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                list.appendChild(itemEl);
            });
        }
        wrapper.appendChild(list);

        // 追加フォーム
        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2 mb-2">
                <div class="col-6">
                    <label class="form-label">開始ノード</label>
                    <select class="form-select form-select-sm" id="connFrom">
                        ${this.nodes.map(n => `<option value="${n.id}">${n.id}</option>`).join('')}
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label">終了ノード</label>
                    <select class="form-select form-select-sm" id="connTo">
                        ${this.nodes.map(n => `<option value="${n.id}">${n.id}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="row g-2 mb-2">
                <div class="col-3">
                    <label class="form-label">始点</label>
                    <select class="form-select form-select-sm" id="connStartShape">
                        ${this.endpointShapes.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">線種</label>
                    <select class="form-select form-select-sm" id="connLineStyle">
                        ${this.lineStyles.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">長さ</label>
                    <select class="form-select form-select-sm" id="connLength">
                        ${this.arrowLengths.map(l => `<option value="${l.id}" ${l.id === 2 ? 'selected' : ''}>${l.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">終点</label>
                    <select class="form-select form-select-sm" id="connEndShape">
                        ${this.endpointShapes.map(s => `<option value="${s.id}" ${s.id === 'arrow' ? 'selected' : ''}>${s.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="row g-2 mb-2">
                <div class="col-12">
                    <label class="form-label">ラベル（任意）</label>
                    <input type="text" class="form-control form-control-sm" id="connLabel" placeholder="Yes / No など">
                </div>
            </div>
            <div class="row g-2">
                <div class="col-12">
                    <label class="form-label">接続プレビュー</label>
                    <div id="addConnPreview" class="border rounded p-2 bg-light text-center">
                        <span class="text-muted">読み込み中...</span>
                    </div>
                    <div class="text-center mt-1">
                        <code id="addConnSyntaxPreview">---></code>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addConnBtn">
                <i class="bi bi-plus"></i> 接続を追加
            </button>
        `;
        wrapper.appendChild(addForm);

        // イベントリスナー
        setTimeout(() => {
            wrapper.querySelector('#openMatrixBtn')?.addEventListener('click', () => this.showConnectionMatrixModal());
            wrapper.querySelector('#addConnBtn')?.addEventListener('click', () => this.addConnection());
            wrapper.querySelectorAll('.edit-conn').forEach(btn => {
                btn.addEventListener('click', (e) => this.editConnection(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-conn').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteConnection(parseInt(e.currentTarget.dataset.index)));
            });

            // ドラッグ＆ドロップ
            let draggedConnIndex = null;
            wrapper.querySelectorAll('.item-list-item[draggable="true"]').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedConnIndex = parseInt(item.dataset.index);
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });

                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    wrapper.querySelectorAll('.item-list-item').forEach(el => el.classList.remove('drag-over'));
                });

                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedConnIndex !== null && draggedConnIndex !== targetIndex) {
                        item.classList.add('drag-over');
                    }
                });

                item.addEventListener('dragleave', () => {
                    item.classList.remove('drag-over');
                });

                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedConnIndex !== null && draggedConnIndex !== targetIndex) {
                        this.moveConnectionToIndex(draggedConnIndex, targetIndex);
                    }
                    draggedConnIndex = null;
                });
            });

            // 追加フォームのプレビュー更新
            const connPreviewDiv = wrapper.querySelector('#addConnPreview');
            const connSyntaxPreview = wrapper.querySelector('#addConnSyntaxPreview');
            const updateAddConnPreview = () => {
                const fromId = document.getElementById('connFrom')?.value;
                const toId = document.getElementById('connTo')?.value;
                const fromNode = this.nodes.find(n => n.id === fromId);
                const toNode = this.nodes.find(n => n.id === toId);

                const conn = {
                    lineStyle: document.getElementById('connLineStyle')?.value || 'solid',
                    length: parseInt(document.getElementById('connLength')?.value) || 2,
                    startShape: document.getElementById('connStartShape')?.value || 'none',
                    endShape: document.getElementById('connEndShape')?.value || 'arrow'
                };
                if (connPreviewDiv) {
                    this.renderConnectionPreview(connPreviewDiv, conn, fromNode, toNode);
                }
                if (connSyntaxPreview) {
                    connSyntaxPreview.textContent = this.getConnectionSyntax(conn);
                }
            };

            // 初期プレビューを描画
            updateAddConnPreview();

            ['connFrom', 'connTo', 'connStartShape', 'connLineStyle', 'connLength', 'connEndShape'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', updateAddConnPreview);
            });

            // 線種セレクトボックスの背景色更新
            const connLineStyleSelect = document.getElementById('connLineStyle');
            const updateConnLineStyleColor = () => {
                if (connLineStyleSelect) {
                    connLineStyleSelect.classList.remove('line-style-solid', 'line-style-dotted', 'line-style-thick');
                    connLineStyleSelect.classList.add(`line-style-${connLineStyleSelect.value}`);
                }
            };
            updateConnLineStyleColor();
            connLineStyleSelect?.addEventListener('change', updateConnLineStyleColor);
        }, 0);

        return wrapper;
    }

    getConnectionSyntax(conn) {
        const lineStyle = this.lineStyles.find(s => s.id === (conn.lineStyle || 'solid'));
        const startShape = this.endpointShapes.find(s => s.id === (conn.startShape || 'none'));
        const endShape = this.endpointShapes.find(s => s.id === (conn.endShape || 'arrow'));

        const start = startShape ? startShape.startSyntax : '';
        const end = endShape ? endShape.endSyntax : '>';
        const length = conn.length || 2;

        // 線のシンタックスを生成
        let line = '';
        if (lineStyle) {
            const baseChar = lineStyle.baseChar;
            if (baseChar === '-') {
                // 実線: -- (length 1), --- (length 2), ---- (length 3), etc.
                line = '-'.repeat(length + 1);
            } else if (baseChar === '.') {
                // 点線: -.- (length 1), -..- (length 2), -...- (length 3), etc.
                line = '-' + '.'.repeat(length) + '-';
            } else if (baseChar === '=') {
                // 太線: == (length 1), === (length 2), ==== (length 3), etc.
                line = '='.repeat(length + 1);
            }
        } else {
            line = '-'.repeat(length + 1);
        }

        return `${start}${line}${end}`;
    }

    addNode() {
        const id = document.getElementById('nodeId').value.trim() || this.generateNodeId();
        const rawLabel = document.getElementById('nodeLabel').value.trim();
        const label = rawLabel ? this.textToLabel(rawLabel) : id;
        const shape = document.getElementById('nodeShape').value;

        // IDの重複チェック
        if (this.nodes.some(n => n.id === id)) {
            this.app.showToast('同じIDのノードが既に存在します', 'warning');
            return;
        }

        this.nodes.push({ id, label, shape });
        this.refreshEditor();
        this.onInputChange();

        // 入力をクリア
        document.getElementById('nodeId').value = '';
        document.getElementById('nodeLabel').value = '';
    }

    generateNodeId() {
        const usedIds = this.nodes.map(n => n.id);
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let i = 0; i < alphabet.length; i++) {
            if (!usedIds.includes(alphabet[i])) {
                return alphabet[i];
            }
        }
        return 'N' + (this.nodes.length + 1);
    }

    editNode(index) {
        const node = this.nodes[index];
        this.showNodeEditModal(node, index);
    }

    showNodeEditModal(node, index) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">ノード編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ID</label>
                            <input type="text" class="form-control" id="editNodeId" value="${node.id}">
                            <div class="form-text">IDを変更すると、関連する接続も自動的に更新されます</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">ラベル <small class="text-muted">(改行可)</small></label>
                            <textarea class="form-control" id="editNodeLabel" rows="3">${this.labelToText(node.label)}</textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">形状</label>
                            <select class="form-select" id="editNodeShape">
                                ${this.shapes.map(s => `<option value="${s.id}" ${s.id === node.shape ? 'selected' : ''}>${s.display}</option>`).join('')}
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">形状プレビュー</label>
                            <div id="shapePreview" class="border rounded p-3 bg-light text-center">
                                <span class="text-muted">読み込み中...</span>
                            </div>
                            <div class="text-center mt-2">
                                <code id="shapeSyntaxPreview">${this.getNodeSyntax(node.id, node.label, node.shape)}</code>
                            </div>
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

        // 形状変更時のプレビュー更新
        const shapeSelect = modal.querySelector('#editNodeShape');
        const labelInput = modal.querySelector('#editNodeLabel');
        const idInput = modal.querySelector('#editNodeId');
        const previewDiv = modal.querySelector('#shapePreview');
        const syntaxPreview = modal.querySelector('#shapeSyntaxPreview');

        const updatePreview = () => {
            const id = idInput.value || 'ID';
            const shape = shapeSelect.value;
            const rawLabel = labelInput.value || 'ラベル';
            const label = this.textToLabel(rawLabel);
            this.renderShapePreview(previewDiv, shape, label);
            syntaxPreview.textContent = this.getNodeSyntax(id, label, shape);
        };

        // 初期プレビューを描画
        updatePreview();

        shapeSelect.addEventListener('change', updatePreview);
        labelInput.addEventListener('input', updatePreview);
        idInput.addEventListener('input', updatePreview);

        // 保存ボタン
        modal.querySelector('#saveNodeBtn').addEventListener('click', () => {
            const newId = modal.querySelector('#editNodeId').value.trim();
            const rawLabel = modal.querySelector('#editNodeLabel').value.trim();
            const newLabel = rawLabel ? this.textToLabel(rawLabel) : newId;
            const newShape = modal.querySelector('#editNodeShape').value;

            if (!newId) {
                this.app.showToast('IDを入力してください', 'warning');
                return;
            }

            // IDが変更された場合、重複チェックと接続の更新
            if (newId !== node.id) {
                if (this.nodes.some((n, i) => i !== index && n.id === newId)) {
                    this.app.showToast('同じIDのノードが既に存在します', 'warning');
                    return;
                }

                // 接続のIDを更新
                const oldId = node.id;
                this.connections.forEach(conn => {
                    if (conn.from === oldId) conn.from = newId;
                    if (conn.to === oldId) conn.to = newId;
                });
            }

            node.id = newId;
            node.label = newLabel;
            node.shape = newShape;

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    async renderShapePreview(container, shapeId, label) {
        const shape = this.shapes.find(s => s.id === shapeId);
        const [open, close] = shape ? shape.syntax : ['[', ']'];
        // DB形状で1行のみの場合、先頭に改行を追加してテキスト位置を調整
        let adjustedLabel = label;
        if (shapeId === 'database' && !label.includes('<br>')) {
            adjustedLabel = '<br>' + label;
        }
        const code = `flowchart LR\n    A${open}${adjustedLabel}${close}`;

        try {
            const id = 'shape-preview-' + Date.now();
            const { svg } = await mermaid.render(id, code);
            container.innerHTML = svg;
            // SVGのサイズを調整
            const svgEl = container.querySelector('svg');
            if (svgEl) {
                svgEl.style.maxHeight = '80px';
            }
        } catch (error) {
            container.innerHTML = `<span class="text-muted">プレビュー生成エラー</span>`;
        }
    }

    async renderConnectionPreview(container, conn, fromNode = null, toNode = null) {
        const arrow = this.getConnectionSyntax(conn);

        // ノード情報を取得
        const from = fromNode || this.nodes.find(n => n.id === conn.from);
        const to = toNode || this.nodes.find(n => n.id === conn.to);

        const fromId = from?.id || 'A';
        const fromLabel = from?.label || 'A';
        const toId = to?.id || 'B';
        const toLabel = to?.label || 'B';

        const code = `flowchart LR\n    ${fromId}[${fromLabel}] ${arrow} ${toId}[${toLabel}]`;

        try {
            const id = 'conn-preview-' + Date.now();
            const { svg } = await mermaid.render(id, code);
            container.innerHTML = svg;
            // SVGのサイズを調整
            const svgEl = container.querySelector('svg');
            if (svgEl) {
                svgEl.style.maxHeight = '60px';
            }
        } catch (error) {
            container.innerHTML = `<span class="text-muted">プレビュー生成エラー</span>`;
        }
    }

    getNodeSyntax(id, label, shapeId) {
        const shape = this.shapes.find(s => s.id === shapeId);
        const [open, close] = shape ? shape.syntax : ['[', ']'];
        return `${id}${open}${label}${close}`;
    }

    /**
     * テキスト（改行あり）をラベル（<br>タグ）に変換
     */
    textToLabel(text) {
        return text.replace(/\n/g, '<br>');
    }

    /**
     * ラベル（<br>タグ）をテキスト（改行あり）に変換
     */
    labelToText(label) {
        return label.replace(/<br\s*\/?>/gi, '\n');
    }

    /**
     * サブグラフIDを生成
     */
    generateSubgraphId() {
        const usedIds = this.subgraphs.map(s => s.id);
        let num = 1;
        while (usedIds.includes(`sg${num}`)) {
            num++;
        }
        return `sg${num}`;
    }

    /**
     * ルートレベルのサブグラフを取得
     */
    getRootSubgraphs() {
        return this.subgraphs.filter(sg => !sg.parentId);
    }

    /**
     * 指定した親の子サブグラフを取得
     */
    getChildSubgraphs(parentId) {
        return this.subgraphs.filter(sg => sg.parentId === parentId);
    }

    /**
     * ノードが所属するサブグラフを取得
     */
    getNodeSubgraph(nodeId) {
        return this.subgraphs.find(sg => sg.nodeIds.includes(nodeId));
    }

    /**
     * サブグラフを追加
     */
    addSubgraph(parentId = null) {
        const id = this.generateSubgraphId();
        const newSubgraph = {
            id,
            label: '新しいグループ',
            direction: null,
            parentId: parentId,
            nodeIds: []
        };
        this.subgraphs.push(newSubgraph);
        this.refreshEditor();
        this.onInputChange();
        // 追加直後に編集モーダルを開く
        const index = this.subgraphs.length - 1;
        this.editSubgraph(index);
    }

    /**
     * サブグラフを編集
     */
    editSubgraph(index) {
        const subgraph = this.subgraphs[index];
        if (subgraph) {
            this.showSubgraphEditModal(subgraph, index);
        }
    }

    /**
     * サブグラフを削除（子サブグラフも削除）
     */
    deleteSubgraph(index) {
        const subgraph = this.subgraphs[index];
        if (!subgraph) return;

        // 子サブグラフを再帰的に削除
        const deleteChildren = (parentId) => {
            const children = this.getChildSubgraphs(parentId);
            children.forEach(child => {
                deleteChildren(child.id);
                const childIndex = this.subgraphs.findIndex(s => s.id === child.id);
                if (childIndex !== -1) {
                    this.subgraphs.splice(childIndex, 1);
                }
            });
        };
        deleteChildren(subgraph.id);

        // 自身を削除
        this.subgraphs.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    /**
     * サブグラフ編集モーダルを表示
     */
    showSubgraphEditModal(subgraph, index) {
        // 利用可能な親サブグラフを取得（自身と子孫は除外）
        const getDescendantIds = (sgId) => {
            const ids = [sgId];
            this.getChildSubgraphs(sgId).forEach(child => {
                ids.push(...getDescendantIds(child.id));
            });
            return ids;
        };
        const excludeIds = getDescendantIds(subgraph.id);
        const availableParents = this.subgraphs.filter(sg => !excludeIds.includes(sg.id));

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-diagram-3"></i> サブグラフ編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-4">
                                <label class="form-label">ID</label>
                                <input type="text" class="form-control" id="editSubgraphId" value="${subgraph.id}">
                                <div class="form-text">ユニークな識別子</div>
                            </div>
                            <div class="col-8">
                                <label class="form-label">ラベル</label>
                                <input type="text" class="form-control" id="editSubgraphLabel" value="${subgraph.label}">
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <label class="form-label">親サブグラフ</label>
                                <select class="form-select" id="editSubgraphParent">
                                    <option value="">なし（ルートレベル）</option>
                                    ${availableParents.map(sg => `<option value="${sg.id}" ${sg.id === subgraph.parentId ? 'selected' : ''}>${sg.id} - ${sg.label}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label">方向</label>
                                <select class="form-select" id="editSubgraphDirection">
                                    <option value="" ${!subgraph.direction ? 'selected' : ''}>親と同じ</option>
                                    <option value="TD" ${subgraph.direction === 'TD' ? 'selected' : ''}>上→下 (TD)</option>
                                    <option value="LR" ${subgraph.direction === 'LR' ? 'selected' : ''}>左→右 (LR)</option>
                                    <option value="BT" ${subgraph.direction === 'BT' ? 'selected' : ''}>下→上 (BT)</option>
                                    <option value="RL" ${subgraph.direction === 'RL' ? 'selected' : ''}>右→左 (RL)</option>
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">所属ノード</label>
                            <div class="border rounded p-2" style="max-height: 200px; overflow-y: auto;">
                                ${this.nodes.map(node => {
                                    const belongsToThis = subgraph.nodeIds.includes(node.id);
                                    const belongsToOther = this.subgraphs.some(sg => sg.id !== subgraph.id && sg.nodeIds.includes(node.id));
                                    const otherSg = belongsToOther ? this.getNodeSubgraph(node.id) : null;
                                    const disabled = belongsToOther ? 'disabled' : '';
                                    const checked = belongsToThis ? 'checked' : '';
                                    return `
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="${node.id}"
                                                   id="node-${node.id}" ${checked} ${disabled}>
                                            <label class="form-check-label ${belongsToOther ? 'text-muted' : ''}" for="node-${node.id}">
                                                <span class="badge ${belongsToThis ? 'bg-primary' : 'bg-secondary'} me-1">${node.id}</span>
                                                ${node.label.replace(/<br\s*\/?>/gi, ' ')}
                                                ${belongsToOther ? `<small class="text-warning">(${otherSg.id}に所属中)</small>` : ''}
                                            </label>
                                        </div>
                                    `;
                                }).join('')}
                                ${this.nodes.length === 0 ? '<p class="text-muted mb-0">ノードがありません</p>' : ''}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">プレビュー</label>
                            <div class="border rounded p-2 bg-light">
                                <code id="subgraphCodePreview">subgraph ${subgraph.id} [${subgraph.label}]</code>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="saveSubgraphBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // プレビュー更新
        const updatePreview = () => {
            const id = modal.querySelector('#editSubgraphId').value || 'id';
            const label = modal.querySelector('#editSubgraphLabel').value || 'ラベル';
            const direction = modal.querySelector('#editSubgraphDirection').value;
            let preview = `subgraph ${id} [${label}]`;
            if (direction) {
                preview += `\n    direction ${direction}`;
            }
            modal.querySelector('#subgraphCodePreview').textContent = preview;
        };

        modal.querySelector('#editSubgraphId').addEventListener('input', updatePreview);
        modal.querySelector('#editSubgraphLabel').addEventListener('input', updatePreview);
        modal.querySelector('#editSubgraphDirection').addEventListener('change', updatePreview);

        // 保存ボタン
        modal.querySelector('#saveSubgraphBtn').addEventListener('click', () => {
            const newId = modal.querySelector('#editSubgraphId').value.trim();
            const newLabel = modal.querySelector('#editSubgraphLabel').value.trim() || '無題';
            const newParentId = modal.querySelector('#editSubgraphParent').value || null;
            const newDirection = modal.querySelector('#editSubgraphDirection').value || null;

            if (!newId) {
                this.app.showToast('IDを入力してください', 'warning');
                return;
            }

            // IDの重複チェック（自身以外）
            if (newId !== subgraph.id && this.subgraphs.some(sg => sg.id === newId)) {
                this.app.showToast('同じIDのサブグラフが既に存在します', 'warning');
                return;
            }

            // ノードIDの重複チェック
            if (this.nodes.some(n => n.id === newId)) {
                this.app.showToast('ノードIDと重複しています', 'warning');
                return;
            }

            // 選択されたノードを取得
            const selectedNodes = [];
            modal.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)').forEach(cb => {
                selectedNodes.push(cb.value);
            });

            // 親のIDが変更された場合、子サブグラフのparentIdも更新
            if (newId !== subgraph.id) {
                this.subgraphs.forEach(sg => {
                    if (sg.parentId === subgraph.id) {
                        sg.parentId = newId;
                    }
                });
            }

            subgraph.id = newId;
            subgraph.label = newLabel;
            subgraph.parentId = newParentId;
            subgraph.direction = newDirection;
            subgraph.nodeIds = selectedNodes;

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deleteNode(index) {
        const node = this.nodes[index];
        // 関連する接続も削除
        this.connections = this.connections.filter(c => c.from !== node.id && c.to !== node.id);
        // サブグラフからも削除
        this.subgraphs.forEach(sg => {
            sg.nodeIds = sg.nodeIds.filter(id => id !== node.id);
        });
        this.nodes.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    moveNodeToIndex(fromIndex, toIndex) {
        const node = this.nodes.splice(fromIndex, 1)[0];
        this.nodes.splice(toIndex, 0, node);
        this.refreshEditor();
        this.onInputChange();
    }

    moveConnectionToIndex(fromIndex, toIndex) {
        const conn = this.connections.splice(fromIndex, 1)[0];
        this.connections.splice(toIndex, 0, conn);
        this.refreshEditor();
        this.onInputChange();
    }

    addConnection() {
        const from = document.getElementById('connFrom').value;
        const to = document.getElementById('connTo').value;
        const startShape = document.getElementById('connStartShape').value;
        const lineStyle = document.getElementById('connLineStyle').value;
        const length = parseInt(document.getElementById('connLength').value);
        const endShape = document.getElementById('connEndShape').value;
        const label = document.getElementById('connLabel').value.trim();

        if (!from || !to) {
            this.app.showToast('開始と終了のノードを選択してください', 'warning');
            return;
        }

        this.connections.push({ from, to, lineStyle, length, startShape, endShape, label });
        this.refreshEditor();
        this.onInputChange();

        // ラベルをクリア
        document.getElementById('connLabel').value = '';
    }

    editConnection(index) {
        const conn = this.connections[index];
        this.showConnectionEditModal(conn, index);
    }

    showConnectionEditModal(conn, index) {
        // 旧形式から新形式への変換
        const currentLineStyle = conn.lineStyle || 'solid';
        const currentLength = conn.length || 2;
        const currentStartShape = conn.startShape || 'none';
        const currentEndShape = conn.endShape || (conn.type === 'line' ? 'none' : 'arrow');

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">接続編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-6">
                                <label class="form-label">開始ノード</label>
                                <select class="form-select" id="editConnFrom">
                                    ${this.nodes.map(n => `<option value="${n.id}" ${n.id === conn.from ? 'selected' : ''}>${n.id} (${n.label})</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label">終了ノード</label>
                                <select class="form-select" id="editConnTo">
                                    ${this.nodes.map(n => `<option value="${n.id}" ${n.id === conn.to ? 'selected' : ''}>${n.id} (${n.label})</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <label class="form-label">始点の形状</label>
                                <select class="form-select" id="editConnStartShape">
                                    ${this.endpointShapes.map(s => `<option value="${s.id}" ${s.id === currentStartShape ? 'selected' : ''}>${s.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label">終点の形状</label>
                                <select class="form-select" id="editConnEndShape">
                                    ${this.endpointShapes.map(s => `<option value="${s.id}" ${s.id === currentEndShape ? 'selected' : ''}>${s.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <label class="form-label">線のスタイル</label>
                                <select class="form-select" id="editConnLineStyle">
                                    ${this.lineStyles.map(s => `<option value="${s.id}" ${s.id === currentLineStyle ? 'selected' : ''}>${s.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label">線の長さ</label>
                                <select class="form-select" id="editConnLength">
                                    ${this.arrowLengths.map(l => `<option value="${l.id}" ${l.id === currentLength ? 'selected' : ''}>${l.name}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">ラベル（任意）</label>
                            <input type="text" class="form-control" id="editConnLabel" value="${conn.label || ''}" placeholder="Yes / No など">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">接続プレビュー</label>
                            <div id="connPreview" class="border rounded p-3 bg-light text-center">
                                <span class="text-muted">読み込み中...</span>
                            </div>
                            <div class="text-center mt-2">
                                <code id="connSyntaxPreview">${this.getConnectionSyntax({ lineStyle: currentLineStyle, length: currentLength, startShape: currentStartShape, endShape: currentEndShape })}</code>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="saveConnBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // プレビュー更新
        const fromSelect = modal.querySelector('#editConnFrom');
        const toSelect = modal.querySelector('#editConnTo');
        const startShapeSelect = modal.querySelector('#editConnStartShape');
        const endShapeSelect = modal.querySelector('#editConnEndShape');
        const lineStyleSelect = modal.querySelector('#editConnLineStyle');
        const lengthSelect = modal.querySelector('#editConnLength');
        const previewDiv = modal.querySelector('#connPreview');
        const syntaxPreview = modal.querySelector('#connSyntaxPreview');

        const updatePreview = () => {
            const fromNode = this.nodes.find(n => n.id === fromSelect.value);
            const toNode = this.nodes.find(n => n.id === toSelect.value);

            const connData = {
                lineStyle: lineStyleSelect.value,
                length: parseInt(lengthSelect.value),
                startShape: startShapeSelect.value,
                endShape: endShapeSelect.value
            };
            this.renderConnectionPreview(previewDiv, connData, fromNode, toNode);
            syntaxPreview.textContent = this.getConnectionSyntax(connData);
        };

        // 初期プレビューを描画
        updatePreview();

        fromSelect.addEventListener('change', updatePreview);
        toSelect.addEventListener('change', updatePreview);
        startShapeSelect.addEventListener('change', updatePreview);
        endShapeSelect.addEventListener('change', updatePreview);
        lineStyleSelect.addEventListener('change', updatePreview);
        lengthSelect.addEventListener('change', updatePreview);

        // 線種セレクトボックスの背景色更新
        const updateEditLineStyleColor = () => {
            lineStyleSelect.classList.remove('line-style-solid', 'line-style-dotted', 'line-style-thick');
            lineStyleSelect.classList.add(`line-style-${lineStyleSelect.value}`);
        };
        updateEditLineStyleColor();
        lineStyleSelect.addEventListener('change', updateEditLineStyleColor);

        // 保存ボタン
        modal.querySelector('#saveConnBtn').addEventListener('click', () => {
            conn.from = modal.querySelector('#editConnFrom').value;
            conn.to = modal.querySelector('#editConnTo').value;
            conn.startShape = startShapeSelect.value;
            conn.endShape = endShapeSelect.value;
            conn.lineStyle = lineStyleSelect.value;
            conn.length = parseInt(lengthSelect.value);
            conn.label = modal.querySelector('#editConnLabel').value.trim();
            // 旧形式のプロパティを削除
            delete conn.type;

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    showConnectionMatrixModal() {
        if (this.nodes.length < 2) {
            this.app.showToast('マトリックス編集には2つ以上のノードが必要です', 'warning');
            return;
        }

        // 接続の有無をマップに変換
        const connectionMap = {};
        this.connections.forEach((conn, index) => {
            const key = `${conn.from}-${conn.to}`;
            connectionMap[key] = { ...conn, index };
        });

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-grid-3x3"></i> 接続マトリックス</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted small mb-3">
                            セルをクリックして接続を追加/削除できます。行が開始ノード、列が終了ノードです。
                        </p>
                        <div class="table-responsive">
                            <table class="table table-bordered table-sm text-center" id="connectionMatrix">
                                <thead>
                                    <tr>
                                        <th class="bg-light" style="width: 80px;">From \\ To</th>
                                        ${this.nodes.map(n => `<th class="bg-light" style="min-width: 60px;">${n.id}<br><small class="text-muted">${n.label}</small></th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${this.nodes.map(fromNode => `
                                        <tr>
                                            <th class="bg-light">${fromNode.id}<br><small class="text-muted">${fromNode.label}</small></th>
                                            ${this.nodes.map(toNode => {
                                                const key = `${fromNode.id}-${toNode.id}`;
                                                const conn = connectionMap[key];
                                                const isSelf = fromNode.id === toNode.id;
                                                const syntax = conn ? this.getConnectionSyntax(conn) : '';
                                                const labelText = conn && conn.label ? `|${conn.label}|` : '';
                                                const lineStyle = conn ? (conn.lineStyle || 'solid') : '';
                                                const lineStyleClass = conn ? `line-${lineStyle}` : '';
                                                const connClass = conn ? `conn-${lineStyle}` : '';
                                                return `
                                                    <td class="matrix-cell ${connClass} ${isSelf && !conn ? 'table-warning' : ''}"
                                                        data-from="${fromNode.id}"
                                                        data-to="${toNode.id}"
                                                        style="cursor: pointer;"
                                                        title="${isSelf ? '自己接続: ' : ''}${fromNode.id} ${syntax || '→'} ${toNode.id}${labelText ? ' ' + labelText : ''}">
                                                        ${conn ? `<code class="small ${lineStyleClass}">${syntax}${labelText}</code>` : (isSelf ? '<i class="bi bi-arrow-repeat text-muted"></i>' : '')}
                                                    </td>
                                                `;
                                            }).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-3">
                            <h6>接続設定（新規追加時に適用）</h6>
                            <div class="row g-2">
                                <div class="col-3">
                                    <label class="form-label small">始点</label>
                                    <select class="form-select form-select-sm" id="matrixStartShape">
                                        ${this.endpointShapes.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="col-3">
                                    <label class="form-label small">線種</label>
                                    <select class="form-select form-select-sm" id="matrixLineStyle">
                                        ${this.lineStyles.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="col-3">
                                    <label class="form-label small">長さ</label>
                                    <select class="form-select form-select-sm" id="matrixLength">
                                        ${this.arrowLengths.map(l => `<option value="${l.id}" ${l.id === 2 ? 'selected' : ''}>${l.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="col-3">
                                    <label class="form-label small">終点</label>
                                    <select class="form-select form-select-sm" id="matrixEndShape">
                                        ${this.endpointShapes.map(s => `<option value="${s.id}" ${s.id === 'arrow' ? 'selected' : ''}>${s.name}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // セルクリックイベント
        modal.querySelectorAll('.matrix-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const from = cell.dataset.from;
                const to = cell.dataset.to;
                const key = `${from}-${to}`;
                const isSelf = from === to;

                if (connectionMap[key]) {
                    // 接続を削除
                    const oldLineStyle = connectionMap[key].lineStyle || 'solid';
                    const connIndex = this.connections.findIndex(c => c.from === from && c.to === to);
                    if (connIndex !== -1) {
                        this.connections.splice(connIndex, 1);
                        delete connectionMap[key];
                        cell.classList.remove('conn-solid', 'conn-dotted', 'conn-thick');
                        if (isSelf) {
                            cell.classList.add('table-warning');
                        }
                        cell.innerHTML = isSelf ? '<i class="bi bi-arrow-repeat text-muted"></i>' : '';
                        cell.title = `${isSelf ? '自己接続: ' : ''}${from} → ${to}`;
                    }
                } else {
                    // 接続を追加
                    const lineStyle = modal.querySelector('#matrixLineStyle').value;
                    const newConn = {
                        from,
                        to,
                        lineStyle: lineStyle,
                        length: parseInt(modal.querySelector('#matrixLength').value),
                        startShape: modal.querySelector('#matrixStartShape').value,
                        endShape: modal.querySelector('#matrixEndShape').value,
                        label: ''
                    };
                    this.connections.push(newConn);
                    connectionMap[key] = newConn;
                    const syntax = this.getConnectionSyntax(newConn);
                    cell.classList.remove('table-warning', 'conn-solid', 'conn-dotted', 'conn-thick');
                    cell.classList.add(`conn-${lineStyle}`);
                    cell.innerHTML = `<code class="small line-${lineStyle}">${syntax}</code>`;
                    cell.title = `${isSelf ? '自己接続: ' : ''}${from} ${syntax} ${to}`;
                }

                this.onInputChange();
            });
        });

        // 線種セレクトボックスの背景色更新
        const lineStyleSelect = modal.querySelector('#matrixLineStyle');
        const updateLineStyleSelectColor = () => {
            lineStyleSelect.classList.remove('line-style-solid', 'line-style-dotted', 'line-style-thick');
            lineStyleSelect.classList.add(`line-style-${lineStyleSelect.value}`);
        };
        updateLineStyleSelectColor();
        lineStyleSelect.addEventListener('change', updateLineStyleSelectColor);

        modal.addEventListener('hidden.bs.modal', () => {
            this.refreshEditor();
            modal.remove();
        });
    }

    deleteConnection(index) {
        this.connections.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    refreshEditor() {
        const container = document.getElementById('editorContainer');
        container.innerHTML = '';
        container.appendChild(this.render());
    }

    generateCode() {
        let code = `flowchart ${this.direction}\n`;

        // ノードのコード生成ヘルパー
        const generateNodeCode = (node, indent) => {
            const shape = this.shapes.find(s => s.id === node.shape);
            const [open, close] = shape ? shape.syntax : ['[', ']'];
            let label = node.label;
            // DB形状で1行のみの場合、先頭に改行を追加してテキスト位置を調整
            if (node.shape === 'database' && !label.includes('<br>')) {
                label = '<br>' + label;
            }
            return `${indent}${node.id}${open}${label}${close}\n`;
        };

        // サブグラフを再帰的に生成するヘルパー
        const generateSubgraphCode = (sg, depth) => {
            const indent = '    '.repeat(depth);
            let sgCode = `${indent}subgraph ${sg.id} [${sg.label}]\n`;

            // 方向指定
            if (sg.direction) {
                sgCode += `${indent}    direction ${sg.direction}\n`;
            }

            // このサブグラフに直接所属するノードを出力
            sg.nodeIds.forEach(nodeId => {
                const node = this.nodes.find(n => n.id === nodeId);
                if (node) {
                    sgCode += generateNodeCode(node, indent + '    ');
                }
            });

            // 子サブグラフを再帰的に出力
            const children = this.getChildSubgraphs(sg.id);
            children.forEach(child => {
                sgCode += generateSubgraphCode(child, depth + 1);
            });

            sgCode += `${indent}end\n`;
            return sgCode;
        };

        // すべてのサブグラフに所属しているノードIDを収集
        const nodesInSubgraphs = new Set();
        this.subgraphs.forEach(sg => {
            sg.nodeIds.forEach(nodeId => nodesInSubgraphs.add(nodeId));
        });

        // ルートレベルの未所属ノードを出力
        this.nodes.forEach(node => {
            if (!nodesInSubgraphs.has(node.id)) {
                code += generateNodeCode(node, '    ');
            }
        });

        // ルートレベルのサブグラフを出力
        this.getRootSubgraphs().forEach(sg => {
            code += generateSubgraphCode(sg, 1);
        });

        // 接続定義（すべてルートレベルで出力）
        this.connections.forEach(conn => {
            const arrow = this.getConnectionSyntax(conn);

            if (conn.label) {
                code += `    ${conn.from} ${arrow}|${conn.label}| ${conn.to}\n`;
            } else {
                code += `    ${conn.from} ${arrow} ${conn.to}\n`;
            }
        });

        return code;
    }

    loadTemplate(templateId) {
        // ヘルパー関数：標準的な接続を生成
        const conn = (from, to, label = '', lineStyle = 'solid', length = 2, startShape = 'none', endShape = 'arrow') => ({
            from, to, lineStyle, length, startShape, endShape, label
        });

        switch (templateId) {
            case 'simple':
                this.direction = 'TD';
                this.nodes = [
                    { id: 'A', label: '開始', shape: 'stadium' },
                    { id: 'B', label: '処理1', shape: 'rect' },
                    { id: 'C', label: '処理2', shape: 'rect' },
                    { id: 'D', label: '終了', shape: 'stadium' }
                ];
                this.connections = [
                    conn('A', 'B'),
                    conn('B', 'C'),
                    conn('C', 'D')
                ];
                this.subgraphs = [];
                break;

            case 'decision':
                this.direction = 'TD';
                this.nodes = [
                    { id: 'A', label: '開始', shape: 'stadium' },
                    { id: 'B', label: '条件', shape: 'diamond' },
                    { id: 'C', label: '処理A', shape: 'rect' },
                    { id: 'D', label: '処理B', shape: 'rect' },
                    { id: 'E', label: '終了', shape: 'stadium' }
                ];
                this.connections = [
                    conn('A', 'B'),
                    conn('B', 'C', 'Yes'),
                    conn('B', 'D', 'No'),
                    conn('C', 'E'),
                    conn('D', 'E')
                ];
                this.subgraphs = [];
                break;

            case 'auth':
                this.direction = 'TD';
                this.nodes = [
                    { id: 'Start', label: '開始', shape: 'stadium' },
                    { id: 'Input', label: 'ログイン情報入力', shape: 'rect' },
                    { id: 'Validate', label: '入力検証', shape: 'diamond' },
                    { id: 'Auth', label: '認証処理', shape: 'rect' },
                    { id: 'Check', label: '認証成功?', shape: 'diamond' },
                    { id: 'Success', label: 'ダッシュボード', shape: 'rect' },
                    { id: 'Error', label: 'エラー表示', shape: 'rect' },
                    { id: 'End', label: '終了', shape: 'stadium' }
                ];
                this.connections = [
                    conn('Start', 'Input'),
                    conn('Input', 'Validate'),
                    conn('Validate', 'Auth', '有効'),
                    conn('Validate', 'Error', '無効'),
                    conn('Auth', 'Check'),
                    conn('Check', 'Success', 'Yes'),
                    conn('Check', 'Error', 'No'),
                    conn('Success', 'End'),
                    conn('Error', 'Input', 'リトライ', 'dotted')
                ];
                this.subgraphs = [];
                break;

            case 'system':
                this.direction = 'TD';
                this.nodes = [
                    { id: 'User', label: 'ユーザー', shape: 'stadium' },
                    { id: 'Web', label: 'Webサーバー', shape: 'rect' },
                    { id: 'API', label: 'APIサーバー', shape: 'rect' },
                    { id: 'Auth', label: '認証サービス', shape: 'rect' },
                    { id: 'Cache', label: 'キャッシュ', shape: 'database' },
                    { id: 'DB', label: 'データベース', shape: 'database' },
                    { id: 'Queue', label: 'メッセージキュー', shape: 'rect' },
                    { id: 'Worker', label: 'ワーカー', shape: 'rect' }
                ];
                this.connections = [
                    conn('User', 'Web'),
                    conn('Web', 'API'),
                    conn('API', 'Auth'),
                    conn('API', 'Cache'),
                    conn('API', 'DB'),
                    conn('API', 'Queue'),
                    conn('Queue', 'Worker'),
                    conn('Worker', 'DB')
                ];
                this.subgraphs = [
                    { id: 'frontend', label: 'フロントエンド', direction: null, parentId: null, nodeIds: ['Web'] },
                    { id: 'backend', label: 'バックエンド', direction: null, parentId: null, nodeIds: ['API', 'Auth'] },
                    { id: 'data', label: 'データ層', direction: 'LR', parentId: null, nodeIds: ['Cache', 'DB'] },
                    { id: 'async', label: '非同期処理', direction: 'LR', parentId: null, nodeIds: ['Queue', 'Worker'] }
                ];
                break;
        }

        this.refreshEditor();
    }
}

// グローバルに公開
window.FlowchartEditor = FlowchartEditor;
