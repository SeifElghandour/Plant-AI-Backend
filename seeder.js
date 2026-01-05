const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Disease = require('./models/Disease');

dotenv.config();
connectDB();

const diseasesData = [
  {
    name: 'Tomato_Late_Blight',
    symptoms: 'Dark spots on leaves and stems, fruit rot.',
    treatment: 'Use fungicides containing metalaxyl or mancozeb. Remove infected parts immediately.',
    prevention: 'Avoid overhead irrigation and ensure proper spacing between plants.'
  },
  {
    name: 'Potato_Early_Blight',
    symptoms: 'Circular brown spots on older leaves with concentric rings.',
    treatment: 'Apply copper-based organic fungicides or chemical fungicides like Chlorothalonil.',
    prevention: 'Use crop rotation and plant resistant varieties.'
  },
  {
    name: 'Healthy',
    symptoms: 'No symptoms detected.',
    treatment: 'Plant is healthy. Continue regular care.',
    prevention: 'Maintain regular monitoring.'
  }
];

const importData = async () => {
  try {
    await Disease.deleteMany();
    await Disease.insertMany(diseasesData);
    console.log('Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();