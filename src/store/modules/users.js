import API from '../../api' 

const state = {
    users: []
};

const getters = {
    allUsers: (state) => state.users
};

const actions = {
    async fetchUsers({ commit }) {
        const response = await API.GetUsers();
        
        var t = response[0].get("username");

        console.log(response, t);
        commit('setUsers', response);
    }
};

const mutations = {
    setUsers: (state, users) => (state.users = users)
};

export default {
    state,
    getters,
    actions,
    mutations,
}