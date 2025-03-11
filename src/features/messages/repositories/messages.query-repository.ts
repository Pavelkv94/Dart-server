import { injectable } from "inversify";
import { db } from "../../../db/database";
import { int } from "neo4j-driver";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../../../db/database.labels";

@injectable()
export class MessagesQueryRepository {
  async getAllMessages() {
    const messages = await db.findNodes("MATCH (n:MESSAGE) RETURN n", {});

    return Promise.all(messages.map(async (message) => {
      const user = await db.findNodes(`MATCH (u:USER) WHERE u.id = $user_id RETURN u`, {
        user_id: message.n.user_id,
      });
      return {
        ...message.n,
        user: { photo: user[0].u.photo, first_name: user[0].u.first_name, last_name: user[0].u.last_name },
      };
    }));
  }
}
