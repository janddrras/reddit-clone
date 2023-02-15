import { useState } from 'react'

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>()

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader()
    const url = event.target.files?.[0]
    if (url) {
      reader.readAsDataURL(url)
    }
    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result as string)
      }
    }
  }
  return { selectedFile, setSelectedFile, onSelectFile }
}
export default useSelectFile
