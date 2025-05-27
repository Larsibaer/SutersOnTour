import { initIdentityWithRedirect } from "./src/utils/auth"

export const onInitialClientRender = () => {
  initIdentityWithRedirect()
}
