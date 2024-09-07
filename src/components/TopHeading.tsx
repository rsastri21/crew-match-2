export default function TopHeading({
    text,
    isSecondary,
}: {
    text: string;
    isSecondary?: boolean;
}) {
    return (
        <h1
            className={`text-2xl md:text-3xl font-bold p-2 min-w-fit text-start ${
                isSecondary ? "text-muted-foreground" : ""
            }`}
        >
            {text}
        </h1>
    );
}
