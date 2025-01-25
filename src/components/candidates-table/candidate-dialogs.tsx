import { Button } from "@/components/ui/button";
import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { CandidateRow } from "@/data/candidates";
import { useServerAction } from "zsa-react";
import {
    assignCandidateAction,
    deleteCandidateAction,
    removeCandidateAction,
} from "./actions";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { getProductionsWithAvailableRoles } from "@/utils/productionClientUtils";
import { useState } from "react";
import { Loader2Icon, TriangleAlert } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ProductionAndRoles } from "@/db/schema";

export function handleDialogMenu(mode: string, row: CandidateRow) {
    switch (mode) {
        case "assign":
            return <AssignCandidateDialog row={row} />;
        case "remove":
            return <RemoveCandidateDialog row={row} />;
        case "delete":
            return <DeleteDialog row={row} />;
        default:
            return null;
    }
}

function DeleteDialog({ row }: { row: CandidateRow }) {
    const { toast } = useToast();
    const { execute } = useServerAction(deleteCandidateAction, {
        onError({ err }) {
            toast({
                title: "Failed to delete candidate",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Successfully deleted candidate",
            });
        },
    });

    function handleDeleteClick() {
        execute({
            id: row.id,
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Delete {row.name}?</DialogTitle>
                <DialogDescription>
                    Remove {row.name} from the system. This action cannot be
                    undone.
                </DialogDescription>
            </DialogHeader>
            <DialogFooter>
                <div className="flex flex-wrap justify-center gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteClick}
                        >
                            Delete
                        </Button>
                    </DialogClose>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}

function AssignCandidateDialog({ row }: { row: CandidateRow }) {
    const {
        isPending,
        isError,
        data: productions,
    } = useQuery({
        queryKey: ["productions"],
        queryFn: getProductionsWithAvailableRoles,
    });

    const [selectedProduction, setSelectedProduction] =
        useState<ProductionAndRoles>();
    const [selectedRole, setSelectedRole] = useState<number | undefined>();

    const { toast } = useToast();
    const { execute } = useServerAction(assignCandidateAction, {
        onError({ err }) {
            toast({
                title: "Failed to assign candidate",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Successfully assigned candidate",
            });
        },
    });

    function handleAssignClick() {
        if (!selectedRole) {
            return;
        }

        execute({
            id: row.id,
            roleId: selectedRole,
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Assign {row.name}</DialogTitle>
                <DialogDescription>
                    Choose a production and role to assign {row.name} to.
                </DialogDescription>
            </DialogHeader>
            {isPending && (
                <Loader2Icon className="animate-spin w-8 h-8 mx-auto" />
            )}
            {isError && (
                <div className="w-full h-32 rounded-md bg-secondary flex flex-col items-center justify-center gap-2">
                    <TriangleAlert className="w-16 h-16 text-destructive" />
                    <h2 className="font-medium">Something went wrong.</h2>
                </div>
            )}
            {productions && (
                <>
                    <Select
                        onValueChange={(value: string) => {
                            setSelectedProduction(
                                productions.find(
                                    (production) =>
                                        production.id === Number(value)
                                )
                            );
                            setSelectedRole(undefined);
                        }}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a production" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Productions</SelectLabel>
                                {productions.map((production) => (
                                    <SelectItem
                                        key={production.id}
                                        value={String(production.id)}
                                    >
                                        {production.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </>
            )}
            {selectedProduction && (
                <>
                    <Select
                        onValueChange={(value: string) =>
                            setSelectedRole(Number(value))
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Productions</SelectLabel>
                                {selectedProduction.roles.map((role) => (
                                    <SelectItem
                                        key={role.id}
                                        value={String(role.id)}
                                    >
                                        {role.role}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </>
            )}
            <DialogFooter>
                <div className="flex flex-wrap justify-center gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            variant="default"
                            onClick={handleAssignClick}
                            disabled={typeof selectedRole === "undefined"}
                        >
                            Assign
                        </Button>
                    </DialogClose>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}

function RemoveCandidateDialog({ row }: { row: CandidateRow }) {
    const [selectedRole, setSelectedRole] = useState<number | undefined>();

    const { toast } = useToast();
    const { execute } = useServerAction(removeCandidateAction, {
        onError({ err }) {
            toast({
                title: "Failed to remove candidate",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Successfully removed candidate",
            });
        },
    });

    function handleRemoveClick() {
        if (!selectedRole) {
            return;
        }
        execute({
            roleId: selectedRole,
        });
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Remove {row.name} from Role</DialogTitle>
                <DialogDescription>
                    Choose a role to remove {row.name} from.
                </DialogDescription>
            </DialogHeader>
            {row.roles.length === 0 ? (
                <h2 className="font-semibold text-muted-foreground">
                    No assigned roles.
                </h2>
            ) : (
                <Select
                    onValueChange={(value: string) =>
                        setSelectedRole(Number(value))
                    }
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Roles</SelectLabel>
                            {row.roles.map((role) => (
                                <SelectItem
                                    key={role.id}
                                    value={String(role.id)}
                                >
                                    {role.role} - {role.production}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            )}
            <DialogFooter>
                <div className="flex flex-wrap justify-center gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button
                            variant="destructive"
                            disabled={typeof selectedRole === "undefined"}
                            onClick={handleRemoveClick}
                        >
                            Remove
                        </Button>
                    </DialogClose>
                </div>
            </DialogFooter>
        </DialogContent>
    );
}
