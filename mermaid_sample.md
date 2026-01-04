# Mermaid 玄人風テンプレート全集（コピペ即戦力）

> 使い方：各セクションをそのままコピーして、必要なラベルだけ差し替えてください。`%%` はコメントです。まずは一番上の「共通テーマ初期化」から始めると見栄えが安定します。

---

## 0) 共通テーマ初期化（まず最初に）

```mermaid
%% テーマや日本語フォント、曲線などを一括指定
%% これを各図の先頭に付けると反映されます
%% セキュリティ設定が厳しい環境では click/hyperlink が無効の場合あり
%% { 'securityLevel': 'loose' } にすると外部リンクが有効になる環境もあります
%%{init: {
  'theme': 'neutral',
  'logLevel': 'error',
  'fontFamily': 'Meiryo, "Yu Gothic UI", "Noto Sans JP", sans-serif',
  'themeVariables': {
    'primaryColor': '#E6F7FF',
    'primaryTextColor': '#003A8C',
    'primaryBorderColor': '#91D5FF',
    'lineColor': '#8C8C8C',
    'tertiaryColor': '#F6FFED'
  },
  'flowchart': { 'curve': 'basis' }
}}%%
```

---

## 1) Flowchart（矢印・サブグラフ・クラス定義・クリック）

```mermaid
%%{init: { 'flowchart': { 'diagramPadding': 8, 'htmlLabels': true, 'curve': 'basis' }}}%%

flowchart LR
  %% クラス定義（色は適宜変更）
  classDef ok   fill:#F6FFED,stroke:#B7EB8F,color:#135200;
  classDef warn fill:#FFFBE6,stroke:#FFE58F,color:#AD6800;
  classDef err  fill:#FFF1F0,stroke:#FFA39E,color:#A8071A;

  subgraph APP[アプリ層]
    A[開始]:::ok --> B{条件は満たす?}
    B -- はい --> C[(DB)]
    B -- いいえ --> D>外部API]
    C --> E[結果表示]
  end

  subgraph OPS[監視/運用]
    L[ログ集約] -.-> M[(時系列DB)]
    M -->|アラート| N{{通知}}
  end

  E --> L
  D -.遅延.-> N

  %% エッジ装飾（番号はエッジの出現順）
  linkStyle 2 stroke:#F66,stroke-width:2px,stroke-dasharray:5 5

  %% ノード個別スタイル
  style D stroke-dasharray: 4 2

  %% クリック（環境により無効な場合あり）
  click C "https://example.com/db-schema" "DBスキーマを見る"

  %% 任意でクラス適用
  class A,C ok; class D warn; class N err;
```

---

## 2) Sequence Diagram（autonumber/alt/opt/par/rect/activation）

```mermaid
sequenceDiagram
  autonumber
  actor U as ユーザー
  participant FE as フロント
  participant API
  participant DB

  Note over U,FE: セッション開始
  U->>FE: ログイン入力
  FE->>API: POST /login
  activate API
  API->>DB: SELECT user
  DB-->>API: user + hash
  API-->>FE: 200 OK (token)
  deactivate API

  alt 認証成功
    FE->>API: GET /me (Bearer token)
    API-->>FE: 200 profile
  else 失敗
    FE-->>U: エラー表示
  end

  par 並列取得A
    FE->>API: GET /inbox
  and 並列取得B
    FE->>API: GET /notifications
  end

  rect rgba(200,200,200,0.15)
    Note over FE: ハイライト区間
  end
```

---

## 3) Class Diagram（継承/集約/合成/依存/多重度）

```mermaid
classDiagram
  direction LR

  class User {
    +int id
    +string name
    +login(password) bool
  }
  class Admin {
    +ban(userId) void
  }
  class Session {
    +string token
    +Date   expiresAt
  }

  User <|-- Admin
  User "1" o-- "0..*" Session : has
  Session ..> User : validates
```

---

## 4) State Diagram（入出・choice・入れ子状態）

```mermaid
stateDiagram-v2
  [*] --> Idle
  Idle --> Auth : login()
  Auth --> [*]  : logout()

  state Auth {
    [*] --> Dashboard
    Dashboard --> Settings : gear
    Settings --> Dashboard : back
  }

  state IfOK <<choice>>
  Idle --> IfOK : cookie?
  IfOK --> Auth : yes
  IfOK --> Idle : no
```

---

## 5) ER Diagram（エンティティ属性+リレーション）

```mermaid
erDiagram
  CUSTOMER ||--o{ ORDER : places
  ORDER    ||--|{ LINE_ITEM : contains
  PRODUCT  ||--o{ LINE_ITEM : contains

  CUSTOMER {
    string id PK
    string name
    string email "UNIQUE"
  }
  ORDER {
    string id PK
    date   orderedAt
    float  total
  }
  LINE_ITEM {
    string id PK
    int    qty
    float  price
  }
  PRODUCT {
    string id PK
    string sku
    string name
  }
```

---

## 6) Gantt（exclude週末/クリティカル/マイルストーン/依存）

```mermaid
gantt
  title プロジェクト計画
  dateFormat  YYYY-MM-DD
  axisFormat  %m/%d
  excludes    weekends
  todayMarker stroke-width:2px,stroke-dasharray: 5 5

  section 企画
    要件定義      :active, a1, 2025-10-01, 7d
    承認          :milestone, m1, 2025-10-08, 0d
  section 実装
    API実装       :crit, a2, 2025-10-09, 10d
    フロント      :a3, after a2, 8d
    結合テスト     :a4, 2025-10-25, 5d
  section リリース
    本番リリース  :milestone, m2, 2025-11-01, 0d
```

---

## 7) User Journey（共感図やNPS可視化に）

```mermaid
journey
  title ユーザージャーニー：購入
  section 検索
    商品比較: 5: ユーザー
    レビュー確認: 3: ユーザー
  section 購入
    カート投入: 4: ユーザー
    決済: 2: ユーザー
  section アフター
    返品: 1: ユーザー
```

---

## 8) Pie（showData で値表示）

```mermaid
%% ラベルは必ずダブルクォートで囲む（非ASCIIやスペースを含むとエラーになりやすい）
pie showData
  title 時間配分(平日)
  "睡眠" : 7.5
  "仕事" : 9
  "家族" : 3
  "学習" : 2
  "自由" : 2.5
```

---

## 9) Mindmap（インデント階層）

```mermaid
mindmap
  root((プロジェクトX))
    要件
      非機能
        可用性
        性能
      機能
        認証
        決済
    設計
      API
      DB
    実装
      FE
      BE
    テスト
      単体
      結合
      E2E
    運用
      監視
      アラート
```

---

## 10) Timeline（シンプルで強力）

```mermaid
timeline
  title リリースの流れ
  2025-10 : 要件凍結 : セキュリティレビュー
  2025-11 : βリリース
  2025-12 : GA : プレスリリース
```

---

## 11) Git Graph（branch/checkout/merge/tag）

```mermaid
%%{init: { 'gitGraph': { 'rotateCommitLabel': false }}}%%
gitGraph
  commit id: "init"
  branch develop
  commit tag: "0.1.0"
  branch feature/login
  commit
  checkout develop
  merge feature/login
  commit type: HIGHLIGHT
  checkout main
  merge develop
```

---

## 12) Requirement Diagram（SysML風 トレーサビリティ）

```mermaid
requirementDiagram
  requirement R1 {
    id: R1
    text: "ユーザーはメールでログインできること"
    risk: high
    verifymethod: test
  }
  element AuthModule {
    type: component
  }
  test T1 {
    id: T1
    text: "メール+パスワードで200が返る"
  }
  R1 - satisfies -> AuthModule
  T1 - verifies  -> R1
```

---

## 13) Quadrant Chart（意思決定マトリクス）

```mermaid
quadrantChart
  title 優先度マトリクス
  x-axis 低価値 --> 高価値
  y-axis 低リスク --> 高リスク
  quadrant-1 実行
  quadrant-2 再考
  quadrant-3 無視
  quadrant-4 実験
  新機能A: [0.8, 0.3]
  既存改善B: [0.6, 0.2]
  技術検証C: [0.4, 0.7]
```

---

## 14) Sankey（フロー可視化／CSV3列）

```mermaid
%% Renderer により `sankey` か `sankey-beta` を使用
sankey
  Source,Target,Value
  トラフィック, 検索, 1200
  トラフィック, 直帰, 300
  検索, ランディング, 900
  ランディング, カート, 400
  カート, 成約, 250
```

---

## 15) XY Chart（折れ線/棒の素早い可視化）

```mermaid
%% 現在は beta 記法が一般的
xychart-beta
  title "PV/Signup トレンド"
  x-axis "日付" ["10/01","10/08","10/15","10/22"]
  y-axis "数" 0 --> 1000
  line [300,450,700,900]
  bar  [30, 40, 65, 95]
```

---

### 付録：小ワザ集

* **Unicode改行**：ラベル内で `\n` を使うと改行。
* **アイコン/絵文字**：環境依存。テキストに直接入れて試す（🛠️など）。
* **大きさ調整**：埋め込み側の width/zoom を調整。Mermaid側はノードごとの厳密サイズ指定は限定的。
* **レイアウト暴れ対策**：

  * Flowchart は `subgraph` でグルーピングし、矢印の向き（`LR`/`TB`）を固定。
  * Sequence は `autonumber` と `rect`/`par`/`alt` を使い、段落ごとに区切る。
* **バージョン差異**：Sankey は `sankey`/`sankey-beta`、XY は `xychart-beta` など、レンダラの Mermaid バージョン差に注意。
* **リンク**：Flowchart は `click id "URL" "tooltip"` が便利。Sequence では現状リンクは限定的。

```
```
