export default () => ({
  redis: {
    host: new URL(process.env.REDIS_URL).hostname,
    port: Number(new URL(process.env.REDIS_URL).port),
  },
});
