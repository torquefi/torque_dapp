import type { FC } from "react"
import { NextSeo } from "next-seo"

const DEFAULT_TITLE = "Torque"
const DEFAULT_DESCRIPTION =
  "Torque is an onchain aggregator specialized in non-custodial liquidity solutions. It unifies opportunities to satisfy the key components of wealth generation while reducing friction, increasing transparency, and guaranteeing self-custody."
const DEFAULT_IMAGE = "https://uploads-ssl.webflow.com/6556f6be06fc2abb8a8da998/668e0c1fe2e01cba33b85485_torque.png"
const DEFAULT_FAVICON = "/favicon.png"

export interface LinkTag {
  rel: string
  href: string
  sizes?: string
  media?: string
  type?: string
  color?: string
  keyOverride?: string
  as?: string
  crossOrigin?: string
}

interface AppSeoProps {
  title?: string
  metaDescription?: string
  socialImageUrl?: string
  faviconImageUrl?: string
  additionalLinkTags?: LinkTag[]
  canonical?: string
  isDefaultPreview?: boolean
}

const AppSeo: FC<AppSeoProps> = ({
  title,
  metaDescription,
  socialImageUrl,
  faviconImageUrl,
  additionalLinkTags = [],
  canonical,
  isDefaultPreview = false,
}) => {
  const imageUrl = isDefaultPreview || !socialImageUrl ? DEFAULT_IMAGE : socialImageUrl

  return (
    <NextSeo
      title={title || DEFAULT_TITLE}
      description={metaDescription || DEFAULT_DESCRIPTION}
      canonical={canonical}
      twitter={{
        cardType: "summary_large_image",
      }}
      openGraph={{
        title: title || DEFAULT_TITLE,
        description: metaDescription || DEFAULT_DESCRIPTION,
        images: [
          {
            url: imageUrl,
            alt: title || DEFAULT_TITLE,
            width: 878,
            height: 413,
            type: "image/png",
          },
        ],
      }}
      additionalLinkTags={[
        {
          rel: "icon",
          type: "image/x-icon",
          href: faviconImageUrl || DEFAULT_FAVICON,
        },
        ...additionalLinkTags,
      ]}
      additionalMetaTags={[
        {
          name: "keywords",
          content: "torque, liquidity, blockchain, crypto, defi",
        },
        {
          name: "author",
          content: "Torque",
        },
      ]}
    />
  )
}

export default AppSeo
