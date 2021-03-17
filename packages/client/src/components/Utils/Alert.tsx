/** @jsxImportSource @emotion/react */
import React from 'react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import alertStyles from './styles/alertStyles';

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
