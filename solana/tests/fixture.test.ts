import { Keypair, PublicKey } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import * as assert from "assert";
import {
  getTestFixture,
  sleep,
  fundSOLAccounts,
  TestAccounts,
} from "./utils/fixture";

import { AnchorProvider, BN } from "@project-serum/anchor";

describe("fixture", () => {
  let provider: AnchorProvider;
  let tokenMint: PublicKey;
  let accounts: TestAccounts;

  beforeAll(async () => {
    ({ provider, tokenMint, accounts } = await getTestFixture());
  });

  it("successfully init the program", async () => {
    console.log("provider", await provider.connection.getBlockHeight());
  });
});
