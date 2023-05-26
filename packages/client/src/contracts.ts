import type {
  ContractFactory,
  DeploymentNetwork,
  Response,
} from "@clarigen/core";
import { ClarigenClient, contractFactory } from "@clarigen/core";
import {
  contracts,
  createErrorWithStackTrace,
  DEFAULT_MAINNET_API_URL,
  DEFAULT_TESTNET_API_URL,
} from "@executor-dao/core";

export type EDaoContracts = ContractFactory<typeof contracts>;

export class EDaoClient {
  readonly client: ClarigenClient;
  readonly network: DeploymentNetwork;
  readonly apiUrl: string;
  readonly contracts: EDaoContracts;

  constructor(network: DeploymentNetwork = "mainnet", config: any = {}) {
    this.network = network;
    this.apiUrl = config.apiUrl || this.getDefaultApiUrl;
    this.client = new ClarigenClient(this.apiUrl);
    this.contracts = config.contracts || {};
  }

  get isMainnet() {
    return this.network === "mainnet";
  }

  get getDefaultApiUrl() {
    switch (this.network) {
      case "mainnet":
        return DEFAULT_MAINNET_API_URL;
      case "testnet":
        return DEFAULT_TESTNET_API_URL;
      // Add more cases for other networks as needed
      default:
        throw new Error(`Unknown network: ${this.network}`);
    }
  }

  get dao() {
    if (
      !this.contracts.dao ||
      !this.contracts.dao.identifier ||
      !this.contracts.dao.contractName
    ) {
      throw new Error("Executor DAO contract not configured");
    }

    return contractFactory(
      {
        ...contracts.dao,
        contractName: this.contracts.dao.contractName,
      },
      `${this.contracts.dao.identifier}.${this.contracts.dao.contractName}`
    );
  }

  get multisig() {
    return contractFactory(
      {
        ...contracts.multisig,
        contractName: this.contracts.multisig.contractName,
      },
      `${this.contracts.multisig.identifier}.${this.contracts.multisig.contractName}`
    );
  }

  get treasury() {
    return contractFactory(
      {
        ...contracts.treasury,
        contractName: this.contracts.treasury.contractName,
      },
      `${this.contracts.treasury.identifier}.${this.contracts.treasury.contractName}`
    );
  }

  async isExtension(extension: string) {
    try {
      const result = await this.client.ro(this.dao.isExtension(extension));
      return result;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  // create executedAt function similar to isExtension
  async executedAt(extension: string) {
    try {
      const result = await this.client.ro(this.dao.executedAt(extension));
      return result;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  async getSignals(proposal: string) {
    try {
      const signals = await this.client.ro(this.multisig.getSignals(proposal));
      return signals;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  async getSignalsRequired() {
    try {
      const signalsRequired = await this.client.ro(
        this.multisig.getSignalsRequired()
      );
      return signalsRequired;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  async hasSignaled(proposal: string, who: string, fnName?: string) {
    try {
      if (fnName) {
        const {
          nativeArgs,
          function: fn,
          ...multisig
        } = this.multisig.hasSignaled(proposal, who);
        return {
          ...multisig,
          functionName: fnName || multisig.functionName,
        };
      }
      const hasSignaled = await this.client.ro(
        this.multisig.hasSignaled(proposal, who)
      );
      return hasSignaled;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  async isApprover(who: string) {
    try {
      const isApprover = await this.client.ro(this.multisig.isApprover(who));
      return isApprover;
    } catch (err: any) {
      if (err.message === "Invalid c32check string: checksum mismatch") {
        throw createErrorWithStackTrace(
          "Invalid Stacks Address: the provided address is not valid",
          Error
        );
      } else {
        throw err;
      }
    }
  }

  async construct(proposal: string, fnName?: string) {
    const {
      nativeArgs,
      function: fn,
      ...construct
    } = this.dao.construct(proposal);
    return {
      ...construct,
      functionName: fnName || construct.functionName,
    };
  }

  async approve(proposal: string, fnName?: string) {
    const {
      nativeArgs,
      function: fn,
      ...directExecute
    } = this.multisig.directExecute(proposal);
    return {
      ...directExecute,
      functionName: fnName || directExecute.functionName,
    };
  }
}
