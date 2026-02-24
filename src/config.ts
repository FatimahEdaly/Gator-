import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_FILE_NAME = ".gatorconfig.json";
export type Config = {
dbUrl: string;

currentUserName?: string;


};
export function setUser(userName: string) {
const configData=readConfig();
configData.currentUserName=userName;
writeConfig(configData);


}

export function readConfig():Config{

const path=getConfigFilePath();
const JSONdata=fs.readFileSync(path, "utf-8");
const rawConfig=JSON.parse(JSONdata);

return validateConfig(rawConfig);



}

function getConfigFilePath(): string{

    return path.join(os.homedir(), CONFIG_FILE_NAME);   
}

function writeConfig(cfg: Config): void{
const data={
  db_url: cfg.dbUrl,
  current_user_name: cfg.currentUserName};

  const JSONdata=JSON.stringify(data ,null,2);
  const path=getConfigFilePath();
  fs.writeFileSync(path, JSONdata, "utf-8");


}
function validateConfig(rawConfig: any): Config {

if (typeof rawConfig.db_url !== "string") {
  throw new Error("Invalid db_url in config");
}

return {

    dbUrl:rawConfig.db_url,
    currentUserName:rawConfig.current_user_name,
};
}