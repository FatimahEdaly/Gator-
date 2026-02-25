import { get } from "node:http";
import { db } from "..";
import { feeds, users ,feed_follows} from "../schema";
import { eq, sql} from "drizzle-orm";
import { fetchFeed } from "../../../rss";
import { createPost } from "./posts";

export async function createFeed(name: string, url: string, userId: string) {
  
  const [result] = await db.insert(feeds).values({ name: name ,url:url,user_id:userId}).returning();
  return result;
}

export async function getfeeds() {

return await db.select({name: feeds.name,url:feeds.url,user_name:users.name}).from(feeds).innerJoin(users, eq(feeds.user_id, users.id));


}

export async function createFeedFollow(userId: string, feedId: string) {

    const [result] = await db.insert(feed_follows).values({ user_id: userId, feed_id: feedId }).returning();
    if (!result) {
        throw new Error("Failed to create feed follow.");
    }
    const records=await db.select({id: feed_follows.id,createdAt: feed_follows.createdAt,updatedAt: feed_follows.updatedAt,feed_name:feeds.name,user_name:users.name}).from(feed_follows).innerJoin(users,eq(feed_follows.user_id,users.id)).innerJoin(feeds,eq(feed_follows.feed_id,feeds.id));
    return await records;
}

export async function getfeedbyUrl(url: string) {


return await db.select().from(feeds).where(eq(feeds.url, url));
}

export async function getFeedFollowsForUser(userName:string) {
return await db.select({name: feeds.name}).from (feed_follows).innerJoin(users,eq(feed_follows.user_id,users.id)).innerJoin(feeds,eq(feed_follows.feed_id,feeds.id)).where(eq(users.name,userName));


}

export async function markFeedFetched(feedId: string) {
  await db.update(feeds).set({ last_fetched_at: new Date() ,updatedAt: new Date()}).where(eq(feeds.id, feedId));}

export async function  getNextFeedToFetch(){

const [rseult]=await db.select().from (feeds).orderBy(sql`${feeds.last_fetched_at} ASC NULLS FIRST`).limit(1);

return  rseult;
}

export async function scrapeFeeds() {

  const feedsToScrape= await getNextFeedToFetch();

  if(!feedsToScrape ){
    console.log("No feeds to scrape at the moment.");
    
  }

else{
  

 await markFeedFetched(feedsToScrape.id);
try{
const responce=await fetchFeed(feedsToScrape.url);

for (const item of responce.channel.item) {
    const pubDate = item.pubDate ? new Date(item.pubDate) : null;
    
    await createPost({
        title: item.title,
        url: item.link,
        description: item.description || null,
        publishedAt: isNaN(pubDate?.getTime()!) ? null : pubDate,
        feedId: feedsToScrape.id
    });
}}
catch(error){
    console.error(`Failed to fetch or process feed ${feedsToScrape.url}:`, error);
} }}