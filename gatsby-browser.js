import "./src/style/main.sass";

export const onClientEntry = () => {
  if (!document.getElementById("netlify-identity-widget")) {
    const script = document.createElement("script")
    script.src = "https://identity.netlify.com/v1/netlify-identity-widget.js"
    script.id = "netlify-identity-widget"
    script.async = true
    document.body.appendChild(script)
  }
}
