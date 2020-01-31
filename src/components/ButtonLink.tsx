import clsx from 'clsx';

import ExternalLink from './ExternalLink';

const ButtonLink: React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>> = ({
  className,
  ...props
}) => (
  <>
    <ExternalLink className={clsx('paragraph-link', className)} {...props} />
    <style jsx>{`
      :global(.paragraph-link) {
        color: var(--highlight);
        padding: 2px 10px;
        background-color: var(--link-bg);
        border-radius: 6px;
        transition: background-color var(--transition);
        white-space: nowrap;
      }
      :global(.paragraph-link:hover) {
        background-color: var(--highlight);
        color: var(--link-hover-fg);
      }
    `}</style>
  </>
);

export default ButtonLink;
