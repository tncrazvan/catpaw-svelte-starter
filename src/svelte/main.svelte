<script lang="ts">
  import { PhpRoute } from '@catpaw'
  import { HomePage, NotFoundPage } from '@pages'
  import { Route, Router } from 'svelte-routing'
</script>

<Router>
  <PhpRoute path="/" component={HomePage} />
  <Route path="*" component={NotFoundPage} />
</Router>
