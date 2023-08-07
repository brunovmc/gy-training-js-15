const { parse, addWeeks } = require('date-fns');

function calculateWeeklyAggregation() {
    const weeklyData = {};
    let currentWeekStart = null;

    function aggregateWeeklyData(isoDateString, value) {
        const alarmThreshold = 1;

        weeklyData[isoDateString] = weeklyData[isoDateString] || { sum: 0, count: 0, alarmCount: 0 };
        
        weeklyData[isoDateString].sum += value;
        weeklyData[isoDateString].count++;

        if (value > alarmThreshold) {
            weeklyData[isoDateString].alarmCount++;
        }
    }

    function onData(row) {
        const customDateFormat = 'dd/MM/yyyy HH:mm';
        const date = parse(row.dateTime, customDateFormat, new Date());

        if (!currentWeekStart) {
            currentWeekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }

        const nextWeekStart = addWeeks(currentWeekStart, 1);

        if (date >= nextWeekStart) {
            currentWeekStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
        }

        const isoDateString = currentWeekStart.toISOString().split('T')[0];
        const value = Number(row.value.replace(',', '.'));

        if (!isNaN(value)) {
            aggregateWeeklyData(isoDateString, value);
        }
    }

    function onEnd() {
        console.log("Weekly Aggregation Report:");
        for (const weekStartDate in weeklyData) {
            const { sum, count, alarmCount } = weeklyData[weekStartDate];
            const weeklyAverage = sum / count;
            console.log(`${weekStartDate} - Weekly Average: ${weeklyAverage.toFixed(2)} - Alarms Triggered: ${alarmCount}`);
        }
    }

    return { onData, onEnd };
}

module.exports = {
    calculateWeeklyAggregation
};
