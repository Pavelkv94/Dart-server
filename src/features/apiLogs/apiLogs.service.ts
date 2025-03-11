import { injectable } from "inversify";
import { ApiLogsRepository } from "./apiLogs.repository";
import { ApiLogInputModel } from "./models/apiLog.model";
import { RateLimitOptionsModel } from "./models/rateLimitOptions.model";

@injectable()
export class ApiLogsService {
  constructor(private apiLogsRepository: ApiLogsRepository) {}

  async saveLog(log: ApiLogInputModel): Promise<void> {
    await this.apiLogsRepository.save(log);
  }
  async checkRateLimit(options: RateLimitOptionsModel): Promise<boolean> {
    const isAllowed = await this.apiLogsRepository.checkRateLimit(options);
    return isAllowed;
  }
}
