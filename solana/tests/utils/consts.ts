import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as anchor from "@project-serum/anchor";

export const TEST_TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(
  TOKEN_PROGRAM_ID.toString()
);
export const ZERO_BN = new anchor.BN(0);
export const TRANSACTION_FEE = 5000;

export const ONE_SOL = 1000000000;
export const TOKEN_DECIMAL = 6;

export const RPC_ENDPOINT_URL = "http://127.0.0.1:8899"; // localnet
