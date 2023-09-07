import React, { useEffect } from 'react';

const AuthContext = React.createContext({
  token: '',
  user: {},
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
  updateUser: (updatedUser) => {},
});

export const AuthContextProvider = (props) => {
  const [token, setToken] = React.useState(null);
  const [user, setUser] = React.useState({});

  useEffect(() => {
    const initialToken = localStorage.getItem('token');
    setToken(initialToken);

    let initialUser = {};
    if (localStorage.getItem('user')) {
      initialUser = JSON.parse(localStorage.getItem('user'));
      setUser(initialUser);
    }
  }, []);

  const userIsLoggedIn = !!token;

  const loginHandler = (token, user) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logoutHandler = () => {
    setToken(null);
    setUser({});
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler,
    user,
    updateUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
