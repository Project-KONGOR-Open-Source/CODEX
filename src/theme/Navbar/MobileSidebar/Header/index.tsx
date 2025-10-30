import React, {type ReactNode} from 'react';
import {useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import {translate} from '@docusaurus/Translate';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import IconClose from '@theme/Icon/Close';
import NavbarLogo from '@theme/Navbar/Logo';

function CloseButton() {
  const mobileSidebar = useNavbarMobileSidebar();
  return (
    <button
      type="button"
      aria-label={translate({
        id: 'theme.docs.sidebar.closeSidebarButtonAriaLabel',
        message: 'Close navigation bar',
        description: 'The ARIA label for close button of mobile sidebar',
      })}
      className="clean-btn navbar-sidebar__close"
      onClick={() => mobileSidebar.toggle()}>
      <IconClose color="var(--ifm-color-emphasis-600)" />
    </button>
  );
}

export default function NavbarMobileSidebarHeader(): ReactNode {
  return (
    <div className="navbar-sidebar__brand">
      <NavbarLogo />
      <a
        href="https://github.com/Project-KONGOR-Open-Source/CODEX"
        target="_blank"
        rel="noopener noreferrer"
        className="header-github-link margin-left--sm margin-right--md"
        aria-label="GitHub Repository"
      />
      <NavbarColorModeToggle className="margin-right--md" />
      <CloseButton />
    </div>
  );
}

// swizzled from: node_modules/@docusaurus/theme-classic/lib/theme/Navbar/MobileSidebar/Header/index.js
