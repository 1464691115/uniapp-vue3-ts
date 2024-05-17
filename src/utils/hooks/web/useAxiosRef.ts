import { ref, watch } from "vue";

export default function <A>(props: { api: (...arg) => Promise<Result<A>>, immediate?}) {
    const result = ref<A>()

    watch(() => props, (val) => {
        if (val.immediate === false) return
        reload()
    }, {
        immediate: true
    })

    function reload() {
        props.api?.().then(res => {
            result.value = res.data
        })
    }

    return [
        result,
        reload
    ] as const
}