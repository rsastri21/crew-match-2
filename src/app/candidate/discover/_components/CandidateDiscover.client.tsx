"use client";

import { LoaderButton } from "@/components/loader-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Candidate, Profile } from "@/db/schema";
import { useRouter } from "next/navigation";
import { useServerAction } from "zsa-react";
import { updateCandidateAction } from "../actions";

export default function CandidateDiscover({
    profile,
    candidates,
}: {
    profile: Profile;
    candidates: Candidate[];
}) {
    const router = useRouter();
    const { toast } = useToast();

    const { execute, isPending } = useServerAction(updateCandidateAction, {
        onError({ err }) {
            toast({
                title: "Something went wrong",
                description: err.message,
                variant: "destructive",
            });
        },
        onSuccess() {
            toast({
                title: "Successfully associated candidate!",
                description: "Redirecting to registration page",
            });
        },
    });

    function handleCandidateSelect(candidateId: number) {
        execute({
            name: profile.name!,
            userId: profile.userId,
            candidateId,
        });
    }

    return (
        <div className="p-2 w-full min-w-fit flex flex-col gap-2">
            {candidates.map((candidate) => (
                <Card
                    key={candidate.id}
                    className="w-full md:w-3/4 mx-auto flex flex-row items-center justify-between rounded-lg border p-4"
                >
                    <div className="space-y-0.5">
                        <h1 className="text-base font-medium">
                            {candidate.name}
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Created on {candidate.createdAt.toLocaleString()}
                        </p>
                    </div>
                    <LoaderButton
                        isLoading={isPending}
                        onClick={() => handleCandidateSelect(candidate.id)}
                    >
                        Select
                    </LoaderButton>
                </Card>
            ))}
            <Button
                variant="link"
                className="text-muted-foreground mt-4 w-fit mx-auto"
                onClick={() => router.push("/candidate/register")}
            >
                None of these are me
            </Button>
        </div>
    );
}
