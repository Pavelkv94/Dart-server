import neo4j, { Driver, Session } from "neo4j-driver";
import { DatabaseAvailableLabels } from "./database.labels";
import { MatchNodesDtoType } from "./db.types";

export class Database {
  private driver: Driver | null = null;
  private session: Session | null = null;

  constructor() {}

  static createDbInstance() {
    const db = new this();
    return db;
  }
  async connect(url: string, user: string, password: string): Promise<void> {
    if (this.driver) {
      console.warn("Database connection is already established.");
      return;
    }

    try {
      this.driver = neo4j.driver(url, neo4j.auth.basic(user, password));
      console.log("Connected to the database successfully.");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw new Error("Failed to establish a connection with the database.");
    }
  }

  async disconnect(): Promise<void> {
    if (this.session) {
      await this.session.close();
      this.session = null;
    }
    if (this.driver) {
      await this.driver.close();
      this.driver = null;
    }
    console.log("Disconnected from the database.");
  }

  private getSession(): Session {
    if (!this.driver) {
      throw new Error("Database connection is not established. Call connect() first.");
    }
    return this.driver.session();
  }

  async findNode(query: string, params: Record<string, any>) {
    const session = this.getSession();
    try {
      // const query = `MATCH (n:${label} WHERE n.email = $loginOrEmail OR n.login = $loginOrEmail RETURN n`;
      const result = await session.run(query, params);

      if (result.records.length === 0) {
        return null; // Return null if no node is found
      }
      
      const createdNode = result.records[0].get("n");

      return createdNode.properties;
    } catch (error: any) {
      console.error("Error find node:", error);
      throw new Error(`Failed to find node: ${error.message}`);
    } finally {
      await session.close();
    }
  }

  async createNode(label: DatabaseAvailableLabels, params: Record<string, any>): Promise<any> {
    const session = this.getSession();
    try {
      const query = `CREATE (n:${label} $params) RETURN n`;
      const result = await session.run(query, { params });
      const createdNode = result.records[0].get("n");

      return createdNode.properties;
    } catch (error: any) {
      console.error("Error creating node:", error);
      throw new Error(`Failed to create node: ${error.message}`);
    } finally {
      await session.close();
    }
  }

  async matchNodes(matchDto: MatchNodesDtoType) {
    const session = this.getSession();
    try {
      // Cypher query to match two nodes based on their properties and create a relationship
      const query = `
        MERGE (n1:${matchDto.label1} {${matchDto.property1}: $value1})
        MERGE (n2:${matchDto.label2} {${matchDto.property2}: $value2})
        MERGE (n1)-[:${matchDto.relation}]->(n2)
        RETURN n1, n2
      `;

      // Run the query with parameters
      const result = await session.run(query, {
        value1: matchDto.value1,
        value2: matchDto.value2,
      });

      // Check if matching nodes were found
      if (result.records.length === 0) {
        throw new Error("No matching entities found.");
      }

      // Extract the matched nodes from the result
      const matchedEntities = result.records.map((record) => ({
        entity1: record.get("n1").properties,
        entity2: record.get("n2").properties,
      }));

      return matchedEntities;
    } catch (error: any) {
      console.error("Error matching entities:", error);
      throw new Error(`Failed to match entities: ${error.message}`);
    } finally {
      await session.close();
    }
  }

  async dropDatabase(): Promise<void> {
    const session = this.getSession();
    try {
      await session.run("MATCH (n) DETACH DELETE n");
      console.log("All nodes and relationships have been deleted from the database.");
    } catch (error: any) {
      console.error("Error dropping the database:", error);
      throw new Error(`Failed to drop the database: ${error.message}`);
    } finally {
      await session.close();
    }
  }
}
