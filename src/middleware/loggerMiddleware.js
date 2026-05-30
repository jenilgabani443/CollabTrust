/**
 * Logger middleware to trace HTTP requests.
 */
export const logger = (req, res, next) => {
  const start = Date.now();

  // Log on response completion
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });

  next();
};
