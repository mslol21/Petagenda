
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleIcon?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, titleIcon }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="p-4 border-b border-gray-200 flex items-center">
            {titleIcon && <div className="mr-3 text-primary">{titleIcon}</div>}
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
