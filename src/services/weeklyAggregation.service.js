const { parse, addWeeks, format } = require('date-fns');
const { DATE_TIME, DATE } = require('../enums/dateFormat.enum');
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

    updateWeeklyBoundary(date) {
        if (!this.currentWeekStart) {
            this.currentWeekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
            return;
        }

        const nextWeekStart = addWeeks(this.currentWeekStart, 1);
        
        if (date >= nextWeekStart) {
            this.currentWeekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }
    }


    getISOWeekDateString(dateTime) {
        const date = parse(dateTime, DATE_TIME, new Date());
        this.updateWeeklyBoundary(date);
        return format(this.currentWeekStart, DATE);
    }

    onData(row) {
        const isoDateString = this.getISOWeekDateString(row.dateTime);
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
