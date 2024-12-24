import { ref } from 'vue'

function useToggleEdit() {
    const state = ref(false)
    const onToggle = () => {
        state.value = !state.value
    }
    return { state, onToggle }
}

export default useToggleEdit