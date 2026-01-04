# Requirement Diagram（要件図）

システム要件とその関係性を視覚化する図です（SysML準拠）。

## 基本構文

```mermaid
requirementDiagram

    requirement ユーザー認証 {
        id: REQ-001
        text: システムはユーザー認証機能を提供する
        risk: high
        verifymethod: test
    }

    element 認証モジュール {
        type: module
    }

    認証モジュール - satisfies -> ユーザー認証
```

## 要件の種類

```mermaid
requirementDiagram

    requirement 機能要件 {
        id: REQ-001
        text: 機能に関する要件
        risk: medium
        verifymethod: test
    }

    performanceRequirement パフォーマンス要件 {
        id: PERF-001
        text: レスポンスは3秒以内
        risk: high
        verifymethod: analysis
    }

    interfaceRequirement インターフェース要件 {
        id: INT-001
        text: REST APIを提供する
        risk: low
        verifymethod: inspection
    }

    physicalRequirement 物理要件 {
        id: PHY-001
        text: サーバーは国内DCに設置
        risk: medium
        verifymethod: inspection
    }

    designConstraint 設計制約 {
        id: DC-001
        text: マイクロサービスアーキテクチャを採用
        risk: low
        verifymethod: inspection
    }

    functionalRequirement 機能要件2 {
        id: FUNC-001
        text: 検索機能を提供する
        risk: medium
        verifymethod: test
    }
```

### 要件タイプ一覧

| タイプ | 説明 |
|--------|------|
| `requirement` | 一般的な要件 |
| `functionalRequirement` | 機能要件 |
| `performanceRequirement` | パフォーマンス要件 |
| `interfaceRequirement` | インターフェース要件 |
| `physicalRequirement` | 物理的要件 |
| `designConstraint` | 設計制約 |

## リスクレベル

```mermaid
requirementDiagram

    requirement 低リスク要件 {
        id: REQ-L
        text: リスク低
        risk: low
        verifymethod: test
    }

    requirement 中リスク要件 {
        id: REQ-M
        text: リスク中
        risk: medium
        verifymethod: test
    }

    requirement 高リスク要件 {
        id: REQ-H
        text: リスク高
        risk: high
        verifymethod: test
    }
```

## 検証方法

```mermaid
requirementDiagram

    requirement テスト検証 {
        id: V-001
        text: テストで検証
        risk: medium
        verifymethod: test
    }

    requirement 分析検証 {
        id: V-002
        text: 分析で検証
        risk: medium
        verifymethod: analysis
    }

    requirement 検査検証 {
        id: V-003
        text: 検査で検証
        risk: medium
        verifymethod: inspection
    }

    requirement デモ検証 {
        id: V-004
        text: デモで検証
        risk: medium
        verifymethod: demonstration
    }
```

### 検証方法一覧

| 値 | 説明 |
|----|------|
| `test` | テストによる検証 |
| `analysis` | 分析による検証 |
| `inspection` | 検査による検証 |
| `demonstration` | デモによる検証 |

## 関係タイプ

```mermaid
requirementDiagram

    requirement 親要件 {
        id: REQ-P
        text: 親となる要件
        risk: medium
        verifymethod: test
    }

    requirement 子要件1 {
        id: REQ-C1
        text: 派生する要件1
        risk: low
        verifymethod: test
    }

    requirement 子要件2 {
        id: REQ-C2
        text: 派生する要件2
        risk: low
        verifymethod: test
    }

    requirement 関連要件 {
        id: REQ-R
        text: 関連する要件
        risk: medium
        verifymethod: test
    }

    element 設計要素 {
        type: module
    }

    element テストケース {
        type: testCase
    }

    親要件 - contains -> 子要件1
    親要件 - contains -> 子要件2
    親要件 - derives -> 関連要件
    設計要素 - satisfies -> 親要件
    テストケース - verifies -> 親要件
    子要件1 - refines -> 親要件
    関連要件 - traces -> 親要件
    子要件1 - copies -> 子要件2
```

### 関係タイプ一覧

| 関係 | 説明 |
|------|------|
| `contains` | 包含関係 |
| `derives` | 派生関係 |
| `satisfies` | 充足関係（要素が要件を満たす） |
| `verifies` | 検証関係 |
| `refines` | 詳細化関係 |
| `traces` | トレース関係 |
| `copies` | コピー関係 |

## 実践的な例：ECサイト要件

```mermaid
requirementDiagram

    requirement ユーザー管理 {
        id: REQ-001
        text: システムはユーザー管理機能を提供する
        risk: high
        verifymethod: test
    }

    functionalRequirement ユーザー登録 {
        id: REQ-001-1
        text: 新規ユーザーは会員登録できる
        risk: medium
        verifymethod: test
    }

    functionalRequirement ログイン {
        id: REQ-001-2
        text: 登録済みユーザーはログインできる
        risk: high
        verifymethod: test
    }

    functionalRequirement パスワードリセット {
        id: REQ-001-3
        text: ユーザーはパスワードをリセットできる
        risk: medium
        verifymethod: test
    }

    performanceRequirement 認証速度 {
        id: PERF-001
        text: 認証処理は2秒以内に完了する
        risk: medium
        verifymethod: analysis
    }

    designConstraint セキュリティ制約 {
        id: DC-001
        text: パスワードはbcryptでハッシュ化する
        risk: high
        verifymethod: inspection
    }

    element 認証サービス {
        type: service
    }

    element ユーザーリポジトリ {
        type: repository
    }

    element 認証テストスイート {
        type: testSuite
    }

    ユーザー管理 - contains -> ユーザー登録
    ユーザー管理 - contains -> ログイン
    ユーザー管理 - contains -> パスワードリセット
    ログイン - derives -> 認証速度
    ログイン - derives -> セキュリティ制約

    認証サービス - satisfies -> ログイン
    認証サービス - satisfies -> ユーザー登録
    ユーザーリポジトリ - satisfies -> ユーザー管理
    認証テストスイート - verifies -> ログイン
    認証テストスイート - verifies -> 認証速度
```

## 実践的な例：API要件

```mermaid
requirementDiagram

    interfaceRequirement REST_API {
        id: API-001
        text: RESTful APIを提供する
        risk: medium
        verifymethod: test
    }

    functionalRequirement CRUD操作 {
        id: API-001-1
        text: リソースのCRUD操作をサポート
        risk: low
        verifymethod: test
    }

    functionalRequirement 認証 {
        id: API-001-2
        text: JWT認証をサポートする
        risk: high
        verifymethod: test
    }

    performanceRequirement レスポンス時間 {
        id: API-PERF-001
        text: 95%のリクエストが500ms以内に応答
        risk: high
        verifymethod: analysis
    }

    performanceRequirement スループット {
        id: API-PERF-002
        text: 1000 req/sec を処理可能
        risk: high
        verifymethod: analysis
    }

    designConstraint バージョニング {
        id: API-DC-001
        text: URLパスベースのAPIバージョニング
        risk: low
        verifymethod: inspection
    }

    element APIゲートウェイ {
        type: component
    }

    element 負荷テスト {
        type: testSuite
    }

    REST_API - contains -> CRUD操作
    REST_API - contains -> 認証
    REST_API - derives -> レスポンス時間
    REST_API - derives -> スループット
    REST_API - derives -> バージョニング

    APIゲートウェイ - satisfies -> REST_API
    負荷テスト - verifies -> レスポンス時間
    負荷テスト - verifies -> スループット
```

## 実践的な例：セキュリティ要件

```mermaid
requirementDiagram

    requirement セキュリティ要件 {
        id: SEC-001
        text: システムはセキュリティ基準を満たす
        risk: high
        verifymethod: inspection
    }

    functionalRequirement データ暗号化 {
        id: SEC-001-1
        text: 機密データは暗号化して保存
        risk: high
        verifymethod: inspection
    }

    functionalRequirement 通信暗号化 {
        id: SEC-001-2
        text: 全通信はTLS1.3で暗号化
        risk: high
        verifymethod: test
    }

    functionalRequirement アクセス制御 {
        id: SEC-001-3
        text: RBAC によるアクセス制御
        risk: high
        verifymethod: test
    }

    functionalRequirement 監査ログ {
        id: SEC-001-4
        text: 全操作の監査ログを保持
        risk: medium
        verifymethod: inspection
    }

    designConstraint OWASP準拠 {
        id: SEC-DC-001
        text: OWASP Top 10 対策を実施
        risk: high
        verifymethod: analysis
    }

    element セキュリティモジュール {
        type: module
    }

    element ペネトレーションテスト {
        type: testSuite
    }

    element セキュリティ監査 {
        type: audit
    }

    セキュリティ要件 - contains -> データ暗号化
    セキュリティ要件 - contains -> 通信暗号化
    セキュリティ要件 - contains -> アクセス制御
    セキュリティ要件 - contains -> 監査ログ
    セキュリティ要件 - derives -> OWASP準拠

    セキュリティモジュール - satisfies -> セキュリティ要件
    ペネトレーションテスト - verifies -> セキュリティ要件
    セキュリティ監査 - verifies -> OWASP準拠
```
