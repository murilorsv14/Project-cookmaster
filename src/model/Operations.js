const { ObjectId } = require('mongodb');
const connection = require('./connection');

const insertOne = async (collection, product) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .insertOne(product));
    return result.ops.pop() || null;
  } catch (error) {
    return error.message;
  }
};

const getOneByEmail = async (collection, email) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .find({ email })
    .toArray());
    return result || null;
  } catch (error) {
    return error.message;
  }
};

const getUser = async (collection, email, password) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .find({ email, password }, { limit: 1 })
    .toArray());
    return result || null;
  } catch (error) {
    return error.message;
  }
};

const getById = async (collection, id) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .find({ _id: ObjectId(id) }, { limit: 1 })
    .toArray());
    return result[0] || null;
  } catch (err) {
    return console.log(err.message);
  }
};

const getAll = async (collection) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .find({})
    .toArray());
    return result || null;
  } catch (error) {
    console.log(error.message);
  }
};

const updateOne = async (collection, product, id) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .updateOne(
      { _id: ObjectId(id) },
      { $set: product },
      { returnDocument: 'after' },
    ));
    return result.modifiedCount || null;
  } catch (error) {
    console.log(error.message);
  }
};

const deleteOne = async (collection, id) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .findOneAndDelete(
      { _id: ObjectId(id) },
      { returnOriginal: 'after' },
    ));
    return result.value || null;
  } catch (error) {
    console.log(error.message);
  }
};

const editImage = async (collection, id) => {
  try {
    const result = await connection()
    .then((db) => db.collection(collection)
    .updateOne(
      { _id: ObjectId(id) },
      { $set: { image: `localhost:3000/src/uploads/${id}.jpeg` } },
      // { $set: { 'campo-imaginario': 'returned' } },
      { returnNewDocument: true, new: true, upsert: true },
    ));
    return result.result.ok || null;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = (collection) => ({
  insertOne: (product) => insertOne(collection, product),
  getOneByEmail: (email) => getOneByEmail(collection, email),
  getUser: (email, senha) => getUser(collection, email, senha),
  getAll: () => getAll(collection),
  getById: (id) => getById(collection, id),
  updateOne: (product, id) => updateOne(collection, product, id),
  deleteOne: (id) => deleteOne(collection, id),
  editImage: (id) => editImage(collection, id),
});