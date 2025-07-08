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

  getOne = async (id) => {
    let evento = null;

    try {
      const sql = `
        SELECT
          e.id AS event_id,
          e.name AS event_name,
          e.description,
          e.start_date AS event_date,
          e.duration_in_minutes AS event_duration,
          e.price AS ticket_price,
          e.enabled_for_enrollment AS is_enrollment_enabled,
          el.max_capacity AS event_capacity,
          json_build_object(
              'id', u.id,
              'first_name', u.first_name,
              'last_name', u.last_name,
              'username', u.username
          ) AS creator_user,
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
        JOIN users u ON e.id_creator_user = u.id
        WHERE e.id = $1
        GROUP BY e.id, el.id, u.id
      `;
      const result = await pool.query(sql, [id]);
      evento = result.rows[0];
    } catch (e) {
      console.log(e);
    }
    return evento;
  };
}
