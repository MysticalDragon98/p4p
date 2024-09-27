//* Imports

import { KeyStorage } from "./lib/classes/KeyStorage.class";
import Logger from "./lib/const/Logger.const";
import { $PRIVKEY_FILE } from "./lib/env";

async function main () {
    await Promise.all([
        KeyStorage.loadFromFile($PRIVKEY_FILE)
            .catch(err => {
                console.error(err)
                process.exit(1)
            })
    ]);

    //* Post Main
}

main().catch(error => {
    Logger.info('Exiting...');
    Logger.error(error);
    process.exit(1);
})

process.on('uncaughtException', console.log);
process.on('unhandledRejection', console.log);