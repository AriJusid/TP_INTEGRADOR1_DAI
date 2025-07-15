import jwt from 'jsonwebtoken';

export function authToken (req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    let payloadOriginal = null;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: Token missing' });
     }
    
    try {
        const auth =  jwt.verify(token, "mansobolazoarilu2025");
        req.user = auth;
    } catch (e) {
    console.error(e);
    }
    next()
    console.log(payloadOriginal)
}