import config from "./../config/config.js";
import pkg from "pg";

const { Pool } = pkg;
const pool = new Pool(config);

export default class LocRepo {
    
getEventLocations = async () => {
    let locationsArray = null;
    try {
      const sql = `
              SELECT *  FROM event_locations;`;
          
      const result = await pool.query(sql);
      locationsArray = result.rows;
    } catch (e) {
      console.log(e);
    }
    return locationsArray;
  };
  
  getEventLocationByID = async (id) => {
      
    let location = null;
    let values = [id];
  
    try {
      const sql = `
      SELECT * FROM event_locations WHERE id = $1; `
  
      //console.log('SQL Query:', sql); 
      //console.log('Values:', values); 
      
      const result = await pool.query(sql, values);
      location = result.rows[0];  
  
      // console.log("Query Result:", evento); 
  
    } catch (error) {
      console.log("Error:", error); 
    }
  
    return location;
  };
}