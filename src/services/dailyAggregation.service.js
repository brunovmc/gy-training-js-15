const { parse, format } = require('date-fns');
const { DATE_TIME_SECONDS, DATE } = require('../enums/dateFormat.enum');

class DailyAggregation {
    constructor() {
        this.dailyAggregation = {};
    }

    getISODateString(dateTime) {
        const dateObject = parse(dateTime, DATE_TIME_SECONDS, new Date());
        return format(dateObject, DATE);
    }

    aggregateData(isoDateString, value) {
        this.dailyAggregation[isoDateString] = this.dailyAggregation[isoDateString] || { sum: 0, count: 0 };
        this.dailyAggregation[isoDateString].sum += value;
        this.dailyAggregation[isoDateString].count++;
    }

    onData(row) {
        const isoDateString = this.getISODateString(row.dateTime);
        const value = Number(row.value.replace(',', '.'));

        this.aggregateData(isoDateString, value);
    }

    onEnd() {
        console.log("Daily Aggregation:");
        for (const date in this.dailyAggregation) {
            this.dailyAggregation[date].average = this.dailyAggregation[date].sum / this.dailyAggregation[date].count;
            console.log(`${date} - Average Value: ${this.dailyAggregation[date].average.toFixed(2)}`);
        }
    }
}

module.exports = DailyAggregation;
