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
  let bridgeProgram: anchor.Program;

  beforeAll(async () => {
    ({ provider, tokenMint, accounts, bridgeProgram } = await getTestFixture());
  });

  it("successfully init the program", async () => {
    console.log("provider", await provider.connection.getBlockHeight());

    const config = Keypair.generate();
    const wormholePublicKey = new PublicKey(
      "6sbzC1eH4FTujJXWj51eQe25cYvr4xfXbJ1vAj7j2k5J"
    );

    console.log("pakyer", accounts.payerKeypair.publicKey.toBase58());
    console.log("config", config.publicKey.toBase58());

    try {
      // Call the initialize function
      await bridgeProgram.rpc.initialize(wormholePublicKey, {
        accounts: {
          payer: accounts.payerKeypair.publicKey,
          config: config.publicKey,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [accounts.payerKeypair], // Include config if it needs to be initialized
      });
      console.log("Initialization successful");
    } catch (error) {
      console.error("Error initializing the program:", error);
    }
  });
});
