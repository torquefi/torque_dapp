import type { FC } from 'react';
import { NextSeo } from 'next-seo';

export interface LinkTag {
    rel: string;
    href: string;
    sizes?: string;
    media?: string;
    type?: string;
    color?: string;
    keyOverride?: string;
    as?: string;
    crossOrigin?: string;
}

type AppSeoProps = {
    title?: string;
    metaDescription?: string;
    socialImageUrl?: string;
    faviconImageUrl?: string;
    additionalLinkTags?: LinkTag[];
    canonical?: string;
    isDefaultPreview?: boolean;
};

const AppSeo: FC<AppSeoProps> = ({
    title,
    metaDescription,
    socialImageUrl,
    faviconImageUrl,
    additionalLinkTags,
    canonical,
    isDefaultPreview = false,
}) => {
    const defaultPreviewImage =
        'https://uploads-ssl.webflow.com/6556f6be06fc2abb8a8da998/65f7c8b013bde20c05c81a06_torque-finance.png';
    const defaultTitle = 'Torque';
    const defaultMetaDescription = 'Torque is a crypto wealth management platform that aggregates yield and loans from leading blockchain protocols while enabling one-click borrowing through non-custodial PBLOCs (portfolio-backed lines of credit). Torque utilizes smart contract automation to enable self-driving money. Our Vaults-as-a-Service model helps investors, institutions, and DAOs earn passive income and access crypto loans while retaining full custody.';

    return (
        <NextSeo
            title={title || defaultTitle}
            description={metaDescription || defaultMetaDescription}
            twitter={{
                cardType: 'summary_large_image',
            }}
            openGraph={{
                title,
                description: metaDescription || defaultMetaDescription,
                images: [
                    {
                        url:
                            !isDefaultPreview && socialImageUrl
                                ? socialImageUrl
                                : defaultPreviewImage,
                        alt: title,
                        width: 878,
                        height: 413,
                        type: 'image/png',
                    },
                ],
            }}
            additionalLinkTags={[
                {
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: faviconImageUrl || '/favicon.png',
                },
                ...(additionalLinkTags && additionalLinkTags?.length > 0 ? additionalLinkTags : []),
            ]}
            additionalMetaTags={[
                {
                    name: 'keywords',
                    content: '',
                },
                {
                    name: 'author',
                    content: '',
                },
            ]}
        />
    );
};

export default AppSeo;
