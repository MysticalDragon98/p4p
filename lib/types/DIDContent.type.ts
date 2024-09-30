import { DIDType } from "../enum/DIDType.enum"

export type DIDContent = {
    type: DIDType,
    content: string
}