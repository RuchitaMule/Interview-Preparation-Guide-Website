



import React from "react";

export const Checkbox = ({ id, checked, onChange }) => {
    return (
        <input
            type="checkbox"
            id={id}
            checked={checked}
            onChange={onChange}
            className="cursor-pointer"
        />
    );
};
