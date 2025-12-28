// import { useCallback } from "react"
// import { useDropzone } from 'react-dropzone'

// export default function PhotoUploadWidget() {
//     const onDrop = useCallback((acceptedFiles: File[]) => {
//         console.log(acceptedFiles)
//     }, [])
//     const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })
//     return (
//         <div className="grid grid-cols-3 gap-10">
//             <div className="card">
//                 <span>Step1 - ADD PHOTO</span>
//                 <div {...getRootProps()}>
//                     <input {...getInputProps()} />
//                     {
//                         isDragActive ?
//                             <p>Drop the files here ...</p> :
//                             <p>Drag 'n' drop some files here, or click to select files</p>
//                     }
//                 </div>
//             </div>
//             <div>Step2 - RESIZE</div>
//             <div>Step3 - PREVIEW</div>
//         </div>
//     )
// }
