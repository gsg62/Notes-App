import { useEffect, useState } from "react"

// simple transition function used for rendering bootstrap transition element
const useTransition = () => {
  const [transitionIn, setTransitionIn] = useState(false)

  const timeout = 600

  useEffect(() => {
    setTransitionIn(true)
  }, [])

  return { transitionIn, timeout }
}

export default useTransition
