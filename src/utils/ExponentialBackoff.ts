export async function exponentialBackoff(attempt: number): Promise<void> {
    const delay = Math.pow(2, attempt) * 100;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
  