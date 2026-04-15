import { useState } from 'react';
import heic2any from 'heic2any';

/**
 * Returns { preview, converting, handleImageChange }
 * - handleImageChange: use as onChange on the file input
 * - preview: object URL for the selected/converted image
 * - converting: true while HEIC is being converted
 * - getFile: returns the final File object ready to upload
 */
export const useImageUpload = () => {
  const [preview, setPreview] = useState(null);
  const [converting, setConverting] = useState(false);
  const [file, setFile] = useState(null);

  const handleImageChange = async (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isHeic =
      selected.type === 'image/heic' ||
      selected.type === 'image/heif' ||
      selected.name.toLowerCase().endsWith('.heic') ||
      selected.name.toLowerCase().endsWith('.heif');

    if (isHeic) {
      setConverting(true);
      try {
        const converted = await heic2any({ blob: selected, toType: 'image/jpeg', quality: 0.85 });
        const jpeg = Array.isArray(converted) ? converted[0] : converted;
        const jpegFile = new File([jpeg], selected.name.replace(/\.heic$/i, '.jpg').replace(/\.heif$/i, '.jpg'), { type: 'image/jpeg' });
        setFile(jpegFile);
        setPreview(URL.createObjectURL(jpegFile));
      } catch {
        // fallback — let the server deal with it
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
      } finally {
        setConverting(false);
      }
    } else {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  return { preview, converting, file, handleImageChange };
};
