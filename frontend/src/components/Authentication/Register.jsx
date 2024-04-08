import React, { useState } from "react";
import { CircularProgress,Box, Typography, TextField, CssBaseline,  Button, Card, CardContent ,Grid, Link,} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import styles from "./Auth.module.css";

const Register = () => {
  const history = useHistory();
  const [load, setLoad] = useState(false); // for loading spinner
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // To Handle the State of the Input Fields (Username and Password)
  const onChangeUsername = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    if (newUsername.length < 4 || newUsername.length > 15) {
      setUsernameError("Username must be between 4 and 15 characters.");
    } else {
      setUsernameError("");
    }
  };
  const onChangePassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);

    if (newPassword.length < 6 || newPassword.length > 20) {
      setPasswordError("Password must be between 6 and 20 characters.");
    } else {
      setPasswordError("");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoad(true);
    if (!usernameError && !passwordError) {

      const newUser = { username, password };
      const url = "/api/auth/register";
      const registerRes = await Axios.post(url, newUser);
      
      if (registerRes.length!=='7' && registerRes.data.status === "fail") {
        setLoad(false);
        if (!registerRes.data.type) {
          setPasswordError(registerRes.data.message);
          setUsernameError(registerRes.data.message);
        } else if (registerRes.data.type === "username") {
          setUsernameError(registerRes.data.message);
        } else if (registerRes.data.type === "password") {
          setPasswordError(registerRes.data.message);
        }
      } else {
        history.push("/login");
      }
    }
    setLoad(false);
  };

  return (
    <div className={styles.background}>
      <CssBaseline />
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justify="center"
        style={{ minHeight: "100vh" }}
      >
        <Box width="70vh" boxShadow={1}>
          <Card className={styles.paper}>
            <CardContent>
              <Typography component="h1" variant="h5">
                Register
              </Typography>
              <form className={styles.form} onSubmit={onSubmit}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  error={usernameError.length > 0 ? true : false}
                  helperText={usernameError}
                  value={username}
                  onChange={onChangeUsername}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={passwordError.length > 0 ? true : false}
                  helperText={passwordError}
                  value={password}
                  onChange={onChangePassword}
                />
                <Box display="flex" justifyContent="center">
                  {!load ? (<Button type="submit" variant="contained" color="primary" className={styles.submit} >
                    Register
                  </Button>) : (<CircularProgress />)}
                </Box>
              </form>
              <Grid container justify="center">
                <Grid item>
                  <Link href="/login" variant="body2"> Already have an account? </Link>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Grid>
    </div>
  );
};

export default Register;
