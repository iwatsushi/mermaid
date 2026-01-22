/**
 * 状態遷移図エディター
 */
class StateEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.states = [];
        this.transitions = [];

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

        this.stateTypes = [
            { id: 'normal', name: '通常', description: '標準の状態ノード', syntax: '' },
            { id: 'fork', name: 'フォーク', description: '並行処理の開始点（黒い横棒）', syntax: '<<fork>>' },
            { id: 'join', name: 'ジョイン', description: '並行処理の合流点（黒い横棒）', syntax: '<<join>>' },
            { id: 'choice', name: '選択', description: '条件分岐点（菱形）', syntax: '<<choice>>' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプルな状態遷移' },
            { id: 'order', name: '注文ステータス' },
            { id: 'task', name: 'タスク管理' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.look = 'classic';
        this.theme = 'default';
        this.layout = 'dagre';
        this.states = [
            { id: 'Idle', label: '待機中', type: 'normal' },
            { id: 'Processing', label: '処理中', type: 'normal' },
            { id: 'Complete', label: '完了', type: 'normal' }
        ];
        this.transitions = [
            { from: '[*]', to: 'Idle', label: '' },
            { from: 'Idle', to: 'Processing', label: '開始' },
            { from: 'Processing', to: 'Complete', label: '完了' },
            { from: 'Complete', to: '[*]', label: '' }
        ];
    }

    renderAppearanceSettings() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="row g-3">
                <div class="col-4">
                    <label class="form-label">Look（描画スタイル）</label>
                    <select class="form-select form-select-sm" id="stateLook">
                        ${this.lookOptions.map(opt =>
                            `<option value="${opt.id}" ${this.look === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label">Theme（配色）</label>
                    <select class="form-select form-select-sm" id="stateTheme">
                        ${this.themeOptions.map(opt =>
                            `<option value="${opt.id}" ${this.theme === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label">Layout（配置）</label>
                    <select class="form-select form-select-sm" id="stateLayout">
                        ${this.layoutOptions.map(opt =>
                            `<option value="${opt.id}" ${this.layout === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelector('#stateLook')?.addEventListener('change', (e) => {
                this.look = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#stateTheme')?.addEventListener('change', (e) => {
                this.theme = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#stateLayout')?.addEventListener('change', (e) => {
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

        // 状態一覧
        container.appendChild(this.createSection('状態', 'bi-circle', this.renderStateList()));

        // 遷移一覧
        container.appendChild(this.createSection('遷移', 'bi-arrow-right', this.renderTransitionList()));

        return container;
    }

    renderStateList() {
        const wrapper = document.createElement('div');

        // 状態リスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.states.length === 0) {
            list.innerHTML = '<div class="item-list-empty">状態がありません</div>';
        } else {
            this.states.forEach((state, index) => {
                const stateType = this.stateTypes.find(t => t.id === (state.type || 'normal'));
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge bg-primary me-2">${state.id}</span>
                        <span>${state.label}</span>
                        ${stateType && stateType.id !== 'normal' ? `<span class="badge bg-secondary ms-2">${stateType.name}</span>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-state" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-state" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                list.appendChild(itemEl);
            });
        }
        wrapper.appendChild(list);

        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2">
                <div class="col-4">
                    <label class="form-label">ID</label>
                    <input type="text" class="form-control form-control-sm" id="stateId" placeholder="State1">
                </div>
                <div class="col-4">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="stateLabel" placeholder="状態名">
                </div>
                <div class="col-4">
                    <label class="form-label">種類</label>
                    <select class="form-select form-select-sm" id="stateType">
                        ${this.stateTypes.map(t => `<option value="${t.id}" title="${t.description}">${t.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-text mt-1 mb-2">
                <strong>種類:</strong>
                フォーク/ジョイン = 並行処理、
                選択 = 条件分岐（菱形）
            </div>
            <button class="btn btn-primary btn-sm btn-add" id="addStateBtn">
                <i class="bi bi-plus"></i> 状態を追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addStateBtn')?.addEventListener('click', () => this.addState());
            wrapper.querySelectorAll('.edit-state').forEach(btn => {
                btn.addEventListener('click', (e) => this.editState(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-state').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteState(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveState(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveState(fromIndex, toIndex) {
        const [moved] = this.states.splice(fromIndex, 1);
        this.states.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    renderTransitionList() {
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

        // 遷移リスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.transitions.length === 0) {
            list.innerHTML = '<div class="item-list-empty">遷移がありません</div>';
        } else {
            this.transitions.forEach((trans, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content connection-item">
                        <span class="node-badge">${trans.from}</span>
                        <span class="arrow-badge">--></span>
                        <span class="node-badge">${trans.to}</span>
                        ${trans.label ? `<small class="text-muted">: ${trans.label}</small>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-trans" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-trans" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                list.appendChild(itemEl);
            });
        }
        wrapper.appendChild(list);

        const stateOptions = [
            '<option value="[*]">[*] 開始/終了</option>',
            ...this.states.map(s => `<option value="${s.id}">${s.id}</option>`)
        ].join('');

        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2">
                <div class="col-4">
                    <label class="form-label">From</label>
                    <select class="form-select form-select-sm" id="transFrom">
                        ${stateOptions}
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label">To</label>
                    <select class="form-select form-select-sm" id="transTo">
                        ${stateOptions}
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="transLabel" placeholder="イベント">
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addTransBtn">
                <i class="bi bi-plus"></i> 遷移を追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#openMatrixBtn')?.addEventListener('click', () => this.showTransitionMatrixModal());
            wrapper.querySelector('#addTransBtn')?.addEventListener('click', () => this.addTransition());
            wrapper.querySelectorAll('.edit-trans').forEach(btn => {
                btn.addEventListener('click', (e) => this.editTransition(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-trans').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteTransition(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveTransition(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveTransition(fromIndex, toIndex) {
        const [moved] = this.transitions.splice(fromIndex, 1);
        this.transitions.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    showTransitionMatrixModal() {
        const allStates = [
            { id: '[*]', label: '開始/終了' },
            ...this.states
        ];

        // 遷移マップを作成
        const transitionMap = {};
        this.transitions.forEach((trans, index) => {
            const key = `${trans.from}-${trans.to}`;
            transitionMap[key] = { ...trans, index };
        });

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-grid-3x3"></i> 遷移マトリックス</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-muted small mb-3">
                            セルをクリックして遷移を追加/編集。右クリックで削除。
                        </p>
                        <div class="table-responsive">
                            <table class="table table-bordered table-sm text-center">
                                <thead>
                                    <tr>
                                        <th class="bg-light">From \\ To</th>
                                        ${allStates.map(s => `<th class="bg-light">${s.id}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${allStates.map(fromState => `
                                        <tr>
                                            <th class="bg-light">${fromState.id}</th>
                                            ${allStates.map(toState => {
                                                const key = `${fromState.id}-${toState.id}`;
                                                const trans = transitionMap[key];
                                                const isSelf = fromState.id === toState.id && fromState.id !== '[*]';
                                                return `
                                                    <td class="matrix-cell ${trans ? 'table-success' : ''} ${isSelf ? 'table-secondary' : ''}"
                                                        data-from="${fromState.id}"
                                                        data-to="${toState.id}"
                                                        style="cursor: pointer;"
                                                        title="${fromState.id} → ${toState.id}${trans && trans.label ? ': ' + trans.label : ''}">
                                                        ${trans ? `<i class="bi bi-check text-success"></i>${trans.label ? '<br><small>' + trans.label + '</small>' : ''}` : ''}
                                                    </td>
                                                `;
                                            }).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        <div class="mt-3">
                            <label class="form-label small">新規遷移のラベル（任意）</label>
                            <input type="text" class="form-control form-control-sm" id="matrixLabel" placeholder="イベント名">
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
        const updateCellDisplay = (cell, trans, from, to) => {
            if (trans) {
                cell.classList.add('table-success');
                cell.innerHTML = `<i class="bi bi-check text-success"></i>${trans.label ? '<br><small>' + trans.label + '</small>' : ''}`;
                cell.title = `${from} → ${to}${trans.label ? ': ' + trans.label : ''}\nクリック: ラベル編集 / 右クリック: 削除`;
            } else {
                cell.classList.remove('table-success');
                cell.innerHTML = '';
                cell.title = `${from} → ${to}`;
            }
        };

        // セルクリックイベント
        modal.querySelectorAll('.matrix-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const from = cell.dataset.from;
                const to = cell.dataset.to;
                const key = `${from}-${to}`;

                if (transitionMap[key]) {
                    // 既存の遷移 - ラベル編集
                    const trans = transitionMap[key];
                    const newLabel = prompt(`遷移 ${from} → ${to} のラベルを入力:`, trans.label || '');
                    if (newLabel !== null) {
                        const transIndex = this.transitions.findIndex(t => t.from === from && t.to === to);
                        if (transIndex !== -1) {
                            this.transitions[transIndex].label = newLabel;
                            trans.label = newLabel;
                            updateCellDisplay(cell, trans, from, to);
                            this.onInputChange();
                        }
                    }
                } else {
                    // 新規遷移を追加
                    const label = modal.querySelector('#matrixLabel').value.trim();
                    const newTrans = { from, to, label };
                    this.transitions.push(newTrans);
                    transitionMap[key] = newTrans;
                    updateCellDisplay(cell, newTrans, from, to);
                    this.onInputChange();
                }
            });

            // 右クリックで削除
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const from = cell.dataset.from;
                const to = cell.dataset.to;
                const key = `${from}-${to}`;

                if (transitionMap[key]) {
                    const transIndex = this.transitions.findIndex(t => t.from === from && t.to === to);
                    if (transIndex !== -1) {
                        this.transitions.splice(transIndex, 1);
                        delete transitionMap[key];
                        updateCellDisplay(cell, null, from, to);
                        this.onInputChange();
                    }
                }
            });
        });

        modal.addEventListener('hidden.bs.modal', () => {
            this.refreshEditor();
            modal.remove();
        });
    }

    addState() {
        const id = document.getElementById('stateId').value.trim();
        const label = document.getElementById('stateLabel').value.trim();
        const type = document.getElementById('stateType').value;

        if (!id) {
            this.app.showToast('IDを入力してください', 'warning');
            return;
        }

        if (this.states.some(s => s.id === id)) {
            this.app.showToast('同じIDの状態が既に存在します', 'warning');
            return;
        }

        this.states.push({ id, label: label || id, type });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('stateId').value = '';
        document.getElementById('stateLabel').value = '';
    }

    editState(index) {
        const state = this.states[index];

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-circle"></i> 状態の編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ID</label>
                            <input type="text" class="form-control" id="editStateId" value="${state.id}">
                            <div class="form-text">英数字のみ推奨。遷移で参照されます。</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">ラベル（表示名）</label>
                            <input type="text" class="form-control" id="editStateLabel" value="${state.label || ''}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">種類</label>
                            <select class="form-select" id="editStateType">
                                ${this.stateTypes.map(t => `
                                    <option value="${t.id}" ${(state.type || 'normal') === t.id ? 'selected' : ''}>
                                        ${t.name} - ${t.description}
                                    </option>
                                `).join('')}
                            </select>
                            <div class="form-text">
                                <strong>フォーク</strong>: 並行処理の分岐点（黒い横棒）<br>
                                <strong>ジョイン</strong>: 並行処理の合流点（黒い横棒）<br>
                                <strong>選択</strong>: 条件分岐（菱形で表示）
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="saveStateBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#saveStateBtn').addEventListener('click', () => {
            const newId = modal.querySelector('#editStateId').value.trim();
            const newLabel = modal.querySelector('#editStateLabel').value.trim();
            const newType = modal.querySelector('#editStateType').value;

            if (!newId) {
                this.app.showToast('IDを入力してください', 'warning');
                return;
            }

            // IDが変更された場合、遷移も更新
            if (newId !== state.id) {
                this.transitions.forEach(trans => {
                    if (trans.from === state.id) trans.from = newId;
                    if (trans.to === state.id) trans.to = newId;
                });
            }

            state.id = newId;
            state.label = newLabel || newId;
            state.type = newType;

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deleteState(index) {
        const state = this.states[index];
        this.transitions = this.transitions.filter(t => t.from !== state.id && t.to !== state.id);
        this.states.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    addTransition() {
        const from = document.getElementById('transFrom').value;
        const to = document.getElementById('transTo').value;
        const label = document.getElementById('transLabel').value.trim();

        this.transitions.push({ from, to, label });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('transLabel').value = '';
    }

    editTransition(index) {
        const trans = this.transitions[index];
        const newLabel = prompt('新しいラベル:', trans.label);
        if (newLabel !== null) {
            trans.label = newLabel;
            this.refreshEditor();
            this.onInputChange();
        }
    }

    deleteTransition(index) {
        this.transitions.splice(index, 1);
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

        code += 'stateDiagram-v2\n';

        // 状態定義
        this.states.forEach(state => {
            const stateType = this.stateTypes.find(t => t.id === (state.type || 'normal'));

            // 特殊な状態タイプ（fork, join, choice）の場合
            if (stateType && stateType.syntax) {
                code += `    state ${state.id} ${stateType.syntax}\n`;
            }

            // ラベルがIDと異なる場合は表示名を設定
            if (state.label && state.label !== state.id) {
                code += `    ${state.id} : ${state.label}\n`;
            }
        });

        code += '\n';

        // 遷移定義
        this.transitions.forEach(trans => {
            if (trans.label) {
                code += `    ${trans.from} --> ${trans.to} : ${trans.label}\n`;
            } else {
                code += `    ${trans.from} --> ${trans.to}\n`;
            }
        });

        return code;
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'simple':
                this.states = [
                    { id: 'Idle', label: '待機中', type: 'normal' },
                    { id: 'Active', label: 'アクティブ', type: 'normal' }
                ];
                this.transitions = [
                    { from: '[*]', to: 'Idle', label: '' },
                    { from: 'Idle', to: 'Active', label: '開始' },
                    { from: 'Active', to: 'Idle', label: '停止' },
                    { from: 'Active', to: '[*]', label: '終了' }
                ];
                break;

            case 'order':
                this.states = [
                    { id: 'Pending', label: '保留中', type: 'normal' },
                    { id: 'Confirmed', label: '確定', type: 'normal' },
                    { id: 'Processing', label: '処理中', type: 'normal' },
                    { id: 'Shipped', label: '発送済', type: 'normal' },
                    { id: 'Delivered', label: '配達完了', type: 'normal' },
                    { id: 'Cancelled', label: 'キャンセル', type: 'normal' }
                ];
                this.transitions = [
                    { from: '[*]', to: 'Pending', label: '' },
                    { from: 'Pending', to: 'Confirmed', label: '確認' },
                    { from: 'Pending', to: 'Cancelled', label: 'キャンセル' },
                    { from: 'Confirmed', to: 'Processing', label: '処理開始' },
                    { from: 'Processing', to: 'Shipped', label: '発送' },
                    { from: 'Shipped', to: 'Delivered', label: '配達' },
                    { from: 'Delivered', to: '[*]', label: '' },
                    { from: 'Cancelled', to: '[*]', label: '' }
                ];
                break;

            case 'task':
                this.states = [
                    { id: 'Todo', label: 'TODO', type: 'normal' },
                    { id: 'InProgress', label: '進行中', type: 'normal' },
                    { id: 'Review', label: 'レビュー中', type: 'normal' },
                    { id: 'Done', label: '完了', type: 'normal' }
                ];
                this.transitions = [
                    { from: '[*]', to: 'Todo', label: '' },
                    { from: 'Todo', to: 'InProgress', label: '着手' },
                    { from: 'InProgress', to: 'Review', label: 'レビュー依頼' },
                    { from: 'Review', to: 'InProgress', label: '差し戻し' },
                    { from: 'Review', to: 'Done', label: '承認' },
                    { from: 'Done', to: '[*]', label: '' }
                ];
                break;
        }

        this.refreshEditor();
    }
}

window.StateEditor = StateEditor;
