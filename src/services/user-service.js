import { password } from 'pg/lib/defaults.js';
import UserRepo from '../repos/user-repo.js';

const logIn = async (username, password) => {
    const repo = new UserRepo();
    const user = await repo.logIn(username, password);
    return user;
};

const signUp = async (name, start_date,  tag) => {    

};

export { logIn, signUp};