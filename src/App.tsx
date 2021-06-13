import "./styles.css";
import { useState, useEffect, useRef } from "react";

const bakers = [
  {
    name: "cursor",
    defaultValue: 10,
    defaultCps: 1
  },
  {
    name: "granma",
    defaultValue: 200,
    defaultCps: 20
  }
];

export default function App() {
  const defaultBakersCount = bakers.map((_) => 0);
  const defaultBakersMagnification = bakers.map((_) => 1);
  const [count, setCount] = useState(0);
  const [cps, setCps] = useState(0);
  const [bakersCount, setBakersCount] = useState(defaultBakersCount);
  const [bakersMagnification, setBakersMagnification] = useState(
    defaultBakersMagnification
  );

  const refCps = useRef(cps);

  const onClickCookie = () => {
    setCount((count) => count + 1);
  };

  const bakersBuyFee = (idx: number) => {
    return (
      bakers[idx].defaultValue +
      Math.floor(
        bakers[idx].defaultCps * 0.12 * bakersCount[idx] * bakersCount[idx]
      )
    );
  };

  const onClickBuyBaker = (idx: number) => {
    const buyFee = bakersBuyFee(idx);
    if (count < buyFee) return null;
    const newBakersCount = [...bakersCount];
    const beforeBuyCount = bakersCount[idx];
    newBakersCount.splice(idx, 1, beforeBuyCount + 1);
    setCount((count) => count - buyFee);
    setBakersCount(newBakersCount);
  };

  const onClickUpgrade = (idx: number) => {
    const newBakersMagnification = [...bakersMagnification];
    const beforeMagnification = bakersMagnification[idx];
    newBakersMagnification.splice(idx, 1, beforeMagnification + 1);
    setBakersMagnification(newBakersMagnification);
  };

  useEffect(() => {
    console.log("bakersCount changed");
    let calcCps = 0;
    bakers.forEach((baker, idx) => {
      calcCps += baker.defaultCps * bakersCount[idx] * bakersMagnification[idx];
    });
    setCps(calcCps);
  }, [bakersCount, bakersMagnification]);

  useEffect(() => {
    refCps.current = cps;
  }, [cps]);

  useEffect(() => {
    setInterval(() => {
      setCount((count) => count + refCps.current);
    }, 1000);
  }, []);

  return (
    <div className="App">
      <div className="cookie-component" onClick={onClickCookie}>
        <img alt="cookie" src="cookie.png" className="cookie-img" />
      </div>

      <div className="count-component">
        <p>{`cookies : ${count.toLocaleString()}`}</p>
        <p>{`cps : ${cps.toLocaleString()}`}</p>
      </div>

      {bakers.map((baker, idx) => {
        return (
          <div key={baker.name} className="baker-component">
            <p>{`${baker.name} ( cost : ${bakersBuyFee(
              idx
            ).toLocaleString()} cookies )`}</p>
            <p>{`count : ${bakersCount[idx].toLocaleString()} ${
              bakersMagnification[idx] !== 1
                ? `( x${bakersMagnification[idx]} boost )`
                : ""
            }`}</p>
            <div className="button-area">
              <button onClick={() => onClickBuyBaker(idx)}>buy</button>
              <button
                style={{
                  color: "red",
                  borderColor: "red",
                  display:
                    bakersCount[idx] < 30 * bakersMagnification[idx]
                      ? "none"
                      : "block"
                }}
                onClick={() => onClickUpgrade(idx)}
              >
                upgrade
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
