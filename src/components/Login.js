import React from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import AUTH_TOKEN from "../constants";

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const SIGN_UP_MUTATION = gql`
  mutation SignUpMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, name: $name, password: $password) {
      token
    }
  }
`;

class Login extends React.Component {
  state = {
    email: "",
    login: true,
    name: "",
    password: ""
  };

  render() {
    const { email, login, name, password } = this.state;
    return (
      <div>
        <h4 className="mv3">{login ? "Login" : "Sign Up"}</h4>
        <div className="flex flex-column">
          {!login && (
            <input
              onChange={e => this.setState({ name: e.target.value})}
              placeholder="Your name"
              type="text"
              value={name}
            />
          )}
          <input
            onChange={e => this.setState({ email: e.target.value})}
            placeholder="Your email address"
            type="text"
            value={email}
          />
          <input
            onChange={e => this.setState({ password: e.target.value})}
            placeholder="Chose a safe password"
            type="password"
            value={password}
          />
        </div>
        <div className="flex mt3">
          <Mutation
            mutation={login ? LOGIN_MUTATION : SIGN_UP_MUTATION}
            onCompleted={data => this._confirm(data)}
            variables={{ email, password, name }}
          >
            {mutation => (
              <div className="pointer mr2 button" onClick={mutation}>
                {login ? "login" : "create account"}
              </div>
            )}
          </Mutation>
          <div className="pointer button" onClick={() => this.setState({ login: !login })}>
            {login
              ? "need to create an account?"
              : "already have an account?"}
          </div>
        </div>
      </div>
    );
  };

  _confirm = async (data) => {
    const { token } = data[this.state.login ? "login" : "signup"];
    this._saveUserData(token);
    this.props.history.push("/");
  };

  _saveUserData = token => {
    localStorage.setItem(AUTH_TOKEN, token);
  };
};

export default Login;
