{#await fetch("/api/v1") then response}
    {#await response.text() then value}
        <span>{value}</span>
    {/await}
{/await}