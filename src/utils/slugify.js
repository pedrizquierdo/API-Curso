import slugify from "slugify";

const generateSlug = (text) => {
  return slugify(text, {
    lower: true, // Convertir a minúsculas
    strict: true, // Remover caracteres especiales
    locale: "es", // Usar configuración en español
    remove: /[*+~.()'"!:@]/g, // Remover caracteres adicionales
  });
};

const generateUniqueSlug = (text) => {
  const baseSlug = generateSlug(text);
  return `${baseSlug}-${Date.now()}`;
};

export { generateSlug, generateUniqueSlug };