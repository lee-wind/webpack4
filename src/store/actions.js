import { UPDATE_CURRENT_TAB_COMPONENT, RESET_CURRENT_TAB_COMPONENT } from "./mutation_types";

export default {
    updateCurrentTabComponent({ commit }, component){
        commit(UPDATE_CURRENT_TAB_COMPONENT, component);
    },
    resetCurrentTabComponent({ commit }){
        commit(RESET_CURRENT_TAB_COMPONENT);
    },
}
