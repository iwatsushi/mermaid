/**
 * シーケンス図エディター
 */
class SequenceEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.participants = [];
        this.messages = [];
        this.autonumber = false;

        // Look/Theme オプション
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

        this.participantTypes = [
            { id: 'participant', name: '参加者' },
            { id: 'actor', name: 'アクター' }
        ];

        this.arrowTypes = [
            { id: 'solid', name: '実線矢印', syntax: '->>' },
            { id: 'dotted', name: '点線矢印', syntax: '-->>' },
            { id: 'solidLine', name: '実線', syntax: '->' },
            { id: 'dottedLine', name: '点線', syntax: '-->' },
            { id: 'cross', name: '×印', syntax: '-x' },
            { id: 'async', name: '非同期', syntax: '-)' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプルな通信' },
            { id: 'api', name: 'REST API呼び出し' },
            { id: 'auth', name: '認証フロー' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.look = 'classic';
        this.theme = 'default';
        this.participants = [
            { id: 'Client', alias: 'クライアント', type: 'participant' },
            { id: 'Server', alias: 'サーバー', type: 'participant' }
        ];
        this.messages = [
            { from: 'Client', to: 'Server', text: 'リクエスト', arrow: 'solid' },
            { from: 'Server', to: 'Client', text: 'レスポンス', arrow: 'dotted' }
        ];
    }

    renderAppearanceSettings() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="row g-3">
                <div class="col-6">
                    <label class="form-label">Look（描画スタイル）</label>
                    <select class="form-select form-select-sm" id="seqLook">
                        ${this.lookOptions.map(opt =>
                            `<option value="${opt.id}" ${this.look === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label">Theme（配色）</label>
                    <select class="form-select form-select-sm" id="seqTheme">
                        ${this.themeOptions.map(opt =>
                            `<option value="${opt.id}" ${this.theme === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelector('#seqLook')?.addEventListener('change', (e) => {
                this.look = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#seqTheme')?.addEventListener('change', (e) => {
                this.theme = e.target.value;
                this.onInputChange();
            });
        }, 0);

        return wrapper;
    }

    render() {
        const container = document.createElement('div');

        // 外観設定
        container.appendChild(this.createSection('外観設定', 'bi-palette', this.renderAppearanceSettings()));

        // オプション
        container.appendChild(this.createSection('オプション', 'bi-gear', this.renderOptions()));

        // 参加者一覧（用語説明付き）
        const partSection = this.createSection('登場人物（参加者）', 'bi-people', this.renderParticipantList());
        container.appendChild(partSection);

        // メッセージ一覧
        container.appendChild(this.createSection('メッセージ', 'bi-chat-left-text', this.renderMessageList()));

        return container;
    }

    renderOptions() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="form-check">
                <input class="form-check-input" type="checkbox" id="autonumber" ${this.autonumber ? 'checked' : ''}>
                <label class="form-check-label" for="autonumber">
                    メッセージに番号を付ける
                </label>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelector('#autonumber')?.addEventListener('change', (e) => {
                this.autonumber = e.target.checked;
                this.onInputChange();
            });
        }, 0);

        return wrapper;
    }

    renderParticipantList() {
        const wrapper = document.createElement('div');

        // 説明テキスト
        const helpText = document.createElement('div');
        helpText.className = 'alert alert-light py-2 mb-2';
        helpText.innerHTML = `
            <small>
                <strong>登場人物</strong>はシーケンス図に表示されるシステムやユーザーです。<br>
                <span class="badge bg-primary">Part</span> = 参加者（四角形）、
                <span class="badge bg-success">Actor</span> = アクター（人型アイコン）
            </small>
        `;
        wrapper.appendChild(helpText);

        // 参加者リスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.participants.length === 0) {
            list.innerHTML = '<div class="item-list-empty">参加者がいません</div>';
        } else {
            this.participants.forEach((p, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge ${p.type === 'actor' ? 'bg-success' : 'bg-primary'} me-2">${p.type === 'actor' ? 'Actor' : 'Part'}</span>
                        <span>${p.id}</span>
                        ${p.alias && p.alias !== p.id ? `<small class="text-muted ms-2">(${p.alias})</small>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-part" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-part" data-index="${index}">
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
                    <input type="text" class="form-control form-control-sm" id="partId" placeholder="Client">
                </div>
                <div class="col-4">
                    <label class="form-label">表示名</label>
                    <input type="text" class="form-control form-control-sm" id="partAlias" placeholder="クライアント">
                </div>
                <div class="col-4">
                    <label class="form-label">種類</label>
                    <select class="form-select form-select-sm" id="partType">
                        ${this.participantTypes.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addPartBtn">
                <i class="bi bi-plus"></i> 参加者を追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addPartBtn')?.addEventListener('click', () => this.addParticipant());
            wrapper.querySelectorAll('.edit-part').forEach(btn => {
                btn.addEventListener('click', (e) => this.editParticipant(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-part').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteParticipant(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveParticipant(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveParticipant(fromIndex, toIndex) {
        const [moved] = this.participants.splice(fromIndex, 1);
        this.participants.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    renderMessageList() {
        const wrapper = document.createElement('div');

        // メッセージリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.messages.length === 0) {
            list.innerHTML = '<div class="item-list-empty">メッセージがありません</div>';
        } else {
            this.messages.forEach((msg, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content connection-item">
                        <span class="node-badge">${msg.from}</span>
                        <span class="arrow-badge">${this.arrowTypes.find(a => a.id === msg.arrow)?.syntax || '->>'}</span>
                        <span class="node-badge">${msg.to}</span>
                        <small class="text-muted ms-2">"${msg.text}"</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-msg" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-msg" data-index="${index}">
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
                    <label class="form-label">送信元</label>
                    <select class="form-select form-select-sm" id="msgFrom">
                        ${this.participants.map(p => `<option value="${p.id}">${p.id}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">矢印</label>
                    <select class="form-select form-select-sm" id="msgArrow">
                        ${this.arrowTypes.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">送信先</label>
                    <select class="form-select form-select-sm" id="msgTo">
                        ${this.participants.map(p => `<option value="${p.id}">${p.id}</option>`).join('')}
                    </select>
                </div>
                <div class="col-3">
                    <label class="form-label">メッセージ</label>
                    <input type="text" class="form-control form-control-sm" id="msgText" placeholder="内容">
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addMsgBtn">
                <i class="bi bi-plus"></i> メッセージを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addMsgBtn')?.addEventListener('click', () => this.addMessage());
            wrapper.querySelectorAll('.edit-msg').forEach(btn => {
                btn.addEventListener('click', (e) => this.editMessage(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-msg').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteMessage(parseInt(e.currentTarget.dataset.index)));
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
                        this.moveMessage(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveMessage(fromIndex, toIndex) {
        const [moved] = this.messages.splice(fromIndex, 1);
        this.messages.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    addParticipant() {
        const id = document.getElementById('partId').value.trim();
        const alias = document.getElementById('partAlias').value.trim();
        const type = document.getElementById('partType').value;

        if (!id) {
            this.app.showToast('IDを入力してください', 'warning');
            return;
        }

        if (this.participants.some(p => p.id === id)) {
            this.app.showToast('同じIDの参加者が既に存在します', 'warning');
            return;
        }

        this.participants.push({ id, alias: alias || id, type });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('partId').value = '';
        document.getElementById('partAlias').value = '';
    }

    editParticipant(index) {
        const part = this.participants[index];

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-person"></i> 登場人物の編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ID（内部識別子）</label>
                            <input type="text" class="form-control" id="editPartId" value="${part.id}">
                            <div class="form-text">英数字のみ推奨。メッセージの送信元/先に使われます。</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">表示名</label>
                            <input type="text" class="form-control" id="editPartAlias" value="${part.alias || ''}">
                            <div class="form-text">図に表示される名前です。日本語OK。</div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">種類</label>
                            <select class="form-select" id="editPartType">
                                ${this.participantTypes.map(t => `
                                    <option value="${t.id}" ${part.type === t.id ? 'selected' : ''}>
                                        ${t.name}${t.id === 'actor' ? '（人型アイコン）' : '（四角形）'}
                                    </option>
                                `).join('')}
                            </select>
                            <div class="form-text">
                                <strong>参加者</strong>: システムやサービス向け（四角形で表示）<br>
                                <strong>アクター</strong>: ユーザーや外部向け（人型アイコンで表示）
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="savePartBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#savePartBtn').addEventListener('click', () => {
            const newId = modal.querySelector('#editPartId').value.trim();
            const newAlias = modal.querySelector('#editPartAlias').value.trim();
            const newType = modal.querySelector('#editPartType').value;

            if (!newId) {
                this.app.showToast('IDを入力してください', 'warning');
                return;
            }

            // IDが変更された場合、メッセージも更新
            if (newId !== part.id) {
                this.messages.forEach(msg => {
                    if (msg.from === part.id) msg.from = newId;
                    if (msg.to === part.id) msg.to = newId;
                });
            }

            part.id = newId;
            part.alias = newAlias || newId;
            part.type = newType;

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deleteParticipant(index) {
        const part = this.participants[index];
        this.messages = this.messages.filter(m => m.from !== part.id && m.to !== part.id);
        this.participants.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    addMessage() {
        const from = document.getElementById('msgFrom').value;
        const to = document.getElementById('msgTo').value;
        const arrow = document.getElementById('msgArrow').value;
        const text = document.getElementById('msgText').value.trim() || 'メッセージ';

        this.messages.push({ from, to, arrow, text });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('msgText').value = '';
    }

    editMessage(index) {
        const msg = this.messages[index];

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-chat-left-text"></i> メッセージの編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-6">
                                <label class="form-label">送信元</label>
                                <select class="form-select" id="editMsgFrom">
                                    ${this.participants.map(p => `
                                        <option value="${p.id}" ${msg.from === p.id ? 'selected' : ''}>${p.id}${p.alias !== p.id ? ` (${p.alias})` : ''}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="col-6">
                                <label class="form-label">送信先</label>
                                <select class="form-select" id="editMsgTo">
                                    ${this.participants.map(p => `
                                        <option value="${p.id}" ${msg.to === p.id ? 'selected' : ''}>${p.id}${p.alias !== p.id ? ` (${p.alias})` : ''}</option>
                                    `).join('')}
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label">矢印の種類</label>
                                <select class="form-select" id="editMsgArrow">
                                    ${this.arrowTypes.map(a => `
                                        <option value="${a.id}" ${msg.arrow === a.id ? 'selected' : ''}>
                                            ${a.name} (${a.syntax})
                                        </option>
                                    `).join('')}
                                </select>
                                <div class="form-text">
                                    <strong>実線矢印</strong>: リクエスト・同期呼び出し、
                                    <strong>点線矢印</strong>: レスポンス・戻り値
                                </div>
                            </div>
                            <div class="col-12">
                                <label class="form-label">メッセージ内容</label>
                                <input type="text" class="form-control" id="editMsgText" value="${msg.text}">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="saveMsgBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#saveMsgBtn').addEventListener('click', () => {
            msg.from = modal.querySelector('#editMsgFrom').value;
            msg.to = modal.querySelector('#editMsgTo').value;
            msg.arrow = modal.querySelector('#editMsgArrow').value;
            msg.text = modal.querySelector('#editMsgText').value.trim() || 'メッセージ';

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deleteMessage(index) {
        this.messages.splice(index, 1);
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

        // Look/Theme設定がデフォルトでない場合はYAML frontmatterで出力
        const hasCustomConfig = this.look !== 'classic' || this.theme !== 'default';
        if (hasCustomConfig) {
            code += '---\n';
            code += 'config:\n';
            if (this.look !== 'classic') {
                code += `  look: ${this.look}\n`;
            }
            if (this.theme !== 'default') {
                code += `  theme: ${this.theme}\n`;
            }
            code += '---\n';
        }

        code += 'sequenceDiagram\n';

        if (this.autonumber) {
            code += '    autonumber\n';
        }

        // 参加者定義
        this.participants.forEach(p => {
            if (p.alias && p.alias !== p.id) {
                code += `    ${p.type} ${p.id} as ${p.alias}\n`;
            } else {
                code += `    ${p.type} ${p.id}\n`;
            }
        });

        code += '\n';

        // メッセージ
        this.messages.forEach(msg => {
            const arrow = this.arrowTypes.find(a => a.id === msg.arrow)?.syntax || '->>';
            code += `    ${msg.from}${arrow}${msg.to}: ${msg.text}\n`;
        });

        return code;
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'simple':
                this.autonumber = false;
                this.participants = [
                    { id: 'A', alias: 'Alice', type: 'participant' },
                    { id: 'B', alias: 'Bob', type: 'participant' }
                ];
                this.messages = [
                    { from: 'A', to: 'B', text: 'Hello!', arrow: 'solid' },
                    { from: 'B', to: 'A', text: 'Hi there!', arrow: 'dotted' }
                ];
                break;

            case 'api':
                this.autonumber = true;
                this.participants = [
                    { id: 'Client', alias: 'クライアント', type: 'participant' },
                    { id: 'API', alias: 'APIサーバー', type: 'participant' },
                    { id: 'DB', alias: 'データベース', type: 'participant' }
                ];
                this.messages = [
                    { from: 'Client', to: 'API', text: 'GET /users', arrow: 'solid' },
                    { from: 'API', to: 'DB', text: 'SELECT * FROM users', arrow: 'solid' },
                    { from: 'DB', to: 'API', text: 'ユーザーデータ', arrow: 'dotted' },
                    { from: 'API', to: 'Client', text: '200 OK + JSON', arrow: 'dotted' }
                ];
                break;

            case 'auth':
                this.autonumber = true;
                this.participants = [
                    { id: 'User', alias: 'ユーザー', type: 'actor' },
                    { id: 'App', alias: 'アプリ', type: 'participant' },
                    { id: 'Auth', alias: '認証サービス', type: 'participant' },
                    { id: 'DB', alias: 'DB', type: 'participant' }
                ];
                this.messages = [
                    { from: 'User', to: 'App', text: 'ログイン要求', arrow: 'solid' },
                    { from: 'App', to: 'Auth', text: '認証リクエスト', arrow: 'solid' },
                    { from: 'Auth', to: 'DB', text: 'ユーザー照会', arrow: 'solid' },
                    { from: 'DB', to: 'Auth', text: 'ユーザー情報', arrow: 'dotted' },
                    { from: 'Auth', to: 'App', text: 'トークン発行', arrow: 'dotted' },
                    { from: 'App', to: 'User', text: 'ログイン成功', arrow: 'dotted' }
                ];
                break;
        }

        this.refreshEditor();
    }
}

window.SequenceEditor = SequenceEditor;
