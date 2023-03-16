import React from "react";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SideDrawer from "@/components/SideDrawer";

import Web3 from "web3";

import { useCallback } from "react";
// import Particles from "react-particles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFull } from "tsparticles";
// import ParticleConfig from "../public/particleconf.json";

import { useState } from "react";

export default function App({ Component, pageProps }: AppProps) {
  let web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

  const [acc, setacc] = useState<string[]>([]);

  const getacc = async () => {
    if (web3) {
      const accounts = await web3.eth.requestAccounts();
      setacc(accounts);
    }
  };

  const [curPage, setCurPage] = useState<number>(0);

  // const particlesInit = useCallback(async (engine: Engine) => {
  //   console.log(engine);
  //   await loadFull(engine);
  // }, []);

  // const particlesLoaded = useCallback(
  //   async (container: Container | undefined) => {
  //     await console.log(container);
  //   },
  //   []
  // );

  return (
    <div>
      {/* <Particles
        id="tsparticles"
        params={ParticleConfig as any}
        init={particlesInit}
        loaded={particlesLoaded}
        className="absolute"
      /> */}
      {/* <Header
        web3={web3}
        accounts={acc}
        connect={async () => await getacc()}
        setCurPage={setCurPage}
      /> */}
      <SideDrawer
        web3={web3}
        accounts={acc}
        connect={async () => await getacc()}
        setCurPage={setCurPage}
      />
      <Component {...pageProps} web3={web3} curPage={curPage} accounts={acc} />
      <Footer />
    </div>
  );
}
