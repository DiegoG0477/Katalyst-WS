import jwt from 'jsonwebtoken';
const secretJWT = process.env.SECRET_JWT || 'secret';

const { verify } = jwt;

const verifyJWT = (socket: any, next: any) => {
    try {
        const token = socket.handshake.auth.token;

        /**
        En el cliente:
        const socket = io("http://localhost:3000", {
            auth: {
                token: "tokenGeneradoEnLogin"
            }
        });
        */
        
        verify(token, secretJWT, (err: any, decode:any) => {
            if (err) {
                next(err);
            }

            socket.userId = decode;
            next();
        });
    } catch (error) {  
        next(error);
    }
}

export { verifyJWT as socketioAuthMiddleware }