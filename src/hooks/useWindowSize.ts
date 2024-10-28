import { useLayoutEffect, useState } from "react";

export default function useWindowSize() {
    const [windowSize, setWindowSize] = useState<{
        width: number | undefined;
        height: number | undefined;
    }>({ width: undefined, height: undefined });

    useLayoutEffect(() => {
        const windowSizeHandler = () => {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        window.addEventListener("resize", windowSizeHandler);
        windowSizeHandler();

        return () => {
            window.removeEventListener("resize", windowSizeHandler);
        };
    }, []);

    return windowSize;
}
