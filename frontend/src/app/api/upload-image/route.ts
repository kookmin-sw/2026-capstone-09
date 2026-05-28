export async function POST(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return Response.json({ error: '인증 정보가 없습니다.' }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get('file');
  if (!(file instanceof File)) {
    return Response.json({ error: '파일이 없습니다.' }, { status: 400 });
  }

  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  const extension = file.name.split('.').pop() ?? '';

  // 1. Presigned URL 발급 (서버→백엔드, CORS 없음)
  const presignRes = await fetch(`${apiBase}/v1/files/presigned-url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify({ fileName: file.name, fileSize: file.size, contentType: file.type }),
  });

  const presignJson = await presignRes.json();
  const { fileKey, presignedUrl, uploadUrl } = presignJson.data ?? {};

  if (!fileKey || !presignedUrl || !uploadUrl) {
    return Response.json({ error: 'Presigned URL 발급 실패' }, { status: 500 });
  }

  // 2. S3 직접 PUT (서버→S3, CORS 없음)
  const s3Res = await fetch(presignedUrl, {
    method: 'PUT',
    body: await file.arrayBuffer(),
    headers: { 'Content-Type': file.type },
  });

  if (!s3Res.ok) {
    return Response.json({ error: 'S3 업로드 실패' }, { status: 500 });
  }

  // 3. 업로드 완료 확인
  await fetch(`${apiBase}/v1/files`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader },
    body: JSON.stringify({
      fileKey,
      fileName: file.name,
      fileSize: file.size,
      extension,
      contentType: file.type,
    }),
  });

  // 프로토콜 보정 + 공백 등 인코딩 (마크다운 파서가 공백 있는 URL을 이미지로 인식 못함)
  const normalizedUrl = /^https?:\/\//i.test(uploadUrl) ? uploadUrl : `https://${uploadUrl}`;
  const encodedUrl = encodeURI(normalizedUrl);

  return Response.json({ url: encodedUrl });
}
