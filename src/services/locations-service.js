import LocRepo from '../repos/location-repo.js';


const getEventLocations = async () => {
    const repo = new LocRepo();
    const returnArray = await repo.getEventLocations();
    return returnArray;
};

const getEventLocationByID = async (id) => {
    const repo = new LocRepo();
    const returnArray = await repo.getEventLocationByID(id);
    return returnArray;
};

export {getEventLocations, getEventLocationByID}