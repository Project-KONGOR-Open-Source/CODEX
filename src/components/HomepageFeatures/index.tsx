import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Lorem Ipsum Dolor',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
        doloremque laudantium totam rem aperiam.
      </>
    ),
  },
  {
    title: 'Consectetur Adipiscing',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit,
        sed quia consequuntur magni dolores eos qui ratione.
      </>
    ),
  },
  {
    title: 'Tempor Incididunt',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit
        laboriosam nisi ut aliquid ex ea commodi.
      </>
    ),
  },
  {
    title: 'Magna Aliqua',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam
        nihil molestiae consequatur vel illum qui dolorem.
      </>
    ),
  },
  {
    title: 'Eiusmod Labore',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
        praesentium voluptatum deleniti atque corrupti.
      </>
    ),
  },
  {
    title: 'Fugiat Nulla',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        Et harum quidem rerum facilis est et expedita distinctio nam libero tempore
        cum soluta nobis est eligendi optio cumque.
      </>
    ),
  }
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
