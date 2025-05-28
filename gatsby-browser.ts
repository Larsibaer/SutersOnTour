import netlifyIdentity from "netlify-identity-widget"

export const onInitialClientRender = () => {
  netlifyIdentity.init()
}
