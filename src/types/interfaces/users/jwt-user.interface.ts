export interface IJwtUser {
    readonly sub: string,
    readonly iat: number,
    readonly exp: number
}
