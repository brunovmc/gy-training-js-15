const { parse, addWeeks, format } = require('date-fns');
const { DATE_TIME,  DATE } = require('../enums/dateFormat.enum');
const { ALARM_THRESHOLD } = require('../enums/alarmThreshold.enum');


class WeeklyAggregation {
    constructor() {
        this.weeklyData = {};
        this.currentWeekStart = null;
    }

    aggregateData(isoDateString, value) {
        this.weeklyData[isoDateString] = this.weeklyData[isoDateString] || { sum: 0, count: 0, alarmCount: 0 };
        
        this.weeklyData[isoDateString].sum += value;
        this.weeklyData[isoDateString].count++;

        if (value > ALARM_THRESHOLD) {
            this.weeklyData[isoDateString].alarmCount++;
        }
    }

    onData(row) {
        const date = parse(row.dateTime, DATE_TIME, new Date());

        if (!this.currentWeekStart) {
            this.currentWeekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }

        const nextWeekStart = addWeeks(this.currentWeekStart, 1);

        if (date >= nextWeekStart) {
            this.currentWeekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }

        const isoDateString = format(this.currentWeekStart, DATE);
        const value = Number(row.value.replace(',', '.'));

        this.aggregateData(isoDateString, value);
    }

    onEnd() {
        console.log("Weekly Aggregation Report:");
        for (const weekStartDate in this.weeklyData) {
            const { sum, count, alarmCount } = this.weeklyData[weekStartDate];
            const weeklyAverage = sum / count;
            console.log(`${weekStartDate} - Weekly Average: ${weeklyAverage.toFixed(2)} - Alarms Triggered: ${alarmCount}`);
        }
    }
}

module.exports = WeeklyAggregation;
