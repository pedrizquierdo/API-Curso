import pool from "../../config/db.js";

const getPokemons = async (id) => {
  const [rows] = await pool.query(
    "SELECT id_pokemon, name, icon, slug FROM pokemons WHERE id_user = ?",
    [id]
  );
  return rows;
};

const getPokemonsBySlug = async (slug, id_user) => {
  const [rows] = await pool.query(
    "SELECT id_pokemon, name, type, image, icon, slug FROM pokemons WHERE slug = ? AND id_user = ?",
    [slug, id_user]
  );
  return rows[0];
};

const createPokemon = async (name, type, image, id_user, slug, icon) => {
  const [result] = await pool.query(
    "INSERT INTO pokemons (name, type, image, id_user, slug, icon) VALUES (?, ?, ?, ?, ?, ?)",
    [name, type, image, id_user, slug, icon]
  );
  return result;
};

const updatePokemon = async (
  id_pokemon,
  id_user,
  name,
  type,
  image,
  icon,
  slug
) => {
  const [result] = await pool.query(
    "UPDATE pokemons SET name = ?, type = ?, image = ?, icon = ?, slug = ? WHERE id_pokemon = ? AND id_user = ?",
    [name, type, image, icon, slug, id_pokemon, id_user]
  );
  return result;
};

const deletePokemon = async (id_pokemon, id_user) => {
  const [result] = await pool.query(
    "DELETE FROM pokemons WHERE id_pokemon = ? AND id_user = ?",
    [id_pokemon, id_user]
  );
  return result;
};

export {
  getPokemons,
  getPokemonsBySlug,
  createPokemon,
  updatePokemon,
  deletePokemon,
};