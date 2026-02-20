import KnowledgeBase from './KnowledgeBase'

const ExploreKnowledgeBase = () => {
  return (
    <div>
      <h3 className="my-2 my-xl-3" style={{ fontSize: '24px', lineHeight: 1.5 }}>
        Explore
      </h3>
      <div className="mb-4 mb-xl-5" style={{ maxWidth: '35em' }}>
        <div>
          Onboard with a{' '}
          <a target="_blank" href="https://compdemocracy.org/knowledge-base" rel="noreferrer">
            comprehensive knowledge base
          </a>{' '}
          including
        </div>
        <KnowledgeBase url="https://compdemocracy.org/Welcome" e="👋" txt="Welcome Guide" />
        <KnowledgeBase url="https://compdemocracy.org/Quickstart" e="🏎" txt="Quickstart" />
        <KnowledgeBase url="https://compdemocracy.org/Usage" e="🔩" txt="Usage Overview" />
        <KnowledgeBase url="https://compdemocracy.org/FAQ" e="📖" txt="FAQ" />
        <KnowledgeBase url="https://compdemocracy.org/Case-studies" e="⚗️" txt="Case Studies" />
        <KnowledgeBase url="https://compdemocracy.org/algorithms" e="👾" txt="Algorithms" />
        <KnowledgeBase
          url="https://compdemocracy.org/Moderation"
          e="👹"
          txt="Best Practices for Moderation"
        />
        <KnowledgeBase url="https://compdemocracy.org/Media-coverage" e="🗞" txt="Press" />
      </div>
    </div>
  )
}

export default ExploreKnowledgeBase
