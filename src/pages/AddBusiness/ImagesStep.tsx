
import React, { useState } from 'react';
import { FiTrash2, FiImage, FiCheck, FiAlertCircle, FiX } from 'react-icons/fi';

interface ImagesStepProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  coverImageIndex: number;
  setCoverImageIndex: React.Dispatch<React.SetStateAction<number>>;
  disabled?: boolean;
}

interface ImageUploaderProps {
  images: File[];
  maxFiles: number;
  onError: (message: string) => void;
  onAddImages: (newFiles: File[]) => void;
  disabled?: boolean;
}

interface ImagePreviewProps {
  image: File;
  index: number;
  isCover: boolean;
  setAsCover: () => void;
  disabled?: boolean;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ image, index, isCover, setAsCover, disabled }) => {
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [image]);
  return (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-700">Image Preview #{index + 1}</h3>
        <button
          type="button"
          onClick={setAsCover}
          className={`flex items-center px-3 py-1.5 rounded-md text-sm ${
            isCover
              ? 'bg-green-100 text-green-800'
              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
          }`}
          disabled={disabled}
        >
          {isCover ? (
            <>
              <FiCheck className="mr-1.5" /> Cover Image
            </>
          ) : (
            'Set as Cover'
          )}
        </button>
      </div>
      <div className="flex justify-center">
        {previewUrl && (
          <img
            src={previewUrl}
            alt={`Selected business image ${index}`}
            className="max-h-64 rounded-lg border border-gray-200 shadow-sm"
          />
        )}
      </div>
    </div>
  );
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ images, maxFiles, onError, onAddImages, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const validateImage = async (file: File): Promise<boolean> => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      onError(`Invalid file type: ${file.name}. Only JPEG/PNG images are allowed.`);
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      onError(`Image ${file.name} exceeds 5MB size limit`);
      return false;
    }
    return new Promise((resolve) => {
      const img = new window.Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(true);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        onError(`Invalid image file: ${file.name}`);
        resolve(false);
      };
    });
  };

  const handleFileProcessing = async (files: FileList) => {
    const selectedFiles = Array.from(files).slice(0, maxFiles - images.length);
    const validFiles: File[] = [];
    for (const file of selectedFiles) {
      const isValid = await validateImage(file);
      if (isValid) validFiles.push(file);
    }
    if (validFiles.length > 0) onAddImages(validFiles);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileProcessing(e.target.files);
      e.target.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = async (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileProcessing(e.dataTransfer.files);
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Upload Images (Max {maxFiles}, JPEG/PNG only, max 5MB each)
      </label>
      <div className="flex items-center justify-center w-full">
        <label
          className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50 shadow-inner'
              : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center p-5 text-center">
            <FiImage className="w-10 h-10 mb-3 text-gray-400" />
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-700">Drag & drop images here</span><br />
              or <span className="text-blue-600 hover:text-blue-800">browse files</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supported: JPEG, PNG • Max 5MB each
            </p>
          </div>
          <input
            type="file"
            multiple
            onChange={handleUpload}
            className="hidden"
            accept="image/jpeg,image/png,image/webp"
            disabled={disabled}
          />
        </label>
      </div>
    </div>
  );
};

const ImagesStep: React.FC<ImagesStepProps> = ({ images, setImages, coverImageIndex, setCoverImageIndex, disabled }) => {
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const removeImage = (index: number) => {
    if (images.length <= 1) {
      setError('At least one image is required.');
      return;
    }
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    if (coverImageIndex === index) {
      setCoverImageIndex(0);
    } else if (coverImageIndex > index) {
      setCoverImageIndex(coverImageIndex - 1);
    }

    if (selectedImage === index) setSelectedImage(null);
    else if (selectedImage !== null && selectedImage > index) setSelectedImage(selectedImage - 1);
    setError(null);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Business Images</h2>
      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg flex items-start border border-red-200">
          <FiAlertCircle className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-700 hover:text-red-900"
            aria-label="Dismiss error"
          >
            <FiX size={18} />
          </button>
        </div>
      )}
      <ImageUploader
        images={images}
        maxFiles={10}
        onError={setError}
        onAddImages={files => setImages(prev => [...prev, ...files])}
        disabled={disabled}
      />
      {images.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${image.lastModified}-${index}`}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                  coverImageIndex === index
                    ? 'border-green-500'
                    : selectedImage === index
                    ? 'border-blue-500'
                    : 'border-gray-200'
                }`}
                onClick={() => setSelectedImage(index)}
                tabIndex={0}
                aria-label={`Select image ${index + 1}`}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Business ${index}`}
                  className="w-full h-full object-cover"
                  onLoad={e => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                />
                {coverImageIndex === index && (
                  <div className="absolute top-1 left-1 bg-green-500 text-white text-[10px] px-1.5 py-0.5 rounded-md shadow">
                    Cover
                  </div>
                )}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full transition-colors"
                  aria-label="Remove image"
                  disabled={disabled}
                >
                  <FiTrash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          {selectedImage !== null && images[selectedImage] && (
            <ImagePreview
              image={images[selectedImage]}
              index={selectedImage}
              isCover={coverImageIndex === selectedImage}
              setAsCover={() => {
                if (selectedImage === null || !images[selectedImage]) {
                  setError('Select a valid image to set as cover.');
                  return;
                }
                setCoverImageIndex(selectedImage);
                setError(null);
              }}
              disabled={disabled}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ImagesStep;