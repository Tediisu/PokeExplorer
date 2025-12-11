const BASE_URL = 'https://pokeapi.co/api/v2'; // ✅ Fixed URL

export interface PokemonListItem {
  name: string;
  url: string;
}

export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

export interface PokemonTypeSlot {
  slot: number;
  type: {
    name: string;
    url: string;
  };
}

export interface PokemonSpriteSet {
  front_default: string | null;
  front_shiny: string | null;
}

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: PokemonTypeSlot[];
  sprites: PokemonSpriteSet;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PokéAPI error ${res.status}: ${text}`); // ✅ Fixed template literal
  }
  return res.json() as Promise<T>;
}

export async function getPokemonList(
  limit = 20,
  offset = 0,
): Promise<PokemonListResponse> {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`); // ✅ Fixed template literal
  return handleResponse<PokemonListResponse>(res);
}

export async function getPokemon(idOrName: number | string): Promise<Pokemon> {
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`); // ✅ Fixed template literal
  return handleResponse<Pokemon>(res);
}
