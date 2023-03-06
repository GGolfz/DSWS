import { useState } from "preact/hooks";
import Entropy from "./entropy";
import Naive from "./naive";
import Normalization from "./normalization";
import Outlier from "./outlier";
import Similarity from "./similarity";
import Prism from "./prism";
import Association from "./association";

const App = () => {
  const [page, setPage] = useState("similarity");
  const renderItem = () => {
    switch (page) {
      case "similarity":
        return <Similarity />;
      case "normalization":
        return <Normalization />;
      case "entropy":
        return <Entropy />;
      case "naive":
        return <Naive />;
      case "outlier":
        return <Outlier />;
      case "prism":
        return <Prism />;
      case "association":
        return <Association />;
      default:
        return <Similarity />;
    }
  };
  return (
    <div id="app" style={{ width: "100vw", height: "100vh", padding: "2rem" }}>
      <div style={{ display: "flex", flexFlow: "row" }}>
        <div
          style={{
            padding: "0 2rem",
            margin: "0 1rem",
            fontWeight: page == "similarity" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setPage("similarity")}
        >
          Similarity
        </div>
        <div
          style={{
            padding: "0 2rem",
            margin: "0 1rem",
            fontWeight: page == "normalization" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setPage("normalization")}
        >
          Normalization
        </div>
        <div
          style={{
            padding: "0 2rem",
            margin: "0 1rem",
            fontWeight: page == "entropy" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setPage("entropy")}
        >
          Entropy
        </div>
        <div
          style={{
            padding: "0 2rem",
            margin: "0 1rem",
            fontWeight: page == "naive" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setPage("naive")}
        >
          Naïve Bayes
        </div>
        <div
          style={{
            padding: "0 2rem",
            margin: "0 1rem",
            fontWeight: page == "outlier" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setPage("outlier")}
        >
          Outlier
        </div>
        <div
          style={{
            padding: "0 2rem",
            margin: "0 1rem",
            fontWeight: page == "prism" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setPage("prism")}
        >
          PRISM
        </div>
        <div
          style={{
            padding: "0 2rem",
            margin: "0 1rem",
            fontWeight: page == "association" ? "bold" : "normal",
            cursor: "pointer",
          }}
          onClick={() => setPage("association")}
        >
          Association
        </div>
      </div>
      {renderItem()}
    </div>
  );
};

export default App;
