import Layout from './lander-layout'
import ExploreKnowledgeBase from './ExploreKnowledgeBase'
import Press from './Press'

const Index = () => {
  return (
    <Layout>
      <>
        <h1 className="my-4 my-xl-5" style={{ fontSize: '48px' }}>
          Input Crowd, Output Meaning
        </h1>
        <h3
          className="mb-4 mb-xl-5"
          style={{ fontSize: '20px', lineHeight: 1.5 }}>
          Polis is a real-time system for gathering, analyzing and understanding what large groups
          of people think in their own words, enabled by advanced statistics and machine learning.
        </h3>
        <div className="mb-4 mb-xl-5">
          <span>
            Polis has been used all over the world by governments, academics, independent media and
            citizens, and is completely open source.
          </span>
        </div>
        <h3 className="mb-2 mb-xl-3" style={{ fontSize: '24px', lineHeight: 1.5 }}>
          Get Started
        </h3>
        <div className="mb-4 mb-xl-5">
          <a href="/signin">Sign in</a>
        </div>
        <Press />
        <ExploreKnowledgeBase />
        <h3 className="my-2 my-xl-3" style={{ fontSize: '24px', lineHeight: 1.5 }}>
          Contribute
        </h3>
        <div className="mb-4 mb-xl-5">
          Explore the code and join the developer community{' '}
          <a target="_blank" href="https://github.com/compdemocracy/" rel="noreferrer">
            on Github
          </a>
        </div>
      </>
    </Layout>
  )
}

export default Index
