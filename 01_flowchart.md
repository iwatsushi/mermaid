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

```mermaid
flowchart TB
    A[上] --> B[下]
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

### 基本のリンク

```mermaid
flowchart LR
    A1[A] --> B1[B]
    A2[A] --- B2[B]
    A3[A] -.-> B3[B]
    A4[A] ==> B4[B]
    A5[A] === B5[B]
    A6[A] ~~~ B6[B]
```

| 構文 | 説明 |
|------|------|
| `-->` | 実線 + 矢印 |
| `---` | 実線のみ |
| `-.->` | 点線 + 矢印 |
| `==>` | 太線 + 矢印 |
| `===` | 太線のみ |
| `~~~` | 非表示リンク |

### 双方向矢印

```mermaid
flowchart LR
    A <--> B
    C o--o D
    E x--x F
```

### 終端の形状

```mermaid
flowchart LR
    A1[A] --o B1[B]
    A2[A] --x B2[B]
    A3[A] o--o B3[B]
    A4[A] x--x B4[B]
```

| 構文 | 説明 |
|------|------|
| `--o` | 円終端 |
| `--x` | X終端 |
| `o--o` | 両端円 |
| `x--x` | 両端X |
| `<-->` | 双方向矢印 |

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
    A["ダブルクォート内のテキスト"]
    B["記号も使える: @#$%"]
    C["改行を含む
    テキスト"]
```

## クリックイベント（インタラクション）

```mermaid
flowchart LR
    A[クリック可能] --> B[リンク先へ]
    click A "https://mermaid.js.org/" _blank
```

## FontAwesomeアイコンの使用

```mermaid
flowchart TD
    A[fa:fa-home ホーム] --> B[fa:fa-user ユーザー]
    B --> C[fa:fa-cog 設定]
    C --> D[fa:fa-database データベース]
```

## 画像をノードとして使用（Mermaid v11+）

Mermaid v11以降では、任意の画像をノードとして使用できます。

### 基本構文

```mermaid
flowchart LR
    img1@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/120px-React-icon.svg.png", label: "React", pos: "b", w: 60, h: 60 }
    img2@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/120px-Node.js_logo.svg.png", label: "Node.js", pos: "b", w: 60, h: 60 }
    img3@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/MongoDB_Logo.svg/120px-MongoDB_Logo.svg.png", label: "MongoDB", pos: "b", w: 60, h: 60 }

    img1 --> img2 --> img3
```

### 画像ノードのプロパティ

| プロパティ | 説明 | 例 |
|-----------|------|-----|
| `img` | 画像のURL（必須） | `"https://example.com/image.png"` |
| `label` | ラベルテキスト | `"ノード名"` |
| `pos` | ラベル位置（`t`=上, `b`=下） | `"b"` |
| `w` | 画像の幅（ピクセル） | `60` |
| `h` | 画像の高さ（ピクセル） | `60` |

### アイコンノード

FontAwesomeやその他のアイコンライブラリを使用したアイコンノードも作成できます。

```mermaid
flowchart TD
    icon1@{ icon: "fa:server", form: "square", label: "サーバー" }
    icon2@{ icon: "fa:database", form: "circle", label: "データベース" }
    icon3@{ icon: "fa:cloud", form: "rounded", label: "クラウド" }

    icon1 --> icon2
    icon2 --> icon3
```

### アイコンノードのプロパティ

| プロパティ | 説明 | 例 |
|-----------|------|-----|
| `icon` | アイコン名（必須） | `"fa:database"` |
| `form` | 形状（`square`, `circle`, `rounded`） | `"square"` |
| `label` | ラベルテキスト | `"ノード名"` |

### 実践例：技術スタック図

```mermaid
flowchart TB
    subgraph Frontend
        react@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/100px-React-icon.svg.png", label: "React", pos: "b", w: 50, h: 50 }
        ts@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/100px-Typescript_logo_2020.svg.png", label: "TypeScript", pos: "b", w: 50, h: 50 }
    end

    subgraph Backend
        node@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/100px-Node.js_logo.svg.png", label: "Node.js", pos: "b", w: 50, h: 50 }
        python@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Python-logo-notext.svg/100px-Python-logo-notext.svg.png", label: "Python", pos: "b", w: 50, h: 50 }
    end

    subgraph Database
        postgres@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/100px-Postgresql_elephant.svg.png", label: "PostgreSQL", pos: "b", w: 50, h: 50 }
        redis@{ img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Logo-redis.svg/100px-Logo-redis.svg.png", label: "Redis", pos: "b", w: 50, h: 50 }
    end

    react --> node
    ts --> node
    react --> python
    node --> postgres
    python --> postgres
    node --> redis
```

### 実践例：クラウドアーキテクチャ図

```mermaid
flowchart LR
    user@{ icon: "fa:users", form: "circle", label: "ユーザー" }
    cdn@{ icon: "fa:globe", form: "square", label: "CDN" }
    lb@{ icon: "fa:balance-scale", form: "square", label: "ロードバランサー" }

    subgraph Servers
        web1@{ icon: "fa:server", form: "rounded", label: "Web 1" }
        web2@{ icon: "fa:server", form: "rounded", label: "Web 2" }
    end

    db@{ icon: "fa:database", form: "circle", label: "データベース" }
    cache@{ icon: "fa:bolt", form: "square", label: "キャッシュ" }

    user --> cdn
    cdn --> lb
    lb --> web1
    lb --> web2
    web1 --> cache
    web2 --> cache
    cache --> db
```

### 画像とテキストノードの混在

通常のノードと画像ノードを自由に組み合わせることができます。

```mermaid
flowchart TD
    A[ユーザーリクエスト] --> B@{ icon: "fa:shield", form: "square", label: "認証" }
    B --> C{権限チェック}
    C -->|許可| D@{ icon: "fa:check-circle", form: "circle", label: "成功" }
    C -->|拒否| E@{ icon: "fa:times-circle", form: "circle", label: "失敗" }
    D --> F[処理実行]
    F --> G@{ icon: "fa:database", form: "rounded", label: "データ保存" }

    style D fill:#9f9,stroke:#393
    style E fill:#f99,stroke:#933
```
