# Sankey Diagram（サンキー図）

フロー量や値の移動を視覚化する図です。エネルギーフロー、予算配分、ユーザーフローなどに活用できます。

> **注意**: `sankey-beta` はMermaid v10.3.0以降で利用可能な実験的機能です。お使いの環境がサポートしているか確認してください。

## 基本構文

```mermaid
sankey-beta

InputA,Process1,100
InputB,Process1,50
Process1,OutputA,80
Process1,OutputB,70
```

## 実践的な例：Webサイトユーザーフロー

```mermaid
sankey-beta

%% Source to Landing
Ads,Landing Page,3000
Search,Landing Page,5000
SNS,Landing Page,2000
Direct,Landing Page,1000

%% Landing to Pages
Landing Page,Product List,6000
Landing Page,Bounce,5000

%% Product List
Product List,Product Detail,4000
Product List,Bounce,2000

%% Product Detail
Product Detail,Cart,2500
Product Detail,Product List,500
Product Detail,Bounce,1000

%% Cart
Cart,Purchase Complete,1800
Cart,Bounce,700
```

## 実践的な例：予算配分

```mermaid
sankey-beta

%% Revenue Sources
Sales,Total Revenue,80000
Investment,Total Revenue,10000
Other Income,Total Revenue,10000

%% Main Categories
Total Revenue,Personnel,40000
Total Revenue,Development,25000
Total Revenue,Marketing,15000
Total Revenue,Administration,10000
Total Revenue,Other Expenses,10000

%% Personnel Breakdown
Personnel,Salary,32000
Personnel,Benefits,5000
Personnel,Recruiting,3000

%% Development Breakdown
Development,Infrastructure,10000
Development,Outsourcing,8000
Development,Tools,4000
Development,Training,3000

%% Marketing Breakdown
Marketing,Advertising,8000
Marketing,Events,4000
Marketing,Content,3000
```

## 実践的な例：エネルギーフロー

```mermaid
sankey-beta

%% Energy Sources
Oil,Primary Energy,4000
Natural Gas,Primary Energy,3000
Coal,Primary Energy,2000
Nuclear,Primary Energy,800
Renewable,Primary Energy,1200

%% Conversion Process
Primary Energy,Power Generation,5000
Primary Energy,Transport Fuel,3500
Primary Energy,Industrial Use,2500

%% Final Consumption
Power Generation,Residential,2000
Power Generation,Commercial,1500
Power Generation,Industrial Power,1000
Power Generation,Transmission Loss,500

Transport Fuel,Automobiles,2500
Transport Fuel,Aviation,600
Transport Fuel,Maritime,400

Industrial Use,Manufacturing,1500
Industrial Use,Construction,600
Industrial Use,Other Industry,400
```

## 実践的な例：コンバージョンファネル

```mermaid
sankey-beta

%% Traffic Sources
Organic Search,Visitors,50000
Paid Ads,Visitors,30000
SNS,Visitors,15000
Email,Visitors,5000

%% Initial Engagement
Visitors,Page View,80000
Visitors,Bounce,20000

%% Actions
Page View,Sign Up,15000
Page View,Guest Continue,25000
Page View,Exit,40000

%% Conversion
Sign Up,Purchase,6000
Sign Up,Exit,9000
Guest Continue,Purchase,3000
Guest Continue,Exit,22000

%% Repeat
Purchase,Repeat Purchase,4000
Purchase,One-time Only,5000
```

## 実践的な例：データパイプライン

```mermaid
sankey-beta

%% Data Sources
Web Logs,Data Collection,5000
API Logs,Data Collection,3000
DB Events,Data Collection,2000

%% Processing Flow
Data Collection,Validation,10000
Validation,Valid Data,9000
Validation,Error Data,1000

%% Valid Data Processing
Valid Data,ETL Process,9000
ETL Process,DWH Storage,8500
ETL Process,Process Error,500

%% Utilization
DWH Storage,BI Reports,4000
DWH Storage,ML Training,2500
DWH Storage,Real-time Analysis,2000
```

## 実践的な例：採用プロセス

```mermaid
sankey-beta

%% Application Sources
Job Sites,Applicants,500
Referral,Applicants,150
Company Website,Applicants,200
Agency,Applicants,150

%% Resume Screening
Applicants,Resume Pass,400
Applicants,Resume Reject,600

%% First Interview
Resume Pass,First Pass,200
Resume Pass,First Reject,150
Resume Pass,Withdrew,50

%% Second Interview
First Pass,Second Pass,100
First Pass,Second Reject,70
First Pass,Withdrew,30

%% Final Interview
Second Pass,Offer,60
Second Pass,Reject,30
Second Pass,Withdrew,10

%% Hiring
Offer,Hired,50
Offer,Declined Offer,10
```

## 実践的な例：クラウドコスト

```mermaid
sankey-beta

%% Total Budget
Cloud Budget,AWS,60000
Cloud Budget,GCP,25000
Cloud Budget,Azure,15000

%% AWS Breakdown
AWS,EC2,25000
AWS,RDS,15000
AWS,S3,8000
AWS,Lambda,5000
AWS,Other AWS,7000

%% GCP Breakdown
GCP,GCE,10000
GCP,BigQuery,8000
GCP,GCS,4000
GCP,Other GCP,3000

%% Azure Breakdown
Azure,VM,7000
Azure,SQL,4000
Azure,Storage,2000
Azure,Other Azure,2000
```

## 実践的な例：カスタマーサポートチケット

```mermaid
sankey-beta

%% Ticket Sources
Email,New Ticket,3000
Chat,New Ticket,2000
Phone,New Ticket,1500
Form,New Ticket,500

%% Initial Response
New Ticket,Auto Resolved,2000
New Ticket,Tier1 Support,5000

%% Tier1 Results
Tier1 Support,Resolved,3500
Tier1 Support,Escalation,1500

%% Escalation Target
Escalation,Tier2 Support,1000
Escalation,Dev Team,500

%% Final Resolution
Tier2 Support,Resolved,900
Tier2 Support,Long-term,100
Dev Team,Resolved,400
Dev Team,Backlog,100
```

## 実践的な例：売上チャネル

```mermaid
sankey-beta

%% Sales Channels
EC Direct,Total Sales,50000
Retail Store,Total Sales,30000
Wholesale,Total Sales,15000
Subscription,Total Sales,5000

%% Product Categories
Total Sales,Category A,35000
Total Sales,Category B,30000
Total Sales,Category C,20000
Total Sales,Category D,15000

%% Regions
Category A,Domestic,25000
Category A,Overseas,10000
Category B,Domestic,20000
Category B,Overseas,10000
Category C,Domestic,15000
Category C,Overseas,5000
Category D,Domestic,12000
Category D,Overseas,3000
```
