import { sign, verify } from 'jsonwebtoken';
import { serverConfig } from '../config';
import { verifyTokenInterface } from '../types/verifyToken.dto';
const { TOKEN_KEY } = serverConfig;

export const tokenService = {
    createToken: (payload:object) => sign(payload, TOKEN_KEY),
    verifyToken: (token:string):verifyTokenInterface => verify(token, TOKEN_KEY) as verifyTokenInterface
}
