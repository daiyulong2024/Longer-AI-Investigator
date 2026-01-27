/**
 * Longer AI Investigator - 核心逻辑
 */

const STORAGE_KEY = 'longer_ai_experiments';
const CURRENT_EXP_KEY = 'longer_ai_current_exp_id';

// --- 状态管理 ---

function getExperiments() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
}

function saveExperiments(experiments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(experiments));
}

function getExperiment(id) {
    const exps = getExperiments();
    return exps.find(e => e.id === id);
}

function  saveExperiment(experiment) {
    const exps = getExperiments();
    const index = exps.findIndex(e => e.id === experiment.id);
    if (index >= 0) {
        exps[index] = experiment;
    } else {
        exps.push(experiment);
    }
    saveExperiments(exps);
}

function deleteExperiment(id) {
    let exps = getExperiments();
    exps = exps.filter(e => e.id !== id);
    saveExperiments(exps);
}

function exportExperiment(id) {
    const exp = getExperiment(id);
    if (!exp) return;
    
    // CSV 头部
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "AgentID,Persona,Option,Reasoning,Time(ms),Timestamp\n";
    
    // 数据行
    if (exp.logs && exp.logs.length > 0) {
        exp.logs.forEach(log => {
            // 转义 reasoning 中的特殊字符 (逗号, 引号, 换行符)
            const safeReasoning = `"${(log.reasoning || '').replace(/"/g, '""')}"`;
            const row = `${log.agentId},${exp.config.personaName},${log.option},${safeReasoning},${log.time},${log.timestamp}`;
            csvContent += row + "\n";
        });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `experiment_${exp.config.experimentName || id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function markExperimentViewed(id) {
    const exps = getExperiments();
    const exp = exps.find(e => e.id === id);
    if (exp) {
        exp.viewed = true;
        saveExperiments(exps);
    }
}

function createExperiment(config) {
    const id = 'EXP-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    const experiment = {
        id: id,
        config: config,
        status: 'draft', // draft (草稿), running (运行中), completed (已完成)
        createdAt: new Date().toISOString(),
        logs: [], // 日志列表: { agentId, option, reasoning, time, timestamp }
        stats: {
            total: 0,
            options: {}, // 选项统计: { 'A': count, 'B': count ... }
            times: []
        }
    };
    saveExperiment(experiment);
    return id;
}

// --- 模拟逻辑 ---

async function runSimulation(experimentId, onProgress, onComplete) {
    const experiment = getExperiment(experimentId);
    if (!experiment) return;

    experiment.status = 'running';
    saveExperiment(experiment);
    
    const config = experiment.config;
    const totalAgents = parseInt(config.instanceCount) || 10;
    // 处理新的并发限制配置，或回退到旧的并行逻辑
    let batchSize = 1;
    if (config.concurrentLimit) {
        batchSize = parseInt(config.concurrentLimit);
    } else if (config.isParallel) {
        batchSize = 10; // 旧版实验的默认值
    }
    if (batchSize < 1) batchSize = 1;
    
    // 如果为空则初始化统计数据
    experiment.stats = { total: 0, options: {}, times: [] };
    experiment.logs = [];

    // 模拟 API 调用延迟和响应
    // 真实 API 配置
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
        alert("请先配置 API 密钥！\n请前往 'API 密钥' 页面进行设置。");
        return;
    }

    const baseUrl = localStorage.getItem('openai_base_url') || 'https://api.openai.com/v1';
    const model = localStorage.getItem('openai_model') || 'gpt-3.5-turbo';

    const processAgent = async (index) => {
        const agentId = `AG-${Math.floor(Math.random()*9000)+1000}-${String.fromCharCode(65 + Math.floor(Math.random()*26))}`;
        
        // 1. 准备数据
        const options = config.options || [];
        const optionKeys = options.map(o => o.key);
        let selectedKey = optionKeys[Math.floor(Math.random() * optionKeys.length)];
        let reasoning = "";
        let delay = Math.floor(Math.random() * 2000) + 500;

        // 2. 决策：使用真实 API vs 模拟
        if (apiKey) {
            try {
                // 构建提示词
                const systemPrompt = `You are a participant in a social experiment. You need to act according to your persona and make a choice.
Persona: ${config.personaName || 'Unknown'}
Background: ${config.backgroundStory || 'None'}
Behavior Logic: ${config.behaviorLogic || 'Rational'}
 IMPORTANT: Output must be in valid JSON format: {"option": "KEY", "reasoning": "Reasoning in Chinese"}. Do not use markdown code blocks (e.g. \`\`\`json). Output raw JSON only.`;

                const userPrompt = `Scenario: ${config.scenarioDescription}
Question: ${config.coreQuestion}
Options:
${options.map(o => `${o.key}: ${o.text}`).join('\n')}

Please make a choice. Output ONLY raw JSON, no markdown formatting.`;

                const start = Date.now();
                const response = await fetch(`${baseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {role: "system", content: systemPrompt},
                            {role: "user", content: userPrompt}
                        ],
                        temperature: 0.7,
                        response_format: { type: "json_object" }
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const content = data.choices[0].message.content;
                    delay = Date.now() - start;
                    
                    try {
                        const parsed = JSON.parse(content);
                        if (parsed.option && optionKeys.includes(parsed.option)) {
                            selectedKey = parsed.option;
                        }
                        reasoning = parsed.reasoning || content;
                    } catch (e) {
                        // 如果不是 JSON 则降级处理
                         reasoning = content;
                         // 尝试在内容中查找选项键
                         const foundKey = optionKeys.find(k => content.includes(k));
                         if(foundKey) selectedKey = foundKey;
                    }
                } else {
                    console.error("API Error", response.status);
                    reasoning = `(API Error: ${response.status}) 使用模拟数据`;
                    // 降级到下方的模拟逻辑...
                }
            } catch (e) {
                console.error("Network Error", e);
                reasoning = `(Network Error) 使用模拟数据`;
            }
        }

        // 3. 降级 / 模拟逻辑 (如果 reasoning 仍为空)
        if (!reasoning) {
            await new Promise(r => setTimeout(r, delay));
            
            // 基于角色设定偏向随机选择
            const personaLower = (config.personaName || "").toLowerCase();
            if ((personaLower.includes('student') || personaLower.includes('中学生')) && optionKeys.includes('C')) {
                 if (Math.random() > 0.3) selectedKey = 'C';
            }

            const reasoningTemplates = [
                "基于当前情况，这似乎是最安全的选择。",
                "考虑到长期后果，我倾向于这个选项。",
                "我的情绪状态表明这是最令人舒适的选择。",
                "逻辑分析表明这是最优路径。",
                "我选择跟随大众的趋势。"
            ];
            reasoning = reasoningTemplates[Math.floor(Math.random() * reasoningTemplates.length)];
        }

        // 记录结果
        const log = {
            agentId,
            option: selectedKey,
            reasoning,
            time: delay,
            timestamp: new Date().toISOString()
        };

        // 更新本地统计状态
        experiment.logs.push(log);
        experiment.stats.total++;
        experiment.stats.options[selectedKey] = (experiment.stats.options[selectedKey] || 0) + 1;
        experiment.stats.times.push(delay);
        
        // 进度回调
        if (onProgress) onProgress(experiment);
    };

    if (batchSize > 1) {
        // 分批运行以避免浏览器冻结（如果数量过多）
        for (let i = 0; i < totalAgents; i += batchSize) {
            const batch = [];
            for (let j = 0; j < batchSize && (i + j) < totalAgents; j++) {
                batch.push(processAgent(i + j));
            }
            await Promise.all(batch);
            saveExperiment(experiment); // 保存中间状态
        }
    } else {
        // 串行执行
        for (let i = 0; i < totalAgents; i++) {
            await processAgent(i);
            if (i % 5 === 0) saveExperiment(experiment);
        }
    }

    experiment.status = 'completed';
    experiment.completedAt = new Date().toISOString();
    saveExperiment(experiment);
    if (onComplete) onComplete(experiment);
}

// --- UI 辅助函数 ---

function formatTime(ms) {
    return ms + 'ms';
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 注意: 真实的 OpenAI 集成将在此处。
// 目前我们进行模拟以确保 UI 完美工作（按“前端代码”要求）。
// 若要添加真实 API，我们将把 `processAgent` 逻辑替换为对 https://api.openai.com/v1/chat/completions 的 fetch 调用
