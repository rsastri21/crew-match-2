export default function AssignmentsSectionHeading({
    title,
}: {
    title: string;
}) {
    return (
        <h1 className="md:text-2xl text-lg font-semibold p-2 w-full min-w-fit">
            {title}
        </h1>
    );
}
