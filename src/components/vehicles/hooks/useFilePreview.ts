
import { useState, useEffect } from 'react';

interface UseFilePreviewProps {
  file: File | null;
}

export function useFilePreview({ file }: UseFilePreviewProps) {
  const [preview, setPreview] = useState<string | null>(null);
  
  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setPreview(fileUrl);
      
      return () => {
        if (preview) URL.revokeObjectURL(preview);
      };
    }
  }, [file]);

  return { preview };
}
