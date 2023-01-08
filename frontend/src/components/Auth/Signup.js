import { useRef, useState } from 'react';
import { useHistory } from 'react-router';
import classes from "./Auth.module.css";
import { useHttpClient } from '../../hooks/http-hook'
import { useDispatch } from 'react-redux';
import { authActions } from '../../store/store';

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

function Signup() {
    const history = useHistory()
    const authDispatch = useDispatch(authActions)
    const [emailError, setEmailError] = useState(null)
    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [confirmError, setConfirmError] = useState(null)
    const { isLoading, httpError, sendRequest, clearError } = useHttpClient()
    const emailRef = useRef()
    const usernameRef = useRef()
    const passwordRef = useRef()
    const confirmRef = useRef()
    function redirectLogin() {
        history.push('/login')
    }
    function validateFormHandler(event) {
        event.preventDefault()
        clearError()
        let isErrors = false
        let email = emailRef.current.value.toLowerCase()
        let username = usernameRef.current.value.toLowerCase()
        let password = passwordRef.current.value
        let confirmPassword = confirmRef.current.value
        const emailRegex = /^[^a-z0-9@._-]+$/i
        const usernameRegex = /[^a-z0-9_-]+/gi
        const found = email.match(emailRegex)
        if (found) {
            isErrors = true
            setEmailError(<div className={classes['input-error']}>Enter a Valid Email</div>)
        } else if (email.length < 3) {
            isErrors = true
            setEmailError(<div className={classes['input-error']}>Enter a Valid Email</div>)
        } else if (!email.includes('@') && !email.includes('.')) {
            isErrors = true
            setEmailError(<div className={classes['input-error']}>Enter a Valid Email</div>)
        } else {
            setEmailError(null)

        }
        const usernameRegexCheck = username.match(usernameRegex)
        if (usernameRegexCheck) {
            isErrors = true
            setUsernameError(<div className={classes['input-error']}>Username must only contain letters, numbers, or underscores</div>)
        } else if (username.length < 3) {
            isErrors = true
            setUsernameError(<div className={classes['input-error']}>Username must be atleast 3 characters</div>)
        } else if (username.length > 20) {
            isErrors = true
            setUsernameError(<div className={classes['input-error']}>Username cant be more than 20 characters</div>)
        } else {
            setUsernameError(null)
        }

        if (password.includes(' ')) {
            isErrors = true
            setPasswordError(<div className={classes['input-error']}>Password cannot contain spaces</div>)
        } else if (password.length < 6) {
            isErrors = true
            setPasswordError(<div className={classes['input-error']}>Password must be atleast 6 characters</div>)
        } else {
            setPasswordError(null)
        }
        if (password !== confirmPassword) {
            isErrors = true
            setConfirmError(<div className={classes['input-error']}>Passwords Must Match</div>)
        } else {
            setConfirmError(null)
        }
        if (!isErrors) {
            submitSignUpHandler(email, username, password)
        }
    }
    async function submitSignUpHandler(email, username, password) {
        try {
            const responseData = await sendRequest('http://localhost:5000/api/v1/carbuilds/users', 'POST', JSON.stringify({
                username,
                email,
                password
            }), {
                'Content-Type': 'application/json'
            })

            authDispatch(authActions.login({ token: responseData.token, userId: responseData.userId }))
            history.push('/account-setup')

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
                    Create An Account
                </Typography>
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                {httpError && (<div>{httpError}</div>)}
                <Box component="form" noValidate onSubmit={validateFormHandler} sx={{ mt: 3 }}>
                    <TextField
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        inputRef={emailRef}
                        error={emailError ? true : false}
                        helperText={emailError}
                        sx={{ mt: 3 }}
                    />
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
                    <TextField
                        required
                        fullWidth
                        id="confirmPassword"
                        label="Confirm Password"
                        name="confirmPassword"
                        autoComplete="confirmPassword"
                        inputRef={confirmRef}
                        error={confirmError ? true : false}
                        helperText={confirmError}
                        type='password'
                        sx={{ mt: 3 }}
                    />
                    {isLoading && <LinearProgress />}
                    <Box sx={{
                            display: "flex", justifyContent: "space-between", mt: 3, mb: 2, width: "100%"
                        }} 
                    >
                        <Button variant='outlined' color='secondary' type='button' onClick={redirectLogin}>Returning User?</Button>
                        <Button variant='contained' color='primary' type='submit' onClick={validateFormHandler}>Create An Account!</Button>
                    </Box>

                </Box>
            </Box>

        </ThemeProvider>
    </>
}

export default Signup