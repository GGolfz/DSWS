import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Entropy from "./entropy";
import Naive from "./naive";
import Normalization from "./normalization";
import Outlier from "./outlier";
import Similarity from "./similarity";
import Prism from "./prism";
import Association from './association';
const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [app, setApp] = useState(null);
  const [page, setPage] = useState("similarity");
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    const FirebaseCredentials = {
      apiKey: process.env.PREACT_APP_FIREBASE_PUBLIC_API_KEY,
      authDomain: process.env.PREACT_APP_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.PREACT_APP_FIREBASE_PROJECT_ID,
    };
    let app = initializeApp(FirebaseCredentials);
    setApp(app);
  }, []);
  useEffect(() => {
    if (app != null) {
      const auth = getAuth(app);
      auth.onAuthStateChanged((user) => {
        if (user) {
          setAuth(true);
        }
      });
    }
  }, [app]);
  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password).then((resp) => {
      if (resp.user.uid) {
        setAuth(true);
      }
    });
  };
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
      <Fragment>
        {!auth ? (
          <div>
            <input
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignIn}>login</button>
          </div>
        ) : null}
        {auth ? (
          <Fragment>
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
                Na??ve Bayes
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
          </Fragment>
        ) : (
          <div>Please Login to your account</div>
        )}
        <br/>
        <div style={{display:'flex'}}>
        <div style={{padding: '2rem'}}>
        <img src="https://tmp.cscms.me/9nwmgr" alt="porju" width="240px" />
        </div>
        <div style={{padding: '2rem'}}>
        <img src="https://tmp.cscms.me/stamp" alt="stamp" width="240px" /></div></div>
      </Fragment>
    </div>
  );
};

export default App;
