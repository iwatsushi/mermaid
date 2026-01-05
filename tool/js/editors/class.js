/**
 * クラス図エディター
 */
class ClassEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.classes = [];
        this.relations = [];

        this.accessModifiers = [
            { id: 'public', name: 'public', symbol: '+' },
            { id: 'private', name: 'private', symbol: '-' },
            { id: 'protected', name: 'protected', symbol: '#' },
            { id: 'package', name: 'package', symbol: '~' }
        ];

        this.relationTypes = [
            { id: 'inheritance', name: '継承', syntax: '<|--' },
            { id: 'composition', name: 'コンポジション', syntax: '*--' },
            { id: 'aggregation', name: '集約', syntax: 'o--' },
            { id: 'association', name: '関連', syntax: '-->' },
            { id: 'dependency', name: '依存', syntax: '..>' },
            { id: 'realization', name: '実装', syntax: '..|>' }
        ];

        this.stereotypes = [
            { id: 'none', name: 'なし' },
            { id: 'interface', name: 'interface' },
            { id: 'abstract', name: 'abstract' },
            { id: 'enum', name: 'enumeration' },
            { id: 'service', name: 'service' },
            { id: 'entity', name: 'Entity' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプルなクラス' },
            { id: 'inheritance', name: '継承関係' },
            { id: 'interface', name: 'インターフェース実装' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.classes = [
            {
                name: 'Animal',
                stereotype: 'none',
                attributes: [
                    { access: 'protected', name: 'name', type: 'String' }
                ],
                methods: [
                    { access: 'public', name: 'makeSound', params: '', returnType: 'void' }
                ]
            },
            {
                name: 'Dog',
                stereotype: 'none',
                attributes: [],
                methods: [
                    { access: 'public', name: 'bark', params: '', returnType: 'void' }
                ]
            }
        ];
        this.relations = [
            { from: 'Animal', to: 'Dog', type: 'inheritance', label: '' }
        ];
    }

    render() {
        const container = document.createElement('div');

        // クラス一覧
        container.appendChild(this.createSection('クラス', 'bi-box', this.renderClassList()));

        // 関係一覧
        container.appendChild(this.createSection('関係', 'bi-link-45deg', this.renderRelationList()));

        return container;
    }

    renderClassList() {
        const wrapper = document.createElement('div');

        const list = this.createItemList(
            this.classes,
            (cls, index) => `
                <div class="item-content">
                    <span class="badge bg-primary me-2">${cls.name}</span>
                    ${cls.stereotype !== 'none' ? `<small class="text-muted">&lt;&lt;${cls.stereotype}&gt;&gt;</small>` : ''}
                    <small class="text-muted ms-2">${cls.attributes.length}属性, ${cls.methods.length}メソッド</small>
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-outline-primary edit-class" data-index="${index}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-class" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `,
            'クラスがありません'
        );
        wrapper.appendChild(list);

        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2">
                <div class="col-6">
                    <label class="form-label">クラス名</label>
                    <input type="text" class="form-control form-control-sm" id="className" placeholder="MyClass">
                </div>
                <div class="col-6">
                    <label class="form-label">ステレオタイプ</label>
                    <select class="form-select form-select-sm" id="classStereotype">
                        ${this.stereotypes.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addClassBtn">
                <i class="bi bi-plus"></i> クラスを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addClassBtn')?.addEventListener('click', () => this.addClass());
            wrapper.querySelectorAll('.edit-class').forEach(btn => {
                btn.addEventListener('click', (e) => this.editClass(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-class').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteClass(parseInt(e.currentTarget.dataset.index)));
            });
        }, 0);

        return wrapper;
    }

    renderRelationList() {
        const wrapper = document.createElement('div');

        const list = this.createItemList(
            this.relations,
            (rel, index) => `
                <div class="item-content connection-item">
                    <span class="node-badge">${rel.from}</span>
                    <span class="arrow-badge">${this.relationTypes.find(r => r.id === rel.type)?.syntax || '--'}</span>
                    <span class="node-badge">${rel.to}</span>
                    ${rel.label ? `<small class="text-muted">"${rel.label}"</small>` : ''}
                </div>
                <div class="item-actions">
                    <button class="btn btn-sm btn-outline-danger delete-rel" data-index="${index}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            `,
            '関係がありません'
        );
        wrapper.appendChild(list);

        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2">
                <div class="col-3">
                    <label class="form-label">From</label>
                    <select class="form-select form-select-sm" id="relFrom">
                        ${this.classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">関係</label>
                    <select class="form-select form-select-sm" id="relType">
                        ${this.relationTypes.map(r => `<option value="${r.id}">${r.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">To</label>
                    <select class="form-select form-select-sm" id="relTo">
                        ${this.classes.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="relLabel" placeholder="任意">
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addRelBtn">
                <i class="bi bi-plus"></i> 関係を追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addRelBtn')?.addEventListener('click', () => this.addRelation());
            wrapper.querySelectorAll('.delete-rel').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteRelation(parseInt(e.currentTarget.dataset.index)));
            });
        }, 0);

        return wrapper;
    }

    addClass() {
        const name = document.getElementById('className').value.trim();
        const stereotype = document.getElementById('classStereotype').value;

        if (!name) {
            this.app.showToast('クラス名を入力してください', 'warning');
            return;
        }

        if (this.classes.some(c => c.name === name)) {
            this.app.showToast('同じ名前のクラスが既に存在します', 'warning');
            return;
        }

        this.classes.push({
            name,
            stereotype,
            attributes: [],
            methods: []
        });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('className').value = '';
    }

    editClass(index) {
        const cls = this.classes[index];
        this.showClassEditModal(cls, index);
    }

    showClassEditModal(cls, index) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">クラス編集: ${cls.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <h6>属性</h6>
                        <div id="attrList" class="mb-3">
                            ${cls.attributes.map((attr, i) => `
                                <div class="d-flex gap-2 mb-2 align-items-center">
                                    <select class="form-select form-select-sm" style="width:100px" data-attr-index="${i}" data-field="access">
                                        ${this.accessModifiers.map(a => `<option value="${a.id}" ${attr.access === a.id ? 'selected' : ''}>${a.symbol}</option>`).join('')}
                                    </select>
                                    <input type="text" class="form-control form-control-sm" value="${attr.name}" data-attr-index="${i}" data-field="name" placeholder="名前">
                                    <input type="text" class="form-control form-control-sm" value="${attr.type}" data-attr-index="${i}" data-field="type" placeholder="型">
                                    <button class="btn btn-sm btn-outline-danger delete-attr" data-index="${i}"><i class="bi bi-trash"></i></button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-sm btn-outline-primary mb-3" id="addAttrBtn"><i class="bi bi-plus"></i> 属性追加</button>

                        <h6>メソッド</h6>
                        <div id="methodList" class="mb-3">
                            ${cls.methods.map((m, i) => `
                                <div class="d-flex gap-2 mb-2 align-items-center">
                                    <select class="form-select form-select-sm" style="width:100px" data-method-index="${i}" data-field="access">
                                        ${this.accessModifiers.map(a => `<option value="${a.id}" ${m.access === a.id ? 'selected' : ''}>${a.symbol}</option>`).join('')}
                                    </select>
                                    <input type="text" class="form-control form-control-sm" value="${m.name}" data-method-index="${i}" data-field="name" placeholder="名前">
                                    <input type="text" class="form-control form-control-sm" value="${m.params}" data-method-index="${i}" data-field="params" placeholder="引数" style="width:120px">
                                    <input type="text" class="form-control form-control-sm" value="${m.returnType}" data-method-index="${i}" data-field="returnType" placeholder="戻り値" style="width:100px">
                                    <button class="btn btn-sm btn-outline-danger delete-method" data-index="${i}"><i class="bi bi-trash"></i></button>
                                </div>
                            `).join('')}
                        </div>
                        <button class="btn btn-sm btn-outline-primary" id="addMethodBtn"><i class="bi bi-plus"></i> メソッド追加</button>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">閉じる</button>
                        <button type="button" class="btn btn-primary" id="saveClassBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        // イベントリスナー
        modal.querySelector('#addAttrBtn').addEventListener('click', () => {
            cls.attributes.push({ access: 'public', name: '', type: '' });
            this.showClassEditModal(cls, index);
            bsModal.hide();
        });

        modal.querySelector('#addMethodBtn').addEventListener('click', () => {
            cls.methods.push({ access: 'public', name: '', params: '', returnType: 'void' });
            this.showClassEditModal(cls, index);
            bsModal.hide();
        });

        modal.querySelectorAll('.delete-attr').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cls.attributes.splice(parseInt(e.currentTarget.dataset.index), 1);
                this.showClassEditModal(cls, index);
                bsModal.hide();
            });
        });

        modal.querySelectorAll('.delete-method').forEach(btn => {
            btn.addEventListener('click', (e) => {
                cls.methods.splice(parseInt(e.currentTarget.dataset.index), 1);
                this.showClassEditModal(cls, index);
                bsModal.hide();
            });
        });

        modal.querySelector('#saveClassBtn').addEventListener('click', () => {
            // 属性を更新
            modal.querySelectorAll('[data-attr-index]').forEach(input => {
                const i = parseInt(input.dataset.attrIndex);
                const field = input.dataset.field;
                cls.attributes[i][field] = input.value;
            });

            // メソッドを更新
            modal.querySelectorAll('[data-method-index]').forEach(input => {
                const i = parseInt(input.dataset.methodIndex);
                const field = input.dataset.field;
                cls.methods[i][field] = input.value;
            });

            // 空のエントリを削除
            cls.attributes = cls.attributes.filter(a => a.name.trim());
            cls.methods = cls.methods.filter(m => m.name.trim());

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deleteClass(index) {
        const cls = this.classes[index];
        this.relations = this.relations.filter(r => r.from !== cls.name && r.to !== cls.name);
        this.classes.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    addRelation() {
        const from = document.getElementById('relFrom').value;
        const to = document.getElementById('relTo').value;
        const type = document.getElementById('relType').value;
        const label = document.getElementById('relLabel').value.trim();

        this.relations.push({ from, to, type, label });
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
        let code = 'classDiagram\n';

        // クラス定義
        this.classes.forEach(cls => {
            code += `    class ${cls.name} {\n`;

            if (cls.stereotype !== 'none') {
                code += `        <<${cls.stereotype}>>\n`;
            }

            cls.attributes.forEach(attr => {
                const symbol = this.accessModifiers.find(a => a.id === attr.access)?.symbol || '+';
                code += `        ${symbol}${attr.type ? attr.type + ' ' : ''}${attr.name}\n`;
            });

            cls.methods.forEach(m => {
                const symbol = this.accessModifiers.find(a => a.id === m.access)?.symbol || '+';
                code += `        ${symbol}${m.name}(${m.params})${m.returnType ? ' ' + m.returnType : ''}\n`;
            });

            code += '    }\n\n';
        });

        // 関係定義
        this.relations.forEach(rel => {
            const syntax = this.relationTypes.find(r => r.id === rel.type)?.syntax || '-->';
            if (rel.label) {
                code += `    ${rel.from} ${syntax} ${rel.to} : ${rel.label}\n`;
            } else {
                code += `    ${rel.from} ${syntax} ${rel.to}\n`;
            }
        });

        return code;
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'simple':
                this.classes = [
                    {
                        name: 'User',
                        stereotype: 'none',
                        attributes: [
                            { access: 'private', name: 'id', type: 'Long' },
                            { access: 'private', name: 'name', type: 'String' },
                            { access: 'private', name: 'email', type: 'String' }
                        ],
                        methods: [
                            { access: 'public', name: 'getName', params: '', returnType: 'String' },
                            { access: 'public', name: 'setName', params: 'String name', returnType: 'void' }
                        ]
                    }
                ];
                this.relations = [];
                break;

            case 'inheritance':
                this.classes = [
                    {
                        name: 'Animal',
                        stereotype: 'abstract',
                        attributes: [
                            { access: 'protected', name: 'name', type: 'String' }
                        ],
                        methods: [
                            { access: 'public', name: 'makeSound', params: '', returnType: 'void' }
                        ]
                    },
                    {
                        name: 'Dog',
                        stereotype: 'none',
                        attributes: [],
                        methods: [
                            { access: 'public', name: 'bark', params: '', returnType: 'void' }
                        ]
                    },
                    {
                        name: 'Cat',
                        stereotype: 'none',
                        attributes: [],
                        methods: [
                            { access: 'public', name: 'meow', params: '', returnType: 'void' }
                        ]
                    }
                ];
                this.relations = [
                    { from: 'Animal', to: 'Dog', type: 'inheritance', label: '' },
                    { from: 'Animal', to: 'Cat', type: 'inheritance', label: '' }
                ];
                break;

            case 'interface':
                this.classes = [
                    {
                        name: 'Repository',
                        stereotype: 'interface',
                        attributes: [],
                        methods: [
                            { access: 'public', name: 'find', params: 'Long id', returnType: 'Entity' },
                            { access: 'public', name: 'save', params: 'Entity entity', returnType: 'void' }
                        ]
                    },
                    {
                        name: 'UserRepository',
                        stereotype: 'none',
                        attributes: [],
                        methods: [
                            { access: 'public', name: 'find', params: 'Long id', returnType: 'User' },
                            { access: 'public', name: 'save', params: 'User user', returnType: 'void' }
                        ]
                    }
                ];
                this.relations = [
                    { from: 'Repository', to: 'UserRepository', type: 'realization', label: '' }
                ];
                break;
        }

        this.refreshEditor();
    }
}

window.ClassEditor = ClassEditor;
