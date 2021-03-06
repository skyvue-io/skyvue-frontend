import styled from 'styled-components/macro';
import React from 'react';
import Styles from 'styles/Styles';
import InlineLoading from './InlineLoading';

interface IButton {
  id?: string;
  children: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  icon?: boolean;
  loading?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
}

const Button = styled.button<{
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  disabled?: boolean;
  danger?: boolean;
  icon?: boolean;
}>`
  border-radius: .4rem;
  font-size: 1rem;
  padding: 0.75em 2.5em;
  text-align: center;
  font-weight: 700;
  transition-duration: 0.5s;
  outline: none;
  text-decoration: none;
  margin: 0.25em 0;
  cursor: pointer;
  border: 2px solid ${Styles.faintBorderColor};
  display: flex;
  align-items: center;

  &:disabled {
    pointer-events: none;
    cursor: not-allowed;
    &:hover {
      opacity: 0.5;
    }
  }

  .icon {
    i {
      width: 1rem;
      height: 1rem;
    }

    &.left {
      margin-left: -1rem;
      margin-right: 1rem;
    }

    &.right {
      margin-right: -1rem;
      margin-left: 1rem;
    }
  }

  ${props =>
    props.primary
      ? `
    background: linear-gradient(115.8deg, #6e30f2 0%, #86e2ff 100%);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
    background-repeat: no-repeat;
    color: white;
    border: 1px solid ${Styles.faintBorderColor};

    &:hover {
      opacity: 0.7;
    }

    &:disabled {
      opacity: .5;
    }
  `
      : ''}

  ${props =>
    props.secondary
      ? `
    background: transparent;
    border-color: ${Styles.dark400};
    color: ${Styles.dark400};

    &:hover {
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.25);
      background: linear-gradient(115.8deg, #6e30f2 0%, #86e2ff 100%);
      border-color: ${Styles.faintBorderColor};
      color: white;
    }

    &:disabled {
      border-color: #919191;
      color: #919191;
      background: transparent;
    }
  `
      : ''}

  ${props =>
    props.tertiary
      ? `
      border-color: transparent;
      color: ${Styles.dark400};
      background: transparent;

      &:hover {
        color: ${Styles.purple400};
        * {
          color: ${Styles.purple400};
        }
      }

      &:disabled {
        color: #919191;
      }
  `
      : ''}

  ${props =>
    props.danger
      ? `
    border-color: ${Styles.red400};
    background: transparent;
    color: ${Styles.red400};
    &:hover {
      background-color: ${Styles.red400};
      border-color: ${Styles.red200};
      color: white;
    }
  `
      : ''}

  ${props =>
    props.icon
      ? `
      display: flex;
      align-items: center;
      padding: .25rem;
      height: 1rem;
      border: none;
      background: transparent;

      &:hover {
        i {
          color: ${Styles.purple400};
        }
      }
    `
      : ''}
`;

const ButtonPrimary: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled ? props.disabled : false}
    onClick={props.onClick && props.onClick}
    id={props.id}
    primary
    style={props.style}
    className={props.className}
  >
    {props.iconLeft && <div className="icon left">{props.iconLeft}</div>}
    {props.loading && (
      <div style={{ marginRight: '1rem', marginLeft: '-1rem' }}>
        <InlineLoading style={{ width: '30px' }} fill="white" />
      </div>
    )}
    {props.children}
    {props.iconRight && <div className="icon right">{props.iconRight}</div>}
  </Button>
);

const ButtonSecondary: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick && props.onClick}
    id={props.id}
    secondary
    style={props.style}
    className={props.className}
  >
    {props.iconLeft && <div className="icon left">{props.iconLeft}</div>}
    {props.children}
    {props.iconRight && <div className="icon right">{props.iconRight}</div>}
  </Button>
);

const ButtonTertiary: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick && props.onClick}
    id={props.id}
    tertiary
    style={props.style}
    className={props.className}
  >
    {props.iconLeft && <div className="icon left">{props.iconLeft}</div>}
    {props.children}
    {props.iconRight && <div className="icon right">{props.iconRight}</div>}
  </Button>
);

const ButtonDanger: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick && props.onClick}
    id={props.id}
    danger
    style={props.style}
    className={props.className}
  >
    {props.children}
  </Button>
);

const IconButton: React.FC<IButton> = props => (
  <Button
    disabled={props.disabled}
    onClick={props.onClick && props.onClick}
    id={props.id}
    icon
    style={props.style}
    className={props.className}
  >
    {props.children}
  </Button>
);

export { ButtonPrimary, ButtonTertiary, ButtonSecondary, ButtonDanger, IconButton };
