// src/components/ui/button.js
import React from "react";

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  onClick,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "rounded-md font-medium transition-colors focus:outline-none";

  const variants = {
    default: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
    outline:
      "border border-gray-300 bg-white hover:bg-gray-50 disabled:bg-gray-50 text-gray-700",
  };

  const sizes = {
    default: "px-4 py-2",
    icon: "p-2 w-9 h-9",
    sm: "px-3 py-1 text-sm",
    lg: "px-6 py-3 text-lg",
  };

  const variantStyle = variants[variant] || variants.default;
  const sizeStyle = sizes[size] || sizes.default;

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyle} ${sizeStyle} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
