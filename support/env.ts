export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const getHudlCredentials = () => ({
  email: getRequiredEnv("HUDL_EMAIL"),
  password: getRequiredEnv("HUDL_PASSWORD"),
  displayName: getRequiredEnv("HUDL_DISPLAY_NAME"),
});
