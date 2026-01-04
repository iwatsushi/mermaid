# Class Diagram（クラス図）

オブジェクト指向設計でクラス間の関係を表現する図です。

## 基本構文

```mermaid
classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
```

## アクセス修飾子

```mermaid
classDiagram
    class AccessModifiers {
        +publicAttribute
        -privateAttribute
        #protectedAttribute
        ~packageAttribute
        +publicMethod()
        -privateMethod()
        #protectedMethod()
        ~packageMethod()
    }
```

| 記号 | 意味 |
|------|------|
| `+` | public（公開） |
| `-` | private（非公開） |
| `#` | protected（保護） |
| `~` | package/internal |

## データ型と戻り値

```mermaid
classDiagram
    class User {
        +String id
        +String name
        +int age
        +List~String~ roles
        +getId() String
        +setName(String name) void
        +getRoles() List~String~
        +isAdmin() bool
    }
```

## 静的メンバーと抽象メンバー

```mermaid
classDiagram
    class MyClass {
        +String instanceVar
        +String staticVar$
        +instanceMethod()
        +staticMethod()$
        +abstractMethod()*
    }
```

| 記号 | 意味 |
|------|------|
| `$` | 静的（static） |
| `*` | 抽象（abstract） |

## クラス間の関係

```mermaid
classDiagram
    classA <|-- classB : 継承
    classC *-- classD : コンポジション
    classE o-- classF : 集約
    classG --> classH : 関連
    classI -- classJ : リンク
    classK ..> classL : 依存
    classM ..|> classN : 実装
    classO -- classP : 双方向
```

## 関係の種類一覧

| 記法 | 関係の種類 | 説明 |
|------|-----------|------|
| `<\|--` | 継承 | Inheritance |
| `*--` | コンポジション | Composition（強い所有） |
| `o--` | 集約 | Aggregation（弱い所有） |
| `-->` | 関連 | Association |
| `--` | リンク | Link（単純な関係） |
| `..>` | 依存 | Dependency |
| `..\|>` | 実装 | Realization |

## カーディナリティ（多重度）

```mermaid
classDiagram
    Customer "1" --> "*" Order : places
    Order "1" --> "1..*" OrderItem : contains
    Product "1" --> "0..1" Discount : has
```

| 表記 | 意味 |
|------|------|
| `1` | 1つ |
| `0..1` | 0または1つ |
| `1..*` | 1つ以上 |
| `*` | 0以上（多数） |
| `n` | n個 |
| `0..n` | 0〜n個 |

## ジェネリクス（テンプレート）

```mermaid
classDiagram
    class List~T~ {
        +add(T item)
        +get(int index) T
        +size() int
    }

    class Map~K, V~ {
        +put(K key, V value)
        +get(K key) V
        +containsKey(K key) bool
    }
```

## インターフェース

```mermaid
classDiagram
    class IRepository~T~ {
        <<interface>>
        +find(String id) T
        +findAll() List~T~
        +save(T entity) void
        +delete(String id) void
    }

    class UserRepository {
        +find(String id) User
        +findAll() List~User~
        +save(User entity) void
        +delete(String id) void
    }

    IRepository~T~ <|.. UserRepository
```

## 列挙型

```mermaid
classDiagram
    class Status {
        <<enumeration>>
        PENDING
        ACTIVE
        COMPLETED
        CANCELLED
    }

    class Priority {
        <<enumeration>>
        LOW
        MEDIUM
        HIGH
        CRITICAL
    }
```

## 抽象クラス

```mermaid
classDiagram
    class AbstractShape {
        <<abstract>>
        #String color
        +getArea()* double
        +getPerimeter()* double
        +setColor(String color) void
    }

    class Circle {
        -double radius
        +getArea() double
        +getPerimeter() double
    }

    class Rectangle {
        -double width
        -double height
        +getArea() double
        +getPerimeter() double
    }

    AbstractShape <|-- Circle
    AbstractShape <|-- Rectangle
```

## サービスクラス

```mermaid
classDiagram
    class UserService {
        <<service>>
        +createUser(UserDTO dto) User
        +updateUser(String id, UserDTO dto) User
        +deleteUser(String id) void
    }
```

## 注釈（アノテーション）

```mermaid
classDiagram
    class UserEntity {
        <<Entity>>
        +Long id
        +String username
        +String email
    }

    class UserDTO {
        <<DTO>>
        +String username
        +String email
    }

    class UserMapper {
        <<Mapper>>
        +toDTO(UserEntity entity) UserDTO
        +toEntity(UserDTO dto) UserEntity
    }
```

## 名前空間（namespace）

```mermaid
classDiagram
    namespace Domain {
        class User {
            +String id
            +String name
        }
        class Order {
            +String id
            +Date createdAt
        }
    }

    namespace Infrastructure {
        class UserRepository {
            +find(String id) User
        }
        class OrderRepository {
            +find(String id) Order
        }
    }

    User <-- UserRepository
    Order <-- OrderRepository
```

## スタイリング

```mermaid
classDiagram
    class Animal {
        +String name
    }
    class Dog {
        +bark()
    }
    class Cat {
        +meow()
    }

    Animal <|-- Dog
    Animal <|-- Cat

    style Animal fill:#f9f,stroke:#333,stroke-width:2px
    style Dog fill:#bbf,stroke:#333,stroke-width:2px
    style Cat fill:#bfb,stroke:#333,stroke-width:2px
```

## 実践的な例：Eコマースシステム

```mermaid
classDiagram
    class User {
        <<Entity>>
        -Long id
        -String email
        -String passwordHash
        -UserProfile profile
        -List~Order~ orders
        +register(String email, String password) void
        +login(String email, String password) bool
        +updateProfile(UserProfile profile) void
    }

    class UserProfile {
        <<ValueObject>>
        -String firstName
        -String lastName
        -String phone
        -Address address
        +getFullName() String
    }

    class Address {
        <<ValueObject>>
        -String street
        -String city
        -String postalCode
        -String country
        +format() String
    }

    class Product {
        <<Entity>>
        -Long id
        -String name
        -String description
        -Money price
        -int stockQuantity
        -Category category
        +isInStock() bool
        +reduceStock(int quantity) void
    }

    class Category {
        <<Entity>>
        -Long id
        -String name
        -Category parent
        -List~Category~ children
    }

    class Money {
        <<ValueObject>>
        -BigDecimal amount
        -Currency currency
        +add(Money other) Money
        +multiply(int quantity) Money
    }

    class Order {
        <<AggregateRoot>>
        -Long id
        -User customer
        -List~OrderItem~ items
        -OrderStatus status
        -Money totalAmount
        -DateTime createdAt
        +addItem(Product product, int quantity) void
        +removeItem(Long itemId) void
        +calculateTotal() Money
        +place() void
        +cancel() void
    }

    class OrderItem {
        <<Entity>>
        -Long id
        -Product product
        -int quantity
        -Money unitPrice
        +getSubtotal() Money
    }

    class OrderStatus {
        <<enumeration>>
        DRAFT
        PENDING
        CONFIRMED
        SHIPPED
        DELIVERED
        CANCELLED
    }

    class IOrderRepository {
        <<interface>>
        +find(Long id) Order
        +findByUser(Long userId) List~Order~
        +save(Order order) void
    }

    class OrderService {
        <<service>>
        -IOrderRepository orderRepository
        -PaymentService paymentService
        +createOrder(User user) Order
        +placeOrder(Long orderId) void
        +cancelOrder(Long orderId) void
    }

    User "1" *-- "1" UserProfile : has
    UserProfile "1" *-- "1" Address : has
    User "1" --> "*" Order : places
    Order "1" *-- "1..*" OrderItem : contains
    Order "1" --> "1" OrderStatus : has
    OrderItem "*" --> "1" Product : references
    Product "*" --> "1" Category : belongs to
    Product "1" *-- "1" Money : price
    Order "1" *-- "1" Money : totalAmount
    Category "0..1" --> "*" Category : parent-child
    IOrderRepository <|.. OrderService : uses
```

## クリックイベント

```mermaid
classDiagram
    class Duck {
        +String beakColor
        +swim()
        +quack()
    }

    click Duck href "https://example.com/duck" "Duck documentation"
```

## 方向指定

```mermaid
classDiagram
    direction LR

    class A
    class B
    class C

    A --> B
    B --> C
```
