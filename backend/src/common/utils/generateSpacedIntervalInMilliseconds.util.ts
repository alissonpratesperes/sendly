export function generateSpacedIntervalInMilliseconds(enqueuedJobIndex: number, baseIntervalInSeconds: number = 1800, randomJitterInSeconds: number = 300): number {
    const baseInMilliseconds = enqueuedJobIndex * baseIntervalInSeconds * 1000;
    const jitterInMilliseconds = Math.floor(Math.random() * randomJitterInSeconds * 1000);

    return baseInMilliseconds + jitterInMilliseconds;
}
