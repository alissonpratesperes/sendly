export function requireEnvironmentVariable(variable: string): string {
  const value = process.env[variable];

  return !value ? (() => { throw new Error(`'${variable}' is not defined`); })() : value;
}
