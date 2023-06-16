import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { LoginUser, SignupUser } from '../../pages'
import './style.css'

const LoginUse = () => {
  const [signIn, setSignIn] = useState(false)
  const [slideAnimation, setSlideAnimation] = useState('')

  const activateSignIn = () => {
    setSlideAnimation('slide-in-animation')
    setTimeout(() => {
      setSignIn(false)
      setSlideAnimation('')
    }, 300)
  }

  const activateRegister = () => {
    setSlideAnimation('slide-in-animation')
    setTimeout(() => {
      setSignIn(true)
      setSlideAnimation('')
    }, 300)
  }

  return (
    <div className='login-wrapper'>
      <div className={`mainContent ${slideAnimation}`}>
        <div className='topbar'>
          <div className='signup-box'>
            <p
              onClick={activateSignIn}
              className={signIn ? 'sign-in' : 'sign-in-focused'}
            >
              SIGN IN
            </p>
          </div>
          <div className='signin-box'>
            <p
              onClick={activateRegister}
              className={signIn ? 'create-account-focused' : 'create-account'}
            >
              SIGN UP
            </p>
          </div>
        </div>
        {!signIn ? <LoginUser /> : <SignupUser />}
      </div>
    </div>
  )
}

export default LoginUse