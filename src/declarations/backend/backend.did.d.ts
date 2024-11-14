import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface _SERVICE {
  'addBloodPressureRecord' : ActorMethod<
    [bigint, bigint, string, string],
    undefined
  >,
  'getBloodPressureRecords' : ActorMethod<
    [],
    Array<[bigint, bigint, string, string]>
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
