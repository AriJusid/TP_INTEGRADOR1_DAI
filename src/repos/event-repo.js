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
              json_build_object (
                  'id', u.id,
                  'first_name', u.first_name,
                  'last_name', u.last_name,
                  'username', u.username
              ) AS creator,
              json_build_object(
                  'id', el.id,
                  'name', el.name,
                  'full_address', el.full_address,
                  'latitude', el.latitude,
                  'longitude', el.longitude,
                  'max_capacity', el.max_capacity
              ) AS location
          FROM
              events e
          JOIN event_locations el ON e.id_event_location = el.id
          JOIN users u ON e.id_creator_user = u.id;  `;
          
      const result = await pool.query(sql);
      eventosArray = result.rows;
    } catch (e) {
      console.log(e);
    }
    return eventosArray;
  };

   getOne = async (name, start_date, tag) => {
    let evento = null;
  
    let sql = `SELECT
    e.id,
    e.name,
    e.description,
    e.start_date,
    e.duration_in_minutes,
    e.price,
    e.enabled_for_enrollment,
    el.max_capacity,
    json_build_object (
        'id', u.id,
        'first_name', u.first_name,
        'last_name', u.last_name,
        'username', u.username
    ) AS creator,
    json_build_object(
        'id', el.id,
        'name', el.name,
        'full_address', el.full_address,
        'latitude', el.latitude,
        'longitude', el.longitude,
        'max_capacity', el.max_capacity
    ) AS location,    tags.name AS tag_names

    FROM events e
    JOIN event_locations el ON e.id_event_location = el.id
    JOIN users u ON e.id_creator_user = u.id  
    LEFT JOIN event_tags et ON et.id_event = e.id
    LEFT JOIN tags ON tags.id = et.id_tag
    WHERE`;

    let values = [];
    let conditions = [];
  
    if (name) {
      conditions.push('e.name = $' + (conditions.length + 1)); 
      values.push(name);
    }
  
    if (start_date) {
      conditions.push('DATE(start_date) = $' + (conditions.length + 1)); 
      values.push(start_date);
    }
  
    if (tag) {
      conditions.push('tags.name = $' + (conditions.length + 1));
      values.push(tag);
    }
  

    if (conditions.length === 0) {
      sql = 'SELECT * FROM events'; 
    } else {
      sql += ' ' + conditions.join(' AND ');
    }
  
    try {
      console.log('SQL Query:', sql); 
      console.log('SQL values:', values); 
      // console.log('Values:', values); 
      
      const result = await pool.query(sql, values);
      evento = result.rows[0];  
  
      console.log("Query Result:", evento); 
  
    } catch (error) {
      //console.log("Error:", error); 
    }
  
    return evento;
  };

  getByID = async (id) => {
    
    let evento = null;
    let values = [id];
  
    try {
      const sql = `
      SELECT
  events.id,
  events.name,
  events.description,
  events.id_event_location,
  events.start_date,
  events.duration_in_minutes,
  events.price,
  events.enabled_for_enrollment,
  events.max_assistance,
  events.id_creator_user,

  -- Información de la ubicación del evento
  event_locations.id AS event_location_id,
  event_locations.id_location,
  event_locations.name AS event_location_name,
  event_locations.full_address,
  event_locations.max_capacity AS event_location_max_capacity,
  event_locations.latitude AS event_location_latitude,
  event_locations.longitude AS event_location_longitude,
  event_locations.id_creator_user AS event_location_creator_user,

  -- Información de la localidad
  locations.id AS location_id,
  locations.name AS location_name,
  locations.id_province,
  locations.latitude AS location_latitude,
  locations.longitude AS location_longitude,

  -- Información de la provincia
  provinces.id AS province_id,
  provinces.name AS province_name,
  provinces.full_name AS province_full_name,
  provinces.latitude AS province_latitude,
  provinces.longitude AS province_longitude,

  -- Información del creador del evento
  creator_user.id AS creator_user_id,
  creator_user.first_name AS creator_user_first_name,
  creator_user.last_name AS creator_user_last_name,
  creator_user.username AS creator_user_username,

  -- Información de los tags
  tags.name AS tag

FROM events 
JOIN event_locations ON events.id_event_location = event_locations.id
JOIN locations ON event_locations.id_location = locations.id
JOIN provinces ON locations.id_province = provinces.id
JOIN users AS creator_user ON events.id_creator_user = creator_user.id
LEFT JOIN event_tags et ON et.id_event = events.id
LEFT JOIN tags ON tags.id = et.id_tag
WHERE events.id = $1; `

      console.log('SQL Query:', sql); 
      console.log('Values:', values); 
      
      const result = await pool.query(sql, values);
      evento = result.rows[0];  
  
      // console.log("Query Result:", evento); 
  
    } catch (error) {
      console.log("Error:", error); 
    }
  
    return evento;
  };


  createEvent = async (
    name,
    description,
    id_event_category,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_creator_user
  ) => {
    let event = null;
    let sql = `INSERT INTO events (
      name,
      description,
      id_event_category,
      id_event_location,
      start_date,
      duration_in_minutes,
      price,
      enabled_for_enrollment,
      max_assistance,
      id_creator_user
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
    ) RETURNING *;`;
  
    let values = [
      name,
      description,
      id_event_category,
      id_event_location,
      start_date,
      duration_in_minutes,
      price,
      enabled_for_enrollment,
      max_assistance,
      id_creator_user
    ];
  
    try {
      console.log("SQL Query:", sql);
      console.log("SQL values:", values);
      const result = await pool.query(sql, values);
      event = result.rows[0]; 
    } catch (e) {
      console.log(e);
    }
    return event;
  };

getLocationByID = async (id) => {
    
  let evento = null;
  let values = [id];

  try {
    const sql = `
    SELECT max_capacity
FROM event_locations 
WHERE event_locations.id = $1;`

   
    const result = await pool.query(sql, values);
    evento = result.rows[0];  
  } catch (error) {
    console.log("Error:", error); 
  }

  return evento;
};

updateEvent = async (id,
  name,
  description,
  id_event_category,
  id_event_location,
  start_date,
  duration_in_minutes,
  price,
  enabled_for_enrollment,
  max_assistance,
  id_creator_user
) => {
  let event = null;
//   let sql = `UPDATE events SET
//   name = $2,
//   description = $3,
//   id_event_category = $4,
//   id_event_location = $5,
//   start_date = $6,
//   duration_in_minutes = $7,
//   price = $8,
//   enabled_for_enrollment = $9,
//   max_assistance = $10,
//   id_creator_user = $11
// WHERE id = $1
// RETURNING *;`
let sql = `SELECT * FROM events WHERE id = 8`

  let values = [
    id,
    name,
    description,
    id_event_category,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_creator_user
  ];

  try {
    console.log("id:", id)
    console.log("SQL Query:", sql);
    console.log("SQL values:", values);
    const result = await pool.query(sql, values);
    console.log("result:", result)
    event = result.rows[0]; 
  } catch (e) {
    console.log(e);
  }
  return event;
};

deleteEvent = async (id) => {
    
  let evento = null;
  let values = [id];

  try {
    const sql = `DELETE FROM events WHERE id = $1 RETURNING *;`

    const result = await pool.query(sql, values);

    evento = result.rows[0];  

  } catch (error) {
    console.log("Error:", error); 
  }

  return evento;
};


}
