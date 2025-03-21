import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

type HeadingProps = ComponentPropsWithoutRef<"h1">;
type ParagraphProps = ComponentPropsWithoutRef<"p">;
type ListProps = ComponentPropsWithoutRef<"ul">;
type ListItemProps = ComponentPropsWithoutRef<"li">;
type AnchorProps = ComponentPropsWithoutRef<"a">;
type BlockquoteProps = ComponentPropsWithoutRef<"blockquote">;
type ImageProps = ComponentPropsWithoutRef<"img">;

const components = {
    h1: (props: HeadingProps) => (
        <h1 className="text-4xl font-semibold pt-12 mb-0" {...props} />
    ),
    h2: (props: HeadingProps) => (
        <h2 className="text-2xl font-semibold mt-8 mb-3" {...props} />
    ),
    h3: (props: HeadingProps) => (
        <h3 className="text-xl font-semibold mt-8 mb-3" {...props} />
    ),
    h4: (props: HeadingProps) => (
        <h4 className="text-lg font-medium" {...props} />
    ),
    p: (props: ParagraphProps) => (
        <p className="text-md leading-snug" {...props} />
    ),
    ol: (props: ListProps) => (
        <ol className="list-decimal pl-5 space-y-2" {...props} />
    ),
    ul: (props: ListProps) => (
        <ul className="list-disc pl-5 space-y-1" {...props} />
    ),
    li: (props: ListItemProps) => <li className="pl-1" {...props} />,
    em: (props: ComponentPropsWithoutRef<"em">) => (
        <em className="font-medium" {...props} />
    ),
    strong: (props: ComponentPropsWithoutRef<"strong">) => (
        <strong className="font-medium" {...props} />
    ),
    a: ({ href, children, ...props }: AnchorProps) => {
        const className =
            "text-blue-500 hover:text-blue-700 dark:text-gray-400 hover:dark:text-gray-300 dark:underline dark:underline-offset-2 dark:decoration-gray-800";
        if (href?.startsWith("/")) {
            return (
                <Link href={href} className={className} {...props}>
                    {children}
                </Link>
            );
        }
        if (href?.startsWith("#")) {
            return (
                <a href={href} className={className} {...props}>
                    {children}
                </a>
            );
        }
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                {...props}
            >
                {children}
            </a>
        );
    },
    blockquote: (props: BlockquoteProps) => (
        <blockquote
            className="ml-[0.075em] border-l-3 border-muted-foreground pl-4"
            {...props}
        />
    ),
    img: (props: ImageProps) => (
        <img className="w-full h-auto py-2" {...props} />
    ),
};

declare global {
    type MDXProvidedComponents = typeof components;
}

export function useMDXComponents(): MDXProvidedComponents {
    return components;
}
