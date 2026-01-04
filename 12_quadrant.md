# Quadrant Chart（象限図）

2つの軸で4つの領域に分類する図です。優先度分析などに活用できます。

> **注意**: `quadrantChart` はMermaid v10.2.0以降で利用可能です。日本語ラベルがエラーになる場合は英語に変更してください。

## 基本構文

```mermaid
quadrantChart
    title Priority Matrix
    x-axis Low Urgency --> High Urgency
    y-axis Low Importance --> High Importance
    quadrant-1 Do Now
    quadrant-2 Plan
    quadrant-3 Delegate
    quadrant-4 Eliminate
    Task A: [0.8, 0.9]
    Task B: [0.3, 0.8]
    Task C: [0.7, 0.3]
    Task D: [0.2, 0.2]
```

## 象限の位置

```
     y-axis (上が高)
        │
   Q2   │   Q1
        │
────────┼────────  x-axis (右が高)
        │
   Q3   │   Q4
        │
```

- quadrant-1: 右上（高x, 高y）
- quadrant-2: 左上（低x, 高y）
- quadrant-3: 左下（低x, 低y）
- quadrant-4: 右下（高x, 低y）

## 実践的な例：アイゼンハワーマトリクス

```mermaid
quadrantChart
    title Eisenhower Matrix
    x-axis Not Urgent --> Urgent
    y-axis Not Important --> Important
    quadrant-1 Do
    quadrant-2 Schedule
    quadrant-3 Eliminate
    quadrant-4 Delegate

    Production Bug: [0.95, 0.9]
    Customer Issue: [0.85, 0.85]
    Deadline Report: [0.8, 0.7]

    Strategy Planning: [0.2, 0.9]
    Skill Learning: [0.15, 0.85]
    Process Improvement: [0.3, 0.75]
    Health Care: [0.1, 0.8]

    Some Meetings: [0.7, 0.3]
    Phone Calls: [0.75, 0.25]
    Interruptions: [0.85, 0.2]

    Social Media: [0.2, 0.15]
    Unnecessary Meetings: [0.3, 0.2]
    Chit Chat: [0.15, 0.1]
```

## 実践的な例：技術選定マトリクス

```mermaid
quadrantChart
    title Technology Selection Matrix
    x-axis Low Learning Cost --> High Learning Cost
    y-axis Low Business Value --> High Business Value
    quadrant-1 Consider Carefully
    quadrant-2 Adopt Actively
    quadrant-3 Keep As Is
    quadrant-4 Avoid

    React: [0.35, 0.85]
    Vue: [0.25, 0.8]
    jQuery: [0.1, 0.3]
    Svelte: [0.4, 0.65]
    Angular: [0.7, 0.75]
    Web Components: [0.55, 0.4]
    Elm: [0.85, 0.5]
    Vanilla JS: [0.15, 0.5]
```

## 実践的な例：製品ポートフォリオ（BCGマトリクス）

```mermaid
quadrantChart
    title BCG Matrix - Product Portfolio
    x-axis Low Market Share --> High Market Share
    y-axis Low Growth Rate --> High Growth Rate
    quadrant-1 Star
    quadrant-2 Question Mark
    quadrant-3 Dog
    quadrant-4 Cash Cow

    New SaaS Product: [0.3, 0.85]
    AI Features: [0.4, 0.9]

    Main Product A: [0.85, 0.75]
    Mobile App: [0.7, 0.8]

    Legacy Product X: [0.2, 0.2]
    Old Version: [0.15, 0.15]

    Enterprise Edition: [0.8, 0.3]
    API Platform: [0.75, 0.25]
```

## 実践的な例：リスク評価マトリクス

```mermaid
quadrantChart
    title Risk Assessment Matrix
    x-axis Low Probability --> High Probability
    y-axis Low Impact --> High Impact
    quadrant-1 Critical Risk
    quadrant-2 High Risk
    quadrant-3 Low Risk
    quadrant-4 Medium Risk

    Security Breach: [0.3, 0.95]
    Data Loss: [0.2, 0.9]
    Vendor Bankruptcy: [0.15, 0.85]

    Production Outage: [0.7, 0.8]
    Staff Turnover: [0.6, 0.75]
    Technical Debt: [0.8, 0.7]

    Minor Bugs: [0.85, 0.2]
    Temporary Delay: [0.7, 0.25]

    Natural Disaster: [0.1, 0.3]
    Regulatory Change: [0.2, 0.4]
```

## 実践的な例：機能優先度マトリクス

```mermaid
quadrantChart
    title Feature Priority Matrix
    x-axis Low Cost --> High Cost
    y-axis Low User Value --> High User Value
    quadrant-1 Consider
    quadrant-2 Quick Win
    quadrant-3 Postpone
    quadrant-4 Avoid

    Dark Mode: [0.2, 0.7]
    Search Improvement: [0.3, 0.85]
    Performance Boost: [0.4, 0.8]

    AI Automation: [0.85, 0.9]
    Real-time Sync: [0.75, 0.75]
    Multi-language: [0.7, 0.65]

    Legacy Browser: [0.6, 0.2]
    Legacy API: [0.5, 0.3]

    Minor UI Tweaks: [0.15, 0.25]
    Detailed Logging: [0.2, 0.3]
```

## 実践的な例：スキルマトリクス

```mermaid
quadrantChart
    title Team Skill Matrix
    x-axis Low Project Need --> High Project Need
    y-axis Low Proficiency --> High Proficiency
    quadrant-1 Strength
    quadrant-2 Future Use
    quadrant-3 Not Needed
    quadrant-4 Gap

    TypeScript: [0.9, 0.85]
    React: [0.85, 0.9]
    PostgreSQL: [0.8, 0.75]

    Python: [0.4, 0.8]
    Java: [0.3, 0.7]

    Kubernetes: [0.85, 0.3]
    Terraform: [0.75, 0.25]
    GraphQL: [0.7, 0.4]

    COBOL: [0.1, 0.2]
    Flash: [0.05, 0.15]
```

## 実践的な例：ベンダー評価

```mermaid
quadrantChart
    title Vendor Evaluation Matrix
    x-axis High Cost --> Low Cost
    y-axis Low Quality --> High Quality
    quadrant-1 Top Priority
    quadrant-2 Quality Focus
    quadrant-3 Avoid
    quadrant-4 Cost Focus

    Vendor A: [0.8, 0.85]
    Vendor B: [0.7, 0.75]

    Vendor C: [0.25, 0.9]
    Vendor D: [0.3, 0.8]

    Vendor E: [0.85, 0.3]
    Vendor F: [0.75, 0.25]

    Vendor G: [0.2, 0.2]
    Vendor H: [0.3, 0.15]
```

## スタイルカスタマイズ

```mermaid
%%{init: {"quadrantChart": {"chartWidth": 500, "chartHeight": 500, "titleFontSize": 20, "quadrantPadding": 10, "xAxisLabelFontSize": 14, "yAxisLabelFontSize": 14, "pointTextPadding": 5, "pointLabelFontSize": 12}}}%%
quadrantChart
    title Custom Style Example
    x-axis Low X --> High X
    y-axis Low Y --> High Y
    quadrant-1 Q1
    quadrant-2 Q2
    quadrant-3 Q3
    quadrant-4 Q4
    Point A: [0.7, 0.8]
    Point B: [0.3, 0.6]
```
