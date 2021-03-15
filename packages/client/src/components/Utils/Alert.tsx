/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';

const alertStyles = css`
  position: fixed;
  top: 0;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  z-index: 9999;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 400;
  text-align: center;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  padding: 0.8rem 3rem;
  -webkit-box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.25);
  box-shadow: 0 2rem 4rem rgba(0, 0, 0, 0.25);
`;

export const Alert: React.FC = () => {
  const alert = useTypedSelector((state) => {
    return state.alerts;
  });

  return (
    <div
      style={{
        display: alert.displayMode,
        backgroundColor: alert.alertType === 'error' ? '#eb4d4b' : '#53c93e',
      }}
      css={alertStyles}
    >
      {alert.message}
    </div>
  );
};
