const { parse, format, addHours } = require('date-fns');

class HourlyAggregation {
    constructor() {
        this.hourlyData = {};
        this.currentHourStart = null;
    }

    onData(row) {
        const customDateFormat = 'dd/MM/yyyy HH:mm:ss';
        const date = parse(row.dateTime.replace(',', '.'), customDateFormat, new Date());

        if (!this.currentHourStart) {
            this.currentHourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);
        }

        const nextHourStart = addHours(this.currentHourStart, 1);
        
        if (date >= nextHourStart) {
            this.currentHourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);
        }

        const hourStartString = format(this.currentHourStart, 'dd-MM-yyyy HH:00:00');
        const value = Number(row.value.replace(',', '.'));

        this.aggregateData(hourStartString, value);
    }

    aggregateData(hourStartString, value) {
        if (!isNaN(value)) {
            this.hourlyData[hourStartString] = this.hourlyData[hourStartString] || { sum: 0, count: 0};
            this.hourlyData[hourStartString].sum += value;
            this.hourlyData[hourStartString].count++;
        }
    }

    onEnd() {
        console.log("Hourly Aggregation Report:");
        for (const hourStartDate in this.hourlyData) {
            const { sum, count } = this.hourlyData[hourStartDate];
            const hourlyAverage = sum / count;
            console.log(`Date ${hourStartDate} - Average Energy Usage: ${hourlyAverage.toFixed(2)} kWh`);
        }
    }
}

module.exports = HourlyAggregation;
