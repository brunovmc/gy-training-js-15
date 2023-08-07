const { parse, format } = require('date-fns');

class DailyAggregation {
    constructor() {
        this.dailyAggregation = {};
    }

    onData(row) {
        const customDateFormat = 'dd/MM/yyyy HH:mm:ss';
        const dateObject = parse(row.dateTime, customDateFormat, new Date());
        const isoDateString = format(dateObject, 'yyyy-MM-dd');
        const value = Number(row.value.replace(',', '.'));

        this.aggregateData(isoDateString, value);
    }

    aggregateData(isoDateString, value) {
        if (!isNaN(value)) {
            this.dailyAggregation[isoDateString] = this.dailyAggregation[isoDateString] || { sum: 0, count: 0 };
            this.dailyAggregation[isoDateString].sum += value;
            this.dailyAggregation[isoDateString].count++;
        }
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
