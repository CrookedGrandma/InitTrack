import React, { useRef } from "react";
import { Button } from "@fluentui/react-components";
import { FolderArrowUpRegular } from "@fluentui/react-icons";

interface FileInputProps {
    onFileSelect: (files: FileList) => void;
}

export default function FileInput({ onFileSelect }: Readonly<FileInputProps>) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    function handleButtonClick() {
        fileInputRef.current?.click();
    }

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (!event.target.files?.length) return;
        onFileSelect(event.target.files);
    }

    return (
        <div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />
            <Button icon={<FolderArrowUpRegular />} onClick={handleButtonClick}>Import</Button>
        </div>
    );
}
