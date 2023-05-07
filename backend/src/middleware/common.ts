export function baseUrlMiddleware(req, res, next) {
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const baseUrl = `${protocol}://${req.headers.host}`;

    req.baseUrl = baseUrl;

    next();
}