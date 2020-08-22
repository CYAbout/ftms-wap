export default ({app: {router}, store}) => {
  router.afterEacch((to, from) => {
    try {
      window._hmt = window._hmt || []
      window._hmt.push(['_trackPageview', to.fullPath])
    } catch (e) {
      
    }
  })
}