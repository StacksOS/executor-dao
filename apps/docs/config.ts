import { createConfig } from "@executor-dao/core";
import { EDaoClient } from "@executor-dao/client";
const extensions = {
  dao: "base-dao",
  treasury: "ccd002-treasury-mia-mining",
  multisig: "ccd001-direct-execute",
};
const config = createConfig(
  "SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH",
  extensions
);
export const client = new EDaoClient("mainnet", config);
