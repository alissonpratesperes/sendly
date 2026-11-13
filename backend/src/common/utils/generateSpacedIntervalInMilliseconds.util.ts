export function generateSpacedIntervalInMilliseconds(maxIntervalInSeconds: number): number {
    const minIntervalInSeconds = 60;

    if (maxIntervalInSeconds < minIntervalInSeconds) {
        throw new Error("Maximum interval must be at least 60 seconds");
    }

    const randomIntervalInSeconds = minIntervalInSeconds + Math.random() * (maxIntervalInSeconds - minIntervalInSeconds);

    return Math.round(randomIntervalInSeconds * 1000);
}
