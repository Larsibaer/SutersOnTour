import { initIdentity } from "./src/utils/auth"

export const onInitialClientRender = () => {
  initIdentity()
}
