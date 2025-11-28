import { Router } from "express";
import {
  createPokemonController,
  deletePokemonController,
  getPokemonsController,
  getPokemonsBySlugController,
  updatePokemonController,
} from "./pokemon.controller.js";
import { verifyToken } from "../../middlewares/authMiddleware.js";

const router = Router();

router.get("/pokemons", verifyToken, getPokemonsController);
router.get("/pokemons/:slug", verifyToken, getPokemonsBySlugController);
router.post("/pokemons", verifyToken, createPokemonController);
router.put("/pokemons/:id_pokemon", verifyToken, updatePokemonController);
router.delete("/pokemons/:id_pokemon", verifyToken, deletePokemonController);

export default router;