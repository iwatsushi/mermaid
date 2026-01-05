/**
 * シーケンス図エディター
 */
class SequenceEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.participants = [];
        this.messages = [];
        this.autonumber = false;

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
        this.participants = [
            { id: 'Client', alias: 'クライアント', type: 'participant' },
            { id: 'Server', alias: 'サーバー', type: 'participant' }
        ];
        this.messages = [
            { from: 'Client', to: 'Server', text: 'リクエスト', arrow: 'solid' },
            { from: 'Server', to: 'Client', text: 'レスポンス', arrow: 'dotted' }
        ];
    }

    render() {
        const container = document.createElement('div');

        // オプション
        container.appendChild(this.createSection('オプション', 'bi-gear', this.renderOptions()));

        // 参加者一覧
        container.appendChild(this.createSection('参加者', 'bi-people', this.renderParticipantList()));

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

        const list = this.createItemList(
            this.participants,
            (p, index) => `
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
            `,
            '参加者がいません'
        );
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
        }, 0);

        return wrapper;
    }

    renderMessageList() {
        const wrapper = document.createElement('div');

        const list = this.createItemList(
            this.messages,
            (msg, index) => `
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
            `,
            'メッセージがありません'
        );
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
        }, 0);

        return wrapper;
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
        const newAlias = prompt('新しい表示名:', part.alias);
        if (newAlias !== null) {
            part.alias = newAlias;
            this.refreshEditor();
            this.onInputChange();
        }
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
        const newText = prompt('新しいメッセージ:', msg.text);
        if (newText !== null) {
            msg.text = newText;
            this.refreshEditor();
            this.onInputChange();
        }
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
        let code = 'sequenceDiagram\n';

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
