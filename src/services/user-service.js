import  password  from 'pg/lib/defaults.js';
import UserRepo from '../repos/user-repo.js';

const repo = new UserRepo();

const logIn = async (username, password) => {
    const user = await repo.logIn(username, password);
    return user;
};

const signUp = async (first_name, last_name, username, password) => {    
    const user = await repo.signUp(first_name, last_name, username, password);
    return user;
};

export { logIn, signUp};