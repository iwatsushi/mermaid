#!/usr/bin/env node
/**
 * Mermaid図ベンチマークテスト
 * 各Markdownファイルに含まれるMermaid図をパースし、構文エラーをチェックします。
 */

const fs = require('fs');
const path = require('path');

// Mermaid構文の検証用の簡易パーサー
const DIAGRAM_TYPES = {
  flowchart: /^(flowchart|graph)\s+(TB|TD|BT|RL|LR)/i,
  sequence: /^sequenceDiagram/i,
  class: /^classDiagram/i,
  state: /^stateDiagram(-v2)?/i,
  er: /^erDiagram/i,
  gantt: /^gantt/i,
  pie: /^pie/i,
  journey: /^journey/i,
  gitgraph: /^gitGraph/i,
  mindmap: /^mindmap/i,
  timeline: /^timeline/i,
  quadrant: /^quadrantChart/i,
  xychart: /^xychart-beta/i,
  requirement: /^requirementDiagram/i,
  block: /^block-beta/i,
  sankey: /^sankey-beta/i,
  architecture: /^architecture-beta/i,
  packet: /^packet-beta/i,
  kanban: /^kanban/i,
  zenuml: /^zenuml/i,
};

// ANSIカラーコード
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

class BenchmarkTester {
  constructor() {
    this.results = [];
    this.totalDiagrams = 0;
    this.successCount = 0;
    this.errorCount = 0;
    this.warningCount = 0;
  }

  /**
   * Markdownファイルからmermaidブロックを抽出
   */
  extractMermaidBlocks(content, filePath) {
    const blocks = [];
    const regex = /```mermaid\n([\s\S]*?)```/g;
    let match;
    let blockIndex = 0;

    while ((match = regex.exec(content)) !== null) {
      blockIndex++;
      blocks.push({
        code: match[1].trim(),
        startLine: content.substring(0, match.index).split('\n').length,
        filePath,
        blockIndex,
      });
    }

    return blocks;
  }

  /**
   * 図の種類を検出
   */
  detectDiagramType(code) {
    for (const [type, pattern] of Object.entries(DIAGRAM_TYPES)) {
      if (pattern.test(code.trim())) {
        return type;
      }
    }
    return 'unknown';
  }

  /**
   * 基本的な構文チェック
   */
  validateSyntax(code, diagramType) {
    const errors = [];
    const warnings = [];

    // 空のコードチェック
    if (!code.trim()) {
      errors.push('空のMermaidブロック');
      return { errors, warnings };
    }

    // 括弧の対応チェック
    const brackets = { '(': ')', '[': ']', '{': '}' };
    const stack = [];
    for (const char of code) {
      if (brackets[char]) {
        stack.push(brackets[char]);
      } else if (Object.values(brackets).includes(char)) {
        if (stack.pop() !== char) {
          warnings.push(`括弧の対応が不正: ${char}`);
        }
      }
    }
    if (stack.length > 0) {
      warnings.push(`閉じられていない括弧: ${stack.join(', ')}`);
    }

    // 図の種類ごとの検証
    switch (diagramType) {
      case 'flowchart':
        if (!/-->|---|-\.-|==>|-.->|~~~/m.test(code)) {
          warnings.push('接続がない可能性があります');
        }
        break;
      case 'sequence':
        if (!/->>|-->>|-\)|-\)|->|-->/m.test(code)) {
          warnings.push('メッセージがない可能性があります');
        }
        break;
      case 'class':
        if (!/class\s+\w+|<\|--|--|\.\.>|-->/m.test(code)) {
          warnings.push('クラス定義または関係がない可能性があります');
        }
        break;
      case 'state':
        if (!/-->/m.test(code)) {
          warnings.push('状態遷移がない可能性があります');
        }
        break;
      case 'er':
        if (!/\|[o|]{1,2}--[o|]{0,2}\{|\}[o|]{0,2}--[o|]{1,2}\|/m.test(code)) {
          warnings.push('ER関係がない可能性があります');
        }
        break;
    }

    return { errors, warnings };
  }

  /**
   * 単一のMermaidブロックをテスト
   */
  testBlock(block) {
    const startTime = process.hrtime.bigint();
    const diagramType = this.detectDiagramType(block.code);
    const { errors, warnings } = this.validateSyntax(block.code, diagramType);
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // ms

    this.totalDiagrams++;

    const result = {
      filePath: block.filePath,
      blockIndex: block.blockIndex,
      startLine: block.startLine,
      diagramType,
      codeLength: block.code.length,
      duration,
      errors,
      warnings,
      status: errors.length > 0 ? 'error' : warnings.length > 0 ? 'warning' : 'success',
    };

    if (result.status === 'error') {
      this.errorCount++;
    } else if (result.status === 'warning') {
      this.warningCount++;
    } else {
      this.successCount++;
    }

    this.results.push(result);
    return result;
  }

  /**
   * ファイルをテスト
   */
  testFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const blocks = this.extractMermaidBlocks(content, filePath);
    const results = [];

    for (const block of blocks) {
      results.push(this.testBlock(block));
    }

    return results;
  }

  /**
   * ディレクトリ内のすべてのMarkdownファイルをテスト
   */
  testDirectory(dirPath) {
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'));

    console.log(`${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}  Mermaid図 ベンチマークテスト${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
    console.log(`${colors.dim}ディレクトリ: ${dirPath}${colors.reset}`);
    console.log(`${colors.dim}対象ファイル: ${files.length}個${colors.reset}\n`);

    const startTime = process.hrtime.bigint();

    for (const file of files.sort()) {
      const filePath = path.join(dirPath, file);
      const fileResults = this.testFile(filePath);
      this.printFileResults(file, fileResults);
    }

    const endTime = process.hrtime.bigint();
    const totalDuration = Number(endTime - startTime) / 1000000;

    this.printSummary(totalDuration);
  }

  /**
   * ファイルごとの結果を表示
   */
  printFileResults(fileName, results) {
    if (results.length === 0) {
      console.log(`${colors.dim}📄 ${fileName} - Mermaid図なし${colors.reset}`);
      return;
    }

    const hasError = results.some((r) => r.status === 'error');
    const hasWarning = results.some((r) => r.status === 'warning');

    let icon, color;
    if (hasError) {
      icon = '❌';
      color = colors.red;
    } else if (hasWarning) {
      icon = '⚠️';
      color = colors.yellow;
    } else {
      icon = '✅';
      color = colors.green;
    }

    console.log(`${icon} ${color}${fileName}${colors.reset} - ${results.length}個の図`);

    for (const result of results) {
      const typeLabel = result.diagramType.padEnd(12);
      const durationLabel = `${result.duration.toFixed(2)}ms`.padStart(8);

      if (result.status === 'error') {
        console.log(`   ${colors.red}├─ [${result.blockIndex}] ${typeLabel} ${durationLabel} - エラー: ${result.errors.join(', ')}${colors.reset}`);
      } else if (result.status === 'warning') {
        console.log(`   ${colors.yellow}├─ [${result.blockIndex}] ${typeLabel} ${durationLabel} - 警告: ${result.warnings.join(', ')}${colors.reset}`);
      } else {
        console.log(`   ${colors.dim}├─ [${result.blockIndex}] ${typeLabel} ${durationLabel}${colors.reset}`);
      }
    }
    console.log();
  }

  /**
   * テスト結果のサマリーを表示
   */
  printSummary(totalDuration) {
    console.log(`${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bold}  テスト結果サマリー${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    console.log(`  総図数:     ${this.totalDiagrams}`);
    console.log(`  ${colors.green}✅ 成功:    ${this.successCount}${colors.reset}`);
    console.log(`  ${colors.yellow}⚠️  警告:    ${this.warningCount}${colors.reset}`);
    console.log(`  ${colors.red}❌ エラー:  ${this.errorCount}${colors.reset}`);
    console.log();
    console.log(`  ${colors.dim}実行時間: ${totalDuration.toFixed(2)}ms${colors.reset}`);

    // 図の種類ごとの統計
    const typeCounts = {};
    for (const result of this.results) {
      typeCounts[result.diagramType] = (typeCounts[result.diagramType] || 0) + 1;
    }

    console.log(`\n${colors.bold}  図の種類別統計:${colors.reset}`);
    for (const [type, count] of Object.entries(typeCounts).sort((a, b) => b[1] - a[1])) {
      console.log(`    ${type.padEnd(15)} ${count}個`);
    }

    console.log(`\n${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

    // 終了コード
    if (this.errorCount > 0) {
      console.log(`${colors.red}${colors.bold}テスト失敗: ${this.errorCount}個のエラーが検出されました${colors.reset}\n`);
      process.exitCode = 1;
    } else if (this.warningCount > 0) {
      console.log(`${colors.yellow}${colors.bold}テスト完了: ${this.warningCount}個の警告があります${colors.reset}\n`);
    } else {
      console.log(`${colors.green}${colors.bold}テスト成功: すべての図が正常です${colors.reset}\n`);
    }
  }
}

// メイン実行
const tester = new BenchmarkTester();
const targetDir = process.argv[2] || '/home/user/mermaid';
tester.testDirectory(targetDir);
