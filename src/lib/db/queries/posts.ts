import { db } from "..";

import { posts, feeds, feed_follows } from "../schema";
import { eq, desc } from "drizzle-orm";


export async function createPost(post: {
  title: string;
  url: string;
  description: string | null;
  publishedAt: Date | null;
  feedId: string;
}) {
  return await db.insert(posts)
    .values(post)
    .onConflictDoNothing({ target: posts.url })
   
    .returning();
}


 export async function getPostsForUser(userId: string, limit = 2) {
  return await db.select({
      title: posts.title,
      url: posts.url,
      publishedAt: posts.publishedAt,
      feedName: feeds.name
    })
    .from(posts)
    .innerJoin(feeds, eq(posts.feedId, feeds.id))
    .innerJoin(feed_follows, eq(feed_follows.feed_id, feeds.id))
    .where(eq(feed_follows.user_id, userId))
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
}


