import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import Normalization from "./normalization";
import Similarity from "./similarity";
const App = () => {
  
  return (
    <div id="app">
      <Fragment>
      <Similarity /><Normalization /></Fragment>
    </div>
  );
};

export default App;
