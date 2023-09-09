import React, { createContext, useContext, useState } from 'react';

// Create a context for the navigation component
const NavigationContext = createContext();

// Custom hook to access the navigation component from any child component
export function useNavigation() {
  return useContext(NavigationContext);
}

// NavigationProvider component to wrap your entire application
export function NavigationProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('Home'); // Example: Current page state

  // You can define navigation functions and state here

  return (
    <NavigationContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        // Add other navigation-related functions or state here
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
