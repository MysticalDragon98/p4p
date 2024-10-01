export default function raise (errorCode: string | number, errorMessage: string) {
    const error = new Error(errorMessage);
    (<any>error).code = errorCode;

    throw error;
}