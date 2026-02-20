import Layout from './lander-layout'
import PropTypes from 'prop-types'

const Placeholder = ({ text }) => (
  <div
    className="p-4 my-4 text-center"
    style={{ backgroundColor: '#f3f4f6', border: '1px dashed #f6f7f8' }}>
    <span style={{ fontWeight: 'bold', color: '#f6f7f8' }}>{text}</span>
  </div>
)

Placeholder.propTypes = {
  text: PropTypes.string.isRequired
}

const imgStyle = {
  maxWidth: '100%',
  height: 'auto',
  borderRadius: 4,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}

const Home2 = () => {
  return (
    <Layout>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 12px' }}>
        {/* Introduction */}
        <h1 className="my-4" style={{ fontSize: '32px' }}>
          Polis is an open-source platform that helps entire cities, states, or even countries find
          common ground on complex issues.
        </h1>
        <p className="mb-4" style={{ fontSize: '20px', lineHeight: 1.5 }}>
          First launched in 2012, it&apos;s been stress tested in tens of thousands of conversations
          with more than ten million participants worldwide. By collecting and analyzing viewpoints
          from thousands of participants, Polis reveals points of consensus, even on topics that
          seem deadlocked.
        </p>

        <p className="mb-3">
          Polis has become part of the national democratic infrastructure in Taiwan, the UK, and
          Finland. Taiwan has used it to craft legislation on issues ranging from Uber regulation to
          revenge porn and online liquor sales; the UK has employed it for national security
          consultations; and Finland&apos;s wellbeing services counties — regional bodies
          responsible for health and social services — use Polis to design programs like support for
          elderly safety and mental health services for children, based on what citizens say they
          need. Governments in Singapore and the Philippines have also adopted the platform, while
          in Austria, the Klimarat (the National Citizens&rsquo; Assembly on Climate) used Polis to
          bring together thousands of citizens and experts to develop climate proposals.
        </p>
        <p className="mb-3">
          At the local level, Amsterdam, Bowling Green, Kentucky, and multiple UK cities have used
          Polis to improve residents&apos; lives. The United Nations Development Programme (UNDP)
          deployed it for what it called &quot;the largest online deliberative exercises in
          history,&quot; engaging 30,000 youth across Bhutan, East Timor, and Pakistan.
        </p>
        <p className="mb-4">
          Polis is designed, engineered, and maintained by The Computational Democracy Project
          (CompDem), a U.S.-based 501(c)(3). The tool has been featured in MIT Technology Review,
          Wired, The Economist, and The New York Times, and in BBC and PBS documentaries.
        </p>

        <div className="mb-5">
          <a href="https://compdemocracy.org/Case-studies" target="_blank" rel="noreferrer">
            Polis case studies from around the world
          </a>
        </div>

        {/* Polis 2.0 */}
        <h2 className="mb-3" style={{ fontSize: '32px' }}>
          Polis 2.0
        </h2>
        <p className="mb-3">
          CompDem is now introducing Polis 2.0, an enhanced version of the original Polis 1.0
          platform. This upgraded system combines massive participation capacity — supporting
          millions of simultaneous participants — with automated mapping of hundreds of thousands of
          individual viewpoints, real-time LLM-generated summaries, and the ability to keep
          conversations open indefinitely.
        </p>
        <p className="mb-4">
          Polis 2.0 achieves this transformative scale through four key mechanisms:
        </p>
        <ul className="ps-4 mb-5">
          <li className="mb-2">
            <span>
              <strong>Scalable Cloud Infrastructure:</strong> Polis 2.0&rsquo;s robust,
              cloud-powered distributed system scales in real time to meet demand. While Polis
              1.0&rsquo;s largest deployment reached 33,547 participants (a conversation hosted by
              Germany&rsquo;s <em>Aufstehen</em> party), Polis 2.0&rsquo;s infrastructure can handle
              10–30x increases, supporting millions of simultaneous participants.
            </span>
          </li>
          <li className="mb-2">
            <span>
              <strong>Dynamic Opinion Mapping:</strong> Polis groups participants based on how
              similarly they vote and what statements they submit. Building on a foundation of
              simple but solid statistical algorithms from a decade ago, Polis 2.0 now employs more
              refined and nuanced approaches. These groupings update in real-time as the
              conversation evolves, maintaining clear analysis even across hundreds of thousands of
              statements and millions of votes.
            </span>
          </li>
          <li className="mb-2">
            <span>
              <strong>Semantic Topic Clustering:</strong> Polis 2.0 is the first to use the
              Embedding Vector Oriented Clustering (EVōC) library from the Tutte Institute for
              Mathematics and Computing to automatically organize conversations into evolving topic
              hierarchies — hundreds of topics and subtopics — drawn from both organizer-seeded
              comments and participant input. Participants can view all topic areas and select those
              of greatest interest before entering the discussion. This organic process lets
              participants collectively shape the agenda over time, with &quot;hot&quot; and
              &quot;cold&quot; areas of discussion naturally emerging, allowing Polis 2.0
              conversations to remain open indefinitely.
            </span>
          </li>
          <li className="mb-2">
            <span>
              <strong>End-to-End Automation:</strong> Earlier Polis conversations required intensive
              moderation of participant input and facilitator expertise to distill dense outputs
              into actionable reports — processes that demanded extensive training and practice.
              Polis 2.0 automates conversation seeding, moderation (including toxicity filtering),
              semantic clustering, and report generation. This removes the expert facilitator
              bottleneck while preserving the option for human oversight.
            </span>
          </li>
        </ul>

        {/* How Polis 2.0 works */}
        <h2 className="mb-4" style={{ fontSize: '32px' }}>
          How Polis 2.0 works
        </h2>

        {/* 1. Setting up */}
        <h3 className="mb-3" style={{ fontSize: '24px' }}>
          1. Setting up a Polis 2.0 conversation
        </h3>
        <p className="mb-3">
          Polis is "seeded" with a set of statements that participants can "agree," "disagree," or
          "pass" on.
        </p>
        <p className="mb-2">
          Polis 2.0 accepts multiple input types.{' '}
          <strong>The primary format is short statements (1-3 sentences)</strong>, optimized for
          mobile voting — most are generated directly by participants.
        </p>
        <p className="mb-2" style={{ fontWeight: 'bold' }}>
          Other input formats can be pre-processed using an LLM and entered via CSV:
        </p>
        <ul className="ps-4 mb-5">
          <li className="mb-1">
            <strong>Long narratives</strong> (chunked into votable statements)
          </li>
          <li className="mb-1">
            <strong>Workshop transcripts</strong> (face-to-face discussion outputs converted to
            votable statements)
          </li>
          <li className="mb-1">
            <strong>Social media posts</strong> (text from Facebook, Instagram, YouTube, etc.,
            processed and de-duplicated)
          </li>
          <li className="mb-1">
            <strong>Online media comments</strong> (compiled and filtered)
          </li>
          <li className="mb-1">
            <strong>Email submissions</strong> (text-based input from non-digital participants)
          </li>
          <li className="mb-1">
            <strong>Voice recordings</strong> (transcribed and processed into text)
          </li>
        </ul>

        {/* 2. Inviting Participants */}
        <h3 className="mb-3" style={{ fontSize: '24px' }}>
          2. Inviting Participants
        </h3>
        <p className="mb-2">
          Polis 2.0 includes multiple systems for managing participant identity and growth:
        </p>
        <ul className="ps-4 mb-5">
          <li className="mb-2">
            <strong>Invite Trees:</strong> A structured invitation system tracks how participants
            join conversations, enabling organic growth through networks while maintaining quality.
            This snowball sampling approach allows organizers to understand how conversations spread
            and optimize for meaningful participation over viral reach.
          </li>
          <li className="mb-2">
            <strong>Identity Management:</strong> Advanced XID (external identifier) whitelist and
            download capabilities, plus OIDC authentication providers, ensure secure and flexible
            participant access.
          </li>
          <li className="mb-2">
            <strong>Data Portability:</strong> Complete data portability with XID support enables
            cross-platform participant tracking and analysis, compatible with popular polling and
            survey platforms such as SurveyMonkey, Qualtrics, Typeform, and Google Forms.
          </li>
        </ul>

        {/* 3. Participating */}
        <h3 className="mb-3" style={{ fontSize: '24px' }}>
          3. Participating on Polis 2.0
        </h3>
        <p className="mb-2">
          On Polis 2.0 participants can:
        </p>
        <ul className="ps-4 mb-3">
          <li className="mb-1">
            <strong>Select topics of interest</strong> — collectively setting the agenda for what
            everyone will vote on
          </li>
          <li className="mb-1">
            <strong>Vote on others' statements</strong> — agree, disagree, or pass (there&apos;s no
            reply function, by design)
          </li>
          <li className="mb-1">
            <strong>Submit statements about issues that matter to them</strong> — shaping
            conversation topics
          </li>
          <li className="mb-1">
            <strong>Mark which statements are especially important to them</strong> (optional)
          </li>
        </ul>

        <div className="my-4 text-center">
          <img
            src="/bg2050.png"
            alt="Bowling Green 2050 Conversation"
            style={imgStyle}
          />
        </div>

        <p className="mb-2">
          <strong>Multi-lingual capabilities:</strong> The system detects a participant's browser
          language and automatically translates the UI text and statements into their preferred
          language. Participants can submit statements in any language and view all statements both
          in the default language and in their chosen language.
        </p>

        <div className="my-4 text-center">
          <img
            src="/bg2050_fr.png"
            alt="Bowling Green 2050 Conversation in French"
            style={imgStyle}
          />
        </div>

        {/* 4. Moderating */}
        <h3 className="mb-3 mt-5" style={{ fontSize: '24px' }}>
          4. Moderating Polis 2.0
        </h3>
        <p className="mb-3">
          Polis conversations with tens of thousands of participant-entered statements require
          effective moderation. Polis 2.0 includes AI-assisted moderation features to support this:
        </p>
        <ul className="ps-4 mb-3">
          <li className="mb-1">
            <strong>Toxicity Detection:</strong> Real-time flagging of hate speech, harassment, and
            extremist content
          </li>
          <li className="mb-1">
            <strong>Language Processing:</strong> Automatic translation for multilingual
            participation
          </li>
        </ul>
        <p className="mb-2">
          Human Oversight (recommended):
        </p>
        <ul className="ps-4 mb-3">
          <li className="mb-1">
            <strong>Review:</strong> Human review of AI moderation decisions
          </li>
          <li className="mb-1">
            <strong>Cultural Sensitivity:</strong> Specialized review for marginalized or
            under-represented community contributions
          </li>
          <li className="mb-1">
            <strong>Expert Fact-checking:</strong> Specialists verify claims about technical details
          </li>
          <li className="mb-1">
            <strong>Company and Community Standards:</strong> Transparent moderation guidelines
            co-developed with participant input
          </li>
        </ul>
        <p className="mb-5">
          In addition, the statement routing system functions as a form of moderation by determining
          the optimal presentation of statements to each participant.
        </p>

        {/* 5. Analysis & Visualization */}
        <h3 className="mb-3" style={{ fontSize: '24px' }}>
          5. Real-time Analysis & Visualization
        </h3>
        <p className="mb-2" style={{ fontWeight: 'bold' }}>
          Polis 2.0 Outputs
        </p>

        <div className="mb-4">
          <p className="mb-2">
            <strong>Comprehensive Topic and Opinion Mapping:</strong> Polis 2.0 maps the
            conversation by identifying popular topics, subtopics and their interconnections, areas
            of consensus, and points of disagreement.
          </p>
          <iframe
            src="https://polis-delphi.s3.us-east-1.amazonaws.com/visualizations/r3dmevt8dkar2inf2hxei/cd1e07ee-4506-44e9-a91b-ca73054af163/layer_0_datamapplot.html"
            style={{
              width: '100%',
              height: '500px',
              border: 'none',
              borderRadius: 4,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            className="my-3"
            title="Interactive Topic Map"
          />
        </div>

        <div className="mb-4">
          <p className="mb-2">
            <strong>Consensus Statements:</strong> For each topic and subtopic, the platform
            generates collective statements that reflect agreement across all groups, supported by
            the underlying comments and votes. These statements represent authentic consensus rather
            than imposed compromise.
          </p>

          <div className="my-4 text-center">
            <img
              src="/collective.png"
              alt="Collective Statement Panel"
              style={imgStyle}
            />
          </div>

          <div className="my-4 text-center">
            <img
              src="/beeswarm.png"
              alt="Topic Stats Beeswarm View"
              style={imgStyle}
            />
          </div>
        </div>

        <div className="mb-4">
          <p className="mb-2">
            <strong>Automated Narrative Report Generation:</strong> Polis 2.0 generates automated
            narrative reports and can draw on multiple LLM models. Reports cover the entire
            conversation or focus on specific topics and subtopics. The platform employs statistical
            grounding, prompt engineering, and evaluations to ensure high-quality summaries, with
            each clause in the report including citations for easy human verification.
          </p>
        </div>

        <div className="mb-5">
          <p className="mb-2">
            <strong>Data Repository:</strong> All data remains accessible for ongoing reference and
            further analysis
          </p>
          <div className="my-4 text-center">
            <img
              src="/export_links.png"
              alt="Data Export Links"
              style={imgStyle}
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home2
