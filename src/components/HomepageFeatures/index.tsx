import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
  link: string;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'How To Host Project KONGOR',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        See how Project KONGOR runs on a private home lab behind a public VPS,
        keeping the home network hidden while staying secure and cheap.
      </>
    ),
    link: '/docs/infrastructure/self-hosting-behind-vps/hosting-model',
  },
  {
    title: 'Game Client Launcher Guide',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Get started with WILLOWMAKER, which keeps your game client up to date
        and connects it to the Project KONGOR services.
      </>
    ),
    link: '/docs/utilities/willowmaker',
  },
  {
    title: 'Match Server Launcher Guide',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Host match servers with COMPEL, which keeps the match server distribution
        up to date, and runs and supervises your match servers.
      </>
    ),
    link: '/docs/utilities/compel',
  },
];

function Feature({ title, Svg, description, link }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.featureLink}>
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row row--align-center">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
