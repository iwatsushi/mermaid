/**
 * 状態遷移図エディター
 */
class StateEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.states = [];
        this.transitions = [];

        this.stateTypes = [
            { id: 'normal', name: '通常' },
            { id: 'start', name: '開始状態' },
            { id: 'end', name: '終了状態' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプルな状態遷移' },
            { id: 'order', name: '注文ステータス' },
            { id: 'task', name: 'タスク管理' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
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

    render() {
        const container = document.createElement('div');

        // 状態一覧
        container.appendChild(this.createSection('状態', 'bi-circle', this.renderStateList()));

        // 遷移一覧
        container.appendChild(this.createSection('遷移', 'bi-arrow-right', this.renderTransitionList()));

        return container;
    }

    renderStateList() {
        const wrapper = document.createElement('div');

        const list = this.createItemList(
            this.states,
            (state, index) => `
                <div class="item-content">
                    <span class="badge bg-primary me-2">${state.id}</span>
                    <span>${state.label}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-outline-primary edit-state" data-index="${index}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-state" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `,
            '状態がありません'
        );
        wrapper.appendChild(list);

        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2">
                <div class="col-6">
                    <label class="form-label">ID</label>
                    <input type="text" class="form-control form-control-sm" id="stateId" placeholder="State1">
                </div>
                <div class="col-6">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="stateLabel" placeholder="状態名">
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addStateBtn">
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
        }, 0);

        return wrapper;
    }

    renderTransitionList() {
        const wrapper = document.createElement('div');

        const list = this.createItemList(
            this.transitions,
            (trans, index) => `
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
            `,
            '遷移がありません'
        );
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
            wrapper.querySelector('#addTransBtn')?.addEventListener('click', () => this.addTransition());
            wrapper.querySelectorAll('.edit-trans').forEach(btn => {
                btn.addEventListener('click', (e) => this.editTransition(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-trans').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteTransition(parseInt(e.currentTarget.dataset.index)));
            });
        }, 0);

        return wrapper;
    }

    addState() {
        const id = document.getElementById('stateId').value.trim();
        const label = document.getElementById('stateLabel').value.trim();

        if (!id) {
            this.app.showToast('IDを入力してください', 'warning');
            return;
        }

        if (this.states.some(s => s.id === id)) {
            this.app.showToast('同じIDの状態が既に存在します', 'warning');
            return;
        }

        this.states.push({ id, label: label || id, type: 'normal' });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('stateId').value = '';
        document.getElementById('stateLabel').value = '';
    }

    editState(index) {
        const state = this.states[index];
        const newLabel = prompt('新しいラベル:', state.label);
        if (newLabel !== null) {
            state.label = newLabel;
            this.refreshEditor();
            this.onInputChange();
        }
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
        let code = 'stateDiagram-v2\n';

        // 状態定義
        this.states.forEach(state => {
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
