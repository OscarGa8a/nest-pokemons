export const envConfiguration = () => ({
  environment: process.env.NODE_ENV || 'dev',
  mongodb: process.env.MONGODB || 'mongodb://localhost:27017/nest',
  port: process.env.PORT || 3002,
  defaultLimit: Number(process.env.DEFAULT_LIMIT) || 7,
});
