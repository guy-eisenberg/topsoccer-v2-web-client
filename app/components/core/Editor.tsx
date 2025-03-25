import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import SimpleImage from "@editorjs/simple-image";
import { cn } from "@heroui/theme";
import { useEffect, useId, useRef, useState } from "react";

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
  json?: string;
  onReady?: (editor?: EditorJS) => void;
}

const Editor: React.FC<EditorProps> = ({ json: html, onReady, ...rest }) => {
  const containerId = useId();
  const editor = useRef<EditorJS | undefined>(undefined);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!editor.current) {
      editor.current = new EditorJS({
        holder: containerId,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
          },
          image: SimpleImage,
        },
      });

      editor.current.isReady.then(() => {
        if (onReady) onReady(editor.current);

        if (html) editor.current?.render(html as any);

        setReady(true);
      });
    }
  }, [onReady, containerId, html]);

  return (
    <div
      {...rest}
      className={cn(
        "pointer-events-none min-h-0 overflow-y-auto overflow-x-hidden opacity-0",
        ready && "pointer-events-auto opacity-100",
        rest.className,
      )}
      id={containerId}
    />
  );
};

export default Editor;
