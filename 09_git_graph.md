# Git Graph（Gitグラフ）

Gitのブランチとコミット履歴を視覚化する図です。

## 基本構文

```mermaid
gitGraph
    commit
    commit
    branch develop
    checkout develop
    commit
    commit
    checkout main
    merge develop
    commit
```

## コミットオプション

```mermaid
gitGraph
    commit id: "初期コミット"
    commit id: "機能追加" tag: "v1.0.0"
    commit id: "バグ修正" type: NORMAL
    commit id: "重要な変更" type: HIGHLIGHT
    commit id: "逆コミット" type: REVERSE
```

### コミットタイプ

| タイプ | 説明 |
|--------|------|
| `NORMAL` | 通常のコミット |
| `HIGHLIGHT` | ハイライト表示 |
| `REVERSE` | リバース表示 |

## ブランチ操作

```mermaid
gitGraph
    commit id: "C1"
    commit id: "C2"
    branch feature
    checkout feature
    commit id: "F1"
    commit id: "F2"
    checkout main
    commit id: "C3"
    merge feature id: "Merge feature"
    commit id: "C4"
```

## 複数ブランチ

```mermaid
gitGraph
    commit id: "初期化"
    branch develop
    checkout develop
    commit id: "開発開始"
    branch feature-a
    checkout feature-a
    commit id: "機能A-1"
    commit id: "機能A-2"
    checkout develop
    branch feature-b
    checkout feature-b
    commit id: "機能B-1"
    checkout develop
    merge feature-a id: "Merge A"
    checkout feature-b
    commit id: "機能B-2"
    checkout develop
    merge feature-b id: "Merge B"
    checkout main
    merge develop tag: "v1.0.0"
```

## Git Flow の例

```mermaid
gitGraph
    commit id: "Initial" tag: "v0.1.0"

    branch develop
    checkout develop
    commit id: "Setup project"

    branch feature/login
    checkout feature/login
    commit id: "Add login form"
    commit id: "Add validation"
    commit id: "Add authentication"

    checkout develop
    merge feature/login id: "Merge login"

    branch feature/dashboard
    checkout feature/dashboard
    commit id: "Create dashboard layout"
    commit id: "Add widgets"

    checkout develop
    commit id: "Update dependencies"
    merge feature/dashboard id: "Merge dashboard"

    branch release/1.0
    checkout release/1.0
    commit id: "Bump version"
    commit id: "Fix typo"

    checkout main
    merge release/1.0 id: "Release 1.0" tag: "v1.0.0"

    checkout develop
    merge release/1.0 id: "Back merge"

    checkout main
    branch hotfix/security
    checkout hotfix/security
    commit id: "Fix vulnerability" type: HIGHLIGHT

    checkout main
    merge hotfix/security id: "Hotfix" tag: "v1.0.1"

    checkout develop
    merge hotfix/security id: "Merge hotfix"
```

## GitHub Flow の例

```mermaid
gitGraph
    commit id: "Initial" tag: "v1.0.0"
    commit id: "Add README"

    branch feature/user-profile
    checkout feature/user-profile
    commit id: "Create profile page"
    commit id: "Add avatar upload"
    commit id: "Fix styling"

    checkout main
    merge feature/user-profile id: "PR #1: User Profile" tag: "v1.1.0"

    branch feature/notifications
    checkout feature/notifications
    commit id: "Add notification system"
    commit id: "Add email notifications"

    checkout main
    commit id: "Update docs" type: NORMAL

    checkout feature/notifications
    commit id: "Add push notifications"

    checkout main
    merge feature/notifications id: "PR #2: Notifications" tag: "v1.2.0"

    branch bugfix/notification-delay
    checkout bugfix/notification-delay
    commit id: "Fix delay issue" type: HIGHLIGHT

    checkout main
    merge bugfix/notification-delay id: "PR #3: Fix delay" tag: "v1.2.1"
```

## トランクベース開発の例

```mermaid
gitGraph
    commit id: "v1.0" tag: "v1.0.0"
    commit id: "Small fix 1"
    commit id: "Small fix 2"

    branch short-lived-feature
    checkout short-lived-feature
    commit id: "Quick feature"

    checkout main
    merge short-lived-feature id: "Merge"
    commit id: "Direct commit 1"
    commit id: "Direct commit 2" tag: "v1.1.0"
    commit id: "Refactor"

    branch another-feature
    checkout another-feature
    commit id: "New feature"

    checkout main
    merge another-feature id: "Merge feature"
    commit id: "Polish" tag: "v1.2.0"
```

## リベースの視覚化

```mermaid
gitGraph
    commit id: "Base"
    commit id: "Main-1"

    branch feature
    checkout feature
    commit id: "Feature-1"
    commit id: "Feature-2"

    checkout main
    commit id: "Main-2"
    commit id: "Main-3"

    checkout feature
    commit id: "Feature-3"

    checkout main
    merge feature id: "Merge (after rebase)"
```

## Cherry-pick の例

```mermaid
gitGraph
    commit id: "C1"
    commit id: "C2"

    branch develop
    checkout develop
    commit id: "D1"
    commit id: "D2 - Important fix" type: HIGHLIGHT
    commit id: "D3"

    checkout main
    commit id: "C3"
    commit id: "Cherry-pick D2" type: HIGHLIGHT
    commit id: "C4"
```

## 方向設定

```mermaid
%%{init: { 'gitGraph': {'mainBranchName': 'main'}} }%%
gitGraph TB:
    commit
    branch develop
    commit
    checkout main
    merge develop
```

## テーマとスタイル

```mermaid
%%{init: { 'theme': 'base', 'gitGraph': {'showBranches': true, 'showCommitLabel':true,'mainBranchName': 'main'}} }%%
gitGraph
    commit id: "1"
    commit id: "2"
    branch develop
    commit id: "3"
    checkout main
    merge develop
    commit id: "4"
```

## 実践的な例：リリースサイクル

```mermaid
gitGraph
    commit id: "v2.0.0" tag: "v2.0.0"

    branch develop
    checkout develop
    commit id: "Sprint 5 start"

    branch feature/search
    checkout feature/search
    commit id: "Basic search"
    commit id: "Advanced filters"
    commit id: "Search tests"

    checkout develop
    branch feature/export
    checkout feature/export
    commit id: "CSV export"
    commit id: "PDF export"

    checkout develop
    merge feature/search id: "PR: Search feature"

    checkout feature/export
    commit id: "Export tests"

    checkout develop
    merge feature/export id: "PR: Export feature"

    branch release/2.1
    checkout release/2.1
    commit id: "Version bump"
    commit id: "Update changelog"
    commit id: "QA fix 1"
    commit id: "QA fix 2"

    checkout main
    merge release/2.1 id: "Release 2.1" tag: "v2.1.0"

    checkout develop
    merge release/2.1 id: "Back merge release"

    commit id: "Sprint 6 start"

    checkout main
    branch hotfix/critical
    commit id: "Critical fix" type: HIGHLIGHT

    checkout main
    merge hotfix/critical tag: "v2.1.1"

    checkout develop
    merge hotfix/critical id: "Merge hotfix"
```

## 設定オプション

```mermaid
%%{init: {
    'gitGraph': {
        'mainBranchName': 'production',
        'mainBranchOrder': 0,
        'showBranches': true,
        'showCommitLabel': true,
        'rotateCommitLabel': false
    }
}}%%
gitGraph
    commit id: "Init"
    branch staging order: 1
    branch development order: 2

    checkout development
    commit id: "Dev work"

    checkout staging
    merge development

    checkout production
    merge staging tag: "v1.0"
```
