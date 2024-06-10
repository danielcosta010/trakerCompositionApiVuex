const projeto = {
  id: 1,
  descricao: 'Reatividade Vue'
}

const proxy = new Proxy(projeto, {
  get(objetoOriginal, chave ) {
    console.log(`Alguém pediu a chave ${chave} do projeto`)
    return objetoOriginal[chave]
    },
    set(objetoOriginal, chave, valor) {
    console.log(`Alguém alterou a chave ${chave} para valor ${valor}`)
    objetoOriginal[chave] = valor

  }
})

proxy.descricao = 'Alterei a reatividade Vue'


console.log(proxy.descricao);