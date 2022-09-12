import React, { useState } from 'react'
import {
  Avatar,
  Button,
  Paper,
  Grid,
  Typography,
  Container,
} from '@material-ui/core'
import { useDispatch } from 'react-redux'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import jwt_decode from 'jwt-decode'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
// import Icon from './Icon'
import Input from './Input'
import useStyles from './styles'
import { signin, signup } from '../../actions/auth'

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState(initialState)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const classes = useStyles()
  //   const isSignUp = false

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSignUp) {
      dispatch(signup(formData, navigate))
    } else {
      dispatch(signin(formData, navigate))
    }
    console.log(formData)
  }
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  const handleShowPassword = () =>
    setShowPassword((prevShowPassword) => !prevShowPassword)

  const switchMode = () => {
    setIsSignUp((prevIsSignUp) => !prevIsSignUp)
    setShowPassword(false)
  }

  const googleSuccess = async (res) => {
    var result = jwt_decode(res.credential)
    const token = res.credential
    try {
      dispatch({ type: 'AUTH', data: { result, token } })
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }
  const googleFailure = (error) => {
    console.log(error)
    console.log('Google sign in was unsuccessfull. Try again later')
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography variant='h5'>{isSignUp ? 'Sign Up' : 'Sign In'}</Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {isSignUp && (
              <>
                <Input
                  name='firstName'
                  label='First Name'
                  handleChange={handleChange}
                  autoFocus
                  half
                />
                <Input
                  name='lastName'
                  label='Last Name'
                  handleChange={handleChange}
                  half
                />
              </>
            )}
            <Input
              name='email'
              label='Email Address'
              handleChange={handleChange}
              type='email'
            />
            <Input
              name='password'
              label='Password'
              type={showPassword ? 'text' : 'password'}
              handleChange={handleChange}
              handleShowPassword={handleShowPassword}
            />
            {isSignUp && (
              <Input
                name='confirmPassword'
                label='Repeat Password'
                handleChange={handleChange}
                type='password'
              />
            )}
          </Grid>
          <Button
            type='submit'
            fullWidth
            variant='contained'
            color='primary'
            className={classes.submit}
          >
            {isSignUp ? 'Sign Up' : 'Sign In'}
          </Button>
          <div className={classes.googleButton}>
            <GoogleLogin onSuccess={googleSuccess} onError={googleFailure} />
          </div>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Button onClick={switchMode}>
                {isSignUp
                  ? 'Already have an account? Sign In'
                  : "Don't have an account? Sign Up"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  )
}

export default Auth