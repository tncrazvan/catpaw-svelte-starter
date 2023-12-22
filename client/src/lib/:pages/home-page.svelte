{#await fetch("/api") then response}
    {#await response.text() then value}
        <span>{value}</span>
    {/await}
{/await}