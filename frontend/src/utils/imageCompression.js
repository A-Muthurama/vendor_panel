/**
 * Compresses an image file using browser Canvas API.
 * Reduces dimensions to max 1280px and quality to 0.7.
 * 
 * @param {File} file - The image file to compress
 * @returns {Promise<File>} - Compressed file
 */
export const compressImage = async (file) => {
    // If not an image, return original
    if (!file.type.startsWith('image/')) {
        return file;
    }

    // If very small (< 500KB), return original
    if (file.size < 500 * 1024) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Resize logic (Max 1280px)
                const MAX_WIDTH = 1280;
                const MAX_HEIGHT = 1280;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // Compress to JPEG with 0.7 quality
                canvas.toBlob((blob) => {
                    if (!blob) {
                        // Fallback to original if compression fails
                        resolve(file);
                        return;
                    }

                    const compressedFile = new File([blob], file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now(),
                    });

                    resolve(compressedFile);
                }, 'image/jpeg', 0.7);
            };

            img.onerror = (err) => reject(err);
        };

        reader.onerror = (err) => reject(err);
    });
};
