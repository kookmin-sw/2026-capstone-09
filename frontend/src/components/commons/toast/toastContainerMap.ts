// placement마다 DOM <div>를 하나씩 만들어 document.body에 붙이기 위해 사용
import styles from './toast.module.css';
import type { ToastPlacement } from './toast.types';

const containerMap = new Map<ToastPlacement, HTMLDivElement>();

export function getOrCreateContainer(placement: ToastPlacement): HTMLDivElement {
  if (containerMap.has(placement)) return containerMap.get(placement)!;

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
