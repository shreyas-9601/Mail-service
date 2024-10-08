# Resilient Email Sending Service

## Overview

This service provides a robust mechanism for sending emails using mock providers, with features like retry logic, provider fallback, idempotency, rate limiting, and status tracking.

## Features

- **Retry Mechanism:** Exponential backoff for retrying failed attempts.
- **Provider Fallback:** Switch between providers upon failure.
- **Idempotency:** Prevents duplicate sends with unique email IDs.
- **Rate Limiting:** Limits the number of emails sent per second.
- **Status Tracking:** Tracks the status of each email attempt.
- **Bonus Features:** Circuit breaker pattern, simple logging, and a basic queue system.

## Setup Instructions

1. Clone the repository.
2. Install dependencies: `npm install`
3. Run the tests: `npm test`

## Assumptions

- The service uses mock providers that randomly succeed or fail to simulate real-world conditions.
- Rate limiting is set to 10 emails per second.
- The circuit breaker opens after 3 consecutive failures and resets after 10 seconds.

## Usage

To use the `EmailService`, create an instance and call `sendEmail` with the necessary parameters:

```typescript
const emailService = new EmailService();
emailService.sendEmail('1', 'recipient@example.com', 'Subject', 'Body');
