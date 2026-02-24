
import { handlerAgg, CommandsRegistry, handlerLogin,handlerRegister,handlerReset,handlerUsers,registerCommand,runCommand ,handlerAddFeed, handlerFeeds, handlerFollowing, handlerFollow, middlewareLoggedIn, handlerUnfollow, handlerBrowse} from "./commands";
import { readConfig, setUser } from "./config";

async function main() {

    let Commands_registry:CommandsRegistry={};
registerCommand(Commands_registry, "login", handlerLogin);
registerCommand(Commands_registry, "register", handlerRegister);
registerCommand(Commands_registry, "reset", handlerReset);
registerCommand(Commands_registry, "users",middlewareLoggedIn( handlerUsers));
registerCommand(Commands_registry, "agg",handlerAgg);
registerCommand(Commands_registry, "addfeed",middlewareLoggedIn(handlerAddFeed));
registerCommand(Commands_registry, "feeds", handlerFeeds);
registerCommand(Commands_registry, "feedfollows",middlewareLoggedIn(handlerFollowing));
registerCommand(Commands_registry, "following", middlewareLoggedIn(handlerFollowing));
registerCommand(Commands_registry, "follow",middlewareLoggedIn(handlerFollow));
registerCommand(Commands_registry, "unfollow",middlewareLoggedIn(handlerUnfollow));
registerCommand(Commands_registry, "browse",middlewareLoggedIn(handlerBrowse));

const argv=process.argv.slice(2);
if(argv.length ==0){
    throw new Error("Not enough arguments provided");
    process.exit(1);
 
}

try{
await runCommand(Commands_registry,argv[0],...argv.slice(1));
}catch(error){
    if (error instanceof Error) {
        console.error("Error:", error.message);
        process.exit(1);
   
  
}

}
 process.exit(0);

}
main();