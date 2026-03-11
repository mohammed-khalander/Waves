import { CopyCheckIcon, CopyIcon, FolderIcon, FolderOpen } from "lucide-react";
import { useState, useCallback } from "react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { CodeView } from "@/components/code-view";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";



type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();
  return extension || "text";
};


interface FileExplorerProps {
  files: FileCollection;
};

export const FileExplorer = ({
  files,
}: FileExplorerProps) => {



  const [copied, setCopied] = useState(false);

  const [selectedFile, setSelectedFile] = useState<string | null>(()=>{
    const file = Object.keys(files);
    if(file && file.length>0){
      return file[0];
    }
    return null;
  });



  const handleFileSelect = useCallback((filePath: string) => {
    if (files[filePath]) {
      setSelectedFile(filePath);
    }
  }, [files]);

  const handleCopy = useCallback(() => {
    if (selectedFile) {
      navigator.clipboard.writeText(files[selectedFile]);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [selectedFile, files]);




  return (
    <ResizablePanelGroup orientation="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar flex flex-col items-center pt-3 gap-y-2 ">

      {
        Object.keys(files).map((fileName)=>{
          return(
            <Button variant="outline" className="w-[80%]" onClick={()=>{ handleFileSelect(fileName) }} key={fileName} >
              {
                fileName==selectedFile ?
                <FolderOpen/>:
                <FolderIcon/> 
              }
              <span className="pl-2"> {fileName} </span>

            </Button>
          )
        })
      }


      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={50}>
        {selectedFile && files[selectedFile] ? (
          <div className="h-full w-full flex flex-col">
            <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
              {selectedFile}
              <Hint text="Copy to clipboard" side="bottom">
                <Button
                  variant="outline"
                  size="icon"
                  className="ml-auto"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? <CopyCheckIcon /> : <CopyIcon />}
                </Button>
              </Hint>
            </div>
            <div className="flex-1 overflow-auto">
              <CodeView
                code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view its content
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  )
};