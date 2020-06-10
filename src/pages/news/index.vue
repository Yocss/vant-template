<template>
  <base-page
    class="news-index"
  >
    <router-link
      to="/"
    >
      回首页
    </router-link>
    <router-link
      to="/news/123"
    >
      去详情
    </router-link>
  </base-page>
</template>
<script>
export default {
  name: 'NewsIndex'
}
</script>
