// src/contexts/MicSensitivityContext.jsx
import React, { createContext, useContext, useState } from 'react';

const MicSensitivityContext = createContext();

export const MicSensitivityProvider = ({ children }) => {
  const [sensitivity, setSensitivity] = useState(1.0);
  return (
    <MicSensitivityContext.Provider value={{ sensitivity, setSensitivity }}>
      {children}
    </MicSensitivityContext.Provider>
  );
};

export const useMicSensitivity = () => {
  const context = useContext(MicSensitivityContext);
  if (!context) {
    throw new Error('useMicSensitivity must be used within a MicSensitivityProvider');
  }
  return context;
};
