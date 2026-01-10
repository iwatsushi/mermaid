/**
 * Azure公式アイコンをIconify形式のJSONに変換するスクリプト
 * Node.jsで実行: node build-azure-icons.js
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, 'azure_temp', 'Azure_Public_Service_Icons', 'Icons');
const OUTPUT_JSON = path.join(__dirname, 'azure', 'icons.json');
const OUTPUT_DIR = path.join(__dirname, 'azure');

// 出力ディレクトリの作成
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 重要なアイコンの優先マッピング（ファイル名 → アイコンID）
const PRIORITY_ICONS = {
    '10021-icon-service-Virtual-Machine.svg': 'virtual-machine',
    '10029-icon-service-Function-Apps.svg': 'function-apps',
    '10086-icon-service-Storage-Accounts.svg': 'storage-accounts',
    '10126-icon-service-Data-Factories.svg': 'data-factory',
    '10076-icon-service-Application-Gateways.svg': 'application-gateway',
    '10063-icon-service-Virtual-Network-Gateways.svg': 'vpn-gateway',
    '10130-icon-service-SQL-Database.svg': 'sql-database',
    '10121-icon-service-Azure-Cosmos-DB.svg': 'cosmos-db',
    '10023-icon-service-Kubernetes-Services.svg': 'kubernetes',
    '02422-icon-service-Bastions.svg': 'bastion',
    '10064-icon-service-Virtual-Networks.svg': 'virtual-network',
    '10059-icon-service-Load-Balancers.svg': 'load-balancer',
    '00056-icon-service-CDN-Profiles.svg': 'cdn',
    '10362-icon-service-Azure-Active-Directory.svg': 'active-directory',
    '10047-icon-service-App-Services.svg': 'app-service',
    '00606-icon-service-Azure-Synapse-Analytics.svg': 'synapse',
    '10061-icon-service-Firewalls.svg': 'firewall',
    '10838-icon-service-Storage-Azure-Files.svg': 'azure-files',
    '10839-icon-service-Storage-Container.svg': 'blob-storage',
    '10840-icon-service-Storage-Queue.svg': 'queue-storage',
    '10122-icon-service-Azure-Database-MySQL-Server.svg': 'mysql',
    '10131-icon-service-Azure-Database-PostgreSQL-Server.svg': 'postgresql',
    '10150-icon-service-Key-Vaults.svg': 'key-vault',
    '10042-icon-service-Logic-Apps.svg': 'logic-apps',
    '10041-icon-service-Event-Grid-Subscriptions.svg': 'event-grid',
    '10043-icon-service-Event-Hubs.svg': 'event-hub',
    '10044-icon-service-Service-Bus.svg': 'service-bus',
    '10045-icon-service-API-Management-Services.svg': 'api-management',
    '10165-icon-service-Azure-DevOps.svg': 'devops',
    '10166-icon-service-Azure-Repos.svg': 'repos',
    '10168-icon-service-Azure-Pipelines.svg': 'pipelines',
    '10182-icon-service-Container-Registries.svg': 'container-registry',
    '10035-icon-service-Notification-Hubs.svg': 'notification-hub',
    '10037-icon-service-Application-Insights.svg': 'application-insights',
    '10039-icon-service-Log-Analytics-Workspaces.svg': 'log-analytics',
    '02646-icon-service-Azure-Monitor.svg': 'monitor',
    '10227-icon-service-Azure-Cache-for-Redis.svg': 'redis-cache',
    '10046-icon-service-SignalR.svg': 'signalr',
    '10031-icon-service-Batch-Accounts.svg': 'batch',
    '10032-icon-service-VM-Scale-Sets.svg': 'vmss',
    '10033-icon-service-Service-Fabric-Clusters.svg': 'service-fabric',
    '10025-icon-service-Availability-Sets.svg': 'availability-set',
    '10027-icon-service-Disks.svg': 'managed-disk',
    '10071-icon-service-Network-Security-Groups.svg': 'nsg',
    '10067-icon-service-Public-IP-Addresses.svg': 'public-ip',
    '00427-icon-service-Private-Link.svg': 'private-endpoint',
    '02742-icon-service-Subnet.svg': 'subnet',
    '10009-icon-service-Machine-Learning.svg': 'machine-learning',
    '10158-icon-service-Cognitive-Services.svg': 'cognitive-services',
    '10162-icon-service-Bot-Services.svg': 'bot-service',
    '02531-icon-service-Azure-OpenAI.svg': 'openai',
    '10048-icon-service-App-Service-Plans.svg': 'app-service-plan',
    '10050-icon-service-Azure-Static-Web-Apps.svg': 'static-web-apps',
    '10222-icon-service-Front-Door-and-CDN-Profiles.svg': 'front-door',
    '03159-icon-service-Container-Apps.svg': 'container-apps',
    '03164-icon-service-Container-App-Environments.svg': 'container-app-env',
};

// SVGファイル名からアイコンIDを生成
function generateIconId(filename) {
    // 優先マッピングをチェック
    if (PRIORITY_ICONS[filename]) {
        return PRIORITY_ICONS[filename];
    }

    // ファイル名からIDを生成
    // 例: "10021-icon-service-Virtual-Machine.svg" → "virtual-machine"
    let id = filename
        .replace(/^\d+-icon-service-/, '')  // 先頭の数字とprefixを削除
        .replace(/\.svg$/, '')              // 拡張子を削除
        .replace(/\(Classic\)/gi, '-classic')
        .replace(/[()]/g, '')               // 括弧を削除
        .replace(/\s+/g, '-')               // スペースをハイフンに
        .replace(/--+/g, '-')               // 連続ハイフンを1つに
        .toLowerCase();

    return id;
}

// SVGからbodyとサイズを抽出
function extractSvgData(svgContent) {
    // SVGタグの属性を取得
    const svgTagMatch = svgContent.match(/<svg([^>]*)>([\s\S]*?)<\/svg>/i);
    if (!svgTagMatch) return null;

    const attrs = svgTagMatch[1];
    const body = svgTagMatch[2].trim();

    // width/height属性を取得
    const widthMatch = attrs.match(/width="(\d+)"/);
    const heightMatch = attrs.match(/height="(\d+)"/);

    // viewBox属性を取得
    const viewBoxMatch = attrs.match(/viewBox="([^"]+)"/);

    return {
        body,
        width: widthMatch ? parseInt(widthMatch[1]) : 18,
        height: heightMatch ? parseInt(heightMatch[1]) : 18,
        viewBox: viewBoxMatch ? viewBoxMatch[1] : '0 0 18 18'
    };
}

// 全カテゴリのSVGファイルを処理
function processAllIcons() {
    const icons = {};
    const processedIds = new Set();
    const categories = fs.readdirSync(SOURCE_DIR);

    console.log('Processing Azure icons...');

    for (const category of categories) {
        const categoryPath = path.join(SOURCE_DIR, category);
        if (!fs.statSync(categoryPath).isDirectory()) continue;

        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.svg'));

        for (const file of files) {
            const iconId = generateIconId(file);

            // 重複チェック（優先アイコンは上書き）
            if (processedIds.has(iconId) && !PRIORITY_ICONS[file]) {
                continue;
            }

            const filePath = path.join(categoryPath, file);
            const svgContent = fs.readFileSync(filePath, 'utf8');
            const svgData = extractSvgData(svgContent);

            if (svgData && svgData.body) {
                // 各アイコンはbodyのみ（width/heightはルートレベルで定義）
                icons[iconId] = {
                    body: svgData.body
                };
                processedIds.add(iconId);

                // SVGファイルもコピー（直接使用用）
                const destPath = path.join(OUTPUT_DIR, `${iconId}.svg`);
                fs.copyFileSync(filePath, destPath);
            }
        }
    }

    // Iconify形式のJSONを作成
    const iconifyJson = {
        prefix: 'azure',
        lastModified: Date.now(),
        width: 18,
        height: 18,
        icons: icons
    };

    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(iconifyJson, null, 2));

    console.log(`Processed ${Object.keys(icons).length} icons`);
    console.log(`Output: ${OUTPUT_JSON}`);
    console.log('\nPriority icons included:');
    for (const [file, id] of Object.entries(PRIORITY_ICONS)) {
        console.log(`  - ${id}`);
    }
}

processAllIcons();
