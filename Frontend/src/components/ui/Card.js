

import React from "react";

export const Card = ({ children, className }) => {
    return <div className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow ${className}`}>{children}</div>;
};

export const CardContent = ({ children }) => {
    return <div className="p-4">{children}</div>;
};
