/**
 * アーキテクチャ図エディター
 */
class ArchitectureEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.groups = [];
        this.services = [];
        this.connections = [];

        this.iconOptions = [
            { id: 'cloud', name: 'Cloud' },
            { id: 'database', name: 'Database' },
            { id: 'server', name: 'Server' },
            { id: 'disk', name: 'Disk' },
            { id: 'internet', name: 'Internet' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプル' },
            { id: 'threetiered', name: '3層アーキテクチャ' },
            { id: 'microservices', name: 'マイクロサービス' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.groups = [
            { id: 'cloud', label: 'Cloud', icon: 'cloud' }
        ];
        this.services = [
            { id: 'web', label: 'Web Server', icon: 'server', group: 'cloud' },
            { id: 'api', label: 'API Server', icon: 'server', group: 'cloud' },
            { id: 'db', label: 'Database', icon: 'database', group: 'cloud' }
        ];
        this.connections = [
            { from: 'web', to: 'api', direction: 'LR' },
            { from: 'api', to: 'db', direction: 'LR' }
        ];
    }

    render() {
        const container = document.createElement('div');

        // 注意メッセージ
        const warning = document.createElement('div');
        warning.className = 'alert alert-info alert-sm mb-3';
        warning.innerHTML = '<i class="bi bi-info-circle"></i> Architecture図は Mermaid v10.9.0 以降で利用可能です（ベータ版）';
        container.appendChild(warning);

        // グループ
        container.appendChild(this.createSection('グループ', 'bi-collection', this.renderGroupList()));

        // サービス
        container.appendChild(this.createSection('サービス', 'bi-server', this.renderServiceList()));

        // 接続
        container.appendChild(this.createSection('接続', 'bi-arrow-left-right', this.renderConnectionList()));

        return container;
    }

    renderGroupList() {
        const wrapper = document.createElement('div');

        // グループリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.groups.length === 0) {
            list.innerHTML = '<div class="item-list-empty">グループがありません</div>';
        } else {
            this.groups.forEach((group, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge bg-secondary me-2">${group.icon}</span>
                        <span>${group.id}</span>
                        ${group.label !== group.id ? `<small class="text-muted ms-2">(${group.label})</small>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-group" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-group" data-index="${index}">
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
                    <input type="text" class="form-control form-control-sm" id="groupId" placeholder="cloud">
                </div>
                <div class="col-4">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="groupLabel" placeholder="Cloud">
                </div>
                <div class="col-4">
                    <label class="form-label">アイコン</label>
                    <select class="form-select form-select-sm" id="groupIcon">
                        ${this.iconOptions.map(i => `<option value="${i.id}">${i.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addGroupBtn">
                <i class="bi bi-plus"></i> グループを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addGroupBtn')?.addEventListener('click', () => this.addGroup());
            wrapper.querySelectorAll('.edit-group').forEach(btn => {
                btn.addEventListener('click', (e) => this.editGroup(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-group').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteGroup(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveGroup(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveGroup(fromIndex, toIndex) {
        const [moved] = this.groups.splice(fromIndex, 1);
        this.groups.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    editGroup(index) {
        const group = this.groups[index];
        const newLabel = prompt('グループラベル:', group.label);
        if (newLabel !== null) {
            group.label = newLabel;
            this.refreshEditor();
            this.onInputChange();
        }
    }

    renderServiceList() {
        const wrapper = document.createElement('div');

        // サービスリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.services.length === 0) {
            list.innerHTML = '<div class="item-list-empty">サービスがありません</div>';
        } else {
            this.services.forEach((svc, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge bg-primary me-2">${svc.id}</span>
                        <span>${svc.label}</span>
                        <small class="text-muted ms-2">[${svc.group}]</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-svc" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-svc" data-index="${index}">
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
                <div class="col-3">
                    <label class="form-label">ID</label>
                    <input type="text" class="form-control form-control-sm" id="svcId" placeholder="web">
                </div>
                <div class="col-3">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="svcLabel" placeholder="Web Server">
                </div>
                <div class="col-3">
                    <label class="form-label">アイコン</label>
                    <select class="form-select form-select-sm" id="svcIcon">
                        ${this.iconOptions.map(i => `<option value="${i.id}">${i.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">グループ</label>
                    <select class="form-select form-select-sm" id="svcGroup">
                        ${this.groups.map(g => `<option value="${g.id}">${g.id}</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addSvcBtn">
                <i class="bi bi-plus"></i> サービスを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addSvcBtn')?.addEventListener('click', () => this.addService());
            wrapper.querySelectorAll('.edit-svc').forEach(btn => {
                btn.addEventListener('click', (e) => this.editService(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-svc').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteService(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveService(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveService(fromIndex, toIndex) {
        const [moved] = this.services.splice(fromIndex, 1);
        this.services.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    editService(index) {
        const svc = this.services[index];
        const newLabel = prompt('サービスラベル:', svc.label);
        if (newLabel !== null) {
            svc.label = newLabel;
            this.refreshEditor();
            this.onInputChange();
        }
    }

    renderConnectionList() {
        const wrapper = document.createElement('div');

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
                        <span class="arrow-badge">--></span>
                        <span class="node-badge">${conn.to}</span>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-danger delete-conn" data-index="${index}">
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
                <div class="col-6">
                    <label class="form-label">From</label>
                    <select class="form-select form-select-sm" id="connFrom">
                        ${this.services.map(s => `<option value="${s.id}">${s.id}</option>`).join('')}
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label">To</label>
                    <select class="form-select form-select-sm" id="connTo">
                        ${this.services.map(s => `<option value="${s.id}">${s.id}</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addConnBtn">
                <i class="bi bi-plus"></i> 接続を追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addConnBtn')?.addEventListener('click', () => this.addConnection());
            wrapper.querySelectorAll('.delete-conn').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteConnection(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveConnection(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveConnection(fromIndex, toIndex) {
        const [moved] = this.connections.splice(fromIndex, 1);
        this.connections.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    addGroup() {
        const id = document.getElementById('groupId').value.trim();
        const label = document.getElementById('groupLabel').value.trim() || id;
        const icon = document.getElementById('groupIcon').value;

        if (!id) {
            this.app.showToast('IDを入力してください', 'warning');
            return;
        }

        if (this.groups.some(g => g.id === id)) {
            this.app.showToast('同じIDのグループが既に存在します', 'warning');
            return;
        }

        this.groups.push({ id, label, icon });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('groupId').value = '';
        document.getElementById('groupLabel').value = '';
    }

    deleteGroup(index) {
        const group = this.groups[index];
        // グループに属するサービスも削除
        this.services = this.services.filter(s => s.group !== group.id);
        this.groups.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    addService() {
        const id = document.getElementById('svcId').value.trim();
        const label = document.getElementById('svcLabel').value.trim() || id;
        const icon = document.getElementById('svcIcon').value;
        const group = document.getElementById('svcGroup').value;

        if (!id) {
            this.app.showToast('IDを入力してください', 'warning');
            return;
        }

        if (this.services.some(s => s.id === id)) {
            this.app.showToast('同じIDのサービスが既に存在します', 'warning');
            return;
        }

        this.services.push({ id, label, icon, group });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('svcId').value = '';
        document.getElementById('svcLabel').value = '';
    }

    deleteService(index) {
        const svc = this.services[index];
        // 関連する接続も削除
        this.connections = this.connections.filter(c => c.from !== svc.id && c.to !== svc.id);
        this.services.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    addConnection() {
        const from = document.getElementById('connFrom').value;
        const to = document.getElementById('connTo').value;

        if (from === to) {
            this.app.showToast('同じサービスへの接続はできません', 'warning');
            return;
        }

        this.connections.push({ from, to, direction: 'LR' });
        this.refreshEditor();
        this.onInputChange();
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
        let code = 'architecture-beta\n';

        // グループ定義
        this.groups.forEach(group => {
            code += `    group ${group.id}(${group.icon})[${group.label}]\n`;
        });

        code += '\n';

        // サービス定義
        this.services.forEach(svc => {
            code += `    service ${svc.id}(${svc.icon})[${svc.label}] in ${svc.group}\n`;
        });

        code += '\n';

        // 接続定義
        this.connections.forEach(conn => {
            code += `    ${conn.from}:R --> L:${conn.to}\n`;
        });

        return code;
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'simple':
                this.groups = [
                    { id: 'cloud', label: 'Cloud', icon: 'cloud' }
                ];
                this.services = [
                    { id: 'web', label: 'Web', icon: 'server', group: 'cloud' },
                    { id: 'db', label: 'DB', icon: 'database', group: 'cloud' }
                ];
                this.connections = [
                    { from: 'web', to: 'db', direction: 'LR' }
                ];
                break;

            case 'threetiered':
                this.groups = [
                    { id: 'frontend', label: 'Frontend', icon: 'cloud' },
                    { id: 'backend', label: 'Backend', icon: 'cloud' },
                    { id: 'data', label: 'Data Layer', icon: 'cloud' }
                ];
                this.services = [
                    { id: 'web', label: 'Web App', icon: 'server', group: 'frontend' },
                    { id: 'api', label: 'API Server', icon: 'server', group: 'backend' },
                    { id: 'db', label: 'Database', icon: 'database', group: 'data' },
                    { id: 'cache', label: 'Cache', icon: 'disk', group: 'data' }
                ];
                this.connections = [
                    { from: 'web', to: 'api', direction: 'LR' },
                    { from: 'api', to: 'db', direction: 'LR' },
                    { from: 'api', to: 'cache', direction: 'LR' }
                ];
                break;

            case 'microservices':
                this.groups = [
                    { id: 'gateway', label: 'Gateway', icon: 'cloud' },
                    { id: 'services', label: 'Services', icon: 'cloud' },
                    { id: 'storage', label: 'Storage', icon: 'cloud' }
                ];
                this.services = [
                    { id: 'lb', label: 'Load Balancer', icon: 'internet', group: 'gateway' },
                    { id: 'auth', label: 'Auth Service', icon: 'server', group: 'services' },
                    { id: 'user', label: 'User Service', icon: 'server', group: 'services' },
                    { id: 'order', label: 'Order Service', icon: 'server', group: 'services' },
                    { id: 'userdb', label: 'User DB', icon: 'database', group: 'storage' },
                    { id: 'orderdb', label: 'Order DB', icon: 'database', group: 'storage' }
                ];
                this.connections = [
                    { from: 'lb', to: 'auth', direction: 'LR' },
                    { from: 'lb', to: 'user', direction: 'LR' },
                    { from: 'lb', to: 'order', direction: 'LR' },
                    { from: 'user', to: 'userdb', direction: 'LR' },
                    { from: 'order', to: 'orderdb', direction: 'LR' }
                ];
                break;
        }

        this.refreshEditor();
    }
}

window.ArchitectureEditor = ArchitectureEditor;
