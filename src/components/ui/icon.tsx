import IconSrc from '../../assets/icon.png';

export function Icon({ className }: { className?: string }) {
  return <img className={className} src={IconSrc} />;
}
