import { cn } from "@heroui/theme";
import { IconTrash, IconUpload } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { Button } from "./Button";

export interface FileUploaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  files: File[];
  maxFiles?: number;
  onAdd?: (files: File[]) => void;
  onDelete?: (index: number) => void;
  label?: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  files,
  maxFiles,
  onDelete,
  onAdd,
  label,
  ...rest
}) => {
  const fileInput = useRef<HTMLInputElement>(null);

  const [drag, setDrag] = useState(false);

  return (
    <div
      {...rest}
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-theme-light-gray bg-theme-card p-2 text-center text-theme-gray",
        files.length === 0 && "hover:border-theme-green",
        drag && files.length === 0 && "border-theme-green",
        rest.className,
      )}
      onClick={() => fileInput.current && fileInput.current.click()}
      onDragOver={(e) => {
        e.stopPropagation();
        e.preventDefault();

        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDragEnd={() => setDrag(false)}
      onDrop={(e) => {
        e.stopPropagation();
        e.preventDefault();

        setDrag(false);

        getDroppedFiles(e);
      }}
    >
      {files && files.length > 0 ? (
        <ul className="h-full w-full space-y-2 overflow-y-auto">
          {files.map((file, i) => (
            <li
              className="flex items-center justify-between rounded-xl border border-theme-light-gray p-2"
              key={i}
            >
              <p
                className="overflow-hidden overflow-ellipsis whitespace-nowrap px-2"
                dir="ltr"
              >
                {file.name}
              </p>
              <Button
                color="danger"
                onPress={() => {
                  removeFile(i);
                }}
              >
                <IconTrash />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <>
          <IconUpload className="h-10 w-10" />
          <p className="text-lg font-light">
            {label ? label : "העלה או זרוק קבצים"}
          </p>
        </>
      )}
      <input
        className="invisible absolute bottom-0 left-0 right-0 top-0"
        type="file"
        ref={fileInput}
        onChange={getInputFiles}
        multiple
      />
    </div>
  );

  function removeFile(index: number) {
    const newFiles = [...files];

    newFiles.splice(index, 1);

    if (onDelete) onDelete(index);
  }

  function getDroppedFiles(e: React.DragEvent) {
    const { items } = e.dataTransfer;

    if (!items || items.length === 0) return;

    const newFiles: (File | null)[] = [];
    for (let i = 0; i < (maxFiles || items.length); ++i)
      if (items[i].kind === "file") newFiles.push(items[i].getAsFile());

    if (onAdd) onAdd(newFiles.filter((file) => file !== null) as File[]);
  }

  function getInputFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;

    if (!files) return;

    const newFiles: File[] = [];
    for (let i = 0; i < files.length; ++i) newFiles.push(files[i]);

    e.target.value = "";

    if (onAdd) onAdd(newFiles.filter((file) => file !== null) as File[]);
  }
};

export default FileUploader;
