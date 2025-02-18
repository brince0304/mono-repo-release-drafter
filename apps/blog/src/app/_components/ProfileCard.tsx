'use client';

import { GithubIcon, Mail } from 'lucide-react';
import { LinkedInLogoIcon } from '@radix-ui/react-icons';
import { Typography } from '@repo/ui/components/ui/typography';
import { GITHUB_URL, LINKEDIN_URL, EMAIL_URL, BLOG_OWNER } from '@repo/ui/libs/constants';
import BrinceImage from '@/assets/images/brince-main-image.webp';
import Image from 'next/image';

const ProfileCard = () => {
  return (
    <div className="w-full rounded-xl p-6 border border-border relative overflow-hidden h-48">
      <Image
        src={BrinceImage}
        alt="Profile background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 flex flex-col justify-end h-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col flex-1 gap-2">
            <div>
              <Typography variant="h3" className="text-2xl font-bold flex items-center gap-2 text-white">
                <span className="text-primary">💻</span>
                {BLOG_OWNER}
              </Typography>
            </div>

            <div className="flex gap-4">
              <a
                href={GITHUB_URL}
                className="text-gray-200 hover:text-primary transition-colors"
              >
                <GithubIcon className="w-5 h-5" />
              </a>
              <a
                href={LINKEDIN_URL}
                className="text-gray-200 hover:text-primary transition-colors"
              >
                <LinkedInLogoIcon className="w-5 h-5" />
              </a>
              <a
                href={EMAIL_URL}
                className="text-gray-200 hover:text-primary transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProfileCard };
