/**
 * ER図エディター
 */
class EREditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.entities = [];
        this.relations = [];

        this.cardinalityTypes = [
            { id: 'one-one', name: '1対1', left: '||', right: '||' },
            { id: 'one-many', name: '1対多', left: '||', right: 'o{' },
            { id: 'many-one', name: '多対1', left: '}o', right: '||' },
            { id: 'many-many', name: '多対多', left: '}o', right: 'o{' },
            { id: 'one-zero-one', name: '1対0..1', left: '||', right: 'o|' },
            { id: 'zero-one-one', name: '0..1対1', left: '|o', right: '||' }
        ];

        this.attributeTypes = [
            { id: 'pk', name: 'PK (主キー)' },
            { id: 'fk', name: 'FK (外部キー)' },
            { id: 'normal', name: '通常' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプルなER図' },
            { id: 'ecommerce', name: 'ECサイト' },
            { id: 'blog', name: 'ブログシステム' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.entities = [
            {
                name: 'User',
                attributes: [
                    { name: 'id', type: 'int', keyType: 'pk' },
                    { name: 'name', type: 'string', keyType: 'normal' },
                    { name: 'email', type: 'string', keyType: 'normal' }
                ]
            },
            {
                name: 'Order',
                attributes: [
                    { name: 'id', type: 'int', keyType: 'pk' },
                    { name: 'user_id', type: 'int', keyType: 'fk' },
                    { name: 'total', type: 'decimal', keyType: 'normal' }
                ]
            }
        ];
        this.relations = [
            { from: 'User', to: 'Order', cardinality: 'one-many', label: 'places' }
        ];
    }

    render() {
        const container = document.createElement('div');

        // エンティティ一覧
        container.appendChild(this.createSection('エンティティ', 'bi-table', this.renderEntityList()));

        // リレーション一覧
        container.appendChild(this.createSection('リレーション', 'bi-link', this.renderRelationList()));

        return container;
    }

    renderEntityList() {
        const wrapper = document.createElement('div');

        // エンティティリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.entities.length === 0) {
            list.innerHTML = '<div class="item-list-empty">エンティティがありません</div>';
        } else {
            this.entities.forEach((entity, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge bg-primary me-2">${entity.name}</span>
                        <small class="text-muted">${entity.attributes.length}属性</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-entity" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-entity" data-index="${index}">
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
                <div class="col-12">
                    <label class="form-label">エンティティ名</label>
                    <input type="text" class="form-control form-control-sm" id="entityName" placeholder="TableName">
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addEntityBtn">
                <i class="bi bi-plus"></i> エンティティを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addEntityBtn')?.addEventListener('click', () => this.addEntity());
            wrapper.querySelectorAll('.edit-entity').forEach(btn => {
                btn.addEventListener('click', (e) => this.editEntity(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-entity').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteEntity(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveEntity(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveEntity(fromIndex, toIndex) {
        const [moved] = this.entities.splice(fromIndex, 1);
        this.entities.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    renderRelationList() {
        const wrapper = document.createElement('div');

        // リレーションリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.relations.length === 0) {
            list.innerHTML = '<div class="item-list-empty">リレーションがありません</div>';
        } else {
            this.relations.forEach((rel, index) => {
                const card = this.cardinalityTypes.find(c => c.id === rel.cardinality);
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content connection-item">
                        <span class="node-badge">${rel.from}</span>
                        <span class="arrow-badge">${card ? card.left + '--' + card.right : '--'}</span>
                        <span class="node-badge">${rel.to}</span>
                        ${rel.label ? `<small class="text-muted">: ${rel.label}</small>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-rel" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-rel" data-index="${index}">
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
                    <label class="form-label">From</label>
                    <select class="form-select form-select-sm" id="relFrom">
                        ${this.entities.map(e => `<option value="${e.name}">${e.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">カーディナリティ</label>
                    <select class="form-select form-select-sm" id="relCard">
                        ${this.cardinalityTypes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">To</label>
                    <select class="form-select form-select-sm" id="relTo">
                        ${this.entities.map(e => `<option value="${e.name}">${e.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="relLabel" placeholder="has">
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addRelBtn">
                <i class="bi bi-plus"></i> リレーションを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addRelBtn')?.addEventListener('click', () => this.addRelation());
            wrapper.querySelectorAll('.edit-rel').forEach(btn => {
                btn.addEventListener('click', (e) => this.editRelation(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-rel').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteRelation(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveRelation(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveRelation(fromIndex, toIndex) {
        const [moved] = this.relations.splice(fromIndex, 1);
        this.relations.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    editRelation(index) {
        const rel = this.relations[index];

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-link"></i> リレーション編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-6">
                                <label class="form-label">From エンティティ</label>
                                <select class="form-select" id="editRelFrom">
                                    ${this.entities.map(e => `<option value="${e.name}" ${rel.from === e.name ? 'selected' : ''}>${e.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label">To エンティティ</label>
                                <select class="form-select" id="editRelTo">
                                    ${this.entities.map(e => `<option value="${e.name}" ${rel.to === e.name ? 'selected' : ''}>${e.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">カーディナリティ</label>
                                <select class="form-select" id="editRelCard">
                                    ${this.cardinalityTypes.map(c => `
                                        <option value="${c.id}" ${rel.cardinality === c.id ? 'selected' : ''}>
                                            ${c.name} (${c.left}--${c.right})
                                        </option>
                                    `).join('')}
                                </select>
                                <div class="form-text">
                                    カーディナリティの記号: || = 1, o| = 0..1, }o = 多, o{ = 多
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">ラベル（リレーション名）</label>
                                <input type="text" class="form-control" id="editRelLabel" value="${rel.label || ''}" placeholder="has, contains, etc.">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="saveRelBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#saveRelBtn').addEventListener('click', () => {
            rel.from = modal.querySelector('#editRelFrom').value;
            rel.to = modal.querySelector('#editRelTo').value;
            rel.cardinality = modal.querySelector('#editRelCard').value;
            rel.label = modal.querySelector('#editRelLabel').value.trim();

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    addEntity() {
        const name = document.getElementById('entityName').value.trim();

        if (!name) {
            this.app.showToast('エンティティ名を入力してください', 'warning');
            return;
        }

        if (this.entities.some(e => e.name === name)) {
            this.app.showToast('同じ名前のエンティティが既に存在します', 'warning');
            return;
        }

        this.entities.push({
            name,
            attributes: [
                { name: 'id', type: 'int', keyType: 'pk' }
            ]
        });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('entityName').value = '';
    }

    editEntity(index) {
        const entity = this.entities[index];
        this.showEntityEditModal(entity, index);
    }

    showEntityEditModal(entity, index) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">エンティティ編集: ${entity.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6>属性</h6>
                        <div id="attrList" class="mb-3">
                            ${entity.attributes.map((attr, i) => `
                                <div class="d-flex gap-2 mb-2 align-items-center">
                                    <select class="form-select form-select-sm" style="width:90px" data-attr-index="${i}" data-field="keyType">
                                        ${this.attributeTypes.map(t => `<option value="${t.id}" ${attr.keyType === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
                                    </select>
                                    <input type="text" class="form-control form-control-sm" value="${attr.name}" data-attr-index="${i}" data-field="name" placeholder="名前">
                                    <input type="text" class="form-control form-control-sm" value="${attr.type}" data-attr-index="${i}" data-field="type" placeholder="型">
                                    <button class="btn btn-sm btn-outline-danger delete-attr" data-index="${i}"><i class="bi bi-trash"></i></button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-sm btn-outline-primary" id="addAttrBtn"><i class="bi bi-plus"></i> 属性追加</button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                        <button type="button" class="btn btn-primary" id="saveEntityBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#addAttrBtn').addEventListener('click', () => {
            entity.attributes.push({ name: '', type: 'string', keyType: 'normal' });
            this.showEntityEditModal(entity, index);
            bsModal.hide();
        });

        modal.querySelectorAll('.delete-attr').forEach(btn => {
            btn.addEventListener('click', (e) => {
                entity.attributes.splice(parseInt(e.currentTarget.dataset.index), 1);
                this.showEntityEditModal(entity, index);
                bsModal.hide();
            });
        });

        modal.querySelector('#saveEntityBtn').addEventListener('click', () => {
            modal.querySelectorAll('[data-attr-index]').forEach(input => {
                const i = parseInt(input.dataset.attrIndex);
                const field = input.dataset.field;
                entity.attributes[i][field] = input.value;
            });

            entity.attributes = entity.attributes.filter(a => a.name.trim());

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deleteEntity(index) {
        const entity = this.entities[index];
        this.relations = this.relations.filter(r => r.from !== entity.name && r.to !== entity.name);
        this.entities.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    addRelation() {
        const from = document.getElementById('relFrom').value;
        const to = document.getElementById('relTo').value;
        const cardinality = document.getElementById('relCard').value;
        const label = document.getElementById('relLabel').value.trim();

        this.relations.push({ from, to, cardinality, label });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('relLabel').value = '';
    }

    deleteRelation(index) {
        this.relations.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    refreshEditor() {
        const container = document.getElementById('editorContainer');
        container.innerHTML = '';
        container.appendChild(this.render());
    }

    generateCode() {
        let code = 'erDiagram\n';

        // エンティティ定義
        this.entities.forEach(entity => {
            code += `    ${entity.name} {\n`;
            entity.attributes.forEach(attr => {
                let prefix = '';
                if (attr.keyType === 'pk') prefix = 'PK ';
                else if (attr.keyType === 'fk') prefix = 'FK ';
                code += `        ${attr.type} ${attr.name} ${prefix}\n`;
            });
            code += '    }\n';
        });

        code += '\n';

        // リレーション定義
        this.relations.forEach(rel => {
            const card = this.cardinalityTypes.find(c => c.id === rel.cardinality);
            const leftCard = card ? card.left : '||';
            const rightCard = card ? card.right : '||';
            code += `    ${rel.from} ${leftCard}--${rightCard} ${rel.to} : "${rel.label || 'relates'}"\n`;
        });

        return code;
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'simple':
                this.entities = [
                    {
                        name: 'User',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'name', type: 'string', keyType: 'normal' }
                        ]
                    },
                    {
                        name: 'Post',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'user_id', type: 'int', keyType: 'fk' },
                            { name: 'title', type: 'string', keyType: 'normal' }
                        ]
                    }
                ];
                this.relations = [
                    { from: 'User', to: 'Post', cardinality: 'one-many', label: 'writes' }
                ];
                break;

            case 'ecommerce':
                this.entities = [
                    {
                        name: 'Customer',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'name', type: 'string', keyType: 'normal' },
                            { name: 'email', type: 'string', keyType: 'normal' }
                        ]
                    },
                    {
                        name: 'Order',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'customer_id', type: 'int', keyType: 'fk' },
                            { name: 'total', type: 'decimal', keyType: 'normal' }
                        ]
                    },
                    {
                        name: 'OrderItem',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'order_id', type: 'int', keyType: 'fk' },
                            { name: 'product_id', type: 'int', keyType: 'fk' },
                            { name: 'quantity', type: 'int', keyType: 'normal' }
                        ]
                    },
                    {
                        name: 'Product',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'name', type: 'string', keyType: 'normal' },
                            { name: 'price', type: 'decimal', keyType: 'normal' }
                        ]
                    }
                ];
                this.relations = [
                    { from: 'Customer', to: 'Order', cardinality: 'one-many', label: 'places' },
                    { from: 'Order', to: 'OrderItem', cardinality: 'one-many', label: 'contains' },
                    { from: 'Product', to: 'OrderItem', cardinality: 'one-many', label: 'appears_in' }
                ];
                break;

            case 'blog':
                this.entities = [
                    {
                        name: 'Author',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'name', type: 'string', keyType: 'normal' }
                        ]
                    },
                    {
                        name: 'Post',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'author_id', type: 'int', keyType: 'fk' },
                            { name: 'title', type: 'string', keyType: 'normal' },
                            { name: 'content', type: 'text', keyType: 'normal' }
                        ]
                    },
                    {
                        name: 'Comment',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'post_id', type: 'int', keyType: 'fk' },
                            { name: 'body', type: 'text', keyType: 'normal' }
                        ]
                    },
                    {
                        name: 'Tag',
                        attributes: [
                            { name: 'id', type: 'int', keyType: 'pk' },
                            { name: 'name', type: 'string', keyType: 'normal' }
                        ]
                    }
                ];
                this.relations = [
                    { from: 'Author', to: 'Post', cardinality: 'one-many', label: 'writes' },
                    { from: 'Post', to: 'Comment', cardinality: 'one-many', label: 'has' },
                    { from: 'Post', to: 'Tag', cardinality: 'many-many', label: 'tagged_with' }
                ];
                break;
        }

        this.refreshEditor();
    }
}

window.EREditor = EREditor;
