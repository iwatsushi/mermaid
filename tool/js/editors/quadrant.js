/**
 * 四象限図エディター
 */
class QuadrantEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.title = 'Quadrant Chart';
        this.xAxisLabel = 'X Axis';
        this.yAxisLabel = 'Y Axis';
        this.quadrantLabels = [
            'Quadrant 1',
            'Quadrant 2',
            'Quadrant 3',
            'Quadrant 4'
        ];
        this.points = [];

        // Theme オプション（quadrantはlook/layoutサポートなし）
        this.themeOptions = [
            { id: 'default', name: 'Default（標準）' },
            { id: 'forest', name: 'Forest（緑）' },
            { id: 'dark', name: 'Dark（ダークモード）' },
            { id: 'neutral', name: 'Neutral（モノクロ印刷向け）' },
            { id: 'base', name: 'Base（カスタマイズ用）' }
        ];

        this.templates = [
            { id: 'priority', name: '優先度マトリクス' },
            { id: 'swot', name: 'SWOT分析風' },
            { id: 'technology', name: '技術採用' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.theme = 'default';
        this.title = 'Priority Matrix';
        this.xAxisLabel = 'Urgency';
        this.yAxisLabel = 'Importance';
        this.quadrantLabels = [
            'Do First',
            'Schedule',
            'Delegate',
            'Eliminate'
        ];
        this.points = [
            { label: 'Task A', x: 0.8, y: 0.9 },
            { label: 'Task B', x: 0.3, y: 0.8 },
            { label: 'Task C', x: 0.7, y: 0.3 },
            { label: 'Task D', x: 0.2, y: 0.2 }
        ];
    }

    renderAppearanceSettings() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="row g-3">
                <div class="col-6">
                    <label class="form-label">Theme（配色）</label>
                    <select class="form-select form-select-sm" id="quadTheme">
                        ${this.themeOptions.map(opt =>
                            `<option value="${opt.id}" ${this.theme === opt.id ? 'selected' : ''}>${opt.name}</option>`
                        ).join('')}
                    </select>
                </div>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelector('#quadTheme')?.addEventListener('change', (e) => {
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

        // 基本設定
        container.appendChild(this.createSection('基本設定', 'bi-gear', this.renderBasicSettings()));

        // 象限ラベル
        container.appendChild(this.createSection('象限ラベル', 'bi-grid-3x3', this.renderQuadrantLabels()));

        // ポイント
        container.appendChild(this.createSection('ポイント', 'bi-geo-alt', this.renderPointList()));

        return container;
    }

    renderBasicSettings() {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `
            <div class="row g-2 mb-2">
                <div class="col-12">
                    <label class="form-label">タイトル</label>
                    <input type="text" class="form-control form-control-sm" id="chartTitle" value="${this.title}">
                </div>
            </div>
            <div class="row g-2">
                <div class="col-6">
                    <label class="form-label">X軸ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="xAxisLabel" value="${this.xAxisLabel}">
                </div>
                <div class="col-6">
                    <label class="form-label">Y軸ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="yAxisLabel" value="${this.yAxisLabel}">
                </div>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelector('#chartTitle')?.addEventListener('change', (e) => {
                this.title = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#xAxisLabel')?.addEventListener('change', (e) => {
                this.xAxisLabel = e.target.value;
                this.onInputChange();
            });
            wrapper.querySelector('#yAxisLabel')?.addEventListener('change', (e) => {
                this.yAxisLabel = e.target.value;
                this.onInputChange();
            });
        }, 0);

        return wrapper;
    }

    renderQuadrantLabels() {
        const wrapper = document.createElement('div');
        // 象限の視覚的な配置（実際の座標と同じレイアウト）
        // Q2(左上) | Q1(右上)
        // Q3(左下) | Q4(右下)
        wrapper.innerHTML = `
            <div class="border rounded p-2 mb-2 bg-light">
                <div class="row g-2 mb-2">
                    <div class="col-6 border-end">
                        <label class="form-label small mb-1">Q2 (左上)</label>
                        <input type="text" class="form-control form-control-sm quadrant-input" data-index="1" value="${this.quadrantLabels[1]}">
                    </div>
                    <div class="col-6">
                        <label class="form-label small mb-1">Q1 (右上)</label>
                        <input type="text" class="form-control form-control-sm quadrant-input" data-index="0" value="${this.quadrantLabels[0]}">
                    </div>
                </div>
                <hr class="my-2">
                <div class="row g-2">
                    <div class="col-6 border-end">
                        <label class="form-label small mb-1">Q3 (左下)</label>
                        <input type="text" class="form-control form-control-sm quadrant-input" data-index="2" value="${this.quadrantLabels[2]}">
                    </div>
                    <div class="col-6">
                        <label class="form-label small mb-1">Q4 (右下)</label>
                        <input type="text" class="form-control form-control-sm quadrant-input" data-index="3" value="${this.quadrantLabels[3]}">
                    </div>
                </div>
            </div>
            <div class="form-text">象限の配置を視覚的に表現しています。左上がQ2、右上がQ1です。</div>
        `;

        setTimeout(() => {
            wrapper.querySelectorAll('.quadrant-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    this.quadrantLabels[parseInt(e.target.dataset.index)] = e.target.value;
                    this.onInputChange();
                });
            });
        }, 0);

        return wrapper;
    }

    renderPointList() {
        const wrapper = document.createElement('div');

        // ポイントリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.points.length === 0) {
            list.innerHTML = '<div class="item-list-empty">ポイントがありません</div>';
        } else {
            this.points.forEach((point, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge bg-primary me-2">${point.label}</span>
                        <small class="text-muted">(${point.x.toFixed(2)}, ${point.y.toFixed(2)})</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-point" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-point" data-index="${index}">
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
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="pointLabel" placeholder="Item">
                </div>
                <div class="col-4">
                    <label class="form-label">X座標 (0-1)</label>
                    <input type="number" class="form-control form-control-sm" id="pointX" value="0.5" min="0" max="1" step="0.1">
                </div>
                <div class="col-4">
                    <label class="form-label">Y座標 (0-1)</label>
                    <input type="number" class="form-control form-control-sm" id="pointY" value="0.5" min="0" max="1" step="0.1">
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addPointBtn">
                <i class="bi bi-plus"></i> ポイントを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addPointBtn')?.addEventListener('click', () => this.addPoint());
            wrapper.querySelectorAll('.edit-point').forEach(btn => {
                btn.addEventListener('click', (e) => this.editPoint(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-point').forEach(btn => {
                btn.addEventListener('click', (e) => this.deletePoint(parseInt(e.currentTarget.dataset.index)));
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
                        this.movePoint(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    movePoint(fromIndex, toIndex) {
        const [moved] = this.points.splice(fromIndex, 1);
        this.points.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    addPoint() {
        const label = document.getElementById('pointLabel').value.trim() || 'Point ' + (this.points.length + 1);
        const x = parseFloat(document.getElementById('pointX').value) || 0.5;
        const y = parseFloat(document.getElementById('pointY').value) || 0.5;

        this.points.push({
            label,
            x: Math.min(1, Math.max(0, x)),
            y: Math.min(1, Math.max(0, y))
        });

        this.refreshEditor();
        this.onInputChange();

        document.getElementById('pointLabel').value = '';
    }

    editPoint(index) {
        const point = this.points[index];

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">ポイント編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ラベル</label>
                            <input type="text" class="form-control" id="editPointLabel" value="${point.label}">
                        </div>
                        <div class="row g-2">
                            <div class="col-6">
                                <label class="form-label">X座標 (0-1)</label>
                                <input type="number" class="form-control" id="editPointX" value="${point.x}" min="0" max="1" step="0.1">
                            </div>
                            <div class="col-6">
                                <label class="form-label">Y座標 (0-1)</label>
                                <input type="number" class="form-control" id="editPointY" value="${point.y}" min="0" max="1" step="0.1">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="savePointBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#savePointBtn').addEventListener('click', () => {
            point.label = modal.querySelector('#editPointLabel').value.trim() || point.label;
            point.x = Math.min(1, Math.max(0, parseFloat(modal.querySelector('#editPointX').value) || 0.5));
            point.y = Math.min(1, Math.max(0, parseFloat(modal.querySelector('#editPointY').value) || 0.5));

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    deletePoint(index) {
        this.points.splice(index, 1);
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

        // Theme設定がデフォルトでない場合はYAML frontmatterで出力
        if (this.theme !== 'default') {
            code += '---\n';
            code += 'config:\n';
            code += `  theme: ${this.theme}\n`;
            code += '---\n';
        }

        code += 'quadrantChart\n';
        code += `    title ${this.title}\n`;
        code += `    x-axis ${this.xAxisLabel}\n`;
        code += `    y-axis ${this.yAxisLabel}\n`;
        code += `    quadrant-1 ${this.quadrantLabels[0]}\n`;
        code += `    quadrant-2 ${this.quadrantLabels[1]}\n`;
        code += `    quadrant-3 ${this.quadrantLabels[2]}\n`;
        code += `    quadrant-4 ${this.quadrantLabels[3]}\n`;

        this.points.forEach(point => {
            code += `    ${point.label}: [${point.x.toFixed(2)}, ${point.y.toFixed(2)}]\n`;
        });

        return code;
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'priority':
                this.title = 'Priority Matrix';
                this.xAxisLabel = 'Urgency';
                this.yAxisLabel = 'Importance';
                this.quadrantLabels = ['Do First', 'Schedule', 'Delegate', 'Eliminate'];
                this.points = [
                    { label: 'Critical Bug', x: 0.9, y: 0.9 },
                    { label: 'New Feature', x: 0.3, y: 0.8 },
                    { label: 'Minor Fix', x: 0.8, y: 0.3 },
                    { label: 'Code Cleanup', x: 0.2, y: 0.2 }
                ];
                break;

            case 'swot':
                this.title = 'Strategic Analysis';
                this.xAxisLabel = 'External';
                this.yAxisLabel = 'Internal';
                this.quadrantLabels = ['Opportunities', 'Threats', 'Weaknesses', 'Strengths'];
                this.points = [
                    { label: 'Market Growth', x: 0.7, y: 0.8 },
                    { label: 'Competition', x: 0.8, y: 0.2 },
                    { label: 'Team Skills', x: 0.3, y: 0.7 },
                    { label: 'Legacy Code', x: 0.2, y: 0.3 }
                ];
                break;

            case 'technology':
                this.title = 'Technology Adoption';
                this.xAxisLabel = 'Maturity';
                this.yAxisLabel = 'Value';
                this.quadrantLabels = ['Adopt', 'Trial', 'Assess', 'Hold'];
                this.points = [
                    { label: 'React', x: 0.9, y: 0.9 },
                    { label: 'AI Assistant', x: 0.4, y: 0.8 },
                    { label: 'WebAssembly', x: 0.6, y: 0.5 },
                    { label: 'Legacy Framework', x: 0.9, y: 0.2 }
                ];
                break;
        }

        this.refreshEditor();
    }
}

window.QuadrantEditor = QuadrantEditor;
