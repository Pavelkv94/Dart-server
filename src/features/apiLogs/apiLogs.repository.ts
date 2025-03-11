import { injectable } from "inversify";
import { ApiLogInputModel } from "./models/apiLog.model";
import { RateLimitOptionsModel } from "./models/rateLimitOptions.model";
import { db } from "../../db/database";
import { DatabaseAvailableLabels } from "../../db/database.labels";

@injectable()
export class ApiLogsRepository {
  async save(log: ApiLogInputModel): Promise<void> {
    await db.createNode(DatabaseAvailableLabels.API_LOG, log);
  }
  async checkRateLimit(options: RateLimitOptionsModel): Promise<boolean> {
    const timeLimit = new Date().getTime() - options.rate * 1000;
    const result = await db.findNodes("MATCH (n:API_LOG) WHERE n.URL = $URL AND n.ip = $ip AND n.date > $timeLimit RETURN n", {
      URL: options.baseUrl,
      ip: options.ip,
      timeLimit: timeLimit,
    });

    //* delete logs older than timeLimit
    await db.findNodes("MATCH (n:API_LOG) WHERE n.URL = $URL AND n.ip = $ip AND n.date < $timeLimit DELETE n", {
      URL: options.baseUrl,
      ip: options.ip,
      timeLimit: timeLimit,
    });

    return result.length < options.limit + 1; // + current
  }
}
