interface ProjectDetailLinkItemProps {
  label: string;
  href: string;
  onContextMenu?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const ProjectDetailLinkItem = ({
  label,
  href,
  onContextMenu,
}: ProjectDetailLinkItemProps) => {
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${href}&sz=64`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onContextMenu={onContextMenu}
      className="hover:bg-fill-normal flex items-center gap-2 rounded-md px-2 py-1 transition-colors"
    >
      <img src={faviconUrl} alt={`${label} favicon`} className="h-5 w-5 shrink-0" />
      <span className="text-caption-1 text-label-neutral font-semibold">{label}</span>
    </a>
  );
};
