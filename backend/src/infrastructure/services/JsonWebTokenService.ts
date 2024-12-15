import IJwtTokenService from "application/interfaces/JwtTokenService";
import jwt from "jsonwebtoken";

export class JsonWebTokenService implements IJwtTokenService {
    private readonly secretKey: string;

    constructor(secretKey: string) {
        if (!secretKey) {
            throw new Error("Secret key must be provided");
        }
        this.secretKey = secretKey;
    }

    async generateToken(payload: object, options?: { expiresIn?: string | number }): Promise<string> {
        try {
            return jwt.sign(payload, this.secretKey, { expiresIn: options?.expiresIn || "1h" });
        } catch (err) {
            throw new Error(`Token generation failed: ${(err as Error).message}`);
        }
    }

    async verifyToken<T>(token: string): Promise<T> {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            return decoded as T;
        } catch (err) {
            throw new Error(`Token verification failed: ${(err as Error).message}`);
        }
    }

    decodeToken<T>(token: string): T | null {
        try {
            const decoded = jwt.decode(token);
            return decoded as T | null;
        } catch (err) {
            console.error(`Token decoding failed: ${(err as Error).message}`);
            return null;
        }
    }
}
