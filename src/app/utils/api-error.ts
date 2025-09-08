export class PoetryApiError extends Error {
  constructor(
    public status: number,
    public endpoint: string,
    message: string
  ) {
    super(`API Error ${status}: ${message} (Endpoint: ${endpoint})`);
    this.name = 'PoetryApiError';
  }
}
