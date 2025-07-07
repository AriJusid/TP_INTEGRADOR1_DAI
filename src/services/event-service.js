import EventRepo from '../repos/event-repo.js';

const getAll = async () => {
    const repo = new EventRepo();
    const returnArray = await repo.getAll();
    return returnArray;
};

const getOne = async (values) => {    
    const repo = new EventRepo();
    const eventReturn = await repo.getOne(values);
    return eventReturn;
};

export { getAll, getOne};