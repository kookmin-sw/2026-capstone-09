import { authStorage } from '@/api/authStorage';

export async function uploadImage(file: File): Promise<string> {
  const token = authStorage.getAccess();

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch('/api/upload-image', {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });

  if (!res.ok) throw new Error('이미지 업로드에 실패했습니다.');

  const json = (await res.json()) as { url?: string };
  if (!json.url) throw new Error('업로드 URL을 받지 못했습니다.');

  return json.url;
}
