"use client";

import { useControllableState } from "@/hooks/useControllableState";
import {
    HTMLAttributes,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import Dropzone, {
    type DropzoneProps,
    type FileRejection,
} from "react-dropzone";
import { useToast } from "./ui/use-toast";
import { cn, formatBytes } from "@/lib/utils";
import { Upload } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import Papa from "papaparse";
import { Dialog, DialogTrigger } from "./ui/dialog";
import FileUploadDialog from "./FileUploadDialog";

interface FileUploaderProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * Value of the uploader.
     * @type File[]
     * @default undefined
     * @example value={files}
     */
    value?: File[];

    /**
     * Accepted file types for the uploader.
     * @type { [key: string]: string[]}
     * @default
     * ```ts
     * { "image/*": [] }
     * ```
     * @example accept={["image/png", "image/jpeg"]}
     */
    accept?: DropzoneProps["accept"];

    /**
     * Maximum file size for the uploader.
     * @type number | undefined
     * @default 1024 * 1024 * 2 // 2MB
     * @example maxSize={1024 * 1024 * 2} // 2MB
     */
    maxSize?: DropzoneProps["maxSize"];

    /**
     * Maximum number of files for the uploader.
     * @type number | undefined
     * @default 1
     * @example maxFileCount={4}
     */
    maxFileCount?: DropzoneProps["maxFiles"];

    /**
     * Whether the uploader should accept multiple files.
     * @type boolean
     * @default false
     * @example multiple
     */
    multiple?: boolean;

    /**
     * Whether the uploader is disabled.
     * @type boolean
     * @default false
     * @example disabled
     */
    disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
    const {
        value: valueProp,
        accept = {
            "text/csv": [],
        },
        maxSize = 1024 * 1024 * 2,
        maxFileCount = 1,
        multiple = false,
        disabled = false,
        className,
        ...dropzoneProps
    } = props;

    const { toast } = useToast();

    const [csvData, setCsvData] = useState<any>();

    const onValueChange = (files: File[]) => {
        const fileToParse: File = files[0];
        if (!fileToParse) {
            setCsvData([]);
            return;
        }
        Papa.parse(fileToParse, {
            header: true,
            complete: function (result) {
                setCsvData(result);
            },
        });
    };

    const [files, setFiles] = useControllableState({
        prop: valueProp,
        onChange: onValueChange,
    });

    const onDrop = useCallback(
        (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
            if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
                toast({
                    title: "Failed to upload files",
                    description: "Only one file can be uploaded at a time.",
                    variant: "destructive",
                });
                return;
            }

            if (rejectedFiles.length > 0) {
                rejectedFiles.forEach(({ file }) => {
                    toast({
                        title: "Upload failed",
                        description: `File ${file.name} was rejected.`,
                        variant: "destructive",
                    });
                });
            }

            setFiles(acceptedFiles);
        },
        [files, maxFileCount, multiple, setFiles, toast]
    );

    const onRemove = (index: number) => {
        if (!files) return;
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onValueChange?.(newFiles);
    };

    const onUploadComplete = () => {
        setFiles([]);
    };

    const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

    return (
        <div className="w-full flex flex-col gap-4 overflow-hidden">
            <Dropzone
                onDrop={onDrop}
                accept={accept}
                maxSize={maxSize}
                maxFiles={maxFileCount}
                multiple={maxFileCount > 1 || multiple}
                disabled={isDisabled}
            >
                {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                        {...getRootProps()}
                        className={cn(
                            "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
                            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                            isDragActive && "border-muted-foreground/50",
                            isDisabled && "pointer-events-none opacity-60",
                            className
                        )}
                        {...dropzoneProps}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <Upload
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <p className="font-medium text-muted-foreground">
                                    Drop the files here
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                                <div className="rounded-full border border-dashed p-3">
                                    <Upload
                                        className="size-7 text-muted-foreground"
                                        aria-hidden="true"
                                    />
                                </div>
                                <div className="flex flex-col gap-px">
                                    <p className="font-medium text-muted-foreground">
                                        Drag and drop files here, or click to
                                        select files
                                    </p>
                                    <p className="text-sm text-muted-foreground/70">
                                        You can upload
                                        {maxFileCount > 1
                                            ? ` ${
                                                  maxFileCount === Infinity
                                                      ? "multiple"
                                                      : maxFileCount
                                              }
                      files (up to ${formatBytes(maxSize)} each)`
                                            : ` a file up to ${formatBytes(
                                                  maxSize
                                              )}`}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Dropzone>
            {files &&
                csvData &&
                csvData.meta &&
                files.map((file: File, index: number) => (
                    <FileCard
                        key={index}
                        file={file}
                        onRemove={() => onRemove(index)}
                        onUploadComplete={onUploadComplete}
                        csvHeaders={csvData.meta.fields}
                        csvData={csvData.data}
                    />
                ))}
        </div>
    );
}

interface FileCardProps {
    file: File;
    onRemove: () => void;
    onUploadComplete: () => void;
    csvHeaders: string[];
    csvData: any;
}

function FileCard(props: FileCardProps) {
    const [open, setOpen] = useState<boolean>(false);

    function handleUploadComplete() {
        setOpen(false);
        props.onUploadComplete();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <Card className="p-4">
                <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <section className="w-fit h-full space-x-4 flex items-center">
                        <h3 className="w-fit h-full p-3 rounded-sm bg-slate-200 dark:bg-slate-700 font-medium">
                            CSV
                        </h3>
                        <div className="space-y-0.5">
                            <h2 className="text-medium font-semibold">
                                {props.file.name}
                            </h2>
                            <h2 className="text-xs text-muted-foreground">
                                {formatBytes(props.file.size)}
                            </h2>
                        </div>
                    </section>
                    <section className="w-full md:w-fit h-full space-x-2 flex items-center">
                        <Button
                            variant="secondary"
                            onClick={props.onRemove}
                            className="w-full"
                        >
                            Remove
                        </Button>
                        <DialogTrigger asChild>
                            <Button variant="default" className="w-full">
                                Upload
                            </Button>
                        </DialogTrigger>
                    </section>
                </div>
            </Card>
            <FileUploadDialog
                csvHeaders={props.csvHeaders}
                csvData={props.csvData}
                onUploadComplete={handleUploadComplete}
            />
        </Dialog>
    );
}
