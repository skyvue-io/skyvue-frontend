import { Label } from 'components/ui/Typography';
import useHandleClickOutside from 'hooks/useHandleClickOutside';
import React, { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components/macro';
import Styles from 'styles/Styles';
import logo from 'images/white_bg.svg';

const CustomerNavContainer = styled.div<{ wide?: boolean }>`
  top: 0;
  z-index: 1000;
  display: flex;
  position: sticky;
  background: white;
  padding: ${Styles.defaultPadding};
  box-shadow: ${Styles.xsBoxShadow};
  margin: 0 auto;
  width: 100%;
  max-height: 4rem;
  .customer-nav__icon {
    transition-duration: 0.2s;
    font-size: 1.25rem;
    font-weight: bold;
  }

  .inner {
    max-width: ${props => (props.wide ? '100%' : Styles.defaultMaxWidth)};
    padding: ${props => (props.wide ? '0 2rem' : '')};
    display: flex;
    width: 100%;
    margin: 0 auto;
    align-items: center;
  }
`;

const UserDropdownContainer = styled.div<{ dropdownOpen: boolean }>`
  display: flex;
  margin-left: auto;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  padding: 0.25rem;
  border-radius: 50%;
  cursor: pointer;
  i {
    color: white;
  }
  background: linear-gradient(115.8deg, #6e30f2 0%, #86e2ff 100%);

  ${props => (props.dropdownOpen ? `box-shadow: ${Styles.boxShadow};` : '')}
  &:hover {
    box-shadow: ${Styles.boxShadow};
  }
`;

const UserDropdownExpanded = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-bottom: -13rem;
  margin-left: -14rem;
  background: white;
  padding: 1rem;
  width: 16rem;
  text-align: left;
  box-shadow: ${Styles.smBoxShadow};
  border-radius: ${Styles.defaultBorderRadius};
  border: 1px solid ${Styles.faintBorderColor};

  #email__label {
    width: 100%;
    padding-bottom: 1rem;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  }

  a {
    &:first-of-type {
      margin-top: 0.25rem;
    }
    text-decoration: none;
    height: 2rem;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    i {
      margin-right: 1rem;
      color: initial;
    }

    &:hover {
      font-weight: bold;
    }
  }

  a.active {
    color: ${Styles.purple400};
    font-weight: bold;
    * {
      color: ${Styles.purple400};
    }
  }
`;

const LogoContainer = styled.div`
  display: flex;
  height: 2rem;
  width: 6rem;
  justify-content: flex-start;
  transition-duration: ${Styles.defaultTransitionDuration};

  img {
    height: 100%;
    width: 100%;
    transition-duration: ${Styles.defaultTransitionDuration};
  }

  &:hover {
    img {
      opacity: 0.6;
    }
  }
`;

const CustomerNav: React.FC<{
  email: string;
  wide?: boolean;
}> = ({ email, wide }) => {
  const [dropdownOpen, toggleDropdownOpen] = useState(false);
  const expandedRef = useRef<HTMLDivElement>(null);
  useHandleClickOutside(expandedRef, () => toggleDropdownOpen(false));
  const location = useLocation();

  return (
    <CustomerNavContainer wide={wide}>
      <div className="inner">
        <Link style={{ textDecoration: 'none' }} to="/home">
          <LogoContainer>
            <img alt="" src={logo} />
          </LogoContainer>
        </Link>
        <UserDropdownContainer
          ref={expandedRef}
          onClick={() => toggleDropdownOpen(!dropdownOpen)}
          dropdownOpen={dropdownOpen}
        >
          <i className="fad fa-user" />
          {dropdownOpen && (
            <UserDropdownExpanded>
              <Label id="email__label">{email}</Label>
              <Link
                className={`${
                  location.pathname === '/home/account' ? 'active' : ''
                }`}
                to="/home/account"
              >
                <i className="fad fa-user" />
                Account
              </Link>
              <Link to="/logout">
                <i className="fad fa-sign-out-alt" />
                Logout
              </Link>
            </UserDropdownExpanded>
          )}
        </UserDropdownContainer>
      </div>
    </CustomerNavContainer>
  );
};

export default CustomerNav;
