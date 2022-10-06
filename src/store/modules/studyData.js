import API from '../../api' 

const state = {
    studyData: [],
    methodCounts: {}
};

const getters = {
    allStudyData: (state) => state.studyData,
    studyDataAwaitingApproval: (state) => state.studyData.filter(s => ( s.get("currentState") == "WaitingForBranchApproval")),
    studyDataAwaitingDevice: (state) => state.studyData.filter(s => ( s.get("currentState") == "WaitingForDevice" && s.get("deliveryProgress") == "Awaiting processing")),
    studyDataNoStudy: (state) => state.studyData.filter(s => ( s.get("studyBranch") == "NoStudy")),
    studyDataTrial: (state) => state.studyData.filter(s => ( s.get("studyBranch") == "Trial")),
    studyDataFreeLiving: (state) => state.studyData.filter(s => ( s.get("studyBranch") == "FreeLiving")),
    studyDataFreeLivingFromTrial: (state) => state.studyData.filter(s => ( s.get("studyBranch") == "FreeLivingFromTrial")),
    getStudyDataById: (state) => (id) => {
        console.log(id);
        return state.studyData.find(elem => elem.id == id)
    },
    methodCounts: (state) => state.methodCounts
};

const actions = {
    async fetchStudyData({ commit }) {
        const response = await API.GetStudyData();
        commit('setStudyData', response);
    }, 
    async fetchMethodCounts({ commit }) {
        const response = await API.GetCueingMethodCounts();    
        commit('setMethodCounts', response);
    }
};

const mutations = {
    setStudyData: (state, studyData) => (state.studyData = studyData),
    setMethodCounts: (state, methodCounts) => (state.methodCounts = methodCounts)
};

export default {
    state,
    getters,
    actions,
    mutations,
}