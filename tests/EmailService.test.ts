import { EmailService } from '../src/EmailService';

describe('EmailService', () => {
  let emailService: EmailService;

  beforeEach(() => {
    emailService = new EmailService();
  });

  test('should send an email successfully', async () => {
    const status = await emailService.sendEmail('1', 'test@example.com', 'Test Subject', 'Test Body');
    expect(status.status).toBe('sent');
    expect(status.attempts).toBeGreaterThan(0);
  });

  test('should retry and fallback on failure', async () => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0.9); // Force failure for MockEmailProviderA
    const status = await emailService.sendEmail('2', 'test@example.com', 'Test Subject', 'Test Body');
    expect(status.status).toBe('sent');
    expect(status.attempts).toBeGreaterThan(0);
  });

  test('should respect rate limits', async () => {
    jest.useFakeTimers();
    const statuses = await Promise.all([
      emailService.sendEmail('3', 'test@example.com', 'Test Subject', 'Test Body'),
      emailService.sendEmail('4', 'test@example.com', 'Test Subject', 'Test Body')
    ]);
    expect(statuses[0].status).toBe('sent');
    expect(statuses[1].status).toBe('sent');
    jest.useRealTimers();
  });
});
