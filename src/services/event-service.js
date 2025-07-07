import EventRepo from '../repos/event-repo.js';

const getAll = async () => {
    const repo = new EventRepo();
    const returnArray = await repo.getAll();
    return returnArray;
};

export { getAll };