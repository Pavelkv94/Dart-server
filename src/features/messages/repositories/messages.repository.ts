import { injectable } from "inversify";
import { db } from "../../../db/database";
import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "../../../db/database.labels";
import { MessageType } from "./dto";

@injectable()
export class MessagesRepository {
  async saveMessage(message: MessageType) {
    const messages = await db.createNode(DatabaseAvailableLabels.MESSAGE, message);

    db.connectNodes({
      label1: DatabaseAvailableLabels.USER,
      label2: DatabaseAvailableLabels.MESSAGE,
      property1: "id",
      value1: message.user_id,
      property2: "id",
      value2: message.id,
      relation: DatabaseAvailableRelations.USER_MESSAGE,
    });
    
    return messages;
  }
}
