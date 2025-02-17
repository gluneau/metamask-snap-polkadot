import {Injected, InjectedAccount, InjectedWindow} from "@polkadot/extension-inject/types";
import {enablePolkadotSnap} from "../index";
import {SnapConfig} from "@chainsafe/metamask-polkadot-types";
import {SignerPayloadJSON, SignerPayloadRaw, SignerResult} from "@polkadot/types/types";
import {HexString} from "@polkadot/util/types";
import {hasMetaMask, isMetamaskSnapsSupported} from "../utils";

interface Web3Window extends InjectedWindow {
  ethereum: unknown;
}

const config: SnapConfig = {
  networkName: "westend",
};

function transformAccounts (accounts: string[]): InjectedAccount[] {
  return accounts.map((address, i) => ({
    address,
    name: `Polkadot Snap #${i}`,
    type: 'ethereum'
  }));
}

function injectPolkadotSnap (win: Web3Window): void {
  win.injectedWeb3.Snap = {
    enable: async (): Promise<Injected> => {
      const snap = await (await enablePolkadotSnap(config)).getMetamaskSnapApi();

      return {
        accounts: {
          get: async (): Promise<InjectedAccount[]> => {
            const response = await snap.getAddress();
            return transformAccounts([response]);
          },
          // Currently there is only available only one account, in that case this method will never return anything
          subscribe: (_cb: (accounts: InjectedAccount[]) => void): (() => void) => {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return (): void => {};
          }
        },
        signer: {
          signPayload: async (payload: SignerPayloadJSON): Promise<SignerResult> => {
            const signature = await snap.signPayloadJSON(payload) as HexString;
            return { id: 0, signature };
          },
          signRaw: async (raw: SignerPayloadRaw): Promise<SignerResult> => {
            const signature = await snap.signPayloadRaw(raw) as HexString;
            return { id: 0, signature };
          },
        }
      };
    },
    version: '0',
  };
}

export function initPolkadotSnap (): Promise<boolean> {
  return new Promise((resolve): void => {
    const win = window as Window & Web3Window;
    win.injectedWeb3 = win.injectedWeb3 || {};

    if (hasMetaMask()) isMetamaskSnapsSupported().then(result => {
      if (result) {
        injectPolkadotSnap(win);
        resolve(true);
      } else {
        resolve(false);
      }
    });
    else resolve(false);
  });
}
