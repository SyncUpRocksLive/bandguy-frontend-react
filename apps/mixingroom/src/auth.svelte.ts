// src/auth.svelte.ts
class AuthService {
	// Use $state so the UI can react to login changes
	isAuthenticated = $state<boolean | null>(null); // null = "checking", true, or false
	user = $state<any>(null);

	private intervalId: number | null = null;

	constructor() {
		this.checkStatus();
		this.startPolling();
	}

	async checkStatus() {
		try {
			const res = await fetch('/api/user/loggedin');
			const data = await res.json();

			// Update state
			this.isAuthenticated = !!data.loggedIn;
			this.user = data.user || null;

			// If we were logged in and now we aren't, handle it
			if (this.isAuthenticated === false) {
				this.stopPolling();
			}
		} catch (err) {
			this.isAuthenticated = false;
		}
	}

	startPolling() {
		if (this.intervalId) return;
		// Check every 5 minutes (300,000 ms)
		this.intervalId = window.setInterval(() => this.checkStatus(), 300_000);
	}

	stopPolling() {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	login() {
		// Standard OIDC redirect
		window.location.href = '/api/auth/login';
	}
}

export const auth = new AuthService();
