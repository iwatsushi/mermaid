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

        this.templates = [
            { id: 'priority', name: '優先度マトリクス' },
            { id: 'swot', name: 'SWOT分析風' },
            { id: 'technology', name: '技術採用' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
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

    render() {
        const container = document.createElement('div');

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
        wrapper.innerHTML = `
            <div class="row g-2">
                <div class="col-6">
                    <label class="form-label">Q1 (右上)</label>
                    <input type="text" class="form-control form-control-sm quadrant-label" data-index="0" value="${this.quadrantLabels[0]}">
                </div>
                <div class="col-6">
                    <label class="form-label">Q2 (左上)</label>
                    <input type="text" class="form-control form-control-sm quadrant-label" data-index="1" value="${this.quadrantLabels[1]}">
                </div>
                <div class="col-6">
                    <label class="form-label">Q3 (左下)</label>
                    <input type="text" class="form-control form-control-sm quadrant-label" data-index="2" value="${this.quadrantLabels[2]}">
                </div>
                <div class="col-6">
                    <label class="form-label">Q4 (右下)</label>
                    <input type="text" class="form-control form-control-sm quadrant-label" data-index="3" value="${this.quadrantLabels[3]}">
                </div>
            </div>
        `;

        setTimeout(() => {
            wrapper.querySelectorAll('.quadrant-label').forEach(input => {
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

        const list = this.createItemList(
            this.points,
            (point, index) => `
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
            `,
            'ポイントがありません'
        );
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
        }, 0);

        return wrapper;
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
        const newLabel = prompt('ラベル:', point.label);
        if (newLabel !== null) {
            point.label = newLabel;
            const newX = prompt('X座標 (0-1):', point.x);
            if (newX !== null) point.x = Math.min(1, Math.max(0, parseFloat(newX) || 0.5));
            const newY = prompt('Y座標 (0-1):', point.y);
            if (newY !== null) point.y = Math.min(1, Math.max(0, parseFloat(newY) || 0.5));

            this.refreshEditor();
            this.onInputChange();
        }
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
        let code = 'quadrantChart\n';
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
