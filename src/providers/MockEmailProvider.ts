export interface EmailProvider {
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  }
  
  export class MockEmailProviderA implements EmailProvider {
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
      return Math.random() > 0.5;
    }
  }
  
  export class MockEmailProviderB implements EmailProvider {
    async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
      return Math.random() > 0.3;
    }
  }
  