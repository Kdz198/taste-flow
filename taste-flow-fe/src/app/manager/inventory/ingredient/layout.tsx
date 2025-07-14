import React from "react";

interface ManagerIngredientLayoutProps {
  children: React.ReactNode;
}

const ManagerIngredientLayout: React.FC<ManagerIngredientLayoutProps> = ({ children }) => {
  return <>{children}</>;
};

export default ManagerIngredientLayout;
