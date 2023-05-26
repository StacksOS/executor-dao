import { contractFactory, makeFungiblePostCondition } from "@clarigen/core";
import { contracts } from "./clarigen";
import {
  FungibleConditionCode,
  PostCondition,
} from "micro-stacks/transactions";

interface SplitStringResult {
  identifier: string;
  contractName: string;
}

export function createErrorWithStackTrace(
  errorMessage: string,
  errorType: any
) {
  const error = new errorType(errorMessage);
  Error.captureStackTrace(error, createErrorWithStackTrace);
  return error;
}

export function getContractParts(identifier: string): [string, string] {
  const [addr, name] = identifier.split(".");
  if (!addr || !name) {
    throw new Error(`Invalid contract ID: ${identifier}`);
  }
  return [addr, name];
}

function splitString(str: string): SplitStringResult | null {
  const parts = str.split(".");
  if (parts.length !== 2) {
    return null;
  }
  return {
    identifier: parts[0],
    contractName: parts[1],
  };
}

export function isFullIdentifier(str: string): boolean {
  return splitString(str) !== null;
}

/**
 * Creates a fungible post condition.
 * @param {string} sender - The sender of the post condition.
 * @param {number} amount - The amount of the post condition.
 * @param {number} [decimals=2] - The number of decimals of the post condition.
 * @param {FungibleConditionCode} [code=FungibleConditionCode.Equal] - The condition code of the post condition.
 * @returns {FungiblePostCondition[]} An array containing a single fungible post condition.
 */
// export function createFungiblePostCondition(
//   sender: string,
//   amount: number,
//   decimals = 2,
//   code = FungibleConditionCode.Equal
// ): PostCondition[] {
//   const identifier = `SP3D6PV2ACBPEKYJTCMH7HEN02KP87QSP8KTEH335.mega`;
//   const contract = contractFactory(contracts.token, identifier);
//   const amountWithDecimals = amount * 10 ** Number(decimals);
//   const postCondition = makeFungiblePostCondition(
//     contract,
//     sender,
//     code,
//     BigInt(amountWithDecimals)
//   );
//   return [postCondition];
// }
