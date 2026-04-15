import type { OnlineUserTypes } from '@/app/(project)/projects/[projectId]/_component/OnlineUsers';

export const EXAMPLE_PROJECT_SIDEBAR_PROFILE = {
  projectName: '플로밋 기획',
  userName: '황수민',
  userEmail: 'tnals655@naver.com',
} as const;

export const EXAMPLE_PROJECT_DETAIL_LINKS = [
  { id: 'link-1', label: 'Notion', href: 'https://www.notion.so/' },
  { id: 'link-2', label: 'Figma', href: 'https://www.figma.com/' },
  { id: 'link-3', label: 'Docs', href: 'https://docs.google.com/' },
  { id: 'link-4', label: 'Vercel', href: 'https://vercel.com/dashboard' },
] as const;

export const EXAMPLE_ONLINE_USERS: OnlineUserTypes[] = [
  { name: '황수민', email: 'tnals655@kookmin.ac.kr' },
  { name: '박건민', email: 'parkkunmin@kookmin.ac.kr' },
  { name: '윤신지', email: 'shinji@kookmin.ac.kr' },
  { name: '백채린', email: 'chaerin@kookmin.ac.kr' },
  { name: '윤성욱', email: 'seonguk@kookmin.ac.kr' },
  { name: '박정은', email: 'jeongeun@kookmin.ac.kr' },
];
