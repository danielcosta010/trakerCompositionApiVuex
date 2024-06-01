// import IProjeto from "@/interfaces/IProjeto";
// import { createStore, Store, useStore as vuexUseStore } from "vuex";
// import { InjectionKey } from 'vue'
// import { ADICIONA_PROJETO, ALTERA_PROJETO, DEFINIR_PROJETOS, EXCLUIR_PROJETO, NOTIFICAR } from "./tipo-mutacoes";
// import { INotificacao } from "@/interfaces/INotificacao";
// import { ALTERAR_PROJETO, CADASTRAR_PROJETO, OBTER_PROJETOS, REMOVER_PROJETO } from "./tipos-acoes";

// import http from "@/http"

// interface Estado {
//     projetos: IProjeto[],
//     notificacoes: INotificacao[]
// }

// export const key: InjectionKey<Store<Estado>> = Symbol()

// export const store = createStore<Estado>({
//     state: {
//         projetos: [],
//         notificacoes: []
//     },
//     mutations: {
//         [ADICIONA_PROJETO](state, nomeDoProjeto: string) {
//             const projeto = {
//                 id: new Date().toISOString(),
//                 nome: nomeDoProjeto
//             } as IProjeto
//             state.projetos.push(projeto)
//         },
//         [ALTERA_PROJETO](state, projeto: IProjeto) {
//             const index = state.projetos.findIndex(proj => proj.id == projeto.id)
//             state.projetos[index] = projeto
//         },
//         [EXCLUIR_PROJETO](state, id: string) {
//             state.projetos = state.projetos.filter(proj => proj.id != id)
//         },
//         [DEFINIR_PROJETOS] (state, projetos: IProjeto[]) {
//             state.projetos = projetos
//         },
//         [NOTIFICAR] (state, novaNotificacao: INotificacao) {

//             novaNotificacao.id = new Date().getTime()
//             state.notificacoes.push(novaNotificacao)

//             setTimeout(() => {
//                 state.notificacoes = state.notificacoes.filter(notificacao => notificacao.id != novaNotificacao.id)
//             }, 3000)
//         }
//     },
//     actions: {
//         [OBTER_PROJETOS] ({ commit }) {
//             http.get('projetos')
//                 .then(response => commit(DEFINIR_PROJETOS, response.data))
//         },
//         [CADASTRAR_PROJETO] (contexto, nomeDoProjeto: string) {
//             return http.post('/projetos', {
//                 nome: nomeDoProjeto
//             })
//         },
//         [ALTERAR_PROJETO] (contexto, projeto: IProjeto) {
//             return http.put(`/projetos/${projeto.id}`, projeto)
//         },
//         [REMOVER_PROJETO] ({ commit }, id: string) {
//             return http.delete(`/projetos/${id}`)
//                 .then(() => commit(EXCLUIR_PROJETO, id))
//         }
//     }
// })

// export function useStore(): Store<Estado> {
//     return vuexUseStore(key)

// }

import IProjeto from "@/interfaces/IProjeto";
import { createStore, Store, useStore as vuexUseStore } from "vuex";
import { InjectionKey } from 'vue';
import { ADICIONA_PROJETO, ALTERA_PROJETO, DEFINIR_PROJETOS, EXCLUIR_PROJETO, NOTIFICAR } from "./tipo-mutacoes";
import { INotificacao } from "@/interfaces/INotificacao";
import { ALTERAR_PROJETO, CADASTRAR_PROJETO, OBTER_PROJETOS, REMOVER_PROJETO } from "./tipos-acoes";

import http from "@/http";

interface Estado {
    projetos: IProjeto[],
    notificacoes: INotificacao[],
}

export const key: InjectionKey<Store<Estado>> = Symbol();

export const store = createStore<Estado>({
    state: {
        projetos: [],
        notificacoes: [],
    },
    mutations: {
        [ADICIONA_PROJETO](state, projeto: IProjeto) {
            state.projetos.push(projeto);
        },
        [ALTERA_PROJETO](state, projeto: IProjeto) {
            const index = state.projetos.findIndex(proj => proj.id === projeto.id);
            if (index !== -1) {
                state.projetos[index] = projeto;
            }
        },
        // [EXCLUIR_PROJETO](state, id: string) {
        //     const index = state.projetos.findIndex(proj => proj.id === id);
        //     if (index !== -1) {
        //         state.projetos.splice(index, 1); // Remove o projeto da lista
        //     }
        // },
        [EXCLUIR_PROJETO](state, id: string) {
            const index = state.projetos.findIndex(proj => proj.id === id);
            if (index !== -1) {
                state.projetos.splice(index, 1); // Remove o projeto da lista
        
                // Recalcula os IDs dos projetos restantes
                state.projetos.forEach((projeto, idx) => {
                    projeto.id = (idx + 1).toString();
                });
            }
        },
        
        [DEFINIR_PROJETOS](state, projetos: IProjeto[]) {
            state.projetos = projetos;
        },
        [NOTIFICAR](state, novaNotificacao: INotificacao) {
            novaNotificacao.id = new Date().getTime();
            state.notificacoes.push(novaNotificacao);

            setTimeout(() => {
                state.notificacoes = state.notificacoes.filter(notificacao => notificacao.id != novaNotificacao.id);
            }, 3000);
        }
    },
    actions: {
        [OBTER_PROJETOS]({ commit }) {
            return http.get('projetos')
                .then(response => commit(DEFINIR_PROJETOS, response.data));
        },
        // [CADASTRAR_PROJETO]({ state, commit }, nomeDoProjeto: string) {
        //     const novoId = state.projetos.length > 0 ? parseInt(state.projetos[state.projetos.length - 1].id, 10) + 1 : 1; // Gera o próximo ID sequencial
        //     const projeto = { id: novoId.toString(), nome: nomeDoProjeto } as IProjeto;

        //     return http.post('/projetos', projeto)
        //         .then(() => {
        //             commit(ADICIONA_PROJETO, projeto); // Usar o projeto com o ID gerado
        //         });
        // },
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
        }
    }
});

export function useStore(): Store<Estado> {
    return vuexUseStore(key);
}
