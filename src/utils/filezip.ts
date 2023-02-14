import JSZip from "jszip"
import FileSaver from "file-saver"
import moment from "moment"

export const FileZip = async (files: File[]) => {
  const zip = new JSZip()
  files.forEach(file => {
    zip.file(file.name, file)
  })
  return zip.generateAsync({
    type: "blob",
    compression: "DEFLATE",
    compressionOptions: {
      level: 5,
    },
  })
}

export const SaveZip = async (files: File[]) => {
  FileZip(files)
    .then(FileSaver.saveAs(content, `${moment().unix()}.zip`))
    .catch(err => console.log(err))
}
