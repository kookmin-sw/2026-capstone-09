// placement마다 DOM <div>를 하나씩 만들어 document.body에 붙이기 위해 사용
import styles from './toast.module.css';
import type { ToastPlacement } from './toast.types';

export const containerMap = new Map<ToastPlacement, HTMLDivElement>();

export function getOrCreateContainer(placement: ToastPlacement): HTMLDivElement {
  const cached = containerMap.get(placement);
  if (cached) return cached;

  const [vertical, horizontal] = placement.split('-') as [
    'top' | 'bottom',
    'left' | 'center' | 'right',
  ];

  const el = document.createElement('div');
  el.className = [styles.container, styles[vertical], styles[horizontal]].join(' ');
  document.body.appendChild(el);
  containerMap.set(placement, el);
  return el;
}

export function cleanupUnusedContainers(usedPlacements: Set<ToastPlacement>) {
  containerMap.forEach((el, placement) => {
    if (!usedPlacements.has(placement)) {
      document.body.removeChild(el);
      containerMap.delete(placement);
    }
  });
}
