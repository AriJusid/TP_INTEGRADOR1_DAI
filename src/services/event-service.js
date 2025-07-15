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


export { getAll, getOne, getByID, createEvent, getLocationByID};