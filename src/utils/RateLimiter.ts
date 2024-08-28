export class RateLimiter {
    private maxRequests: number;
    private requests: number[];
    
    constructor(maxRequests: number) {
      this.maxRequests = maxRequests;
      this.requests = [];
    }
  
    canSend(): boolean {
      const now = Date.now();
      this.requests = this.requests.filter(time => now - time < 1000);
      return this.requests.length < this.maxRequests;
    }
  
    increment() {
      this.requests.push(Date.now());
    }
  }
  