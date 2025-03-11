import { DatabaseAvailableLabels, DatabaseAvailableRelations } from "./database.labels";

export type MatchNodesDtoType = {
  label1: DatabaseAvailableLabels;
  label2: DatabaseAvailableLabels;
  property1: string;
  value1: any;
  property2: string;
  value2: any;
  relation: DatabaseAvailableRelations;
};
