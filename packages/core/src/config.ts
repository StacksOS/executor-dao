import { getContractParts } from "./utils";

interface ConfigContract {
  identifier: string;
  contractName: string;
}

interface ConfigContracts {
  [contractName: string]: ConfigContract;
}

type RequiredContracts = "dao" | "treasury";

function createConfig(
  identifier: string,
  contractNames: {
    [contractName in RequiredContracts]: string;
  } & {
    multisig?: string;
    submission?: string;
    voting?: string;
    [contractName: string]: string | undefined;
  }
): { contracts: ConfigContracts } {
  const config: ConfigContracts = {};

  for (const contractName in contractNames) {
    const isFullIdentifier = contractNames[contractName]?.includes(".");
    if (isFullIdentifier) {
      const [addr, name] = getContractParts(
        contractNames[contractName] as string
      );
      config[contractName] = {
        identifier: addr,
        contractName: name,
      };
    } else {
      config[contractName] = {
        identifier: identifier,
        contractName: contractNames[contractName] as string,
      };
    }
  }
  return { contracts: config };
}

export { createConfig };
