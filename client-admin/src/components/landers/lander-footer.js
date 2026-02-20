import emoji from 'react-easy-emoji'

const Footer = () => {
  return (
    <div className="mt-3 mt-xl-4">
      <h3 className="mb-2 mb-xl-3" style={{ fontSize: '24px', lineHeight: 1.5 }}>
        Legal
      </h3>
      <div className="mb-2 mb-xl-3" style={{ maxWidth: '30em' }}>
        Polis is built for the public with {emoji('❤️')} in Seattle {emoji('🇺🇸')}, with
        contributions from around the {emoji('🌍🌏🌎')}
      </div>
      <div className="mb-2 mb-xl-3">
        © {new Date().getFullYear()} The Authors <a href="tos">TOS</a>{' '}
        <a href="privacy">Privacy</a>{' '}
        <a href="https://github.com/siesto-rivera/polis" target="_blank" rel="noreferrer">Source Code (AGPL)</a>
      </div>
      <div id="polis-donate">
        <i>
          Polis is powered by support from people like you. Contribute{' '}
          <a target="_blank" href="/donate" rel="noreferrer">
            here
          </a>
          .
        </i>
      </div>
    </div>
  )
}

export default Footer
