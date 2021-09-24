import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import Entropy from "./entropy";
import Naive from "./naive";
import Normalization from "./normalization";
import Outlier from "./outlier";
import Similarity from "./similarity";
const App = () => {
  return (
    <div id="app" style={{ width: "100vw", height: "100vh", padding: "2rem" }}>
      <Fragment>
        <Similarity />
        <Normalization />
        <Entropy />
        <Naive />
        <Outlier />
      </Fragment>
    </div>
  );
};

export default App;
