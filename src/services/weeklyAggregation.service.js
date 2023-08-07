const { parse, addWeeks } = require('date-fns');

class WeeklyAggregation {
    constructor() {
        this.weeklyData = {};
        this.currentWeekStart = null;
        this.alarmThreshold = 1;
        this.customDateFormat = 'dd/MM/yyyy HH:mm';
    }

    aggregateData(isoDateString, value) {
        this.weeklyData[isoDateString] = this.weeklyData[isoDateString] || { sum: 0, count: 0, alarmCount: 0 };
        
        this.weeklyData[isoDateString].sum += value;
        this.weeklyData[isoDateString].count++;

        if (value > this.alarmThreshold) {
            this.weeklyData[isoDateString].alarmCount++;
        }
    }

    onData(row) {
        const date = parse(row.dateTime, this.customDateFormat, new Date());

        if (!this.currentWeekStart) {
            this.currentWeekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }

        const nextWeekStart = addWeeks(this.currentWeekStart, 1);

        if (date >= nextWeekStart) {
            this.currentWeekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }

        const isoDateString = this.currentWeekStart.toISOString().split('T')[0];
        const value = Number(row.value.replace(',', '.'));

        if (!isNaN(value)) {
            this.aggregateData(isoDateString, value);
        }
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
