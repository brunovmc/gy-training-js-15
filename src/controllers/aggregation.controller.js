const DailyService = require('../services/dailyAggregation.service');
const WeeklyService = require('../services/weeklyAggregation.service');
const HourlyService = require('../services/hourlyAggregation.service');
const readCsvFile = require('../services/csvReader.service')

const generateDailyReport = async (req, res) => {
  const file = './data/METRICS_REPORT-1673286660394 (3).csv';
  const dailyAggregator = new DailyService();
  readCsvFile(file, row => dailyAggregator.onData(row), () => dailyAggregator.onEnd());
  res.send("Daily Aggregation calculated and logged in the console.");
};

const generateWeeklyReport = async (req, res) => {
  const file = './data/METRICS_REPORT-1673351714089 (2).csv';
  const weeklyAggregator = new WeeklyService();
  readCsvFile(file, row => weeklyAggregator.onData(row), () => weeklyAggregator.onEnd());
  res.send("Weekly Aggregation Report generated and logged in the console.");
};

const generateHourlyReport = async (req, res) => {
  const file = './data/METRICS_REPORT-1673351714089 (1).csv';
  const hourlyAggregator = new HourlyService();
  readCsvFile(file, row => hourlyAggregator.onData(row), () => hourlyAggregator.onEnd());
  res.send("Hourly Aggregation Report generated and logged in the console.");
};

module.exports = {
  generateDailyReport,
  generateWeeklyReport,
  generateHourlyReport
};
