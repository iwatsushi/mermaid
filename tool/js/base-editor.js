/**
 * ベースエディタークラス
 * すべてのエディターの基底クラス
 */
class BaseEditor {
    constructor(app) {
        this.app = app;
        this.templates = [];
    }

    render() {
        const container = document.createElement('div');
        container.innerHTML = '<p class="text-muted">このエディターは準備中です</p>';
        return container;
    }

    generateCode() {
        return '';
    }

    loadTemplate(templateId) {
        // オーバーライド用
    }

    /**
     * 入力変更時のプレビュー更新
     */
    onInputChange() {
        this.app.updatePreview();
    }

    /**
     * アイテムリストのHTML生成
     * @param {Array} items - アイテム配列
     * @param {Function} renderItem - アイテムレンダリング関数
     * @param {string} emptyMessage - 空の場合のメッセージ
     */
    createItemList(items, renderItem, emptyMessage = 'アイテムがありません') {
        const list = document.createElement('div');
        list.className = 'item-list';

        if (items.length === 0) {
            list.innerHTML = `<div class="item-list-empty">${emptyMessage}</div>`;
        } else {
            items.forEach((item, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.innerHTML = renderItem(item, index);
                list.appendChild(itemEl);
            });
        }

        return list;
    }

    /**
     * セクションの作成
     * @param {string} title - セクションタイトル
     * @param {string} icon - アイコンクラス
     * @param {HTMLElement|string} content - コンテンツ
     */
    createSection(title, icon, content) {
        const section = document.createElement('div');
        section.className = 'editor-section';

        const titleEl = document.createElement('div');
        titleEl.className = 'editor-section-title';
        titleEl.innerHTML = `<i class="bi ${icon}"></i> ${title}`;

        section.appendChild(titleEl);

        if (typeof content === 'string') {
            const contentEl = document.createElement('div');
            contentEl.innerHTML = content;
            section.appendChild(contentEl);
        } else {
            section.appendChild(content);
        }

        return section;
    }

    /**
     * ユニークなID生成
     */
    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * プレビューのインタラクティブ機能セットアップ
     * オーバーライドして使用
     * @param {SVGElement} svgElement - プレビューのSVG要素
     */
    setupInteractivePreview(svgElement) {
        // サブクラスでオーバーライド
    }
}

// グローバルに公開
window.BaseEditor = BaseEditor;
