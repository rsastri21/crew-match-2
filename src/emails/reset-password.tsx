import * as React from "react";

import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Section,
    Tailwind,
    Text,
} from "@react-email/components";
import "dotenv";

export const BASE_URL = process.env.HOST_NAME!;

export function ResetPasswordEmail({ token }: { token: string }) {
    return (
        <Html>
            <Head />
            <Preview>Reset your Password</Preview>
            <Tailwind>
                <React.Fragment>
                    <Body className="bg-white my-auto mx-auto font-sans">
                        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
                            <Section className="mt-[32px]">
                                <Heading as="h1">
                                    Reset your password for Crew Match
                                </Heading>
                            </Section>

                            <Section className="text-center mt-[32px] mb-[32px]">
                                <Text className="text-black font-medium text-[14px] leading-[24px] mb-8">
                                    Click the following link to reset your
                                    password
                                </Text>

                                <Text className="text-black font-medium text-[14px] leading-[24px]">
                                    <Link
                                        href={`${BASE_URL}/reset-password?token=${token}`}
                                        target="_blank"
                                        className="text-[#2754C5] underline"
                                    >
                                        Reset Password
                                    </Link>
                                </Text>
                            </Section>

                            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

                            <Text className="text-[#666666] text-[12px] leading-[24px] flex items-center justify-center">
                                © 2024 LUX Crew Match. All rights reserved.
                            </Text>
                        </Container>
                    </Body>
                </React.Fragment>
            </Tailwind>
        </Html>
    );
}
