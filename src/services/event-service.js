import EventRepo from '../repos/events-repo.js'

export default class EventService{

    getAll = async () => {
        const repo = new EventRepo();
        const returnArray = await repo.getAll()
        return returnArray
    }

}