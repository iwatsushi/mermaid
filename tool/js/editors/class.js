/**
 * クラス図エディター
 */
class ClassEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.classes = [];
        this.relations = [];

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
            { id: 'none', name: 'なし', description: '通常のクラス' },
            { id: 'interface', name: 'interface', description: 'インターフェース（実装を持たない契約）' },
            { id: 'abstract', name: 'abstract', description: '抽象クラス（直接インスタンス化不可）' },
            { id: 'enum', name: 'enumeration', description: '列挙型（定数の集合）' },
            { id: 'service', name: 'service', description: 'サービスクラス（ビジネスロジック）' },
            { id: 'entity', name: 'Entity', description: 'エンティティ（データベースのテーブルに対応）' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプルなクラス' },
            { id: 'inheritance', name: '継承関係' },
            { id: 'interface', name: 'インターフェース実装' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.look = 'classic';
        this.theme = 'default';
        this.layout = 'dagre';
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

    renderAppearanceSettings() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="row g-3">
                <div class="col-4">
                    <label class="form-label">Look（描画スタイル）</label>
                    <select class="form-select form-select-sm" id="classLook">
                        ${this.lookOptions.map(opt =>
                            `<option value="${opt.id}" ${this.look === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label">Theme（配色）</label>
                    <select class="form-select form-select-sm" id="classTheme">
                        ${this.themeOptions.map(opt =>
                            `<option value="${opt.id}" ${this.theme === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-4">
                    <label class="form-label">Layout（配置）</label>
                    <select class="form-select form-select-sm" id="classLayout">
                        ${this.layoutOptions.map(opt =>
                            `<option value="${opt.id}" ${this.layout === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelector('#classLook')?.addEventListener('change', (e) => {
                this.look = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#classTheme')?.addEventListener('change', (e) => {
                this.theme = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#classLayout')?.addEventListener('change', (e) => {
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

        // クラス一覧
        container.appendChild(this.createSection('クラス', 'bi-box', this.renderClassList()));

        // 関係一覧
        container.appendChild(this.createSection('関係', 'bi-link-45deg', this.renderRelationList()));

        return container;
    }

    renderClassList() {
        const wrapper = document.createElement('div');

        // クラスリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.classes.length === 0) {
            list.innerHTML = '<div class="item-list-empty">クラスがありません</div>';
        } else {
            this.classes.forEach((cls, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
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
                    <label class="form-label">クラス名</label>
                    <input type="text" class="form-control form-control-sm" id="className" placeholder="MyClass">
                </div>
                <div class="col-6">
                    <label class="form-label">ステレオタイプ</label>
                    <select class="form-select form-select-sm" id="classStereotype">
                        ${this.stereotypes.map(s => `<option value="${s.id}" title="${s.description}">${s.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="form-text mt-1 mb-2">
                <strong>ステレオタイプ</strong>: クラスの種類を示す注釈。
                <a href="#" class="text-decoration-none" data-bs-toggle="collapse" data-bs-target="#stereotypeHelp">詳細を見る</a>
                <div class="collapse mt-2" id="stereotypeHelp">
                    <div class="card card-body py-2 small">
                        ${this.stereotypes.filter(s => s.id !== 'none').map(s => `
                            <div><strong>&lt;&lt;${s.name}&gt;&gt;</strong>: ${s.description}</div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <button class="btn btn-primary btn-sm btn-add" id="addClassBtn">
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
                        this.moveClass(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveClass(fromIndex, toIndex) {
        const [moved] = this.classes.splice(fromIndex, 1);
        this.classes.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    renderRelationList() {
        const wrapper = document.createElement('div');

        // 関係リスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.relations.length === 0) {
            list.innerHTML = '<div class="item-list-empty">関係がありません</div>';
        } else {
            this.relations.forEach((rel, index) => {
                const relType = this.relationTypes.find(r => r.id === rel.type);
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
                        <span class="arrow-badge">${relType?.syntax || '--'}</span>
                        <span class="node-badge">${rel.to}</span>
                        ${rel.label ? `<small class="text-muted">"${rel.label}"</small>` : ''}
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
                        <h5 class="modal-title"><i class="bi bi-link-45deg"></i> 関係の編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-6">
                                <label class="form-label">From クラス</label>
                                <select class="form-select" id="editRelFrom">
                                    ${this.classes.map(c => `<option value="${c.name}" ${rel.from === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label">To クラス</label>
                                <select class="form-select" id="editRelTo">
                                    ${this.classes.map(c => `<option value="${c.name}" ${rel.to === c.name ? 'selected' : ''}>${c.name}</option>`).join('')}
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">関係の種類</label>
                                <select class="form-select" id="editRelType">
                                    ${this.relationTypes.map(r => `
                                        <option value="${r.id}" ${rel.type === r.id ? 'selected' : ''}>
                                            ${r.name} (${r.syntax})
                                        </option>
                                    `).join('')}
                                </select>
                                <div class="form-text">
                                    <strong>継承</strong>: 親子関係（is-a）、
                                    <strong>実装</strong>: インターフェース実装、
                                    <strong>コンポジション</strong>: 強い所有（ライフサイクル共有）、
                                    <strong>集約</strong>: 弱い所有、
                                    <strong>関連</strong>: 一般的な関係、
                                    <strong>依存</strong>: 一時的な利用
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">ラベル（任意）</label>
                                <input type="text" class="form-control" id="editRelLabel" value="${rel.label || ''}" placeholder="関係の説明">
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
            rel.type = modal.querySelector('#editRelType').value;
            rel.label = modal.querySelector('#editRelLabel').value.trim();

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
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
                        <div class="mb-3">
                            <label class="form-label">ステレオタイプ</label>
                            <select class="form-select" id="editClassStereotype">
                                ${this.stereotypes.map(s => `
                                    <option value="${s.id}" ${cls.stereotype === s.id ? 'selected' : ''}>
                                        ${s.name} - ${s.description}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                        <hr>
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
            // ステレオタイプを更新
            cls.stereotype = modal.querySelector('#editClassStereotype').value;

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

        code += 'classDiagram\n';

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
