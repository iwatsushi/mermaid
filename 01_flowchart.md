# Flowchart（フローチャート）

Mermaidのフローチャートは、処理の流れやワークフローを視覚化するための図です。

## 基本構文

```mermaid
flowchart TD
    A[開始] --> B[処理1]
    B --> C[処理2]
    C --> D[終了]
```

## 方向指定

| 指定 | 説明 |
|------|------|
| `TB` / `TD` | 上から下（Top to Bottom / Top Down） |
| `BT` | 下から上（Bottom to Top） |
| `LR` | 左から右（Left to Right） |
| `RL` | 右から左（Right to Left） |

```mermaid
flowchart LR
    A[左] --> B[右]
```

## ノードの形状

```mermaid
flowchart TD
    A[四角形 - デフォルト]
    B(角丸四角形)
    C([スタジアム形])
    D[[サブルーチン]]
    E[(データベース)]
    F((円形))
    G>非対称形]
    H{ひし形 - 条件分岐}
    I{{六角形}}
    J[/平行四辺形/]
    K[\逆平行四辺形\]
    L[/台形\]
    M[\逆台形/]
    N(((二重円)))
```

## リンク（矢印）の種類

```mermaid
flowchart LR
    A --> B
    A --- C
    A -.- D
    A -.-> E
    A ==> F
    A ~~~ G

    subgraph 矢印の説明
        H[-->: 矢印付き]
        I[---: 線のみ]
        J[-.-: 点線]
        K[-.->: 点線矢印]
        L[==>: 太線矢印]
        M[~~~: 非表示リンク]
    end
```

## リンクにテキストを追加

```mermaid
flowchart LR
    A -->|テキスト1| B
    C -- テキスト2 --> D
    E -.テキスト3.-> F
    G ==テキスト4==> H
```

## リンクの長さ調整

```mermaid
flowchart TD
    A[開始] ---> B[長い矢印]
    A --> C[通常]
    A ----> D[さらに長い]
```

## サブグラフ（グループ化）

```mermaid
flowchart TB
    subgraph フロントエンド
        A[React] --> B[コンポーネント]
        B --> C[状態管理]
    end

    subgraph バックエンド
        D[API] --> E[ビジネスロジック]
        E --> F[データベース]
    end

    subgraph インフラ
        G[Docker] --> H[Kubernetes]
    end

    C --> D
    F --> G
```

## サブグラフの方向指定

```mermaid
flowchart LR
    subgraph TOP
        direction TB
        A1 --> A2
    end

    subgraph BOTTOM
        direction TB
        B1 --> B2
    end

    TOP --> BOTTOM
```

## 条件分岐の例

```mermaid
flowchart TD
    A[開始] --> B{条件チェック}
    B -->|Yes| C[処理A]
    B -->|No| D[処理B]
    C --> E{次の条件}
    D --> E
    E -->|条件1| F[結果1]
    E -->|条件2| G[結果2]
    E -->|条件3| H[結果3]
    F --> I[終了]
    G --> I
    H --> I
```

## スタイリング

```mermaid
flowchart LR
    A[デフォルト]:::default --> B[カスタム1]:::custom1
    B --> C[カスタム2]:::custom2
    C --> D[カスタム3]:::custom3

    classDef default fill:#f9f9f9,stroke:#333,stroke-width:1px
    classDef custom1 fill:#bbf,stroke:#00f,stroke-width:2px
    classDef custom2 fill:#fbb,stroke:#f00,stroke-width:2px
    classDef custom3 fill:#bfb,stroke:#0f0,stroke-width:2px,color:#000
```

## リンクのスタイリング

```mermaid
flowchart LR
    A --> B --> C --> D

    linkStyle 0 stroke:#ff0000,stroke-width:2px
    linkStyle 1 stroke:#00ff00,stroke-width:3px
    linkStyle 2 stroke:#0000ff,stroke-width:4px,stroke-dasharray:5
```

## 複数ノードへの一括接続

```mermaid
flowchart TD
    A --> B & C & D
    B & C & D --> E
```

## 実践的な例：ユーザー認証フロー

```mermaid
flowchart TD
    Start([開始]) --> Input[ユーザー名/パスワード入力]
    Input --> Validate{入力検証}

    Validate -->|無効| Error1[エラー表示]
    Error1 --> Input

    Validate -->|有効| Auth{認証処理}

    Auth -->|失敗| Error2[認証エラー]
    Error2 --> Retry{リトライ?}
    Retry -->|Yes| Input
    Retry -->|No| End1([終了])

    Auth -->|成功| Session[セッション生成]
    Session --> MFA{MFA有効?}

    MFA -->|Yes| MFAInput[MFAコード入力]
    MFAInput --> MFACheck{MFA検証}
    MFACheck -->|失敗| MFAInput
    MFACheck -->|成功| Dashboard

    MFA -->|No| Dashboard[ダッシュボード表示]
    Dashboard --> End2([終了])

    style Start fill:#9f9,stroke:#393
    style End1 fill:#f99,stroke:#933
    style End2 fill:#9f9,stroke:#393
    style Error1 fill:#fbb,stroke:#f00
    style Error2 fill:#fbb,stroke:#f00
```

## 特殊文字のエスケープ

```mermaid
flowchart LR
    A["特殊文字: #quot;引用符#quot;"]
    B["記号: #lt;tag#gt;"]
    C["改行を含む
    テキスト"]
```

## クリックイベント（インタラクション）

```mermaid
flowchart LR
    A[クリック可能] --> B[リンク先へ]
    click A "https://mermaid.js.org/" "Mermaid公式サイト" _blank
    click B callback "コールバック関数"
```

## FontAwesomeアイコンの使用

```mermaid
flowchart TD
    A[fa:fa-home ホーム] --> B[fa:fa-user ユーザー]
    B --> C[fa:fa-cog 設定]
    C --> D[fa:fa-database データベース]
```
