import Web3 from "web3";
import Link from "next/link";

interface Props { }

const Footer: React.FC<Props> = (props) => {
  function truncate(str: string, n: number) {
    return str.length > n ? str.slice(0, n - 1) + "..." : str;
  }

  return (
    <div className="absolute bottom-0 z-10 flex h-28 w-full items-center justify-around drop-shadow-lg transition-all ease-in-out sm:h-20 lg:bottom-0">
      <div className="flex h-full w-full flex-wrap items-center justify-center gap-4 border-[#9D00FF] bg-black bg-opacity-60 px-8 text-white transition-all ease-in-out lg:w-full lg:rounded-md lg:border-2">
        <div className="flex flex-row gap-4 invert">
          <Link href={"https://toramatic.com"}>
            <img src="/home.svg" alt="" className="h-6 w-6" />
          </Link>
          <Link href={" https://t.me/TheToraToken"}>
            <img src="/telegram.svg" alt="" className="h-6 w-6" />
          </Link>
          <Link href={"https://twitter.com/ToraToken?t=v7sI9my2LKZk5_4C_l8tQQ&s=08"}>
            <img src="/twitter.svg" alt="" className="h-6 w-6" />
          </Link>
        </div>
        <div>©2023 TORA TOKEN</div>
      </div>
    </div>
  );
};

export default Footer;
