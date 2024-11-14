import React from 'react';

const HighlightedText = ({ children }: { children: React.ReactNode }) => (
    <span className="text-gray-900 font-medium text-sm">
    {children}
  </span>
);

export default HighlightedText;