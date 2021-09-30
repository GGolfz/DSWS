import { Fragment } from "preact";
import { useState } from "preact/hooks";

const Distributed = () => {
  const [percent, setPercent] = useState("");
  const [tserial, setTS] = useState("");
  const [core, setCore] = useState("");
  const [tparallel, setTP] = useState(null);
  const [efficiency, setEfficiency] = useState(null);
  const handleCalculate = () => {
    let tp =
      (1 - parseFloat(percent) / 100) * parseFloat(tserial) +
      ((parseFloat(percent) / 100) * parseFloat(tserial)) / parseFloat(core);
    setTP(tp);
    setEfficiency(100 * parseFloat(tserial) / tp / parseFloat(core));
  };
  return (
    <Fragment>
      <h1>Parallel Time Calculator</h1>
      <input
        type="text"
        placeholder="parallel percent"
        value={percent}
        onChange={(e) => setPercent(e.target.value)}
      />
      <input
        type="text"
        placeholder="t-serial"
        value={tserial}
        onChange={(e) => setTS(e.target.value)}
      />
      <input
        type="text"
        placeholder="core"
        value={core}
        onChange={(e) => setCore(e.target.value)}
      />
      <button onClick={handleCalculate}>Calculate</button><br/>
      {tparallel != null ? (
        <Fragment>Parallel Time: {tparallel}</Fragment>
      ) : null}<br/>
      {efficiency != null ? (
        <Fragment>Efficiency: {efficiency.toFixed(2)} %</Fragment>
      ) : null}
    </Fragment>
  );
};

export default Distributed;
