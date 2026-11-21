import { TZDate } from '@date-fns/tz';
import { Injectable } from '@nestjs/common';
import { addDays, addMilliseconds, getDay, set } from 'date-fns';

@Injectable()
export class BatchSendSchedulerService {
    private readonly timezone = "America/Sao_Paulo";
    private readonly businessDays: number[];
    private readonly startHour: number;
    private readonly startMinute: number;
    private readonly endHour: number;
    private readonly endMinute: number;

    constructor() {
        this.businessDays = this.parseBusinessDays(process.env.BUSINESS_DAYS);

        const start = this.parseHour(process.env.BUSINESS_START_HOUR);
        const end = this.parseHour(process.env.BUSINESS_END_HOUR);

        this.startHour = start.hour;
        this.startMinute = start.minute;
        this.endHour = end.hour;
        this.endMinute = end.minute;

        if (this.endHour * 60 + this.endMinute <= this.startHour * 60 + this.startMinute) {
            throw new Error("'BUSINESS_END_HOUR' must be greater than 'BUSINESS_START_HOUR'");
        }
    }

    private parseBusinessDays(value?: string): number[] {
        if (!value?.trim()) {
            throw new Error("'BUSINESS_DAYS' environment variable is required");
        }

        const values = value.split(',');

        if (values.some(day => !/^[0-6]$/.test(day.trim()))) {
            throw new Error("'BUSINESS_DAYS' must contain values between 0 and 6");
        }

        const days = values.map(day => Number(day.trim()));

        if (new Set(days).size !== days.length) {
            throw new Error("'BUSINESS_DAYS' must contain unique values");
        }

        return days;
    }

    private parseHour(value?: string): { hour: number; minute: number } {
        const match = value?.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

        if (!match) {
            throw new Error(`Invalid business hour: "${ value }"`);
        }

        return {
            hour: Number(match[1]),
            minute: Number(match[2]),
        };
    }

    private isBusinessDay(date: TZDate): boolean {
        return this.businessDays.includes(getDay(date));
    }

    private isWithinBusinessHours(date: TZDate): boolean {
        const currentMinutes = date.getHours() * 60 + date.getMinutes();
        const startMinutes = this.startHour * 60 + this.startMinute;
        const endMinutes = this.endHour * 60 + this.endMinute;

        return (
            currentMinutes >= startMinutes &&
            currentMinutes < endMinutes
        );
    }

    private getBusinessDayStart(date: TZDate): TZDate {
        return set(date, {
            hours: this.startHour,
            minutes: this.startMinute,
            seconds: 0,
            milliseconds: 0,
        });
    }

    private getNextBusinessDay(date: TZDate): TZDate {
        let nextDate = addDays(date, 1);

        while (!this.isBusinessDay(nextDate)) {
            nextDate = addDays(nextDate, 1);
        }

        return this.getBusinessDayStart(nextDate);
    }

    private getNextAvailableDate(date: TZDate): TZDate {
        let nextDate = date;

        if (!this.isBusinessDay(nextDate)) {
            do {
                nextDate = addDays(nextDate, 1);
            } while
                (!this.isBusinessDay(nextDate));

            return this.getBusinessDayStart(nextDate);
        }

        if (this.isWithinBusinessHours(nextDate)) {
            return nextDate;
        }

        const currentMinutes = nextDate.getHours() * 60 + nextDate.getMinutes();
        const startMinutes = this.startHour * 60 + this.startMinute;

        if (currentMinutes < startMinutes) {
            return this.getBusinessDayStart(nextDate);
        }

        return this.getNextBusinessDay(nextDate);
    }

    public getNextBusinessDate(date: Date): Date {
        if (!(date instanceof Date) || !Number.isFinite(date.getTime())) {
            throw new Error("Invalid scheduled date");
        }

        const currentDate = new TZDate(date, this.timezone);

        return new Date(this.getNextAvailableDate(currentDate).getTime());
    }

    public getNextScheduledAt(previousScheduledAt: Date, intervalInMilliseconds: number): Date {
        if (!(previousScheduledAt instanceof Date) || !Number.isFinite(previousScheduledAt.getTime())) {
            throw new Error("Invalid previous scheduled date");
        }
        if (!Number.isFinite(intervalInMilliseconds) || intervalInMilliseconds <= 0) {
            throw new Error("Interval must be a positive number");
        }

        const previousDate = new TZDate(previousScheduledAt, this.timezone);

        let nextDate = addMilliseconds(previousDate, intervalInMilliseconds);

        if (!this.isBusinessDay(nextDate) || !this.isWithinBusinessHours(nextDate)) {
            nextDate = this.getNextAvailableDate(nextDate);
        }

        return new Date(nextDate.getTime());
    }
}
