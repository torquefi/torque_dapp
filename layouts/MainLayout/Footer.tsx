import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="flex justify-between px-4 py-4 text-[#959595] sm:px-8">
      <div className="cursor-pointer text-[10px] transition-colors duration-100 ease-linear hover:text-white hover:underline xs:text-[10px]">
        © 2023 TORQUE INC.
      </div>
      <div className="flex space-x-2 text-[10px] xs:text-[10px]">
        {socials.map((item, i) => (
          <Link
            href={item.link}
            key={i}
            className="block transition-colors duration-100 ease-linear hover:text-white hover:underline"
            target="_blank"
          >
            {item.label}
          </Link>
        ))}
        {privacies.map((item, i) => (
          <Link
            href={item.link}
            key={i}
            className="hidden transition-colors duration-100 ease-linear hover:text-white hover:underline xs:block"
            target="_blank"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </footer>
  )
}

const socials = [
  {
    label: 'BLOG',
    link: 'https://medium.com/@torquefi',
  },
  {
    label: 'TELEGRAM',
    link: 'https://t.me/torquefi',
  },
  {
    label: 'TWITTER',
    link: 'https://twitter.com/torquefi',
  },
]

const privacies = [
  {
    label: 'BOUNTY',
    link: '#',
  },
  {
    label: 'AUDITS',
    link: '#',
  },
]
