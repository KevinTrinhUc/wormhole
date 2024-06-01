import {
  PublicKey,
  Connection,
  Keypair,
  Commitment,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import {
  AnchorProvider,
  Wallet,
  BN,
  Address,
  Program,
} from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, createMint } from "@solana/spl-token";
import * as consts from "./consts";
import fs from "fs";
const idl = JSON.parse(fs.readFileSync("./idl/token_bridge.json", "utf8"));

export type TestFixture = {
  provider: AnchorProvider;
  accounts: TestAccounts;
  tokenMint: PublicKey;
  bridgeProgram: Program;
};

export const getTestFixture = async function () {
  const commitment: Commitment = "confirmed";
  const connection = new Connection(consts.RPC_ENDPOINT_URL, { commitment });
  const accounts = await generateTestAccounts();
  const wallet = new Wallet(accounts.payerKeypair);
  const provider = new AnchorProvider(connection, wallet, { commitment });

  const fundingAccounts = [
    accounts.deployerKeypair.publicKey,
    accounts.payerKeypair.publicKey,
  ];
  await fundSOLAccounts(connection, accounts.payerKeypair, fundingAccounts);

  const tokenMint = await createMint(
    connection,
    accounts.payerKeypair,
    wallet.publicKey,
    null,
    consts.TOKEN_DECIMAL
  );

  const program = new Program(
    idl,
    "B6RHG3mfcckmrYN1UhmJzyS1XX3fZKbkeUcpJe9Sy3FE",
    provider
  );

  return {
    provider,
    accounts,
    tokenMint,
    bridgeProgram: program,
  };
};

export const fundSOLAccounts = async (
  connection: Connection,
  funder: Keypair,
  accounts: PublicKey[]
) => {
  const airdropTx = await connection.requestAirdrop(
    funder.publicKey,
    1000 * consts.ONE_SOL
  );
  await connection.confirmTransaction({
    signature: airdropTx,
    ...(await connection.getLatestBlockhash()),
  });

  const fundingTx = new Transaction();
  for (let i = 0; i < accounts.length; i++) {
    fundingTx.add(
      SystemProgram.transfer({
        fromPubkey: funder.publicKey,
        toPubkey: accounts[i],
        lamports: 10 * consts.ONE_SOL,
      })
    );
  }
  if (fundingTx.instructions.length > 0) {
    await connection.sendTransaction(fundingTx, [funder]);
  }
};

export type TestAccounts = {
  payerKeypair: Keypair;
  deployerKeypair: Keypair;
};

export const generateTestAccounts = async (): Promise<TestAccounts> => {
  const payerKeypair = Keypair.generate();
  const deployerKeypair = Keypair.generate();

  return {
    payerKeypair,
    deployerKeypair,
  };
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
