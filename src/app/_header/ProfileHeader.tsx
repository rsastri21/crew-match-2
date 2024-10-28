import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
    image: string | null;
    name: string | null;
    email: string | null;
}

export default function ProfileHeader(props: ProfileHeaderProps) {
    return (
        <div className="w-full flex items-center justify-start gap-4 pb-4">
            <Avatar className="w-16 h-16">
                <AvatarImage src={props.image ?? undefined} />
                <AvatarFallback>
                    {props.name?.substring(0, 2).toUpperCase() ?? "AA"}
                </AvatarFallback>
            </Avatar>
            <div className="space-y-0.5">
                <h1 className="text-xl font-medium text-left">{props.name}</h1>
                <p className="text-md font-medium text-muted-foreground text-left">
                    {props.email}
                </p>
            </div>
        </div>
    );
}
