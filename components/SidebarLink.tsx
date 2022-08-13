import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

interface SidebarLinkProps {
  name: string;
  icon: ReactElement;
  margin?: boolean;
  id?: string;
  isProject?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  name,
  icon,
  margin,
  id,
  isProject,
}: any) => {
  const router = useRouter();

  return (
    <Link href={`/${isProject ? `project/${id}` : name.toLowerCase()}`}>
      <a
        className={`flex items-center ${
          margin ? 'mb-6' : 'mb-2'
        } py-2 px-3 rounded-lg transition whitespace-nowrap overflow-hidden  duration-300 ${
          router.query.id === id && isProject
            ? 'bg-gray-300 dark:bg-gray-600'
            : ''
        } hover:bg-gray-300 dark:hover:bg-gray-600`}
      >
        <li className="flex items-center overflow-hidden overflow-ellipsis w-11/12">
          <span className="mr-4">{icon}</span>
          {name}
        </li>
      </a>
    </Link>
  );
};

export default SidebarLink;
