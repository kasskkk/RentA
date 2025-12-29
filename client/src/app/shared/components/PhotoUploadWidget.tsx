import { useCallback, useRef, useState } from "react"
import { useDropzone } from 'react-dropzone'
import Cropper, { type ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

type Props = {
    uploadPhoto: (file: Blob) => void
    loading: boolean
}

export default function PhotoUploadWidget({ uploadPhoto, loading }: Props) {
    const [files, setFiles] = useState<(File & { preview: string; })[]>([]);
    const cropperRef = useRef<ReactCropperElement>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file as Blob)
        })))
    }, []);

    const onCrop = useCallback(() => {
        const cropper = cropperRef.current?.cropper;
        cropper?.getCroppedCanvas().toBlob(blob => {
            uploadPhoto(blob as Blob);
        })
    }, [uploadPhoto])

    const { getRootProps, getInputProps } = useDropzone({ onDrop })
    return (
        <div className="grid grid-cols-3">
            <fieldset className="fieldset">
                <legend className="fieldset-legend">Pick a file or drop</legend>

                <div {...getRootProps()}>
                    <input {...getInputProps()} className="hidden" />

                    {/* <input type="file" className="file-input" readOnly /> */}
                    <div className="file-input">
                        <div className="bg-base-200 text-base-content px-2 py-1 w-27 flex justify-center">Select file</div>
                        <div className="px-5">
                            {files[0]?.name ? (
                                <div>{files[0].name}</div>
                            ) : (
                                <div>No file selected</div>
                            )}
                        </div>
                    </div>

                </div>
            </fieldset>

            <div>
                <div>Step 2 - Resize</div>
                {files[0]?.preview &&
                    <Cropper
                        src={files[0].preview}
                        style={{ height: 300, width: 300 }}
                        initialAspectRatio={1}
                        aspectRatio={1}
                        preview='.img-preview'
                        guides={false}
                        viewMode={1}
                        background={false}
                        ref={cropperRef}
                    />
                }
            </div>
            <div>
                <div>Step 3 - Preview</div>
                {files[0]?.preview &&
                    <div className="img-preview w-75 h-75 overflow-hidden" />
                }
                <button onClick={onCrop} className="btn btn-primary" disabled={loading}>Upload</button>
            </div>
        </div>
    )
}
