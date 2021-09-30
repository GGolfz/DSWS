import { Fragment } from "preact";
import { useEffect, useState } from "preact/hooks";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Entropy from "./entropy";
import Naive from "./naive";
import Normalization from "./normalization";
import Outlier from "./outlier";
import Similarity from "./similarity";
import Distributed from "./distribute";
const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [app, setApp] = useState(null);
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
    if(app!= null) {
      const auth = getAuth(app);
      auth.onAuthStateChanged((user) => {
        if(user) {
          setAuth(true);
        }
      })
    }

  },[app])
  const handleSignIn = () => {
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password).then((resp) => {
      if (resp.user.uid) {
        setAuth(true);
      }
    });
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
            <Distributed/>
            <Similarity />
            <Normalization />
            <Entropy />
            <Naive />
            <Outlier />
          </Fragment>
        ) : (<div>Please Login to your account</div>)}
      </Fragment>
    </div>
  );
};

export default App;
