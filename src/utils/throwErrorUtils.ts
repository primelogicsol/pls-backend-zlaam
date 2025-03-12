export default function throwError(status: number, message: string) {
  throw { status, message };
}
