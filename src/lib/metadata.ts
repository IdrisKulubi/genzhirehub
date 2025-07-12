import { Metadata } from "next";
import { ensureStartsWith } from "./utils";

const { TWITTER_CREATOR, TWITTER_SITE } = process.env;

const twitterCreator = TWITTER_CREATOR
  ? ensureStartsWith(TWITTER_CREATOR, "@")
  : "@genzhire";

const twitterSite = TWITTER_SITE
  ? ensureStartsWith(TWITTER_SITE, "https://")
  : "https://genzhirehub.com";

export function constructMetadata({
  title = "GenZHireHub – Empowering Undergraduate Students to Get Hired",
  description = "GenZHireHub connects Undergraduate students with top internship and job opportunities. Build your profile, get discovered, and kickstart your career.",
  image = "https://genzhirehub.com/og-image.png",
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: "https://genzhirehub.com",
      siteName: "GenZHire",
      images: [
        {
          url: image,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      creator: twitterCreator,
      site: twitterSite,
      title,
      description,
      images: [image],
    },
    icons,
    metadataBase: new URL("https://genzhirehub.com/"),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
