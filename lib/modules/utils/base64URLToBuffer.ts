export default function base64URLToBuffer (b64url: string) {
    const padding = "=".repeat((4 - (b64url.length % 4)) % 4);
    const base64 = b64url.replace(/-/g, "+").replace(/_/g, "/") + padding;
    return Buffer.from(base64, "base64");
}