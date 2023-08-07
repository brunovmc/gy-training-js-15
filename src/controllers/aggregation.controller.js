const dailyService = require('../services/dailyAggregation.service');
const weeklyService = require('../services/weeklyAggregation.service');
const hourlyService = require('../services/hourlyAggregation.service');
const readCsvFile = require('../services/csvReader.service')

const generateDailyReport = async (req, res) => {
  const file = './data/METRICS_REPORT-1673286660394 (3).csv';
  const { onData, onEnd } = await dailyService.calculateDailyAggregation();
  readCsvFile(file, onData, onEnd);
  res.send("Daily Aggregation calculated and logged in the console.");
};

const generateWeeklyReport = async (req, res) => {
  const file = './data/METRICS_REPORT-1673351714089 (2).csv';
  const { onData, onEnd } = await weeklyService.calculateWeeklyAggregation();
  readCsvFile(file, onData, onEnd);
  res.send("Weekly Aggregation Report generated and logged in the console.");
};

const generateHourlyReport = async (req, res) => {
  const file = './data/METRICS_REPORT-1673351714089 (1).csv';
  const { onData, onEnd } = await hourlyService.calculateHourlyAggregation();
  readCsvFile(file, onData, onEnd);
  res.send("Hourly Aggregation Report generated and logged in the console.");
};

module.exports = {
  generateDailyReport,
  generateWeeklyReport,
  generateHourlyReport
};
