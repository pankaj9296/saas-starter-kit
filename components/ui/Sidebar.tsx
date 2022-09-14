import NextLink from "next/link";
import { useRouter } from "next/router";
import classNames from "classnames";
import {
  HomeIcon,
  UserIcon,
  SupportIcon,
  DocumentSearchIcon,
  LogoutIcon,
  LockClosedIcon,
  UsersIcon,
  AdjustmentsIcon,
  CollectionIcon,
} from "@heroicons/react/solid";
import { signOut } from "next-auth/react";

import { Team } from "@prisma/client";

const NavItem = (props: Props) => {
  const router = useRouter();

  const { href, text, onClick } = props;
  const isActive = router.asPath === href;
  const Icon = props.icon;

  return (
    <NextLink href={href}>
      <a
        href={href}
        onClick={onClick}
        className={classNames(
          isActive ? "bg-gray-100" : "",
          "flex items-center rounded-lg p-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
        )}
      >
        <Icon className="h-5 w-5" />
        <span className="ml-3">{text}</span>
      </a>
    </NextLink>
  );
};

export default function Sidebar({ teams }: { teams: Team[] }) {
  return (
    <>
      <aside
        className="transition-width fixed top-0 left-0 z-20 flex h-full w-64 flex-shrink-0 flex-col pt-16 duration-75 lg:flex"
        aria-label="Sidebar"
      >
        <div className="relative flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white pt-0">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex-1 space-y-1 divide-y bg-white px-3">
              <ul className="space-y-2 pb-2">
                <li>
                  <form action="#" method="GET" className="lg:hidden">
                    <label htmlFor="mobile-search" className="sr-only">
                      Search
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <svg
                          className="h-5 w-5 text-gray-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        name="email"
                        id="mobile-search"
                        className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:ring-cyan-600"
                        placeholder="Search"
                      />
                    </div>
                  </form>
                </li>
                <li>
                  <NavItem
                    href={`/teams/${teams[0].slug}/dashboard`}
                    text="Dashboard"
                    icon={HomeIcon}
                  />
                </li>
                <li>
                  <NavItem
                    href={`/teams/${teams[0].slug}/settings`}
                    text="Settings"
                    icon={AdjustmentsIcon}
                  />
                </li>
                <li>
                  <NavItem
                    href={`/teams/${teams[0].slug}/authentication`}
                    text="Authentication"
                    icon={LockClosedIcon}
                  />
                </li>
                <li>
                  <NavItem
                    href={`/teams/${teams[0].slug}/members`}
                    text="Members"
                    icon={UsersIcon}
                  />
                </li>
                <li>
                  <NavItem href={`/teams`} text="Teams" icon={CollectionIcon} />
                </li>
              </ul>
              <div className="space-y-2 pt-2">
                <NavItem href="/account" text="Account" icon={UserIcon} />
                <NavItem
                  href="#"
                  text="Logout"
                  icon={LogoutIcon}
                  onClick={() => signOut()}
                />
                <NavItem href="/help" text="Help" icon={SupportIcon} />
                <NavItem href="/docs" text="Guides" icon={DocumentSearchIcon} />
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div
        className="fixed inset-0 z-10 hidden bg-gray-900 opacity-50"
        id="sidebarBackdrop"
      />
    </>
  );
}

interface Props {
  href: string;
  text: string;
  icon: any;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}
