import { XMLParser } from "fast-xml-parser";


type RSSFeed = {
  channel: {
    title: string;
    link: string;
    description: string;
    item: RSSItem[];
  };
};

type RSSItem = {
  title: string;
  link: string;
  description: string;
  pubDate: string;
};

export  async function fetchFeed(feedURL: string): Promise<RSSFeed> {

   const response = await fetch(feedURL,{headers: {"User-Agent":"gator"}});

    if (!response.ok) {

throw new Error(`Failed to fetch RSS feed: ${response.status} `)

    }

    const xmlData = await response.text();
    const parseObj= new XMLParser();

    const feed=parseObj.parse(xmlData);

    if(!feed.rss || !feed.rss.channel){


        throw new Error("Invalid RSS feed format");
    }
    const channel=feed.rss.channel;
    let {title, link, description} = channel;
    if(!title || !link || !description){
        throw new Error("Missing required channel fields in RSS feed");
    }

const items: RSSItem[] = [];
if(Array.isArray(channel.item)){
    for(const item of channel.item){
        if(item.title&&item.link&&item.description&&item.pubDate){

            items.push(item);
        }

}

    }

    else if(channel.item && !Array.isArray(channel.item)){  

        items.push(channel.item);
    }
    return{channel:{title, link, description, item:items}};
}