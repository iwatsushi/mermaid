# State Diagram（状態遷移図）

オブジェクトの状態変化とその遷移を表現する図です。

## 基本構文

```mermaid
stateDiagram-v2
    [*] --> 待機中
    待機中 --> 処理中 : 開始
    処理中 --> 完了 : 成功
    処理中 --> エラー : 失敗
    完了 --> [*]
    エラー --> [*]
```

## 開始状態と終了状態

```mermaid
stateDiagram-v2
    [*] --> State1
    State1 --> State2
    State2 --> [*]
```

- `[*]` は開始状態（最初に出現）または終了状態（矢印の先）を表します

## 状態の説明

```mermaid
stateDiagram-v2
    state "待機中の状態" as Waiting
    state "処理実行中" as Processing
    state "処理完了" as Done

    [*] --> Waiting
    Waiting --> Processing
    Processing --> Done
    Done --> [*]
```

## 遷移ラベル

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Running : start()
    Running --> Paused : pause()
    Paused --> Running : resume()
    Running --> Stopped : stop()
    Paused --> Stopped : stop()
    Stopped --> [*]
```

## 複合状態（入れ子状態）

```mermaid
stateDiagram-v2
    [*] --> Active

    state Active {
        [*] --> Idle
        Idle --> Processing : 処理開始
        Processing --> Idle : 処理完了

        state Processing {
            [*] --> Validating
            Validating --> Executing : 検証OK
            Executing --> [*]
        }
    }

    Active --> Inactive : 停止
    Inactive --> Active : 再開
    Inactive --> [*]
```

## 並行状態（Fork/Join）

```mermaid
stateDiagram-v2
    [*] --> fork_state
    state fork_state <<fork>>

    fork_state --> State2
    fork_state --> State3

    state join_state <<join>>
    State2 --> join_state
    State3 --> join_state

    join_state --> State4
    State4 --> [*]
```

## 選択状態（Choice）

```mermaid
stateDiagram-v2
    [*] --> CheckCondition
    state CheckCondition <<choice>>

    CheckCondition --> Success : 条件OK
    CheckCondition --> Failure : 条件NG

    Success --> [*]
    Failure --> Retry
    Retry --> CheckCondition
```

## ノート（注釈）

```mermaid
stateDiagram-v2
    [*] --> Active
    Active --> Inactive

    note right of Active
        アクティブ状態の説明
        複数行で記述可能
    end note

    note left of Inactive : 非アクティブ状態
```

## 方向指定

```mermaid
stateDiagram-v2
    direction LR

    [*] --> A
    A --> B
    B --> C
    C --> [*]
```

| 指定 | 説明 |
|------|------|
| `direction TB` | 上から下 |
| `direction BT` | 下から上 |
| `direction LR` | 左から右 |
| `direction RL` | 右から左 |

## 複合状態の方向指定

```mermaid
stateDiagram-v2
    direction TB

    state Parent {
        direction LR

        [*] --> Child1
        Child1 --> Child2
        Child2 --> [*]
    }

    [*] --> Parent
    Parent --> [*]
```

## 遷移の種類

```mermaid
stateDiagram-v2
    [*] --> State1

    State1 --> State2 : イベント
    State1 --> State3 : イベント [ガード条件]
    State1 --> State4 : イベント / アクション

    State2 --> [*]
    State3 --> [*]
    State4 --> [*]
```

## 実践的な例：注文ステータス

```mermaid
stateDiagram-v2
    [*] --> Draft : 注文作成

    state Draft {
        [*] --> CartEmpty
        CartEmpty --> CartFilled : 商品追加
        CartFilled --> CartEmpty : 商品削除
        CartFilled --> CartFilled : 数量変更
    }

    Draft --> Pending : 注文確定
    Draft --> Cancelled : キャンセル

    state Pending {
        [*] --> PaymentWaiting
        PaymentWaiting --> PaymentProcessing : 決済開始
        PaymentProcessing --> PaymentCompleted : 決済成功
        PaymentProcessing --> PaymentFailed : 決済失敗
        PaymentFailed --> PaymentWaiting : 再試行
    }

    Pending --> Confirmed : 決済完了
    Pending --> Cancelled : タイムアウト

    state Confirmed {
        [*] --> Preparing
        Preparing --> ReadyToShip : 準備完了
    }

    Confirmed --> Shipped : 発送
    Confirmed --> Cancelled : 在庫切れ

    state Shipped {
        [*] --> InTransit
        InTransit --> OutForDelivery : 配達中
        OutForDelivery --> DeliveryAttempted : 配達試行
        DeliveryAttempted --> OutForDelivery : 再配達
    }

    Shipped --> Delivered : 配達完了
    Shipped --> Returned : 受取拒否

    Delivered --> Completed : 受取確認
    Delivered --> ReturnRequested : 返品依頼

    ReturnRequested --> Returned : 返品承認
    ReturnRequested --> Completed : 返品拒否

    Returned --> Refunded : 返金処理

    Completed --> [*]
    Cancelled --> [*]
    Refunded --> [*]

    note right of Pending
        決済処理中の状態
        タイムアウト: 30分
    end note

    note right of Shipped
        配送追跡可能
    end note
```

## 実践的な例：ユーザー認証状態

```mermaid
stateDiagram-v2
    [*] --> Anonymous

    state Anonymous {
        [*] --> Guest
        Guest --> Registering : 登録開始
    }

    Anonymous --> Authenticated : ログイン成功

    state Authenticated {
        [*] --> Active

        state Active {
            [*] --> NormalAccess
            NormalAccess --> ElevatedAccess : 追加認証
            ElevatedAccess --> NormalAccess : タイムアウト
        }

        Active --> SessionExpired : セッション期限切れ
        SessionExpired --> Active : 再認証

        state MFARequired <<choice>>
        Active --> MFARequired : 重要操作
        MFARequired --> MFAVerification : MFA有効
        MFARequired --> Active : MFA無効
        MFAVerification --> Active : 検証成功
        MFAVerification --> Locked : 検証失敗(3回)
    }

    Authenticated --> Anonymous : ログアウト
    Authenticated --> Locked : アカウントロック

    state Locked {
        [*] --> TemporaryLock
        TemporaryLock --> PermanentLock : 繰り返しロック
    }

    Locked --> Anonymous : ロック解除
    Locked --> [*] : アカウント削除

    note right of Locked
        ロック理由:
        - パスワード試行回数超過
        - 不正アクセス検知
        - 管理者による停止
    end note
```

## スタイリング

```mermaid
stateDiagram-v2
    [*] --> Active
    Active --> Warning
    Warning --> Error
    Error --> [*]

    classDef active fill:#9f9,stroke:#393
    classDef warning fill:#ff9,stroke:#993
    classDef error fill:#f99,stroke:#933

    class Active active
    class Warning warning
    class Error error
```

## 履歴状態（History State）

```mermaid
stateDiagram-v2
    [*] --> Parent

    state Parent {
        [*] --> ChildA
        ChildA --> ChildB
        ChildB --> ChildC
        ChildC --> ChildA
    }

    Parent --> Suspended : 中断
    Suspended --> Parent : 再開（履歴状態へ）
```
