import {
  getPokemons,
  getPokemonsBySlug,
  createPokemon,
  updatePokemon,
  deletePokemon,
} from "./pokemon.model.js";
import { errorHandlerController } from "../../helpers/errorHandlerController.js";
import { generateSlug, generateUniqueSlug } from "../../utils/slugify.js";

const getPokemonsController = async (req, res) => {
  try {
    const { id_user } = req.user;
    const pokemons = await getPokemons(id_user);
    res.status(200).json(pokemons);
  } catch (error) {
    return errorHandlerController(
      "Error al obtener los pokemons",
      500,
      res,
      error
    );
  }
};

const getPokemonsBySlugController = async (req, res) => {
  try {
    const { slug } = req.params;
    const { id_user } = req.user;
    const pokemon = await getPokemonsBySlug(slug, id_user);

    if (!pokemon) {
      return errorHandlerController("Pokemon no encontrado", 404, res);
    }

    res.status(200).json(pokemon);
  } catch (error) {
    return errorHandlerController(
      "Error al obtener el pokemon",
      500,
      res,
      error
    );
  }
};

const createPokemonController = async (req, res) => {
  try {
    let { name, type, image, slug, icon } = req.body;

    if (!name || !type || !image || !icon) {
      return errorHandlerController(
        "Los campos name, type, image e icon son obligatorios",
        400,
        res
      );
    }

    // Generar slug automáticamente si no se proporciona
    slug = slug ? generateSlug(slug) : generateSlug(name);

    const { id_user } = req.user;

    try {
      const result = await createPokemon(
        name,
        type,
        image,
        id_user,
        slug,
        icon
      );

      res.status(201).json({
        message: "Pokemon creado exitosamente",
        id_pokemon: result.insertId,
        slug: slug,
      });
    } catch (dbError) {
      // Error de slug duplicado
      if (dbError.code === "ER_DUP_ENTRY") {
        // Intentar con un slug único agregando timestamp
        const uniqueSlug = generateUniqueSlug(name);
        const result = await createPokemon(
          name,
          type,
          image,
          id_user,
          uniqueSlug,
          icon
        );

        res.status(201).json({
          message: "Pokemon creado exitosamente",
          id_pokemon: result.insertId,
          slug: uniqueSlug,
        });
      } else {
        throw dbError;
      }
    }
  } catch (error) {
    return errorHandlerController("Error al crear el pokemon", 500, res, error);
  }
};

const updatePokemonController = async (req, res) => {
  try {
    const { id_pokemon } = req.params;
    const { id_user } = req.user;
    let { name, type, image, icon, slug } = req.body;

    if (!name || !type || !image || !icon) {
      return errorHandlerController(
        "Todos los campos son obligatorios",
        400,
        res
      );
    }

    // Regenerar slug si se proporciona o usar el nombre
    slug = slug ? generateSlug(slug) : generateSlug(name);

    try {
      const result = await updatePokemon(
        id_pokemon,
        id_user,
        name,
        type,
        image,
        icon,
        slug
      );

      if (result.affectedRows === 0) {
        return errorHandlerController(
          "Pokemon no encontrado o no tienes permiso para modificarlo",
          404,
          res
        );
      }

      res.status(200).json({
        message: "Pokemon actualizado exitosamente",
        slug: slug,
      });
    } catch (dbError) {
      // Error de slug duplicado para este usuario
      if (dbError.code === "ER_DUP_ENTRY") {
        const uniqueSlug = generateUniqueSlug(name);
        const result = await updatePokemon(
          id_pokemon,
          id_user,
          name,
          type,
          image,
          icon,
          uniqueSlug
        );

        if (result.affectedRows === 0) {
          return errorHandlerController(
            "Pokemon no encontrado o no tienes permiso para modificarlo",
            404,
            res
          );
        }

        res.status(200).json({
          message: "Pokemon actualizado exitosamente",
          slug: uniqueSlug,
        });
      } else {
        throw dbError;
      }
    }
  } catch (error) {
    return errorHandlerController(
      "Error al actualizar el pokemon",
      500,
      res,
      error
    );
  }
};

const deletePokemonController = async (req, res) => {
  try {
    const { id_pokemon } = req.params;
    const { id_user } = req.user;
    const result = await deletePokemon(id_pokemon, id_user);

    if (result.affectedRows === 0) {
      return errorHandlerController(
        "Pokemon no encontrado o no tienes permiso para eliminarlo",
        404,
        res
      );
    }

    res.status(200).json({ message: "Pokemon eliminado exitosamente" });
  } catch (error) {
    return errorHandlerController(
      "Error al eliminar el pokemon",
      500,
      res,
      error
    );
  }
};

export {
  getPokemonsController,
  getPokemonsBySlugController,
  createPokemonController,
  updatePokemonController,
  deletePokemonController,
};