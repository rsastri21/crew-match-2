"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CirclePlus } from "lucide-react";
import { useState } from "react";

interface AddRoleComponentProps {
    handleRoleCreate: (roleName: string) => void;
}

export default function AddRoleComponent({
    handleRoleCreate,
}: AddRoleComponentProps) {
    const [role, setRole] = useState<string>("");

    const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRole(event.target.value);
    };

    const handleCreateClick = () => {
        handleRoleCreate(role);
        setRole("");
    };

    return (
        <>
            <Label className="pt-2" htmlFor="role-input">
                Add a new role
            </Label>
            <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <Input
                    type="text"
                    placeholder="Role"
                    value={role}
                    onChange={handleRoleChange}
                />
                <Button
                    className="w-full md:w-fit"
                    onClick={handleCreateClick}
                    disabled={!role.length}
                    type="button"
                >
                    <CirclePlus /> Create
                </Button>
            </div>
        </>
    );
}
