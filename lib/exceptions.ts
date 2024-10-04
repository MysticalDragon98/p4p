import { ok } from "assert";
import * as Errors from "./modules/errors/index.js";
import parseTextTemplate from "./modules/errors/parseTextTemplate.js";

export class CustomError extends Error {
    code: string;
    
    constructor(message, code) {
        super(message); // Call the parent constructor with the message parameter
        this.code = code; // Add a custom code property
        this.name = this.constructor.name; // Set the error name to the class name (optional but recommended)
        (<any>Error).captureStackTrace(this, this.constructor); // Capture the correct stack trace (optional but recommended)
    }
}

export const $ok = (expression: any, code: string, message: string | object) => {
    if (typeof message === "object") {
        if (!Errors[code]) {
            message = JSON.stringify({ code, data: message });
        } else {
            message = parseTextTemplate(Errors[code], message);
        }
    }

    if (typeof expression === "function") {
        try {
            return expression();
        } catch (e) {
            throw new CustomError(message, code)
        }
    }
    
    ok(expression, new CustomError(message, code));

    return expression;
}