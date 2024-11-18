import { Role } from "src/common/enum/role.enum";

export interface JwtPayload {
    userId: string;
    email: string;
    role: Role 
}
