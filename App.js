import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function App() {
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [lista, setLista] = useState([])
  const [editandoId, setEditandoId] = useState(null)

  useEffect(() => {
    carregar()
  }, [])

  async function adicionar() {
    if (!nome) return

    let novaLista

    if (editandoId) {
      novaLista = lista.map((item) =>
        item.id === editandoId
          ? { ...item, nome, idade }
          : item
      )
      setEditandoId(null)
    } else {
      novaLista = [
        ...lista,
        {
          id: Date.now().toString(),
          nome,
          idade
        }
      ]
    }

    setLista(novaLista)
    setNome('')
    setIdade('')

    await AsyncStorage.setItem('usuarios', JSON.stringify(novaLista))
  }

  async function carregar() {
    const dados = await AsyncStorage.getItem('usuarios')
    if (dados) setLista(JSON.parse(dados))
  }

  async function limparTudo() {
    await AsyncStorage.removeItem('usuarios')
    setLista([])
  }

  function editarUsuario(item) {
    setNome(item.nome)
    setIdade(item.idade)
    setEditandoId(item.id)
  }

  function removerUsuario(id) {
    const novaLista = lista.filter((item) => item.id !== id)
    setLista(novaLista)
    AsyncStorage.setItem('usuarios', JSON.stringify(novaLista))
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro</Text>

      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />

      <TextInput
        placeholder="Idade"
        value={idade}
        onChangeText={setIdade}
        keyboardType="numeric"
        style={styles.input}
      />

      <TouchableOpacity style={styles.botao} onPress={adicionar}>
        <Text style={styles.botaoTexto}>
          {editandoId ? 'Salvar' : 'Adicionar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoSecundario} onPress={limparTudo}>
        <Text style={styles.botaoTexto}>Limpar tudo</Text>
      </TouchableOpacity>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.idade}>{item.idade} anos</Text>
            </View>

            <View style={styles.acoes}>
              <TouchableOpacity
                style={styles.btnEditar}
                onPress={() => editarUsuario(item)}
              >
                <Text style={styles.textoAcao}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnRemover}
                onPress={() => removerUsuario(item.id)}
              >
                <Text style={styles.textoAcao}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f2f2f2'
  },
  titulo: {
    fontSize: 24,
    marginBottom: 15,
    fontWeight: '600'
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  botao: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },
  botaoSecundario: {
    backgroundColor: '#777',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: '600'
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  nome: {
    fontSize: 16,
    fontWeight: '600'
  },
  idade: {
    color: '#555'
  },
  acoes: {
    flexDirection: 'row',
    gap: 10
  },
  btnEditar: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 6
  },
  btnRemover: {
    backgroundColor: '#E53935',
    padding: 8,
    borderRadius: 6
  },
  textoAcao: {
    color: '#fff',
    fontWeight: '600'
  }
})