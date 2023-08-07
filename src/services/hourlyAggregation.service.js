const { parse, format, addHours } = require('date-fns');

function calculateHourlyAggregation() {
    const hourlyData = {};
    let currentHourStart = null;

    function onData(row) {
        const customDateFormat = 'dd/MM/yyyy HH:mm:ss';
        const date = parse(row.dateTime.replace(',', '.'), customDateFormat, new Date());

        if (!currentHourStart) {
            currentHourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);
        }

        const nextHourStart = addHours(currentHourStart, 1);
        
        if (date >= nextHourStart) {
            currentHourStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), 0, 0);
        }

        const hourStartString = format(currentHourStart, 'dd-MM-yyyy HH:00:00');
        const value = Number(row.value.replace(',', '.'));

        aggregateData(hourStartString, value);
    }

    function aggregateData(hourStartString, value) {
        if (!isNaN(value)) {
            hourlyData[hourStartString] = hourlyData[hourStartString] || { sum: 0, count: 0};
            hourlyData[hourStartString].sum += value;
            hourlyData[hourStartString].count++;
        }
    }

    function onEnd() {
        console.log("Hourly Aggregation Report:");
        for (const hourStartDate in hourlyData) {
            const { sum, count } = hourlyData[hourStartDate];
            const hourlyAverage = sum / count;
            console.log(`Date ${hourStartDate} - Average Energy Usage: ${hourlyAverage.toFixed(2)} kWh`);
        }
    }

    return { onData, onEnd };
}

module.exports = {
    calculateHourlyAggregation
};
