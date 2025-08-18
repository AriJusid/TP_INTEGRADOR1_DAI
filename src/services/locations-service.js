import LocRepo from '../repos/location-repo.js';

const getEventLocations = async (id) => {
    const repo = new LocRepo();
    const returnArray = await repo.getEventLocations(id);
    return returnArray;
};


const getEventLocationByID = async (userID, id) => {
    const repo = new LocRepo();
    const returnArray = await repo.getEventLocationByID(userID, id);
    console.log(returnArray)
    return returnArray;
};

const createLocation = async (id_location,
    name,
    full_address,
    max_capacity,
    latitude,
    longitude,
    id_creator_user) => {
    const repo = new LocRepo();
    const returnArray = await repo.createEventLocation(id_location,
        name,
        full_address,
        max_capacity,
        latitude,
        longitude,
        id_creator_user);
    console.log("return", returnArray.rows)
    return returnArray;
};

export {getEventLocations, createLocation, getEventLocationByID}
