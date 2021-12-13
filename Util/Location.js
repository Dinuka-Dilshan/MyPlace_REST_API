const axios = require("axios");
const HttpError = require("../Models/HttpError");

const getCoordinates = async (address) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.API_KEY}`
    );
   
    if (response.data && response.data.status !== "ZERO_RESULTS") {
      return response.data.results[0].geometry.location;
    }else{
      throw new HttpError('Addrerss invalid',422);
    }
  } catch (error) {
    
  }
};

module.exports = getCoordinates;
