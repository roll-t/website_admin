import jwt from 'jsonwebtoken';

export default function decodeJWT(token:string) {
    try {
        const decoded = jwt.decode(token, { complete: true });
        return decoded;
    } catch (err) {
        console.error('Error decoding JWT:', err);
        return null;
    }
}