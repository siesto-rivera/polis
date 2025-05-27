import React, { useEffect, useState } from "react";
import net from "../../util/net";
import CommentList from "../lists/commentList.jsx";

const TopicReport = ({ report_id }) => {
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topicContent, setTopicContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);

  useEffect(() => {
    if (!report_id) return;

    // Fetch topics from Delphi
    setLoading(true);
    net
      .polisGet("/api/v3/delphi", {
        report_id: report_id,
      })
      .then((response) => {
        console.log("Delphi topics response:", response);

        if (response && response.status === "success") {
          if (response.runs && Object.keys(response.runs).length > 0) {
            // Extract topics from the most recent run
            const latestRun = Object.values(response.runs).reduce((latest, run) => {
              return !latest || new Date(run.created_at) > new Date(latest.created_at) ? run : latest;
            }, null);

            console.log("Latest run structure:", latestRun);
            
            // Check different possible structures for topics
            let topicsData = null;
            
            // Try different paths to find topics
            if (latestRun.topics_by_layer) {
              // Topics are organized by layer, then by cluster id
              const allTopics = [];
              Object.entries(latestRun.topics_by_layer).forEach(([layer, clusters]) => {
                if (clusters && typeof clusters === 'object') {
                  Object.entries(clusters).forEach(([clusterId, topic]) => {
                    // Create the topic key in format layer_cluster (e.g., "0_1")
                    const topicKey = `${layer}_${clusterId}`;
                    // Use the topic_key from the data which should be in format "layer0_0"
                    const dbTopicKey = topic.topic_key || `layer${layer}_${clusterId}`;
                    console.log(`Topic ${topicKey}:`, topic); // Debug log to see structure
                    allTopics.push({
                      key: dbTopicKey, // Use the actual topic_key from DB
                      displayKey: topicKey, // For display purposes
                      name: topic.topic_name || topicKey, // Access the topic_name property
                      sortKey: parseInt(layer) * 1000 + parseInt(clusterId) // Sort by layer first, then cluster
                    });
                  });
                }
              });
              topicsData = allTopics;
            } else if (latestRun.topics && latestRun.topics.topics) {
              // Original structure
              topicsData = Object.entries(latestRun.topics.topics)
                .map(([key, topic]) => ({
                  key,
                  name: topic.name || key,
                  sortKey: parseInt(key.split('_')[1]) || 0
                }));
            } else if (latestRun.topics) {
              // Maybe topics is directly an object
              topicsData = Object.entries(latestRun.topics)
                .map(([key, topic]) => ({
                  key,
                  name: topic.name || topic.topic || key,
                  sortKey: parseInt(key.split('_')[1]) || 0
                }));
            }
            
            if (topicsData && topicsData.length > 0) {
              // Sort topics by their numeric part
              const sortedTopics = topicsData.sort((a, b) => a.sortKey - b.sortKey);
              console.log("Found topics:", sortedTopics);
              setTopics(sortedTopics);
            } else {
              console.log("No topics found in the expected structure");
            }
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topics:", error);
        setLoading(false);
      });
  }, [report_id]);

  const handleTopicChange = (event) => {
    const topicKey = event.target.value;
    setSelectedTopic(topicKey);
    
    if (!topicKey) {
      setTopicContent(null);
      return;
    }

    // Fetch the specific topic report
    setContentLoading(true);
    net
      .polisGet("/api/v3/delphi/reports", {
        report_id: report_id,
        section: topicKey  // The topic key IS the section (e.g., "layer0_8")
      })
      .then((response) => {
        console.log("Topic report response:", response);
        
        if (response && response.status === "success" && response.reports) {
          // The response contains reports object with the section as key
          const sectionData = response.reports[topicKey];
          if (sectionData && sectionData.report_data) {
            // Parse the report_data if it's a string
            const reportData = typeof sectionData.report_data === 'string' 
              ? JSON.parse(sectionData.report_data) 
              : sectionData.report_data;
            setTopicContent(reportData);
          } else {
            setTopicContent({
              error: true,
              message: "No report data found for this topic"
            });
          }
        } else if (response && response.status === "error") {
          setTopicContent({
            error: true,
            message: response.message || "No narrative report available for this topic"
          });
        }
        setContentLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching topic report:", error);
        setContentLoading(false);
      });
  };

  const renderContent = () => {
    if (!topicContent) return null;

    // Handle error state
    if (topicContent.error) {
      return (
        <div className="topic-content">
          <p style={{ color: '#666', fontStyle: 'italic' }}>{topicContent.message}</p>
          <p style={{ color: '#666', fontSize: '14px', marginTop: '10px' }}>
            To generate narrative reports, use the "Generate Narrative Report" button in the Comments Report page.
          </p>
        </div>
      );
    }

    // Render the topic content in the same format as the main report
    return (
      <div className="topic-content">
        {topicContent.paragraphs && topicContent.paragraphs.map((paragraph, idx) => (
          <div key={idx} className="paragraph">
            <h3>{paragraph.title}</h3>
            {paragraph.sentences && paragraph.sentences.map((sentence, sIdx) => (
              <p key={sIdx}>
                {sentence.clauses && sentence.clauses.map((clause, cIdx) => (
                  <span key={cIdx}>
                    {clause.text}
                    {clause.citations && clause.citations.length > 0 && (
                      <sup className="citations">
                        {clause.citations.join(', ')}
                      </sup>
                    )}
                    {cIdx < sentence.clauses.length - 1 && ' '}
                  </span>
                ))}
              </p>
            ))}
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="loading">Loading topics...</div>;
  }

  return (
    <div className="topic-report-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <style>{`
        .topic-report-container {
          max-width: 800px;
          margin: 0 auto;
        }
        .topic-selector {
          margin-bottom: 30px;
        }
        .topic-selector select {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background-color: white;
        }
        .topic-content {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          line-height: 1.6;
        }
        .topic-content h3 {
          color: #333;
          margin-top: 20px;
          margin-bottom: 10px;
        }
        .topic-content h3:first-child {
          margin-top: 0;
        }
        .topic-content p {
          margin-bottom: 15px;
          color: #555;
        }
        .citations {
          color: #0066cc;
          font-size: 0.85em;
          margin-left: 2px;
        }
        .loading {
          text-align: center;
          padding: 20px;
          color: #666;
        }
      `}</style>
      
      <div className="topic-selector">
        <select 
          value={selectedTopic} 
          onChange={handleTopicChange}
          disabled={contentLoading}
        >
          <option value="">Select a topic...</option>
          {topics.map(topic => (
            <option key={topic.key} value={topic.key}>
              {topic.name}
            </option>
          ))}
        </select>
      </div>

      {contentLoading && (
        <div className="loading">Loading topic report...</div>
      )}

      {!contentLoading && renderContent()}
    </div>
  );
};

export default TopicReport;