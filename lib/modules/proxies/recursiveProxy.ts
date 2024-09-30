import { ElasticProxy } from "@mysticaldragon/proxies";

export default function recursiveProxy (apply: (path: string[], args: any[]) => any, parentPath: string[] = []) {
    return ElasticProxy.new({
        recursive: false,
        get (path: string) {
            const currentPath = [...parentPath, path];
            if (path === "then") return;

            return recursiveProxy(apply, currentPath);
        },

        apply (args: any[]) {
            return apply(parentPath, args);
        }
    })
}