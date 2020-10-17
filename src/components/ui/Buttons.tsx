import React from "react";
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';

interface button {
  id?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = styled.button<{
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  danger?: boolean;
}>`
  border-radius: 100px;
  font-size: 1rem;
  padding: 0.75em 2.5em;
  text-align: center;
  font-weight: 700;
  transition-duration: 0.5s;
  outline: none;
  text-decoration: none;
  margin: 0.25em 0;
  cursor: pointer;

  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    &:hover {
      opacity: 0.5;
    }
  }

  ${props => props.primary ? `
    background: linear-gradient(115.8deg, #6e30f2 0%, #86e2ff 100%);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    background-repeat: no-repeat;
    color: white;
    border: none;

    &:hover {
      opacity: 0.7;
    }
  ` : ''}

  ${props => props.secondary ? `
    background: transparent;
    border-color: ${Styles.fontColor};
    color: ${Styles.fontColor};

    &:hover {
      background: linear-gradient(115.8deg, #6e30f2 0%, #86e2ff 100%);
      border-color: ${Styles.blue};
      color: white;
    }

    &:disabled {
      border-color: #919191;
      color: #919191;
      background: transparent;
    }
  ` : ''}

  ${props => props.tertiary ? `
      border-color: transparent;
      color: ${Styles.fontColor};
      background: transparent;

      &:hover {
        color: ${Styles.purple};
      }

      &:disabled {
        color: #919191;
      }
  ` : ''}

  ${props => props.danger ? `
    background-color: ${Styles.red};
    &:hover {
      background-color: #fa9596;
    }
  ` : ''}
`;

const ButtonPrimary: React.FC<button> = (props) => {
  return (
    <Button
      disabled={props.disabled ? props.disabled : false}
      onClick={props.onClick && props.onClick}
      id={props.id}
      primary
    >
      {props.children}
    </Button>
  );
};

const ButtonSecondary: React.FC<button> = (props) => {
  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick && props.onClick}
      id={props.id}
      secondary
    >
      {props.children}
    </Button>
  );
};

const ButtonTertiary: React.FC<button> = (props) => {
  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick && props.onClick}
      id={props.id}
      tertiary
    >
      {props.children}
    </Button>
  );
};

const ButtonDanger: React.FC<button> = props => {
  return (
    <Button
      disabled={props.disabled}
      onClick={props.onClick && props.onClick}
      id={props.id}
      danger
    >
      {props.children}
    </Button>
  )
}

export { ButtonPrimary, ButtonTertiary, ButtonSecondary, ButtonDanger };