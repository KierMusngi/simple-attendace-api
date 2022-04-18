import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    let token = req.headers["authorization"];
    token = token.replace('Bearer ', '');

    if (!token) {
        res.status(401).json({ auth: false, message: "We need a token" });
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).json({ auth: false, message: err.message });
            } else {
                req.userId = decoded.userId;
                next();
            }
        });
    }
};