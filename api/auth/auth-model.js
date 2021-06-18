const db = require('../../data/dbConfig')


function findById(id) {
    return db('users').select('*').where({ id }).first();
}

function findBy(filter) {
    return db('users').select('*').where(filter)
}

async function add(user) {
    const [id] = await db('users').insert(user, 'id');
    return findById(id);
}


module.exports = {
    add,
    findBy,
    findById
  };