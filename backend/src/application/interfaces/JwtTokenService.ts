import { IJwtPayload } from "application/other/jwt-payload";

export default interface IJwtTokenService {
    generateToken(payload: IJwtPayload, options?: { expiresIn?: string | number }): Promise<string>;
    verifyToken<T>(token: string): Promise<T>;
    decodeToken<T>(token: string): T | null;
}
