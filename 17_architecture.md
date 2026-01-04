# Architecture Diagram（アーキテクチャ図）

C4モデルなどに基づいたシステムアーキテクチャを視覚化する図です。

> **注意**: `architecture-beta` はMermaid v11.0.0以降で利用可能な実験的機能です。お使いの環境がサポートしているか確認してください。

## 基本構文

```mermaid
architecture-beta
    group api(cloud)[API]

    service db(database)[Database] in api
    service disk1(disk)[Storage] in api
    service disk2(disk)[Storage] in api
    service server(server)[Server] in api

    db:L -- R:server
    disk1:T -- B:server
    disk2:T -- B:db
```

## サービスアイコン

```mermaid
architecture-beta
    service server(server)[サーバー]
    service db(database)[データベース]
    service disk(disk)[ディスク]
    service internet(internet)[インターネット]
    service cloud(cloud)[クラウド]
```

### 利用可能なアイコン

| アイコン | 説明 |
|----------|------|
| `server` | サーバー |
| `database` | データベース |
| `disk` | ストレージ |
| `internet` | インターネット |
| `cloud` | クラウド |

## グループ化

```mermaid
architecture-beta
    group public(cloud)[パブリック]
    group private(cloud)[プライベート]

    service lb(server)[LB] in public
    service web(server)[Web] in public

    service app(server)[App] in private
    service db(database)[DB] in private

    lb:R -- L:web
    web:B -- T:app
    app:R -- L:db
```

## 接続方向

```mermaid
architecture-beta
    service a(server)[A]
    service b(server)[B]
    service c(server)[C]
    service d(server)[D]

    a:R -- L:b
    a:B -- T:c
    b:B -- T:d
```

### 接続ポイント

| ポイント | 説明 |
|----------|------|
| `L` | 左（Left） |
| `R` | 右（Right） |
| `T` | 上（Top） |
| `B` | 下（Bottom） |

## 実践的な例：Webアプリケーション

```mermaid
architecture-beta
    group client(cloud)[クライアント層]
    group server(cloud)[サーバー層]
    group data(cloud)[データ層]

    service browser(internet)[ブラウザ] in client
    service mobile(server)[モバイル] in client

    service lb(server)[ロードバランサー] in server
    service api1(server)[API 1] in server
    service api2(server)[API 2] in server

    service db(database)[PostgreSQL] in data
    service cache(database)[Redis] in data

    browser:B -- T:lb
    mobile:B -- T:lb
    lb:B -- T:api1
    lb:B -- T:api2
    api1:B -- T:db
    api2:B -- T:db
    api1:R -- L:cache
    api2:R -- L:cache
```

## 実践的な例：マイクロサービス

```mermaid
architecture-beta
    group gateway(cloud)[ゲートウェイ]
    group services(cloud)[サービス群]
    group storage(cloud)[ストレージ]

    service gw(server)[API Gateway] in gateway

    service user(server)[User Service] in services
    service order(server)[Order Service] in services
    service product(server)[Product Service] in services

    service userdb(database)[User DB] in storage
    service orderdb(database)[Order DB] in storage
    service productdb(database)[Product DB] in storage

    gw:B -- T:user
    gw:B -- T:order
    gw:B -- T:product

    user:B -- T:userdb
    order:B -- T:orderdb
    product:B -- T:productdb
```

## 実践的な例：クラウドインフラ

```mermaid
architecture-beta
    group internet(internet)[インターネット]
    group vpc(cloud)[VPC]
    group public_subnet(cloud)[パブリックサブネット]
    group private_subnet(cloud)[プライベートサブネット]

    service users(internet)[ユーザー] in internet
    service cdn(server)[CloudFront] in internet

    service alb(server)[ALB] in public_subnet
    service nat(server)[NAT Gateway] in public_subnet

    service ecs1(server)[ECS Task 1] in private_subnet
    service ecs2(server)[ECS Task 2] in private_subnet
    service rds(database)[Aurora] in private_subnet
    service elasticache(database)[ElastiCache] in private_subnet

    users:R -- L:cdn
    cdn:B -- T:alb
    alb:B -- T:ecs1
    alb:B -- T:ecs2
    ecs1:R -- L:rds
    ecs2:R -- L:rds
    ecs1:B -- T:elasticache
    ecs2:B -- T:elasticache
```

## 実践的な例：データパイプライン

```mermaid
architecture-beta
    group sources(cloud)[データソース]
    group processing(cloud)[処理層]
    group storage(cloud)[ストレージ層]
    group analytics(cloud)[分析層]

    service app(server)[アプリログ] in sources
    service iot(server)[IoTデータ] in sources

    service kinesis(server)[Kinesis] in processing
    service lambda(server)[Lambda] in processing

    service s3(disk)[S3] in storage
    service dw(database)[Redshift] in storage

    service bi(server)[QuickSight] in analytics
    service ml(server)[SageMaker] in analytics

    app:R -- L:kinesis
    iot:R -- L:kinesis
    kinesis:R -- L:lambda
    lambda:B -- T:s3
    s3:R -- L:dw
    dw:R -- L:bi
    dw:R -- L:ml
```

## 実践的な例：Kubernetesクラスター

```mermaid
architecture-beta
    group external(internet)[外部]
    group cluster(cloud)[Kubernetes Cluster]
    group ingress(cloud)[Ingress]
    group apps(cloud)[Applications]
    group data(cloud)[Data]

    service user(internet)[ユーザー] in external
    service ci(server)[CI/CD] in external

    service nginx(server)[Nginx Ingress] in ingress

    service frontend(server)[Frontend Pod] in apps
    service backend(server)[Backend Pod] in apps
    service worker(server)[Worker Pod] in apps

    service pg(database)[PostgreSQL] in data
    service redis(database)[Redis] in data

    user:B -- T:nginx
    ci:B -- T:nginx
    nginx:B -- T:frontend
    nginx:B -- T:backend
    backend:B -- T:pg
    backend:R -- L:redis
    worker:B -- T:pg
    worker:R -- L:redis
```

## 実践的な例：イベント駆動アーキテクチャ

```mermaid
architecture-beta
    group producers(cloud)[プロデューサー]
    group broker(cloud)[メッセージブローカー]
    group consumers(cloud)[コンシューマー]
    group storage(cloud)[ストレージ]

    service web(server)[Webアプリ] in producers
    service mobile(server)[モバイルアプリ] in producers
    service batch(server)[バッチ処理] in producers

    service kafka(server)[Kafka] in broker

    service analytics(server)[分析サービス] in consumers
    service notification(server)[通知サービス] in consumers
    service sync(server)[同期サービス] in consumers

    service dw(database)[Data Warehouse] in storage
    service search(database)[Elasticsearch] in storage

    web:R -- L:kafka
    mobile:R -- L:kafka
    batch:R -- L:kafka

    kafka:R -- L:analytics
    kafka:R -- L:notification
    kafka:R -- L:sync

    analytics:B -- T:dw
    sync:B -- T:search
```

## 実践的な例：ハイブリッドクラウド

```mermaid
architecture-beta
    group onprem(cloud)[オンプレミス]
    group aws(cloud)[AWS]
    group connection(cloud)[接続]

    service legacy(server)[レガシーシステム] in onprem
    service localdb(database)[オンプレDB] in onprem

    service vpn(server)[Direct Connect] in connection

    service ec2(server)[EC2] in aws
    service rds(database)[RDS] in aws
    service s3(disk)[S3] in aws

    legacy:R -- L:vpn
    localdb:R -- L:vpn
    vpn:R -- L:ec2
    ec2:B -- T:rds
    ec2:R -- L:s3
```
