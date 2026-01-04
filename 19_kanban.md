# Kanban（カンバンボード）

タスク管理やワークフローを視覚化するカンバンボードです。

> **注意**: `kanban` はMermaid v10.9.0以降で利用可能な機能です。お使いの環境がサポートしているか確認してください。

## 基本構文

```mermaid
kanban
    column1[ToDo]
        task1[タスク1]
        task2[タスク2]

    column2[In Progress]
        task3[タスク3]

    column3[Done]
        task4[タスク4]
```

## タスクの詳細

```mermaid
kanban
    Todo[Todo]
        task1[新機能の設計]
        task2[バグ修正 #123]
        task3[ドキュメント更新]

    InProgress[In Progress]
        task4[APIエンドポイント実装]
        task5[UIコンポーネント作成]

    Review[Review]
        task6[コードレビュー待ち]

    Done[Done]
        task7[初期セットアップ]
        task8[環境構築]
```

## 実践的な例：スプリントボード

```mermaid
kanban
    Backlog[バックログ]
        story1[US-101: ユーザー検索機能]
        story2[US-102: お気に入り機能]
        story3[US-103: 通知設定]
        story4[US-104: プロフィール編集]

    Todo[ToDo]
        story5[US-105: パスワードリセット]
        story6[US-106: SNSログイン]

    InProgress[作業中]
        story7[US-107: ダッシュボード改善]
        story8[BUG-201: ログインエラー修正]

    Review[レビュー]
        story9[US-108: レポート出力機能]

    Testing[テスト]
        story10[US-109: メール通知]

    Done[完了]
        story11[US-110: 初期設定ウィザード]
        story12[US-111: 言語切替]
```

## 実践的な例：開発ワークフロー

```mermaid
kanban
    Ideas[アイデア]
        idea1[AI機能の追加]
        idea2[モバイルアプリ対応]
        idea3[APIv2開発]

    Planning[企画中]
        plan1[ダークモード実装]
        plan2[パフォーマンス改善]

    Design[設計]
        design1[新UIデザイン]

    Development[開発]
        dev1[検索機能強化]
        dev2[キャッシュ最適化]

    CodeReview[コードレビュー]
        review1[認証リファクタリング]

    QA[QA/テスト]
        qa1[E2Eテスト追加]

    Staging[ステージング]
        staging1[v2.1.0候補]

    Production[本番]
        prod1[v2.0.5リリース済]
```

## 実践的な例：バグトラッキング

```mermaid
kanban
    New[新規]
        bug1[ログイン失敗時のエラー表示]
        bug2[画像アップロードエラー]
        bug3[検索結果の並び順]

    Triaged[トリアージ済]
        bug4[CSVエクスポート文字化け]
        bug5[セッションタイムアウト]

    InProgress[対応中]
        bug6[決済処理のタイムアウト]

    Fixed[修正済]
        bug7[日付フォーマット不正]

    Verified[検証済]
        bug8[メール送信失敗]

    Closed[クローズ]
        bug9[初期化エラー]
        bug10[権限チェック漏れ]
```

## 実践的な例：リリース管理

```mermaid
kanban
    Planned[計画中]
        release1[v3.0.0 - メジャーアップデート]
        release2[v2.2.0 - 機能追加]

    Development[開発中]
        release3[v2.1.1 - パッチリリース]

    FeatureFreeze[機能フリーズ]
        release4[v2.1.0 - マイナーリリース]

    RCTesting[RC テスト]
        release5[v2.0.5-rc1]

    Released[リリース済]
        release6[v2.0.4]
        release7[v2.0.3]
        release8[v2.0.2]
```

## 実践的な例：個人タスク管理

```mermaid
kanban
    Inbox[インボックス]
        task1[会議の準備]
        task2[資料作成]
        task3[コードレビュー依頼]

    Today[今日やる]
        task4[デイリーミーティング]
        task5[バグ修正]

    ThisWeek[今週中]
        task6[機能実装]
        task7[ドキュメント更新]

    Waiting[待ち]
        task8[承認待ち]
        task9[レビュー待ち]

    Done[完了]
        task10[環境構築]
        task11[調査タスク]
```

## 実践的な例：採用プロセス

```mermaid
kanban
    Applied[応募]
        candidate1[田中さん - エンジニア]
        candidate2[佐藤さん - デザイナー]
        candidate3[鈴木さん - PM]

    Screening[書類選考]
        candidate4[高橋さん - エンジニア]

    Interview1[一次面接]
        candidate5[伊藤さん - エンジニア]

    Interview2[二次面接]
        candidate6[渡辺さん - デザイナー]

    FinalInterview[最終面接]
        candidate7[山本さん - エンジニア]

    OfferExtended[オファー中]
        candidate8[中村さん - PM]

    Hired[採用]
        candidate9[小林さん - エンジニア]
        candidate10[加藤さん - デザイナー]
```

## 実践的な例：コンテンツ制作

```mermaid
kanban
    Ideas[アイデア]
        content1[入門チュートリアル]
        content2[ベストプラクティス集]
        content3[動画コンテンツ]

    Writing[執筆中]
        content4[APIドキュメント]
        content5[ユーザーガイド]

    Editing[編集中]
        content6[リリースノート]

    Review[レビュー]
        content7[FAQ更新]

    Published[公開済]
        content8[クイックスタート]
        content9[インストールガイド]
```

## 実践的な例：サポートチケット

```mermaid
kanban
    New[新規]
        ticket1[ログインできない]
        ticket2[請求に関する質問]
        ticket3[機能リクエスト]

    Assigned[担当割当済]
        ticket4[データエクスポート問題]
        ticket5[パフォーマンス低下]

    InProgress[対応中]
        ticket6[API接続エラー]

    WaitingCustomer[顧客回答待ち]
        ticket7[環境情報の確認]

    Resolved[解決済]
        ticket8[アカウント復旧]
        ticket9[設定方法の案内]

    Closed[クローズ]
        ticket10[仕様の説明]
```

## 実践的な例：インシデント管理

```mermaid
kanban
    Detected[検知]
        incident1[API遅延発生]
        incident2[エラー率上昇]

    Investigating[調査中]
        incident3[DB接続問題]

    Identified[原因特定]
        incident4[キャッシュ枯渇]

    Fixing[対応中]
        incident5[メモリリーク]

    Monitoring[監視中]
        incident6[復旧確認]

    Resolved[解決]
        incident7[ネットワーク障害]
        incident8[証明書期限切れ]
```
