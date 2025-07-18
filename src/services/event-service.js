import e from 'cors';
import EventRepo from '../repos/event-repo.js';

const getAll = async () => {
    const repo = new EventRepo();
    const returnArray = await repo.getAll();
    return returnArray;
};

const getOne = async (name, start_date,  tag) => {    
    const repo = new EventRepo();
    const eventReturn = await repo.getOne(name, start_date,  tag);
    return eventReturn;
};

const getByID= async (id) => {    
    const repo = new EventRepo();
    const eventReturn = await repo.getByID(id);
    return eventReturn;
};

const createEvent = async (name,
    description,
    id_event_category,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_creator_user ) => {    
    const repo = new EventRepo();
    const eventReturn = await repo.createEvent(name,
        description,
        id_event_category,
        id_event_location,
        start_date,
        duration_in_minutes,
        price,
        enabled_for_enrollment,
        max_assistance,
        id_creator_user );
    return eventReturn;
};

const getLocationByID = async (id) =>{
    const repo = new EventRepo();
    const location = await repo.getLocationByID(id);
    return location;
}

const updateEvent = async (id, name,
    description,
    id_event_category,
    id_event_location,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_creator_user) =>{
    const repo = new EventRepo();
    const location = await repo.updateEvent(id, name,
        description,
        id_event_category,
        id_event_location,
        start_date,
        duration_in_minutes,
        price,
        enabled_for_enrollment,
        max_assistance,
        id_creator_user);
    return location;
}

const deleteEvent = async (id) =>{
    const repo = new EventRepo();
    const result = await repo.deleteEvent(id);
    return result;
}

const isValidDate = async(start_date) =>{
   
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    start_date.setHours(0, 0, 0, 0);
  
    return start_date <= today;
  }

const fetchEventUsers = async(eventId) =>{
    const repo = new EventRepo();
    const result = await repo.getUsersByEvent(eventId);
    return result 
}

const newEnrollment = async (eventID, userID) => {    
    const repo = new EventRepo();
    const result = await repo.newEnrollment(eventID, userID);
    return result;
};

const deleteEnrollment = async (eventID, userID) => {    
    const repo = new EventRepo();
    const result = await repo.deleteEnrollment(eventID, userID);
    return result;
};

export { isValidDate, fetchEventUsers, getAll, getOne, getByID, createEvent, getLocationByID, updateEvent, deleteEvent, newEnrollment, deleteEnrollment};