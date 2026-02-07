export default () => ({
  database: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRATION || process.env.JWT_EXPIRES_IN || '24h',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  },
  bcrypt: {
    rounds: parseInt(process.env.BCRYPT_ROUNDS || '10'),
  },
  commerce: {
    processingFeeRate: parseFloat(process.env.PROCESSING_FEE_RATE || '0.05'),
    ecoPointsPerDollar: parseFloat(process.env.ECO_POINTS_PER_DOLLAR || '1'),
  },
});
