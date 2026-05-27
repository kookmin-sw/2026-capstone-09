import { privateApi } from '@/api';

export async function uploadImage(file: File): Promise<string> {
  const extension = file.name.split('.').pop() ?? '';

  const presignRes = await privateApi.file.createPresignedUrl({
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type,
  });

  const { fileKey, presignedUrl, uploadUrl } = presignRes.data.data ?? {};
  if (!fileKey || !presignedUrl || !uploadUrl) throw new Error('Presigned URL 발급 실패');

  await fetch(presignedUrl, {
    method: 'PUT',
    body: file,
    headers: { 'Content-Type': file.type },
  });

  await privateApi.file.confirmUpload({
    fileKey,
    fileName: file.name,
    fileSize: file.size,
    extension,
    contentType: file.type,
  });

  return uploadUrl;
}
