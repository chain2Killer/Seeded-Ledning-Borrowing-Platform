import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import {
  PublicKey,
  SYSVAR_CLOCK_PUBKEY,
  TransactionInstruction,
} from '@solana/web3.js';
import BN from 'bn.js';
import * as Layout from '../../layout';
import { LendingInstruction } from './instruction';
const BufferLayout = require('buffer-layout')

export const depositReserveLiquidityInstruction = (
  programID : PublicKey,
  liquidityAmount: number | BN,
  sourceLiquidity: PublicKey,
  destinationCollateral: PublicKey,
  reserve: PublicKey,
  reserveLiquiditySupply: PublicKey,
  reserveCollateralMint: PublicKey,
  lendingMarket: PublicKey,
  lendingMarketAuthority: PublicKey,
  transferAuthority: PublicKey,
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8('instruction'),
    Layout.uint64('liquidityAmount'),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: LendingInstruction.DepositReserveLiquidity,
      liquidityAmount: new BN(liquidityAmount),
    },
    data,
  );

  const keys = [
    { pubkey: sourceLiquidity, isSigner: false, isWritable: true },
    { pubkey: destinationCollateral, isSigner: false, isWritable: true },
    { pubkey: reserve, isSigner: false, isWritable: true },
    { pubkey: reserveLiquiditySupply, isSigner: false, isWritable: true },
    { pubkey: reserveCollateralMint, isSigner: false, isWritable: true },
    { pubkey: lendingMarket, isSigner: false, isWritable: false },
    { pubkey: lendingMarketAuthority, isSigner: false, isWritable: false },
    { pubkey: transferAuthority, isSigner: true, isWritable: false },
    { pubkey: SYSVAR_CLOCK_PUBKEY, isSigner: false, isWritable: false },
    { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: programID,
    data,
  });
};
