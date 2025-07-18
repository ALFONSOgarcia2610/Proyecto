import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPokemonData } from "../apis/pokeapi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Pokemon() {
    const [pokemon, setPokemon] = useState("");

    const {
        data: pokemonData,
        error,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["pokemon", pokemon],
        queryFn: () => getPokemonData(pokemon.toLowerCase()),
        enabled: false,
    });

    const handleSearch = () => {
        if (pokemon.trim() === "") {
            toast.error("Por favor, ingresa el nombre de un Pokémon", {
                position: "bottom-right",
            });
            return;
        }
        refetch();
    };

    useEffect(() => {
        if (error) {
            toast.error("Error: Pokémon no encontrado", {
                position: "bottom-right",
            });
        }
    }, [error]);

    return (
        <Card className="w-full h-full shadow-lg">
            <CardHeader className="flex flex-col items-center">
                <CardTitle className="text-center text-2xl font-bold">POKEDEX</CardTitle>
            </CardHeader>

            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col space-y-4">
                        <Input
                            type="text"
                            value={pokemon}
                            onChange={(e) => setPokemon(e.target.value)}
                            placeholder="Ingresa el nombre de un Pokémon"
                            className="w-full p-2 border border-border rounded bg-background text-foreground"
                        />
                        <Button
                            onClick={handleSearch}
                            className="w-full bg-primary text-primary-foreground p-2 rounded hover:bg-primary/90"
                        >
                            Buscar
                        </Button>

                        {isLoading && (
                            <Button
                                type="button"
                                className="bg-indigo-500 text-white px-4 py-2 rounded flex items-center gap-2 cursor-progress"
                                disabled
                            >
                                <svg
                                    className="w-5 h-5 animate-spin motion-reduce:hidden"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden="true"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                                Cargando
                            </Button>
                        )}
                    </div>

                    <div className="flex justify-center items-center w-full">
                        {pokemonData ? (
                            <div className="overflow-hidden rounded-xl bg-card text-card-foreground shadow-md w-full max-w-xl flex flex-col md:flex-row">
                                <div className="flex items-center justify-center p-4 bg-secondary md:w-1/3">
                                    <img
                                        className="h-32 w-32 object-contain"
                                        src={pokemonData.sprites.front_default}
                                        alt={`Sprite de ${pokemonData.name}`}
                                    />
                                </div>
                                <div className="p-6 text-center md:text-left flex-1">
                                    <div className="text-sm font-semibold tracking-wide text-primary uppercase">
                                        {pokemonData.name}
                                    </div>
                                    <p className="mt-2">
                                        Altura:{" "}
                                        <span className="text-primary font-medium">{pokemonData.height}</span>
                                    </p>
                                    <p className="mt-2">
                                        Peso:{" "}
                                        <span className="text-primary font-medium">{pokemonData.weight}</span>
                                    </p>
                                    <p className="mt-2">
                                        Tipo(s):{" "}
                                        <span className="text-primary font-medium">
                                            {pokemonData.types.map((type: any) => type.type.name).join(", ")}
                                        </span>
                                    </p>
                                    <p className="mt-2">
                                        Habilidades:{" "}
                                        <span className="text-primary font-medium">
                                            {pokemonData.abilities
                                                .map((ability: any) => ability.ability.name)
                                                .join(", ")}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center">
                                Aquí se mostrará la información del Pokémon
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
