
export default function ({ route, redirect }) {
  console.log('redirect===', process.client)
  if (process.client) {
    // const token = Util.Params.GetArgsFromHref(window.location.href, 'token')
    // const token = sessionStorage.getItem('token')
    // if (!token && route.path !== '/login') {
    //   redirect('/login')
    // }
  }
}
