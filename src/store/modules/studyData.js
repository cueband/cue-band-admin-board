import API from '../../api' 

const state = {
    studyData: []
};

const getters = {
    allStudyData: (state) => state.studyData,
    getStudyDataById: (state) => (id) => {
        console.log(id);
        return state.studyData.find(elem => elem.id == id)
    },
};

const actions = {
    async fetchStudyData({ commit }) {
        const response = await API.GetStudyData();
    
        console.log(response);
        commit('setStudyData', response);
    }
};

const mutations = {
    setStudyData: (state, studyData) => (state.studyData = studyData)
};

export default {
    state,
    getters,
    actions,
    mutations,
}