import Navbar from './components/Navbar/Navbar';
import Topposts from './components/Posts/Topposts';
import Profile from './components/Profile/Profile';
import Hero from './components/Hero/Hero';
import Signup from './components/Auth/Signup';
import Login from './components/Auth/Login';
import SetupAccount from './components/Profile/SetupAccount';
import { Switch } from 'react-router';
import { Route } from 'react-router';
import './App.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from './store/store';
import CreatePost from './components/Post/CreatePost';
import Postpage from './components/Posts/Postpage';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHttpClient } from './hooks/http-hook';

const theme = createTheme({
  palette: {
    primary: {
      light: '#ffd367',
      main: '#ffa236',
      dark: '#c77300',
      contrastText: '#000',
    }
  },
  typography: {
    h6: { fontSize: '1rem' },
  }
});

function App() {
  const authDispatch = useDispatch(authActions)


  const { sendRequest } = useHttpClient()
  //check if user is logged in and auth token is valid






  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData'))
    if(!storedUser.userId || !storedUser.token){
      return
    }
    async function checkAuth(userData) {
      try {

        const response = await sendRequest("http://localhost:5001/api/v1/carbuilds/user/auth/" + userData.userId, 'GET',
          null, {
          'Content-Type': 'application/json',
          Authorization: "Bearer " + userData.token
        })
        console.log(response)
        return response.valid === true
      } catch (e) {
        return false
      }
    }

    checkAuth(storedUser).then(isValid => {
        if (isValid) {

          authDispatch(authActions.login({ token: storedUser.token, userId: storedUser.userId }))
        }
      }
    );
// eslint-disable-next-line 
  },[])
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Navbar />
        <Switch>
          <Route path='/topposts' >
            <Topposts />
          </Route>
          <Route path='/newpost' >
            <CreatePost />
          </Route>
          <Route path='/profile/:paramId' >
            <Profile />
          </Route>
          <Route path='/post/:paramId' >
            <Postpage />
          </Route>
          <Route path='/signup'>
            <Signup />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/account-setup'>
            <SetupAccount />
          </Route>
          <Route path='*' >
            <Hero />
          </Route>
        </Switch>
      </ThemeProvider>
    </div>
  );
}

export default App;
