import http from "@/http";
import IProjeto from "@/interfaces/IProjeto";
import { Estado } from "@/store/";
import { ADICIONA_PROJETO, ALTERA_PROJETO, EXCLUIR_PROJETO, DEFINIR_PROJETOS } from "@/store/tipo-mutacoes";
import { OBTER_PROJETOS, CADASTRAR_PROJETO, ALTERAR_PROJETO, REMOVER_PROJETO } from "@/store/tipo-acoes";
import { Module } from "vuex";

export interface EstadoProjeto {
  projetos: IProjeto[]
}

export const projeto: Module<EstadoProjeto, Estado> = {
  mutations: {
    [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
      const projeto = {
        id: new Date().toISOString(),
        nome: nomeDoProjeto,

      } as IProjeto
      state.projetos.push(projeto);
    },
    [ALTERA_PROJETO](state, projeto: IProjeto) {
      const index = state.projetos.findIndex(proj => proj.id === projeto.id);
        state.projetos[index] = projeto;
      
    },
    [EXCLUIR_PROJETO](state, id: string) {
      state.projetos = state.projetos.filter(proj => proj.id != id)
    },

    [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
      state.projetos = projetos;
    },
  },
  actions: {
    [OBTER_PROJETOS]({ commit }) {
      http.get('projetos')
        .then(response => commit(DEFINIR_PROJETOS, response.data));
    },
    [CADASTRAR_PROJETO]({ state, commit }, nomeDoProjeto: string) {
      let novoId;
      if (state.projetos.length === 0) {
        novoId = 1; // Se não houver projetos, comece com ID 1
      } else {
        // Obtenha o último ID e adicione 1
        const ultimoId = parseInt(state.projetos[state.projetos.length - 1].id, 10);
        novoId = ultimoId + 1;
      }
      const projeto = { id: novoId.toString(), nome: nomeDoProjeto } as IProjeto;

      return http.post('/projetos', projeto)
        .then(() => {
          commit(ADICIONA_PROJETO, projeto); // Usar o projeto com o ID gerado
        });
    },

    [ALTERAR_PROJETO]({ commit }, projeto: IProjeto) {
      return http.put(`/projetos/${projeto.id}`, projeto)
        .then(response => {
          commit(ALTERA_PROJETO, response.data); // Usar o projeto completo retornado pelo servidor
        });
    },
    [REMOVER_PROJETO]({ commit }, id: string) {
      return http.delete(`/projetos/${id}`)
        .then(() => commit(EXCLUIR_PROJETO, id));
    },
  }

}