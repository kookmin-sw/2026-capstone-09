const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const asset = (path: string) => `${basePath}${path}`;
