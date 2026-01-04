# Block Diagram（ブロック図）

システムやコンポーネントの構造を視覚化するブロック図です。

> **注意**: `block-beta` はMermaid v10.6.0以降で利用可能な実験的機能です。お使いの環境がサポートしているか確認してください。

## 基本構文

```mermaid
block-beta
    columns 3
    A B C
    D E F
```

## カラム幅の指定

```mermaid
block-beta
    columns 3
    A:2 B
    C D:2
```

## ブロックの形状

```mermaid
block-beta
    columns 4

    block1["四角形"]
    block2("角丸")
    block3(("円形"))
    block4{{"六角形"}}

    block5[/"平行四辺形"/]
    block6[\\"逆平行四辺形"\\]
    block7[/"台形"\\]
    block8[\\"逆台形"/]

    block9(["スタジアム"])
    block10[["サブルーチン"]]
    block11[("データベース")]
    block12>"非対称形"]
```

## 入れ子構造

```mermaid
block-beta
    columns 3

    block:group1:2
        columns 2
        A["サービスA"] B["サービスB"]
    end
    C["外部サービス"]

    block:group2:3
        columns 3
        D["DB1"] E["DB2"] F["キャッシュ"]
    end
```

## 矢印/リンク

```mermaid
block-beta
    columns 3

    A["クライアント"] space:1 B["サーバー"]
    space:3
    C["データベース"]

    A --> B
    B --> C
```

## 矢印の種類

```mermaid
block-beta
    columns 5

    A B C D E

    A --> B
    B --- C
    C --"ラベル"--> D
    D -.-> E
```

## スペースの活用

```mermaid
block-beta
    columns 5

    A space:2 B space
    space:5
    C space D space E
```

## 実践的な例：Webアプリケーションアーキテクチャ

```mermaid
block-beta
    columns 5

    block:client:5
        columns 3
        space browser["ブラウザ"] space
    end

    space:5

    block:frontend:5
        columns 3
        cdn["CDN"] lb["ロードバランサー"] waf["WAF"]
    end

    space:5

    block:backend:5
        columns 4
        api1["API Server 1"] api2["API Server 2"] api3["API Server 3"] space
    end

    space:5

    block:data:5
        columns 4
        db[("PostgreSQL")] cache[("Redis")] mq["Message Queue"] storage[("S3")]
    end

    browser --> cdn
    cdn --> lb
    lb --> api1
    lb --> api2
    lb --> api3
    api1 --> db
    api1 --> cache
    api2 --> db
    api2 --> cache
    api3 --> mq
    mq --> storage
```

## 実践的な例：マイクロサービスアーキテクチャ

```mermaid
block-beta
    columns 7

    block:gateway:7
        columns 1
        gw["API Gateway"]
    end

    space:7

    block:services:7
        columns 7
        user["User Service"]
        order["Order Service"]
        product["Product Service"]
        payment["Payment Service"]
        notify["Notification Service"]
        search["Search Service"]
        analytics["Analytics Service"]
    end

    space:7

    block:data:7
        columns 7
        userdb[("User DB")]
        orderdb[("Order DB")]
        productdb[("Product DB")]
        paymentdb[("Payment DB")]
        space
        elastic[("Elasticsearch")]
        clickhouse[("ClickHouse")]
    end

    gw --> user
    gw --> order
    gw --> product
    gw --> payment
    gw --> search

    user --> userdb
    order --> orderdb
    product --> productdb
    payment --> paymentdb
    search --> elastic
    analytics --> clickhouse
```

## 実践的な例：CI/CDパイプライン

```mermaid
block-beta
    columns 6

    block:source:1
        src["Source Code"]
    end

    block:build:1
        build["Build"]
    end

    block:test:1
        test["Test"]
    end

    block:scan:1
        scan["Security Scan"]
    end

    block:deploy:2
        columns 2
        staging["Staging"]
        prod["Production"]
    end

    src --> build --> test --> scan --> staging --> prod
```

## 実践的な例：ネットワーク構成

```mermaid
block-beta
    columns 5

    block:internet:5
        columns 1
        inet(("Internet"))
    end

    space:5

    block:dmz:5
        columns 3
        space fw["Firewall"] space
    end

    space:5

    block:public:5
        columns 3
        web1["Web Server 1"] lb["Load Balancer"] web2["Web Server 2"]
    end

    space:5

    block:private:5
        columns 4
        app1["App Server 1"] app2["App Server 2"] space db[("Database")]
    end

    inet --> fw
    fw --> lb
    lb --> web1
    lb --> web2
    web1 --> app1
    web2 --> app2
    app1 --> db
    app2 --> db
```

## 実践的な例：データフロー

```mermaid
block-beta
    columns 5

    block:input:1
        columns 1
        source["データソース"]
    end

    block:ingest:1
        columns 1
        kafka["Kafka"]
    end

    block:process:1
        columns 1
        spark["Spark"]
    end

    block:store:1
        columns 1
        dw[("Data Warehouse")]
    end

    block:output:1
        columns 1
        bi["BI Tool"]
    end

    source --> kafka --> spark --> dw --> bi
```

## 実践的な例：モバイルアプリアーキテクチャ

```mermaid
block-beta
    columns 5

    block:presentation:5
        columns 3
        ios["iOS App"] space android["Android App"]
    end

    space:5

    block:api:5
        columns 1
        gateway["API Gateway"]
    end

    space:5

    block:backend:5
        columns 5
        auth["認証"]
        user["ユーザー"]
        content["コンテンツ"]
        push["プッシュ通知"]
        analytics["分析"]
    end

    space:5

    block:infra:5
        columns 4
        db[("RDS")]
        cache[("ElastiCache")]
        s3[("S3")]
        sqs["SQS"]
    end

    ios --> gateway
    android --> gateway
    gateway --> auth
    gateway --> user
    gateway --> content
    gateway --> push
    gateway --> analytics
    user --> db
    content --> s3
    push --> sqs
    analytics --> cache
```

## 実践的な例：Kubernetes クラスター

```mermaid
block-beta
    columns 5

    block:ingress:5
        columns 1
        ing["Ingress Controller"]
    end

    space:5

    block:services:5
        columns 3
        svc1["Service A"]
        svc2["Service B"]
        svc3["Service C"]
    end

    space:5

    block:pods:5
        columns 6
        pod1["Pod"]
        pod2["Pod"]
        pod3["Pod"]
        pod4["Pod"]
        pod5["Pod"]
        pod6["Pod"]
    end

    space:5

    block:storage:5
        columns 2
        pv1[("PV")]
        pv2[("PV")]
    end

    ing --> svc1
    ing --> svc2
    ing --> svc3
    svc1 --> pod1
    svc1 --> pod2
    svc2 --> pod3
    svc2 --> pod4
    svc3 --> pod5
    svc3 --> pod6
    pod1 --> pv1
    pod3 --> pv2
```
