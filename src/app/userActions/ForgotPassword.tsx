import { ButtonPrimary } from 'components/ui/Buttons';
import InputField from 'components/ui/InputField';
import { Helper, Text } from 'components/ui/Typography';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserContainer } from './styles';
import * as EmailValidator from 'email-validator';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [showConfirmation, toggleShowConfirmation] = useState(false);

  const onSubmit = async () => {
    if (!EmailValidator.validate(email) || email === '') {
      setError(true);
      return;
    } else {
      setError(false);
    }

    toggleShowConfirmation(true);
  }

  return (
    <UserContainer>
      <Text size="lg" len="short">
        Enter the email associated with your account.
        If an account exists, we'll send you an email with a link to reset your password.
      </Text>

      <div className="input-group">
        {showConfirmation && <Helper>Success! Check your email for your reset link.</Helper>}
        <InputField
          onChange={e => setEmail(e.target.value)}
          error={error}
          value={email}
          placeholder={'email@email.com'}
          onKeyDown={e => {
            if (e.key === 'Enter') onSubmit();
          }}
        />
      </div>
      <div className="actions__container">
        <ButtonPrimary onClick={onSubmit}>
          Reset my password
        </ButtonPrimary>
        <Helper><Link to="/forgot_password">Customer Login</Link></Helper>
      </div>
    </UserContainer>
  )
}

export default ForgotPassword;