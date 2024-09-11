import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#343a40',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderColor: '#ced4da',
    borderWidth: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ced4da',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    color: '#495057',
  },
  selectedTypeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default function Pokemon() {
  const [selectedPokemon, setSelectedPokemon] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [pokemonList, setPokemonList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [filteredPokemonList, setFilteredPokemonList] = useState([]);
  const [pokemonSprite, setPokemonSprite] = useState('');

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=2000')
      .then((response) => response.json())
      .then((data) => setPokemonList(data.results))
      .catch(() => console.log('Error fetching Pokémon.'));
  }, []);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/type?limit=2000')
      .then((response) => response.json())
      .then((data) => setTypeList(data.results))
      .catch(() => console.log('Error fetching types.'));
  }, []);

  useEffect(() => {
    if (selectedType) {
      fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
        .then((response) => response.json())
        .then((data) => {
          const filteredPokemons = data.pokemon.map((p) => p.pokemon);
          setFilteredPokemonList(filteredPokemons);
        })
        .catch(() => console.log('Error fetching Pokémon by type.'));
    } else {
      setFilteredPokemonList(pokemonList);
    }
  }, [selectedType, pokemonList]);

  useEffect(() => {
    if (selectedPokemon) {
      fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`)
        .then((response) => response.json())
        .then((data) => setPokemonSprite(data.sprites.front_default))
        .catch(() => console.log('Error fetching Pokémon sprite.'));
    } else {
      setPokemonSprite('');
    }
  }, [selectedPokemon]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Pokédex</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.text}>Tipos:</Text>
        <Picker
          selectedValue={selectedType}
          style={styles.picker}
          onValueChange={(item) => setSelectedType(item)}
        >
          <Picker.Item label="Selecione um tipo" value="" />
          {typeList.map((item, index) => (
            <Picker.Item key={index} label={item.name} value={item.name} />
          ))}
        </Picker>
      </View>
      {selectedType && (
        <View>
          <Text style={styles.selectedTypeText}>Você selecionou {selectedType}</Text>
          <View style={styles.pickerContainer}>
            <Text style={styles.text}>Pokémons:</Text>
            <Picker
              selectedValue={selectedPokemon}
              style={styles.picker}
              onValueChange={(item) => setSelectedPokemon(item)}
            >
              <Picker.Item label="Selecione um Pokémon" value="" />
              {filteredPokemonList.map((item, index) => (
                <Picker.Item key={index} label={item.name} value={item.name} />
              ))}
            </Picker>
          </View>
          {selectedPokemon && (
            <Text style={styles.text}>Você selecionou {selectedPokemon}</Text>
          )}
          {pokemonSprite && (
            <Image source={{ uri: pokemonSprite }} style={styles.pokemonImage} />
          )}
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setSelectedPokemon('')}>
        <Text style={styles.buttonText}>Limpar Seleção</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}