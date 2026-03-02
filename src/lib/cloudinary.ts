const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export async function uploadImage(file: File, folder = 'sarasavi-viharaya'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', folder);

    const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
    if (!res.ok) {
        const err = await res.text();
        throw new Error(`Upload failed: ${err}`);
    }
    const data = await res.json();
    return data.secure_url as string;
}

export async function uploadImages(files: File[], folder = 'sarasavi-viharaya'): Promise<string[]> {
    const uploads = files.map(f => uploadImage(f, folder));
    return Promise.all(uploads);
}

export async function uploadImagesWithProgress(
    files: File[],
    folder: string,
    onProgress: (completed: number, total: number, elapsedMs: number) => void,
): Promise<string[]> {
    const total = files.length;
    const urls: string[] = [];
    const startTime = Date.now();
    for (let i = 0; i < total; i++) {
        onProgress(i, total, Date.now() - startTime);
        const url = await uploadImage(files[i], folder);
        urls.push(url);
    }
    onProgress(total, total, Date.now() - startTime);
    return urls;
}
