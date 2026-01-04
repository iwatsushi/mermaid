# Packet Diagram（パケット図）

ネットワークパケットやデータ構造を視覚化する図です。

> **注意**: `packet-beta` はMermaid v10.6.0以降で利用可能な実験的機能です。お使いの環境がサポートしているか確認してください。

## 基本構文

```mermaid
packet-beta
    0-15: "Source Port"
    16-31: "Destination Port"
    32-63: "Sequence Number"
    64-95: "Acknowledgment Number"
    96-99: "Data Offset"
    100-105: "Reserved"
    106-111: "Flags"
    112-127: "Window Size"
    128-143: "Checksum"
    144-159: "Urgent Pointer"
    160-191: "Options (if any)"
    192-255: "Data"
```

## 基本的なフィールド定義

```mermaid
packet-beta
    0-7: "フィールド1"
    8-15: "フィールド2"
    16-31: "フィールド3"
    32-63: "フィールド4"
```

## 実践的な例：TCPヘッダー

```mermaid
packet-beta
    title TCPヘッダー構造
    0-15: "Source Port (16 bits)"
    16-31: "Destination Port (16 bits)"
    32-63: "Sequence Number (32 bits)"
    64-95: "Acknowledgment Number (32 bits)"
    96-99: "Data Offset (4 bits)"
    100-105: "Reserved (6 bits)"
    106: "URG"
    107: "ACK"
    108: "PSH"
    109: "RST"
    110: "SYN"
    111: "FIN"
    112-127: "Window Size (16 bits)"
    128-143: "Checksum (16 bits)"
    144-159: "Urgent Pointer (16 bits)"
    160-191: "Options (variable)"
```

## 実践的な例：UDPヘッダー

```mermaid
packet-beta
    title UDPヘッダー構造
    0-15: "Source Port (16 bits)"
    16-31: "Destination Port (16 bits)"
    32-47: "Length (16 bits)"
    48-63: "Checksum (16 bits)"
    64-127: "Data"
```

## 実践的な例：IPv4ヘッダー

```mermaid
packet-beta
    title IPv4ヘッダー構造
    0-3: "Version"
    4-7: "IHL"
    8-13: "DSCP"
    14-15: "ECN"
    16-31: "Total Length"
    32-47: "Identification"
    48-50: "Flags"
    51-63: "Fragment Offset"
    64-71: "TTL"
    72-79: "Protocol"
    80-95: "Header Checksum"
    96-127: "Source IP Address"
    128-159: "Destination IP Address"
    160-191: "Options (if IHL > 5)"
```

## 実践的な例：Ethernetフレーム

```mermaid
packet-beta
    title Ethernetフレーム構造
    0-47: "Destination MAC (48 bits)"
    48-95: "Source MAC (48 bits)"
    96-111: "EtherType/Length (16 bits)"
    112-367: "Payload (46-1500 bytes)"
    368-399: "FCS (32 bits)"
```

## 実践的な例：HTTPリクエスト構造

```mermaid
packet-beta
    title HTTP/1.1 リクエスト構造
    0-63: "Method (GET/POST/...)"
    64-191: "Request URI"
    192-255: "HTTP Version"
    256-511: "Headers"
    512-767: "Body (if any)"
```

## 実践的な例：DNS クエリ

```mermaid
packet-beta
    title DNSメッセージ構造
    0-15: "Transaction ID"
    16-31: "Flags"
    32-47: "Questions"
    48-63: "Answer RRs"
    64-79: "Authority RRs"
    80-95: "Additional RRs"
    96-223: "Question Section"
    224-351: "Answer Section"
    352-479: "Authority Section"
    480-607: "Additional Section"
```

## 実践的な例：TLS レコード

```mermaid
packet-beta
    title TLSレコード構造
    0-7: "Content Type"
    8-15: "Major Version"
    16-23: "Minor Version"
    24-39: "Length"
    40-167: "Protocol Message"
```

## 実践的な例：WebSocket フレーム

```mermaid
packet-beta
    title WebSocketフレーム構造
    0: "FIN"
    1-3: "RSV1-3"
    4-7: "Opcode"
    8: "MASK"
    9-15: "Payload Length (7 bits)"
    16-31: "Extended Payload Length (16 bits, if needed)"
    32-63: "Masking Key (32 bits, if MASK=1)"
    64-191: "Payload Data"
```

## 実践的な例：カスタムプロトコル

```mermaid
packet-beta
    title カスタムメッセージプロトコル
    0-7: "Magic (0xAB)"
    8-15: "Version"
    16-23: "Message Type"
    24-31: "Flags"
    32-47: "Sequence Number"
    48-63: "Payload Length"
    64-127: "Timestamp (64 bits)"
    128-255: "Payload"
    256-287: "CRC32"
```

## 実践的な例：JWT構造

```mermaid
packet-beta
    title JWT (JSON Web Token) 構造
    0-127: "Header (Base64URL encoded)"
    128-383: "Payload (Base64URL encoded)"
    384-639: "Signature (Base64URL encoded)"
```

## 実践的な例：ICMPパケット

```mermaid
packet-beta
    title ICMPパケット構造
    0-7: "Type"
    8-15: "Code"
    16-31: "Checksum"
    32-47: "Identifier"
    48-63: "Sequence Number"
    64-319: "Data (variable)"
```

## 実践的な例：ARPパケット

```mermaid
packet-beta
    title ARPパケット構造
    0-15: "Hardware Type"
    16-31: "Protocol Type"
    32-39: "Hardware Addr Length"
    40-47: "Protocol Addr Length"
    48-63: "Operation"
    64-111: "Sender Hardware Address"
    112-143: "Sender Protocol Address"
    144-191: "Target Hardware Address"
    192-223: "Target Protocol Address"
```

## 実践的な例：データベースレコード

```mermaid
packet-beta
    title データベースレコード構造
    0-31: "Record ID (32 bits)"
    32-39: "Status Flags"
    40-47: "Reserved"
    48-111: "Timestamp (64 bits)"
    112-239: "User ID (128 bits)"
    240-495: "Data Payload (256 bits)"
    496-527: "Checksum"
```

## 実践的な例：ファイルフォーマット

```mermaid
packet-beta
    title カスタムファイルフォーマット
    0-31: "Magic Number (0x4D595F)"
    32-39: "Version Major"
    40-47: "Version Minor"
    48-63: "Header Size"
    64-95: "Total Size"
    96-127: "Flags"
    128-255: "Metadata"
    256-511: "Content"
    512-543: "Footer / Checksum"
```
