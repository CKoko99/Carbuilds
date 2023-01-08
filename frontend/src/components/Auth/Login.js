import { useHistory } from 'react-router';
import { useHttpClient } from '../../hooks/http-hook';
import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/store';
import { useState } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LinearProgress } from '@material-ui/core';


const theme = createTheme();

function Login() {
    const history = useHistory()
    const authDispatch = useDispatch(authActions)
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()

    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)

    const usernameRef = useRef()
    const passwordRef = useRef()
    function redirectSignup() {
        history.push('/signup')
    }
    function validateFormHandler(event) {
        event.preventDefault()
        clearError()
        let isErrors = false
        let username = usernameRef.current.value
        let password = passwordRef.current.value
        const usernameRegex = /[^a-z0-9_-]+/gi
        const found = username.match(usernameRegex)
        if (found) {
            isErrors = true
            setUsernameError("Enter a Valid Username")
        } else if (username.length < 3) {
            isErrors = true
            setUsernameError("Enter a Valid Username")
        } else {
            setUsernameError(null)
        }
        if (password.length < 6) {
            isErrors = true
            setPasswordError("Enter a Valid Password")
        } else {
            setPasswordError(null)
        }
        if (!isErrors) {
            submitSignUpHandler(username, password, event)
        }
    }

    async function submitSignUpHandler(username, password, event) {
        const formattedusername = username.toLowerCase()
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/users/login', 'POST', JSON.stringify({
                username: formattedusername,
                password
            }), {
                'Content-Type': 'application/json'
            })

            authDispatch(authActions.login({ token: responseData.token, userId: responseData.userId }))
            history.replace('/')

        } catch (err) {
        }
    }

    return <>
        <ThemeProvider theme={theme}>

                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        border: "1px solid black",
                        margin: "20px auto",
                        minWidth: "300px",
                        maxWidth: "500px",
                        padding: "20px",
                        borderRadius: "10px",
                        backgroundColor: "white",
                        boxShadow: "0 0 10px 0 rgba(0,0,0,0.2)",
                        width: "95%"
                    }}
                >
                    <Typography variant='h3'>
                        Sign In
                    </Typography>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    {httpError && (<div>{httpError}</div>)}
                    <Box component="form" noValidate onSubmit={validateFormHandler} sx={{ mt: 3 }}>
                        <TextField
                            required
                            fullWidth
                            id="displayName"
                            label="Display Name"
                            name="displayName"
                            autoComplete="displayName"
                            inputRef={usernameRef}
                            error={usernameError ? true : false}
                            helperText={usernameError}
                            sx={{ mt: 3 }}
                        />
                        <TextField
                            required
                            fullWidth
                            id="password"
                            label="password"
                            name="password"
                            autoComplete="password"
                            inputRef={passwordRef}
                            error={passwordError ? true : false}
                            helperText={passwordError}
                            type='password'
                            sx={{ mt: 3 }}

                        />
                        {isLoading && <LinearProgress/>}
                        <Box sx={{
                            display: "flex", justifyContent: "space-between", mt: 3, mb: 2, width: "100%"
                        }} >
                            <Button variant='outlined' color='secondary' type='button' onClick={redirectSignup}>Create An Account!</Button>
                            <Button variant='contained' color='primary' type='submit' onClick={validateFormHandler} style={{minWidth:"40%"}}>Sign In!</Button>
                        </Box>
                    </Box>
                </Box>

        </ThemeProvider>
    </>
}

export default Login