<script lang="ts">
    /**
     * SVG path value
     */
    export let path: string
    /**
     * Size of the icon icon
     */
    export let size: string = '1.6rem'
  </script>
  
<svg
    xmlns="http://www.w3.org/2000/svg"
    style="width:{size};height:{size}"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1"
        d={path}
    /></svg
>