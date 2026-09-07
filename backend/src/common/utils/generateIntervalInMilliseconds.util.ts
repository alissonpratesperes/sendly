import { requireEnvironmentVariable } from './requireEnvironmentVariable.util';

export function generateIntervalInMilliseconds(): number {
    const minimumMinutes = Number(requireEnvironmentVariable("QUEUE_TIMER_MINIMUM_MINUTES"));
    const maximumMinutes = Number(requireEnvironmentVariable("QUEUE_TIMER_MAXIMUM_MINUTES"));
    const randomMinute = Math.floor(Math.random() * (maximumMinutes - minimumMinutes + 1)) + minimumMinutes;

    return randomMinute * 60 * 1000;
}
