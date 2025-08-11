import config from "./../config/config.js";
import pkg from "pg";


const { Pool } = pkg;
const pool = new Pool(config);


export default class LocRepo {
   
getEventLocations = async (id) => {
    let locationsArray = null;
    let values = [id];
    console.log(id)


    try {
      const sql = `
              SELECT
  el.*,
  l.name AS location_name,
  l.latitude AS location_latitude,
  l.longitude AS location_longitude,
  p.name AS province_name,
  p.full_name AS province_full_name,
  p.latitude AS province_latitude,
  p.longitude AS province_longitude,
  u.username AS creator_username
FROM event_locations el
JOIN locations l ON el.id_location = l.id
JOIN provinces p ON l.id_province = p.id
JOIN users u ON el.id_creator_user = u.id
WHERE el.id_creator_user = $1;`;
         
      const result = await pool.query(sql, values);
      locationsArray = result.rows;
      console.log(locationsArray)
    } catch (e) {
      console.log("catch:",e);
    }
    return locationsArray;
  };
 
  getEventLocationByID = async (userID, id) => {
     
    let location = null;
    let values = [userID, id];


    try {
      const sql = `
      SELECT * FROM event_locations WHERE id = $2 AND id_creator_user = $1; `


      //console.log('SQL Query:', sql);
     
      const result = await pool.query(sql, values);
      location = result.rows[0];  
 
      // console.log("Query Result:", evento);
 
    } catch (error) {
      console.log("Error:", error);
    }
 
    return location;
  };
}
