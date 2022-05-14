<script lang="ts">
  import { PhpRoute } from '@catpaw'

  import HomePage from '@pages/HomePage.svelte'
  import NotFoundPage from '@pages/NotFoundPage.svelte'
  import { Route, Router } from 'svelte-routing'
</script>

<Router>
  <PhpRoute path="/" component={HomePage} />
  <Route path="*" component={NotFoundPage} />
</Router>
