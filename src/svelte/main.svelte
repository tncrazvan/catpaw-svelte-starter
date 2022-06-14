<script lang="ts">
  import { StatefulRoute } from '@catpaw'
  import { HomePage, NotFoundPage } from '@pages'
  import { Route, Router } from 'svelte-routing'
</script>

<Router>
  <StatefulRoute path="/" component={HomePage} />
  <Route path="*" component={NotFoundPage} />
</Router>
