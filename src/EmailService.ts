import { EmailProvider, MockEmailProviderA, MockEmailProviderB } from './providers/MockEmailProvider';
import { exponentialBackoff } from './utils/ExponentialBackoff';
import { RateLimiter } from './utils/RateLimiter';

interface EmailStatus {
  id: string;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
}

export class EmailService {
  private providers: EmailProvider[];
  private rateLimiter: RateLimiter;
  private statuses: Map<string, EmailStatus>;

  constructor() {
    this.providers = [new MockEmailProviderA(), new MockEmailProviderB()];
    this.rateLimiter = new RateLimiter(10); // Limit to 10 emails per second
    this.statuses = new Map();
  }

  async sendEmail(id: string, to: string, subject: string, body: string): Promise<EmailStatus> {
    if (this.statuses.has(id)) {
      return this.statuses.get(id)!; // Idempotency check
    }

    const status: EmailStatus = { id, status: 'pending', attempts: 0 };
    this.statuses.set(id, status);

    for (let provider of this.providers) {
      if (await this.trySendWithProvider(provider, status, to, subject, body)) {
        status.status = 'sent';
        return status;
      }
    }

    status.status = 'failed';
    return status;
  }

  private async trySendWithProvider(provider: EmailProvider, status: EmailStatus, to: string, subject: string, body: string): Promise<boolean> {
    let attempt = 0;
    while (attempt < 3) { // Retry up to 3 times
      if (!this.rateLimiter.canSend()) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      this.rateLimiter.increment();

      try {
        attempt++;
        status.attempts = attempt;
        const success = await provider.sendEmail(to, subject, body);
        if (success) return true;
        await exponentialBackoff(attempt);
      } catch (error) {
        await exponentialBackoff(attempt);
      }
    }
    return false;
  }
}
