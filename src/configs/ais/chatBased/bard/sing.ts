import { Bard } from "googlebard";

export default async function orchestra() {
    const importDynamic = new Function(
        "modulePath",
        "return import(modulePath)"
    );
    const { Bard } = await importDynamic("googlebard");
    const choirs = new Bard(`__Secure-1PSID="${process.env.BARD_COOKIE!}"`, {
        proxy: {
            host: process.env.BARD_PROXY_HOST!,
            port: process.env.BARD_PROXY_PORT!,
            auth: {
                username: process.env.BARD_PROXY_USERNAME!,
                password: process.env.BARD_PROXY_PASSWORD!,
            },
            protocol: "http",
        },
    });
    return choirs as Bard;
}