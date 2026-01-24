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

        // Look/Theme/Layout オプション
        this.lookOptions = [
            { id: 'classic', name: 'Classic（標準）' },
            { id: 'neo', name: 'Neo（モダン）' },
            { id: 'handDrawn', name: 'Hand Drawn（手書き風）' }
        ];
        this.themeOptions = [
            { id: 'default', name: 'Default（標準）' },
            { id: 'forest', name: 'Forest（緑）' },
            { id: 'dark', name: 'Dark（ダークモード）' },
            { id: 'neutral', name: 'Neutral（モノクロ印刷向け）' },
            { id: 'base', name: 'Base（カスタマイズ用）' }
        ];
        this.layoutOptions = [
            { id: 'dagre', name: 'Dagre（標準）' },
            { id: 'elk', name: 'ELK（高度なレイアウト）' }
        ];

        this.shapes = [
            // 基本形状
            { id: 'rect', name: '四角形', syntax: ['[', ']'], display: '四角形 [ ]' },
            { id: 'round', name: '角丸', syntax: ['(', ')'], display: '角丸 ( )' },
            { id: 'stadium', name: 'スタジアム', syntax: ['([', '])'], display: 'スタジアム ([ ])' },
            { id: 'subroutine', name: 'サブルーチン', syntax: ['[[', ']]'], display: 'サブルーチン [[ ]]' },
            { id: 'diamond', name: 'ひし形', syntax: ['{', '}'], display: 'ひし形 { }' },
            { id: 'hexagon', name: '六角形', syntax: ['{{', '}}'], display: '六角形 {{ }}' },
            { id: 'parallelogram', name: '平行四辺形', syntax: ['[/', '/]'], display: '平行四辺形 [/ /]' },
            { id: 'parallelogram-alt', name: '平行四辺形(逆)', syntax: ['[\\', '\\]'], display: 'Parallelogram Alt [\\ \\]' },
            { id: 'trapezoid', name: '台形', syntax: ['[/', '\\]'], display: '台形 [/ \\]' },
            { id: 'trapezoid-alt', name: '台形(逆)', syntax: ['[\\', '/]'], display: 'Trapezoid Alt [\\ /]' },
            { id: 'odd', name: '非対称', syntax: ['>', ']'], display: 'Odd > ]' },

            // 円形
            { id: 'circle', name: '円', syntax: ['((', '))'], display: '円 (( ))' },
            { id: 'dbl-circle', name: '二重円', syntax: ['(((', ')))'], display: 'Double Circle ((( )))' },
            { id: 'sm-circ', name: '小円', syntax: ['@{', '}'], display: 'Small Circle', isShape: true, shapeType: 'sm-circ' },
            { id: 'fr-circ', name: '枠付き円', syntax: ['@{', '}'], display: 'Framed Circle', isShape: true, shapeType: 'fr-circ' },
            { id: 'f-circ', name: '塗り円', syntax: ['@{', '}'], display: 'Filled Circle', isShape: true, shapeType: 'f-circ' },

            // データベース・ストレージ
            { id: 'database', name: 'DB (縦)', syntax: ['[(', ')]'], display: 'DB [( )]' },
            { id: 'horiz-cyl', name: 'DB (横)', syntax: ['[(-', '-)]'], display: 'Horizontal Cylinder [(- -)]' },
            { id: 'lin-cyl', name: 'Lined Document', syntax: ['@{', '}'], display: 'Lined Document', isShape: true, shapeType: 'lin-cyl' },
            { id: 'disk', name: 'Disk Storage', syntax: ['@{', '}'], display: 'Disk Storage', isShape: true, shapeType: 'disk' },
            { id: 'das', name: 'Direct Access Storage', syntax: ['@{', '}'], display: 'Direct Access Storage', isShape: true, shapeType: 'das' },
            { id: 'stored-data', name: 'Stored Data', syntax: ['@{', '}'], display: 'Stored Data', isShape: true, shapeType: 'stored-data' },
            { id: 'win-pane', name: 'Internal Storage', syntax: ['@{', '}'], display: 'Internal Storage', isShape: true, shapeType: 'win-pane' },

            // プロセス系
            { id: 'proc', name: 'Standard Process', syntax: ['@{', '}'], display: 'Standard Process', isShape: true, shapeType: 'proc' },
            { id: 'subproc', name: 'Sub Process', syntax: ['@{', '}'], display: 'Sub Process', isShape: true, shapeType: 'subproc' },
            { id: 'tag-proc', name: 'Tagged Process', syntax: ['@{', '}'], display: 'Tagged Process', isShape: true, shapeType: 'tag-proc' },
            { id: 'procs', name: 'Multi Process', syntax: ['@{', '}'], display: 'Multi Process', isShape: true, shapeType: 'procs' },
            { id: 'div-proc', name: 'Divided Process', syntax: ['@{', '}'], display: 'Divided Process', isShape: true, shapeType: 'div-proc' },
            { id: 'extract', name: 'Extraction Process', syntax: ['@{', '}'], display: 'Extraction Process', isShape: true, shapeType: 'extract' },
            { id: 'lin-proc', name: 'Lined Process', syntax: ['@{', '}'], display: 'Lined Process', isShape: true, shapeType: 'lin-proc' },

            // 入出力
            { id: 'in-out', name: 'In Out', syntax: ['@{', '}'], display: 'In Out', isShape: true, shapeType: 'in-out' },
            { id: 'out-in', name: 'Out In', syntax: ['@{', '}'], display: 'Out In', isShape: true, shapeType: 'out-in' },
            { id: 'manual-input', name: 'Manual Input', syntax: ['@{', '}'], display: 'Manual Input', isShape: true, shapeType: 'manual-input' },
            { id: 'display', name: 'Display', syntax: ['@{', '}'], display: 'Display', isShape: true, shapeType: 'display' },
            { id: 'paper-tape', name: 'Paper Tape', syntax: ['@{', '}'], display: 'Paper Tape', isShape: true, shapeType: 'paper-tape' },

            // アクション
            { id: 'manual-file', name: 'Manual File Action', syntax: ['@{', '}'], display: 'Manual File Action', isShape: true, shapeType: 'manual-file' },
            { id: 'priority', name: 'Priority Action', syntax: ['@{', '}'], display: 'Priority Action', isShape: true, shapeType: 'priority' },
            { id: 'collate', name: 'Collate Action', syntax: ['@{', '}'], display: 'Collate Action', isShape: true, shapeType: 'collate' },
            { id: 'loop-limit', name: 'Loop Limit', syntax: ['@{', '}'], display: 'Loop Limit', isShape: true, shapeType: 'loop-limit' },

            // フローコントロール
            { id: 'event', name: 'Event', syntax: ['@{', '}'], display: 'Event', isShape: true, shapeType: 'bolt' },
            { id: 'start', name: 'Start', syntax: ['@{', '}'], display: 'Start', isShape: true, shapeType: 'start' },
            { id: 'stop', name: 'Stop', syntax: ['@{', '}'], display: 'Stop', isShape: true, shapeType: 'stop' },
            { id: 'fork', name: 'Fork/Join', syntax: ['@{', '}'], display: 'Fork/Join', isShape: true, shapeType: 'fork' },
            { id: 'terminal', name: 'Terminal', syntax: ['@{', '}'], display: 'Terminal', isShape: true, shapeType: 'terminal' },
            { id: 'delay', name: 'Delay', syntax: ['@{', '}'], display: 'Delay', isShape: true, shapeType: 'delay' },
            { id: 'junction', name: 'Junction', syntax: ['@{', '}'], display: 'Junction', isShape: true, shapeType: 'junction' },
            { id: 'decision', name: 'Decision', syntax: ['@{', '}'], display: 'Decision', isShape: true, shapeType: 'diam' },

            // ドキュメント
            { id: 'doc', name: 'Document', syntax: ['@{', '}'], display: 'Document', isShape: true, shapeType: 'doc' },
            { id: 'tag-doc', name: 'Tagged Document', syntax: ['@{', '}'], display: 'Tagged Document', isShape: true, shapeType: 'tag-doc' },
            { id: 'docs', name: 'Multiple Documents', syntax: ['@{', '}'], display: 'Multiple Documents', isShape: true, shapeType: 'docs' },
            { id: 'lin-doc', name: 'Lined Document', syntax: ['@{', '}'], display: 'Lined Document', isShape: true, shapeType: 'lin-doc' },

            // コメント・注釈
            { id: 'notch-rect', name: 'Card', syntax: ['@{', '}'], display: 'Card', isShape: true, shapeType: 'notch-rect' },
            { id: 'brace-l', name: 'Comment Left', syntax: ['@{', '}'], display: 'Comment Left', isShape: true, shapeType: 'brace-l' },
            { id: 'brace-r', name: 'Comment Right', syntax: ['@{', '}'], display: 'Comment Right', isShape: true, shapeType: 'brace-r' },
            { id: 'braces', name: 'Braces', syntax: ['@{', '}'], display: 'Braces', isShape: true, shapeType: 'braces' },
            { id: 'bow-rect', name: 'Summary', syntax: ['@{', '}'], display: 'Summary', isShape: true, shapeType: 'bow-rect' },

            // 通信
            { id: 'com-link', name: 'Communication Link', syntax: ['@{', '}'], display: 'Communication Link', isShape: true, shapeType: 'bolt' },

            // 画像・アイコン
            { id: 'image', name: '画像', syntax: ['@{', '}'], display: '画像 @{ img }', isCustom: true },
            { id: 'icon', name: 'アイコン', syntax: ['@{', '}'], display: 'アイコン @{ icon }', isCustom: true }
        ];

        // アイコンの形状オプション
        this.iconForms = [
            { id: 'square', name: '四角形' },
            { id: 'circle', name: '円形' },
            { id: 'rounded', name: '角丸' }
        ];

        // ラベル位置オプション
        this.labelPositions = [
            { id: 't', name: '上' },
            { id: 'b', name: '下' }
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

        // アニメーション設定（v11.4.0以降）
        this.animateOptions = [
            { id: 'none', name: 'なし' },
            { id: 'default', name: 'アニメーション', minVersion: '11.4.0' },
            { id: 'fast', name: '高速', minVersion: '11.4.0' },
            { id: 'slow', name: '低速', minVersion: '11.4.0' }
        ];

        // 現在のMermaidバージョン（警告用）
        this.mermaidVersion = '11.4.1';

        this.templates = [
            { id: 'simple', name: 'シンプルなフロー' },
            { id: 'decision', name: '条件分岐' },
            { id: 'auth', name: 'ユーザー認証フロー' },
            { id: 'system', name: 'システム構成（サブグラフ）' },
            { id: 'techstack', name: '技術スタック（画像）' },
            { id: 'cloud', name: 'クラウド構成（アイコン）' }
        ];

        // 初期データ
        this.initDefaultData();
    }

    initDefaultData() {
        this.look = 'classic';
        this.theme = 'default';
        this.layout = 'dagre';
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

    renderAppearanceSettings() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="row g-3">
                <div class="col-4">
                    <label class="form-label">Look（描画スタイル）</label>
                    <select class="form-select form-select-sm" id="fcLook">
                        ${this.lookOptions.map(opt =>
                            `<option value="${opt.id}" ${this.look === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label">Theme（配色）</label>
                    <select class="form-select form-select-sm" id="fcTheme">
                        ${this.themeOptions.map(opt =>
                            `<option value="${opt.id}" ${this.theme === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label">Layout（配置）</label>
                    <select class="form-select form-select-sm" id="fcLayout">
                        ${this.layoutOptions.map(opt =>
                            `<option value="${opt.id}" ${this.layout === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelector('#fcLook')?.addEventListener('change', (e) => {
                this.look = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#fcTheme')?.addEventListener('change', (e) => {
                this.theme = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#fcLayout')?.addEventListener('change', (e) => {
                this.layout = e.target.value;
                this.onInputChange();
            });
        }, 0);

        return wrapper;
    }

    render() {
        const container = document.createElement('div');

        // 外観設定
        container.appendChild(this.createSection('外観設定', 'bi-palette', this.renderAppearanceSettings()));

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
                        <button class="btn btn-sm btn-outline-secondary duplicate-node" data-index="${index}" title="複製">
                            <i class="bi bi-copy"></i>
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
                    <input type="hidden" id="nodeShape" value="rect">
                    <button type="button" class="btn btn-outline-secondary btn-sm w-100" id="nodeShapeBtn">
                        <i class="bi bi-grid-3x3-gap me-1"></i><span id="nodeShapeName">四角形</span>
                    </button>
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
            wrapper.querySelectorAll('.duplicate-node').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.currentTarget.dataset.index);
                    const originalId = this.nodes[index].id;
                    const duplicated = this.duplicateNode(index);
                    this.app.showToast(`ノード "${originalId}" を複製しました → "${duplicated.id}"`, 'success');
                });
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
            const nodeShapeInput = document.getElementById('nodeShape');
            const nodeShapeBtn = document.getElementById('nodeShapeBtn');
            const nodeShapeName = document.getElementById('nodeShapeName');

            const updateNodeAddPreview = () => {
                const id = document.getElementById('nodeId')?.value || 'A';
                const rawLabel = document.getElementById('nodeLabel')?.value || '処理名';
                const label = this.textToLabel(rawLabel);
                const shape = nodeShapeInput?.value || 'rect';
                if (nodePreviewDiv) {
                    this.renderShapePreview(nodePreviewDiv, shape, label);
                }
                if (nodeSyntaxPreview) {
                    nodeSyntaxPreview.textContent = this.getNodeSyntax(id, label, shape);
                }
            };

            // 形状選択ボタン
            nodeShapeBtn?.addEventListener('click', () => {
                const currentShape = nodeShapeInput?.value || 'rect';
                this.showShapePicker(currentShape, (shapeId) => {
                    if (nodeShapeInput) nodeShapeInput.value = shapeId;
                    const shape = this.shapes.find(s => s.id === shapeId);
                    if (nodeShapeName) nodeShapeName.textContent = shape?.name || shapeId;
                    updateNodeAddPreview();
                });
            });

            // 初期プレビューを描画
            updateNodeAddPreview();

            ['nodeId', 'nodeLabel'].forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.addEventListener('input', updateNodeAddPreview);
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
                const isFromSubgraph = this.subgraphs.some(sg => sg.id === conn.from);
                const isToSubgraph = this.subgraphs.some(sg => sg.id === conn.to);
                const fromBadgeClass = isFromSubgraph ? 'subgraph-badge' : 'node-badge';
                const toBadgeClass = isToSubgraph ? 'subgraph-badge' : 'node-badge';
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content connection-item">
                        <span class="${fromBadgeClass}">${conn.from}</span>
                        <span class="arrow-badge">${this.getConnectionSyntax(conn)}</span>
                        <span class="${toBadgeClass}">${conn.to}</span>
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
                    <label class="form-label">開始</label>
                    <select class="form-select form-select-sm" id="connFrom">
                        <optgroup label="ノード">
                            ${this.nodes.map(n => `<option value="${n.id}">${n.id}</option>`).join('')}
                        </optgroup>
                        ${this.subgraphs.length > 0 ? `
                        <optgroup label="サブグラフ">
                            ${this.subgraphs.map(sg => `<option value="${sg.id}">[${sg.id}] ${sg.label}</option>`).join('')}
                        </optgroup>
                        ` : ''}
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label">終了</label>
                    <select class="form-select form-select-sm" id="connTo">
                        <optgroup label="ノード">
                            ${this.nodes.map(n => `<option value="${n.id}">${n.id}</option>`).join('')}
                        </optgroup>
                        ${this.subgraphs.length > 0 ? `
                        <optgroup label="サブグラフ">
                            ${this.subgraphs.map(sg => `<option value="${sg.id}">[${sg.id}] ${sg.label}</option>`).join('')}
                        </optgroup>
                        ` : ''}
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
            const connLabelInput = document.getElementById('connLabel');
            const updateAddConnPreview = () => {
                const fromId = document.getElementById('connFrom')?.value;
                const toId = document.getElementById('connTo')?.value;
                const fromNode = this.nodes.find(n => n.id === fromId);
                const toNode = this.nodes.find(n => n.id === toId);
                const label = connLabelInput?.value?.trim() || '';

                const conn = {
                    lineStyle: document.getElementById('connLineStyle')?.value || 'solid',
                    length: parseInt(document.getElementById('connLength')?.value) || 2,
                    startShape: document.getElementById('connStartShape')?.value || 'none',
                    endShape: document.getElementById('connEndShape')?.value || 'arrow',
                    label: label
                };
                if (connPreviewDiv) {
                    this.renderConnectionPreview(connPreviewDiv, conn, fromNode, toNode);
                }
                if (connSyntaxPreview) {
                    const arrow = this.getConnectionSyntax(conn);
                    connSyntaxPreview.textContent = label ? `${arrow}|${label}|` : arrow;
                }
            };

            // 初期プレビューを描画
            updateAddConnPreview();

            ['connFrom', 'connTo', 'connStartShape', 'connLineStyle', 'connLength', 'connEndShape'].forEach(id => {
                document.getElementById(id)?.addEventListener('change', updateAddConnPreview);
            });
            connLabelInput?.addEventListener('input', updateAddConnPreview);

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
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">ノード編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-3">
                            <div class="col-4">
                                <label class="form-label">ID</label>
                                <input type="text" class="form-control" id="editNodeId" value="${node.id}">
                                <div class="form-text">IDを変更すると接続も更新</div>
                            </div>
                            <div class="col-8">
                                <label class="form-label">ラベル <small class="text-muted">(改行可)</small></label>
                                <textarea class="form-control" id="editNodeLabel" rows="2">${this.labelToText(node.label)}</textarea>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-8">
                                <label class="form-label">形状</label>
                                <input type="hidden" id="editNodeShape" value="${node.shape}">
                                <button type="button" class="btn btn-outline-secondary w-100" id="editNodeShapeBtn">
                                    <i class="bi bi-grid-3x3-gap me-1"></i><span id="editNodeShapeName">${this.shapes.find(s => s.id === node.shape)?.name || node.shape}</span>
                                </button>
                            </div>
                            <div class="col-4">
                                <label class="form-label">所属サブグラフ</label>
                                <select class="form-select" id="editNodeSubgraph">
                                    <option value="">なし（ルート）</option>
                                    ${this.subgraphs.map(sg => {
                                        const isSelected = sg.nodeIds.includes(node.id);
                                        return `<option value="${sg.id}" ${isSelected ? 'selected' : ''}>${sg.id} (${sg.label})</option>`;
                                    }).join('')}
                                </select>
                            </div>
                        </div>

                        <!-- 画像ノード用の設定 -->
                        <div id="imageNodeSettings" class="mb-3 p-3 border rounded bg-light" style="display: ${node.shape === 'image' ? 'block' : 'none'};">
                            <h6><i class="bi bi-image"></i> 画像設定 <small class="text-warning"><i class="bi bi-exclamation-triangle"></i> v11.0.0+</small></h6>
                            <div class="row g-2">
                                <div class="col-12">
                                    <label class="form-label">画像URL</label>
                                    <input type="text" class="form-control form-control-sm" id="editNodeImgUrl"
                                           value="${node.imgUrl || ''}"
                                           placeholder="https://example.com/image.png">
                                </div>
                                <div class="col-3">
                                    <label class="form-label">ラベル位置</label>
                                    <select class="form-select form-select-sm" id="editNodeLabelPos">
                                        ${this.labelPositions.map(p => `<option value="${p.id}" ${(node.labelPos || 'b') === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                                    </select>
                                </div>
                                <div class="col-3">
                                    <label class="form-label">幅 (px)</label>
                                    <input type="number" class="form-control form-control-sm" id="editNodeImgWidth"
                                           value="${node.imgWidth || 60}" min="20" max="200">
                                </div>
                                <div class="col-3">
                                    <label class="form-label">高さ (px)</label>
                                    <input type="number" class="form-control form-control-sm" id="editNodeImgHeight"
                                           value="${node.imgHeight || 60}" min="20" max="200">
                                </div>
                                <div class="col-3">
                                    <label class="form-label">アスペクト比</label>
                                    <select class="form-select form-select-sm" id="editNodeConstraint">
                                        <option value="off" ${node.constraint === 'off' ? 'selected' : ''}>維持しない</option>
                                        <option value="on" ${(node.constraint || 'on') === 'on' ? 'selected' : ''}>維持する</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <!-- アイコンノード用の設定 -->
                        <div id="iconNodeSettings" class="mb-3 p-3 border rounded bg-light" style="display: ${node.shape === 'icon' ? 'block' : 'none'};">
                            <h6><i class="bi bi-stars"></i> アイコン設定 <small class="text-warning"><i class="bi bi-exclamation-triangle"></i> v11.0.0+</small></h6>
                            <div class="row g-2">
                                <div class="col-8">
                                    <label class="form-label">アイコン名</label>
                                    <input type="text" class="form-control form-control-sm" id="editNodeIconName"
                                           value="${node.iconName || 'fa:circle'}"
                                           placeholder="fa:database">
                                    <div class="form-text">例: fa:database, fa:server, fa:cloud</div>
                                </div>
                                <div class="col-4">
                                    <label class="form-label">形状</label>
                                    <select class="form-select form-select-sm" id="editNodeIconForm">
                                        ${this.iconForms.map(f => `<option value="${f.id}" ${(node.iconForm || 'square') === f.id ? 'selected' : ''}>${f.name}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">プレビュー</label>
                            <div id="shapePreview" class="border rounded p-3 bg-light text-center">
                                <span class="text-muted">読み込み中...</span>
                            </div>
                            <div class="text-center mt-2">
                                <code id="shapeSyntaxPreview" class="small">${this.getNodeSyntax(node.id, node.label, node.shape, node)}</code>
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

        // 要素の参照
        const shapeInput = modal.querySelector('#editNodeShape');
        const shapeBtn = modal.querySelector('#editNodeShapeBtn');
        const shapeName = modal.querySelector('#editNodeShapeName');
        const labelInput = modal.querySelector('#editNodeLabel');
        const idInput = modal.querySelector('#editNodeId');
        const previewDiv = modal.querySelector('#shapePreview');
        const syntaxPreview = modal.querySelector('#shapeSyntaxPreview');

        const imageSettings = modal.querySelector('#imageNodeSettings');
        const iconSettings = modal.querySelector('#iconNodeSettings');

        const imgUrlInput = modal.querySelector('#editNodeImgUrl');
        const labelPosSelect = modal.querySelector('#editNodeLabelPos');
        const imgWidthInput = modal.querySelector('#editNodeImgWidth');
        const imgHeightInput = modal.querySelector('#editNodeImgHeight');
        const constraintSelect = modal.querySelector('#editNodeConstraint');

        const iconNameInput = modal.querySelector('#editNodeIconName');
        const iconFormSelect = modal.querySelector('#editNodeIconForm');

        // 形状に応じた設定パネルの表示切り替え
        const updateSettingsPanels = () => {
            const shape = shapeInput.value;
            imageSettings.style.display = shape === 'image' ? 'block' : 'none';
            iconSettings.style.display = shape === 'icon' ? 'block' : 'none';
        };

        // プレビュー更新
        const updatePreview = () => {
            const id = idInput.value || 'ID';
            const shape = shapeInput.value;
            const rawLabel = labelInput.value || 'ラベル';
            const label = this.textToLabel(rawLabel);

            const nodeData = {
                imgUrl: imgUrlInput.value,
                labelPos: labelPosSelect.value,
                imgWidth: parseInt(imgWidthInput.value) || 60,
                imgHeight: parseInt(imgHeightInput.value) || 60,
                constraint: constraintSelect.value,
                iconName: iconNameInput.value,
                iconForm: iconFormSelect.value
            };

            this.renderShapePreview(previewDiv, shape, label, nodeData);
            syntaxPreview.textContent = this.getNodeSyntax(id, label, shape, nodeData);
        };

        // 初期表示
        updateSettingsPanels();
        updatePreview();

        // 形状選択ボタン
        shapeBtn.addEventListener('click', () => {
            const currentShape = shapeInput.value;
            this.showShapePicker(currentShape, (shapeId) => {
                shapeInput.value = shapeId;
                const shape = this.shapes.find(s => s.id === shapeId);
                shapeName.textContent = shape?.name || shapeId;
                updateSettingsPanels();
                updatePreview();
            });
        });

        // イベントリスナー
        labelInput.addEventListener('input', updatePreview);
        idInput.addEventListener('input', updatePreview);

        // 画像設定の変更監視
        [imgUrlInput, labelPosSelect, imgWidthInput, imgHeightInput, constraintSelect].forEach(el => {
            el.addEventListener('input', updatePreview);
            el.addEventListener('change', updatePreview);
        });

        // アイコン設定の変更監視
        [iconNameInput, iconFormSelect].forEach(el => {
            el.addEventListener('input', updatePreview);
            el.addEventListener('change', updatePreview);
        });

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

            // 画像ノード用のプロパティ
            if (newShape === 'image') {
                node.imgUrl = imgUrlInput.value;
                node.labelPos = labelPosSelect.value;
                node.imgWidth = parseInt(imgWidthInput.value) || 60;
                node.imgHeight = parseInt(imgHeightInput.value) || 60;
                node.constraint = constraintSelect.value;
            } else {
                delete node.imgUrl;
                delete node.labelPos;
                delete node.imgWidth;
                delete node.imgHeight;
                delete node.constraint;
            }

            // アイコンノード用のプロパティ
            if (newShape === 'icon') {
                node.iconName = iconNameInput.value;
                node.iconForm = iconFormSelect.value;
            } else {
                delete node.iconName;
                delete node.iconForm;
            }

            // サブグラフの所属を更新
            const newSubgraphId = modal.querySelector('#editNodeSubgraph').value;
            // まず全てのサブグラフから削除
            this.subgraphs.forEach(sg => {
                sg.nodeIds = sg.nodeIds.filter(id => id !== newId && id !== node.id);
            });
            // 新しいサブグラフに追加
            if (newSubgraphId) {
                const targetSg = this.subgraphs.find(sg => sg.id === newSubgraphId);
                if (targetSg && !targetSg.nodeIds.includes(newId)) {
                    targetSg.nodeIds.push(newId);
                }
            }

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    async renderShapePreview(container, shapeId, label, nodeData = {}) {
        let code;
        const shape = this.shapes.find(s => s.id === shapeId);

        // 画像ノードの場合
        if (shapeId === 'image') {
            const imgUrl = nodeData.imgUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/60px-React-icon.svg.png';
            const pos = nodeData.labelPos || 'b';
            const w = nodeData.imgWidth || 60;
            const h = nodeData.imgHeight || 60;
            const constraint = nodeData.constraint || 'on';
            if (constraint === 'on') {
                code = `flowchart LR\n    A@{ img: "${imgUrl}", label: "${label}", pos: "${pos}", w: ${w}, h: ${h}, constraint: "on" }`;
            } else {
                code = `flowchart LR\n    A@{ img: "${imgUrl}", label: "${label}", pos: "${pos}", w: ${w}, h: ${h} }`;
            }
        }
        // アイコンノードの場合
        else if (shapeId === 'icon') {
            const iconName = nodeData.iconName || 'fa:circle';
            const form = nodeData.iconForm || 'square';
            code = `flowchart LR\n    A@{ icon: "${iconName}", form: "${form}", label: "${label}" }`;
        }
        // @{ shape: xxx }形式のノードの場合
        else if (shape && shape.isShape && shape.shapeType) {
            code = `flowchart LR\n    A@{ shape: ${shape.shapeType}, label: "${label}" }`;
        }
        // 通常のノードの場合
        else {
            const [open, close] = shape ? shape.syntax : ['[', ']'];
            // DB形状で1行のみの場合、先頭に改行を追加してテキスト位置を調整
            let adjustedLabel = label;
            if (shapeId === 'database' && !label.includes('<br>')) {
                adjustedLabel = '<br>' + label;
            }
            code = `flowchart LR\n    A${open}${adjustedLabel}${close}`;
        }

        try {
            const id = 'shape-preview-' + Date.now();
            const { svg } = await mermaid.render(id, code);
            container.innerHTML = svg;
            // SVGのサイズを調整
            const svgEl = container.querySelector('svg');
            if (svgEl) {
                svgEl.style.maxHeight = '100px';
            }
        } catch (error) {
            container.innerHTML = `<span class="text-muted">プレビュー生成エラー: ${error.message}</span>`;
        }
    }

    // 形状選択モーダルを表示
    showShapePicker(currentShapeId, onSelect) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-grid-3x3-gap"></i> 形状を選択</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info small mb-3">
                            <i class="bi bi-info-circle"></i> <span class="text-warning">⚠️</span> マークの形状は Mermaid v11.0.0 以降で利用可能です
                        </div>
                        <div class="row g-2" id="shapeGrid">
                            ${this.shapes.map(s => {
                                const isV11Feature = s.isShape || s.isCustom;
                                return `
                                <div class="col-6 col-md-4 col-lg-3">
                                    <div class="card shape-card ${s.id === currentShapeId ? 'border-primary bg-primary-subtle' : ''}"
                                         data-shape-id="${s.id}"
                                         style="cursor: pointer; height: 120px;">
                                        <div class="card-body p-2 d-flex flex-column">
                                            <div class="shape-preview flex-grow-1 d-flex align-items-center justify-content-center"
                                                 data-shape-id="${s.id}"
                                                 style="min-height: 60px; overflow: hidden;">
                                                <span class="text-muted small">読込中...</span>
                                            </div>
                                            <div class="text-center mt-1">
                                                <small class="text-truncate d-block" title="${s.display}">
                                                    ${isV11Feature ? '<span class="text-warning">⚠️</span> ' : ''}${s.name}
                                                </small>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `}).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // 形状カードのクリックイベント
        modal.querySelectorAll('.shape-card').forEach(card => {
            card.addEventListener('click', () => {
                const shapeId = card.dataset.shapeId;
                onSelect(shapeId);
                bsModal.hide();
            });

            // ホバー効果
            card.addEventListener('mouseenter', () => {
                if (!card.classList.contains('border-primary')) {
                    card.classList.add('border-secondary', 'shadow-sm');
                }
            });
            card.addEventListener('mouseleave', () => {
                card.classList.remove('border-secondary', 'shadow-sm');
            });
        });

        // プレビューを非同期で描画
        this.renderShapePickerPreviews(modal);

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    // 形状ピッカーのプレビューを描画
    async renderShapePickerPreviews(modal) {
        const previews = modal.querySelectorAll('.shape-preview');

        for (const preview of previews) {
            const shapeId = preview.dataset.shapeId;
            try {
                await this.renderShapePreviewSmall(preview, shapeId);
            } catch (e) {
                preview.innerHTML = `<small class="text-muted">${shapeId}</small>`;
            }
        }
    }

    // 小さいプレビューを描画
    async renderShapePreviewSmall(container, shapeId) {
        let code;
        const shape = this.shapes.find(s => s.id === shapeId);
        // ラベルから括弧などの特殊文字を除去（Mermaid構文と競合するため）
        let label = shape?.name || shapeId;
        label = label.replace(/[()（）\[\]{}]/g, '').trim();

        if (shapeId === 'image') {
            code = `flowchart LR\n    A@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/40px-React-icon.svg.png", label: "${label}", pos: "b", w: 40, h: 40, constraint: "on" }`;
        } else if (shapeId === 'icon') {
            code = `flowchart LR\n    A@{ icon: "fa:star", form: "square", label: "${label}" }`;
        } else if (shape && shape.isShape && shape.shapeType) {
            code = `flowchart LR\n    A@{ shape: ${shape.shapeType}, label: "${label}" }`;
        } else {
            const [open, close] = shape ? shape.syntax : ['[', ']'];
            code = `flowchart LR\n    A${open}${label}${close}`;
        }

        try {
            const id = 'shape-picker-' + shapeId + '-' + Date.now();
            const { svg } = await mermaid.render(id, code);
            container.innerHTML = svg;
            const svgEl = container.querySelector('svg');
            if (svgEl) {
                svgEl.style.maxWidth = '100%';
                svgEl.style.maxHeight = '50px';
                svgEl.style.width = 'auto';
                svgEl.style.height = 'auto';
            }
        } catch (error) {
            container.innerHTML = `<small class="text-danger">Error</small>`;
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
        const labelPart = conn.label ? `|${conn.label}|` : '';

        const code = `flowchart LR\n    ${fromId}[${fromLabel}] ${arrow}${labelPart} ${toId}[${toLabel}]`;

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

    getNodeSyntax(id, label, shapeId, nodeData = {}) {
        const shape = this.shapes.find(s => s.id === shapeId);

        // 画像ノードの場合
        if (shapeId === 'image') {
            const imgUrl = nodeData.imgUrl || 'https://example.com/image.png';
            const pos = nodeData.labelPos || 'b';
            const w = nodeData.imgWidth || 60;
            const h = nodeData.imgHeight || 60;
            const constraint = nodeData.constraint || 'on';
            if (constraint === 'on') {
                return `${id}@{ img: "${imgUrl}", label: "${label}", pos: "${pos}", w: ${w}, h: ${h}, constraint: "on" }`;
            }
            return `${id}@{ img: "${imgUrl}", label: "${label}", pos: "${pos}", w: ${w}, h: ${h} }`;
        }

        // アイコンノードの場合
        if (shapeId === 'icon') {
            const iconName = nodeData.iconName || 'fa:circle';
            const form = nodeData.iconForm || 'square';
            return `${id}@{ icon: "${iconName}", form: "${form}", label: "${label}" }`;
        }

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

    duplicateNode(index) {
        const original = this.nodes[index];

        // 新しいIDを生成
        const newId = this.generateUniqueId(original.id);

        // ノードをディープコピー
        const duplicated = {
            ...original,
            id: newId
        };

        // 複製したノードを元のノードの直後に挿入
        this.nodes.splice(index + 1, 0, duplicated);
        this.refreshEditor();
        this.onInputChange();

        return duplicated;
    }

    generateUniqueId(baseId) {
        const usedIds = new Set(this.nodes.map(n => n.id));

        // baseId_1, baseId_2, ... の形式で試す
        let counter = 1;
        let newId = `${baseId}_${counter}`;
        while (usedIds.has(newId)) {
            counter++;
            newId = `${baseId}_${counter}`;
        }
        return newId;
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
        const currentAnimate = conn.animate || 'none';

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
                                <label class="form-label">開始</label>
                                <select class="form-select" id="editConnFrom">
                                    <optgroup label="ノード">
                                        ${this.nodes.map(n => `<option value="${n.id}" ${n.id === conn.from ? 'selected' : ''}>${n.id} (${n.label})</option>`).join('')}
                                    </optgroup>
                                    ${this.subgraphs.length > 0 ? `
                                    <optgroup label="サブグラフ">
                                        ${this.subgraphs.map(sg => `<option value="${sg.id}" ${sg.id === conn.from ? 'selected' : ''}>[${sg.id}] ${sg.label}</option>`).join('')}
                                    </optgroup>
                                    ` : ''}
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label">終了</label>
                                <select class="form-select" id="editConnTo">
                                    <optgroup label="ノード">
                                        ${this.nodes.map(n => `<option value="${n.id}" ${n.id === conn.to ? 'selected' : ''}>${n.id} (${n.label})</option>`).join('')}
                                    </optgroup>
                                    ${this.subgraphs.length > 0 ? `
                                    <optgroup label="サブグラフ">
                                        ${this.subgraphs.map(sg => `<option value="${sg.id}" ${sg.id === conn.to ? 'selected' : ''}>[${sg.id}] ${sg.label}</option>`).join('')}
                                    </optgroup>
                                    ` : ''}
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
                            <div class="col-4">
                                <label class="form-label">線のスタイル</label>
                                <select class="form-select" id="editConnLineStyle">
                                    ${this.lineStyles.map(s => `<option value="${s.id}" ${s.id === currentLineStyle ? 'selected' : ''}>${s.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-4">
                                <label class="form-label">線の長さ</label>
                                <select class="form-select" id="editConnLength">
                                    ${this.arrowLengths.map(l => `<option value="${l.id}" ${l.id === currentLength ? 'selected' : ''}>${l.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-4">
                                <label class="form-label">アニメーション</label>
                                <select class="form-select" id="editConnAnimate">
                                    ${this.animateOptions.map(a => `<option value="${a.id}" ${a.id === currentAnimate ? 'selected' : ''}>${a.name}${a.minVersion ? ' ⚠️' : ''}</option>`).join('')}
                                </select>
                                <div class="form-text text-warning small" id="animateWarning" style="display: none;">
                                    <i class="bi bi-exclamation-triangle"></i> v11.4.0以降で利用可能
                                </div>
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
        const animateSelect = modal.querySelector('#editConnAnimate');
        const animateWarning = modal.querySelector('#animateWarning');
        const previewDiv = modal.querySelector('#connPreview');
        const syntaxPreview = modal.querySelector('#connSyntaxPreview');

        const labelInput = modal.querySelector('#editConnLabel');

        // アニメーション警告の表示更新
        const updateAnimateWarning = () => {
            const animate = animateSelect.value;
            animateWarning.style.display = animate !== 'none' ? 'block' : 'none';
        };
        updateAnimateWarning();

        const updatePreview = () => {
            const fromNode = this.nodes.find(n => n.id === fromSelect.value);
            const fromSubgraph = this.subgraphs.find(sg => sg.id === fromSelect.value);
            const toNode = this.nodes.find(n => n.id === toSelect.value);
            const toSubgraph = this.subgraphs.find(sg => sg.id === toSelect.value);
            const label = labelInput.value.trim();

            // ノードまたはサブグラフの情報を渡す
            const fromItem = fromNode || (fromSubgraph ? { id: fromSubgraph.id, label: `[${fromSubgraph.label}]` } : null);
            const toItem = toNode || (toSubgraph ? { id: toSubgraph.id, label: `[${toSubgraph.label}]` } : null);

            const connData = {
                lineStyle: lineStyleSelect.value,
                length: parseInt(lengthSelect.value),
                startShape: startShapeSelect.value,
                endShape: endShapeSelect.value,
                animate: animateSelect.value,
                label: label
            };
            this.renderConnectionPreview(previewDiv, connData, fromItem, toItem);
            const arrow = this.getConnectionSyntax(connData);
            syntaxPreview.textContent = label ? `${arrow}|${label}|` : arrow;
        };

        // 初期プレビューを描画
        updatePreview();

        fromSelect.addEventListener('change', updatePreview);
        toSelect.addEventListener('change', updatePreview);
        startShapeSelect.addEventListener('change', updatePreview);
        endShapeSelect.addEventListener('change', updatePreview);
        lineStyleSelect.addEventListener('change', updatePreview);
        lengthSelect.addEventListener('change', updatePreview);
        animateSelect.addEventListener('change', () => {
            updateAnimateWarning();
            updatePreview();
        });
        labelInput.addEventListener('input', updatePreview);

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
            conn.animate = animateSelect.value;
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
        // ノードとサブグラフを統合したリストを作成
        const allItems = [
            ...this.nodes.map(n => ({ id: n.id, label: n.label, type: 'node' })),
            ...this.subgraphs.map(sg => ({ id: sg.id, label: sg.label, type: 'subgraph' }))
        ];

        if (allItems.length < 2) {
            this.app.showToast('マトリックス編集には2つ以上のノード/サブグラフが必要です', 'warning');
            return;
        }

        // 接続の有無をマップに変換
        const connectionMap = {};
        this.connections.forEach((conn, index) => {
            const key = `${conn.from}-${conn.to}`;
            connectionMap[key] = { ...conn, index };
        });

        // ヘッダーセルを生成
        const renderHeaderCell = (item) => {
            const bgClass = item.type === 'subgraph' ? 'bg-success-subtle' : 'bg-light';
            const icon = item.type === 'subgraph' ? '<i class="bi bi-diagram-3 me-1"></i>' : '';
            return `<th class="${bgClass}" style="min-width: 60px;">${icon}${item.id}<br><small class="text-muted">${item.label}</small></th>`;
        };

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-grid-3x3"></i> 接続マトリックス</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted small mb-3">
                            セルをクリックして接続を追加/削除できます。<span class="badge bg-success-subtle text-dark">緑色</span>はサブグラフです。
                        </p>
                        <div class="table-responsive">
                            <table class="table table-bordered table-sm text-center" id="connectionMatrix">
                                <thead>
                                    <tr>
                                        <th class="bg-light" style="width: 80px;">From \\ To</th>
                                        ${allItems.map(item => renderHeaderCell(item)).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${allItems.map(fromItem => `
                                        <tr>
                                            ${renderHeaderCell(fromItem)}
                                            ${allItems.map(toItem => {
                                                const key = `${fromItem.id}-${toItem.id}`;
                                                const conn = connectionMap[key];
                                                const isSelf = fromItem.id === toItem.id;
                                                const syntax = conn ? this.getConnectionSyntax(conn) : '';
                                                const labelText = conn && conn.label ? `|${conn.label}|` : '';
                                                const lineStyle = conn ? (conn.lineStyle || 'solid') : '';
                                                const lineStyleClass = conn ? `line-${lineStyle}` : '';
                                                const connClass = conn ? `conn-${lineStyle}` : '';
                                                return `
                                                    <td class="matrix-cell ${connClass} ${isSelf && !conn ? 'table-warning' : ''}"
                                                        data-from="${fromItem.id}"
                                                        data-to="${toItem.id}"
                                                        data-from-type="${fromItem.type}"
                                                        data-to-type="${toItem.type}"
                                                        style="cursor: pointer;"
                                                        title="${isSelf ? '自己接続: ' : ''}${fromItem.id} ${syntax || '→'} ${toItem.id}${labelText ? ' ' + labelText : ''}">
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
                                <div class="col-md-6">
                                    <label class="form-label small">ラベル（任意）</label>
                                    <input type="text" class="form-control form-control-sm" id="matrixLabel" placeholder="接続ラベル">
                                </div>
                            </div>
                            <p class="text-muted small mt-2 mb-0">
                                <i class="bi bi-info-circle"></i> 空セルをクリック：接続追加 / 接続済みセルをクリック：ラベル編集 / 右クリック：削除
                            </p>
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

        // セルの表示を更新するヘルパー
        const updateCellDisplay = (cell, conn, from, to) => {
            const isSelf = from === to;
            if (conn) {
                const syntax = this.getConnectionSyntax(conn);
                const labelText = conn.label ? `|${conn.label}|` : '';
                const lineStyle = conn.lineStyle || 'solid';
                cell.classList.remove('table-warning', 'conn-solid', 'conn-dotted', 'conn-thick');
                cell.classList.add(`conn-${lineStyle}`);
                cell.innerHTML = `<code class="small line-${lineStyle}">${syntax}${labelText}</code>`;
                cell.title = `${isSelf ? '自己接続: ' : ''}${from} ${syntax} ${to}${labelText ? ' ' + labelText : ''}\nクリック: ラベル編集 / 右クリック: 削除`;
            } else {
                cell.classList.remove('conn-solid', 'conn-dotted', 'conn-thick');
                if (isSelf) {
                    cell.classList.add('table-warning');
                }
                cell.innerHTML = isSelf ? '<i class="bi bi-arrow-repeat text-muted"></i>' : '';
                cell.title = `${isSelf ? '自己接続: ' : ''}${from} → ${to}`;
            }
        };

        // セルクリックイベント
        modal.querySelectorAll('.matrix-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const from = cell.dataset.from;
                const to = cell.dataset.to;
                const key = `${from}-${to}`;
                const isSelf = from === to;

                if (connectionMap[key]) {
                    // 既存の接続 - ラベルを編集
                    const conn = connectionMap[key];
                    const newLabel = prompt(`接続 ${from} → ${to} のラベルを入力してください:`, conn.label || '');
                    if (newLabel !== null) {
                        // 実際の接続を更新
                        const connIndex = this.connections.findIndex(c => c.from === from && c.to === to);
                        if (connIndex !== -1) {
                            this.connections[connIndex].label = newLabel;
                            conn.label = newLabel;
                            updateCellDisplay(cell, conn, from, to);
                            this.onInputChange();
                        }
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
                        label: modal.querySelector('#matrixLabel').value
                    };
                    this.connections.push(newConn);
                    connectionMap[key] = newConn;
                    updateCellDisplay(cell, newConn, from, to);
                    this.onInputChange();
                }
            });

            // 右クリックで削除
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const from = cell.dataset.from;
                const to = cell.dataset.to;
                const key = `${from}-${to}`;

                if (connectionMap[key]) {
                    // 接続を削除
                    const connIndex = this.connections.findIndex(c => c.from === from && c.to === to);
                    if (connIndex !== -1) {
                        this.connections.splice(connIndex, 1);
                        delete connectionMap[key];
                        updateCellDisplay(cell, null, from, to);
                        this.onInputChange();
                    }
                }
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
        let code = '';

        // Look/Theme/Layout設定がデフォルトでない場合はYAML frontmatterで出力
        const hasCustomConfig = this.look !== 'classic' || this.theme !== 'default' || this.layout !== 'dagre';
        if (hasCustomConfig) {
            code += '---\n';
            code += 'config:\n';
            if (this.look !== 'classic') {
                code += `  look: ${this.look}\n`;
            }
            if (this.theme !== 'default') {
                code += `  theme: ${this.theme}\n`;
            }
            if (this.layout !== 'dagre') {
                code += `  layout: ${this.layout}\n`;
            }
            code += '---\n';
        }

        code += `flowchart ${this.direction}\n`;

        // ノードのコード生成ヘルパー
        const generateNodeCode = (node, indent) => {
            // 画像ノードの場合
            if (node.shape === 'image') {
                const imgUrl = node.imgUrl || 'https://example.com/image.png';
                const pos = node.labelPos || 'b';
                const w = node.imgWidth || 60;
                const h = node.imgHeight || 60;
                const constraint = node.constraint || 'on';
                if (constraint === 'on') {
                    return `${indent}${node.id}@{ img: "${imgUrl}", label: "${node.label}", pos: "${pos}", w: ${w}, h: ${h}, constraint: "on" }\n`;
                }
                return `${indent}${node.id}@{ img: "${imgUrl}", label: "${node.label}", pos: "${pos}", w: ${w}, h: ${h} }\n`;
            }

            // アイコンノードの場合
            if (node.shape === 'icon') {
                const iconName = node.iconName || 'fa:circle';
                const form = node.iconForm || 'square';
                return `${indent}${node.id}@{ icon: "${iconName}", form: "${form}", label: "${node.label}" }\n`;
            }

            const shape = this.shapes.find(s => s.id === node.shape);

            // @{}形式のシェイプ（Small Circle, Framed Circle, Filled Circle, Card等）
            if (shape && shape.isShape && shape.shapeType) {
                return `${indent}${node.id}@{ shape: ${shape.shapeType}, label: "${node.label}" }\n`;
            }

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

        // アニメーション付きの接続にlinkStyleを追加
        const animatedLinks = this.connections
            .map((conn, index) => ({ conn, index }))
            .filter(({ conn }) => conn.animate && conn.animate !== 'none');

        if (animatedLinks.length > 0) {
            code += '\n    %% アニメーション設定（v11.4.0以降）\n';
            animatedLinks.forEach(({ conn, index }) => {
                if (conn.animate === 'default') {
                    code += `    linkStyle ${index} animation: dashdraw 0.5s linear infinite\n`;
                } else if (conn.animate === 'fast') {
                    code += `    linkStyle ${index} animation: dashdraw 0.2s linear infinite\n`;
                } else if (conn.animate === 'slow') {
                    code += `    linkStyle ${index} animation: dashdraw 1s linear infinite\n`;
                }
            });
        }

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

            case 'techstack':
                this.direction = 'LR';
                this.nodes = [
                    {
                        id: 'react', label: 'React', shape: 'image',
                        imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png',
                        labelPos: 'b', imgWidth: 50, imgHeight: 50
                    },
                    {
                        id: 'node', label: 'Node.js', shape: 'image',
                        imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/100px-Node.js_logo.svg.png',
                        labelPos: 'b', imgWidth: 50, imgHeight: 50
                    },
                    {
                        id: 'postgres', label: 'PostgreSQL', shape: 'image',
                        imgUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/100px-Postgresql_elephant.svg.png',
                        labelPos: 'b', imgWidth: 50, imgHeight: 50
                    }
                ];
                this.connections = [
                    conn('react', 'node', 'API'),
                    conn('node', 'postgres', 'SQL')
                ];
                this.subgraphs = [];
                break;

            case 'cloud':
                this.direction = 'LR';
                this.nodes = [
                    { id: 'user', label: 'ユーザー', shape: 'icon', iconName: 'fa:users', iconForm: 'circle' },
                    { id: 'cdn', label: 'CDN', shape: 'icon', iconName: 'fa:globe', iconForm: 'square' },
                    { id: 'lb', label: 'ロードバランサー', shape: 'icon', iconName: 'fa:balance-scale', iconForm: 'square' },
                    { id: 'web1', label: 'Web 1', shape: 'icon', iconName: 'fa:server', iconForm: 'rounded' },
                    { id: 'web2', label: 'Web 2', shape: 'icon', iconName: 'fa:server', iconForm: 'rounded' },
                    { id: 'db', label: 'データベース', shape: 'icon', iconName: 'fa:database', iconForm: 'circle' },
                    { id: 'cache', label: 'キャッシュ', shape: 'icon', iconName: 'fa:bolt', iconForm: 'square' }
                ];
                this.connections = [
                    conn('user', 'cdn'),
                    conn('cdn', 'lb'),
                    conn('lb', 'web1'),
                    conn('lb', 'web2'),
                    conn('web1', 'cache'),
                    conn('web2', 'cache'),
                    conn('cache', 'db')
                ];
                this.subgraphs = [
                    { id: 'servers', label: 'Webサーバー群', direction: 'TB', parentId: null, nodeIds: ['web1', 'web2'] }
                ];
                break;
        }

        this.refreshEditor();
    }

    /**
     * プレビューのインタラクティブ機能セットアップ
     * - ノードをドラッグして接続を追加
     * - ノードをクリックして編集
     * - 接続線をクリックして編集
     * - 右クリックで削除
     * @param {SVGElement} svgElement - プレビューのSVG要素
     */
    setupInteractivePreview(svgElement) {
        if (!svgElement) return;

        // ヒント表示を更新
        const hintElement = document.getElementById('previewHint');
        if (hintElement) {
            hintElement.innerHTML = '<i class="bi bi-info-circle"></i> ドラッグ: 接続追加 / クリック: 編集 / 右クリック: メニュー（ノード・サブグラフ・接続）';
        }

        // ドラッグ状態
        let isDragging = false;
        let hasDragged = false;
        let startNodeId = null;
        let startNodeEl = null;
        let dragLine = null;
        let connectionPreview = null; // 接続プレビューツールチップ
        let startPos = { x: 0, y: 0 };
        let mouseDownPos = { x: 0, y: 0 };
        const DRAG_THRESHOLD = 5; // ドラッグと判定する最小移動距離

        // コンテキストメニューを削除
        const removeContextMenu = () => {
            const existing = document.getElementById('preview-context-menu');
            if (existing) existing.remove();
        };

        // SVGの座標変換用
        const getMousePosition = (event) => {
            const CTM = svgElement.getScreenCTM();
            return {
                x: (event.clientX - CTM.e) / CTM.a,
                y: (event.clientY - CTM.f) / CTM.d
            };
        };

        // ノードの中心座標を取得
        const getNodeCenter = (nodeElement) => {
            const bbox = nodeElement.getBBox();
            const transform = nodeElement.getAttribute('transform');
            let tx = 0, ty = 0;
            if (transform) {
                const match = transform.match(/translate\(([\d.-]+),?\s*([\d.-]+)?\)/);
                if (match) {
                    tx = parseFloat(match[1]) || 0;
                    ty = parseFloat(match[2]) || 0;
                }
            }
            return {
                x: bbox.x + bbox.width / 2 + tx,
                y: bbox.y + bbox.height / 2 + ty
            };
        };

        // 要素のSVG座標系での境界を取得（累積変換行列を使用）
        const getElementBoundsInSvg = (element) => {
            try {
                // まず要素自体のBBoxを取得
                const bbox = element.getBBox();

                // 要素からSVGルートへの累積変換行列を取得
                const ctm = element.getCTM();
                if (!ctm) {
                    // CTMが取得できない場合は単純な計算
                    const transform = element.getAttribute('transform');
                    let tx = 0, ty = 0;
                    if (transform) {
                        const match = transform.match(/translate\(([\d.-]+),?\s*([\d.-]+)?\)/);
                        if (match) {
                            tx = parseFloat(match[1]) || 0;
                            ty = parseFloat(match[2]) || 0;
                        }
                    }
                    return {
                        left: bbox.x + tx,
                        top: bbox.y + ty,
                        right: bbox.x + bbox.width + tx,
                        bottom: bbox.y + bbox.height + ty,
                        width: bbox.width,
                        height: bbox.height
                    };
                }

                // 4隅の座標を変換
                const svgRoot = svgElement;
                const pt = svgRoot.createSVGPoint();

                // 左上
                pt.x = bbox.x;
                pt.y = bbox.y;
                const topLeft = pt.matrixTransform(ctm);

                // 右下
                pt.x = bbox.x + bbox.width;
                pt.y = bbox.y + bbox.height;
                const bottomRight = pt.matrixTransform(ctm);

                return {
                    left: Math.min(topLeft.x, bottomRight.x),
                    top: Math.min(topLeft.y, bottomRight.y),
                    right: Math.max(topLeft.x, bottomRight.x),
                    bottom: Math.max(topLeft.y, bottomRight.y),
                    width: Math.abs(bottomRight.x - topLeft.x),
                    height: Math.abs(bottomRight.y - topLeft.y)
                };
            } catch (e) {
                return null;
            }
        };

        // MermaidのノードIDを抽出（flowchart-A-0 → A）
        const extractNodeId = (element) => {
            const id = element.id || '';
            const match = id.match(/flowchart-(.+?)-\d+$/);
            if (match) return match[1];
            const dataId = element.getAttribute('data-id');
            if (dataId) return dataId;
            return null;
        };

        // 接続のIDを抽出（エッジのクラスやIDから）
        const extractEdgeInfo = (element) => {
            // 親要素も含めて探索
            let current = element;
            for (let i = 0; i < 5 && current; i++) {
                // ID属性をチェック (L-A-B, L_A_B など)
                const id = current.id || '';
                const idMatch = id.match(/^L[-_](.+?)[-_](.+?)(?:[-_]\d+)?$/);
                if (idMatch) {
                    return { from: idMatch[1], to: idMatch[2] };
                }

                // クラス属性をチェック (LE-A-B, edge-A-B など)
                const classList = current.className?.baseVal || '';
                const classPatterns = [
                    /LE[-_](\S+?)[-_](\S+?)(?:\s|$)/,
                    /edge[-_](\S+?)[-_](\S+?)(?:\s|$)/,
                    /flowchart-link[-_](\S+?)[-_](\S+?)(?:\s|$)/
                ];
                for (const pattern of classPatterns) {
                    const match = classList.match(pattern);
                    if (match) {
                        return { from: match[1], to: match[2] };
                    }
                }

                current = current.parentElement;
            }
            return null;
        };

        // 接続選択ダイアログを表示
        const showConnectionSelectDialog = (x, y, callback) => {
            removeContextMenu();

            if (this.connections.length === 0) {
                this.app.showToast('接続がありません', 'warning');
                return;
            }

            const menu = document.createElement('div');
            menu.id = 'preview-context-menu';
            menu.className = 'dropdown-menu show';
            menu.style.cssText = `position: fixed; left: ${x}px; top: ${y}px; z-index: 10000; max-height: 300px; overflow-y: auto;`;

            const header = document.createElement('h6');
            header.className = 'dropdown-header';
            header.textContent = '接続を選択';
            menu.appendChild(header);

            this.connections.forEach((conn, index) => {
                const menuItem = document.createElement('a');
                menuItem.className = 'dropdown-item';
                menuItem.href = '#';
                menuItem.innerHTML = `<i class="bi bi-arrow-right me-2"></i>${conn.from} → ${conn.to}${conn.label ? ` (${conn.label})` : ''}`;
                menuItem.addEventListener('click', (e) => {
                    e.preventDefault();
                    removeContextMenu();
                    callback(index);
                });
                menu.appendChild(menuItem);
            });

            document.body.appendChild(menu);

            setTimeout(() => {
                document.addEventListener('click', removeContextMenu, { once: true });
            }, 0);
        };

        // ドラッグ用の線を作成
        const createDragLine = () => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('stroke', '#007bff');
            line.setAttribute('stroke-width', '3');
            line.setAttribute('stroke-dasharray', '8,4');
            line.setAttribute('marker-end', 'url(#drag-arrow)');
            line.style.pointerEvents = 'none';
            return line;
        };

        // SVGの表示範囲を取得
        const getSvgBounds = () => {
            const viewBox = svgElement.getAttribute('viewBox');
            if (viewBox) {
                const [minX, minY, width, height] = viewBox.split(/\s+/).map(Number);
                return { minX, minY, maxX: minX + width, maxY: minY + height };
            }
            // viewBoxがない場合はBBoxを使用
            const bbox = svgElement.getBBox();
            return { minX: bbox.x, minY: bbox.y, maxX: bbox.x + bbox.width, maxY: bbox.y + bbox.height };
        };
        const svgBounds = getSvgBounds();

        // 削除ボタンを作成（位置をSVG範囲内にクランプ）
        const createDeleteButton = (x, y, onClick) => {
            // 削除ボタンの半径（余白込み）
            const buttonRadius = 15;

            // 位置をクランプ
            const clampedX = Math.max(svgBounds.minX + buttonRadius, Math.min(svgBounds.maxX - buttonRadius, x));
            const clampedY = Math.max(svgBounds.minY + buttonRadius, Math.min(svgBounds.maxY - buttonRadius, y));

            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'delete-button');
            g.setAttribute('transform', `translate(${clampedX}, ${clampedY})`);
            g.style.cursor = 'pointer';

            // 透明なヒットエリア（大きめ）
            const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            hitArea.setAttribute('r', '18');
            hitArea.setAttribute('fill', 'transparent');
            g.appendChild(hitArea);

            // 円形の背景
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('r', '12');
            circle.setAttribute('fill', '#dc3545');
            circle.setAttribute('stroke', '#fff');
            circle.setAttribute('stroke-width', '2');
            g.appendChild(circle);

            // × マーク
            const line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line1.setAttribute('x1', '-5');
            line1.setAttribute('y1', '-5');
            line1.setAttribute('x2', '5');
            line1.setAttribute('y2', '5');
            line1.setAttribute('stroke', '#fff');
            line1.setAttribute('stroke-width', '2.5');
            line1.setAttribute('stroke-linecap', 'round');
            g.appendChild(line1);

            const line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line2.setAttribute('x1', '5');
            line2.setAttribute('y1', '-5');
            line2.setAttribute('x2', '-5');
            line2.setAttribute('y2', '5');
            line2.setAttribute('stroke', '#fff');
            line2.setAttribute('stroke-width', '2.5');
            line2.setAttribute('stroke-linecap', 'round');
            g.appendChild(line2);

            // ホバー効果（色のみ変更）
            g.addEventListener('mouseenter', () => {
                circle.setAttribute('fill', '#c82333');
                cancelDeleteButtonRemoval();
            });
            g.addEventListener('mouseleave', () => {
                circle.setAttribute('fill', '#dc3545');
            });

            // クリック
            g.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                onClick();
            });

            return g;
        };

        // 削除ボタンを削除（遅延付き）
        let deleteButtonTimeout = null;
        const removeDeleteButtons = (immediate = false) => {
            if (deleteButtonTimeout) {
                clearTimeout(deleteButtonTimeout);
                deleteButtonTimeout = null;
            }
            if (immediate) {
                svgElement.querySelectorAll('.delete-button').forEach(btn => btn.remove());
            } else {
                deleteButtonTimeout = setTimeout(() => {
                    svgElement.querySelectorAll('.delete-button').forEach(btn => btn.remove());
                }, 300);  // 遅延を長めに
            }
        };

        // 削除ボタンの遅延削除をキャンセル
        const cancelDeleteButtonRemoval = () => {
            if (deleteButtonTimeout) {
                clearTimeout(deleteButtonTimeout);
                deleteButtonTimeout = null;
            }
        };

        // 接続プレビューツールチップを作成
        const createConnectionPreview = () => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            g.setAttribute('class', 'connection-preview');
            g.style.pointerEvents = 'none';

            // 背景の角丸矩形
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('rx', '6');
            rect.setAttribute('ry', '6');
            rect.setAttribute('fill', '#28a745');
            rect.setAttribute('fill-opacity', '0.95');
            rect.setAttribute('stroke', '#1e7e34');
            rect.setAttribute('stroke-width', '1');
            g.appendChild(rect);

            // テキスト
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('fill', 'white');
            text.setAttribute('font-size', '14');
            text.setAttribute('font-weight', 'bold');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('dominant-baseline', 'middle');
            g.appendChild(text);

            return g;
        };

        // 接続プレビューを更新
        const updateConnectionPreview = (fromId, toId, x, y) => {
            if (!connectionPreview) {
                connectionPreview = createConnectionPreview();
                svgElement.appendChild(connectionPreview);
            }

            const text = connectionPreview.querySelector('text');
            const rect = connectionPreview.querySelector('rect');

            // ノードまたはサブグラフのラベルを取得
            const fromNode = this.nodes.find(n => n.id === fromId);
            const fromSubgraph = this.subgraphs.find(sg => sg.id === fromId);
            const toNode = this.nodes.find(n => n.id === toId);
            const toSubgraph = this.subgraphs.find(sg => sg.id === toId);
            const fromLabel = fromNode ? (fromNode.label || fromId) : (fromSubgraph ? `[${fromSubgraph.label}]` : fromId);
            const toLabel = toNode ? (toNode.label || toId) : (toSubgraph ? `[${toSubgraph.label}]` : toId);

            // テキスト設定
            const displayText = `${fromLabel} → ${toLabel}`;
            text.textContent = displayText;

            // テキストの幅を取得してrectのサイズを調整
            const bbox = text.getBBox();
            const padding = 12;
            const rectWidth = bbox.width + padding * 2;
            const rectHeight = bbox.height + padding;

            rect.setAttribute('width', rectWidth);
            rect.setAttribute('height', rectHeight);
            rect.setAttribute('x', -rectWidth / 2);
            rect.setAttribute('y', -rectHeight / 2);

            // 位置を設定（マウス位置の上に表示）
            connectionPreview.setAttribute('transform', `translate(${x}, ${y - 35})`);
            connectionPreview.style.display = '';
        };

        // 接続プレビューを非表示
        const hideConnectionPreview = () => {
            if (connectionPreview) {
                connectionPreview.style.display = 'none';
            }
        };

        // 接続プレビューを削除
        const removeConnectionPreview = () => {
            if (connectionPreview) {
                connectionPreview.remove();
                connectionPreview = null;
            }
        };

        // コンテキストメニューを表示
        const showContextMenu = (x, y, items) => {
            removeContextMenu();

            const menu = document.createElement('div');
            menu.id = 'preview-context-menu';
            menu.className = 'dropdown-menu show';
            menu.style.cssText = `position: fixed; left: ${x}px; top: ${y}px; z-index: 10000;`;

            items.forEach(item => {
                if (item.divider) {
                    const divider = document.createElement('hr');
                    divider.className = 'dropdown-divider';
                    menu.appendChild(divider);
                } else {
                    const menuItem = document.createElement('a');
                    menuItem.className = 'dropdown-item';
                    menuItem.href = '#';
                    menuItem.innerHTML = `<i class="bi ${item.icon} me-2"></i>${item.label}`;
                    menuItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        removeContextMenu();
                        item.action();
                    });
                    menu.appendChild(menuItem);
                }
            });

            document.body.appendChild(menu);

            // メニュー外クリックで閉じる
            setTimeout(() => {
                document.addEventListener('click', removeContextMenu, { once: true });
            }, 0);
        };

        // 矢印マーカーを追加
        let defs = svgElement.querySelector('defs');
        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
            svgElement.insertBefore(defs, svgElement.firstChild);
        }
        if (!defs.querySelector('#drag-arrow')) {
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
            marker.setAttribute('id', 'drag-arrow');
            marker.setAttribute('viewBox', '0 0 10 10');
            marker.setAttribute('refX', '9');
            marker.setAttribute('refY', '5');
            marker.setAttribute('markerWidth', '6');
            marker.setAttribute('markerHeight', '6');
            marker.setAttribute('orient', 'auto-start-reverse');
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
            path.setAttribute('fill', '#007bff');
            marker.appendChild(path);
            defs.appendChild(marker);
        }

        // ノード要素を取得
        const nodeElements = svgElement.querySelectorAll('g.node');

        nodeElements.forEach(nodeEl => {
            const nodeId = extractNodeId(nodeEl);
            if (!nodeId) return;

            const editorNodeIndex = this.nodes.findIndex(n => n.id === nodeId);
            if (editorNodeIndex === -1) return;

            nodeEl.style.cursor = 'pointer';

            // 削除ボタン参照
            let nodeDeleteBtn = null;

            // ホバー効果
            nodeEl.addEventListener('mouseenter', () => {
                if (!isDragging) {
                    nodeEl.style.filter = 'brightness(1.1) drop-shadow(0 0 4px #007bff)';

                    // 削除ボタンを表示
                    removeDeleteButtons();
                    const bbox = nodeEl.getBBox();
                    const center = getNodeCenter(nodeEl);
                    nodeDeleteBtn = createDeleteButton(
                        center.x + bbox.width / 2 + 5,
                        center.y - bbox.height / 2 - 5,
                        () => {
                            this.deleteNode(editorNodeIndex);
                            this.app.showToast(`ノード "${nodeId}" を削除しました`, 'info');
                        }
                    );
                    svgElement.appendChild(nodeDeleteBtn);
                }
            });

            nodeEl.addEventListener('mouseleave', (e) => {
                if (!isDragging || startNodeId !== nodeId) {
                    nodeEl.style.filter = '';
                }
                // 削除ボタンに移動した場合は消さない
                const relatedTarget = e.relatedTarget;
                if (relatedTarget) {
                    // SVG要素のclosestをチェック
                    let el = relatedTarget;
                    while (el && el !== svgElement) {
                        if (el.classList && el.classList.contains('delete-button')) {
                            cancelDeleteButtonRemoval();
                            return;
                        }
                        el = el.parentElement;
                    }
                }
                // 遅延付きで削除（長めの遅延）
                removeDeleteButtons();
            });

            // mouseenterで遅延削除をキャンセル
            nodeEl.addEventListener('mouseenter', () => {
                cancelDeleteButtonRemoval();
            }, true);

            // マウスダウン
            nodeEl.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                e.stopPropagation();
                removeContextMenu();

                isDragging = true;
                hasDragged = false;
                startNodeId = nodeId;
                startNodeEl = nodeEl;
                mouseDownPos = { x: e.clientX, y: e.clientY };
                startPos = getNodeCenter(nodeEl);

                nodeEl.style.filter = 'brightness(1.2) drop-shadow(0 0 6px #007bff)';
            });

            // 右クリック（コンテキストメニュー）
            nodeEl.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                e.stopPropagation();

                showContextMenu(e.clientX, e.clientY, [
                    {
                        icon: 'bi-pencil',
                        label: 'ノードを編集',
                        action: () => this.editNode(editorNodeIndex)
                    },
                    {
                        icon: 'bi-copy',
                        label: 'ノードを複製',
                        action: () => {
                            const duplicated = this.duplicateNode(editorNodeIndex);
                            this.app.showToast(`ノード "${nodeId}" を複製しました → "${duplicated.id}"`, 'success');
                        }
                    },
                    { divider: true },
                    {
                        icon: 'bi-trash text-danger',
                        label: 'ノードを削除',
                        action: () => {
                            this.deleteNode(editorNodeIndex);
                            this.app.showToast(`ノード "${nodeId}" を削除しました`, 'info');
                        }
                    }
                ]);
            });
        });

        // サブグラフ（クラスター）要素を取得
        const extractSubgraphId = (element) => {
            // data-id 属性をチェック
            const dataId = element.getAttribute('data-id');
            if (dataId) {
                const sg = this.subgraphs.find(s => s.id === dataId);
                if (sg) return sg.id;
            }

            // 要素のIDから抽出（例: subGraph0, flowchart-sg1-0）
            const elementId = element.id || '';
            // サブグラフIDと照合
            for (const sg of this.subgraphs) {
                if (elementId.includes(sg.id)) {
                    return sg.id;
                }
            }

            // テキスト要素からサブグラフのラベル/IDを抽出（複数のセレクタを試す）
            const labelSelectors = ['.cluster-label', 'text', '.nodeLabel', 'span', 'tspan', 'foreignObject'];
            for (const selector of labelSelectors) {
                const labelEls = element.querySelectorAll(selector);
                for (const labelEl of labelEls) {
                    const text = labelEl.textContent?.trim();
                    if (text) {
                        // ラベルまたはIDと完全一致
                        const sg = this.subgraphs.find(s => s.label === text || s.id === text);
                        if (sg) return sg.id;
                        // 部分一致も試す（ラベルがテキストに含まれている場合）
                        const sgPartial = this.subgraphs.find(s => text.includes(s.label) || text.includes(s.id));
                        if (sgPartial) return sgPartial.id;
                    }
                }
            }

            // クラスター内のノードからサブグラフを特定
            const innerNodes = element.querySelectorAll('g.node');
            for (const innerNode of innerNodes) {
                const innerNodeId = extractNodeId(innerNode);
                if (innerNodeId) {
                    const parentSg = this.subgraphs.find(sg => sg.nodeIds.includes(innerNodeId));
                    if (parentSg) return parentSg.id;
                }
            }

            // SVGのクラスター要素の順序から推測（最後の手段）
            // クラスターとサブグラフの数が一致する場合のマッピング
            const allClusters = Array.from(svgElement.querySelectorAll('g.cluster'));
            const clusterIndex = allClusters.indexOf(element);

            if (clusterIndex !== -1) {
                // まず、まだマッピングされていないサブグラフを見つける
                const mappedIds = new Set();
                allClusters.forEach((c, i) => {
                    if (i < clusterIndex) {
                        // 前のクラスターで既にマッピングされたIDを記録
                        const prevId = extractSubgraphIdSimple(c);
                        if (prevId) mappedIds.add(prevId);
                    }
                });

                // まだマッピングされていないサブグラフから選ぶ
                const unmappedSubgraphs = this.subgraphs.filter(sg => !mappedIds.has(sg.id));
                if (unmappedSubgraphs.length > 0) {
                    return unmappedSubgraphs[0].id;
                }

                // フォールバック：インデックスベース
                if (clusterIndex < this.subgraphs.length) {
                    return this.subgraphs[clusterIndex].id;
                }
            }

            return null;
        };

        // シンプルな抽出（再帰を避けるため）
        const extractSubgraphIdSimple = (element) => {
            const dataId = element.getAttribute('data-id');
            if (dataId) {
                const sg = this.subgraphs.find(s => s.id === dataId);
                if (sg) return sg.id;
            }
            const elementId = element.id || '';
            for (const sg of this.subgraphs) {
                if (elementId.includes(sg.id)) {
                    return sg.id;
                }
            }
            const labelEls = element.querySelectorAll('.cluster-label, text');
            for (const labelEl of labelEls) {
                const text = labelEl.textContent?.trim();
                if (text) {
                    const sg = this.subgraphs.find(s => s.label === text || s.id === text);
                    if (sg) return sg.id;
                }
            }
            return null;
        };

        // サブグラフをSVG要素にマッピング
        const subgraphElementMap = new Map();

        // まずノードのIDセットを作成（サブグラフと区別するため）
        const nodeIdSet = new Set(this.nodes.map(n => n.id));
        const nodeLabels = new Set(this.nodes.map(n => n.label));

        // 方法1: g.cluster要素から検索
        const clusterElements = svgElement.querySelectorAll('g.cluster');
        clusterElements.forEach(clusterEl => {
            const subgraphId = extractSubgraphId(clusterEl);
            if (subgraphId && !subgraphElementMap.has(subgraphId)) {
                subgraphElementMap.set(subgraphId, clusterEl);
            }
        });

        // 方法2: すべてのg要素を検索し、サブグラフと一致するものを探す
        this.subgraphs.forEach(sg => {
            if (subgraphElementMap.has(sg.id)) return;

            // サブグラフのラベル/IDと一致するテキストを持つ要素を検索
            const allGElements = svgElement.querySelectorAll('g');
            for (const gEl of allGElements) {
                // 既にノードとして識別されている場合はスキップ
                if (gEl.classList.contains('node')) continue;

                // このg要素内のテキストをチェック
                const textEls = gEl.querySelectorAll('text, tspan, span, .nodeLabel');
                for (const textEl of textEls) {
                    const text = textEl.textContent?.trim();
                    // サブグラフのラベルまたはIDと一致
                    if (text === sg.label || text === sg.id) {
                        // このテキストがノードのラベルでないことを確認
                        if (!nodeLabels.has(text) || !nodeIdSet.has(sg.id)) {
                            // g要素またはその親でrectを持つ要素を探す
                            let targetEl = gEl;
                            // rectを持っているか確認
                            if (!targetEl.querySelector('rect, path')) {
                                // 親を探す
                                let parent = gEl.parentElement;
                                for (let i = 0; i < 3 && parent && parent !== svgElement; i++) {
                                    if (parent.tagName === 'g' && parent.querySelector(':scope > rect, :scope > path')) {
                                        targetEl = parent;
                                        break;
                                    }
                                    parent = parent.parentElement;
                                }
                            }
                            subgraphElementMap.set(sg.id, targetEl);
                            break;
                        }
                    }
                }
                if (subgraphElementMap.has(sg.id)) break;
            }
        });

        // 方法3: IDにサブグラフIDを含む要素を検索（空のサブグラフ用）
        this.subgraphs.forEach(sg => {
            if (subgraphElementMap.has(sg.id)) return;

            // flowchart-{id}-XXX 形式のIDを持つ要素を検索
            const possibleIds = [
                `flowchart-${sg.id}`,
                `subGraph${this.subgraphs.indexOf(sg)}`,
                sg.id
            ];

            for (const searchId of possibleIds) {
                const elements = svgElement.querySelectorAll(`[id*="${searchId}"]`);
                for (const el of elements) {
                    // ノード要素でないことを確認
                    if (el.classList.contains('node')) continue;
                    const isNodeElement = this.nodes.some(n => el.id && el.id.includes(`-${n.id}-`));
                    if (!isNodeElement && el.tagName === 'g') {
                        subgraphElementMap.set(sg.id, el);
                        break;
                    }
                }
                if (subgraphElementMap.has(sg.id)) break;
            }
        });

        // マッピングされたサブグラフ要素にイベントハンドラを設定
        subgraphElementMap.forEach((clusterEl, subgraphId) => {
            const subgraphIndex = this.subgraphs.findIndex(sg => sg.id === subgraphId);
            if (subgraphIndex === -1) return;

            // クリック可能領域（背景の四角形またはパス）のスタイル
            const rect = clusterEl.querySelector('rect') || clusterEl.querySelector('path');
            if (rect) {
                rect.style.cursor = 'pointer';
            }

            // ラベル部分のスタイル
            const label = clusterEl.querySelector('.cluster-label, text, span');
            if (label) {
                label.style.cursor = 'pointer';
            }

            // 要素全体をクリック可能に
            clusterEl.style.cursor = 'pointer';

            // 要素の境界ボックスとtransformを取得するヘルパー
            const getElementBounds = (el) => {
                // rectまたはpathから取得を試みる
                const shapeEl = el.querySelector('rect') || el.querySelector('path');
                const targetEl = shapeEl || el;

                // SVG座標系での境界を取得
                const bounds = getElementBoundsInSvg(targetEl);
                if (bounds) {
                    return {
                        bbox: {
                            x: bounds.left,
                            y: bounds.top,
                            width: bounds.width,
                            height: bounds.height
                        },
                        tx: 0,
                        ty: 0
                    };
                }

                // フォールバック
                let bbox;
                try {
                    bbox = targetEl.getBBox();
                } catch (e) {
                    bbox = { x: 0, y: 0, width: 50, height: 30 };
                }

                const transform = el.getAttribute('transform');
                let tx = 0, ty = 0;
                if (transform) {
                    const match = transform.match(/translate\(([\d.-]+),?\s*([\d.-]+)?\)/);
                    if (match) {
                        tx = parseFloat(match[1]) || 0;
                        ty = parseFloat(match[2]) || 0;
                    }
                }
                return { bbox, tx, ty };
            };

            // サブグラフの中心座標を取得
            const getClusterCenter = (el) => {
                const { bbox, tx, ty } = getElementBounds(el);
                return {
                    x: bbox.x + bbox.width / 2 + tx,
                    y: bbox.y + bbox.height / 2 + ty
                };
            };

            // 削除ボタン参照
            let clusterDeleteBtn = null;

            // ホバー効果
            clusterEl.addEventListener('mouseenter', (e) => {
                // 実際のノード内に入った場合は無視
                const closestNode = e.target.closest('g.node');
                if (closestNode) {
                    const nodeId = extractNodeId(closestNode);
                    if (nodeId && this.nodes.some(n => n.id === nodeId)) return;
                }

                // 遅延削除をキャンセル
                cancelDeleteButtonRemoval();

                if (!isDragging) {
                    // ホバー効果を適用
                    const effectTarget = clusterEl.querySelector('rect') || clusterEl.querySelector('path') || clusterEl;
                    if (effectTarget.style) {
                        effectTarget.style.filter = 'brightness(1.05) drop-shadow(0 0 4px #198754)';
                    }

                    // 既存の削除ボタンを即座に削除して新しいのを作成
                    removeDeleteButtons(true);
                    const { bbox, tx, ty } = getElementBounds(clusterEl);
                    clusterDeleteBtn = createDeleteButton(
                        bbox.x + bbox.width + tx - 5,
                        bbox.y + ty + 5,
                        () => {
                            const subgraph = this.subgraphs[subgraphIndex];
                            this.deleteSubgraph(subgraphIndex);
                            this.app.showToast(`サブグラフ "${subgraph.label}" を削除しました`, 'info');
                        }
                    );
                    svgElement.appendChild(clusterDeleteBtn);
                }
            });

            clusterEl.addEventListener('mouseleave', (e) => {
                if (!clusterEl.dataset.dropTarget) {
                    // ホバー効果を解除
                    const effectTarget = clusterEl.querySelector('rect') || clusterEl.querySelector('path') || clusterEl;
                    if (effectTarget.style) effectTarget.style.filter = '';
                }
                // 削除ボタンに移動した場合は消さない
                const relatedTarget = e.relatedTarget;
                if (relatedTarget) {
                    let el = relatedTarget;
                    while (el && el !== svgElement) {
                        if (el.classList && el.classList.contains('delete-button')) {
                            cancelDeleteButtonRemoval();
                            return;
                        }
                        el = el.parentElement;
                    }
                }
                // ノードに移動した場合も消さない（ノード側で処理）
                if (relatedTarget && relatedTarget.closest && relatedTarget.closest('g.node')) {
                    removeDeleteButtons();
                    return;
                }
                // 遅延付きで削除
                removeDeleteButtons();
            });

            // マウスダウン（ドラッグ開始）- サブグラフからの接続作成
            clusterEl.addEventListener('mousedown', (e) => {
                // 実際のノード（エディタのnodes配列にあるもの）のクリックと区別
                const closestNode = e.target.closest('g.node');
                if (closestNode) {
                    const nodeId = extractNodeId(closestNode);
                    // 実際のノードの場合のみスキップ
                    if (nodeId && this.nodes.some(n => n.id === nodeId)) return;
                }
                if (e.button !== 0) return;

                e.preventDefault();
                e.stopPropagation();
                removeContextMenu();

                isDragging = true;
                hasDragged = false;
                startNodeId = subgraphId;  // サブグラフIDを開始IDとして設定
                startNodeEl = clusterEl;
                mouseDownPos = { x: e.clientX, y: e.clientY };
                startPos = getClusterCenter(clusterEl);

                // ドラッグ開始時のホバー効果
                const effectTarget = clusterEl.querySelector('rect') || clusterEl.querySelector('path') || clusterEl;
                if (effectTarget.style) effectTarget.style.filter = 'brightness(1.1) drop-shadow(0 0 6px #198754)';
            });

            // クリックで編集（mouseupで判定）
            clusterEl.addEventListener('mouseup', (e) => {
                // 実際のノードのクリックと区別
                const closestNode = e.target.closest('g.node');
                if (closestNode) {
                    const nodeId = extractNodeId(closestNode);
                    if (nodeId && this.nodes.some(n => n.id === nodeId)) return;
                }
                // ドラッグ中は何もしない（接続作成になる）
                if (hasDragged) return;
                // 開始元がこのサブグラフの場合のみ編集モーダルを開く
                if (startNodeId === subgraphId && !hasDragged) {
                    this.editSubgraph(subgraphIndex);
                }
            });

            // 右クリック（コンテキストメニュー）
            clusterEl.addEventListener('contextmenu', (e) => {
                // 実際のノードの右クリックと区別
                const closestNode = e.target.closest('g.node');
                if (closestNode) {
                    const nodeId = extractNodeId(closestNode);
                    if (nodeId && this.nodes.some(n => n.id === nodeId)) return;
                }

                e.preventDefault();
                e.stopPropagation();

                const subgraph = this.subgraphs[subgraphIndex];
                showContextMenu(e.clientX, e.clientY, [
                    {
                        icon: 'bi-pencil',
                        label: 'サブグラフを編集',
                        action: () => this.editSubgraph(subgraphIndex)
                    },
                    {
                        icon: 'bi-folder-plus',
                        label: '子サブグラフを追加',
                        action: () => this.addSubgraph(subgraphId)
                    },
                    { divider: true },
                    {
                        icon: 'bi-trash text-danger',
                        label: 'サブグラフを削除',
                        action: () => {
                            this.deleteSubgraph(subgraphIndex);
                            this.app.showToast(`サブグラフ "${subgraph.label}" を削除しました`, 'info');
                        }
                    }
                ]);
            });
        });

        // エッジ（接続線）の処理
        const edgeElements = svgElement.querySelectorAll('path.flowchart-link, .edge-pattern path, g.edgePath path');
        edgeElements.forEach(edgeEl => {
            // クリック判定用の透明な太い線を追加（見た目は変えずにクリックしやすくする）
            const hitArea = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            // パスの形状をコピー
            const pathD = edgeEl.getAttribute('d');
            if (pathD) {
                hitArea.setAttribute('d', pathD);
            }
            hitArea.setAttribute('stroke', 'transparent');
            hitArea.setAttribute('stroke-width', '20');
            hitArea.setAttribute('fill', 'none');
            hitArea.setAttribute('pointer-events', 'stroke');
            hitArea.style.cursor = 'pointer';
            hitArea.classList.add('edge-hitarea');

            // 元のパスの後ろに挿入
            edgeEl.parentNode.insertBefore(hitArea, edgeEl.nextSibling);

            // 削除ボタン参照
            let edgeDeleteBtn = null;

            // パスの中点を取得
            const getPathMidpoint = (pathEl) => {
                try {
                    const pathLength = pathEl.getTotalLength();
                    const midPoint = pathEl.getPointAtLength(pathLength / 2);
                    return { x: midPoint.x, y: midPoint.y };
                } catch {
                    return null;
                }
            };

            // ホバー効果（光彩のみ）
            const addHoverEffect = (e) => {
                edgeEl.style.filter = 'drop-shadow(0 0 4px #ffc107) drop-shadow(0 0 8px #ffc107)';

                // 削除ボタンを表示
                removeDeleteButtons();
                const edgeInfo = extractEdgeInfo(edgeEl);
                const connIndex = edgeInfo ? this.connections.findIndex(
                    c => c.from === edgeInfo.from && c.to === edgeInfo.to
                ) : -1;

                if (connIndex !== -1) {
                    const midPoint = getPathMidpoint(edgeEl);
                    if (midPoint) {
                        edgeDeleteBtn = createDeleteButton(
                            midPoint.x + 15,
                            midPoint.y - 15,
                            () => {
                                const conn = this.connections[connIndex];
                                this.deleteConnection(connIndex);
                                this.app.showToast(`接続 "${conn.from} → ${conn.to}" を削除しました`, 'info');
                            }
                        );
                        svgElement.appendChild(edgeDeleteBtn);
                    }
                }
            };
            const removeHoverEffect = (e) => {
                edgeEl.style.filter = '';
                // 削除ボタンに移動した場合は消さない
                const relatedTarget = e.relatedTarget;
                if (relatedTarget && relatedTarget.closest && relatedTarget.closest('.delete-button')) {
                    return;
                }
                if (edgeDeleteBtn) {
                    edgeDeleteBtn.remove();
                    edgeDeleteBtn = null;
                }
            };

            hitArea.addEventListener('mouseenter', addHoverEffect);
            hitArea.addEventListener('mouseleave', removeHoverEffect);
            edgeEl.addEventListener('mouseenter', addHoverEffect);
            edgeEl.addEventListener('mouseleave', removeHoverEffect);
            edgeEl.style.cursor = 'pointer';
            hitArea.style.cursor = 'pointer';

            // クリックで編集（共通ハンドラー）
            const handleClick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                removeContextMenu();

                // エッジ情報の抽出を試みる
                const edgeInfo = extractEdgeInfo(edgeEl);
                if (edgeInfo) {
                    const connIndex = this.connections.findIndex(
                        c => c.from === edgeInfo.from && c.to === edgeInfo.to
                    );
                    if (connIndex !== -1) {
                        this.editConnection(connIndex);
                        return;
                    }
                }

                // 見つからない場合は選択ダイアログを表示
                if (this.connections.length === 1) {
                    this.editConnection(0);
                } else if (this.connections.length > 1) {
                    showConnectionSelectDialog(e.clientX, e.clientY, (index) => {
                        this.editConnection(index);
                    });
                } else {
                    this.app.showToast('接続がありません', 'info');
                }
            };

            edgeEl.addEventListener('click', handleClick);
            hitArea.addEventListener('click', handleClick);

            // 右クリックで削除（共通ハンドラー）
            const handleContextMenu = (e) => {
                e.preventDefault();
                e.stopPropagation();

                const edgeInfo = extractEdgeInfo(edgeEl);
                const connIndex = edgeInfo ? this.connections.findIndex(
                    c => c.from === edgeInfo.from && c.to === edgeInfo.to
                ) : -1;

                if (connIndex !== -1) {
                    // 特定できた場合は直接メニューを表示
                    showContextMenu(e.clientX, e.clientY, [
                        {
                            icon: 'bi-pencil',
                            label: '接続を編集',
                            action: () => this.editConnection(connIndex)
                        },
                        { divider: true },
                        {
                            icon: 'bi-trash text-danger',
                            label: '接続を削除',
                            action: () => {
                                const conn = this.connections[connIndex];
                                this.deleteConnection(connIndex);
                                this.app.showToast(`接続 "${conn.from} → ${conn.to}" を削除しました`, 'info');
                            }
                        }
                    ]);
                } else {
                    // 特定できない場合は選択ダイアログを表示
                    showConnectionSelectDialog(e.clientX, e.clientY, (index) => {
                        showContextMenu(e.clientX, e.clientY + 30, [
                            {
                                icon: 'bi-pencil',
                                label: '接続を編集',
                                action: () => this.editConnection(index)
                            },
                            { divider: true },
                            {
                                icon: 'bi-trash text-danger',
                                label: '接続を削除',
                                action: () => {
                                    const conn = this.connections[index];
                                    this.deleteConnection(index);
                                    this.app.showToast(`接続 "${conn.from} → ${conn.to}" を削除しました`, 'info');
                                }
                            }
                        ]);
                    });
                }
            };

            edgeEl.addEventListener('contextmenu', handleContextMenu);
            hitArea.addEventListener('contextmenu', handleContextMenu);
        });

        // マウス移動
        svgElement.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const dx = e.clientX - mouseDownPos.x;
            const dy = e.clientY - mouseDownPos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // ドラッグ閾値を超えたらドラッグ線を表示
            if (distance > DRAG_THRESHOLD && !hasDragged) {
                hasDragged = true;
                dragLine = createDragLine();
                dragLine.setAttribute('x1', startPos.x);
                dragLine.setAttribute('y1', startPos.y);
                dragLine.setAttribute('x2', startPos.x);
                dragLine.setAttribute('y2', startPos.y);
                svgElement.appendChild(dragLine);
            }

            if (!dragLine) return;

            const mousePos = getMousePosition(e);
            dragLine.setAttribute('x2', mousePos.x);
            dragLine.setAttribute('y2', mousePos.y);

            // 開始要素がノードかサブグラフか判定
            const isStartNode = this.nodes.some(n => n.id === startNodeId);
            const isStartSubgraph = this.subgraphs.some(sg => sg.id === startNodeId);

            let currentTargetId = null;

            // まず全てのハイライトをクリア
            nodeElements.forEach(nodeEl => {
                if (nodeEl.dataset.dropTarget === 'true') {
                    nodeEl.style.filter = '';
                    delete nodeEl.dataset.dropTarget;
                }
            });
            subgraphElementMap.forEach((sgEl, sgId) => {
                if (sgEl.dataset.dropTarget === 'true') {
                    const effectTarget = sgEl.querySelector('rect') || sgEl.querySelector('path') || sgEl;
                    if (effectTarget.style) effectTarget.style.filter = '';
                    delete sgEl.dataset.dropTarget;
                }
            });

            // サブグラフターゲットを検出（最も内側のサブグラフを選択）
            let candidateSubgraphs = [];
            subgraphElementMap.forEach((sgEl, sgId) => {
                if (sgId !== startNodeId) {
                    // 形状要素（rectまたはpath）を取得
                    const shapeEl = sgEl.querySelector('rect') || sgEl.querySelector('path');
                    const targetEl = shapeEl || sgEl;

                    // SVG座標系での境界を取得
                    const bounds = getElementBoundsInSvg(targetEl);
                    if (!bounds) return;

                    // 矩形の範囲内にあるかチェック
                    if (mousePos.x >= bounds.left && mousePos.x <= bounds.right &&
                        mousePos.y >= bounds.top && mousePos.y <= bounds.bottom) {
                        // 面積も計算
                        const area = bounds.width * bounds.height;
                        candidateSubgraphs.push({ sgId, sgEl, targetEl, bounds, area });
                    }
                }
            });

            // 最も小さい（内側の）サブグラフを選択
            if (candidateSubgraphs.length > 0) {
                candidateSubgraphs.sort((a, b) => a.area - b.area);
                const innermost = candidateSubgraphs[0];
                if (innermost.targetEl.style) {
                    innermost.targetEl.style.filter = 'brightness(1.1) drop-shadow(0 0 8px #28a745)';
                }
                innermost.sgEl.dataset.dropTarget = 'true';
                currentTargetId = innermost.sgId;
            }

            // ノードをドラッグしている場合、ノード内のより近いノードをターゲットとして優先
            if (isStartNode && currentTargetId) {
                let closestNodeId = null;
                let closestDist = Infinity;

                nodeElements.forEach(nodeEl => {
                    const nodeId = extractNodeId(nodeEl);
                    if (nodeId && nodeId !== startNodeId) {
                        const center = getNodeCenter(nodeEl);
                        const ddx = mousePos.x - center.x;
                        const ddy = mousePos.y - center.y;
                        const dist = Math.sqrt(ddx * ddx + ddy * ddy);
                        const bbox = nodeEl.getBBox();
                        const threshold = Math.max(bbox.width, bbox.height) / 2 + 10;

                        if (dist < threshold && dist < closestDist) {
                            closestDist = dist;
                            closestNodeId = nodeId;
                        }
                    }
                });

                // ノードがより近い場合はノードを優先（接続作成用）
                if (closestNodeId && closestDist < 30) {
                    // サブグラフのハイライトを解除
                    subgraphElementMap.forEach((sgEl, sgId) => {
                        if (sgEl.dataset.dropTarget === 'true') {
                            const effectTarget = sgEl.querySelector('rect') || sgEl.querySelector('path') || sgEl;
                            if (effectTarget.style) effectTarget.style.filter = '';
                            delete sgEl.dataset.dropTarget;
                        }
                    });

                    // ノードをハイライト
                    nodeElements.forEach(nodeEl => {
                        const nodeId = extractNodeId(nodeEl);
                        if (nodeId === closestNodeId) {
                            nodeEl.style.filter = 'brightness(1.2) drop-shadow(0 0 8px #28a745)';
                            nodeEl.dataset.dropTarget = 'true';
                            currentTargetId = closestNodeId;
                        }
                    });
                }
            }

            // サブグラフがターゲットでない場合、ノードターゲットを検出
            if (!currentTargetId) {
                nodeElements.forEach(nodeEl => {
                    const nodeId = extractNodeId(nodeEl);
                    if (nodeId && nodeId !== startNodeId && !currentTargetId) {
                        const bbox = nodeEl.getBBox();
                        const center = getNodeCenter(nodeEl);
                        const ddx = mousePos.x - center.x;
                        const ddy = mousePos.y - center.y;
                        const dist = Math.sqrt(ddx * ddx + ddy * ddy);

                        if (dist < Math.max(bbox.width, bbox.height) / 2 + 20) {
                            nodeEl.style.filter = 'brightness(1.2) drop-shadow(0 0 8px #28a745)';
                            nodeEl.dataset.dropTarget = 'true';
                            currentTargetId = nodeId;
                        }
                    }
                });
            }

            // 接続プレビューの表示/非表示
            if (currentTargetId && startNodeId) {
                updateConnectionPreview(startNodeId, currentTargetId, mousePos.x, mousePos.y);
            } else {
                hideConnectionPreview();
            }
        });

        // マウスアップ（ドラッグ終了またはクリック）
        const endDrag = (e) => {
            if (!isDragging) return;

            // ドラッグ線を削除
            if (dragLine) {
                dragLine.remove();
                dragLine = null;
            }

            // 接続プレビューを削除
            removeConnectionPreview();

            // ターゲットノードを検出
            let targetNodeId = null;
            nodeElements.forEach(nodeEl => {
                if (nodeEl.dataset.dropTarget === 'true') {
                    targetNodeId = extractNodeId(nodeEl);
                    delete nodeEl.dataset.dropTarget;
                }
                nodeEl.style.filter = '';
            });

            // ターゲットサブグラフを検出（ノードがターゲットでない場合）
            if (!targetNodeId) {
                subgraphElementMap.forEach((sgEl, sgId) => {
                    if (sgEl.dataset.dropTarget === 'true') {
                        targetNodeId = sgId;
                        delete sgEl.dataset.dropTarget;
                    }
                    const effectTarget = sgEl.querySelector('rect') || sgEl.querySelector('path') || sgEl;
                    if (effectTarget.style) effectTarget.style.filter = '';
                });
            }

            // ドラッグした場合の処理
            if (hasDragged && targetNodeId && startNodeId && targetNodeId !== startNodeId) {
                // 開始要素がノードかサブグラフか判定
                const isStartNode = this.nodes.some(n => n.id === startNodeId);
                const isStartSubgraph = this.subgraphs.some(sg => sg.id === startNodeId);

                // ターゲットがノードかサブグラフか判定
                const isTargetNode = this.nodes.some(n => n.id === targetNodeId);
                const isTargetSubgraph = this.subgraphs.some(sg => sg.id === targetNodeId);

                // ノード → サブグラフ: ノードをサブグラフに移動
                if (isStartNode && isTargetSubgraph) {
                    const targetSubgraph = this.subgraphs.find(sg => sg.id === targetNodeId);

                    // 他のサブグラフから削除
                    this.subgraphs.forEach(sg => {
                        const idx = sg.nodeIds.indexOf(startNodeId);
                        if (idx !== -1) {
                            sg.nodeIds.splice(idx, 1);
                        }
                    });

                    // ターゲットサブグラフに追加
                    if (!targetSubgraph.nodeIds.includes(startNodeId)) {
                        targetSubgraph.nodeIds.push(startNodeId);
                    }

                    this.refreshEditor();
                    this.onInputChange();
                    this.app.showToast(`ノード "${startNodeId}" を "${targetSubgraph.label}" に移動しました`, 'success');
                }
                // サブグラフ → サブグラフ: サブグラフをネスト
                else if (isStartSubgraph && isTargetSubgraph) {
                    const startSubgraph = this.subgraphs.find(sg => sg.id === startNodeId);

                    // 循環参照チェック（ターゲットが開始サブグラフの子孫でないか）
                    const isDescendant = (parentId, checkId) => {
                        const children = this.subgraphs.filter(sg => sg.parentId === parentId);
                        for (const child of children) {
                            if (child.id === checkId) return true;
                            if (isDescendant(child.id, checkId)) return true;
                        }
                        return false;
                    };

                    if (isDescendant(startNodeId, targetNodeId)) {
                        this.app.showToast('循環参照になるため移動できません', 'warning');
                    } else {
                        startSubgraph.parentId = targetNodeId;
                        const targetSubgraph = this.subgraphs.find(sg => sg.id === targetNodeId);

                        this.refreshEditor();
                        this.onInputChange();
                        this.app.showToast(`サブグラフ "${startSubgraph.label}" を "${targetSubgraph.label}" の中に移動しました`, 'success');
                    }
                }
                // それ以外: 接続を追加
                else {
                    const existingConn = this.connections.find(
                        c => c.from === startNodeId && c.to === targetNodeId
                    );

                    if (!existingConn) {
                        this.connections.push({
                            from: startNodeId,
                            to: targetNodeId,
                            lineStyle: 'solid',
                            length: 2,
                            startShape: 'none',
                            endShape: 'arrow',
                            label: ''
                        });

                        this.refreshEditor();
                        this.onInputChange();
                        this.app.showToast(`接続を追加: ${startNodeId} → ${targetNodeId}`, 'success');
                    } else {
                        this.app.showToast('この接続は既に存在します', 'warning');
                    }
                }
            }
            // ノードを空の場所にドロップした場合: サブグラフから出す
            else if (hasDragged && !targetNodeId && startNodeId) {
                const isStartNode = this.nodes.some(n => n.id === startNodeId);
                const isStartSubgraph = this.subgraphs.some(sg => sg.id === startNodeId);

                if (isStartNode) {
                    // ノードが所属しているサブグラフを探す
                    let removedFrom = null;
                    this.subgraphs.forEach(sg => {
                        const idx = sg.nodeIds.indexOf(startNodeId);
                        if (idx !== -1) {
                            sg.nodeIds.splice(idx, 1);
                            removedFrom = sg;
                        }
                    });

                    if (removedFrom) {
                        this.refreshEditor();
                        this.onInputChange();
                        this.app.showToast(`ノード "${startNodeId}" を "${removedFrom.label}" から出しました`, 'success');
                    }
                } else if (isStartSubgraph) {
                    // サブグラフをルートレベルに移動
                    const startSubgraph = this.subgraphs.find(sg => sg.id === startNodeId);
                    if (startSubgraph && startSubgraph.parentId) {
                        const oldParent = this.subgraphs.find(sg => sg.id === startSubgraph.parentId);
                        startSubgraph.parentId = null;

                        this.refreshEditor();
                        this.onInputChange();
                        this.app.showToast(`サブグラフ "${startSubgraph.label}" を "${oldParent?.label || 'サブグラフ'}" から出しました`, 'success');
                    }
                }
            }
            // クリックの場合: ノードを編集
            else if (!hasDragged && startNodeId) {
                const nodeIndex = this.nodes.findIndex(n => n.id === startNodeId);
                if (nodeIndex !== -1) {
                    this.editNode(nodeIndex);
                }
            }

            isDragging = false;
            hasDragged = false;
            startNodeId = null;
            startNodeEl = null;
        };

        svgElement.addEventListener('mouseup', endDrag);
        svgElement.addEventListener('mouseleave', endDrag);

        // SVG全体の右クリックメニューを無効化
        svgElement.addEventListener('contextmenu', (e) => {
            // 何もない場所の右クリックは無効化
            if (e.target === svgElement) {
                e.preventDefault();
            }
        });

        // マッチしなかったサブグラフ用のフローティングボタンを追加
        const matchedIds = new Set(subgraphElementMap.keys());
        this.addUnmatchedSubgraphButtons(svgElement, matchedIds);
    }

    /**
     * SVGクラスタにマッチしなかったサブグラフ用のボタンを追加
     * @param {SVGElement} svgElement - SVG要素
     * @param {Set} matchedIds - マッチしたサブグラフIDのセット
     */
    addUnmatchedSubgraphButtons(svgElement, matchedIds) {
        // プレビューコンテナのパネルを取得
        const previewContainer = document.getElementById('previewContainer');
        let floatingPanel = previewContainer?.querySelector('.unmatched-subgraphs-panel');

        if (this.subgraphs.length === 0) {
            // サブグラフがない場合はパネルを非表示
            if (floatingPanel) floatingPanel.style.display = 'none';
            return;
        }

        // マッチしなかったサブグラフ
        const unmatchedSubgraphs = this.subgraphs.filter(sg => !matchedIds.has(sg.id));

        if (unmatchedSubgraphs.length === 0) {
            // 全てマッチした場合はパネルを非表示
            if (floatingPanel) floatingPanel.style.display = 'none';
            return;
        }

        // フローティングパネルがなければ作成
        if (!floatingPanel) {
            floatingPanel = document.createElement('div');
            floatingPanel.className = 'unmatched-subgraphs-panel';
            floatingPanel.innerHTML = `
                <div class="panel-header">
                    <i class="bi bi-exclamation-triangle text-warning"></i>
                    <span>空のサブグラフ</span>
                </div>
                <div class="panel-body"></div>
            `;
            previewContainer.appendChild(floatingPanel);
        }

        const panelBody = floatingPanel.querySelector('.panel-body');
        panelBody.innerHTML = '';

        unmatchedSubgraphs.forEach((sg, i) => {
            const sgIndex = this.subgraphs.findIndex(s => s.id === sg.id);
            const btn = document.createElement('div');
            btn.className = 'subgraph-btn';
            btn.innerHTML = `
                <span class="subgraph-label">${sg.label || sg.id}</span>
                <div class="subgraph-actions">
                    <button class="btn btn-sm btn-outline-primary edit-btn" title="編集">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-btn" title="削除">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `;

            btn.querySelector('.edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.editSubgraph(sgIndex);
            });

            btn.querySelector('.delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteSubgraph(sgIndex);
                this.app.showToast(`サブグラフ "${sg.label}" を削除しました`, 'info');
            });

            // ラベルクリックでも編集
            btn.querySelector('.subgraph-label').addEventListener('click', () => {
                this.editSubgraph(sgIndex);
            });

            panelBody.appendChild(btn);
        });

        floatingPanel.style.display = 'block';
    }
}

// グローバルに公開
window.FlowchartEditor = FlowchartEditor;
