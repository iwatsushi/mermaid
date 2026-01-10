/**
 * アーキテクチャ図エディター
 */
class ArchitectureEditor extends BaseEditor {
    constructor(app) {
        super(app);
        this.groups = [];
        this.services = [];
        this.connections = [];

        // 利用可能なアイコン
        // パック: logos (カラー), mdi (Material Design), devicon, skill-icons, simple-icons, cib
        // Iconify API: https://api.iconify.design/{prefix}/{icon}.svg
        //
        // portable: true  = どの環境でも表示可能（Mermaid組み込み）
        // portable: false = このツールでのみ表示可能（registerIconPacks必要）
        this.iconCategories = [
            {
                id: 'builtin',
                name: '組み込み（どこでも使える）',
                portable: true,  // Mermaid組み込みアイコン - どの環境でも動作
                icons: [
                    { id: 'cloud', name: 'Cloud' },
                    { id: 'database', name: 'Database' },
                    { id: 'server', name: 'Server' },
                    { id: 'disk', name: 'Disk' },
                    { id: 'internet', name: 'Internet' }
                ]
            },
            {
                id: 'aws-general',
                name: 'AWS 全般',
                portable: false,
                icons: [
                    { id: 'logos:aws', name: 'AWS' },
                    { id: 'skill-icons:aws-dark', name: 'AWS (Dark)' },
                    { id: 'skill-icons:aws-light', name: 'AWS (Light)' }
                ]
            },
            {
                id: 'aws-compute',
                name: 'AWS コンピューティング',
                portable: false,
                icons: [
                    { id: 'logos:aws-ec2', name: 'EC2' },
                    { id: 'logos:aws-lambda', name: 'Lambda' },
                    { id: 'logos:aws-ecs', name: 'ECS' },
                    { id: 'logos:aws-eks', name: 'EKS' },
                    { id: 'logos:aws-fargate', name: 'Fargate' },
                    { id: 'logos:aws-lightsail', name: 'Lightsail' }
                ]
            },
            {
                id: 'aws-storage',
                name: 'AWS ストレージ',
                portable: false,
                icons: [
                    { id: 'logos:aws-s3', name: 'S3' },
                    { id: 'logos:aws-glacier', name: 'Glacier' }
                ]
            },
            {
                id: 'aws-database',
                name: 'AWS データベース',
                portable: false,
                icons: [
                    { id: 'logos:aws-rds', name: 'RDS' },
                    { id: 'logos:aws-aurora', name: 'Aurora' },
                    { id: 'logos:aws-dynamodb', name: 'DynamoDB' },
                    { id: 'logos:aws-elasticache', name: 'ElastiCache' },
                    { id: 'logos:aws-redshift', name: 'Redshift' },
                    { id: 'logos:aws-documentdb', name: 'DocumentDB' },
                    { id: 'logos:aws-keyspaces', name: 'Keyspaces' },
                    { id: 'logos:aws-timestream', name: 'Timestream' }
                ]
            },
            {
                id: 'aws-network',
                name: 'AWS ネットワーク',
                portable: false,
                icons: [
                    { id: 'logos:aws-cloudfront', name: 'CloudFront' },
                    { id: 'logos:aws-route53', name: 'Route 53' },
                    { id: 'logos:aws-api-gateway', name: 'API Gateway' },
                    { id: 'logos:aws-app-mesh', name: 'App Mesh' }
                ]
            },
            {
                id: 'aws-integration',
                name: 'AWS 統合',
                portable: false,
                icons: [
                    { id: 'logos:aws-sqs', name: 'SQS' },
                    { id: 'logos:aws-sns', name: 'SNS' },
                    { id: 'logos:aws-kinesis', name: 'Kinesis' }
                ]
            },
            {
                id: 'aws-management',
                name: 'AWS 管理/セキュリティ',
                portable: false,
                icons: [
                    { id: 'logos:aws-cloudwatch', name: 'CloudWatch' },
                    { id: 'logos:aws-cloudformation', name: 'CloudFormation' },
                    { id: 'logos:aws-cognito', name: 'Cognito' },
                    { id: 'logos:aws-opsworks', name: 'OpsWorks' }
                ]
            },
            {
                id: 'azure-compute',
                name: 'Azure コンピューティング',
                portable: false,
                icons: [
                    { id: 'Azure:virtual-machine', name: 'Virtual Machine' },
                    { id: 'Azure:vm-scale-sets', name: 'VM Scale Sets' },
                    { id: 'Azure:app-services', name: 'App Service' },
                    { id: 'Azure:app-service-plans', name: 'App Service Plan' },
                    { id: 'Azure:function-apps', name: 'Functions' },
                    { id: 'Azure:kubernetes-services', name: 'AKS' },
                    { id: 'Azure:container-instances', name: 'Container Instances' },
                    { id: 'Azure:container-registries', name: 'Container Registry' },
                    { id: 'Azure:batch-accounts', name: 'Batch' },
                    { id: 'Azure:service-fabric-clusters', name: 'Service Fabric' }
                ]
            },
            {
                id: 'azure-storage',
                name: 'Azure ストレージ',
                portable: false,
                icons: [
                    { id: 'Azure:storage-accounts', name: 'Storage Account' },
                    { id: 'Azure:storage-container', name: 'Blob Storage' },
                    { id: 'Azure:storage-azure-files', name: 'Azure Files' },
                    { id: 'Azure:storage-queue', name: 'Queue Storage' },
                    { id: 'Azure:disks', name: 'Managed Disk' }
                ]
            },
            {
                id: 'azure-database',
                name: 'Azure データベース',
                portable: false,
                icons: [
                    { id: 'Azure:azure-sql', name: 'SQL Database' },
                    { id: 'Azure:azure-cosmos-db', name: 'Cosmos DB' },
                    { id: 'Azure:cache-redis', name: 'Redis Cache' },
                    { id: 'Azure:azure-database-mysql-server', name: 'MySQL' },
                    { id: 'Azure:azure-database-postgresql-server', name: 'PostgreSQL' },
                    { id: 'Azure:azure-synapse-analytics', name: 'Synapse Analytics' },
                    { id: 'Azure:data-factories', name: 'Data Factory' }
                ]
            },
            {
                id: 'azure-network',
                name: 'Azure ネットワーク',
                portable: false,
                icons: [
                    { id: 'Azure:virtual-networks', name: 'Virtual Network' },
                    { id: 'Azure:subnet', name: 'Subnet' },
                    { id: 'Azure:load-balancers', name: 'Load Balancer' },
                    { id: 'Azure:application-gateways', name: 'Application Gateway' },
                    { id: 'Azure:front-door-and-cdn-profiles', name: 'Front Door' },
                    { id: 'Azure:firewalls', name: 'Firewall' },
                    { id: 'Azure:virtual-network-gateways', name: 'VPN Gateway' },
                    { id: 'Azure:bastions', name: 'Bastion' },
                    { id: 'Azure:cdn-profiles', name: 'CDN' },
                    { id: 'Azure:network-security-groups', name: 'NSG' },
                    { id: 'Azure:public-ip-addresses', name: 'Public IP' },
                    { id: 'Azure:private-endpoints', name: 'Private Endpoint' }
                ]
            },
            {
                id: 'azure-integration',
                name: 'Azure 統合',
                portable: false,
                icons: [
                    { id: 'Azure:azure-service-bus', name: 'Service Bus' },
                    { id: 'Azure:event-grid-topics', name: 'Event Grid' },
                    { id: 'Azure:event-hubs', name: 'Event Hubs' },
                    { id: 'Azure:logic-apps', name: 'Logic Apps' },
                    { id: 'Azure:api-management-services', name: 'API Management' },
                    { id: 'Azure:signalr', name: 'SignalR' },
                    { id: 'Azure:notification-hubs', name: 'Notification Hub' }
                ]
            },
            {
                id: 'azure-devops',
                name: 'Azure DevOps',
                portable: false,
                icons: [
                    { id: 'Azure:azure-devops', name: 'Azure DevOps' },
                    { id: 'Azure:devops-starter', name: 'DevOps Starter' },
                    { id: 'Azure:tfs-vc-repository', name: 'Repos' }
                ]
            },
            {
                id: 'azure-security',
                name: 'Azure セキュリティ',
                portable: false,
                icons: [
                    { id: 'Azure:key-vaults', name: 'Key Vault' },
                    { id: 'Azure:entra-domain-services', name: 'Entra ID' }
                ]
            },
            {
                id: 'azure-ai',
                name: 'Azure AI/ML',
                portable: false,
                icons: [
                    { id: 'Azure:machine-learning', name: 'Machine Learning' },
                    { id: 'Azure:cognitive-services', name: 'Cognitive Services' },
                    { id: 'Azure:azure-openai', name: 'Azure OpenAI' },
                    { id: 'Azure:bot-services', name: 'Bot Service' }
                ]
            },
            {
                id: 'azure-monitoring',
                name: 'Azure モニタリング',
                portable: false,
                icons: [
                    { id: 'Azure:azure-monitors-for-sap-solutions', name: 'Monitor' },
                    { id: 'Azure:log-analytics-workspaces', name: 'Log Analytics' },
                    { id: 'Azure:application-insights', name: 'App Insights' }
                ]
            },
            {
                id: 'azure-web',
                name: 'Azure Web',
                portable: false,
                icons: [
                    { id: 'Azure:static-apps', name: 'Static Web Apps' }
                ]
            },
            {
                id: 'gcp',
                name: 'Google Cloud',
                portable: false,
                icons: [
                    { id: 'logos:google-cloud', name: 'Google Cloud' },
                    { id: 'skill-icons:gcp-dark', name: 'GCP (Dark)' },
                    { id: 'skill-icons:gcp-light', name: 'GCP (Light)' },
                    { id: 'logos:google-cloud-run', name: 'Cloud Run' },
                    { id: 'logos:google-cloud-functions', name: 'Cloud Functions' },
                    { id: 'logos:firebase', name: 'Firebase' }
                ]
            },
            {
                id: 'containers',
                name: 'コンテナ',
                portable: false,
                icons: [
                    { id: 'logos:docker-icon', name: 'Docker' },
                    { id: 'skill-icons:docker', name: 'Docker (Color)' },
                    { id: 'logos:kubernetes', name: 'Kubernetes' },
                    { id: 'skill-icons:kubernetes', name: 'K8s (Color)' },
                    { id: 'logos:helm', name: 'Helm' },
                    { id: 'logos:rancher-icon', name: 'Rancher' },
                    { id: 'logos:openshift', name: 'OpenShift' }
                ]
            },
            {
                id: 'databases',
                name: 'データベース',
                portable: false,
                icons: [
                    { id: 'logos:postgresql', name: 'PostgreSQL' },
                    { id: 'logos:mysql-icon', name: 'MySQL' },
                    { id: 'logos:mariadb-icon', name: 'MariaDB' },
                    { id: 'logos:mongodb-icon', name: 'MongoDB' },
                    { id: 'logos:redis', name: 'Redis' },
                    { id: 'logos:elasticsearch', name: 'Elasticsearch' },
                    { id: 'logos:cassandra', name: 'Cassandra' },
                    { id: 'logos:neo4j', name: 'Neo4j' },
                    { id: 'logos:sqlite', name: 'SQLite' },
                    { id: 'mdi:database', name: 'Database' }
                ]
            },
            {
                id: 'messaging',
                name: 'メッセージング',
                portable: false,
                icons: [
                    { id: 'logos:kafka-icon', name: 'Kafka' },
                    { id: 'logos:rabbitmq-icon', name: 'RabbitMQ' },
                    { id: 'logos:nats-icon', name: 'NATS' },
                    { id: 'mdi:message-processing', name: 'Message Queue' },
                    { id: 'mdi:email', name: 'Email' }
                ]
            },
            {
                id: 'webservers',
                name: 'Web/Proxy',
                portable: false,
                icons: [
                    { id: 'logos:nginx', name: 'Nginx' },
                    { id: 'logos:apache', name: 'Apache' },
                    { id: 'devicon:traefikproxy', name: 'Traefik' },
                    { id: 'logos:envoy-icon', name: 'Envoy' },
                    { id: 'simple-icons:caddy', name: 'Caddy' },
                    { id: 'mdi:web', name: 'Web Server' }
                ]
            },
            {
                id: 'monitoring',
                name: 'モニタリング',
                portable: false,
                icons: [
                    { id: 'logos:grafana', name: 'Grafana' },
                    { id: 'logos:prometheus', name: 'Prometheus' },
                    { id: 'logos:datadog', name: 'Datadog' },
                    { id: 'logos:new-relic-icon', name: 'New Relic' },
                    { id: 'logos:kibana', name: 'Kibana' },
                    { id: 'logos:sentry-icon', name: 'Sentry' },
                    { id: 'mdi:monitor-dashboard', name: 'Dashboard' }
                ]
            },
            {
                id: 'cicd',
                name: 'CI/CD',
                portable: false,
                icons: [
                    { id: 'logos:jenkins', name: 'Jenkins' },
                    { id: 'logos:github-actions', name: 'GitHub Actions' },
                    { id: 'logos:gitlab', name: 'GitLab' },
                    { id: 'logos:circleci', name: 'CircleCI' },
                    { id: 'logos:argo-icon', name: 'Argo' },
                    { id: 'skill-icons:github-dark', name: 'GitHub' },
                    { id: 'skill-icons:git', name: 'Git' }
                ]
            },
            {
                id: 'iac',
                name: 'IaC/構成管理',
                portable: false,
                icons: [
                    { id: 'logos:terraform-icon', name: 'Terraform' },
                    { id: 'logos:ansible', name: 'Ansible' },
                    { id: 'logos:pulumi-icon', name: 'Pulumi' },
                    { id: 'logos:vagrant', name: 'Vagrant' },
                    { id: 'logos:packer', name: 'Packer' }
                ]
            },
            {
                id: 'security',
                name: 'セキュリティ',
                portable: false,
                icons: [
                    { id: 'logos:vault-icon', name: 'Vault' },
                    { id: 'logos:auth0-icon', name: 'Auth0' },
                    { id: 'logos:okta-icon', name: 'Okta' },
                    { id: 'mdi:shield', name: 'Security' },
                    { id: 'mdi:lock', name: 'Lock' }
                ]
            },
            {
                id: 'languages',
                name: 'プログラミング言語',
                portable: false,
                icons: [
                    { id: 'logos:python', name: 'Python' },
                    { id: 'logos:nodejs-icon', name: 'Node.js' },
                    { id: 'devicon:csharp', name: 'C#' },
                    { id: 'logos:go', name: 'Go' },
                    { id: 'logos:java', name: 'Java' },
                    { id: 'logos:rust', name: 'Rust' },
                    { id: 'logos:dotnet', name: '.NET' },
                    { id: 'logos:ruby', name: 'Ruby' },
                    { id: 'logos:php', name: 'PHP' },
                    { id: 'logos:typescript-icon', name: 'TypeScript' },
                    { id: 'logos:javascript', name: 'JavaScript' }
                ]
            },
            {
                id: 'generic',
                name: '汎用アイコン',
                portable: false,
                icons: [
                    { id: 'mdi:cloud', name: 'Cloud' },
                    { id: 'mdi:server', name: 'Server' },
                    { id: 'mdi:database', name: 'Database' },
                    { id: 'mdi:api', name: 'API' },
                    { id: 'mdi:cog', name: 'Service' },
                    { id: 'mdi:account', name: 'User' },
                    { id: 'mdi:web', name: 'Web' },
                    { id: 'mdi:cellphone', name: 'Mobile' },
                    { id: 'mdi:laptop', name: 'Client' },
                    { id: 'mdi:earth', name: 'Internet' },
                    { id: 'mdi:lan', name: 'Network' },
                    { id: 'mdi:folder', name: 'Storage' }
                ]
            }
        ];

        // フラット化したアイコンリスト（検索用）
        this.allIcons = this.iconCategories.flatMap(cat =>
            cat.icons.map(icon => ({ ...icon, category: cat.name }))
        );

        this.templates = [
            { id: 'simple', name: 'シンプル' },
            { id: 'threetiered', name: '3層アーキテクチャ' },
            { id: 'microservices', name: 'マイクロサービス' },
            { id: 'aws-web', name: 'AWS Webアプリ' },
            { id: 'azure-web', name: 'Azure Webアプリ' }
        ];

        this.initDefaultData();
    }

    initDefaultData() {
        this.groups = [
            { id: 'cloud', label: 'Cloud', icon: 'cloud' }
        ];
        this.services = [
            { id: 'web', label: 'Web Server', icon: 'server', group: 'cloud' },
            { id: 'api', label: 'API Server', icon: 'server', group: 'cloud' },
            { id: 'db', label: 'Database', icon: 'database', group: 'cloud' }
        ];
        this.connections = [
            { from: 'web', to: 'api', direction: 'LR' },
            { from: 'api', to: 'db', direction: 'LR' }
        ];
    }

    render() {
        const container = document.createElement('div');

        // 注意メッセージ
        const warning = document.createElement('div');
        warning.className = 'alert alert-info alert-sm mb-3';
        warning.innerHTML = `<i class="bi bi-info-circle"></i> Architecture図は Mermaid v11 以降で利用可能です<br>
            <small class="text-muted">AWS/Azure等のアイコンはSimple Icons (iconify.design) から読み込まれます</small>`;
        container.appendChild(warning);

        // グループ
        container.appendChild(this.createSection('グループ', 'bi-collection', this.renderGroupList()));

        // サービス
        container.appendChild(this.createSection('サービス', 'bi-server', this.renderServiceList()));

        // 接続
        container.appendChild(this.createSection('接続', 'bi-arrow-left-right', this.renderConnectionList()));

        return container;
    }

    renderGroupList() {
        const wrapper = document.createElement('div');

        // グループリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.groups.length === 0) {
            list.innerHTML = '<div class="item-list-empty">グループがありません</div>';
        } else {
            this.groups.forEach((group, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge bg-secondary me-2">${group.icon}</span>
                        <span>${group.id}</span>
                        ${group.label !== group.id ? `<small class="text-muted ms-2">(${group.label})</small>` : ''}
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-group" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-group" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                list.appendChild(itemEl);
            });
        }
        wrapper.appendChild(list);

        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2">
                <div class="col-4">
                    <label class="form-label">ID</label>
                    <input type="text" class="form-control form-control-sm" id="groupId" placeholder="cloud">
                </div>
                <div class="col-4">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="groupLabel" placeholder="Cloud">
                </div>
                <div class="col-4">
                    <label class="form-label">アイコン</label>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" id="groupIcon" value="cloud" readonly>
                        <button class="btn btn-outline-secondary" type="button" id="selectGroupIconBtn">
                            <i class="bi bi-grid-3x3-gap"></i>
                        </button>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addGroupBtn">
                <i class="bi bi-plus"></i> グループを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addGroupBtn')?.addEventListener('click', () => this.addGroup());
            wrapper.querySelector('#selectGroupIconBtn')?.addEventListener('click', () => {
                this.showIconSelectModal((iconId) => {
                    document.getElementById('groupIcon').value = iconId;
                });
            });
            wrapper.querySelectorAll('.edit-group').forEach(btn => {
                btn.addEventListener('click', (e) => this.editGroup(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-group').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteGroup(parseInt(e.currentTarget.dataset.index)));
            });

            // ドラッグ＆ドロップ
            let draggedIndex = null;
            wrapper.querySelectorAll('.item-list-item[draggable="true"]').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedIndex = parseInt(item.dataset.index);
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });
                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    wrapper.querySelectorAll('.item-list-item').forEach(el => el.classList.remove('drag-over'));
                });
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        item.classList.add('drag-over');
                    }
                });
                item.addEventListener('dragleave', () => {
                    item.classList.remove('drag-over');
                });
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        this.moveGroup(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveGroup(fromIndex, toIndex) {
        const [moved] = this.groups.splice(fromIndex, 1);
        this.groups.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    editGroup(index) {
        const group = this.groups[index];

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-collection"></i> グループ編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ID</label>
                            <input type="text" class="form-control" id="editGroupId" value="${group.id}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">ラベル</label>
                            <input type="text" class="form-control" id="editGroupLabel" value="${group.label}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">アイコン</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="editGroupIcon" value="${group.icon}" readonly>
                                <button class="btn btn-outline-secondary" type="button" id="editSelectGroupIconBtn">
                                    <i class="bi bi-grid-3x3-gap"></i> 選択
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="saveGroupBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#editSelectGroupIconBtn').addEventListener('click', () => {
            this.showIconSelectModal((iconId) => {
                modal.querySelector('#editGroupIcon').value = iconId;
            });
        });

        modal.querySelector('#saveGroupBtn').addEventListener('click', () => {
            const newId = modal.querySelector('#editGroupId').value.trim();
            const newLabel = modal.querySelector('#editGroupLabel').value.trim();
            const newIcon = modal.querySelector('#editGroupIcon').value;

            if (newId && newId !== group.id) {
                // IDが変わった場合、サービスのグループ参照も更新
                this.services.forEach(svc => {
                    if (svc.group === group.id) svc.group = newId;
                });
            }

            group.id = newId || group.id;
            group.label = newLabel || group.label;
            group.icon = newIcon;

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    showIconSelectModal(callback) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-grid-3x3-gap"></i> アイコン選択</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <!-- 互換性の凡例 -->
                        <div class="alert alert-warning alert-sm mb-3 py-2">
                            <div class="d-flex align-items-center gap-3 flex-wrap">
                                <span class="fw-bold"><i class="bi bi-info-circle"></i> 互換性:</span>
                                <span><span class="badge bg-success me-1">どこでも</span> mermaid.live, VSCode等でも表示</span>
                                <span><span class="badge bg-warning text-dark me-1">このツールのみ</span> このツールでのみ表示可能</span>
                            </div>
                        </div>
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <input type="text" class="form-control" id="iconSearch" placeholder="アイコンを検索... (例: lambda, s3, docker)">
                            </div>
                            <div class="col-6">
                                <select class="form-select" id="iconCategoryFilter">
                                    <option value="">すべてのカテゴリ</option>
                                    ${this.iconCategories.map(cat => {
                                        const portableLabel = cat.portable ? '✓' : '⚠';
                                        return `<option value="${cat.id}">${portableLabel} ${cat.name} (${cat.icons.length})</option>`;
                                    }).join('')}
                                </select>
                            </div>
                        </div>
                        <div id="iconGrid" class="icon-visual-grid" style="max-height: 500px; overflow-y: auto;">
                            ${this.renderVisualIconGrid('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        const updateGrid = () => {
            const search = modal.querySelector('#iconSearch').value.toLowerCase();
            const category = modal.querySelector('#iconCategoryFilter').value;
            modal.querySelector('#iconGrid').innerHTML = this.renderVisualIconGrid(search, category);
            this.bindIconClickEvents(modal, callback, bsModal);
        };

        modal.querySelector('#iconSearch').addEventListener('input', updateGrid);
        modal.querySelector('#iconCategoryFilter').addEventListener('change', updateGrid);

        // 初期イベント設定
        this.bindIconClickEvents(modal, callback, bsModal);

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    bindIconClickEvents(modal, callback, bsModal) {
        modal.querySelectorAll('.icon-visual-item').forEach(item => {
            item.addEventListener('click', () => {
                callback(item.dataset.iconId);
                bsModal.hide();
            });
        });
    }

    getIconSvgUrl(iconId) {
        // 組み込みアイコンはMermaid内蔵なので、プレビュー用にIconify代替を使用
        if (!iconId.includes(':')) {
            // 組み込みアイコンの代替マッピング（プレビュー表示用）
            const builtinPreviewMap = {
                'cloud': 'mdi:cloud',
                'database': 'mdi:database',
                'server': 'mdi:server',
                'disk': 'mdi:harddisk',
                'internet': 'mdi:earth'
            };
            const mappedIcon = builtinPreviewMap[iconId];
            if (mappedIcon) {
                const [prefix, name] = mappedIcon.split(':');
                return `https://api.iconify.design/${prefix}/${name}.svg`;
            }
            return null;
        }

        const [prefix, name] = iconId.split(':');

        // Azure:プレフィックスはローカルSVGファイルを使用（一覧表示用）
        // azureiconkentoのアイコン名からローカルファイル名へのマッピング
        if (prefix === 'Azure') {
            const azureFileMap = {
                'virtual-machine': 'virtual-machine',
                'vm-scale-sets': 'vmss',
                'app-services': 'app-service',
                'app-service-plans': 'app-service-plan',
                'function-apps': 'function-apps',
                'kubernetes-services': 'kubernetes',
                'container-instances': 'container-instances',
                'container-registries': 'container-registries',
                'batch-accounts': 'batch',
                'service-fabric-clusters': 'service-fabric',
                'storage-accounts': 'storage-accounts',
                'storage-container': 'blob-storage',
                'storage-azure-files': 'azure-files',
                'storage-queue': 'queue-storage',
                'disks': 'managed-disk',
                'azure-sql': 'sql-database',
                'azure-cosmos-db': 'cosmos-db',
                'cache-redis': 'redis-cache',
                'azure-database-mysql-server': 'mysql',
                'azure-database-postgresql-server': 'postgresql',
                'azure-synapse-analytics': 'synapse',
                'data-factories': 'data-factory',
                'virtual-networks': 'virtual-network',
                'subnet': 'subnet',
                'load-balancers': 'load-balancer',
                'application-gateways': 'application-gateway',
                'front-door-and-cdn-profiles': 'front-door',
                'firewalls': 'firewall',
                'virtual-network-gateways': 'vpn-gateway',
                'bastions': 'bastion',
                'cdn-profiles': 'cdn',
                'network-security-groups': 'nsg',
                'public-ip-addresses': 'public-ip',
                'private-endpoints': 'private-endpoint',
                'azure-service-bus': 'service-bus',
                'event-grid-topics': 'event-grid',
                'event-hubs': 'event-hub',
                'logic-apps': 'logic-apps',
                'api-management-services': 'api-management',
                'signalr': 'signalr',
                'notification-hubs': 'notification-hub',
                'azure-devops': 'devops',
                'devops-starter': 'devops',
                'tfs-vc-repository': 'repos',
                'key-vaults': 'key-vault',
                'entra-domain-services': 'active-directory',
                'machine-learning': 'machine-learning',
                'cognitive-services': 'cognitive-services',
                'azure-openai': 'openai',
                'bot-services': 'bot-service',
                'azure-monitors-for-sap-solutions': 'monitor',
                'log-analytics-workspaces': 'log-analytics',
                'application-insights': 'application-insights',
                'static-apps': 'static-web-apps'
            };
            const localName = azureFileMap[name] || name;
            return `icons/azure/${localName}.svg`;
        }

        // その他のアイコンはIconify APIを使用
        // 例: logos:aws-ec2 → https://api.iconify.design/logos/aws-ec2.svg
        return `https://api.iconify.design/${prefix}/${name}.svg`;
    }

    renderVisualIconGrid(search, categoryFilter = '') {
        let html = '';

        this.iconCategories.forEach(cat => {
            if (categoryFilter && cat.id !== categoryFilter) return;

            const filteredIcons = cat.icons.filter(icon => {
                if (!search) return true;
                return icon.id.toLowerCase().includes(search) ||
                       icon.name.toLowerCase().includes(search);
            });

            if (filteredIcons.length === 0) return;

            // カテゴリの互換性バッジ
            const portableBadge = cat.portable
                ? '<span class="badge bg-success ms-2">どこでも</span>'
                : '<span class="badge bg-warning text-dark ms-2">このツールのみ</span>';

            html += `<div class="icon-category mb-4">
                <h6 class="text-muted mb-2 border-bottom pb-1">${cat.name} ${portableBadge}</h6>
                <div class="d-flex flex-wrap gap-2">
                    ${filteredIcons.map(icon => {
                        const svgUrl = this.getIconSvgUrl(icon.id);
                        const iconDisplay = svgUrl
                            ? `<img src="${svgUrl}" alt="${icon.name}" style="width: 32px; height: 32px; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                               <span style="display:none; font-size: 10px; color: #999;">?</span>`
                            : `<i class="bi bi-${icon.id}" style="font-size: 24px;"></i>`;

                        // 非互換アイコンには警告スタイルを追加
                        const itemClass = cat.portable ? 'icon-visual-item' : 'icon-visual-item icon-not-portable';
                        const warningIndicator = cat.portable ? '' : '<span class="icon-warning-badge" title="このツールでのみ表示可能">⚠</span>';

                        return `
                        <div class="${itemClass}" data-icon-id="${icon.id}" title="${icon.id}${cat.portable ? '' : ' (このツールのみ)'}">
                            ${warningIndicator}
                            <div class="icon-preview">
                                ${iconDisplay}
                            </div>
                            <div class="icon-name">${icon.name}</div>
                        </div>`;
                    }).join('')}
                </div>
            </div>`;
        });

        if (!html) {
            html = '<div class="text-center text-muted py-4">該当するアイコンが見つかりません</div>';
        }

        return html;
    }

    renderServiceList() {
        const wrapper = document.createElement('div');

        // サービスリスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.services.length === 0) {
            list.innerHTML = '<div class="item-list-empty">サービスがありません</div>';
        } else {
            this.services.forEach((svc, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content">
                        <span class="badge bg-primary me-2">${svc.id}</span>
                        <span>${svc.label}</span>
                        <small class="text-muted ms-2">[${svc.group}]</small>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-primary edit-svc" data-index="${index}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-svc" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                list.appendChild(itemEl);
            });
        }
        wrapper.appendChild(list);

        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2">
                <div class="col-3">
                    <label class="form-label">ID</label>
                    <input type="text" class="form-control form-control-sm" id="svcId" placeholder="web">
                </div>
                <div class="col-3">
                    <label class="form-label">ラベル</label>
                    <input type="text" class="form-control form-control-sm" id="svcLabel" placeholder="Web Server">
                </div>
                <div class="col-3">
                    <label class="form-label">アイコン</label>
                    <div class="input-group input-group-sm">
                        <input type="text" class="form-control" id="svcIcon" value="server" readonly>
                        <button class="btn btn-outline-secondary" type="button" id="selectSvcIconBtn">
                            <i class="bi bi-grid-3x3-gap"></i>
                        </button>
                    </div>
                </div>
                <div class="col-3">
                    <label class="form-label">グループ</label>
                    <select class="form-select form-select-sm" id="svcGroup">
                        ${this.groups.map(g => `<option value="${g.id}">${g.id}</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addSvcBtn">
                <i class="bi bi-plus"></i> サービスを追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addSvcBtn')?.addEventListener('click', () => this.addService());
            wrapper.querySelector('#selectSvcIconBtn')?.addEventListener('click', () => {
                this.showIconSelectModal((iconId) => {
                    document.getElementById('svcIcon').value = iconId;
                });
            });
            wrapper.querySelectorAll('.edit-svc').forEach(btn => {
                btn.addEventListener('click', (e) => this.editService(parseInt(e.currentTarget.dataset.index)));
            });
            wrapper.querySelectorAll('.delete-svc').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteService(parseInt(e.currentTarget.dataset.index)));
            });

            // ドラッグ＆ドロップ
            let draggedIndex = null;
            wrapper.querySelectorAll('.item-list-item[draggable="true"]').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedIndex = parseInt(item.dataset.index);
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });
                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    wrapper.querySelectorAll('.item-list-item').forEach(el => el.classList.remove('drag-over'));
                });
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        item.classList.add('drag-over');
                    }
                });
                item.addEventListener('dragleave', () => {
                    item.classList.remove('drag-over');
                });
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        this.moveService(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveService(fromIndex, toIndex) {
        const [moved] = this.services.splice(fromIndex, 1);
        this.services.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    editService(index) {
        const svc = this.services[index];

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="bi bi-server"></i> サービス編集</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">ID</label>
                            <input type="text" class="form-control" id="editSvcId" value="${svc.id}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">ラベル</label>
                            <input type="text" class="form-control" id="editSvcLabel" value="${svc.label}">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">アイコン</label>
                            <div class="input-group">
                                <input type="text" class="form-control" id="editSvcIcon" value="${svc.icon}" readonly>
                                <button class="btn btn-outline-secondary" type="button" id="editSelectSvcIconBtn">
                                    <i class="bi bi-grid-3x3-gap"></i> 選択
                                </button>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">グループ</label>
                            <select class="form-select" id="editSvcGroup">
                                ${this.groups.map(g => `<option value="${g.id}" ${svc.group === g.id ? 'selected' : ''}>${g.id} (${g.label})</option>`).join('')}
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">キャンセル</button>
                        <button type="button" class="btn btn-primary" id="saveSvcBtn">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.querySelector('#editSelectSvcIconBtn').addEventListener('click', () => {
            this.showIconSelectModal((iconId) => {
                modal.querySelector('#editSvcIcon').value = iconId;
            });
        });

        modal.querySelector('#saveSvcBtn').addEventListener('click', () => {
            const newId = modal.querySelector('#editSvcId').value.trim();
            const newLabel = modal.querySelector('#editSvcLabel').value.trim();
            const newIcon = modal.querySelector('#editSvcIcon').value;
            const newGroup = modal.querySelector('#editSvcGroup').value;

            if (newId && newId !== svc.id) {
                // IDが変わった場合、接続の参照も更新
                this.connections.forEach(conn => {
                    if (conn.from === svc.id) conn.from = newId;
                    if (conn.to === svc.id) conn.to = newId;
                });
            }

            svc.id = newId || svc.id;
            svc.label = newLabel || svc.label;
            svc.icon = newIcon;
            svc.group = newGroup;

            this.refreshEditor();
            this.onInputChange();
            bsModal.hide();
        });

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }

    renderConnectionList() {
        const wrapper = document.createElement('div');

        // 接続リスト
        const list = document.createElement('div');
        list.className = 'item-list';

        if (this.connections.length === 0) {
            list.innerHTML = '<div class="item-list-empty">接続がありません</div>';
        } else {
            this.connections.forEach((conn, index) => {
                const itemEl = document.createElement('div');
                itemEl.className = 'item-list-item';
                itemEl.draggable = true;
                itemEl.dataset.index = index;
                itemEl.innerHTML = `
                    <div class="drag-handle me-2" title="ドラッグで並び替え">
                        <i class="bi bi-grip-vertical text-muted"></i>
                    </div>
                    <div class="item-content connection-item">
                        <span class="node-badge">${conn.from}</span>
                        <span class="arrow-badge">--></span>
                        <span class="node-badge">${conn.to}</span>
                    </div>
                    <div class="item-actions">
                        <button class="btn btn-sm btn-outline-danger delete-conn" data-index="${index}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                `;
                list.appendChild(itemEl);
            });
        }
        wrapper.appendChild(list);

        const addForm = document.createElement('div');
        addForm.className = 'add-item-form';
        addForm.innerHTML = `
            <div class="row g-2">
                <div class="col-6">
                    <label class="form-label">From</label>
                    <select class="form-select form-select-sm" id="connFrom">
                        ${this.services.map(s => `<option value="${s.id}">${s.id}</option>`).join('')}
                    </select>
                </div>
                <div class="col-6">
                    <label class="form-label">To</label>
                    <select class="form-select form-select-sm" id="connTo">
                        ${this.services.map(s => `<option value="${s.id}">${s.id}</option>`).join('')}
                    </select>
                </div>
            </div>
            <button class="btn btn-primary btn-sm mt-2 btn-add" id="addConnBtn">
                <i class="bi bi-plus"></i> 接続を追加
            </button>
        `;
        wrapper.appendChild(addForm);

        setTimeout(() => {
            wrapper.querySelector('#addConnBtn')?.addEventListener('click', () => this.addConnection());
            wrapper.querySelectorAll('.delete-conn').forEach(btn => {
                btn.addEventListener('click', (e) => this.deleteConnection(parseInt(e.currentTarget.dataset.index)));
            });

            // ドラッグ＆ドロップ
            let draggedIndex = null;
            wrapper.querySelectorAll('.item-list-item[draggable="true"]').forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedIndex = parseInt(item.dataset.index);
                    item.classList.add('dragging');
                    e.dataTransfer.effectAllowed = 'move';
                });
                item.addEventListener('dragend', () => {
                    item.classList.remove('dragging');
                    wrapper.querySelectorAll('.item-list-item').forEach(el => el.classList.remove('drag-over'));
                });
                item.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'move';
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        item.classList.add('drag-over');
                    }
                });
                item.addEventListener('dragleave', () => {
                    item.classList.remove('drag-over');
                });
                item.addEventListener('drop', (e) => {
                    e.preventDefault();
                    const targetIndex = parseInt(item.dataset.index);
                    if (draggedIndex !== null && draggedIndex !== targetIndex) {
                        this.moveConnection(draggedIndex, targetIndex);
                    }
                    draggedIndex = null;
                });
            });
        }, 0);

        return wrapper;
    }

    moveConnection(fromIndex, toIndex) {
        const [moved] = this.connections.splice(fromIndex, 1);
        this.connections.splice(toIndex, 0, moved);
        this.refreshEditor();
        this.onInputChange();
    }

    addGroup() {
        const id = document.getElementById('groupId').value.trim();
        const label = document.getElementById('groupLabel').value.trim() || id;
        const icon = document.getElementById('groupIcon').value;

        if (!id) {
            this.app.showToast('IDを入力してください', 'warning');
            return;
        }

        if (this.groups.some(g => g.id === id)) {
            this.app.showToast('同じIDのグループが既に存在します', 'warning');
            return;
        }

        this.groups.push({ id, label, icon });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('groupId').value = '';
        document.getElementById('groupLabel').value = '';
    }

    deleteGroup(index) {
        const group = this.groups[index];
        // グループに属するサービスも削除
        this.services = this.services.filter(s => s.group !== group.id);
        this.groups.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    addService() {
        const id = document.getElementById('svcId').value.trim();
        const label = document.getElementById('svcLabel').value.trim() || id;
        const icon = document.getElementById('svcIcon').value;
        const group = document.getElementById('svcGroup').value;

        if (!id) {
            this.app.showToast('IDを入力してください', 'warning');
            return;
        }

        if (this.services.some(s => s.id === id)) {
            this.app.showToast('同じIDのサービスが既に存在します', 'warning');
            return;
        }

        this.services.push({ id, label, icon, group });
        this.refreshEditor();
        this.onInputChange();

        document.getElementById('svcId').value = '';
        document.getElementById('svcLabel').value = '';
    }

    deleteService(index) {
        const svc = this.services[index];
        // 関連する接続も削除
        this.connections = this.connections.filter(c => c.from !== svc.id && c.to !== svc.id);
        this.services.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    addConnection() {
        const from = document.getElementById('connFrom').value;
        const to = document.getElementById('connTo').value;

        if (from === to) {
            this.app.showToast('同じサービスへの接続はできません', 'warning');
            return;
        }

        this.connections.push({ from, to, direction: 'LR' });
        this.refreshEditor();
        this.onInputChange();
    }

    deleteConnection(index) {
        this.connections.splice(index, 1);
        this.refreshEditor();
        this.onInputChange();
    }

    refreshEditor() {
        const container = document.getElementById('editorContainer');
        container.innerHTML = '';
        container.appendChild(this.render());
    }

    generateCode() {
        let lines = ['architecture-beta'];

        // グループ定義
        this.groups.forEach(group => {
            lines.push(`group ${group.id}(${group.icon})[${group.label}]`);
        });

        // サービス定義
        this.services.forEach(svc => {
            lines.push(`service ${svc.id}(${svc.icon})[${svc.label}] in ${svc.group}`);
        });

        // 接続定義
        this.connections.forEach(conn => {
            lines.push(`${conn.from}:R --> L:${conn.to}`);
        });

        return lines.join('\n');
    }

    loadTemplate(templateId) {
        switch (templateId) {
            case 'simple':
                this.groups = [
                    { id: 'cloud', label: 'Cloud', icon: 'cloud' }
                ];
                this.services = [
                    { id: 'web', label: 'Web', icon: 'server', group: 'cloud' },
                    { id: 'db', label: 'DB', icon: 'database', group: 'cloud' }
                ];
                this.connections = [
                    { from: 'web', to: 'db', direction: 'LR' }
                ];
                break;

            case 'threetiered':
                this.groups = [
                    { id: 'frontend', label: 'Frontend', icon: 'cloud' },
                    { id: 'backend', label: 'Backend', icon: 'cloud' },
                    { id: 'data', label: 'Data Layer', icon: 'cloud' }
                ];
                this.services = [
                    { id: 'web', label: 'Web App', icon: 'server', group: 'frontend' },
                    { id: 'api', label: 'API Server', icon: 'server', group: 'backend' },
                    { id: 'db', label: 'Database', icon: 'database', group: 'data' },
                    { id: 'cache', label: 'Cache', icon: 'disk', group: 'data' }
                ];
                this.connections = [
                    { from: 'web', to: 'api', direction: 'LR' },
                    { from: 'api', to: 'db', direction: 'LR' },
                    { from: 'api', to: 'cache', direction: 'LR' }
                ];
                break;

            case 'microservices':
                this.groups = [
                    { id: 'gateway', label: 'Gateway', icon: 'cloud' },
                    { id: 'services', label: 'Services', icon: 'cloud' },
                    { id: 'storage', label: 'Storage', icon: 'cloud' }
                ];
                this.services = [
                    { id: 'lb', label: 'Load Balancer', icon: 'internet', group: 'gateway' },
                    { id: 'auth', label: 'Auth Service', icon: 'server', group: 'services' },
                    { id: 'user', label: 'User Service', icon: 'server', group: 'services' },
                    { id: 'order', label: 'Order Service', icon: 'server', group: 'services' },
                    { id: 'userdb', label: 'User DB', icon: 'database', group: 'storage' },
                    { id: 'orderdb', label: 'Order DB', icon: 'database', group: 'storage' }
                ];
                this.connections = [
                    { from: 'lb', to: 'auth', direction: 'LR' },
                    { from: 'lb', to: 'user', direction: 'LR' },
                    { from: 'lb', to: 'order', direction: 'LR' },
                    { from: 'user', to: 'userdb', direction: 'LR' },
                    { from: 'order', to: 'orderdb', direction: 'LR' }
                ];
                break;

            case 'aws-web':
                this.groups = [
                    { id: 'network', label: 'Network', icon: 'logos:aws' },
                    { id: 'compute', label: 'Compute', icon: 'logos:aws-ec2' },
                    { id: 'data', label: 'Data', icon: 'logos:aws-rds' }
                ];
                this.services = [
                    { id: 'cf', label: 'CloudFront', icon: 'logos:aws-cloudfront', group: 'network' },
                    { id: 'alb', label: 'ALB', icon: 'internet', group: 'network' },
                    { id: 'ec2', label: 'EC2', icon: 'logos:aws-ec2', group: 'compute' },
                    { id: 'lambda', label: 'Lambda', icon: 'logos:aws-lambda', group: 'compute' },
                    { id: 'rds', label: 'RDS', icon: 'logos:aws-rds', group: 'data' },
                    { id: 's3', label: 'S3', icon: 'logos:aws-s3', group: 'data' }
                ];
                this.connections = [
                    { from: 'cf', to: 'alb', direction: 'LR' },
                    { from: 'alb', to: 'ec2', direction: 'LR' },
                    { from: 'ec2', to: 'rds', direction: 'LR' },
                    { from: 'lambda', to: 's3', direction: 'LR' }
                ];
                break;

            case 'azure-web':
                this.groups = [
                    { id: 'network', label: 'Network', icon: 'azure:virtual-network' },
                    { id: 'compute', label: 'Compute', icon: 'azure:app-service' },
                    { id: 'data', label: 'Data', icon: 'azure:storage-accounts' }
                ];
                this.services = [
                    { id: 'agw', label: 'App Gateway', icon: 'azure:application-gateway', group: 'network' },
                    { id: 'vm', label: 'Virtual Machine', icon: 'azure:virtual-machine', group: 'compute' },
                    { id: 'func', label: 'Functions', icon: 'azure:function-apps', group: 'compute' },
                    { id: 'storage', label: 'Storage', icon: 'azure:storage-accounts', group: 'data' },
                    { id: 'sql', label: 'SQL Database', icon: 'azure:sql-database', group: 'data' },
                    { id: 'cosmos', label: 'Cosmos DB', icon: 'azure:cosmos-db', group: 'data' }
                ];
                this.connections = [
                    { from: 'agw', to: 'vm', direction: 'LR' },
                    { from: 'vm', to: 'sql', direction: 'LR' },
                    { from: 'func', to: 'storage', direction: 'LR' },
                    { from: 'func', to: 'cosmos', direction: 'LR' }
                ];
                break;
        }

        this.refreshEditor();
    }
}

window.ArchitectureEditor = ArchitectureEditor;
