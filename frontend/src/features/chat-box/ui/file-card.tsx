import { Card } from "@heroui/react"
import { FileIcon, ImageIcon, VideoIcon, Music, FileTextIcon } from "lucide-react"

interface FileCardProps {
  fileName: string
}

const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

const getFileIcon = (fileName: string) => {
  const extension = getFileExtension(fileName)
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return <ImageIcon className="w-8 h-8" />
    case 'mp4':
    case 'avi':
    case 'mov':
      return <VideoIcon className="w-8 h-8" />
    case 'mp3':
    case 'wav':
      return <Music className="w-8 h-8" />
    case 'txt':
    case 'doc':
    case 'docx':
    case 'pdf':
      return <FileTextIcon className="w-8 h-8" />
    default:
      return <FileIcon className="w-8 h-8" />
  }
}

const FileCard = ({ fileName }: FileCardProps) => {
  return (
    <Card className="w-24 h-24 flex flex-col items-center justify-center p-2 hover:bg-primary/5 transition-colors text-foreground-secondary">
      {getFileIcon(fileName)}
      <p className="text-xs mt-2 text-center truncate w-full">
        {fileName}
      </p>
    </Card>
  )
}

export default FileCard 