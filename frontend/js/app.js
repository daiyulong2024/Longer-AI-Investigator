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
    const isParallel = config.isParallel;
    
    // Initialize stats if empty
    experiment.stats = { total: 0, options: {}, times: [] };
    experiment.logs = [];

    // Mock API Call delay and response
    const processAgent = async (index) => {
        const agentId = `AG-${Math.floor(Math.random()*9000)+1000}-${String.fromCharCode(65 + Math.floor(Math.random()*26))}`;
        
        // Simulate network delay
        const delay = Math.floor(Math.random() * 2000) + 500; // 500ms to 2.5s
        await new Promise(r => setTimeout(r, delay));

        // Mock Decision Logic based on Persona
        // In a real app, this would call OpenAI API
        const options = config.options || [];
        // Extract option keys (A, B, C...)
        const optionKeys = options.map(o => o.key);
        
        // Bias random selection based on persona (simple keyword matching mock)
        let selectedKey = optionKeys[Math.floor(Math.random() * optionKeys.length)];
        
        // Simple logic to make it look "Assistant-like"
        // If persona mentions "rational", maybe pick B (assuming B is rational) - just random for now but reproducible
        const personaLower = (config.personaName || "").toLowerCase();
        if (personaLower.includes('student') || personaLower.includes('中学生')) {
            // Students might choose "peers" (C often in our design example)
            if (optionKeys.includes('C') && Math.random() > 0.3) selectedKey = 'C';
        }
        
        const reasoningTemplates = [
            "Based on the current situation, this seems like the safest bet.",
            "Considering the long-term consequences, I opt for this.",
            "My emotional state suggests this is the most comforting choice.",
            "Logic dictates this is the optimal path.",
            "I am following the crowd here."
        ];
        const reasoning = reasoningTemplates[Math.floor(Math.random() * reasoningTemplates.length)];

        // Record Result
        const log = {
            agentId,
            option: selectedKey,
            reasoning,
            time: delay,
            timestamp: new Date().toISOString()
        };

        // Update local stat state (not saving to disk every time for performance, but here we Mock)
        experiment.logs.push(log);
        experiment.stats.total++;
        experiment.stats.options[selectedKey] = (experiment.stats.options[selectedKey] || 0) + 1;
        experiment.stats.times.push(delay);
        
        // Progress callback
        if (onProgress) onProgress(experiment);
    };

    if (isParallel) {
        // Run in batches to avoid browser freeze if too many
        const batchSize = 10;
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
