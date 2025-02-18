import { injectable } from "inversify";
import { db } from "../../../db/database";

@injectable()
export class PostQueryRepository {
  async getAllPosts(page: number, pageSize: number) {
    const posts = await db.findNodes("MATCH (n:POST) WHERE n.deletedAt IS NULL MATCH (u:USER) WHERE u.id = n.user_id RETURN n, u", {});

    const postsView = posts.map((p) => ({
      ...p.n,
      user: { photo: p.u.photo, first_name: p.u.first_name, last_name: p.u.last_name },
      likes: [],
      comments: [],
    }));

    return {
      pagesCount: 1, //Math.ceil(blogsCount / query.pageSize),
      page: page,
      pageSize: pageSize,
      totalCount: posts.length,
      items: postsView,
    };
  }

  async getUserPosts(user_id: string, page: number, pageSize: number) {
    const posts = await db.findNodes("MATCH (n:POST) WHERE n.deletedAt IS NULL AND n.user_id = $user_id RETURN n", {
      user_id: user_id,
    });

    const users = await db.findNodes(
      `
      MATCH (u:USER)
      WHERE u.id = $user_id
      RETURN u
      `,
      {
        user_id: user_id,
      }
    );

    const postsView = posts.map((p) => ({
      ...p.n,
      user: { photo: users[0].u.photo, first_name: users[0].u.first_name, last_name: users[0].u.last_name },
      likes: [],
      comments: [],
    }));

    return {
      pagesCount: 1, //Math.ceil(blogsCount / query.pageSize),
      page: page,
      pageSize: pageSize,
      totalCount: posts.length,
      items: postsView,
    };
  }
}
