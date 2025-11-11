// vudu OS Core Functionality
class VuduOS {
    constructor() {
        this.workerUrl = 'https://vudu-api.your-subdomain.workers.dev'; // Replace with your actual Worker URL
        this.init();
    }

    async init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 60000);
        
        await this.checkAPIStatus();
        this.setupEventListeners();
    }

    updateClock() {
        const now = new Date();
        document.getElementById('clock').textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', minute: '2-digit' 
        });
    }

    async checkAPIStatus() {
        const statusElement = document.getElementById('api-status');
        try {
            const response = await fetch(`${this.workerUrl}/`);
            if (response.ok) {
                const data = await response.json();
                statusElement.textContent = `Connected (${data.status})`;
                statusElement.style.color = 'lightgreen';
            } else {
                throw new Error('API response not OK');
            }
        } catch (error) {
            console.error('API connection failed:', error);
            statusElement.textContent = 'Disconnected';
            statusElement.style.color = 'lightcoral';
        }
    }

    setupEventListeners() {
        // Start button functionality
        document.getElementById('start-button').addEventListener('click', () => {
            this.toggleStartMenu();
        });
    }

    toggleStartMenu() {
        alert('vudu OS Start Menu would appear here.');
    }
}

// Initialize vudu OS when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VuduOS();
});