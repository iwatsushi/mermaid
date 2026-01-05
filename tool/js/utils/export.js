/**
 * エクスポートユーティリティ
 * PNG, SVG, Mermaidコード, Markdown形式でのエクスポート機能を提供
 */

const ExportUtils = {
    /**
     * SVGをPNG画像としてダウンロード
     * @param {SVGElement} svgElement - SVG要素
     * @param {string} filename - ファイル名
     */
    async exportAsPng(svgElement, filename = 'mermaid-diagram.png') {
        try {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const scale = 2; // Higher resolution
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;

                const ctx = canvas.getContext('2d');
                ctx.fillStyle = 'white';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.scale(scale, scale);
                ctx.drawImage(img, 0, 0);

                canvas.toBlob((blob) => {
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    URL.revokeObjectURL(link.href);
                }, 'image/png');

                URL.revokeObjectURL(url);
            };
            img.src = url;
        } catch (error) {
            console.error('PNG export error:', error);
            throw new Error('PNG画像のエクスポートに失敗しました');
        }
    },

    /**
     * SVGをSVGファイルとしてダウンロード
     * @param {SVGElement} svgElement - SVG要素
     * @param {string} filename - ファイル名
     */
    exportAsSvg(svgElement, filename = 'mermaid-diagram.svg') {
        try {
            const svgData = new XMLSerializer().serializeToString(svgElement);
            const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const link = document.createElement('a');
            link.download = filename;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('SVG export error:', error);
            throw new Error('SVG画像のエクスポートに失敗しました');
        }
    },

    /**
     * Mermaidコードをテキストファイルとしてダウンロード
     * @param {string} code - Mermaidコード
     * @param {string} filename - ファイル名
     */
    exportAsCode(code, filename = 'mermaid-diagram.mmd') {
        try {
            const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.download = filename;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Code export error:', error);
            throw new Error('コードのエクスポートに失敗しました');
        }
    },

    /**
     * Markdown形式でダウンロード
     * @param {string} code - Mermaidコード
     * @param {string} filename - ファイル名
     */
    exportAsMarkdown(code, filename = 'mermaid-diagram.md') {
        try {
            const markdown = '```mermaid\n' + code + '\n```';
            const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
            const link = document.createElement('a');
            link.download = filename;
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Markdown export error:', error);
            throw new Error('Markdownのエクスポートに失敗しました');
        }
    },

    /**
     * クリップボードにテキストをコピー
     * @param {string} text - コピーするテキスト
     * @returns {Promise<boolean>} - 成功したかどうか
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed';
            textarea.style.left = '-9999px';
            document.body.appendChild(textarea);
            textarea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textarea);
            return success;
        }
    }
};

// グローバルに公開
window.ExportUtils = ExportUtils;
