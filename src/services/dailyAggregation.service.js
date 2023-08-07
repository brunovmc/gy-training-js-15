const { parse, format } = require('date-fns');

function calculateDailyAggregation() {
    const dailyAggregation = {};

    function onData(row) {
        const customDateFormat = 'dd/MM/yyyy HH:mm:ss';
        const dateObject = parse(row.dateTime, customDateFormat, new Date());
        const isoDateString = format(dateObject, 'yyyy-MM-dd');
        const value = Number(row.value.replace(',', '.'));

        aggregateData(isoDateString, value);
    }

    function aggregateData(isoDateString, value) {
        if (!isNaN(value)) {
            dailyAggregation[isoDateString] = dailyAggregation[isoDateString] || { sum: 0, count: 0 };
            dailyAggregation[isoDateString].sum += value;
            dailyAggregation[isoDateString].count++;
        }
    }

    function onEnd() {
        console.log("Daily Aggregation:");
        for (const date in dailyAggregation) {
            dailyAggregation[date].average = dailyAggregation[date].sum / dailyAggregation[date].count;
            console.log(`${date} - Average Value: ${dailyAggregation[date].average.toFixed(2)}`);
        }
    }

    return { onData, onEnd };
}

module.exports = {
    calculateDailyAggregation
};
