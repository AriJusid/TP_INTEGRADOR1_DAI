import LocRepo from '../repos/location-repo.js';




const getEventLocations = async (id) => {
    const repo = new LocRepo();
    const returnArray = await repo.getEventLocations(id);
    return returnArray;
};


const getEventLocationByID = async (userID, id) => {
    const repo = new LocRepo();
    const returnArray = await repo.getEventLocationByID(userID, id);
    return returnArray;
};


export {getEventLocations, getEventLocationByID}
