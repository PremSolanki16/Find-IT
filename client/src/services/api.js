// Future-ready API layer
// Simulates asynchronous REST responses while using mock data.
// When backend is ready, replace simulated storage with axios/fetch calls to '/api/...'.

export const simulateDelay = (ms = 150) => new Promise(resolve => setTimeout(resolve, ms));

