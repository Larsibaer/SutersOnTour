import React from "react"
import { Link, navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const AdventCalendar = ({ role, messages }) => {
  const now = new Date()

  return (
    <div
      className="calendar">
      <StaticImage
        src="../../static/img/calendar-bg.webp"
        alt="Advent Calendar"
        className="background"
        layout="fullWidth"
        placeholder="blurred"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
          objectFit: "cover",
          boxSizing: "border-box",
        }}
        imgStyle={{
          objectFit: "cover",
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
        }}
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          zIndex: 1,
          boxSizing: "border-box",
          paddingRight: "env(safe-area-inset-right, 0px)",
        }}
      >
        {messages.map(({ fields, frontmatter }) => {
          const { slug } = fields
          const { title, week, date, opened } = frontmatter
          const unlockDate = new Date(date)
          const isEditor = role === "editor"
          const canOpen = isEditor && !opened && now >= unlockDate
          const visible = role === "admin" || opened || canOpen
          let doorClass = "door"
          if (canOpen) {
            doorClass += " ready"
          } else if (!visible) {
            doorClass += " locked"
          } else {
            doorClass += " open"
          }

          if (canOpen) {
            return (
              <div
                key={slug}
                className={doorClass}
                style={generateRandomStyle()}
                onClick={async () => {
                  try {
                    await fetch("/.netlify/functions/openDoor", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ week }),
                    })
                    navigate(slug)
                  } catch {
                    alert("Failed to open door")
                  }
                }}
              >
                {week}
              </div>
            )
          }

          if (visible) {
            return (
              <Link key={slug} to={slug} className={doorClass} style={generateRandomStyle()}>
                {week}
              </Link>
            )
          }

          return (
            <div key={slug} className={doorClass} style={generateRandomStyle()}>
              {week}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const placedDoors = []

function generateRandomStyle() {
  let attempts = 0
  while (attempts < 100) {
    const width = Math.random() * 8 + 5 // in vw
    const height = Math.random() * 8 + 5 // in vh
    const top = Math.random() * (100 - height)
    const left = Math.random() * (100 - width)

    const overlaps = placedDoors.some((door) => {
      return !(
        top + height < door.top ||
        top > door.top + door.height ||
        left + width < door.left ||
        left > door.left + door.width
      )
    })

    if (!overlaps) {
      placedDoors.push({ top, left, width, height })
      return {
        position: "absolute",
        top: `${top}%`,
        left: `${left}%`,
        width: `${width}vw`,
        height: `${height}vh`,
      }
    }

    attempts++
  }

  return {
    position: "absolute",
    top: `${Math.random() * 90}%`,
    left: `${Math.random() * 90}%`,
    width: `8vw`,
    height: `8vh`,
  }
}

export default AdventCalendar
