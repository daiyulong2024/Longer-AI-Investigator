# Longer AI Investigator

This is a pure frontend implementation of the Longer AI Investigator platform.

## Features
- **Project Dashboard**: Manage your experiments.
- **Experiment Design**: configure persona, scenario, questions, and parameters (Instance count, Parallelism).
- **Real-time Monitoring**: Watch the simulation progress with live agent logs.
- **Professional Reports**: View statistical breakdown, charts, and detailed agent reasoning logs.

## Setup
1. Simply open `frontend/index.html` in your browser.
2. No backend is required. All data is stored in your browser's LocalStorage.

## Logic
The simulation uses a mocked "AI" engine in `js/app.js` to simulate network latency and agent decision making based on your configured persona.
- **Parallel Mode**: Batches requests to simulate concurrent processing.
- **Data Persistence**: Your experiments are saved locally and persist across reloads.
