import config from "./../config/config.js";
import pkg from "pg";

const { Pool } = pkg;
const pool = new Pool(config);

export default class EventRepo {
  getAll = async () => {
    let eventosArray = null;
    try {
      const sql = `
              SELECT
              e.id,
              e.name,
              e.description,
              e.start_date,
              e.duration_in_minutes,
              e.price,
              e.enabled_for_enrollment,
              el.max_capacity,
              json_build_object(
                  'id', u.id,
                  'first_name', u.first_name,
                  'last_name', u.last_name,
                  'username', u.username
              ),
              json_build_object(
                  'id', el.id,
                  'name', el.name,
                  'full_address', el.full_address,
                  'latitude', el.latitude,
                  'longitude', el.longitude,
                  'max_capacity', el.max_capacity
              )
          FROM
              events e
          JOIN event_locations el ON e.id_event_location = el.id
          JOIN users u ON e.id_creator_user = u.id;
  
            `;
      const result = await pool.query(sql);
      eventosArray = result.rows;
    } catch (e) {
      console.log(e);
    }
    return eventosArray;
  };

   getOne = async (name, start_date, tag) => {
    let evento = null;
  
    let sql = 'SELECT * FROM events WHERE';
    let values = [];
    let conditions = [];
  
    if (name) {
      conditions.push('name = $' + (conditions.length + 1)); 
      values.push(name);
    }
  
    if (start_date) {
      conditions.push('DATE(start_date) = $' + (conditions.length + 1)); // Ensure correct formatting here
      values.push(start_date);
    }
  
    if (tag) {
      conditions.push('id_event_category = $' + (conditions.length + 1));
      values.push(tag);
    }
  
    // If no conditions are provided, return all events (or handle as needed)
    if (conditions.length === 0) {
      sql = 'SELECT * FROM events'; // To fetch all events if no filter
    } else {
      sql += ' ' + conditions.join(' AND ');
    }
  
    try {
      console.log('SQL Query:', sql); // Debugging query
      console.log('Values:', values); // Debugging values
      
      const result = await pool.query(sql, values);
      evento = result.rows[0];  // Assuming you only want the first event
  
      console.log("Query Result:", evento); // Debugging result
  
    } catch (error) {
      console.log("Error:", error); // Log the error for debugging
    }
  
    return evento;
  };
  
}
