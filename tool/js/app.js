/**
 * Mermaid図作成ツール - メインアプリケーション
 */

class MermaidApp {
    constructor() {
        this.currentDiagramType = 'flowchart';
        this.currentEditor = null;
        this.zoomLevel = 100;
        this.editors = {};

        // コードエディタ関連
        this.codeEditMode = false;
        this.lastValidCode = '';  // 最後に正常だったコード
        this.isEditingCode = false;  // 編集中フラグ（更新抑制用）

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

        // コードエディタ関連
        this.setupCodeEditorListeners();
    }

    /**
     * コードエディタ関連のイベントリスナー設定
     */
    setupCodeEditorListeners() {
        // リサイズハンドル
        const resizeHandle = document.getElementById('codeResizeHandle');
        const codeOutputArea = document.getElementById('codeOutputArea');
        let isResizing = false;
        let startY = 0;
        let startHeight = 0;

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startY = e.clientY;
            startHeight = codeOutputArea.offsetHeight;
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const deltaY = startY - e.clientY;
            const newHeight = Math.max(100, Math.min(window.innerHeight * 0.7, startHeight + deltaY));
            document.documentElement.style.setProperty('--code-output-height', newHeight + 'px');
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });

        // 表示/編集モード切り替え
        document.getElementById('codeModeView').addEventListener('change', () => this.setCodeEditMode(false));
        document.getElementById('codeModeEdit').addEventListener('change', () => this.setCodeEditMode(true));

        // コードエディタの入力
        const codeEditor = document.getElementById('codeEditor');
        let editTimeout = null;
        codeEditor.addEventListener('input', () => {
            // デバウンス（入力から500ms後に更新）
            clearTimeout(editTimeout);
            editTimeout = setTimeout(() => {
                this.applyCodeFromEditor();
            }, 500);
        });

        // フォーカス管理
        codeEditor.addEventListener('focus', () => {
            this.isEditingCode = true;
        });
        codeEditor.addEventListener('blur', () => {
            this.isEditingCode = false;
        });

        // 復元ボタン
        document.getElementById('restoreCode').addEventListener('click', () => this.restoreLastValidCode());

        // インポートボタン
        document.getElementById('importCode').addEventListener('click', () => this.showImportDialog());
    }

    /**
     * コード編集モードの切り替え
     * @param {boolean} editMode - 編集モードかどうか
     */
    setCodeEditMode(editMode) {
        this.codeEditMode = editMode;
        const codeOutput = document.getElementById('codeOutput');
        const codeEditor = document.getElementById('codeEditor');

        if (editMode) {
            // 編集モード
            codeOutput.classList.add('d-none');
            codeEditor.classList.remove('d-none');
            // 現在のコードをエディタにセット
            const currentCode = this.currentEditor ? this.currentEditor.generateCode() : '';
            codeEditor.value = currentCode;
            codeEditor.focus();
        } else {
            // 表示モード
            codeOutput.classList.remove('d-none');
            codeEditor.classList.add('d-none');
            // 編集中のコードがあれば適用
            if (codeEditor.value.trim()) {
                this.applyCodeFromEditor();
            }
        }
    }

    /**
     * エディタのコードを適用してプレビュー更新
     */
    async applyCodeFromEditor() {
        const codeEditor = document.getElementById('codeEditor');
        const code = codeEditor.value.trim();
        const errorEl = document.getElementById('codeError');
        const errorMsgEl = document.getElementById('codeErrorMsg');
        const restoreBtn = document.getElementById('restoreCode');
        const previewContainer = document.getElementById('mermaidPreview');

        if (!code) {
            errorEl.classList.add('d-none');
            restoreBtn.classList.add('d-none');
            codeEditor.classList.remove('has-error');
            previewContainer.innerHTML = '<p class="text-muted">コードを入力してください</p>';
            return;
        }

        try {
            // Mermaidの構文チェック（レンダリングを試行）
            const testId = 'mermaid-test-' + Date.now();
            await mermaid.render(testId, code);

            // 成功した場合
            this.lastValidCode = code;
            errorEl.classList.add('d-none');
            restoreBtn.classList.add('d-none');
            codeEditor.classList.remove('has-error');

            // プレビューを更新
            await this.renderPreviewFromCode(code);

            // 表示モードのコードも更新
            document.getElementById('codeOutput').querySelector('code').textContent = code;

        } catch (error) {
            // エラーの場合
            codeEditor.classList.add('has-error');
            errorEl.classList.remove('d-none');

            // エラーメッセージからエラー位置を抽出
            const errorMsg = this.parseErrorMessage(error);
            errorMsgEl.textContent = errorMsg;
            errorMsgEl.title = error.message || 'Syntax error';

            // 復元ボタンを表示（直前の正常コードがある場合）
            if (this.lastValidCode) {
                restoreBtn.classList.remove('d-none');
            }

            // プレビューにエラー表示
            previewContainer.innerHTML = `
                <div class="preview-error">
                    <i class="bi bi-exclamation-triangle"></i>
                    <p>構文エラー</p>
                    <small class="text-muted">${errorMsg}</small>
                </div>
            `;
        }
    }

    /**
     * エラーメッセージを解析してわかりやすい形式に
     * @param {Error} error - エラーオブジェクト
     * @returns {string} - パース済みエラーメッセージ
     */
    parseErrorMessage(error) {
        const msg = error.message || 'Unknown error';

        // 行番号の抽出を試みる
        const lineMatch = msg.match(/line\s+(\d+)/i);
        if (lineMatch) {
            return `${lineMatch[1]}行目付近でエラー`;
        }

        // Mermaid特有のエラーパターン
        if (msg.includes('Lexical error')) {
            const tokenMatch = msg.match(/Unrecognized text\..*?"([^"]+)"/);
            if (tokenMatch) {
                return `不明なトークン: "${tokenMatch[1]}"`;
            }
            return '構文エラー: 不明な文字列';
        }

        if (msg.includes('Parse error')) {
            return '構文エラー: 解析に失敗しました';
        }

        if (msg.includes('expecting')) {
            return '構文エラー: 予期しないトークン';
        }

        // そのまま返す（長い場合は切り詰め）
        return msg.length > 50 ? msg.substring(0, 50) + '...' : msg;
    }

    /**
     * コードからプレビューを直接レンダリング
     * @param {string} code - Mermaidコード
     */
    async renderPreviewFromCode(code) {
        const previewContainer = document.getElementById('mermaidPreview');

        try {
            previewContainer.innerHTML = '';
            previewContainer.style.width = '';
            previewContainer.style.height = '';

            const id = 'mermaid-' + Date.now();
            const { svg } = await mermaid.render(id, code);
            previewContainer.innerHTML = svg;

            const newSvg = previewContainer.querySelector('svg');
            if (newSvg) {
                delete newSvg.dataset.originalWidth;
                delete newSvg.dataset.originalHeight;
            }

            this.applyZoom();
        } catch (error) {
            console.error('Render error:', error);
        }
    }

    /**
     * 最後の正常なコードに復元
     */
    restoreLastValidCode() {
        if (!this.lastValidCode) return;

        const codeEditor = document.getElementById('codeEditor');
        codeEditor.value = this.lastValidCode;
        codeEditor.classList.remove('has-error');

        document.getElementById('codeError').classList.add('d-none');
        document.getElementById('restoreCode').classList.add('d-none');

        this.applyCodeFromEditor();
        this.showToast('直前の正常なコードに復元しました', 'success');
    }

    /**
     * インポートダイアログの表示
     */
    showImportDialog() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-box-arrow-in-down"></i> Mermaidコードをインポート</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Mermaidコードを貼り付けてください</label>
                            <textarea id="importCodeInput" class="form-control code-editor" rows="12"
                                placeholder="flowchart TD\n    A[開始] --> B[処理]\n    B --> C[終了]"
                                style="background-color: #2d2d2d; color: #f8f8f2;"></textarea>
                        </div>
                        <div class="alert alert-info small">
                            <i class="bi bi-info-circle"></i>
                            インポートすると、現在の編集内容は上書きされます。
                            対応している図タイプが自動検出されます。
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="doImportCode">
                            <i class="bi bi-check"></i> インポート
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#doImportCode').addEventListener('click', async () => {
            const code = modal.querySelector('#importCodeInput').value.trim();
            if (!code) {
                this.showToast('コードを入力してください', 'warning');
                return;
            }

            const result = await this.importCode(code);
            if (result) {
                bsModal.hide();
            }
        });

        modal.addEventListener('hidden.bs.modal', () => modal.remove());
    }

    /**
     * コードをインポート
     * @param {string} code - インポートするコード
     * @returns {boolean} - 成功したかどうか
     */
    async importCode(code) {
        // 図タイプを検出
        const detectedType = this.detectDiagramType(code);
        if (!detectedType) {
            this.showToast('対応していない図タイプです', 'error');
            return false;
        }

        // 構文チェック
        try {
            const testId = 'mermaid-import-test-' + Date.now();
            await mermaid.render(testId, code);
        } catch (error) {
            this.showToast('構文エラー: ' + this.parseErrorMessage(error), 'error');
            return false;
        }

        // 図タイプを切り替え
        if (this.currentDiagramType !== detectedType) {
            this.switchDiagramType(detectedType);
        }

        // 編集モードに切り替えてコードをセット
        document.getElementById('codeModeEdit').checked = true;
        this.setCodeEditMode(true);
        document.getElementById('codeEditor').value = code;

        // プレビューを更新
        await this.applyCodeFromEditor();

        this.showToast(`${this.getDiagramTypeName(detectedType)}をインポートしました`, 'success');
        return true;
    }

    /**
     * コードから図タイプを検出
     * @param {string} code - Mermaidコード
     * @returns {string|null} - 図タイプ
     */
    detectDiagramType(code) {
        const firstLine = code.split('\n')[0].trim().toLowerCase();

        // YAML frontmatterをスキップ
        let codeWithoutFrontmatter = code;
        if (code.startsWith('---')) {
            const endIndex = code.indexOf('---', 3);
            if (endIndex !== -1) {
                codeWithoutFrontmatter = code.substring(endIndex + 3).trim();
            }
        }

        const typeKeyword = codeWithoutFrontmatter.split('\n')[0].trim().toLowerCase();

        if (typeKeyword.startsWith('flowchart') || typeKeyword.startsWith('graph')) {
            return 'flowchart';
        }
        if (typeKeyword.startsWith('sequencediagram')) {
            return 'sequence';
        }
        if (typeKeyword.startsWith('classdiagram')) {
            return 'class';
        }
        if (typeKeyword.startsWith('statediagram')) {
            return 'state';
        }
        if (typeKeyword.startsWith('erdiagram')) {
            return 'er';
        }
        if (typeKeyword.startsWith('gitgraph')) {
            return 'gitgraph';
        }
        if (typeKeyword.startsWith('mindmap')) {
            return 'mindmap';
        }
        if (typeKeyword.startsWith('quadrantchart')) {
            return 'quadrant';
        }
        if (typeKeyword.startsWith('architecture')) {
            return 'architecture';
        }

        return null;
    }

    /**
     * 図タイプの日本語名を取得
     * @param {string} type - 図タイプ
     * @returns {string} - 日本語名
     */
    getDiagramTypeName(type) {
        const names = {
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
        return names[type] || type;
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
        // 編集モード中でフォーカスがあるときは更新を抑制
        if (this.codeEditMode && this.isEditingCode) {
            return;
        }

        const previewContainer = document.getElementById('mermaidPreview');
        const codeOutput = document.getElementById('codeOutput').querySelector('code');
        const codeEditor = document.getElementById('codeEditor');

        if (!this.currentEditor) {
            previewContainer.innerHTML = '<p class="text-muted">エディターを選択してください</p>';
            codeOutput.textContent = '';
            return;
        }

        const code = this.currentEditor.generateCode();
        codeOutput.textContent = code;

        // 編集モードでなければエディタも更新
        if (!this.codeEditMode) {
            codeEditor.value = code;
        }

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

            // 正常にレンダリングできたコードを保存
            this.lastValidCode = code;

            // エラー表示をクリア
            document.getElementById('codeError').classList.add('d-none');
            document.getElementById('restoreCode').classList.add('d-none');
            codeEditor.classList.remove('has-error');

            // 新しいSVGの元サイズをリセット（applyZoomで再取得される）
            const newSvg = previewContainer.querySelector('svg');
            if (newSvg) {
                delete newSvg.dataset.originalWidth;
                delete newSvg.dataset.originalHeight;
            }

            // ズームレベルの適用
            this.applyZoom();

            // インタラクティブ機能のセットアップ
            const svgElement = previewContainer.querySelector('svg');
            if (svgElement && this.currentEditor) {
                this.currentEditor.setupInteractivePreview(svgElement);
            }
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
