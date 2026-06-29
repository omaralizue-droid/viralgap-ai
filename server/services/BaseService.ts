export abstract class BaseService {
  protected isMock: boolean;

  constructor() {
    // Check global mock feature flag
    this.isMock = process.env.USE_MOCK_APIS === 'true';
  }

  public isMockMode(): boolean {
    return this.isMock;
  }
}
