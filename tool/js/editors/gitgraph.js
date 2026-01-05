/**
 * Gitグラフエディター
 */
class GitGraphEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.commands = [];
        this.currentBranch = 'main';

        this.commandTypes = [
            { id: 'commit', name: 'コミット' },
            { id: 'branch', name: 'ブランチ作成' },
            { id: 'checkout', name: 'チェックアウト' },
            { id: 'merge', name: 'マージ' }
        ];

        this.commitTypes = [
            { id: 'NORMAL', name: '通常' },
            { id: 'HIGHLIGHT', name: 'ハイライト' },
            { id: 'REVERSE', name: 'リバース' }
        ];

        this.templates = [
            { id: 'simple', name: 'シンプル' },
            { id: 'gitflow', name: 'Git Flow' },
            { id: 'feature', name: 'フィーチャーブランチ' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.commands = [
            { type: 'commit', id: 'Initial', tag: '', commitType: 'NORMAL' },
            { type: 'branch', name: 'develop' },
            { type: 'checkout', name: 'develop' },
            { type: 'commit', id: 'Dev-1', tag: '', commitType: 'NORMAL' },
            { type: 'checkout', name: 'main' },
            { type: 'merge', name: 'develop', id: 'Merge develop', tag: 'v1.0.0' }
        ];
    }

    render() {
        const container = document.createElement('div');

        // コマンド一覧
        container.appendChild(this.createSection('Gitコマンド', 'bi-git', this.renderCommandList()));

        // コマンド追加
        container.appendChild(this.createSection('コマンド追加', 'bi-plus-circle', this.renderAddCommand()));

        return container;
    }

    renderCommandList() {
        const wrapper = document.createElement('div');

        const list = this.createItemList(
            this.commands,
            (cmd, index) => {
                let content = '';
                switch (cmd.type) {
                    case 'commit':
                        content = `<span class="badge bg-success me-2">commit</span> ${cmd.id || '(no id)'}`;
                        if (cmd.tag) content += ` <span class="badge bg-warning text-dark">${cmd.tag}</span>`;
                        if (cmd.commitType !== 'NORMAL') content += ` <small class="text-muted">(${cmd.commitType})</small>`;
                        break;
                    case 'branch':
                        content = `<span class="badge bg-primary me-2">branch</span> ${cmd.name}`;
                        break;
                    case 'checkout':
                        content = `<span class="badge bg-info me-2">checkout</span> ${cmd.name}`;
                        break;
                    case 'merge':
                        content = `<span class="badge bg-purple me-2" style="background-color:#6f42c1">merge</span> ${cmd.name}`;
                        if (cmd.tag) content += ` <span class="badge bg-warning text-dark">${cmd.tag}</span>`;
                        break;
                }
                return `
                    <div class="item-content">${content}</div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-secondary move-up" data-index="${index}" ${index === 0 ? 'disabled' : ''}>
                            <i class="bi bi-arrow-up"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary move-down" data-index="${index}" ${index === this.commands.length - 1 ? 'disabled' : ''}>
                            <i class="bi bi-arrow-down"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-cmd" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
            },
            'コマンドがありません'
        );
        wrapper.appendChild(list);

        setTimeout(() => {
            wrapper.querySelectorAll('.move-up').forEach(btn => {
                btn.addEventListener('click', (e) => this.moveCommand(parseInt(e.currentTarget.dataset.index), -1));
            });
            wrapper.querySelectorAll('.move-down').forEach(btn => {
                btn.addEventListener('click', (e) => this.moveCommand(parseInt(e.currentTarget.dataset.index), 1));
            });
            wrapper.querySelectorAll('.delete-cmd').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteCommand(parseInt(e.currentTarget.dataset.index)));
            });
        }, 0);

        return wrapper;
    }

    renderAddCommand() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="row g-2 mb-2">
                <div class="col-4">
                    <label class="form-label">コマンド</label>
                    <select class="form-select form-select-sm" id="cmdType">
                        ${this.commandTypes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
                <div class="col-8" id="cmdOptions">
                    <!-- Dynamic options -->
                </div>
            </div>
            <button class="btn btn-primary btn-sm btn-add" id="addCmdBtn">
                <i class="bi bi-plus"></i> コマンドを追加
            </button>
        `;

        setTimeout(() => {
            const cmdType = wrapper.querySelector('#cmdType');
            const cmdOptions = wrapper.querySelector('#cmdOptions');

            const updateOptions = () => {
                const type = cmdType.value;
                let html = '';

                switch (type) {
                    case 'commit':
                        html = `
                            <div class="row g-2">
                                <div class="col-4">
                                    <label class="form-label">ID</label>
                                    <input type="text" class="form-control form-control-sm" id="commitId" placeholder="Commit-1">
                                </div>
                                <div class="col-4">
                                    <label class="form-label">タグ</label>
                                    <input type="text" class="form-control form-control-sm" id="commitTag" placeholder="v1.0.0">
                                </div>
                                <div class="col-4">
                                    <label class="form-label">タイプ</label>
                                    <select class="form-select form-select-sm" id="commitType">
                                        ${this.commitTypes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                                    </select>
                                </div>
                            </div>
                        `;
                        break;
                    case 'branch':
                        html = `
                            <label class="form-label">ブランチ名</label>
                            <input type="text" class="form-control form-control-sm" id="branchName" placeholder="feature/new">
                        `;
                        break;
                    case 'checkout':
                        html = `
                            <label class="form-label">ブランチ名</label>
                            <input type="text" class="form-control form-control-sm" id="checkoutName" placeholder="main">
                        `;
                        break;
                    case 'merge':
                        html = `
                            <div class="row g-2">
                                <div class="col-4">
                                    <label class="form-label">ブランチ名</label>
                                    <input type="text" class="form-control form-control-sm" id="mergeName" placeholder="develop">
                                </div>
                                <div class="col-4">
                                    <label class="form-label">ID</label>
                                    <input type="text" class="form-control form-control-sm" id="mergeId" placeholder="Merge">
                                </div>
                                <div class="col-4">
                                    <label class="form-label">タグ</label>
                                    <input type="text" class="form-control form-control-sm" id="mergeTag" placeholder="v1.0.0">
                                </div>
                            </div>
                        `;
                        break;
                }

                cmdOptions.innerHTML = html;
            };

            cmdType.addEventListener('change', updateOptions);
            updateOptions();

            wrapper.querySelector('#addCmdBtn').addEventListener('click', () => {
                const type = cmdType.value;
                let cmd = { type };

                switch (type) {
                    case 'commit':
                        cmd.id = document.getElementById('commitId').value.trim();
                        cmd.tag = document.getElementById('commitTag').value.trim();
                        cmd.commitType = document.getElementById('commitType').value;
                        break;
                    case 'branch':
                        cmd.name = document.getElementById('branchName').value.trim();
                        if (!cmd.name) {
                            this.app.showToast('ブランチ名を入力してください', 'warning');
                            return;
                        }
                        break;
                    case 'checkout':
                        cmd.name = document.getElementById('checkoutName').value.trim();
                        if (!cmd.name) {
                            this.app.showToast('ブランチ名を入力してください', 'warning');
                            return;
                        }
                        break;
                    case 'merge':
                        cmd.name = document.getElementById('mergeName').value.trim();
                        cmd.id = document.getElementById('mergeId').value.trim();
                        cmd.tag = document.getElementById('mergeTag').value.trim();
                        if (!cmd.name) {
                            this.app.showToast('マージするブランチ名を入力してください', 'warning');
                            return;
                        }
                        break;
                }

                this.commands.push(cmd);
                this.refreshEditor();
                this.onInputChange();
            });
        }, 0);

        return wrapper;
    }

    moveCommand(index, direction) {
        const newIndex = index + direction;
        if (newIndex < 0 || newIndex >= this.commands.length) return;

        const temp = this.commands[index];
        this.commands[index] = this.commands[newIndex];
        this.commands[newIndex] = temp;

        this.refreshEditor();
        this.onInputChange();
    }

    deleteCommand(index) {
        this.commands.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    refreshEditor() {
        const container = document.getElementById('editorContainer');
        container.innerHTML = '';
        container.appendChild(this.render());
    }

    generateCode() {
        let code = 'gitGraph\n';

        this.commands.forEach(cmd => {
            switch (cmd.type) {
                case 'commit':
                    let commitLine = '    commit';
                    if (cmd.id) commitLine += ` id: "${cmd.id}"`;
                    if (cmd.tag) commitLine += ` tag: "${cmd.tag}"`;
                    if (cmd.commitType && cmd.commitType !== 'NORMAL') commitLine += ` type: ${cmd.commitType}`;
                    code += commitLine + '\n';
                    break;
                case 'branch':
                    code += `    branch ${cmd.name}\n`;
                    break;
                case 'checkout':
                    code += `    checkout ${cmd.name}\n`;
                    break;
                case 'merge':
                    let mergeLine = `    merge ${cmd.name}`;
                    if (cmd.id) mergeLine += ` id: "${cmd.id}"`;
                    if (cmd.tag) mergeLine += ` tag: "${cmd.tag}"`;
                    code += mergeLine + '\n';
                    break;
            }
        });

        return code;
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'simple':
                this.commands = [
                    { type: 'commit', id: 'C1', tag: '', commitType: 'NORMAL' },
                    { type: 'commit', id: 'C2', tag: '', commitType: 'NORMAL' },
                    { type: 'branch', name: 'feature' },
                    { type: 'checkout', name: 'feature' },
                    { type: 'commit', id: 'F1', tag: '', commitType: 'NORMAL' },
                    { type: 'checkout', name: 'main' },
                    { type: 'merge', name: 'feature', id: 'Merge', tag: '' }
                ];
                break;

            case 'gitflow':
                this.commands = [
                    { type: 'commit', id: 'Initial', tag: 'v0.1.0', commitType: 'NORMAL' },
                    { type: 'branch', name: 'develop' },
                    { type: 'checkout', name: 'develop' },
                    { type: 'commit', id: 'Setup', tag: '', commitType: 'NORMAL' },
                    { type: 'branch', name: 'feature/login' },
                    { type: 'checkout', name: 'feature/login' },
                    { type: 'commit', id: 'Login-1', tag: '', commitType: 'NORMAL' },
                    { type: 'commit', id: 'Login-2', tag: '', commitType: 'NORMAL' },
                    { type: 'checkout', name: 'develop' },
                    { type: 'merge', name: 'feature/login', id: 'Merge login', tag: '' },
                    { type: 'branch', name: 'release/1.0' },
                    { type: 'checkout', name: 'release/1.0' },
                    { type: 'commit', id: 'RC1', tag: '', commitType: 'NORMAL' },
                    { type: 'checkout', name: 'main' },
                    { type: 'merge', name: 'release/1.0', id: 'Release 1.0', tag: 'v1.0.0' },
                    { type: 'checkout', name: 'develop' },
                    { type: 'merge', name: 'release/1.0', id: 'Back merge', tag: '' }
                ];
                break;

            case 'feature':
                this.commands = [
                    { type: 'commit', id: 'Initial', tag: '', commitType: 'NORMAL' },
                    { type: 'branch', name: 'feature-a' },
                    { type: 'checkout', name: 'feature-a' },
                    { type: 'commit', id: 'A1', tag: '', commitType: 'NORMAL' },
                    { type: 'commit', id: 'A2', tag: '', commitType: 'NORMAL' },
                    { type: 'checkout', name: 'main' },
                    { type: 'branch', name: 'feature-b' },
                    { type: 'checkout', name: 'feature-b' },
                    { type: 'commit', id: 'B1', tag: '', commitType: 'NORMAL' },
                    { type: 'checkout', name: 'main' },
                    { type: 'merge', name: 'feature-a', id: 'Merge A', tag: '' },
                    { type: 'checkout', name: 'feature-b' },
                    { type: 'commit', id: 'B2', tag: '', commitType: 'NORMAL' },
                    { type: 'checkout', name: 'main' },
                    { type: 'merge', name: 'feature-b', id: 'Merge B', tag: 'v1.0.0' }
                ];
                break;
        }

        this.refreshEditor();
    }
}

window.GitGraphEditor = GitGraphEditor;
