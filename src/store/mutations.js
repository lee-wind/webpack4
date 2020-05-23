import { UPDATE_CURRENT_TAB_COMPONENT, RESET_CURRENT_TAB_COMPONENT } from "./mutation_types";

export default {
    [UPDATE_CURRENT_TAB_COMPONENT](state, component){
        state.currentTabComponent = component;
    },
    [RESET_CURRENT_TAB_COMPONENT](state){
        console.log('重置currentTabComponent');
        state.currentTabComponent = {
            name: ''
        };
    },
}
