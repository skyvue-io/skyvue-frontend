import React from "react";
import styled from 'styled-components/macro';
import Styles from "styles/Styles";

interface IText {
  id?: string;
  size: string;
  len: string;
  style?: React.CSSProperties;
}

const TextContainer = styled.p<{
  size: string;
  len: string;
  danger?: boolean;
}>`
  ${props =>
    props.danger ? `color: ${Styles.red};` : ''
  }
  ${props => 
    props.size === "sm" && props.len === "short" ? `
      font-size: 0.875rem;
      letter-spacing: 0.16px;
      line-height: 1.125rem;
    ` : '' 
  }
  ${props =>
    props.size === "sm" && props.len === "long" ? `
      font-size: 0.875rem;
      letter-spacing: 0.16px;
      line-height: 1.25rem;
    ` : ''
  }
  ${props =>
    props.size === "lg" && props.len === "short" ? `
      font-size: 1rem;
      letter-spacing: 0.16px;
      line-height: 1.375rem;
    ` : ''
  }
  ${props =>
    props.size === "lg" && props.len === "long" ? `
      font-size: 1rem;
      letter-spacing: 0.16px;
      line-height: 1.5rem;
    ` : ''
  }

`;

const Text: React.FC<IText> = (props) => {
  return (
    <TextContainer style={props.style} id={props.id} size={props.size} len={props.len}>
      {props.children}
    </TextContainer>
  );
};

const DangerText: React.FC<IText> = props => {
  return (
    <TextContainer danger style={props.style} id={props.id} size={props.size} len={props.len}>
      {props.children}
    </TextContainer>
  )
}

const LabelContainer = styled.span`
  display: flex;
  font-weight: 600;
`;

const Label: React.FC<{
  id?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = props => {
  return (
    <LabelContainer id={props.id}>{props.children}</LabelContainer>
  )
}

const HelperContainer = styled.p`
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 400;
  letter-spacing: 0.32px;
`;

const Helper: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ style, children }) => {
  return <HelperContainer style={style}>{children}</HelperContainer>;
};

export { Text, Helper, DangerText, Label };