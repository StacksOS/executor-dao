"use client";

import { client } from "../config";
import { useOpenContractCall } from "@micro-stacks/react";

const address = "SP143YHR805B8S834BWJTMZVFR1WP5FFC03WZE4BF";

async function isExtension() {
  const extension = await client.isExtension(
    "SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccd002-treasury-nyc-stacking"
  );
  alert(`This extension is ${extension ? "" : "not "}enabled`);
}

async function executedAt() {
  const executedAt = await client.executedAt(
    "SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccip013-activation"
  );
  alert(`This extension was executed at ${executedAt}`);
}

async function getSignalsRequired() {
  const signals = await client.getSignals(
    "SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccip013-activation"
  );
  alert(`This extension requires ${signals} signals`);
}

async function hasSignaled() {
  const hasSignaled = await client.hasSignaled(
    "SP8A9HZ3PKST0S42VM9523Z9NV42SZ026V4K39WH.ccip013-activation",
    "SP372JVX6EWE2M0XPA84MWZYRRG2M6CAC4VVC12V1",
    "has-signalled"
  );
  alert(`This address has ${hasSignaled ? "" : "not "}been signaled`);
}

export default function Page() {
  const { openContractCall } = useOpenContractCall();

  return (
    <>
      <button onClick={hasSignaled}>Executor Dao</button>
    </>
  );
}
