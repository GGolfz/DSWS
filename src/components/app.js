import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import Entropy from "./entropy";
import Normalization from "./normalization";
import Similarity from "./similarity";
const App = () => {
  return (
    <div id="app" style={{width:'100vw',height:'100vh',padding:'2rem'}}>
      <Fragment>
        <Similarity />
        <Normalization />
        <Entropy />
      </Fragment>
    </div>
  );
};

export default App;
