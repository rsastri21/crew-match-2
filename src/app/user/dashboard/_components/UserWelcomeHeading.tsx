export default function UserWelcomeHeading({ name }: { name: string }) {
    return (
        <h1 className="text-xl md:text-3xl font-bold p-2 w-1/2 min-w-fit">
            Welcome, {name}
        </h1>
    );
}
