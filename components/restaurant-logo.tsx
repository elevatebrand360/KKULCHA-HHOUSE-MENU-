import type { SVGProps } from "react"

export default function RestaurantLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="45" fill="#8B4513" />
      <circle cx="50" cy="50" r="40" fill="#D4AF37" />
      <path d="M30 35H70M30 50H70M30 65H70" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
      <path d="M25 25L75 75M75 25L25 75" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
      <path d="M50 20V80" stroke="#8B4513" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.3" />
      <circle cx="50" cy="50" r="35" stroke="#8B4513" strokeWidth="2" strokeOpacity="0.5" />
    </svg>
  )
}
