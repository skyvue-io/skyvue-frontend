import { ButtonPrimary } from 'components/ui/Buttons';
import React, { useContext, useReducer, useState } from 'react';
import InputField from 'components/ui/InputField';
import { DangerText, Helper } from 'components/ui/Typography';
import { Link, useHistory } from 'react-router-dom';
import { IReducerAction } from 'types';
import skyvueFetch from 'services/skyvueFetch';
import userContext from 'contexts/userContext';
import parseJWT from 'lib/parseJWT';
import { UserContainer } from './styles';

const loginFormReducer = (
  state: {
    email: {
      error: boolean;
      value: string;
    };
    password: {
      error: boolean;
      value: string;
    };
  },
  action: IReducerAction<any>,
) => {
  const { type, payload } = action;
  switch (type) {
    case 'EMAIL':
      return {
        ...state,
        email: {
          value: payload.value,
          error: payload.error ?? false,
        },
      };
    case 'PASSWORD':
      return {
        ...state,
        password: {
          value: payload.value,
          error: payload.error ?? false,
        },
      };
    default:
      return state;
  }
};

const Login: React.FC = () => {
  const history = useHistory();
  const UserContext = useContext(userContext);
  const [badLogin, toggleBadLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formState, dispatchFormEvent] = useReducer(loginFormReducer, {
    email: {
      value: '',
      error: false,
    },
    password: {
      value: '',
      error: false,
    },
  });

  const tryLogin = async () => {
    setLoading(true);
    const { error, ...res } = await skyvueFetch().post('/auth/user/login', {
      email: formState.email.value.toLowerCase(),
      password: formState.password.value,
    });

    if (error) {
      toggleBadLogin(true);
      setLoading(false);
      return;
    }

    const decodedToken = parseJWT(res.accessToken);
    if (res.accessToken && decodedToken.userId) {
      UserContext.setUserContextValue({
        accessToken: res.accessToken,
        userId: decodedToken.userId,
      });
    }

    setLoading(false);
    localStorage.setItem('refreshToken', res.refreshToken);
    history.push('/home');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formState.email.value === '') {
      dispatchFormEvent({
        type: 'EMAIL',
        payload: {
          value: formState.email.value,
          error: true,
        },
      });
      toggleBadLogin(true);
      return;
    }

    if (formState.password.value === '') {
      dispatchFormEvent({
        type: 'PASSWORD',
        payload: {
          value: formState.password.value,
          error: true,
        },
      });
      toggleBadLogin(true);
      return;
    }

    toggleBadLogin(false);
    tryLogin();
  };

  return (
    <UserContainer>
      {badLogin && (
        <DangerText len="short" size="sm">
          There was a problem with your email or password. Please try again!
        </DangerText>
      )}
      <form onSubmit={onSubmit}>
        <div className="input-group">
          <InputField
            label="Email"
            name="email"
            onChange={e =>
              dispatchFormEvent({
                type: 'EMAIL',
                payload: {
                  value: e.target.value,
                },
              })
            }
            error={formState.email.error}
            value={formState.email.value}
            type="email"
            icon={<i className="fad fa-envelope" />}
          />
        </div>
        <div className="input-group">
          <InputField
            label="Password"
            name="password"
            onChange={e =>
              dispatchFormEvent({
                type: 'PASSWORD',
                payload: {
                  value: e.target.value,
                },
              })
            }
            error={formState.password.error}
            value={formState.password.value}
            type="password"
            icon={<i className="fad fa-lock-alt" />}
          />
        </div>

        <div className="actions__container">
          <ButtonPrimary loading={loading} id="complete_form">
            Login
          </ButtonPrimary>
          {/* 
          <Helper>
            Not a user yet?{' '}
            <strong>
              <Link to="/signup">Create Account</Link>
            </strong>
          </Helper> */}
          <Helper>
            <strong>
              <Link to="/forgot_password">I forgot my password</Link>
            </strong>
          </Helper>
        </div>
      </form>
    </UserContainer>
  );
};

export default Login;
