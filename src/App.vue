<template>
  <v-app>
    <v-main>
      <v-container :class="$mq == 'md' ? 'mx-2' : 'pa-0'" fluid>
        <home-page />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import home from "./views/Home";

export default {
  name: "App",

  components: {
    "home-page": home
  },
  data: () => ({
    //
  })
};
</script>
