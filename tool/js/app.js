/**
 * Mermaid図作成ツール - メインアプリケーション
 */

class MermaidApp {
    constructor() {
        this.currentDiagramType = 'flowchart';
        this.currentEditor = null;
        this.zoomLevel = 100;
        this.editors = {};

        this.init();
    }

    /**
     * アプリケーションの初期化
     */
    async init() {
        // Mermaidの初期化
        mermaid.initialize({
            startOnLoad: false,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: { useMaxWidth: true, htmlLabels: true },
            sequence: { useMaxWidth: true },
            gantt: { useMaxWidth: true }
        });

        // アイコンパックの登録（AWS/Azure等のブランドアイコン用）
        await this.registerIconPacks();

        // エディターの登録
        this.registerEditors();

        // イベントリスナーの設定
        this.setupEventListeners();

        // 初期エディターの読み込み
        this.loadEditor('flowchart');
    }

    /**
     * アイコンパックの登録
     * iconify.design から各種アイコンパックを読み込んでMermaidに登録
     * すべてCDNから読み込むため、どの環境でも動作します
     */
    async registerIconPacks() {
        try {
            // 複数のアイコンパックを登録（すべてCDN経由）
            // - Azure: Azureサービスアイコン（azureiconkento）
            // - logos: 公式風カラーロゴ（AWS/GCP等）
            // - mdi: Material Design Icons（汎用アイコン）
            // - devicon: 開発ツールカラーアイコン
            // - simple-icons: ブランドアイコン（モノクロ）
            mermaid.registerIconPacks([
                {
                    name: 'Azure',
                    loader: () =>
                        fetch('https://unpkg.com/azureiconkento@1.2.1/azureicons/allicons.json')
                            .then((res) => res.json())
                },
                {
                    name: 'logos',
                    loader: () =>
                        fetch('https://unpkg.com/@iconify-json/logos/icons.json')
                            .then((res) => res.json())
                },
                {
                    name: 'mdi',
                    loader: () =>
                        fetch('https://unpkg.com/@iconify-json/mdi/icons.json')
                            .then((res) => res.json())
                },
                {
                    name: 'devicon',
                    loader: () =>
                        fetch('https://unpkg.com/@iconify-json/devicon/icons.json')
                            .then((res) => res.json())
                },
                {
                    name: 'simple-icons',
                    loader: () =>
                        fetch('https://unpkg.com/@iconify-json/simple-icons/icons.json')
                            .then((res) => res.json())
                }
            ]);
            console.log('Icon packs registered (Azure, logos, mdi, devicon, simple-icons)');
        } catch (error) {
            console.warn('Failed to register icon packs:', error);
        }
    }

    /**
     * エディターの登録
     */
    registerEditors() {
        this.editors = {
            flowchart: new FlowchartEditor(this),
            sequence: new SequenceEditor(this),
            class: new ClassEditor(this),
            state: new StateEditor(this),
            er: new EREditor(this),
            gitgraph: new GitGraphEditor(this),
            mindmap: new MindmapEditor(this),
            quadrant: new QuadrantEditor(this),
            architecture: new ArchitectureEditor(this)
        };
    }

    /**
     * イベントリスナーの設定
     */
    setupEventListeners() {
        // 図タイプの切り替え
        document.querySelectorAll('#diagramTypeNav .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const type = e.currentTarget.dataset.type;
                this.switchDiagramType(type);
            });
        });

        // ズーム機能
        document.getElementById('zoomIn').addEventListener('click', () => this.zoom(10));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoom(-10));
        document.getElementById('resetZoom').addEventListener('click', () => this.resetZoom());

        // コードコピー
        document.getElementById('copyCode').addEventListener('click', () => this.copyCode());

        // エクスポート機能
        document.getElementById('exportPng').addEventListener('click', () => this.exportPng());
        document.getElementById('exportSvg').addEventListener('click', () => this.exportSvg());
        document.getElementById('exportCode').addEventListener('click', () => this.exportCode());
        document.getElementById('exportMarkdown').addEventListener('click', () => this.exportMarkdown());

        // テンプレート選択
        document.getElementById('templateSelect').addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadTemplate(e.target.value);
            }
        });
    }

    /**
     * 図タイプの切り替え
     * @param {string} type - 図タイプ
     */
    switchDiagramType(type) {
        // ナビゲーションのアクティブ状態更新
        document.querySelectorAll('#diagramTypeNav .nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.type === type);
        });

        this.currentDiagramType = type;
        this.loadEditor(type);
    }

    /**
     * エディターの読み込み
     * @param {string} type - 図タイプ
     */
    loadEditor(type) {
        const editor = this.editors[type];
        if (!editor) {
            console.error(`Editor not found: ${type}`);
            return;
        }

        this.currentEditor = editor;

        // エディターコンテナの更新
        const container = document.getElementById('editorContainer');
        container.innerHTML = '';
        container.appendChild(editor.render());

        // 図タイプ表示の更新
        const typeNames = {
            flowchart: 'フローチャート',
            sequence: 'シーケンス図',
            class: 'クラス図',
            state: '状態遷移図',
            er: 'ER図',
            gitgraph: 'Gitグラフ',
            mindmap: 'マインドマップ',
            quadrant: '四象限図',
            architecture: 'アーキテクチャ図'
        };
        document.getElementById('currentDiagramType').textContent = typeNames[type] || type;

        // テンプレートの更新
        this.updateTemplateOptions(type);

        // プレビューの更新
        this.updatePreview();
    }

    /**
     * テンプレートオプションの更新
     * @param {string} type - 図タイプ
     */
    updateTemplateOptions(type) {
        const select = document.getElementById('templateSelect');
        select.innerHTML = '<option value="">テンプレートを選択...</option>';

        const editor = this.editors[type];
        if (editor && editor.templates) {
            editor.templates.forEach(template => {
                const option = document.createElement('option');
                option.value = template.id;
                option.textContent = template.name;
                select.appendChild(option);
            });
        }
    }

    /**
     * テンプレートの読み込み
     * @param {string} templateId - テンプレートID
     */
    loadTemplate(templateId) {
        if (this.currentEditor && this.currentEditor.loadTemplate) {
            this.currentEditor.loadTemplate(templateId);
            this.updatePreview();
        }
        // 選択をリセット
        document.getElementById('templateSelect').value = '';
    }

    /**
     * プレビューの更新
     */
    async updatePreview() {
        const previewContainer = document.getElementById('mermaidPreview');
        const codeOutput = document.getElementById('codeOutput').querySelector('code');

        if (!this.currentEditor) {
            previewContainer.innerHTML = '<p class="text-muted">エディターを選択してください</p>';
            codeOutput.textContent = '';
            return;
        }

        const code = this.currentEditor.generateCode();
        codeOutput.textContent = code;

        if (!code.trim()) {
            previewContainer.innerHTML = '<p class="text-muted">図の要素を追加してください</p>';
            return;
        }

        try {
            // 既存のSVGをクリア
            previewContainer.innerHTML = '';
            previewContainer.style.width = '';
            previewContainer.style.height = '';

            // ユニークなIDを生成
            const id = 'mermaid-' + Date.now();

            // Mermaidでレンダリング
            const { svg } = await mermaid.render(id, code);
            previewContainer.innerHTML = svg;

            // 新しいSVGの元サイズをリセット（applyZoomで再取得される）
            const newSvg = previewContainer.querySelector('svg');
            if (newSvg) {
                delete newSvg.dataset.originalWidth;
                delete newSvg.dataset.originalHeight;
            }

            // ズームレベルの適用
            this.applyZoom();
        } catch (error) {
            console.error('Mermaid render error:', error);
            previewContainer.innerHTML = `
                <div class="preview-error">
                    <i class="bi bi-exclamation-triangle"></i>
                    <p>図の生成中にエラーが発生しました</p>
                    <small class="text-muted">${error.message || 'Syntax error'}</small>
                </div>
            `;
        }
    }

    /**
     * ズームレベルの変更
     * @param {number} delta - 変更量
     */
    zoom(delta) {
        this.zoomLevel = Math.min(200, Math.max(25, this.zoomLevel + delta));
        document.getElementById('zoomLevel').textContent = this.zoomLevel + '%';
        this.applyZoom();
    }

    /**
     * ズームのリセット
     */
    resetZoom() {
        this.zoomLevel = 100;
        document.getElementById('zoomLevel').textContent = '100%';
        this.applyZoom();
    }

    /**
     * ズームの適用
     */
    applyZoom() {
        const svg = document.querySelector('#mermaidPreview svg');
        const preview = document.getElementById('mermaidPreview');
        if (svg && preview) {
            const scale = this.zoomLevel / 100;

            // 元のサイズを保存（初回のみ）
            if (!svg.dataset.originalWidth) {
                // transformをリセットしてから元サイズを取得
                svg.style.transform = '';
                svg.dataset.originalWidth = svg.getBoundingClientRect().width;
                svg.dataset.originalHeight = svg.getBoundingClientRect().height;
            }

            const originalWidth = parseFloat(svg.dataset.originalWidth);
            const originalHeight = parseFloat(svg.dataset.originalHeight);

            // SVGをスケール
            svg.style.transform = `scale(${scale})`;
            svg.style.transformOrigin = 'top left';

            // ラッパーのサイズをスケール後のサイズに合わせる
            preview.style.width = (originalWidth * scale) + 'px';
            preview.style.height = (originalHeight * scale) + 'px';
        }
    }

    /**
     * コードをクリップボードにコピー
     */
    async copyCode() {
        let code = this.currentEditor ? this.currentEditor.generateCode() : '';
        if (code) {
            const asMarkdown = document.getElementById('copyAsMarkdown')?.checked;
            if (asMarkdown) {
                code = '```mermaid\n' + code + '```';
            }
            const success = await ExportUtils.copyToClipboard(code);
            const format = asMarkdown ? 'Markdown形式で' : '';
            this.showToast(success ? `${format}コピーしました` : 'コピーに失敗しました', success ? 'success' : 'error');
        }
    }

    /**
     * PNG形式でエクスポート
     */
    async exportPng() {
        const svg = document.querySelector('#mermaidPreview svg');
        if (svg) {
            try {
                await ExportUtils.exportAsPng(svg, `${this.currentDiagramType}-diagram.png`);
                this.showToast('PNG画像をダウンロードしました', 'success');
            } catch (error) {
                this.showToast(error.message, 'error');
            }
        } else {
            this.showToast('エクスポートする図がありません', 'warning');
        }
    }

    /**
     * SVG形式でエクスポート
     */
    exportSvg() {
        const svg = document.querySelector('#mermaidPreview svg');
        if (svg) {
            try {
                ExportUtils.exportAsSvg(svg, `${this.currentDiagramType}-diagram.svg`);
                this.showToast('SVG画像をダウンロードしました', 'success');
            } catch (error) {
                this.showToast(error.message, 'error');
            }
        } else {
            this.showToast('エクスポートする図がありません', 'warning');
        }
    }

    /**
     * コード形式でエクスポート
     */
    exportCode() {
        const code = this.currentEditor ? this.currentEditor.generateCode() : '';
        if (code) {
            ExportUtils.exportAsCode(code, `${this.currentDiagramType}-diagram.mmd`);
            this.showToast('Mermaidコードをダウンロードしました', 'success');
        } else {
            this.showToast('エクスポートするコードがありません', 'warning');
        }
    }

    /**
     * Markdown形式でエクスポート
     */
    exportMarkdown() {
        const code = this.currentEditor ? this.currentEditor.generateCode() : '';
        if (code) {
            ExportUtils.exportAsMarkdown(code, `${this.currentDiagramType}-diagram.md`);
            this.showToast('Markdownファイルをダウンロードしました', 'success');
        } else {
            this.showToast('エクスポートするコードがありません', 'warning');
        }
    }

    /**
     * トースト通知の表示
     * @param {string} message - メッセージ
     * @param {string} type - タイプ (success, error, warning)
     */
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastBody = document.getElementById('toastBody');
        const toastTitle = document.getElementById('toastTitle');

        const titles = {
            success: '成功',
            error: 'エラー',
            warning: '警告',
            info: '情報'
        };

        toastTitle.textContent = titles[type] || titles.info;
        toastBody.textContent = message;

        // アイコンの更新
        const iconEl = toast.querySelector('.toast-header i');
        iconEl.className = 'bi me-2';
        switch (type) {
            case 'success':
                iconEl.classList.add('bi-check-circle', 'text-success');
                break;
            case 'error':
                iconEl.classList.add('bi-x-circle', 'text-danger');
                break;
            case 'warning':
                iconEl.classList.add('bi-exclamation-circle', 'text-warning');
                break;
            default:
                iconEl.classList.add('bi-info-circle', 'text-primary');
        }

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

// アプリケーションの起動
document.addEventListener('DOMContentLoaded', () => {
    window.mermaidApp = new MermaidApp();
});
