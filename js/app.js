/**
 * Longer AI Investigator - Core Logic
 */

const STORAGE_KEY = 'longer_ai_experiments';
const CURRENT_EXP_KEY = 'longer_ai_current_exp_id';

// --- State Management ---

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
    
    // CSV Header
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "AgentID,Persona,Option,Reasoning,Time(ms),Timestamp\n";
    
    // Rows
    if (exp.logs && exp.logs.length > 0) {
        exp.logs.forEach(log => {
            // Escape special chars in reasoning (commas, quotes, newlines)
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
        status: 'draft', // draft, running, completed
        createdAt: new Date().toISOString(),
        logs: [], // { agentId, option, reasoning, time, timestamp }
        stats: {
            total: 0,
            options: {}, // { 'A': count, 'B': count ... }
            times: []
        }
    };
    saveExperiment(experiment);
    return id;
}

// --- Simulation Logic ---

async function runSimulation(experimentId, onProgress, onComplete) {
    const experiment = getExperiment(experimentId);
    if (!experiment) return;

    experiment.status = 'running';
    saveExperiment(experiment);
    
    const config = experiment.config;
    const totalAgents = parseInt(config.instanceCount) || 10;
    // Handle new concurrentLimit or fallback to old isParallel logic
    let batchSize = 1;
    if (config.concurrentLimit) {
        batchSize = parseInt(config.concurrentLimit);
    } else if (config.isParallel) {
        batchSize = 10; // Default for old experiments
    }
    if (batchSize < 1) batchSize = 1;
    
    // Initialize stats if empty
    experiment.stats = { total: 0, options: {}, times: [] };
    experiment.logs = [];

    // Mock API Call delay and response
    // Real API Configuration
    const apiKey = localStorage.getItem('openai_api_key');
    
    if (!apiKey) {
        alert("请先配置 API 密钥！\n请前往 'API 密钥' 页面进行设置。");
        return;
    }

    const baseUrl = localStorage.getItem('openai_base_url') || 'https://api.openai.com/v1';
    const model = localStorage.getItem('openai_model') || 'gpt-3.5-turbo';

    const processAgent = async (index) => {
        const agentId = `AG-${Math.floor(Math.random()*9000)+1000}-${String.fromCharCode(65 + Math.floor(Math.random()*26))}`;
        
        // 1. Prepare Data
        const options = config.options || [];
        const optionKeys = options.map(o => o.key);
        let selectedKey = optionKeys[Math.floor(Math.random() * optionKeys.length)];
        let reasoning = "";
        let delay = Math.floor(Math.random() * 2000) + 500;

        // 2. Decide: Real API vs Mock
        if (apiKey) {
            try {
                // Construct Prompt
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
                         // Fallback if not JSON
                         reasoning = content;
                         // Try to find option key in content
                         const foundKey = optionKeys.find(k => content.includes(k));
                         if(foundKey) selectedKey = foundKey;
                    }
                } else {
                    console.error("API Error", response.status);
                    reasoning = `(API Error: ${response.status}) 使用模拟数据`;
                    // Fallback to mock logic below...
                }
            } catch (e) {
                console.error("Network Error", e);
                reasoning = `(Network Error) 使用模拟数据`;
            }
        }

        // 3. Fallback / Mock Logic (if reasoning still empty)
        if (!reasoning) {
            await new Promise(r => setTimeout(r, delay));
            
            // Bias random selection based on persona
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

        // Record Result
        const log = {
            agentId,
            option: selectedKey,
            reasoning,
            time: delay,
            timestamp: new Date().toISOString()
        };

        // Update local stat state
        experiment.logs.push(log);
        experiment.stats.total++;
        experiment.stats.options[selectedKey] = (experiment.stats.options[selectedKey] || 0) + 1;
        experiment.stats.times.push(delay);
        
        // Progress callback
        if (onProgress) onProgress(experiment);
    };

    if (batchSize > 1) {
        // Run in batches to avoid browser freeze if too many
        for (let i = 0; i < totalAgents; i += batchSize) {
            const batch = [];
            for (let j = 0; j < batchSize && (i + j) < totalAgents; j++) {
                batch.push(processAgent(i + j));
            }
            await Promise.all(batch);
            saveExperiment(experiment); // Save intermediate
        }
    } else {
        // Sequential
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

// --- UI Helpers ---

function formatTime(ms) {
    return ms + 'ms';
}

function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Note: Real OpenAI integration would go here.
// For now, we simulate to ensure the UI works perfectly as requested "Frontend code".
// To add Real API, we would replace `processAgent` logic with a fetch to https://api.openai.com/v1/chat/completions
