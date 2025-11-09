import Button from '@/components/Button';
import { useMint } from '@/hooks/mint';
import { useTokens } from '@/hooks/tokens';
import ControllerConnector from '@cartridge/connector/controller';
import { useAccount, useConnect, useDisconnect, useNetwork } from '@starknet-react/core';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getCollectionAddress, getTokenAddress } from '../../config';
import { useEffect, useMemo, useRef, useState } from 'react';
import { addAddressPadding } from 'starknet';
import { useBuy } from '@/hooks/buy';
import { useOpen } from '@/hooks/open';
import { useStart } from '@/hooks/start';
import { useGamepacks } from '@/hooks/gamepacks';
import { GamePack } from '@/bindings/typescript/models.gen';

export const Route = createFileRoute('/real')({
  component: RealPlay,
})

function RealPlay() {
  return (
    <div className="relative min-h-screen flex flex-col gap-16 bg-black text-white">
      <Header />
      <Main />
    </div>
  )
}

export const Main = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <Buy />
      <Gamepacks />
    </div>
  )
}

export const Buy = () => {
  const { buy } = useBuy();
  return (
    <Button onClick={() => buy()}>Buy Gamepack</Button>
  )
}

export const Gamepacks = () => {
  const { chain } = useNetwork();
  const { account } = useAccount();
  const { balances } = useTokens({
    contractAddresses: [addAddressPadding(getCollectionAddress(chain.id))],
    accountAddresses: !account ? [] : [addAddressPadding(account.address)],
    contractType: "ERC721"
  });

  const gamepackIds = useMemo(() => {
    return balances
      .filter((balance) => {
        // Only include ERC721 tokens with balance > 0
        const balanceValue = BigInt(balance.balance || "0x0");
        return balanceValue > 0n;
      })
      .map((balance) => {
        // Convert token_id from hex to number
        const tokenId = balance.token_id || "0x0";
        return parseInt(tokenId, 16);
      })
      .filter((id) => id > 0); // Filter out invalid IDs
  }, [balances]);

  const { gamepacks } = useGamepacks(gamepackIds);

  return (
    <div className="flex flex-col gap-4">
      {gamepacks.map((gamepack) => (
        <Game key={gamepack.gamepack_id} gamepack={gamepack} />
      ))}
    </div>
  )
}

export const Game = ({ gamepack }: { gamepack: GamePack }) => {
  const unopened = useMemo(() => {
    return gamepack.state as unknown as string === "Unopened";
  }, [gamepack]);

  return (
    <div className="flex gap-4">
      <p>{`Gamepack #${gamepack.gamepack_id}`}</p>
      {unopened && <Open gamepackId={Number(gamepack.gamepack_id)} />}
      {!unopened && <Start gamepackId={Number(gamepack.gamepack_id)} />}
    </div>
  )
}

export const Open = ({ gamepackId }: { gamepackId: number }) => {
  const { open } = useOpen();
  return (
    <Button onClick={() => open(gamepackId)}>Open</Button>
  )
}

export const Start = ({ gamepackId }: { gamepackId: number }) => {
  const { start } = useStart();
  return (
    <Button onClick={() => start(gamepackId)}>Start</Button>
  )
}

export const Header = () => {
  const { account } = useAccount();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate({ to: "/" });
  };

  return (
    <div className="w-full min-h-24 max-h-24 px-8 flex items-center justify-between border-b border-[rgba(0,0,0,0.24)] bg-[linear-gradient(0deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.16)_100%)]">
      <div
        className="flex items-center justify-start gap-2 cursor-pointer select-none"
        onClick={handleClick}
      >
        <h1
          className="text-[64px] leading-[48px] uppercase text-white translate-y-1"
          style={{ textShadow: "3px 3px 0px rgba(0, 0, 0, 0.25)" }}
        >
          GLITCH BOMB
        </h1>
      </div>
      <div className="flex items-center justify-start gap-4">
        {account && <Balance />}
        {account ? <Profile /> : <Connect />}
        {account && <Disconnect />}
      </div>
    </div>
  );
};

export const Connect = () => {
  const { connectAsync, connectors } = useConnect();
  return (
    <Button
      onClick={async () => {
        await connectAsync({ connector: connectors[0] });
      }}
    >
      <p
        className="translate-y-0.5"
        style={{ textShadow: "2px 2px 0px rgba(0, 0, 0, 0.24)" }}
      >
        Connect
      </p>
    </Button>
  );
};

export const Disconnect = () => {
  const { disconnect } = useDisconnect();

  return (
    <Button
      onClick={() => disconnect()}
    >
      Disconnect
    </Button>
  );
};

export const Profile = () => {
  const { connector } = useAccount();
  const [username, setUsername] = useState<string | null>(null);

  const controllerConnector = connector as never as ControllerConnector;

  useEffect(() => {
    if (controllerConnector) {
      controllerConnector.username()?.then((username) => {
        setUsername(username);
      });
    }
  }, [controllerConnector]);

  return (
    <Button
      onClick={async () => {
        (connector as ControllerConnector)?.controller.openProfile("inventory");
      }}
    >
      {username}
    </Button>
  );
};

export const Balance = () => {
  const { account } = useAccount();
  const { chain } = useNetwork();
  const tokenAddress = getTokenAddress(chain.id);
  const { mint } = useMint();

  const { tokens, balances, getBalance, toDecimal } = useTokens(
    {
      accountAddresses: !!account
        ? [addAddressPadding(account.address)]
        : [],
      contractAddresses: [addAddressPadding(tokenAddress)],
    },
  );

  const prevBalanceRef = useRef<bigint | undefined>(undefined);
  const balanceDiff = useRef<{ value: bigint }>({ value: 0n });

  const balance = useMemo(() => {
    if (!account) return "0";

    const token = tokens.find(
      (i) => BigInt(i.contract_address) === BigInt(tokenAddress),
    );
    if (!token) return "0";

    const balance = getBalance(token);
    if (!balance) return "0";

    const balanceScaled = toDecimal(token, balance);

    const diff = balanceScaled - (prevBalanceRef.current || 0n);

    if (diff !== 0n) {
      balanceDiff.current = { value: diff };
      prevBalanceRef.current = balanceScaled;
    }

    return balanceScaled;
  }, [balances, tokens, getBalance, toDecimal, account]);

  return (
    <Button
      onClick={() => mint()}
    >
      {`${balance.toLocaleString()} TKN`}
    </Button>
  );
};
