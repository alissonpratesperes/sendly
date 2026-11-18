import { requireEnvironmentVariable } from './requireEnvironmentVariable.util';

export function generateSpacedIntervalInMilliseconds(): number {
    const absoluteMinIntervalInSeconds = Number(requireEnvironmentVariable("MIN_INTERVAL_LIMIT"));
    const absoluteMaxIntervalInSeconds = Number(requireEnvironmentVariable("MAX_INTERVAL_LIMIT"));

    if (
        !Number.isFinite(absoluteMinIntervalInSeconds) ||
        !Number.isFinite(absoluteMaxIntervalInSeconds) ||
        absoluteMinIntervalInSeconds < 60 ||
        absoluteMaxIntervalInSeconds > 10800 ||
        absoluteMaxIntervalInSeconds < absoluteMinIntervalInSeconds
    ) {
        throw new Error("Interval limits must be between '60' and '10800' seconds");
    }

    const randomIntervalInSeconds = absoluteMinIntervalInSeconds + Math.random() * (absoluteMaxIntervalInSeconds - absoluteMinIntervalInSeconds);

    return Math.round(randomIntervalInSeconds * 1000);
}
