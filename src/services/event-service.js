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

export { getAll, getOne};