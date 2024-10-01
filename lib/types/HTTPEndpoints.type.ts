import { HTTPHandler } from "./HTTPHandler.type.js"

export type HTTPEndpoints = {
    [key: string]: HTTPEndpoints | HTTPHandler
}