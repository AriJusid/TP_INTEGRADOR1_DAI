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

const createLocation = async (userID) => {
    const repo = new LocRepo();
    const returnArray = await repo.createEventLocation(userID);
    return returnArray;
};

export {getEventLocations, createLocation, getEventLocationByID}
