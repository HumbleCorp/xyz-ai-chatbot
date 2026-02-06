import Image from "next/image";
import {
  FileText,
  FileCode,
  FileSpreadsheet,
  File as FileIcon,
} from "lucide-react";
import type { Attachment } from "@/lib/types";
import { getFileTypeCategory } from "@/lib/constants/file-types";
import { Loader } from "./elements/loader";
import { CrossSmallIcon } from "./icons";
import { Button } from "./ui/button";

const getFileIcon = (contentType: string) => {
  const category = getFileTypeCategory(contentType);

  switch (category) {
    case "document":
      return <FileText className="size-8 text-muted-foreground" />;
    case "text":
      return <FileText className="size-8 text-muted-foreground" />;
    case "code":
      return <FileCode className="size-8 text-muted-foreground" />;
    case "office":
      if (contentType.includes("spreadsheet") || contentType.includes("excel")) {
        return <FileSpreadsheet className="size-8 text-muted-foreground" />;
      }
      return <FileText className="size-8 text-muted-foreground" />;
    default:
      return <FileIcon className="size-8 text-muted-foreground" />;
  }
};

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  onRemove?: () => void;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div
      className="group relative size-16 overflow-hidden rounded-lg border bg-muted"
      data-testid="input-attachment-preview"
    >
      {contentType?.startsWith("image") ? (
        <Image
          alt={name ?? "An image attachment"}
          className="size-full object-cover"
          height={64}
          src={url}
          width={64}
        />
      ) : (
        <div className="flex size-full flex-col items-center justify-center gap-1 p-2">
          {getFileIcon(contentType)}
        </div>
      )}

      {isUploading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          data-testid="input-attachment-loader"
        >
          <Loader size={16} />
        </div>
      )}

      {onRemove && !isUploading && (
        <Button
          className="absolute top-0.5 right-0.5 size-4 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
          size="sm"
          variant="destructive"
        >
          <CrossSmallIcon size={8} />
        </Button>
      )}

      <div className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/80 to-transparent px-1 py-0.5 text-[10px] text-white">
        {name}
      </div>
    </div>
  );
};
