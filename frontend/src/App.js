import React, { useState, useEffect } from "react";
// BrowserRouter as Router means that we are using the BrowserRouter component as Router.
// For example:  Switch as Rajat means that we use Switch as Rajat.
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Login, Register, NotFound, PageTemplate } from "./components";
import UserContext from "./context/UserContext";
import Axios from "axios";

function App() {
  const [userData, setUserData] = useState({ token: undefined, user: undefined, });

  const url = "/api";

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      // important: if token is null, then set it to empty string.
      if (token == null) {
        localStorage.setItem("auth-token", "");
        token = "";
        setUserData({ token: undefined, user: undefined });
        return;
      }

      const headers = {
        "x-auth-token": token,
      };

      const tokenIsValid = await Axios.post(url + "/auth/validate", null, { headers,});

      // tokenIsValid is either true or false ?????????????????? then .data ????

      if (tokenIsValid.data) {
        const userRes = await Axios.get(url + "/auth/user", { headers });
        // userRes is returning json data of id, username, and balance
        setUserData({ token, user: userRes.data, });
      } else {
        setUserData({ token: undefined, user: undefined });
      }
    }; 
    checkLoggedIn();
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>

        <div>
          <Switch>
            { userData.user ?
              (<Route path="/" exact component={PageTemplate}/>) 
              : 
              (<Route path="/" exact component={Login} />)
            }
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route component={NotFound} />
          </Switch>
        </div>

      </UserContext.Provider>
    </Router>
  );
}

export default App;
