import { useCallback, useRef, useState } from "react";
import { useDropzone } from 'react-dropzone';
import { Cropper, type ReactCropperElement } from "react-cropper"; // Dodano Cropper
import "cropperjs/dist/cropper.css";
import { PhotoIcon, ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

type Props = {
    uploadPhoto: (file: Blob) => void;
    loading: boolean;
};

export default function PhotoApartmentUploadWidget({ uploadPhoto, loading }: Props) {
    const [files, setFiles] = useState<(File & { preview: string })[]>([]);
    const cropperRef = useRef<ReactCropperElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file as Blob)
        })));
    }, [files]);

    const onCrop = useCallback(() => {
        // 1. Sprawdzamy czy cropper istnieje
        const cropper = cropperRef.current?.cropper;
        if (!cropper) {
            console.error("Cropper nie jest zainicjalizowany!");
            return;
        }

        // 2. Pobieramy Blob z croppera
        cropper.getCroppedCanvas().toBlob((blob) => {
            if (blob) {
                console.log("Blob wygenerowany, wysyłam...", blob);
                uploadPhoto(blob);
                // Opcjonalnie: wyczyść podgląd po wysłaniu
                // setFiles([]); 
            }
        }, 'image/jpeg', 0.9); // jakość 90%
    }, [uploadPhoto]);

    const removeFile = () => setFiles([]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        multiple: false,
        accept: {'image/*': []}
    });

    return (
        <div className="bg-base-100 p-4 rounded-2xl border border-base-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. SEKCJA WYBORU */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase opacity-50 text-center block">1. Wybierz plik</label>
                    <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-6 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[250px] ${isDragActive ? "border-primary bg-primary/5" : "border-base-300 hover:border-primary/50"}`}>
                        <input {...getInputProps()} />
                        <PhotoIcon className="w-10 h-10 mb-2 opacity-20" />
                        <p className="text-xs text-center opacity-70">Kliknij lub upuść zdjęcie</p>
                    </div>
                </div>

                {/* 2. SEKCJA KADROWANIA I PREVIEW */}
                <div className="space-y-3">
                    <label className="text-xs font-bold uppercase opacity-50 text-center block">2. Dostosuj i wyślij</label>
                    <div className="relative rounded-xl overflow-hidden bg-base-300 min-h-[250px] border border-base-300">
                        {files.length > 0 ? (
                            <>
                                {/* KLUCZOWA ZMIANA: Dodany komponent Cropper */}
                                <Cropper
                                    src={files[0].preview}
                                    style={{ height: 250, width: "100%" }}
                                    initialAspectRatio={16 / 9}
                                    aspectRatio={16 / 9} // Sztywne proporcje dla galerii
                                    guides={true}
                                    ref={cropperRef}
                                    viewMode={1}
                                    autoCropArea={1}
                                    background={false}
                                    responsive={true}
                                />
                                <button onClick={removeFile} className="absolute top-2 right-2 btn btn-circle btn-xs btn-error z-10">
                                    <XMarkIcon className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center justify-center h-[250px] italic text-xs opacity-40">Brak wybranego zdjęcia</div>
                        )}
                    </div>

                    <button 
                        onClick={onCrop} 
                        className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                        disabled={loading || files.length === 0}
                    >
                        {!loading && <ArrowUpTrayIcon className="w-5 h-5 mr-2" />}
                        {loading ? "Przetwarzanie..." : "Wgraj na serwer"}
                    </button>
                </div>
            </div>
        </div>
    );
}