const router = require("express").Router();
const xlsx = require("xlsx");
const path = require("path");
const PostalCodeModel = require("../Models/PostalCodeModel");
const CountryModel = require("../Models/CountryModel");
const StateModel = require("../Models/StateModel");
const CityModel = require("../Models/CityModel");



async function extractAndInsertPostalCodes(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
    const postalSet = new Set();
    const inserts = [];
  
    for (const row of data) { 
        console.log("running");       
      const code = row.PINCODE.toString().trim();
      const cityName = (row.CITY || row['City Name'] || '').toUpperCase().trim();
      const stateName = (row.STATE || row['State Name'] || '').toUpperCase().trim();
  
      if (!code || !cityName || !stateName) continue;
  
      console.log("started");
      // Lookup city
      const city = await CityModel.findOne({
        name: cityName,
      }).populate('state');
  
      // Make sure state also matches
      if (!city || city.state.name.toUpperCase() !== stateName) continue;
  
      // Avoid duplicates
      const key = `${code}-${city._id}`;
      if (!postalSet.has(key)) {
        inserts.push({
          code,
          city: city._id
        });
        postalSet.add(key);
      }
    }
    console.log("ended");
    
    console.log(inserts);
    
    // if (inserts.length) {
    //   await PostalCodeModel.insertMany(inserts);
    //   console.log(`✅ Inserted ${inserts.length} postal codes`);
    // } else {
    //   console.log('⚠️ No new postal codes to insert.');
    // }
  }
  


  function extractUniqueStates(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
    const statesSet = new Set();
  
    data.forEach(row => {
      const state = (row.State || row['State Name'] || '').toUpperCase().trim();
      if (state) {
        statesSet.add(JSON.stringify({ name:state, country:"681a10bf8733456b8bf55a65" })); // stringify for uniqueness on both
      }
    });
  
    return Array.from(statesSet).map(item => JSON.parse(item));
  }
  

  function extractCities(filePath, stateList) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  
    // Convert stateList (from Mongo) into a map for quick lookups
    const stateMap = new Map(
      stateList.map(state => [state.name.toUpperCase(), state._id.toString()])
    );
  
    const citiesSet = new Set();
  
    data.forEach(row => {
      const city = (row.CITY || row['City Name'] || '').toUpperCase().trim();
      const stateName = (row.STATE || row['State Name'] || '').toUpperCase().trim();
  
      if (city && stateMap.has(stateName)) {
        const key = JSON.stringify({
          name: city,
          state: stateMap.get(stateName)
        });
        citiesSet.add(key);
      }
    });
  
    return Array.from(citiesSet).map(item => JSON.parse(item));
  }


// Utility to parse Excel
function parseExcel(filePath, country) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

  return data.map(row => ({
    // code: String(row.ZIP || row['Zip Code'] || row['Postal Code'] || '').trim(),
    // city: (row.CITY || row.District || row.Place || '').toUpperCase().trim(),
    state: (row.STATE || row['State Name'] || '').toUpperCase().trim(),
    // country
  }));
}

// Migration function
async function migrateData(req, res) {
  try {
    const files = [
    //   { file: path.join(__dirname, "../Canada.xlsx"), country: "Canada" },
    //   { file: path.join(__dirname, "../INDIA.xlsx"), country: "India" },
      { file: path.join(__dirname, "../US.xlsx"), country: "USA" },
    ];

    // let allData = [];
    // let uniqueStates = [];
    // for (const { file, country } of files) {
    //   const entries = parseExcel(file, country);
    //   allData = allData.concat(entries);
    //   const states = extractUniqueStates(file, country);
    //   uniqueStates = uniqueStates.concat(states);
    // }
    // const StateInsert = await StateModel.insertMany(uniqueStates);
    // console.log(StateInsert);
    
    
    
    const india = await CountryModel.findOne({ name: "INDIA" });
    const states = await StateModel.find({ country: india._id }, { name: 1 });
    const cities = extractCities(path.join(__dirname, "../INDIA.xlsx"), states);
    // const CitiesInsert = await CityModel.insertMany(cities);   
    // extractAndInsertPostalCodes(path.join(__dirname, '../INDIA.xlsx'))
    // .catch(console.error);
    res.status(200).json({ message: "Data migration successful" });
  } catch (error) {
    console.error("Migration error:", error);
    res.status(500).json({ error: "Data migration failed", details: error.message });
  }
}

router.get("/migrate-data", migrateData);
module.exports = router;
