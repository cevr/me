import React from 'react';

const ExternalLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = props => (
  <a target="_blank" rel="noopener noreferrer" {...props} />
);

export default ExternalLink;
