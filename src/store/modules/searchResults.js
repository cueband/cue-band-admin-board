
const state = {
    searchResult: [],
};

const getters = {
    getSearchResult: (state) => state.searchResult,
    getSearchResultById: (state) => (id) => {
        console.log(id);
        return state.searchResult.find(elem => elem.id == id)
    },
};


const actions = {
    async setSearchResult({ commit }, data) {
        commit('setSearchResultMutator', data);
    }, 
};

const mutations = {
    setSearchResultMutator: (state, searchResult) => (state.searchResult = searchResult),
};

export default {
    state,
    getters,
    actions,
    mutations,
}