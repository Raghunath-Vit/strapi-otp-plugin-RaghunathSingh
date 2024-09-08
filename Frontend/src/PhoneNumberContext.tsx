import React, { createContext, useContext, useState } from 'react';

interface PhoneNumberContextProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
}

const PhoneNumberContext = createContext<PhoneNumberContextProps | undefined>(undefined);

export const usePhoneNumber = () => {
  const context = useContext(PhoneNumberContext);
  if (!context) {
    throw new Error('usePhoneNumber must be used within a PhoneNumberProvider');
  }
  return context;
};

export const PhoneNumberProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  return (
    <PhoneNumberContext.Provider value={{ phoneNumber, setPhoneNumber }}>
      {children}
    </PhoneNumberContext.Provider>
  );
};
