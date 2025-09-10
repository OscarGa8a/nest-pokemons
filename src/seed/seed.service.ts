import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces/pokemon.interface';
// import axios, { AxiosInstance } from 'axios';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  private readonly fetch = fetch;
  // private readonly axios: AxiosInstance = axios;

  constructor(
    private pokemonService: PokemonService,
    private http: AxiosAdapter,
  ) {}

  // async executeSeed2() {
  //   console.log(this.fetch);
  //   try {
  //     const response = await this.fetch(
  //       'https://pokeapi.co/api/v2/pokemon?limit=10',
  //     );
  //     const data: PokemonResponse = await response.json();
  //     console.log(data);
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async executeSeed() {
    await this.pokemonService.deleteAll();

    const data = await this.http.get<PokemonResponse>(
      'https://pokeapi.co/api/v2/pokemon?limit=650',
    );

    // data.results.forEach(({ name, url }) => {
    //   // console.log({ name, url });
    //   const segments = url.split('/');
    //   const no = +segments[segments.length - 2];
    //   console.log({ name, no });
    // });

    const pokemons = data.results.map(({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[segments.length - 2];
      return { name, no };
    });

    await this.pokemonService.insertAll(pokemons);

    return 'Seed executed';
  }
}
