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
    title: 'Host Project KONGOR',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Learn how to self-host Project KONGOR on your local network server, behind
        a public VPS for enhanced security, privacy, and cost-efficiency.
      </>
    ),
    link: '/docs/infrastructure/self-hosting-behind-vps/steps-and-configuration',
  },
  {
    title: 'Featured Article #2',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Occaecati cupiditate non provident similique sunt in culpa qui officia
        deserunt mollitia animi id est laborum et dolorum fuga.
      </>
    ),
    link: '/docs/infrastructure/self-hosting-behind-vps/steps-and-configuration',
  },
  {
    title: 'Featured Article #3',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit
        laboriosam nisi ut aliquid ex ea commodi.
      </>
    ),
    link: '/docs/infrastructure/self-hosting-behind-vps/steps-and-configuration',
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
        <div className="text--center margin-bottom--lg">
          <Heading as="h2">Featured Articles</Heading>
        </div>
        <div className="row row--align-center">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
