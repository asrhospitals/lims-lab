import React, { useState } from "react";

export const Dialog = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

export const DialogTrigger = ({ children, asChild, setIsOpen }) => {
  return React.cloneElement(children, {
    onClick: () => setIsOpen(true),
  });
};

export const DialogContent = ({ children, isOpen, setIsOpen, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-white rounded-lg shadow-md p-6 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogFooter = ({ children }) => (
  <div className="mt-4 flex justify-end">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-bold">{children}</h2>
);

export const DialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600">{children}</p>
);
