# Gantt Chart（ガントチャート）

プロジェクトのスケジュールとタスクの進捗を視覚化する図です。

## 基本構文

```mermaid
gantt
    title プロジェクト計画
    dateFormat YYYY-MM-DD

    section 企画
    要件定義 :a1, 2024-01-01, 10d
    設計 :a2, after a1, 15d

    section 開発
    実装 :b1, after a2, 20d
    テスト :b2, after b1, 10d
```

## 日付フォーマット

```mermaid
gantt
    dateFormat YYYY-MM-DD
    axisFormat %m/%d

    section タスク
    タスク1 :2024-01-15, 7d
    タスク2 :2024-01-22, 5d
```

### 日付フォーマット一覧

| フォーマット | 例 |
|--------------|-----|
| `YYYY-MM-DD` | 2024-01-15 |
| `DD-MM-YYYY` | 15-01-2024 |
| `YYYY-MM-DD HH:mm` | 2024-01-15 09:00 |

### 軸フォーマット一覧

| フォーマット | 説明 |
|--------------|------|
| `%Y` | 4桁の年 |
| `%m` | 2桁の月 |
| `%d` | 2桁の日 |
| `%H` | 24時間制の時 |
| `%M` | 分 |
| `%W` | 週番号 |

## タスクの状態

```mermaid
gantt
    title タスク状態の例
    dateFormat YYYY-MM-DD

    section 状態
    完了タスク :done, task1, 2024-01-01, 5d
    アクティブタスク :active, task2, after task1, 5d
    通常タスク :task3, after task2, 5d
    クリティカルタスク :crit, task4, after task3, 5d
    マイルストーン :milestone, m1, after task4, 1d
```

### タスク状態一覧

| 状態 | 説明 |
|------|------|
| `done` | 完了済み |
| `active` | 進行中 |
| `crit` | クリティカル（重要） |
| `milestone` | マイルストーン |

## タスクの依存関係

```mermaid
gantt
    title 依存関係の例
    dateFormat YYYY-MM-DD

    section フェーズ1
    タスクA :a, 2024-01-01, 7d
    タスクB :b, 2024-01-01, 5d

    section フェーズ2
    タスクC :c, after a, 5d
    タスクD :d, after a b, 7d

    section フェーズ3
    タスクE :e, after c d, 5d
```

## 除外日（休日設定）

```mermaid
gantt
    title 休日を考慮したスケジュール
    dateFormat YYYY-MM-DD
    excludes weekends

    section 作業
    タスク1 :2024-01-08, 5d
    タスク2 :2024-01-15, 5d
```

### 除外設定

```mermaid
gantt
    dateFormat YYYY-MM-DD
    excludes weekends, 2024-01-01, 2024-01-02, 2024-01-03

    section 作業
    タスク :2024-01-01, 10d
```

## シンプルなスケジュール

```mermaid
gantt
    title シンプルな例
    dateFormat YYYY-MM-DD

    section 作業
    タスク :2024-01-08, 14d
```

## 複合状態

```mermaid
gantt
    title 複合状態の例
    dateFormat YYYY-MM-DD

    section 開発
    完了かつクリティカル :done, crit, dc1, 2024-01-01, 5d
    アクティブかつクリティカル :active, crit, ac1, after dc1, 5d
    最終確認 :crit, m1, after ac1, 1d
```

## セクション

```mermaid
gantt
    title 複数セクションの例
    dateFormat YYYY-MM-DD

    section バックエンド
    API設計 :be1, 2024-01-01, 5d
    API実装 :be2, after be1, 10d
    APIテスト :be3, after be2, 5d

    section フロントエンド
    UI設計 :fe1, 2024-01-01, 7d
    UI実装 :fe2, after fe1, 12d
    UIテスト :fe3, after fe2, 5d

    section インフラ
    環境構築 :inf1, 2024-01-01, 3d
    CI/CD設定 :inf2, after inf1, 5d
    モニタリング設定 :inf3, after inf2, 3d

    section 統合
    結合テスト :int1, after be3 fe3, 7d
    リリース準備 :int2, after int1, 3d
    リリース :milestone, m1, after int2, 1d
```

## クリックイベント

```mermaid
gantt
    title クリック可能なガントチャート
    dateFormat YYYY-MM-DD

    section タスク
    タスク1 :a1, 2024-01-01, 5d
    タスク2 :a2, after a1, 5d

    click a1 href "https://example.com/task1"
```

## 表示モード

```mermaid
gantt
    title コンパクト表示
    dateFormat YYYY-MM-DD

    section 作業
    タスク1 :2024-01-01, 3d
    タスク2 :2024-01-04, 3d
```

## 実践的な例：Webアプリ開発プロジェクト

```mermaid
gantt
    title Webアプリケーション開発プロジェクト
    dateFormat YYYY-MM-DD
    excludes weekends

    section 企画・準備
    プロジェクト立ち上げ :done, p1, 2024-01-08, 3d
    要件ヒアリング :done, p2, after p1, 5d
    要件定義書作成 :done, p3, after p2, 5d
    要件レビュー :done, crit, p4, after p3, 2d
    要件確定 :done, milestone, m1, after p4, 1d

    section 設計
    システム設計 :done, d1, after m1, 7d
    DB設計 :done, d2, after m1, 5d
    API設計 :active, d3, after d2, 5d
    UI/UXデザイン :active, d4, after m1, 10d
    設計レビュー :crit, d5, after d1 d3 d4, 3d
    設計確定 :milestone, m2, after d5, 1d

    section バックエンド開発
    環境構築 :be1, after m2, 3d
    認証機能 :be2, after be1, 7d
    ユーザー管理API :be3, after be2, 5d
    商品管理API :be4, after be2, 7d
    注文管理API :be5, after be3, 7d
    決済連携 :crit, be6, after be5, 5d
    バックエンド単体テスト :be7, after be4 be6, 5d

    section フロントエンド開発
    環境構築 :fe1, after m2, 2d
    共通コンポーネント :fe2, after fe1, 7d
    ユーザー画面 :fe3, after fe2, 10d
    管理画面 :fe4, after fe2, 8d
    フロントエンド単体テスト :fe5, after fe3 fe4, 5d

    section インフラ
    開発環境構築 :inf1, after m2, 3d
    ステージング環境構築 :inf2, after inf1, 3d
    本番環境構築 :inf3, after inf2, 5d
    CI/CDパイプライン :inf4, after inf1, 5d
    監視・ログ設定 :inf5, after inf3, 3d

    section テスト・品質保証
    テスト計画作成 :qa1, after m2, 5d
    結合テスト :crit, qa2, after be7 fe5, 7d
    性能テスト :qa3, after qa2, 5d
    セキュリティテスト :crit, qa4, after qa2, 5d
    UAT :crit, qa5, after qa3 qa4, 5d
    バグ修正 :qa6, after qa5, 5d
    最終確認 :qa7, after qa6, 2d
    テスト完了 :milestone, m3, after qa7, 1d

    section リリース
    リリース準備 :r1, after m3, 3d
    本番デプロイ :crit, r2, after r1, 1d
    リリース確認 :r3, after r2, 1d
    プロジェクト完了 :milestone, m4, after r3, 1d
```

## 実践的な例：スプリント計画

```mermaid
gantt
    title Sprint 12 計画
    dateFormat YYYY-MM-DD
    excludes weekends

    section ユーザーストーリー1
    US1 ログイン機能改善 :active, us1, 2024-01-15, 3d
    US1 コードレビュー :us1r, after us1, 1d
    US1 テスト :us1t, after us1r, 1d

    section ユーザーストーリー2
    US2 検索機能追加 :us2, 2024-01-15, 4d
    US2 コードレビュー :us2r, after us2, 1d
    US2 テスト :us2t, after us2r, 1d

    section ユーザーストーリー3
    US3 レポート出力 :us3, after us1, 3d
    US3 コードレビュー :us3r, after us3, 1d
    US3 テスト :us3t, after us3r, 1d

    section スプリントイベント
    スプリント計画 :done, sp, 2024-01-15, 1d
    デイリースクラム :daily, 2024-01-16, 9d
    スプリントレビュー :sr, 2024-01-26, 1d
```
