export type ClarityAbiTypeBuffer = { buffer: { length: number } };
export type ClarityAbiTypeStringAscii = { "string-ascii": { length: number } };
export type ClarityAbiTypeStringUtf8 = { "string-utf8": { length: number } };
export type ClarityAbiTypeResponse = {
  response: { ok: ClarityAbiType; error: ClarityAbiType };
};
export type ClarityAbiTypeOptional = { optional: ClarityAbiType };
export type ClarityAbiTypeTuple = {
  tuple: readonly { name: string; type: ClarityAbiType }[];
};
export type ClarityAbiTypeList = {
  list: { type: ClarityAbiType; length: number };
};

export type ClarityAbiTypeUInt128 = "uint128";
export type ClarityAbiTypeInt128 = "int128";
export type ClarityAbiTypeBool = "bool";
export type ClarityAbiTypePrincipal = "principal";
export type ClarityAbiTypeTraitReference = "trait_reference";
export type ClarityAbiTypeNone = "none";

export type ClarityAbiTypePrimitive =
  | ClarityAbiTypeUInt128
  | ClarityAbiTypeInt128
  | ClarityAbiTypeBool
  | ClarityAbiTypePrincipal
  | ClarityAbiTypeTraitReference
  | ClarityAbiTypeNone;

export type ClarityAbiType =
  | ClarityAbiTypePrimitive
  | ClarityAbiTypeBuffer
  | ClarityAbiTypeResponse
  | ClarityAbiTypeOptional
  | ClarityAbiTypeTuple
  | ClarityAbiTypeList
  | ClarityAbiTypeStringAscii
  | ClarityAbiTypeStringUtf8
  | ClarityAbiTypeTraitReference;

export interface ClarityAbiArg {
  name: string;
  type: ClarityAbiType;
}

export interface ClarityAbiFunction {
  name: string;
  access: "private" | "public" | "read_only";
  args: ClarityAbiArg[];
  outputs: {
    type: ClarityAbiType;
  };
}

export type TypedAbiArg<T, N extends string> = { _t?: T; name: N };

export type TypedAbiFunction<
  T extends TypedAbiArg<unknown, string>[],
  R
> = ClarityAbiFunction & {
  _t?: T;
  _r?: R;
};

export interface ClarityAbiVariable {
  name: string;
  access: "variable" | "constant";
  type: ClarityAbiType;
}

export type TypedAbiVariable<T> = ClarityAbiVariable & {
  defaultValue: T;
};

export interface ClarityAbiMap {
  name: string;
  key: ClarityAbiType;
  value: ClarityAbiType;
}

export type TypedAbiMap<K, V> = ClarityAbiMap & {
  _k?: K;
  _v?: V;
};

export interface ClarityAbiTypeFungibleToken {
  name: string;
}

export interface ClarityAbiTypeNonFungibleToken<T = unknown> {
  name: string;
  type: ClarityAbiType;
  _t?: T;
}

export interface ClarityAbi {
  functions: ClarityAbiFunction[];
}

export type TypedAbi = Readonly<{
  functions: {
    [key: string]: TypedAbiFunction<TypedAbiArg<unknown, string>[], unknown>;
  };
  contractName: string;
  contractFile?: string;
}>;

export interface ResponseOk<T, E> {
  value: T;
  isOk: true;
  _e?: E;
}

export interface ResponseErr<T, E> {
  value: E;
  isOk: false;
  _o?: T;
}

export type Response<Ok, Err> = ResponseOk<Ok, Err> | ResponseErr<Ok, Err>;

export type OkType<R> = R extends ResponseOk<infer V, unknown> ? V : never;
export type ErrType<R> = R extends ResponseErr<unknown, infer V> ? V : never;

export const contracts = {
  dao: {
    functions: {
      isSelfOrExtension: {
        name: "is-self-or-extension",
        access: "private",
        args: [],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      setExtensionsIter: {
        name: "set-extensions-iter",
        access: "private",
        args: [
          {
            name: "item",
            type: {
              tuple: [
                { name: "enabled", type: "bool" },
                { name: "extension", type: "principal" },
              ],
            },
          },
        ],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          item: TypedAbiArg<
            {
              enabled: boolean;
              extension: string;
            },
            "item"
          >
        ],
        boolean
      >,
      execute: {
        name: "execute",
        access: "public",
        args: [
          { name: "proposal", type: "trait_reference" },
          { name: "sender", type: "principal" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          proposal: TypedAbiArg<string, "proposal">,
          sender: TypedAbiArg<string, "sender">
        ],
        Response<boolean, bigint>
      >,
      construct: {
        name: "construct",
        access: "public",
        args: [{ name: "proposal", type: "trait_reference" }],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [proposal: TypedAbiArg<string, "proposal">],
        Response<boolean, bigint>
      >,
      requestExtensionCallback: {
        name: "request-extension-callback",
        access: "public",
        args: [
          { name: "extension", type: "trait_reference" },
          { name: "memo", type: { buffer: { length: 34 } } },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          extension: TypedAbiArg<string, "extension">,
          memo: TypedAbiArg<Uint8Array, "memo">
        ],
        Response<boolean, bigint>
      >,
      setExtension: {
        name: "set-extension",
        access: "public",
        args: [
          { name: "extension", type: "principal" },
          { name: "enabled", type: "bool" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          extension: TypedAbiArg<string, "extension">,
          enabled: TypedAbiArg<boolean, "enabled">
        ],
        Response<boolean, bigint>
      >,
      setExtensions: {
        name: "set-extensions",
        access: "public",
        args: [
          {
            name: "extensionList",
            type: {
              list: {
                type: {
                  tuple: [
                    { name: "enabled", type: "bool" },
                    { name: "extension", type: "principal" },
                  ],
                },
                length: 200,
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: { list: { type: "bool", length: 200 } },
              error: "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          extensionList: TypedAbiArg<
            {
              enabled: boolean;
              extension: string;
            }[],
            "extensionList"
          >
        ],
        Response<boolean[], bigint>
      >,
      executedAt: {
        name: "executed-at",
        access: "read_only",
        args: [{ name: "proposal", type: "trait_reference" }],
        outputs: { type: { optional: "uint128" } },
      } as TypedAbiFunction<
        [proposal: TypedAbiArg<string, "proposal">],
        bigint | null
      >,
      isExtension: {
        name: "is-extension",
        access: "read_only",
        args: [{ name: "extension", type: "principal" }],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [extension: TypedAbiArg<string, "extension">],
        boolean
      >,
    },
    maps: {},
    variables: {},
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "executor-dao",
  },
  extensionTrait: {
    functions: {},
    maps: {},
    variables: {},
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "extension-trait",
  },
  multisig: {
    functions: {
      callback: {
        name: "callback",
        access: "public",
        args: [
          { name: "sender", type: "principal" },
          { name: "memo", type: { buffer: { length: 34 } } },
        ],
        outputs: { type: { response: { ok: "bool", error: "none" } } },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, "sender">,
          memo: TypedAbiArg<Uint8Array, "memo">
        ],
        Response<boolean, null>
      >,
      directExecute: {
        name: "direct-execute",
        access: "public",
        args: [{ name: "proposal", type: "trait_reference" }],
        outputs: { type: { response: { ok: "uint128", error: "uint128" } } },
      } as TypedAbiFunction<
        [proposal: TypedAbiArg<string, "proposal">],
        Response<bigint, bigint>
      >,
      isDaoOrExtension: {
        name: "is-dao-or-extension",
        access: "public",
        args: [],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      setApprover: {
        name: "set-approver",
        access: "public",
        args: [
          { name: "who", type: "principal" },
          { name: "status", type: "bool" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          who: TypedAbiArg<string, "who">,
          status: TypedAbiArg<boolean, "status">
        ],
        Response<boolean, bigint>
      >,
      setSignalsRequired: {
        name: "set-signals-required",
        access: "public",
        args: [{ name: "newRequirement", type: "uint128" }],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [newRequirement: TypedAbiArg<number | bigint, "newRequirement">],
        Response<boolean, bigint>
      >,
      getSignals: {
        name: "get-signals",
        access: "read_only",
        args: [{ name: "proposal", type: "principal" }],
        outputs: { type: "uint128" },
      } as TypedAbiFunction<
        [proposal: TypedAbiArg<string, "proposal">],
        bigint
      >,
      getSignalsRequired: {
        name: "get-signals-required",
        access: "read_only",
        args: [],
        outputs: { type: "uint128" },
      } as TypedAbiFunction<[], bigint>,
      hasSignaled: {
        name: "has-signaled",
        access: "read_only",
        args: [
          { name: "proposal", type: "principal" },
          { name: "who", type: "principal" },
        ],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          proposal: TypedAbiArg<string, "proposal">,
          who: TypedAbiArg<string, "who">
        ],
        boolean
      >,
      isApprover: {
        name: "is-approver",
        access: "read_only",
        args: [{ name: "who", type: "principal" }],
        outputs: { type: "bool" },
      } as TypedAbiFunction<[who: TypedAbiArg<string, "who">], boolean>,
    },
    maps: {
      approverSignals: {
        name: "ApproverSignals",
        key: {
          tuple: [
            { name: "approver", type: "principal" },
            { name: "proposal", type: "principal" },
          ],
        },
        value: "bool",
      } as TypedAbiMap<
        {
          approver: string;
          proposal: string;
        },
        boolean
      >,
      approvers: {
        name: "Approvers",
        key: "principal",
        value: "bool",
      } as TypedAbiMap<string, boolean>,
      signalCount: {
        name: "SignalCount",
        key: "principal",
        value: "uint128",
      } as TypedAbiMap<string, bigint>,
    },
    variables: {},
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "multisig",
  },
  proposalTrait: {
    functions: {},
    maps: {},
    variables: {},
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "proposal-trait",
  },
  sip10Trait: {
    functions: {},
    maps: {},
    variables: {},
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "sip10-trait",
  },
  sip9Trait: {
    functions: {},
    maps: {},
    variables: {},
    constants: {},
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "sip9-trait",
  },
  treasury: {
    functions: {
      setAllowedIter: {
        name: "set-allowed-iter",
        access: "private",
        args: [
          {
            name: "item",
            type: {
              tuple: [
                { name: "enabled", type: "bool" },
                { name: "token", type: "principal" },
              ],
            },
          },
        ],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [
          item: TypedAbiArg<
            {
              enabled: boolean;
              token: string;
            },
            "item"
          >
        ],
        boolean
      >,
      withdrawManyFtIter: {
        name: "withdraw-many-ft-iter",
        access: "private",
        args: [
          {
            name: "data",
            type: {
              tuple: [
                { name: "amount", type: "uint128" },
                {
                  name: "memo",
                  type: { optional: { buffer: { length: 34 } } },
                },
                { name: "recipient", type: "principal" },
              ],
            },
          },
          { name: "asset", type: "trait_reference" },
        ],
        outputs: { type: "trait_reference" },
      } as TypedAbiFunction<
        [
          data: TypedAbiArg<
            {
              amount: number | bigint;
              memo: Uint8Array | null;
              recipient: string;
            },
            "data"
          >,
          asset: TypedAbiArg<string, "asset">
        ],
        string
      >,
      withdrawManyNftIter: {
        name: "withdraw-many-nft-iter",
        access: "private",
        args: [
          {
            name: "data",
            type: {
              tuple: [
                { name: "recipient", type: "principal" },
                { name: "tokenId", type: "uint128" },
              ],
            },
          },
          { name: "asset", type: "trait_reference" },
        ],
        outputs: { type: "trait_reference" },
      } as TypedAbiFunction<
        [
          data: TypedAbiArg<
            {
              recipient: string;
              tokenId: number | bigint;
            },
            "data"
          >,
          asset: TypedAbiArg<string, "asset">
        ],
        string
      >,
      withdrawManyStxIter: {
        name: "withdraw-many-stx-iter",
        access: "private",
        args: [
          {
            name: "data",
            type: {
              tuple: [
                { name: "amount", type: "uint128" },
                {
                  name: "memo",
                  type: { optional: { buffer: { length: 34 } } },
                },
                { name: "recipient", type: "principal" },
              ],
            },
          },
          {
            name: "previousResult",
            type: { response: { ok: "bool", error: "uint128" } },
          },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          data: TypedAbiArg<
            {
              amount: number | bigint;
              memo: Uint8Array | null;
              recipient: string;
            },
            "data"
          >,
          previousResult: TypedAbiArg<
            Response<boolean, number | bigint>,
            "previousResult"
          >
        ],
        Response<boolean, bigint>
      >,
      callback: {
        name: "callback",
        access: "public",
        args: [
          { name: "sender", type: "principal" },
          { name: "memo", type: { buffer: { length: 34 } } },
        ],
        outputs: { type: { response: { ok: "bool", error: "none" } } },
      } as TypedAbiFunction<
        [
          sender: TypedAbiArg<string, "sender">,
          memo: TypedAbiArg<Uint8Array, "memo">
        ],
        Response<boolean, null>
      >,
      depositFt: {
        name: "deposit-ft",
        access: "public",
        args: [
          { name: "ft", type: "trait_reference" },
          { name: "amount", type: "uint128" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          ft: TypedAbiArg<string, "ft">,
          amount: TypedAbiArg<number | bigint, "amount">
        ],
        Response<boolean, bigint>
      >,
      depositNft: {
        name: "deposit-nft",
        access: "public",
        args: [
          { name: "nft", type: "trait_reference" },
          { name: "id", type: "uint128" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          nft: TypedAbiArg<string, "nft">,
          id: TypedAbiArg<number | bigint, "id">
        ],
        Response<boolean, bigint>
      >,
      depositStx: {
        name: "deposit-stx",
        access: "public",
        args: [{ name: "amount", type: "uint128" }],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [amount: TypedAbiArg<number | bigint, "amount">],
        Response<boolean, bigint>
      >,
      isDaoOrExtension: {
        name: "is-dao-or-extension",
        access: "public",
        args: [],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<[], Response<boolean, bigint>>,
      setAllowed: {
        name: "set-allowed",
        access: "public",
        args: [
          { name: "token", type: "principal" },
          { name: "enabled", type: "bool" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          token: TypedAbiArg<string, "token">,
          enabled: TypedAbiArg<boolean, "enabled">
        ],
        Response<boolean, bigint>
      >,
      setAllowedList: {
        name: "set-allowed-list",
        access: "public",
        args: [
          {
            name: "allowList",
            type: {
              list: {
                type: {
                  tuple: [
                    { name: "enabled", type: "bool" },
                    { name: "token", type: "principal" },
                  ],
                },
                length: 100,
              },
            },
          },
        ],
        outputs: {
          type: {
            response: {
              ok: { list: { type: "bool", length: 100 } },
              error: "uint128",
            },
          },
        },
      } as TypedAbiFunction<
        [
          allowList: TypedAbiArg<
            {
              enabled: boolean;
              token: string;
            }[],
            "allowList"
          >
        ],
        Response<boolean[], bigint>
      >,
      withdrawFt: {
        name: "withdraw-ft",
        access: "public",
        args: [
          { name: "ft", type: "trait_reference" },
          { name: "amount", type: "uint128" },
          { name: "recipient", type: "principal" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          ft: TypedAbiArg<string, "ft">,
          amount: TypedAbiArg<number | bigint, "amount">,
          recipient: TypedAbiArg<string, "recipient">
        ],
        Response<boolean, bigint>
      >,
      withdrawManyFt: {
        name: "withdraw-many-ft",
        access: "public",
        args: [
          {
            name: "payload",
            type: {
              list: {
                type: {
                  tuple: [
                    { name: "amount", type: "uint128" },
                    {
                      name: "memo",
                      type: { optional: { buffer: { length: 34 } } },
                    },
                    { name: "recipient", type: "principal" },
                  ],
                },
                length: 200,
              },
            },
          },
          { name: "asset", type: "trait_reference" },
        ],
        outputs: {
          type: { response: { ok: "trait_reference", error: "uint128" } },
        },
      } as TypedAbiFunction<
        [
          payload: TypedAbiArg<
            {
              amount: number | bigint;
              memo: Uint8Array | null;
              recipient: string;
            }[],
            "payload"
          >,
          asset: TypedAbiArg<string, "asset">
        ],
        Response<string, bigint>
      >,
      withdrawManyNft: {
        name: "withdraw-many-nft",
        access: "public",
        args: [
          {
            name: "payload",
            type: {
              list: {
                type: {
                  tuple: [
                    { name: "recipient", type: "principal" },
                    { name: "tokenId", type: "uint128" },
                  ],
                },
                length: 200,
              },
            },
          },
          { name: "asset", type: "trait_reference" },
        ],
        outputs: {
          type: { response: { ok: "trait_reference", error: "uint128" } },
        },
      } as TypedAbiFunction<
        [
          payload: TypedAbiArg<
            {
              recipient: string;
              tokenId: number | bigint;
            }[],
            "payload"
          >,
          asset: TypedAbiArg<string, "asset">
        ],
        Response<string, bigint>
      >,
      withdrawManyStx: {
        name: "withdraw-many-stx",
        access: "public",
        args: [
          {
            name: "payload",
            type: {
              list: {
                type: {
                  tuple: [
                    { name: "amount", type: "uint128" },
                    {
                      name: "memo",
                      type: { optional: { buffer: { length: 34 } } },
                    },
                    { name: "recipient", type: "principal" },
                  ],
                },
                length: 200,
              },
            },
          },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          payload: TypedAbiArg<
            {
              amount: number | bigint;
              memo: Uint8Array | null;
              recipient: string;
            }[],
            "payload"
          >
        ],
        Response<boolean, bigint>
      >,
      withdrawNft: {
        name: "withdraw-nft",
        access: "public",
        args: [
          { name: "nft", type: "trait_reference" },
          { name: "id", type: "uint128" },
          { name: "recipient", type: "principal" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          nft: TypedAbiArg<string, "nft">,
          id: TypedAbiArg<number | bigint, "id">,
          recipient: TypedAbiArg<string, "recipient">
        ],
        Response<boolean, bigint>
      >,
      withdrawStx: {
        name: "withdraw-stx",
        access: "public",
        args: [
          { name: "amount", type: "uint128" },
          { name: "recipient", type: "principal" },
        ],
        outputs: { type: { response: { ok: "bool", error: "uint128" } } },
      } as TypedAbiFunction<
        [
          amount: TypedAbiArg<number | bigint, "amount">,
          recipient: TypedAbiArg<string, "recipient">
        ],
        Response<boolean, bigint>
      >,
      getAllowedAsset: {
        name: "get-allowed-asset",
        access: "read_only",
        args: [{ name: "assetContract", type: "principal" }],
        outputs: { type: { optional: "bool" } },
      } as TypedAbiFunction<
        [assetContract: TypedAbiArg<string, "assetContract">],
        boolean | null
      >,
      getBalanceStx: {
        name: "get-balance-stx",
        access: "read_only",
        args: [],
        outputs: { type: "uint128" },
      } as TypedAbiFunction<[], bigint>,
      isAllowed: {
        name: "is-allowed",
        access: "read_only",
        args: [{ name: "assetContract", type: "principal" }],
        outputs: { type: "bool" },
      } as TypedAbiFunction<
        [assetContract: TypedAbiArg<string, "assetContract">],
        boolean
      >,
    },
    maps: {
      allowedAssets: {
        name: "AllowedAssets",
        key: "principal",
        value: "bool",
      } as TypedAbiMap<string, boolean>,
    },
    variables: {
      ERR_UNAUTHORIZED: {
        name: "ERR_UNAUTHORIZED",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      ERR_UNKNOWN_ASSSET: {
        name: "ERR_UNKNOWN_ASSSET",
        type: {
          response: {
            ok: "none",
            error: "uint128",
          },
        },
        access: "constant",
      } as TypedAbiVariable<Response<null, bigint>>,
      TREASURY: {
        name: "TREASURY",
        type: "principal",
        access: "constant",
      } as TypedAbiVariable<string>,
    },
    constants: {
      ERR_UNAUTHORIZED: {
        isOk: false,
        value: 2000n,
      },
      ERR_UNKNOWN_ASSSET: {
        isOk: false,
        value: 2001n,
      },
      TREASURY: "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.treasury-vars",
    },
    non_fungible_tokens: [],
    fungible_tokens: [],
    clarity_version: "Clarity1",
    contractName: "treasury",
  },
} as const;

export const project = {
  contracts,
} as const;
