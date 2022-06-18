import { type Writable, get, derived, writable } from 'svelte/store';

export type Lazy<T> = Writable<Record<string,T>>



export function lazy<T>(store:Lazy<T>){
    const lazykey = Object.keys(get(store))[0]
    return {
        ...derived($setup[lazykey],value => {
            return value
        }),
        set: (value:T) => {
            const tmp = {} as Record<string,T>
            tmp[lazykey] = value
            $setup[lazykey].set(tmp)
        }
    }
}

export const setup = writable<Record<string,Writable<any>>>({})

let $setup = {} as Record<string,Writable<any>>

setup.subscribe(v=>$setup=v)