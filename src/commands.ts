import { create } from "node:domain";
import { readConfig, setUser } from "./config";
import { createUser, getUserByName, getUsers, reset } from "./lib/db/queries/users";
import { fetchFeed } from "./rss";
import { createFeed, createFeedFollow, getfeedbyUrl, getFeedFollowsForUser, getfeeds, scrapeFeeds } from "./lib/db/queries/feeds";
import { User, users,feed_follows } from "./lib/db/schema";
import { db } from "./lib/db";
import { and, eq } from "drizzle-orm";
import { getPostsForUser } from "./lib/db/queries/posts";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry=Record <string, CommandHandler>;
type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void>;

type middlewareLoggedIn = (handler: UserCommandHandler) => CommandHandler;

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    // 1. جلب اسم المستخدم من الإعدادات
    const userName = readConfig().currentUserName;

    if (!userName) {
      throw new Error("You must be logged in to perform this action.");
    }

    // 2. التحقق من وجود المستخدم في قاعدة البيانات
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.name, userName));

    if (!user) {
      throw new Error(`User '${userName}' not found in the database.`);
    }

    // 3. إذا كان كل شيء تمام، استدعِ الـ handler الأصلي ومرر له المستخدم
    return await handler(cmdName, user, ...args);
  };
}



 export async function handlerLogin(cmdName: string, ...args: string[]){

    if(args.length ==0){
        throw new Error("the login handler expects a single argument, the username");
        process.exit(1);
 }
 if(!await getUserByName(args[0])){

    throw new Error(`User ${args[0]} not found. Please register first.`);
 }
    setUser(args[0]);
    console.log(`User ${args[0]} logged in successfully!`);


 }

  export async function handlerRegister(cmdName: string, ...args: string[]){
 if(args.length ==0){
        throw new Error("the register handler expects a single argument, the username");
 }

 try{
 let result=await createUser(args[0]);
 setUser(args[0]);
console.log(`User ${args[0]} registered successfully!`);
console.log("User Data:", result);
 
}catch(error){
    if (error instanceof Error ) {
       throw new Error(`the user ${args[0]} already exists`);

}
  }
  }

 export async function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler){

registry[cmdName]=handler;



 }
 export async function handlerReset(cmdName: string, ...args: string[]){


await reset();
console.log("Database reset successfully!");
 }

 export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]){

if (!(cmdName in registry)) {
    throw new Error(`Command ${cmdName} not found in registry`);
}

 await registry[cmdName](cmdName, ...args);    


 }

 export async function handlerUsers(cmdName: string,user: User, ...args: string[]){
const users=await getUsers();
if(users.length === 0){
    console.log("No users found.");
   
}
else{
    for(const user of users){
if(user.name==user.name){
    console.log(`* ${user.name} (current)`);

    }
else
    console.log(`* ${user.name}`);
}

 }}


 export async function handlerAgg(cmdName: string, ...args: string[]){

if(args.length ==0){
    throw new Error("the agg handler expects a single argument, the feed URL");
}

const time_between_reqs=parseDuration(args[0]);
console.log(`Collecting feeds every ${args[0]}`);


scrapeFeeds().catch(console.error);

const interval = setInterval(() => {
  scrapeFeeds().catch(console.error);
}, time_between_reqs);

await new Promise<void>((resolve) => {
  process.on("SIGINT", () => {
    console.log("Shutting down feed aggregator...");
    clearInterval(interval);
    resolve();
  });
});



 }

 export async function handlerAddFeed(cmdName: string,user: User, ...args: string[]){




    if(args.length<2){
        throw new Error("the addfeed handler expects two arguments, the feed name and the feed url");
    }

    
    const userId=await getUserByName(user.name!);
    await createFeed(args[0], args[1], userId.id);
    const feed=await getfeedbyUrl(args[1]);
    await createFeedFollow(userId.id,feed[0].id);
    console.log(`user name : ${user.name} added feed with name : ${feed[0].name}  successfully!`);

 }

 export async function handlerFeeds(cmdName: string, ...args: string[]){
const feeds=await getfeeds();

if(feeds.length === 0){
    console.log("No feeds found.");
   
}
else{
   
    for(const feed of feeds){
    
   console.log(`* Name: ${feed.name}`);
    console.log(`  URL:  ${feed.url}`);
    console.log(`  User: ${feed.user_name}`);
    console.log();

    }


 }}


 export async function handlerFollow(cmdName: string,user: User, ...args: string[]){

    if(args.length<1){
        throw new Error("the follow handler expects a single argument, the feed URL");
    }

    const feed=await getfeedbyUrl(args[0]);
    if(feed.length === 0){
        throw new Error(`Feed with URL ${args[0]} not found.`);
    }

    const feedId=feed[0].id;
   
    const userId=await getUserByName(user.name!);
    await createFeedFollow(userId.id, feedId);
 }

 export async function handlerFollowing(cmdName: string,user: User, ...args: string[]){


   
    const feedsUser=await getFeedFollowsForUser(user.name!);
    if(feedsUser.length === 0){
        console.log(`User ${user.name} is not following any feeds.`);
    }
    else{
        console.log(`Feeds followed by ${user.name}:`);
        for(const feed of feedsUser){

            console.log(`* Name: ${feed.name}`);
        }
    }
 }

  export async function handlerUnfollow(cmdName: string,user: User, ...args: string[]){



        if(args.length<1){
            throw new Error("the unfollow handler expects a single argument, the feed URL");
        }

        const feed=await getfeedbyUrl(args[0]);
        if(feed.length === 0){
            throw new Error(`Feed with URL ${args[0]} not found.`);
        }

        const feedId=feed[0].id;
       
        
        await db.delete(feed_follows).where(and(eq(feed_follows.user_id, user.id), eq(feed_follows.feed_id, feedId)));

  }


 export function parseDuration(durationStr: string): number{
const regex = /^(\d+)(ms|s|m|h)$/;
const match = durationStr.match(regex);

if(!match){
    throw new Error("Invalid duration format. Use formats like '10s', '5m', '2h', or '500ms'.");
}
const value=parseInt(match[1]);
const unit=match[2];

switch(unit){
    case "ms":
        return value;
    case "s":
        return value * 1000;
    case "m":
        return value * 60 * 1000;
    case "h":
        return value * 60 * 60 * 1000;
    default:
        return 0;
}




 }

 export async function handlerBrowse(cmdName: string,user: User, ...args: string[]){

let limit = 2;
  if (args.length > 0) {
    const parsedLimit = parseInt(args[0]);
    if (!isNaN(parsedLimit)) limit = parsedLimit;
  }

  const userPosts = await getPostsForUser(user.id, limit);

  if (userPosts.length === 0) {
    console.log("No posts found. Make sure you are following feeds and the aggregator is running.");
    return;
  }

  console.log(`Latest ${userPosts.length} posts for ${user.name}:`);
  userPosts.forEach(p => {
    console.log(`--- ${p.title} ---`);
    console.log(`Source: ${p.feedName} | Date: ${p.publishedAt?.toLocaleString()}`);
    console.log(`Link: ${p.url}\n`);
  });



 }
